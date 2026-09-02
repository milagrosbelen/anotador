import React from "react";
import { Text, View,Image, ScrollView, Pressable} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { RootStackParamList } from "../types";
import { faltantes } from "../data/faltantes";

type Props = NativeStackScreenProps<RootStackParamList, "Detalle">;


export function FaltanteDetalleScreen({ route,navigation  }: Props) {

 const { id } = route.params;

  const faltante = faltantes.find((item) => item.id === Number(id));

  if (!faltante) {
    return (
      <Container>
        <Mensaje>Faltante no encontrado</Mensaje>
      </Container>
    );
  }


  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Container>
        <Imagen source={faltante.imagen} />

        <Contenido>
          <Titulo>{faltante.nombre}</Titulo>

          <Estado>{faltante.estado}</Estado>

          <Fila>
            <Label>Cantidad</Label>
            <Valor>
              {faltante.cantidad} {faltante.unidad}
            </Valor>
          </Fila>

          <Fila>
            <Label>Proveedor</Label>
            <Valor>{faltante.proveedor}</Valor>
          </Fila>

          <Fila>
            <Label>Nota</Label>
            <Valor>
              {faltante.nota || "Sin nota"}
            </Valor>
          </Fila>

          <BotonPedido
            onPress={() => {
              console.log("Faltante marcado como pedido:", faltante.id);
            }}
          >
            <BotonPedidoTexto>Marcar ya pedido</BotonPedidoTexto>
          </BotonPedido>

          <BotonVolver
            onPress={() => navigation.goBack()}
          >
            <BotonVolverTexto>Volver al listado</BotonVolverTexto>
          </BotonVolver>


        </Contenido>
      </Container>
    </ScrollView>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #f7f7f5;
`;

const Imagen = styled.Image`
  width: 100%;
  height: 300px;
`;

const Contenido = styled.View`
  padding: 24px 20px;
`;

const Titulo = styled.Text`
  font-size: 32px;
  font-weight: 800;
  color: #202426;
  margin-bottom: 12px;
`;

const Estado = styled.Text`
  align-self: flex-start;
  background-color: #f8df83;
  color: #202426;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const Fila = styled.View`
  flex-direction: row;
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: #d5d8d9;
`;

const Label = styled.Text`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #7a7d80;
`;

const Valor = styled.Text`
  flex: 1.5;
  font-size: 18px;
  color: #202426;
`;

const Mensaje = styled.Text`
  margin: auto;
  font-size: 20px;
  color: #555555;
`;


const BotonPedido = styled.Pressable`
  background-color: #5e9b6a;
  border-radius: 12px;
  padding: 16px;
  margin-top: 28px;
  align-items: center;
`;

const BotonPedidoTexto = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
`;

const BotonVolver = styled.Pressable`
  align-items: center;
  margin-top: 22px;
  padding: 10px;
`;

const BotonVolverTexto = styled.Text`
  color: #5e9b6a;
  font-size: 18px;
  font-weight: 600;
`;
