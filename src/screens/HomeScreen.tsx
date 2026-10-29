import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types";
import FaltanteCard from "../components/FaltanteCard";
import { Chip } from "../components/Chip";
import { useFiltroStore } from "../store/useFiltroStore";
import { getFaltanteById } from "../data/faltantes";
import { useFaltantes } from "../hooks/useFaltantes";
import { getImagenUri, useConfigStore } from "../store/useConfigStore";
import { useFotoStore } from "../store/useFotoStore";
import { useNuevoFaltanteStore } from "../store/useNuevoFaltanteStore";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const proveedorActivo = useFiltroStore(
    (state) => state.proveedorActivo
  );

  const setProveedorActivo = useFiltroStore(
    (state) => state.setProveedorActivo
  );

  const apiUrl = useConfigStore(
    (state) => state.apiUrl
  );

  const fotosGuardadas = useFotoStore((state) => state.fotos);

  const {
    data: faltantes = [],
    isLoading,
    isError,
  } = useFaltantes();

  const proveedores = [
    "Todos",
    ...Array.from(new Set(faltantes.map((faltante) => faltante.proveedor))),
  ];

  const faltantesVisibles =
    proveedorActivo === "Todos"
      ? faltantes
      : faltantes.filter(
          (faltante) => faltante.proveedor === proveedorActivo
        );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F5" }}>
        <Mensaje>Cargando faltantes...</Mensaje>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F5" }}>
        <Mensaje>No se pudieron cargar los faltantes.</Mensaje>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F5" }}>
      <Container>
        <Titulo>Anotador</Titulo>

        <Subtitulo>
          Lo que hay que pedir el lunes.
        </Subtitulo>

        <BotonNuevo accessibilityRole="button" onPress={() => {
          useNuevoFaltanteStore.getState().setFoto(null);
          navigation.navigate("CamaraFaltante", { modo: "nuevo" });
        }}>
          <TextoNuevo>+ Nuevo faltante</TextoNuevo>
        </BotonNuevo>

        <Resumen>
          {faltantesVisibles.length}{" "}
          {faltantesVisibles.length === 1
            ? "faltante"
            : "faltantes"}
          {proveedorActivo !== "Todos"
            ? ` · ${proveedorActivo}`
            : ""}
        </Resumen>

        <ChipsContainer
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {proveedores.map((proveedor) => (
            <Chip
              key={proveedor}
              label={proveedor}
              activo={proveedorActivo === proveedor}
              onPress={() => setProveedorActivo(proveedor)}
            />
          ))}
        </ChipsContainer>

        <Lista
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {faltantesVisibles.map((faltante) => {
            const fotoGuardada = fotosGuardadas[faltante.id];
            const imagenUri = getImagenUri(
              apiUrl,
              faltante.imagenUrl
            );
            const imagenLocal = getFaltanteById(faltante.id)?.imagen;

            return (
              <FaltanteCard
                key={faltante.id}
                imagen={
                  fotoGuardada
                    ? { uri: fotoGuardada }
                    : imagenUri
                      ? { uri: imagenUri }
                      : imagenLocal ?? require("../../assets/icon.png")
                }
                nombre={faltante.nombre}
                cantidad={faltante.cantidad}
                unidad={faltante.unidad}
                proveedor={faltante.proveedor}
                estado={faltante.estado}
                onPress={() =>
                  navigation.navigate("Detalle", {
                    id: faltante.id,
                  })
                }
              />
            );
          })}

          {faltantesVisibles.length === 0 && (
            <Vacio>
              No hay faltantes para este proveedor.
            </Vacio>
          )}
        </Lista>
      </Container>
    </SafeAreaView>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #f7f7f5;
  padding-left: 16px;
  padding-right: 16px;
`;

const BotonNuevo = styled.Pressable`
  background-color: #5e9b6a;
  padding: 14px;
  border-radius: 12px;
  margin-top: 16px;
  margin-bottom: 12px;
  align-items: center;
`;
const TextoNuevo = styled.Text`
  color: #fff;
  font-size: 17px;
  font-weight: 700;
`;

const Titulo = styled.Text`
  font-size: 38px;
  font-weight: 800;
  color: #202426;
  margin-top: 8px;
`;

const Subtitulo = styled.Text`
  font-size: 18px;
  color: #3e4448;
  margin-top: 4px;
`;

const Resumen = styled.Text`
  font-size: 14px;
  color: #687078;
  margin-top: 6px;
  margin-bottom: 16px;
`;

const ChipsContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    alignItems: "center",
  },
})`
  max-height: 58px;
  min-height: 58px;
  margin-bottom: 16px;
`;

const Lista = styled.ScrollView`
  flex: 1;
`;

const Vacio = styled.Text`
  font-size: 16px;
  color: #687078;
  text-align: center;
  margin-top: 40px;
`;

const Mensaje = styled.Text`
  font-size: 16px;
  color: #687078;
  text-align: center;
  margin-top: 40px;
`;
