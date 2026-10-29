/**
 * Como se escriben las fechas de cara a la persona.
 *
 * La base guarda fechas reales porque el mecanismo de priorizacion necesita
 * restarlas. Lo que los mockups muestran, "recien" o "hace 2 h", es una forma
 * de escribirlas y se calcula aqui, al mostrar. Guardar el texto seria
 * guardar algo que envejece solo.
 */

const MESES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const UN_MINUTO = 60 * 1000;
const UNA_HORA = 60 * UN_MINUTO;
const UN_DIA = 24 * UNA_HORA;

/** Dia y mes abreviados, como los rotula la linea de tiempo: "3 nov". */
export function diaYMes(fecha: Date): string {
  return `${fecha.getDate()} ${MESES[fecha.getMonth()] ?? ''}`;
}

/**
 * Antiguedad en el formato largo de las listas. Pasada una semana deja de
 * contar dias y muestra la fecha, que es mas util que "hace 23 d".
 */
export function hace(fecha: Date, ahora: Date = new Date()): string {
  const transcurrido = ahora.getTime() - fecha.getTime();

  if (transcurrido < 2 * UN_MINUTO) return 'recién';
  if (transcurrido < UNA_HORA) return `hace ${Math.floor(transcurrido / UN_MINUTO)} min`;
  if (transcurrido < UN_DIA) return `hace ${Math.floor(transcurrido / UNA_HORA)} h`;
  if (transcurrido < 2 * UN_DIA) return 'ayer';
  if (transcurrido < 7 * UN_DIA) return `hace ${Math.floor(transcurrido / UN_DIA)} días`;
  return diaYMes(fecha);
}

/** Antiguedad apretada, la de los comentarios: "4 d", "2 h". */
export function antiguedadCorta(fecha: Date, ahora: Date = new Date()): string {
  const transcurrido = ahora.getTime() - fecha.getTime();

  if (transcurrido < UNA_HORA) return `${Math.max(1, Math.floor(transcurrido / UN_MINUTO))} min`;
  if (transcurrido < UN_DIA) return `${Math.floor(transcurrido / UNA_HORA)} h`;
  return `${Math.floor(transcurrido / UN_DIA)} d`;
}

/** La inicial del avatar sale del seudonimo, no se guarda en la base. */
export function inicialDe(seudonimo: string): string {
  const limpio = seudonimo.trim();
  if (limpio === '') return '?';
  const palabras = limpio.split(/\s+/);
  // Las organizaciones llevan dos letras, como "RC" para Republica Circular.
  if (palabras.length > 1 && palabras.every((palabra) => palabra.length > 2)) {
    return `${palabras[0]?.[0] ?? ''}${palabras[1]?.[0] ?? ''}`.toUpperCase();
  }
  return (limpio[0] ?? '?').toUpperCase();
}
