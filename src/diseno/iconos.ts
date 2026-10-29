/**
 * Catalogo de iconos de la aplicacion.
 *
 * Los trazos estan copiados uno a uno desde los mockups, asi que cada icono se
 * dibuja exactamente igual que en el diseno aprobado. Todos comparten el lienzo
 * de 24 x 24 y se pintan con linea, nunca con relleno, para que hereden el
 * color del texto que acompanan.
 *
 * Para agregar un icono nuevo basta con sumar una entrada aqui. El componente
 * Icono y el tipo NombreIcono se actualizan solos.
 */

export type TrazoIcono =
  | { figura: 'linea'; d: string }
  | { figura: 'circulo'; cx: number; cy: number; r: number }
  | { figura: 'rectangulo'; x: number; y: number; ancho: number; alto: number; radio?: number };

function linea(d: string): TrazoIcono {
  return { figura: 'linea', d };
}

function circulo(cx: number, cy: number, r: number): TrazoIcono {
  return { figura: 'circulo', cx, cy, r };
}

function rectangulo(
  x: number,
  y: number,
  ancho: number,
  alto: number,
  radio?: number,
): TrazoIcono {
  return { figura: 'rectangulo', x, y, ancho, alto, radio };
}

export const iconos = {
  // Navegacion y flechas
  flechaIzquierda: [linea('m15 6-6 6 6 6')],
  flechaDerecha: [linea('m9 6 6 6-6 6')],
  chevronAbajo: [linea('m6 9 6 6 6-6')],
  cerrar: [linea('M6 6l12 12M18 6 6 18')],
  visto: [linea('m5 12.5 4.5 4.5L19 7.5')],
  mas: [linea('M12 5v14M5 12h14')],

  // Barra de navegacion principal
  casa: [linea('M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z')],
  mapa: [linea('M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z'), linea('M9 4v14M15 6v14')],
  portapapeles: [
    rectangulo(5, 4, 14, 17, 2),
    linea('M9 4V3h6v1M9 10h6M9 14h6M9 18h3'),
  ],
  campana: [
    linea('M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z'),
    linea('M10 20.5a2 2 0 0 0 4 0'),
  ],

  // Las ocho categorias de reporte, en el orden del sistema visual
  basura: [linea('M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13')],
  arbol: [
    linea('M12 21v-6'),
    linea('M12 3c-3.5 0-6 2.7-6 6 0 3 2.5 6 6 6s6-3 6-6c0-3.3-2.5-6-6-6z'),
  ],
  plaga: [
    rectangulo(8, 7, 8, 13, 4),
    linea('M12 7V5M4 12h4M16 12h4M5 18l3-2M19 18l-3-2M5 7l3 2M19 7l-3 2'),
  ],
  ruidoLuz: [
    linea('M4 9h4l5-4v14l-5-4H4z'),
    linea('M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12'),
  ],
  calle: [linea('M7 21 10 3M17 21 14 3M12 6v2M12 11v2M12 16v2')],
  mobiliario: [linea('M4 10h16M3 14h18M6 14v5M18 14v5M6 10V7M18 10V7')],
  patrimonio: [linea('M3 9 12 4l9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18')],
  otro: [circulo(6, 12, 1.3), circulo(12, 12, 1.3), circulo(18, 12, 1.3)],

  // Acciones sobre contenido
  idea: [
    linea('M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'),
  ],
  pulgarArriba: [
    linea('M7 11v9H4v-9zM7 11l4-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7'),
  ],
  globoDialogo: [linea('M4 5h16v11H9l-5 4z')],
  enviar: [linea('M4 12 20 4l-6 16-3-7z')],
  compartir: [
    circulo(6, 12, 2.5),
    circulo(18, 6, 2.5),
    circulo(18, 18, 2.5),
    linea('m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6'),
  ],
  lapiz: [linea('M4 20h4L19 9l-4-4L4 16z')],
  descargar: [linea('M12 4v11M7 10l5 5 5-5M5 20h14')],
  bandera: [linea('M5 21V4M5 4h11l-2 4 2 4H5')],
  enlace: [
    linea('M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'),
  ],

  // Mapa y ubicacion
  pin: [
    linea('M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z'),
    circulo(12, 9.5, 2.5),
  ],
  mira: [circulo(12, 12, 4), linea('M12 2v3M12 19v3M2 12h3M19 12h3')],
  capas: [linea('m12 3 9 5-9 5-9-5z'), linea('m3 13 9 5 9-5')],
  lupa: [circulo(11, 11, 6.5), linea('m16 16 4.5 4.5')],
  embudo: [linea('M4 5h16l-6 8v6l-4-2v-4z')],

  // Contenido y multimedia
  imagen: [
    rectangulo(3, 4, 18, 16, 2),
    circulo(9, 10, 2),
    linea('m3 18 6-5 4 3 3-2 5 4'),
  ],
  camara: [linea('M4 8h3l2-3h6l2 3h3v11H4z'), circulo(12, 13, 3.5)],
  documento: [rectangulo(5, 3, 14, 18, 2), linea('M9 8h6M9 12h6M9 16h3')],
  calendario: [
    rectangulo(3.5, 5, 17, 15, 2),
    linea('M3.5 10h17M8 3v4M16 3v4'),
  ],
  grafico: [linea('M4 20V10M10 20V4M16 20v-7M2 20h20')],

  // Personas e instituciones
  persona: [circulo(9, 8, 3.5), linea('M2.5 20a6.5 6.5 0 0 1 13 0')],
  personas: [
    circulo(9, 8, 3.5),
    linea('M2.5 20a6.5 6.5 0 0 1 13 0'),
    linea('M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6'),
  ],
  birrete: [linea('M2 9 12 4l10 5-10 5z'), linea('M6 11v5c3 2.5 9 2.5 12 0v-5')],
  comercio: [linea('M4 9 5.5 4h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6')],
  medalla: [circulo(12, 9, 5.5), linea('M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5')],

  // Estado, ayuda y confianza
  informacion: [circulo(12, 12, 9), linea('M12 11v5M12 7.5v.5')],
  interrogacion: [
    circulo(12, 12, 9),
    linea('M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17v.5'),
  ],
  reloj: [circulo(12, 12, 9), linea('M12 7v5l3 2')],
  escudo: [
    linea('M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z'),
    linea('m9 12 2 2 4-4'),
  ],
  ojo: [
    linea('M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z'),
    circulo(12, 12, 3),
  ],
  candado: [rectangulo(5, 11, 14, 10, 2), linea('M8 11V8a4 4 0 0 1 8 0v3')],
  sobre: [rectangulo(3, 5, 18, 14, 2), linea('m3 7 9 6 9-6')],
  deslizadores: [
    linea('M4 7h10M18 7h2M4 17h4M12 17h8'),
    circulo(16, 7, 2),
    circulo(10, 17, 2),
  ],

  /** Hoja del logotipo de Barrio Republica. */
  hoja: [linea('M5 19c0-8 5-14 15-14 0 10-6 15-14 15'), linea('M5 19 13 11')],
} satisfies Record<string, TrazoIcono[]>;

export type NombreIcono = keyof typeof iconos;
