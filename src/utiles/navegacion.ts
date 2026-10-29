import { router } from 'expo-router';

/**
 * Retroceso seguro.
 *
 * `router.back()` falla cuando la pantalla se abrio directamente, por ejemplo
 * desde un enlace compartido o al recargar en el navegador, porque no hay nada
 * atras. En ese caso conviene llevar a la pantalla que contiene a esta en vez
 * de dejar el boton muerto.
 */
export function crearVolver(destinoAlternativo: string): () => void {
  return () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(destinoAlternativo as never);
  };
}
