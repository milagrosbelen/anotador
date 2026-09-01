import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Detalle">;

// Integrante B: acá va la ficha (imagen, cantidad, proveedor, nota).
export function FaltanteDetalleScreen(_props: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Detalle — la arma el integrante B</Text>
    </View>
  );
}
