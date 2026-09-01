import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { FaltanteDetalleScreen } from "../screens/FaltanteDetalleScreen";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Integrante C: acá se arma el Stack (Home → Detalle).
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detalle"
          component={FaltanteDetalleScreen}
          options={{ title: "Ficha del pedido" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
