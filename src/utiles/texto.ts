/**
 * Elige entre singular y plural segun la cantidad. Evita que la aplicacion
 * muestre cosas como "1 propuestas apoyadas", que se nota descuidado.
 */
export function pluralizar(cantidad: number, singular: string, plural: string): string {
  return cantidad === 1 ? singular : plural;
}
