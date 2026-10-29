import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarPreferencias } from '@/estado/preferencias';

type PropsBarraDePasos = {
  paso: number;
  total: number;
  /** Color de los tramos ya recorridos. */
  color?: string;
  /** Color de los tramos que faltan. */
  colorPendiente?: string;
  alto?: number;
};

/**
 * Barra de avance por tramos. Cada tramo es un paso, de modo que la persona ve
 * cuanto falta sin tener que leer el texto, que es lo que pide la regla de "un
 * paso por pantalla" del sistema visual.
 */
export function BarraDePasos({
  paso,
  total,
  color = colores.verde,
  colorPendiente = colores.borde,
  alto = 6,
}: PropsBarraDePasos) {
  const { menosAnimaciones } = usarPreferencias();

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Paso ${paso} de ${total}`}
      style={{ flexDirection: 'row', gap: espacio.apretado }}
    >
      {Array.from({ length: total }, (_, posicion) => (
        <TramoDePaso
          key={posicion}
          recorrido={posicion < paso}
          color={color}
          colorPendiente={colorPendiente}
          alto={alto}
          animar={!menosAnimaciones}
        />
      ))}
    </View>
  );
}

function TramoDePaso({
  recorrido,
  color,
  colorPendiente,
  alto,
  animar,
}: {
  recorrido: boolean;
  color: string;
  colorPendiente: string;
  alto: number;
  animar: boolean;
}) {
  const estiloAnimado = useAnimatedStyle(() => ({
    backgroundColor: animar
      ? withTiming(recorrido ? color : colorPendiente, { duration: 260 })
      : recorrido
        ? color
        : colorPendiente,
  }));

  return <Animated.View style={[{ flex: 1, height: alto, borderRadius: radio.redondo }, estiloAnimado]} />;
}
