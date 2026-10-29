import { useEffect, useRef, useState } from "react";
import { AppState, Button, Linking, Platform, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../types";
import { useFotoStore } from "../store/useFotoStore";
import { useNuevoFaltanteStore } from "../store/useNuevoFaltanteStore";
import type { FotoPendiente } from "../store/useFotoStore";

type Props = NativeStackScreenProps<RootStackParamList, "CamaraFaltante">;

export function CamaraFaltanteScreen({ route, navigation }: Props) {
  const camera = useRef<CameraView>(null);
  const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions();
  const focused = useIsFocused();
  const [activa, setActiva] = useState(AppState.currentState === "active");
  const [lista, setLista] = useState(false);
  const [capturando, setCapturando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);
  const ocupada = useRef(false);
  const vigente = useRef(true);

  useEffect(() => {
    vigente.current = true;
    const listener = AppState.addEventListener("change", (estado) => {
      setActiva(estado === "active");
      if (estado === "active") void consultarPermiso().catch(() => setError("No se pudo consultar el permiso."));
      else setLista(false);
    });
    return () => { vigente.current = false; listener.remove(); };
  }, [consultarPermiso]);

  async function habilitarCamara() {
    try {
      setError(null);
      if (permiso?.canAskAgain) await pedirPermiso();
      else if (Platform.OS !== "web") await Linking.openSettings();
      else setError("Habilitá la cámara en los permisos del sitio y recargá la página.");
    } catch {
      setError("No se pudo habilitar la cámara. Revisá los permisos en Ajustes.");
    }
  }

  async function sacarFoto() {
    if (!camera.current || !lista || ocupada.current) return;
    ocupada.current = true;
    setCapturando(true);
    setError(null);
    try {
      const foto = await camera.current.takePictureAsync({ quality: 0.7, imageType: "jpg" });
      if (!vigente.current || !navigation.isFocused()) return;
      if (!foto?.uri) throw new Error("Sin foto");
      const pendiente: FotoPendiente = {
        origen: "camara", uri: foto.uri, nombre: `gondola-${Date.now()}.jpg`, tipo: "image/jpeg",
      };
      if ("modo" in route.params) {
        useNuevoFaltanteStore.getState().setFoto(pendiente);
        if (route.params.repetir) navigation.goBack();
        else navigation.replace("NuevoFaltante");
      } else {
        useFotoStore.getState().setPendiente(route.params.id, pendiente);
        navigation.goBack();
      }
    } catch {
      if (vigente.current) setError("No se pudo sacar la foto. Volvé a intentar.");
    } finally {
      ocupada.current = false;
      if (vigente.current) setCapturando(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      {!permiso ? <Text style={styles.message}>Consultando permiso de cámara...</Text> : !permiso.granted ? (
        <View style={styles.controls}>
          <Text style={styles.message}>Permití el acceso a la cámara para sacar una foto de la góndola.</Text>
          <Button title={permiso.canAskAgain ? "Permitir cámara" : Platform.OS === "web" ? "Ver instrucciones" : "Abrir Ajustes"} onPress={habilitarCamara} />
        </View>
      ) : focused && activa ? (
        <CameraView key={intento} ref={camera} style={styles.camera} facing="back" mode="picture"
          onCameraReady={() => setLista(true)}
          onMountError={() => { setLista(false); setError("No se pudo iniciar la cámara. Comprobá que esté disponible."); }} />
      ) : null}
      <View style={styles.controls}>
        {error ? <Text accessibilityRole="alert" style={styles.message}>{error}</Text> : null}
        {permiso?.granted ? <>
          {error && !lista ? <Button title="Reintentar cámara" onPress={() => { setError(null); setIntento((n) => n + 1); }} /> : null}
          <Button title={capturando ? "Capturando..." : "Sacar foto"} disabled={!lista || capturando || !activa} onPress={sacarFoto} color="#5e9b6a" />
        </> : null}
        <Button title="Volver sin sacar foto" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7F5" },
  camera: { flex: 1 },
  controls: { padding: 20, gap: 16 },
  message: { color: "#202426", fontSize: 16, textAlign: "center", padding: 12 },
});
