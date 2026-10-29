import { useEffect, useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePreventRemove } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { RootStackParamList } from "../types";
import { crearFaltante, DatosNuevoFaltante, validarNuevoFaltante } from "../api/fotos";
import type { FaltanteApi } from "../hooks/useFaltantes";
import { useNuevoFaltanteStore } from "../store/useNuevoFaltanteStore";
import { useConfigStore } from "../store/useConfigStore";
import { useFiltroStore } from "../store/useFiltroStore";
import { mostrarAviso } from "../ui/avisos";

type Props = NativeStackScreenProps<RootStackParamList, "NuevoFaltante">;
const inicial: DatosNuevoFaltante = { nombre: "", cantidad: "1", unidad: "unidades", proveedor: "", nota: "" };

export function NuevoFaltanteScreen({ navigation }: Props) {
  const foto = useNuevoFaltanteStore((state) => state.foto);
  const apiUrl = useConfigStore((state) => state.apiUrl);
  const queryClient = useQueryClient();
  const [datos, setDatos] = useState(inicial);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const operacion = useRef(false);
  const guardado = useRef(false);
  const preguntando = useRef(false);
  const modificado = Boolean(foto) || Object.keys(inicial).some((key) => datos[key as keyof DatosNuevoFaltante] !== inicial[key as keyof DatosNuevoFaltante]);

  useEffect(() => () => useNuevoFaltanteStore.getState().setFoto(null), []);

  usePreventRemove(modificado || guardando, ({ data }) => {
    if (guardado.current) { navigation.dispatch(data.action); return; }
    if (operacion.current || preguntando.current) return;
    preguntando.current = true;
    void mostrarAviso({ icono: "warning", titulo: "¿Salir sin guardar?", texto: "Se descartarán la foto y los datos del nuevo faltante.", confirmar: "Salir", cancelar: "Seguir acá" })
      .then((salir) => { if (salir) navigation.dispatch(data.action); })
      .finally(() => { preguntando.current = false; });
  });

  async function guardar() {
    if (operacion.current || guardado.current) return;
    const invalido = validarNuevoFaltante(datos, foto);
    if (invalido || !foto) { setError(invalido); return; }
    operacion.current = true;
    setGuardando(true);
    setError(null);
    try {
      const creado = await crearFaltante(apiUrl, datos, foto);
      guardado.current = true;
      queryClient.setQueryData(["faltante", apiUrl, creado.id], creado);
      queryClient.setQueryData<FaltanteApi[]>(["faltantes", apiUrl], (lista) => [creado, ...(lista ?? []).filter((item) => item.id !== creado.id)]);
      useFiltroStore.getState().setProveedorActivo("Todos");
      void queryClient.invalidateQueries({ queryKey: ["faltantes", apiUrl] });
      navigation.popTo("Home");
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : "No se pudo guardar. Revisá la conexión y volvé a intentar.");
    } finally {
      operacion.current = false;
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {foto ? <Image source={{ uri: foto.uri }} style={styles.foto} accessibilityLabel="Foto del nuevo faltante" /> : null}
          <Pressable accessibilityRole="button" disabled={guardando} style={styles.secundario} onPress={() => navigation.navigate("CamaraFaltante", { modo: "nuevo", repetir: true })}>
            <Text style={styles.textoSecundario}>{foto ? "Repetir foto" : "Sacar foto"}</Text>
          </Pressable>
          <Text style={styles.ayuda}>Completá los datos. La nota es opcional.</Text>
          {([ ["nombre", "Nombre"], ["cantidad", "Cantidad"], ["unidad", "Unidad"], ["proveedor", "Proveedor"], ["nota", "Nota (opcional)"] ] as const).map(([campo, etiqueta]) => (
            <View key={campo} style={styles.campo}>
              <Text style={styles.label}>{etiqueta}</Text>
              <TextInput accessibilityLabel={etiqueta} value={datos[campo]} editable={!guardando}
                onChangeText={(valor) => setDatos((prev) => ({ ...prev, [campo]: valor }))}
                keyboardType={campo === "cantidad" ? "number-pad" : "default"}
                multiline={campo === "nota"} style={[styles.input, campo === "nota" && styles.nota]} />
            </View>
          ))}
          <Text style={styles.ayuda}>Estado inicial: Falta pedir</Text>
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <Pressable accessibilityRole="button" disabled={guardando} style={[styles.guardar, guardando && styles.disabled]} onPress={() => void guardar()}>
            <Text style={styles.textoGuardar}>{guardando ? "Guardando..." : "Guardar faltante"}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7F5" },
  content: { padding: 20, gap: 14, paddingBottom: 36 },
  foto: { width: "100%", height: 240, borderRadius: 14 },
  secundario: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#5e9b6a", alignItems: "center" },
  textoSecundario: { color: "#36633f", fontWeight: "600", fontSize: 16 },
  ayuda: { color: "#687078", fontSize: 14 },
  campo: { gap: 6 },
  label: { color: "#202426", fontSize: 16, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#c9ceca", backgroundColor: "white", borderRadius: 10, padding: 12, fontSize: 17, color: "#202426" },
  nota: { minHeight: 88, textAlignVertical: "top" },
  error: { color: "#a72828", fontSize: 16 },
  guardar: { padding: 16, borderRadius: 12, backgroundColor: "#5e9b6a", alignItems: "center" },
  textoGuardar: { fontWeight: "700", fontSize: 17, color: "white" },
  disabled: { opacity: 0.6 },
});
