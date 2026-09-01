import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types";
import FaltanteCard from "../components/FaltanteCard";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen(_props: Props) {
  const faltantesTemporales = [
    {
      id: 1,
      nombre: "Coca Cola 2.25 L",
      cantidad: 3,
      unidad: "fardos",
      proveedor: "Dist. San Martin",
      estado: "Falta pedir" as const,
      imagen: require("../../assets/images/coca-cola.jpg.png"),
    },
    {
      id: 2,
      nombre: "Filtro de aceite 1100",
      cantidad: 4,
      unidad: "unidades",
      proveedor: "Autopartes Lopez",
      estado: "Falta pedir" as const,
      imagen: require("../../assets/images/filtro-aceite.jpg.png"),
    },
    {
      id: 3,
      nombre: "Alimento perro 15 kg",
      cantidad: 2,
      unidad: "bolsas",
      proveedor: "Drogueria Vet Sur",
      estado: "Ya pedido" as const,
      imagen: require("../../assets/images/alimento-perro.jpg.png"),
    },
    {
      id: 4,
      nombre: "Quilmes 1L pack",
      cantidad: 5,
      unidad: "packs",
      proveedor: "Dist. San Martin",
      estado: "Falta pedir" as const,
      imagen: require("../../assets/images/quilmes.jpg.png"),
    },
    {
      id: 5,
      nombre: "Cadena 428 moto",
      cantidad: 1,
      unidad: "unidad",
      proveedor: "Motos del Centro",
      estado: "Falta pedir" as const,
      imagen: require("../../assets/images/cadena-moto.jpg.png"),
    },
    {
      id: 6,
      nombre: "Comida para gato",
      cantidad: 3,
      unidad: "bolsas",
      proveedor: "Drogueria Vet Sur",
      estado: "Ya pedido" as const,
      imagen: require("../../assets/images/comida-gato.jpg"),
    },
    {
      id: 7,
      nombre: "Fanta 2.25 L",
      cantidad: 2,
      unidad: "fardos",
      proveedor: "Dist. San Martin",
      estado: "Falta pedir" as const,
      imagen: require("../../assets/images/fanta.jpg"),
    },
    {
      id: 8,
      nombre: "Galletitas Oreo",
      cantidad: 4,
      unidad: "paquetes",
      proveedor: "Dist. San Martin",
      estado: "Falta pedir" as const,
      imagen: require("../../assets/images/galleta-oreo.gif"),
    },
    {
      id: 9,
      nombre: "Papas Lays",
      cantidad: 6,
      unidad: "paquetes",
      proveedor: "Dist. San Martin",
      estado: "Ya pedido" as const,
      imagen: require("../../assets/images/papas-lays.jpg"),
    },
    {
      id: 10,
      nombre: "Sprite 2.25 L",
      cantidad: 3,
      unidad: "fardos",
      proveedor: "Dist. San Martin",
      estado: "Falta pedir" as const,
      imagen: require("../../assets/images/sprite.jpg"),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F5" }}>
      <Container>
        <Titulo>Anotador</Titulo>

        <Subtitulo>Lo que hay que pedir el lunes.</Subtitulo>

        <ChipsContainer
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
          }}
        >
          <ChipActivo>
            <ChipTextoActivo>Todos</ChipTextoActivo>
          </ChipActivo>

          <Chip>
            <ChipTexto>Dist. San Martin</ChipTexto>
          </Chip>

          <Chip>
            <ChipTexto>Autopartes Lopez</ChipTexto>
          </Chip>

          <Chip>
            <ChipTexto>Vet Sur</ChipTexto>
          </Chip>

          <Chip>
            <ChipTexto>Motos del Centro</ChipTexto>
          </Chip>
        </ChipsContainer>

        <Lista
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        >
          {faltantesTemporales.map((faltante) => (
            <FaltanteCard
              key={faltante.id}
              imagen={faltante.imagen}
              nombre={faltante.nombre}
              cantidad={faltante.cantidad}
              unidad={faltante.unidad}
              proveedor={faltante.proveedor}
              estado={faltante.estado}
            />
          ))}
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
  margin-bottom: 18px;
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

const Chip = styled.View`
  border-width: 1px;
  border-color: #d5d8d9;
  border-radius: 24px;
  padding: 10px 18px;
  margin-right: 10px;
  background-color: #ffffff;
`;

const ChipActivo = styled(Chip)`
  background-color: #5e9b6a;
  border-color: #5e9b6a;
`;

const ChipTexto = styled.Text`
  font-size: 15px;
  color: #333333;
`;

const ChipTextoActivo = styled.Text`
  font-size: 15px;
  color: #ffffff;
  font-weight: 600;
`;

const Lista = styled.ScrollView`
  flex: 1;
`;