import { useState } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import styled from "styled-components/native";

export function UbicacionLocal() {
  const [direccion, setDireccion] = useState<string | null>(null);
  const [coordenadas, setCoordenadas] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const obtenerUbicacion = async () => {
    try {
      setCargando(true);

      const serviciosActivos = await Location.hasServicesEnabledAsync();

      if (!serviciosActivos) {
        Alert.alert(
          "GPS desactivado",
          "Activá la ubicación del teléfono para poder registrar el local."
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso de ubicación",
          "Necesitamos permiso para acceder a tu ubicación."
        );
        return;
      }

      const ubicacion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = ubicacion.coords;

      setCoordenadas(
        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      );

      const resultadoDireccion = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (resultadoDireccion.length > 0) {
        const lugar = resultadoDireccion[0];

        const partes = [
          lugar.street,
          lugar.streetNumber,
          lugar.city,
          lugar.region,
        ].filter(Boolean);

        setDireccion(partes.join(", "));
      } else {
        setDireccion("Dirección no disponible");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "No pudimos obtener tu ubicación. Intentá nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <Contenedor>
      <Boton onPress={obtenerUbicacion} disabled={cargando}>
        <TextoBoton>
          {cargando ? "Obteniendo ubicación..." : "Estoy en el local"}
        </TextoBoton>
      </Boton>

      {coordenadas && (
        <Resultado>
          <Anotado>✓ Anotado</Anotado>

          {direccion && <Texto>{direccion}</Texto>}

          <Texto>Coordenadas: {coordenadas}</Texto>
        </Resultado>
      )}
    </Contenedor>
  );
}

const Contenedor = styled.View`
  margin-top: 10px;
`;

const Boton = styled.TouchableOpacity`
  background-color: #202426;
  padding: 14px 16px;
  border-radius: 10px;
  align-items: center;
`;

const TextoBoton = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`;

const Resultado = styled.View`
  margin-top: 12px;
`;

const Anotado = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #34734a;
  margin-bottom: 4px;
`;

const Texto = styled.Text`
  font-size: 15px;
  color: #202426;
  line-height: 21px;
`;