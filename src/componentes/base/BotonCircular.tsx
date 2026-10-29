import type { StyleProp, ViewStyle } from 'react-native';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { alturaTocable, radio } from '@/diseno/medidas';

type PropsBotonCircular = {
  icono: NombreIcono;
  accesibilidad: string;
  onPress?: () => void;
  /** Sobre fondo bosque el circulo claro no contrasta y hay que invertirlo. */
  tono?: 'claro' | 'oscuro';
  tamano?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * El boton redondo de 44 px que encabeza casi todas las pantallas: volver,
 * cerrar y cancelar. Cumple el minimo de zona tocable del sistema visual.
 */
export function BotonCircular({
  icono,
  accesibilidad,
  onPress,
  tono = 'claro',
  tamano = alturaTocable.minima,
  style,
}: PropsBotonCircular) {
  const esClaro = tono === 'claro';
  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.92}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad}
      style={[
        {
          width: tamano,
          height: tamano,
          borderRadius: radio.redondo,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: esClaro ? colores.papel : 'transparent',
          ...(esClaro
            ? { borderWidth: 1, borderColor: colores.borde }
            : { borderWidth: 1.5, borderColor: colores.bosqueBorde }),
        },
        style,
      ]}
    >
      <Icono nombre={icono} tamano={22} color={esClaro ? colores.tinta : colores.papel} />
    </Presionable>
  );
}
