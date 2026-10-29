import { Redirect } from 'expo-router';

/**
 * Destino central de la barra de navegacion.
 *
 * La pulsacion ya se intercepta en la disposicion de pestanas, asi que esta
 * pantalla casi nunca se dibuja. Existe para que la pestana tenga una ruta
 * valida y para que, si alguien llega por un enlace directo, igual termine en
 * el primer paso del asistente.
 */
export default function AtajoDeReportar() {
  return <Redirect href="/reportar/categoria" />;
}
