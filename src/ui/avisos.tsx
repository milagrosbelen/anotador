import { Modal } from "react-native";
import styled from "styled-components/native";
import { create } from "zustand";

export type IconoAviso = "success" | "warning" | "question" | "info" | "error";

export type OpcionesAviso = {
  icono: IconoAviso;
  titulo: string;
  texto: string;
  confirmar: string;
  cancelar?: string;
};

type AvisoPendiente = OpcionesAviso & {
  resolver: (confirmado: boolean) => void;
};

type AvisoState = {
  pendiente: AvisoPendiente | null;
  abrir: (aviso: AvisoPendiente) => void;
  cerrar: (confirmado: boolean) => void;
};

const useAvisoStore = create<AvisoState>((set, get) => ({
  pendiente: null,
  abrir: (aviso) => set({ pendiente: aviso }),
  cerrar: (confirmado) => {
    const pendiente = get().pendiente;
    set({ pendiente: null });
    pendiente?.resolver(confirmado);
  },
}));

export function mostrarAviso(opciones: OpcionesAviso): Promise<boolean> {
  return new Promise((resolver) => {
    useAvisoStore.getState().abrir({ ...opciones, resolver });
  });
}

const iconoVisible: Record<IconoAviso, string> = {
  success: "✓",
  warning: "!",
  question: "?",
  info: "i",
  error: "×",
};

const colorIcono: Record<IconoAviso, string> = {
  success: "#5e9b6a",
  warning: "#f8bb86",
  question: "#87adbd",
  info: "#3fc3ee",
  error: "#f27474",
};

export function AvisoHost() {
  const pendiente = useAvisoStore((state) => state.pendiente);
  const cerrar = useAvisoStore((state) => state.cerrar);

  return (
    <Modal
      visible={pendiente !== null}
      transparent
      animationType="fade"
      onRequestClose={() => cerrar(false)}
    >
      {pendiente ? (
        <Fondo>
          <Tarjeta>
            <Circulo style={{ borderColor: colorIcono[pendiente.icono] }}>
              <Simbolo style={{ color: colorIcono[pendiente.icono] }}>
                {iconoVisible[pendiente.icono]}
              </Simbolo>
            </Circulo>
            <Titulo>{pendiente.titulo}</Titulo>
            <Texto>{pendiente.texto}</Texto>
            <Fila>
              {pendiente.cancelar ? (
                <BotonCancelar onPress={() => cerrar(false)}>
                  <TextoCancelar>{pendiente.cancelar}</TextoCancelar>
                </BotonCancelar>
              ) : null}
              <BotonOk onPress={() => cerrar(true)}>
                <TextoOk>{pendiente.confirmar}</TextoOk>
              </BotonOk>
            </Fila>
          </Tarjeta>
        </Fondo>
      ) : null}
    </Modal>
  );
}

const Fondo = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 24px;
`;

const Tarjeta = styled.View`
  width: 100%;
  max-width: 360px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 28px 24px 22px;
  align-items: center;
`;

const Circulo = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  border-width: 4px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const Simbolo = styled.Text`
  font-size: 36px;
  font-weight: 700;
`;

const Titulo = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #595959;
  text-align: center;
`;

const Texto = styled.Text`
  font-size: 16px;
  color: #545454;
  text-align: center;
  margin-top: 10px;
  line-height: 22px;
`;

const Fila = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 22px;
`;

const BotonOk = styled.Pressable`
  background-color: #5e9b6a;
  border-radius: 8px;
  padding: 12px 22px;
`;

const TextoOk = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;

const BotonCancelar = styled.Pressable`
  background-color: #6e7881;
  border-radius: 8px;
  padding: 12px 22px;
`;

const TextoCancelar = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;
