import { useFonts } from 'expo-font';
import { router, Stack, usePathname, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colores } from '@/diseno/colores';
import { archivosDeFuente } from '@/diseno/tipografia';
import { ProveedorBarrio } from '@/estado/barrio';
import { ProveedorBorradores } from '@/estado/borradores';
import { ProveedorPreferencias } from '@/estado/preferencias';
import { ProveedorSesion, usarSesion } from '@/estado/sesion';

// La pantalla de carga se mantiene hasta que las dos tipografias esten listas.
// Si se deja pasar antes, el primer cuadro se dibuja con la letra del sistema y
// se ve un salto feo.
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * La cuenta obligatoria es una puerta y no un camino.
 *
 * El recorrido de bienvenida no alcanza para exigirla: en el navegador basta
 * escribir la direccion, y en el telefono la aplicacion vuelve a abrirse donde
 * se cerro. Quien llega sin sesion veria el barrio de ejemplo mientras la base
 * le rechaza todo, que es la peor de las dos cosas, porque parece que funciona
 * y no guarda nada.
 */
function Puerta({ children }: { children: ReactNode }) {
  const { estado } = usarSesion();
  const camino = usePathname();
  const navegacion = useRootNavigationState();

  // La bienvenida y el registro son el unico lugar donde se puede estar sin
  // haber entrado.
  const enElIngreso = camino === '/' || camino.startsWith('/ingreso');

  useEffect(() => {
    // Abriendo la aplicacion directo en una direccion, la sesion se resuelve
    // antes de que el navegador exista, y una redireccion disparada ahi se
    // pierde en silencio.
    if (navegacion?.key === undefined) return;
    if (estado === 'cargando' || estado === 'sinBackend' || estado === 'dentro') return;
    if (enElIngreso) return;
    // Con sesion abierta y sin seudonimo falta solo la mitad del registro, pero
    // el paso que lo crea vive en el mismo recorrido.
    router.replace(estado === 'sinPerfil' ? '/ingreso/cuenta' : '/');
  }, [estado, enElIngreso, navegacion?.key]);

  return <>{children}</>;
}

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
              <Puerta>
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
              </Stack>
              </Puerta>
            </ProveedorBorradores>
            </ProveedorBarrio>
          </ProveedorSesion>
        </ProveedorPreferencias>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
