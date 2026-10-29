import { Platform, type ViewStyle } from 'react-native';

/** Separaciones que se repiten en los mockups. */
export const espacio = {
  minimo: 2,
  apretado: 4,
  corto: 6,
  normal: 8,
  comodo: 10,
  medio: 12,
  amplio: 16,
  seccion: 20,
  bloque: 24,
} as const;

/** Radios de esquina. El valor "redondo" convierte cualquier caja en pildora. */
export const radio = {
  chico: 7,
  medio: 11,
  boton: 14,
  caja: 16,
  tarjeta: 22,
  hoja: 26,
  redondo: 999,
} as const;

/**
 * Alturas minimas de zona tocable. La regla de accesibilidad del sistema pide
 * 44 px para cualquier elemento y 56 para las acciones principales.
 */
export const alturaTocable = {
  minima: 44,
  control: 48,
  boton: 52,
  principal: 56,
  destacada: 58,
} as const;

/**
 * Las sombras se declaran aqui porque iOS y Android las describen distinto y
 * repetir los dos juegos de propiedades en cada pantalla ensucia el codigo.
 */
function sombra(
  desplazamientoY: number,
  difuminado: number,
  opacidad: number,
  elevacion: number,
): ViewStyle {
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#17231C',
      shadowOffset: { width: 0, height: desplazamientoY },
      shadowOpacity: opacidad,
      shadowRadius: difuminado,
    },
    default: { elevation: elevacion },
  }) as ViewStyle;
}

export const sombras = {
  /** Marcadores del mapa y chips flotantes. */
  suave: sombra(2, 8, 0.12, 2),
  /** Botones elevados y marcadores grandes. */
  media: sombra(4, 10, 0.2, 4),
  /** Controles flotantes sobre el mapa. */
  flotante: sombra(4, 16, 0.14, 6),
  /** Hoja inferior. La sombra va hacia arriba. */
  hoja: sombra(-6, 24, 0.14, 12),
} as const;
