import { colores } from '@/diseno/colores';
import type { Aviso } from '@/dominio/tipos';

/**
 * Avisos de la bandeja. El primero es el que tambien aparece como tarjeta
 * oscura en el inicio: un reporte propio que avanzo de estado, que es
 * justamente el retorno visible que pide la historia de usuario 5.
 */
export const avisosIniciales: Aviso[] = [
  {
    id: 'aviso-avance',
    momento: 'hoy',
    destacado: 'Tu reporte avanzó.',
    texto: 'Rama caída en Toesca ahora está en gestión.',
    cuando: 'Hace 2 h',
    icono: 'visto',
    color: '#174D34',
    fondo: colores.menta,
    leido: false,
    destino: '/reportes/rama-toesca',
  },
  {
    id: 'aviso-fcfm',
    momento: 'hoy',
    destacado: 'Estudiantes de FCFM',
    texto: 'quieren apoyar la propuesta que apoyaste: Punto limpio vecinal.',
    cuando: 'Hace 5 h',
    icono: 'birrete',
    color: '#244C78',
    fondo: '#DCE7F3',
    leido: false,
    pie: 'Ver quiénes son',
    destino: '/propuestas/punto-limpio',
  },
  {
    id: 'aviso-jornada',
    momento: 'hoy',
    destacado: 'Este sábado 10:00',
    texto: 'es la recuperación de la platabanda. Te toca llevar herramientas.',
    cuando: 'Recordatorio',
    icono: 'calendario',
    color: '#6F4A0E',
    fondo: '#F5E6C8',
    leido: false,
    destino: '/actividades/platabanda-toesca',
  },
  {
    id: 'aviso-respuesta',
    momento: 'semana',
    destacado: 'Tomás respondió tu comentario en',
    texto: 'Punto limpio vecinal',
    cuando: 'Martes',
    icono: 'globoDialogo',
    color: colores.grisTexto,
    fondo: colores.crema,
    leido: true,
    destino: '/propuestas/punto-limpio/conversacion',
  },
  {
    id: 'aviso-logro',
    momento: 'semana',
    destacado: 'Nuevo logro: Ojo atento',
    texto: '. Confirmaste 10 reportes de otros vecinos.',
    cuando: 'Lunes',
    icono: 'medalla',
    color: '#6F4A0E',
    fondo: '#F5E6C8',
    leido: true,
    destino: '/perfil',
  },
];
