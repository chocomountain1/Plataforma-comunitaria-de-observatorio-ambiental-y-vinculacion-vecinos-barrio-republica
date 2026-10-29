import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { usarPreferencias } from '@/estado/preferencias';

const PressableAnimado = Animated.createAnimatedComponent(Pressable);

type PropsPresionable = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Cuanto se achica al tocarlo. Un valor mas bajo se siente mas marcado. */
  escalaAlTocar?: number;
  /** Vibracion breve al tocar. Se usa en las acciones que confirman algo. */
  vibrar?: boolean;
};

/**
 * Area tocable con una reaccion breve al tacto. Se usa en vez de Pressable
 * directo para que todos los botones y tarjetas respondan igual y para respetar
 * la preferencia de menos animaciones.
 */
export function Presionable({
  style,
  escalaAlTocar = 0.97,
  vibrar = false,
  onPressIn,
  onPressOut,
  ...resto
}: PropsPresionable) {
  const { menosAnimaciones } = usarPreferencias();
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  return (
    <PressableAnimado
      {...resto}
      onPressIn={(evento) => {
        if (!menosAnimaciones) {
          escala.value = withTiming(escalaAlTocar, { duration: 90 });
        }
        if (vibrar) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPressIn?.(evento);
      }}
      onPressOut={(evento) => {
        escala.value = withTiming(1, { duration: 140 });
        onPressOut?.(evento);
      }}
      style={[style, estiloAnimado]}
    />
  );
}
