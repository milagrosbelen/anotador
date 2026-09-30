import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { ErrorBanner } from "./src/components/ErrorBanner";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <ErrorBanner />
    </SafeAreaProvider>
  );
}
