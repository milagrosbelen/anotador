import { useRef, useState } from "react";
import { Linking, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import * as ImagePicker from "expo-image-picker";

import { usePreventRemove } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerFaltante, subirFoto } from "../api/fotos";
import { FaltanteApi } from "../hooks/useFaltantes";
import { getImagenUri, useConfigStore } from "../store/useConfigStore";

import { RootStackParamList } from "../types";
import { getFaltanteById } from "../data/faltantes";
import { UbicacionLocal } from "../components/UbicacionLocal";
import { useFotoStore } from "../store/useFotoStore";
import { mostrarAviso } from "../ui/avisos";

type Props = NativeStackScreenProps<RootStackParamList, "Detalle">;

export function FaltanteDetalleScreen({ route, navigation }: Props) {
  const id = route.params.id;
  const apiUrl = useConfigStore((state) => state.apiUrl);
  const queryClient = useQueryClient();
  const detalle = useQuery({
    queryKey: ["faltante", apiUrl, id],
    queryFn: () => obtenerFaltante(apiUrl, id),
    retry: false,
  });
  const faltante = detalle.data;
  const datosLocales = getFaltanteById(id);
  const fotoGuardada = useFotoStore((state) => state.fotos[id]);
  const fotoPendiente = useFotoStore((state) => state.pendientes[id]);
  const { setFoto, setPendiente, descartarPendiente, quitarFotoLocal } = useFotoStore();
  const [eligiendo, setEligiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [actualizacionPendiente, setActualizacionPendiente] = useState(false);
  const operacion = useRef(false);
  const preguntando = useRef(false);

  usePreventRemove(Boolean(fotoPendiente) || guardando, ({ data }) => {
    if (operacion.current || preguntando.current) return;
    preguntando.current = true;
    void mostrarAviso({
      icono: "warning", titulo: "¿Salir sin guardar?",
      texto: "Si salís ahora, se vuelve a ver la foto anterior.",
      confirmar: "Salir", cancelar: "Seguir acá",
    }).then((salir) => {
      if (salir) {
        descartarPendiente(id);
        navigation.dispatch(data.action);
      }
    }).finally(() => { preguntando.current = false; });
  });

  async function elegirDeLaGaleria() {
    if (!faltante || eligiendo || operacion.current) return;

    setEligiendo(true);
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permiso.granted) {
        await avisarYAbrirAjustes();
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        base64: true,
      });

      const elegida = resultado.assets?.[0];
      if (resultado.canceled || !elegida) return;

      const uri = elegida.base64
        ? `data:${elegida.mimeType ?? "image/jpeg"};base64,${elegida.base64}`
        : elegida.uri;

      setPendiente(id, { origen: "galeria", uri, nombre: elegida.fileName ?? "galeria.jpg", tipo: elegida.mimeType ?? "image/jpeg" });
    } catch {
      await mostrarAviso({ icono: "error", titulo: "No se pudo abrir la galería", texto: "Volvé a intentar elegir una foto.", confirmar: "Entendido" });
    } finally {
      setEligiendo(false);
    }
  }

  async function actualizarFotoRemota() {
    const actualizado = await obtenerFaltante(apiUrl, id);
    queryClient.setQueryData(["faltante", apiUrl, id], actualizado);
    queryClient.setQueryData<FaltanteApi[]>(["faltantes", apiUrl], (lista) =>
      lista?.map((item) => item.id === id ? actualizado : item)
    );
    void queryClient.invalidateQueries({ queryKey: ["faltantes", apiUrl] });
    setActualizacionPendiente(false);
  }

  async function reintentarActualizacion() {
    if (operacion.current) return;
    operacion.current = true;
    setGuardando(true);
    try {
      await actualizarFotoRemota();
    } catch {
      await mostrarAviso({ icono: "warning", titulo: "La foto ya está guardada", texto: "Todavía no se pudo actualizar la ficha. Revisá la conexión y reintentá.", confirmar: "Entendido" });
    } finally {
      operacion.current = false;
      setGuardando(false);
    }
  }

  async function guardarFoto() {
    if (!faltante || !fotoPendiente || operacion.current) return;
    operacion.current = true;
    setGuardando(true);
    try {
      if (fotoPendiente.origen === "galeria") {
        if (!setFoto(id, fotoPendiente.uri)) throw new Error("La foto es demasiado pesada para guardarla en este navegador.");
        descartarPendiente(id);
      } else {
        await subirFoto(apiUrl, id, fotoPendiente);
        // Desde este punto la subida terminó: los reintentos solo consultan la API.
        quitarFotoLocal(id);
        descartarPendiente(id);
        setActualizacionPendiente(true);
        try {
          await actualizarFotoRemota();
        } catch {
          await mostrarAviso({ icono: "warning", titulo: "Foto guardada en el servidor", texto: "No se pudo actualizar la ficha. Usá Actualizar foto para volver a consultar sin subirla otra vez.", confirmar: "Entendido" });
          return;
        }
      }
      await mostrarAviso({ icono: "success", titulo: "Foto guardada", texto: fotoPendiente.origen === "camara" ? "Quedó guardada en el servidor y en la ficha de este faltante." : "Quedó guardada localmente en la ficha de este faltante.", confirmar: "Listo" });
    } catch (error) {
      await mostrarAviso({ icono: "error", titulo: "No se pudo guardar", texto: error instanceof Error ? error.message : "Revisá la conexión y volvé a intentar.", confirmar: "Entendido" });
    } finally {
      operacion.current = false;
      setGuardando(false);
    }
  }

  if (!faltante) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F5" }} edges={["bottom"]}>
        <Contenedor>
          <Nombre>{detalle.isPending ? "Cargando faltante..." : detalle.error?.message ?? "No encontramos ese faltante."}</Nombre>
          {detalle.isError ? <BotonGaleria onPress={() => void detalle.refetch()}><BotonGaleriaTexto>Reintentar</BotonGaleriaTexto></BotonGaleria> : null}
        </Contenedor>
      </SafeAreaView>
    );
  }

  const estaPedido = faltante.estado === "Ya pedido";
  const fotoVisible = fotoPendiente?.uri ?? fotoGuardada ?? getImagenUri(apiUrl, faltante.imagenUrl);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F7F7F5" }}
      edges={["bottom"]}
    >
      <Scroll showsVerticalScrollIndicator={false}>
        <Imagen
          key={fotoVisible ?? "foto-del-producto"}
          source={fotoVisible ? { uri: fotoVisible } : datosLocales?.imagen ?? require("../../assets/icon.png")}
          resizeMode="cover"
        />

        <Contenedor>
          <FilaBotones>
            <BotonGaleria
              onPress={() => navigation.navigate("CamaraFaltante", { id })}
              disabled={eligiendo || guardando || actualizacionPendiente}
              accessibilityRole="button"
              accessibilityLabel="Sacar foto de la góndola"
            >
              <BotonGaleriaTexto>Sacar foto de la góndola</BotonGaleriaTexto>
            </BotonGaleria>
            <BotonGaleria
              onPress={elegirDeLaGaleria}
              disabled={eligiendo || guardando || actualizacionPendiente}
              accessibilityRole="button"
              accessibilityLabel="Elegir de la galería"
            >
              <BotonGaleriaTexto>
                {eligiendo ? "Abriendo galería..." : "Elegir de la galería"}
              </BotonGaleriaTexto>
            </BotonGaleria>

            <BotonGuardar
              onPress={guardarFoto}
              disabled={!fotoPendiente || guardando || eligiendo}
              $listo={Boolean(fotoPendiente) && !guardando && !eligiendo}
              accessibilityRole="button"
              accessibilityLabel="Guardar"
            >
              <BotonGuardarTexto>{guardando ? "Guardando..." : "Guardar"}</BotonGuardarTexto>
            </BotonGuardar>
          </FilaBotones>

          {actualizacionPendiente ? (
            <Seccion>
              <Valor>La foto está guardada en el servidor. Falta actualizar la imagen de la ficha.</Valor>
              <BotonGaleria disabled={guardando} onPress={reintentarActualizacion}>
                <BotonGaleriaTexto>{guardando ? "Actualizando..." : "Actualizar foto"}</BotonGaleriaTexto>
              </BotonGaleria>
            </Seccion>
          ) : null}

          <FilaEncabezado>
            <Nombre>{faltante.nombre}</Nombre>

            <Estado $estaPedido={estaPedido}>
              <EstadoTexto $estaPedido={estaPedido}>
                {faltante.estado}
              </EstadoTexto>
            </Estado>
          </FilaEncabezado>

          <Cantidad>
            Pedir {faltante.cantidad} {faltante.unidad}
          </Cantidad>

          <Seccion>
            <Etiqueta>Proveedor</Etiqueta>
            <Valor>{faltante.proveedor}</Valor>
          </Seccion>

          <Seccion>
            <Etiqueta>Dónde está</Etiqueta>
            {datosLocales?.ubicacion ? <Valor>{datosLocales.ubicacion}</Valor> : null}

            <UbicacionLocal />
          </Seccion>

          {datosLocales?.prioridad ? <Seccion>
            <Etiqueta>Prioridad</Etiqueta>
            <Valor>{datosLocales.prioridad}</Valor>
          </Seccion> : null}

          <Seccion>
            <Etiqueta>Nota del local</Etiqueta>
            <Valor>{faltante.nota || "Sin nota"}</Valor>
          </Seccion>
        </Contenedor>
      </Scroll>
    </SafeAreaView>
  );
}

async function avisarYAbrirAjustes() {
  const enTelefono = Platform.OS === "ios" || Platform.OS === "android";

  if (!enTelefono) {
    await mostrarAviso({
      icono: "warning",
      titulo: "Sin acceso a la galería",
      texto: "El navegador no dejó elegir fotos. Habilitalas en la configuración del sitio y volvé a intentar.",
      confirmar: "Entendido",
    });
    return;
  }

  const abrir = await mostrarAviso({
    icono: "warning",
    titulo: "Sin acceso a la galería",
    texto: "Para elegir una foto hay que permitir el acceso desde Ajustes.",
    confirmar: "Abrir Ajustes",
    cancelar: "Cancelar",
  });

  if (!abrir) return;

  try {
    await Linking.openSettings();
  } catch {
    await mostrarAviso({
      icono: "error",
      titulo: "No se pudo abrir Ajustes",
      texto: "Abrí los ajustes del teléfono y permití el acceso a las fotos de Anotador.",
      confirmar: "Entendido",
    });
  }
}

const Scroll = styled.ScrollView`
  flex: 1;
  background-color: #f7f7f5;
`;

const Imagen = styled.Image`
  width: 100%;
  height: 240px;
  background-color: #eeeeee;
`;

const Contenedor = styled.View`
  padding: 20px 16px 36px;
`;

const FilaBotones = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
`;

const BotonGaleria = styled.Pressable`
  background-color: #5e9b6a;
  border-radius: 14px;
  padding: 12px 16px;
`;

const BotonGaleriaTexto = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

const BotonGuardar = styled.Pressable<{ $listo: boolean }>`
  background-color: ${({ $listo }) => ($listo ? "#202426" : "#c5c8c6")};
  border-radius: 14px;
  padding: 12px 16px;
`;

const BotonGuardarTexto = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

const FilaEncabezado = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const Nombre = styled.Text`
  flex: 1;
  font-size: 28px;
  font-weight: 800;
  color: #202426;
`;

const Cantidad = styled.Text`
  font-size: 18px;
  color: #202426;
  margin-top: 10px;
  margin-bottom: 22px;
`;

const Seccion = styled.View`
  margin-bottom: 18px;
`;

const Etiqueta = styled.Text`
  font-size: 13px;
  color: #687078;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 4px;
`;

const Valor = styled.Text`
  font-size: 17px;
  color: #202426;
  line-height: 24px;
`;

const Estado = styled.View<{ $estaPedido: boolean }>`
  border-radius: 14px;
  padding: 9px 12px;
  background-color: ${({ $estaPedido }) =>
    $estaPedido ? "#D3F0D8" : "#FFE79A"};
`;

const EstadoTexto = styled.Text<{ $estaPedido: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $estaPedido }) => ($estaPedido ? "#34734A" : "#493B12")};
`;
