/**
 * Paleta de la plataforma, tomada tal cual de la lamina "0 Sistema visual" de
 * los mockups. Ningun color se escribe suelto en las pantallas: si hace falta
 * uno nuevo, se agrega aqui con su nombre.
 */
export const colores = {
  /** Fondo de las pantallas oscuras y titulos sobre crema. */
  bosque: '#0F3D2A',
  /** Color de accion principal. */
  verde: '#1D5E40',
  /** Acento vivo sobre fondo oscuro. */
  brote: '#6DBE5C',
  /** Fondo de apoyo suave, confirmaciones y resueltos. */
  menta: '#DCEBD8',
  /** Fondo general de la aplicacion. */
  crema: '#F4EFE3',
  /** Fondo de tarjetas y hojas. */
  papel: '#FFFCF5',
  /** Acento calido para actividades. */
  ocre: '#A86E1C',
  /** Color del texto principal. */
  tinta: '#17231C',

  /** Gris de apoyo. Cumple 4,5:1 sobre crema y sobre papel. */
  grisTexto: '#56625B',
  /** Borde de tarjetas sobre crema. */
  borde: '#E2DACA',
  /** Borde de controles e interactivos en reposo. */
  bordeFuerte: '#CFC6B1',
  /** Fondo del lienzo detras de las pantallas de bienvenida. */
  lienzo: '#E9E3D3',
  /** Fondo de campos deshabilitados y separadores suaves. */
  cremaHundida: '#E9E3D3',

  /** Verdes de apoyo que solo aparecen sobre fondo bosque. */
  bosqueClaro: '#17503A',
  bosqueMedio: '#164A34',
  bosqueBorde: '#3E7258',
  bosqueBarra: '#2D5E47',
  textoSobreBosque: '#D9E6DA',
  textoTenueSobreBosque: '#BFD6C3',

  /** Blanco puro, reservado para texto sobre marcadores de color. */
  blanco: '#FFFFFF',

  /** Rojo de avisos y de errores. Solo para contadores y alertas. */
  alerta: '#A8321F',
  /** Amarillo de "en gestion" sobre fondo bosque. */
  ambarSobreBosque: '#F2C879',

  /** Azul de la ubicacion propia en el mapa. */
  ubicacionPropia: '#2C6FD1',
  /** Fondo del mapa y de sus manzanas. */
  mapaFondo: '#E8E1CF',
  mapaVerde: '#C6DBB3',
  mapaManzana: '#D9CFB8',
  mapaCalle: '#FBF8F0',
  mapaLimite: '#E2D9C3',
  mapaTexto: '#857C69',

  /** Trama diagonal que reemplaza a las fotos en el prototipo. */
  fotoTramaClara: '#E3DAC6',
  fotoTramaOscura: '#DCD2BC',
  fotoIcono: '#8C8370',
} as const;

export type NombreColor = keyof typeof colores;
