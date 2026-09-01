import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

// Integrante A: acá va el header, el ScrollView y las FaltanteCard.
export function HomeScreen(_props: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home — la arma el integrante A</Text>
    </View>
  );
}
