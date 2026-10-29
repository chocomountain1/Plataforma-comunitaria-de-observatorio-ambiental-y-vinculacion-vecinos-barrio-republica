import { View } from 'react-native';

import { EtiquetaDeEstado } from './EtiquetasDeDominio';
import { FotoSimulada } from './FotoSimulada';
import { MarcaDeCategoria, RotuloDeCategoria } from './MarcaDeCategoria';
import { Columna, Etiqueta, Fila, Tarjeta, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { estados, totalDePasosDeEstado } from '@/dominio/estados';
import type { Reporte } from '@/dominio/tipos';
import { pluralizar } from '@/utiles/texto';

/**
 * Barra de avance de un reporte.
 *
 * Los tramos ya recorridos van en verde y el actual toma el color de su propio
 * estado, de modo que el color refuerza lo que dice la palabra sin reemplazarla.
 */
export function BarraDeEstadoDeReporte({
  estado,
  sobreBosque = false,
}: {
  estado: Reporte['estado'];
  /** Sobre fondo oscuro los verdes y el gris de pendiente no contrastan. */
  sobreBosque?: boolean;
}) {
  const pasoActual = estados[estado].paso;
  const colorRecorrido = sobreBosque ? colores.brote : colores.verde;
  const colorPendiente = sobreBosque ? colores.bosqueBarra : colores.borde;

  return (
    <Fila separacion={espacio.apretado} accesibilidad={`${estados[estado].etiqueta}, paso ${pasoActual} de ${totalDePasosDeEstado}`}>
      {Array.from({ length: totalDePasosDeEstado }, (_, posicion) => {
        const numeroDeTramo = posicion + 1;
        const colorActual = sobreBosque
          ? (estados[estado].id === 'gestion' ? colores.ambarSobreBosque : colorRecorrido)
          : (estados[estado].punto ?? colores.verde);
        const color =
          numeroDeTramo < pasoActual
            ? colorRecorrido
            : numeroDeTramo === pasoActual
              ? colorActual
              : colorPendiente;
        return (
          <View
            key={numeroDeTramo}
            style={{ flex: 1, height: 6, borderRadius: radio.redondo, backgroundColor: color }}
          />
        );
      })}
    </Fila>
  );
}

/**
 * Reporte en la lista "Mis reportes": el titulo, cuando se envio, la barra de
 * avance y cuantos vecinos lo confirman.
 */
export function TarjetaDeMiReporte({
  reporte,
  conNovedad = false,
  onPress,
}: {
  reporte: Reporte;
  /** Punto rojo cuando hubo un cambio que la persona todavia no vio. */
  conNovedad?: boolean;
  onPress: () => void;
}) {
  const pasoActual = estados[reporte.estado].paso;

  return (
    <Tarjeta
      onPress={onPress}
      accesibilidad={reporte.titulo}
      relleno={espacio.amplio - 2}
      separacion={espacio.medio}
      style={{ borderRadius: 20 }}
    >
      <Fila separacion={espacio.medio} alinear="flex-start">
        <MarcaDeCategoria categoria={reporte.categoria} tamano={40} redondeo={radio.boton - 2} />
        <Columna crecer={1} separacion={2}>
          <Texto tamano={16.5} peso="fuerte">
            {reporte.titulo}
          </Texto>
          <Texto tamano={14} color={colores.grisTexto}>
            {reporte.resumen}
          </Texto>
        </Columna>
        {conNovedad ? (
          <View
            accessible
            accessibilityLabel="Novedad"
            style={{
              width: 10,
              height: 10,
              borderRadius: radio.redondo,
              backgroundColor: colores.alerta,
              marginTop: espacio.corto,
            }}
          />
        ) : null}
      </Fila>

      <BarraDeEstadoDeReporte estado={reporte.estado} />

      <Fila repartir="space-between">
        <Etiqueta
          texto={`${estados[reporte.estado].etiqueta} · paso ${pasoActual} de ${totalDePasosDeEstado}`}
          fondo={estados[reporte.estado].fondo}
          color={estados[reporte.estado].texto}
          punto={estados[reporte.estado].punto}
          icono={estados[reporte.estado].icono}
        />
        <Texto tamano={14} color={colores.grisTexto}>
          {reporte.estado === 'recibido' && reporte.confirmaciones === 0
            ? 'Esperando confirmaciones'
            : `${reporte.confirmaciones} ${pluralizar(reporte.confirmaciones, 'confirma', 'confirman')}`}
        </Texto>
      </Fila>
    </Tarjeta>
  );
}

/**
 * Reporte en el feed del inicio y en los listados publicos. Lleva la foto
 * arriba cuando existe, porque es lo que hace reconocible el lugar.
 */
export function TarjetaDeReporte({
  reporte,
  onPress,
}: {
  reporte: Reporte;
  onPress: () => void;
}) {
  return (
    <Tarjeta onPress={onPress} accesibilidad={reporte.titulo} recortar>
      {reporte.tieneFoto ? <FotoSimulada alto={120} /> : null}
      <Columna
        separacion={espacio.normal}
        style={{
          paddingTop: espacio.amplio - 2,
          paddingHorizontal: espacio.amplio,
          paddingBottom: espacio.amplio,
        }}
      >
        <Fila repartir="space-between">
          <RotuloDeCategoria categoria={reporte.categoria} />
          <EtiquetaDeEstado estado={reporte.estado} />
        </Fila>
        <Texto tamano={17} peso="fuerte">
          {reporte.titulo}
        </Texto>
        <Texto tamano={14} color={colores.grisTexto}>
          {reporte.resumen}
        </Texto>
      </Columna>
    </Tarjeta>
  );
}
