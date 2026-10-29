import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { FaltanteDetalleScreen } from "../screens/FaltanteDetalleScreen";
import { RootStackParamList } from "../types";
import { CamaraFaltanteScreen } from "../screens/CamaraFaltanteScreen";
import { NuevoFaltanteScreen } from "../screens/NuevoFaltanteScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#F7F7F5" },
          headerTintColor: "#202426",
        }}
      >
        <Stack.Screen
          name="CamaraFaltante"
          component={CamaraFaltanteScreen}
          options={{ title: "Foto de la góndola" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="NuevoFaltante" component={NuevoFaltanteScreen} options={{ title: "Nuevo faltante" }} />
        <Stack.Screen
          name="Detalle"
          component={FaltanteDetalleScreen}
          options={{ title: "Ficha del pedido" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
