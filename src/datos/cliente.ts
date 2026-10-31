import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Conexion con Supabase.
 *
 * El prototipo tiene que seguir corriendo sin backend, porque asi se muestra
 * en reuniones y se prueba con vecinos. Por eso la conexion es opcional: si no
 * hay credenciales configuradas, hayBackend queda en falso y el estado sigue
 * trabajando con los datos de ejemplo en memoria.
 *
 * Las credenciales van en un archivo .env.local, que el .gitignore excluye.
 * Ver .env.example.
 */

const direccion = process.env.EXPO_PUBLIC_SUPABASE_URL;
const claveAnonima = process.env.EXPO_PUBLIC_SUPABASE_CLAVE_ANONIMA;

export const hayBackend: boolean =
  typeof direccion === 'string' &&
  direccion !== '' &&
  typeof claveAnonima === 'string' &&
  claveAnonima !== '';

/**
 * Nulo mientras no haya credenciales. Las funciones de datos lo comprueban
 * antes de usarlo, en vez de dejar que reviente en medio de una pantalla.
 */
export const cliente: SupabaseClient | null = hayBackend
  ? createClient(direccion as string, claveAnonima as string, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        // En un telefono no hay barra de direcciones de donde leer la sesion,
        // y en el navegador la aplicacion no usa enlaces de retorno.
        detectSessionInUrl: false,
      },
    })
  : null;

/** Atajo para las funciones de datos, que no pueden trabajar sin conexion. */
export function exigirCliente(): SupabaseClient {
  if (cliente === null) {
    throw new Error(
      'No hay conexion con Supabase. Falta configurar EXPO_PUBLIC_SUPABASE_URL y ' +
        'EXPO_PUBLIC_SUPABASE_CLAVE_ANONIMA en .env.local.',
    );
  }
  return cliente;
}
