import { View } from 'react-native';

import { Columna, Fila, Icono, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { estados } from '@/dominio/estados';
import type { EventoDeSeguimiento, Reporte } from '@/dominio/tipos';

/**
 * Recorrido de un reporte, de Recibido a Resuelto.
 *
 * Los pasos que todavia no ocurren se muestran igual, apagados y con la frase
 * que explica que va a pasar en cada uno. Que el vecino sepa de antemano como
 * sigue el proceso es parte de la promesa de la aplicacion.
 */
export function LineaDeTiempo({ reporte }: { reporte: Reporte }) {
  const estadoActual = estados[reporte.estado];

  return (
    <Columna>
      {reporte.seguimiento.map((evento, posicion) => (
        <PasoDeLaLinea
          key={evento.estado}
          evento={evento}
          esElActual={evento.estado === reporte.estado}
          colorActual={estadoActual.punto ?? colores.verde}
          fondoActual={estadoActual.fondo}
          esElUltimo={posicion === reporte.seguimiento.length - 1}
        />
      ))}
    </Columna>
  );
}

function PasoDeLaLinea({
  evento,
  esElActual,
  colorActual,
  fondoActual,
  esElUltimo,
}: {
  evento: EventoDeSeguimiento;
  esElActual: boolean;
  colorActual: string;
  fondoActual: string;
  esElUltimo: boolean;
}) {
  const datos = estados[evento.estado];

  return (
    <Fila separacion={14} alinear="stretch">
      <Columna alinear="center">
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: radio.redondo,
            alignItems: 'center',
            justifyContent: 'center',
            ...(evento.ocurrio
              ? {
                  backgroundColor: esElActual ? colorActual : colores.verde,
                  ...(esElActual ? { borderWidth: 5, borderColor: fondoActual } : null),
                }
              : {
                  backgroundColor: colores.papel,
                  borderWidth: 2.5,
                  borderColor: colores.bordeFuerte,
                }),
          }}
        >
          {evento.ocurrio ? (
            <Icono nombre="visto" tamano={16} color={colores.blanco} grosor={2.8} />
          ) : null}
        </View>
        {esElUltimo ? null : (
          <View
            style={{
              flex: 1,
              width: 3,
              minHeight: 22,
              backgroundColor: evento.ocurrio && !esElActual ? colores.verde : colores.borde,
            }}
          />
        )}
      </Columna>

      <Columna
        crecer={1}
        separacion={espacio.minimo}
        style={{ paddingBottom: esElUltimo ? 0 : espacio.amplio }}
      >
        <Texto
          tamano={16.5}
          peso="fuerte"
          color={evento.ocurrio ? colores.tinta : colores.grisTexto}
        >
          {datos.etiqueta}
          {esElActual ? (
            <Texto tamano={16.5} color={colorActual}>
              {' · ahora'}
            </Texto>
          ) : null}
        </Texto>
        <Texto tamano={14} color={colores.grisTexto} interlineado={1.35}>
          {evento.fecha === undefined ? evento.detalle : `${evento.fecha} · ${evento.detalle}`}
        </Texto>
      </Columna>
    </Fila>
  );
}
