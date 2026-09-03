import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import { RootStackParamList } from "../types";
import { getFaltanteById } from "../data/faltantes";

type Props = NativeStackScreenProps<RootStackParamList, "Detalle">;

export function FaltanteDetalleScreen({ route }: Props) {
  const faltante = getFaltanteById(route.params.id);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F5" }} edges={["bottom"]}>
      <Scroll showsVerticalScrollIndicator={false}>
        <Imagen source={faltante.imagen} resizeMode="cover" />

        <Contenedor>
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
