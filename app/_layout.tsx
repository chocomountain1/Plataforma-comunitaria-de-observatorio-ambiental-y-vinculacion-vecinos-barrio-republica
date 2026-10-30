import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colores } from '@/diseno/colores';
import { archivosDeFuente } from '@/diseno/tipografia';
import { ProveedorBarrio } from '@/estado/barrio';
import { ProveedorBorradores } from '@/estado/borradores';
import { ProveedorPreferencias } from '@/estado/preferencias';
import { ProveedorSesion } from '@/estado/sesion';

// La pantalla de carga se mantiene hasta que las dos tipografias esten listas.
// Si se deja pasar antes, el primer cuadro se dibuja con la letra del sistema y
// se ve un salto feo.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function DisposicionRaiz() {
  const [fuentesListas, errorDeFuentes] = useFonts(archivosDeFuente);

  useEffect(() => {
    if (fuentesListas || errorDeFuentes !== null) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fuentesListas, errorDeFuentes]);

  if (!fuentesListas && errorDeFuentes === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProveedorPreferencias>
          <ProveedorSesion>
            <ProveedorBarrio>
            <ProveedorBorradores>
              <StatusBar style="auto" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colores.crema },
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="index" options={{ animation: 'fade' }} />
                <Stack.Screen name="(barrio)" options={{ animation: 'fade' }} />
                <Stack.Screen
                  name="mapa/capas"
                  options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                  name="mapa/ficha"
                  options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                  name="instituciones/interes"
                  options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                  name="actividades/inscripcion"
                  options={{ animation: 'fade_from_bottom' }}
                />
                <Stack.Screen name="reportar/enviado" options={{ animation: 'fade' }} />
              </Stack>
            </ProveedorBorradores>
            </ProveedorBarrio>
          </ProveedorSesion>
        </ProveedorPreferencias>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
