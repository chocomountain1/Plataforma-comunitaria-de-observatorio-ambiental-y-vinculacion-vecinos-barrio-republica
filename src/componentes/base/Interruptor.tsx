import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { colores } from '@/diseno/colores';
import { radio } from '@/diseno/medidas';
import { usarPreferencias } from '@/estado/preferencias';

type PropsInterruptor = {
  activo: boolean;
  onCambiar: (activo: boolean) => void;
  accesibilidad: string;
};

/**
 * Interruptor de encendido y apagado de los ajustes. Se dibuja a mano en vez de
 * usar el Switch del sistema operativo porque este tiene que verse igual en
 * Android y en iOS, y con los colores del barrio.
 */
export function Interruptor({ activo, onCambiar, accesibilidad }: PropsInterruptor) {
  const { menosAnimaciones } = usarPreferencias();
  const duracion = menosAnimaciones ? 0 : 180;

  const estiloDeCarril = useAnimatedStyle(() => ({
    backgroundColor: withTiming(activo ? colores.verde : colores.bordeFuerte, { duration: duracion }),
  }));

  const estiloDePerilla = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(activo ? 20 : 0, { duration: duracion }) }],
  }));

  return (
    <Pressable
      onPress={() => onCambiar(!activo)}
      accessibilityRole="switch"
      accessibilityState={{ checked: activo }}
      accessibilityLabel={accesibilidad}
      hitSlop={10}
    >
      <Animated.View
        style={[
          { width: 52, height: 32, borderRadius: radio.redondo, padding: 3, justifyContent: 'center' },
          estiloDeCarril,
        ]}
      >
        <Animated.View
          style={[
            { width: 26, height: 26, borderRadius: radio.redondo, backgroundColor: colores.papel },
            estiloDePerilla,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
