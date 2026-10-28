import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { ErrorBanner } from "./src/components/ErrorBanner";
import { AvisoHost } from "./src/ui/avisos";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppNavigator />
        <ErrorBanner />
        <AvisoHost />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}