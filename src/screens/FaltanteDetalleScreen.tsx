import { useEffect, useRef, useState } from "react";
import { Linking, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import * as ImagePicker from "expo-image-picker";

import { RootStackParamList } from "../types";
import { getFaltanteById } from "../data/faltantes";
import { UbicacionLocal } from "../components/UbicacionLocal";
import { useFotoStore } from "../store/useFotoStore";
import { mostrarAviso } from "../ui/avisos";

type Props = NativeStackScreenProps<RootStackParamList, "Detalle">;

export function FaltanteDetalleScreen({ route, navigation }: Props) {
  const faltante = getFaltanteById(route.params.id);
  const fotoGuardada = useFotoStore((state) =>
    faltante ? state.fotos[faltante.id] : undefined
  );
  const setFoto = useFotoStore((state) => state.setFoto);
  const [fotoPendiente, setFotoPendiente] = useState<string | null>(null);
  const [eligiendo, setEligiendo] = useState(false);
  const fotoPendienteRef = useRef<string | null>(null);
  fotoPendienteRef.current = fotoPendiente;

  useEffect(() => {
    const permitirSalir = { listo: false };

    return navigation.addListener("beforeRemove", (event) => {
      if (permitirSalir.listo || !fotoPendienteRef.current) return;

      event.preventDefault();

      void (async () => {
        const salir = await mostrarAviso({
          icono: "warning",
          titulo: "¿Salir sin guardar?",
          texto: "Si salís ahora, se vuelve a ver la foto anterior.",
          confirmar: "Salir",
          cancelar: "Seguir acá",
        });

        if (!salir) return;

        permitirSalir.listo = true;
        navigation.dispatch(event.data.action);
      })();
    });
  }, [navigation]);

  async function elegirDeLaGaleria() {
    if (!faltante || eligiendo) return;

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

      setFotoPendiente(uri);
    } finally {
      setEligiendo(false);
    }
  }

  async function guardarFoto() {
    if (!faltante || !fotoPendiente) return;

    const pudoGuardar = setFoto(faltante.id, fotoPendiente);
    if (!pudoGuardar) {
      await mostrarAviso({
        icono: "error",
        titulo: "No se pudo guardar",
        texto: "La foto es demasiado pesada para guardarla en este navegador.",
        confirmar: "Entendido",
      });
      return;
    }

    fotoPendienteRef.current = null;
    setFotoPendiente(null);
    await mostrarAviso({
      icono: "success",
      titulo: "Foto guardada",
      texto: "Quedó en la ficha de este faltante. Si salís, se sigue viendo.",
      confirmar: "Listo",
    });
  }

  if (!faltante) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F5" }}>
        <Contenedor>
          <Nombre>No encontramos ese faltante.</Nombre>
        </Contenedor>
      </SafeAreaView>
    );
  }

  const estaPedido = faltante.estado === "Ya pedido";
  const fotoVisible = fotoPendiente ?? fotoGuardada;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F7F7F5" }}
      edges={["bottom"]}
    >
      <Scroll showsVerticalScrollIndicator={false}>
        <Imagen
          key={fotoVisible ?? "foto-del-producto"}
          source={fotoVisible ? { uri: fotoVisible } : faltante.imagen}
          resizeMode="cover"
        />

        <Contenedor>
          <FilaBotones>
            <BotonGaleria
              onPress={elegirDeLaGaleria}
              disabled={eligiendo}
              accessibilityRole="button"
              accessibilityLabel="Elegir de la galería"
            >
              <BotonGaleriaTexto>
                {eligiendo ? "Abriendo galería..." : "Elegir de la galería"}
              </BotonGaleriaTexto>
            </BotonGaleria>

            <BotonGuardar
              onPress={guardarFoto}
              disabled={!fotoPendiente}
              $listo={Boolean(fotoPendiente)}
              accessibilityRole="button"
              accessibilityLabel="Guardar"
            >
              <BotonGuardarTexto>Guardar</BotonGuardarTexto>
            </BotonGuardar>
          </FilaBotones>

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
            <Valor>{faltante.ubicacion}</Valor>

            <UbicacionLocal />
          </Seccion>

          <Seccion>
            <Etiqueta>Prioridad</Etiqueta>
            <Valor>{faltante.prioridad}</Valor>
          </Seccion>

          <Seccion>
            <Etiqueta>Nota del local</Etiqueta>
            <Valor>{faltante.nota}</Valor>
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