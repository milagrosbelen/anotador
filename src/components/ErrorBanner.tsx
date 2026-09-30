import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

import { useErrorStore } from "../store/useErrorStore";

export function ErrorBanner() {
  const mensaje = useErrorStore((state) => state.mensaje);
  const limpiarError = useErrorStore((state) => state.limpiarError);
  const insets = useSafeAreaInsets();

  if (!mensaje) return null;

  return (
    <Contenedor style={{ top: insets.top + 8 }}>
      <Mensaje>{mensaje}</Mensaje>
      <Cerrar
        onPress={limpiarError}
        accessibilityRole="button"
        accessibilityLabel="Cerrar error"
      >
        <CerrarTexto>Cerrar</CerrarTexto>
      </Cerrar>
    </Contenedor>
  );
}

const Contenedor = styled.View`
  position: absolute;
  left: 16px;
  right: 16px;
  z-index: 10;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  background-color: #fde8e8;
  border-radius: 12px;
  padding: 12px 14px;
  elevation: 4;
`;

const Mensaje = styled.Text`
  flex: 1;
  font-size: 15px;
  color: #7a1f1f;
`;

const Cerrar = styled.Pressable`
  padding: 6px 2px;
`;

const CerrarTexto = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #7a1f1f;
`;
