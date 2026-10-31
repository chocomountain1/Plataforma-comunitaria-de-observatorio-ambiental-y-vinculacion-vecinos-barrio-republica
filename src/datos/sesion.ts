import type { Persona } from '@/dominio/tipos';
import { inicialDe } from '@/utiles/fechas';

import { cliente, exigirCliente } from './cliente';

/**
 * Entrar a la plataforma.
 *
 * El mecanismo lo decidio la contraparte el 19 de octubre: crear cuenta es
 * obligatorio, no hay contrasena y se entra con un codigo de seis numeros que
 * llega al correo. La cuenta no pide nombre real ni RUT.
 *
 * El por que de cada mitad: la cuenta obligatoria responde a que alguien
 * podria crearse varias identidades e inflar la priorizacion comunitaria. La
 * ausencia de contrasena responde a lo contrario, a que la friccion del
 * registro fue la barrera de abandono que mas aparecio en terreno, y a que el
 * Banco del Tiempo murio en parte por no tener recuperacion de contrasenas.
 */

type FilaDePersona = {
  id: string;
  seudonimo: string;
  vinculo: string;
  es_organizacion: boolean;
};

function personaDesde(fila: FilaDePersona): Persona {
  return {
    id: fila.id,
    nombre: fila.seudonimo,
    inicial: inicialDe(fila.seudonimo),
    vinculo: fila.vinculo,
    esOrganizacion: fila.es_organizacion,
  };
}

/** Manda el codigo al correo. Crea la cuenta si todavia no existe. */
export async function pedirCodigo(correo: string): Promise<void> {
  const { error } = await exigirCliente().auth.signInWithOtp({
    email: correo.trim().toLowerCase(),
    options: { shouldCreateUser: true },
  });
  if (error !== null) throw new Error(traducir(error.message));
}

/** Canjea el codigo por una sesion. */
export async function confirmarCodigo(correo: string, codigo: string): Promise<void> {
  const { error } = await exigirCliente().auth.verifyOtp({
    email: correo.trim().toLowerCase(),
    token: codigo.trim(),
    type: 'email',
  });
  if (error !== null) throw new Error(traducir(error.message));
}

export async function cerrarSesion(): Promise<void> {
  if (cliente === null) return;
  await cliente.auth.signOut();
}

/**
 * El perfil de quien tiene la sesion abierta, o nulo si todavia no lo creo.
 *
 * Entrar y tener perfil son dos cosas distintas: la cuenta nace con el
 * codigo al correo, y el seudonimo con que el barrio te reconoce se elige
 * despues, en el paso de perfil.
 */
export async function perfilActual(): Promise<Persona | null> {
  if (cliente === null) return null;

  const { data: sesion } = await cliente.auth.getSession();
  const identificador = sesion.session?.user.id;
  if (identificador === undefined) return null;

  const { data, error } = await cliente
    .from('personas')
    .select('id, seudonimo, vinculo, es_organizacion')
    .eq('id', identificador)
    .maybeSingle();

  if (error !== null) throw new Error(error.message);
  if (data === null) return null;
  return personaDesde(data as FilaDePersona);
}

/** Crea el perfil de quien acaba de entrar. */
export async function crearPerfil(seudonimo: string, vinculo: string): Promise<Persona> {
  const supabase = exigirCliente();
  const { data: sesion } = await supabase.auth.getSession();
  const identificador = sesion.session?.user.id;
  if (identificador === undefined) throw new Error('No hay sesión abierta');

  const { data, error } = await supabase
    .from('personas')
    .insert({ id: identificador, seudonimo: seudonimo.trim(), vinculo })
    .select('id, seudonimo, vinculo, es_organizacion')
    .single();

  if (error !== null) {
    if (error.code === '23505') throw new Error('Ese seudónimo ya lo usa alguien del barrio');
    throw new Error(error.message);
  }
  return personaDesde(data as FilaDePersona);
}

/** Avisa cuando la sesion se abre o se cierra, para que el estado reaccione. */
export function alCambiarLaSesion(hacer: () => void): () => void {
  if (cliente === null) return () => {};
  const { data } = cliente.auth.onAuthStateChange(() => hacer());
  return () => data.subscription.unsubscribe();
}

/**
 * Los mensajes de Supabase llegan en ingles y hablan de tokens. Se traducen a
 * algo que una vecina pueda entender, que es la regla de lenguaje del
 * sistema visual.
 */
function traducir(mensaje: string): string {
  const minusculas = mensaje.toLowerCase();
  if (minusculas.includes('invalid') && minusculas.includes('token')) {
    return 'Ese código no es correcto. Revísalo o pide uno nuevo.';
  }
  if (minusculas.includes('expired')) {
    return 'El código ya venció. Pide uno nuevo.';
  }
  if (minusculas.includes('rate limit') || minusculas.includes('too many')) {
    return 'Pediste varios códigos seguidos. Espera un momento y vuelve a intentar.';
  }
  if (minusculas.includes('invalid') && minusculas.includes('email')) {
    return 'Ese correo no parece válido.';
  }
  return mensaje;
}
