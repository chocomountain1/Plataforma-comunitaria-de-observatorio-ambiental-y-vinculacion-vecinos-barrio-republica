import type { Persona } from '@/dominio/tipos';

/**
 * Vecinas, vecinos y organizaciones que aparecen en el prototipo. Son los
 * mismos de los mockups, de modo que las pantallas cuentan una sola historia
 * coherente de punta a punta.
 */
export const personas = {
  rosa: { id: 'rosa', nombre: 'Rosa', inicial: 'R', vinculo: 'Vive en el barrio' },
  julia: { id: 'julia', nombre: 'Julia R.', inicial: 'J', vinculo: 'Vive en el barrio' },
  tomas: { id: 'tomas', nombre: 'Tomás', inicial: 'T', vinculo: 'Estudia en el barrio' },
  hernan: { id: 'hernan', nombre: 'Don Hernán', inicial: 'H', vinculo: 'Vive en el barrio' },
  camila: { id: 'camila', nombre: 'Camila', inicial: 'C', vinculo: 'Gestora territorial' },
  marta: { id: 'marta', nombre: 'Marta', inicial: 'M', vinculo: 'Tiene un local' },
  republicaCircular: {
    id: 'republicaCircular',
    nombre: 'República Circular',
    inicial: 'RC',
    vinculo: 'Gestión territorial · organización verificada',
    esOrganizacion: true,
  },
} satisfies Record<string, Persona>;

/** La persona que usa la aplicacion durante la demostracion. */
export const personaActual: Persona = personas.rosa;
