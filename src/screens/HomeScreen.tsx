import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types";
import FaltanteCard from "../components/FaltanteCard";
import { Chip } from "../components/Chip";
import { FALTANTES, PROVEEDORES } from "../data/faltantes";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const [proveedorActivo, setProveedorActivo] = useState("Todos");

  const faltantesVisibles =
    proveedorActivo === "Todos"
      ? FALTANTES
      : FALTANTES.filter((item) => item.proveedor === proveedorActivo);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F5" }}>
      <Container>
        <Titulo>Anotador</Titulo>
        <Subtitulo>Lo que hay que pedir el lunes.</Subtitulo>
        <Resumen>
          {faltantesVisibles.length}{" "}
          {faltantesVisibles.length === 1 ? "faltante" : "faltantes"}
          {proveedorActivo !== "Todos" ? ` · ${proveedorActivo}` : ""}
        </Resumen>

        <ChipsContainer
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {PROVEEDORES.map((proveedor) => (
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
          {faltantesVisibles.map((faltante) => (
            <FaltanteCard
              key={faltante.id}
              imagen={faltante.imagen}
              nombre={faltante.nombre}
              cantidad={faltante.cantidad}
              unidad={faltante.unidad}
              proveedor={faltante.proveedor}
              estado={faltante.estado}
              onPress={() =>
                navigation.navigate("Detalle", { id: faltante.id })
              }
            />
          ))}

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
