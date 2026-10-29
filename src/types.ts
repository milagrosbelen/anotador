export type RootStackParamList = {
  Home: undefined;
  Detalle: { id: number };
  NuevoFaltante: undefined;
  CamaraFaltante: { id: number } | { modo: "nuevo"; repetir?: boolean };
};
