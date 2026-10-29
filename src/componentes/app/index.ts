/**
 * Componentes que ya conocen el dominio del barrio: reportes, propuestas,
 * actividades y el plano. Las pantallas se arman combinando estos con los
 * componentes base.
 */
export { Avatar } from './Avatar';
export { BarraNavegacion } from './BarraNavegacion';
export { Encabezado } from './Encabezado';
export { EtiquetaDeEstado, EtiquetaDeEtapa } from './EtiquetasDeDominio';
export { FotoSimulada } from './FotoSimulada';
export { MapaBarrio, type Ubicador } from './MapaBarrio';
export { LineaDeTiempo } from './LineaDeTiempo';
export { ChipDeCategoria, MarcaDeCategoria, RotuloDeCategoria } from './MarcaDeCategoria';
export { GrupoDeMarcadores, MarcadorMapa, MiUbicacion } from './MarcadorMapa';
export { CuadroDeFecha, FilaDeActividad, TarjetaDeActividad } from './TarjetaActividad';
export { FilaDePropuesta, TarjetaDePropuesta } from './TarjetaPropuesta';
export {
  BarraDeEstadoDeReporte,
  TarjetaDeMiReporte,
  TarjetaDeReporte,
} from './TarjetaReporte';
