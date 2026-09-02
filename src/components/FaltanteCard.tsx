import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useNavigation } from "@react-navigation/native";

type FaltanteCardProps = {
  id: number;
  imagen: ImageSourcePropType;
  nombre: string;
  cantidad: number;
  unidad: string;
  proveedor: string;
  estado: string;
};
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function FaltanteCard({
  id,
  imagen,
  nombre,
  cantidad,
  unidad,
  proveedor,
  estado,
}: FaltanteCardProps) {
  
  const navigation = useNavigation<NavigationProp>();

  const estaPedido = estado === "Ya pedido";

  return (
    <Card
      onPress={() => navigation.navigate("Detalle", { id })}
    >
      <Imagen source={imagen} />

      <Info>
        <Nombre>{nombre}</Nombre>

        <Cantidad>
          Pedir {cantidad} {unidad}
        </Cantidad>

        <Proveedor>{proveedor}</Proveedor>
      </Info>

      <Estado $estaPedido={estaPedido}>
        <EstadoTexto $estaPedido={estaPedido}>
          {estado}
        </EstadoTexto>
      </Estado>
    </Card>
  );
}

const Card = styled.Pressable`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 8px;
  margin-bottom: 10px;
  min-height: 120px;

  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 5px;

  elevation: 3;
`;

const Imagen = styled.Image`
  width: 95px;
  height: 95px;
  border-radius: 12px;
  background-color: #eeeeee;
`;

const Info = styled.View`
  flex: 1;
  margin-left: 14px;
  padding-right: 5px;
`;

const Nombre = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #202426;
  margin-bottom: 8px;
`;

const Cantidad = styled.Text`
  font-size: 16px;
  color: #202426;
  margin-bottom: 6px;
`;

const Proveedor = styled.Text`
  font-size: 15px;
  color: #687078;
`;

const Estado = styled.View<{ $estaPedido: boolean }>`
  border-radius: 14px;
  padding: 9px 12px;
  margin-right: 5px;
  background-color: ${({ $estaPedido }) =>
    $estaPedido ? "#D3F0D8" : "#FFE79A"};
`;

const EstadoTexto = styled.Text<{ $estaPedido: boolean }>`
  font-size: 14px;
  color: ${({ $estaPedido }) =>
    $estaPedido ? "#34734A" : "#493B12"};
`;