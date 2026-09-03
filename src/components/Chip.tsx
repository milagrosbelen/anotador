import React from "react";
import styled from "styled-components/native";

type ChipProps = {
  label: string;
  activo?: boolean;
  onPress: () => void;
};

export function Chip({ label, activo = false, onPress }: ChipProps) {
  return (
    <ChipBoton
      $activo={activo}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
    >
      <ChipTexto $activo={activo}>{label}</ChipTexto>
    </ChipBoton>
  );
}

const ChipBoton = styled.Pressable<{ $activo: boolean }>`
  border-width: 1px;
  border-color: ${({ $activo }) => ($activo ? "#5e9b6a" : "#d5d8d9")};
  border-radius: 24px;
  padding: 10px 18px;
  margin-right: 10px;
  background-color: ${({ $activo }) => ($activo ? "#5e9b6a" : "#ffffff")};
`;

const ChipTexto = styled.Text<{ $activo: boolean }>`
  font-size: 15px;
  font-weight: ${({ $activo }) => ($activo ? "600" : "400")};
  color: ${({ $activo }) => ($activo ? "#ffffff" : "#333333")};
`;
