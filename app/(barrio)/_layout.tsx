import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { BarraNavegacion } from '@/componentes/app';
import { colores } from '@/diseno/colores';

/**
 * Los cinco destinos permanentes de la aplicacion.
 *
 * "Reportar" ocupa el centro pero no es una pestana de verdad: abre el
 * asistente de reporte, que es un flujo aparte con sus propios pasos. Por eso
 * su pulsacion se intercepta antes de que la navegacion cambie de pestana.
 */
export default function DisposicionDeBarrio() {
  return (
    <Tabs
      tabBar={(props) => <BarraNavegacion {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colores.crema },
      }}
    >
      <Tabs.Screen name="inicio" />
      <Tabs.Screen name="mapa" />
      <Tabs.Screen
        name="reportar"
        listeners={{
          tabPress: (evento) => {
            evento.preventDefault();
            router.push('/reportar/categoria');
          },
        }}
      />
      <Tabs.Screen name="mis-reportes" />
      <Tabs.Screen name="avisos" />
    </Tabs>
  );
}
