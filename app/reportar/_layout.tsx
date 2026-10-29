import { Stack } from 'expo-router';

import { colores } from '@/diseno/colores';

/**
 * Asistente de reporte.
 *
 * Son cinco pasos y uno por pantalla, como pide la regla de accesibilidad del
 * sistema visual. La pantalla de posible duplicado se intercala sin consumir un
 * paso, porque no pide informacion nueva: solo pregunta si ya existe.
 */
export default function DisposicionDeReportar() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colores.crema },
      }}
    >
      <Stack.Screen name="enviado" options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack>
  );
}
