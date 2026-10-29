/**
 * Dos familias, igual que en los mockups. Fira Sans Condensed para titulos y
 * Atkinson Hyperlegible para todo lo demas, elegida porque fue disenada para
 * personas con baja vision.
 */
export const familias = {
  titulo: 'FiraSansCondensed-Bold',
  tituloSemi: 'FiraSansCondensed-SemiBold',
  texto: 'AtkinsonHyperlegible-Regular',
  textoFuerte: 'AtkinsonHyperlegible-Bold',
} as const;

/** Mapa de archivos que carga expo-font al arrancar. */
export const archivosDeFuente = {
  'FiraSansCondensed-Bold': require('../../assets/fonts/FiraSansCondensed-Bold.ttf'),
  'FiraSansCondensed-SemiBold': require('../../assets/fonts/FiraSansCondensed-SemiBold.ttf'),
  'AtkinsonHyperlegible-Regular': require('../../assets/fonts/AtkinsonHyperlegible-Regular.ttf'),
  'AtkinsonHyperlegible-Bold': require('../../assets/fonts/AtkinsonHyperlegible-Bold.ttf'),
};

/**
 * Escalones de texto del sistema visual. El tamano base es 17, pensado para
 * leerse sin lentes y con sol. La regla de accesibilidad prohibe bajar de 13.
 */
export const escalaTexto = {
  portada: 44,
  pantalla: 32,
  titulo: 28,
  seccion: 22,
  subtitulo: 19,
  destacado: 18,
  base: 17,
  cuerpo: 16,
  apoyo: 14,
  menor: 13,
} as const;

export type EscalonTexto = keyof typeof escalaTexto;
