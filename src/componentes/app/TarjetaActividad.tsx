import { View } from 'react-native';

import { Boton, Columna, Fila, Tarjeta, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import type { Actividad } from '@/dominio/tipos';

/** Cuadro con la fecha que identifica a cada actividad. */
export function CuadroDeFecha({
  actividad,
  ancho = 64,
  tono = 'calido',
}: {
  actividad: Actividad;
  ancho?: number;
  tono?: 'calido' | 'menta';
}) {
  const esCalido = tono === 'calido';
  return (
    <View
      accessible
      accessibilityLabel={`${actividad.diaSemana} ${actividad.dia} de ${actividad.mes}`}
      style={{
        width: ancho,
        borderRadius: radio.caja,
        backgroundColor: esCalido ? '#F5E6C8' : colores.menta,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: espacio.normal,
      }}
    >
      <Texto tamano={13} peso="fuerte" color={esCalido ? '#6F4A0E' : '#174D34'}>
        {actividad.diaSemana}
      </Texto>
      <Texto
        tamano={28}
        familia="titulo"
        color={esCalido ? '#6F4A0E' : '#174D34'}
        interlineado={1}
      >
        {String(actividad.dia)}
      </Texto>
      <Texto tamano={13} peso="fuerte" color={esCalido ? '#6F4A0E' : '#174D34'}>
        {actividad.mes}
      </Texto>
    </View>
  );
}

/**
 * Actividad en el feed y en la lista: la fecha a la izquierda y la invitacion a
 * sumarse a la derecha.
 */
export function TarjetaDeActividad({
  actividad,
  onPress,
  onSumarse,
}: {
  actividad: Actividad;
  onPress: () => void;
  onSumarse?: () => void;
}) {
  const faltan = actividad.voluntariosNecesarios - actividad.voluntarios;

  return (
    <Tarjeta separacion={espacio.amplio - 2} style={{ flexDirection: 'row' }}>
      <CuadroDeFecha actividad={actividad} />
      <Columna crecer={1} separacion={espacio.corto}>
        <Texto tamano={13.5} peso="fuerte" color="#8A5A12">
          {`ACTIVIDAD · ${actividad.hora}`}
        </Texto>
        <Texto tamano={17} peso="fuerte" interlineado={1.3} onPress={onPress}>
          {actividad.titulo}
        </Texto>
        <Texto tamano={14} color={colores.grisTexto}>
          {faltan > 0
            ? `${actividad.inscritos} inscritos · faltan ${faltan} voluntarios`
            : `${actividad.inscritos} inscritos`}
        </Texto>
        <Boton
          texto={actividad.miInscripcion === null ? 'Me sumo' : 'Ya me sumé'}
          variante="tonal"
          alto={44}
          tamanoDeTexto={15}
          ancho="contenido"
          onPress={onSumarse ?? onPress}
          style={{ marginTop: espacio.minimo }}
        />
      </Columna>
    </Tarjeta>
  );
}

/** Version compacta de la lista de actividades, sin boton. */
export function FilaDeActividad({
  actividad,
  onPress,
}: {
  actividad: Actividad;
  onPress: () => void;
}) {
  return (
    <Tarjeta
      onPress={onPress}
      accesibilidad={actividad.titulo}
      separacion={espacio.medio}
      style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      <CuadroDeFecha
        actividad={actividad}
        ancho={56}
        tono={actividad.miInscripcion === null ? 'calido' : 'menta'}
      />
      <Columna crecer={1} separacion={espacio.apretado}>
        <Fila separacion={espacio.corto}>
          <Texto tamano={13.5} peso="fuerte" color="#8A5A12">
            {actividad.hora}
          </Texto>
        </Fila>
        <Texto tamano={16.5} peso="fuerte" interlineado={1.25}>
          {actividad.titulo}
        </Texto>
        <Texto tamano={14} color={colores.grisTexto}>
          {actividad.lugar}
        </Texto>
      </Columna>
    </Tarjeta>
  );
}
