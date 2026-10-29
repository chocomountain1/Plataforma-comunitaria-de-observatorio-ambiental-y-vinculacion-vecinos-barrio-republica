import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Avatar, CuadroDeFecha, Encabezado } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  Columna,
  Fila,
  Icono,
  Opcion,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import type { ModoDeParticipar } from '@/dominio/tipos';
import { usarActividad, usarBarrio } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 6.2 Detalle de actividad.
 *
 * Participar se divide en dos: asistir, que no compromete a nada, y ser
 * voluntario, que toma una tarea concreta. Separarlo hace que quien organiza
 * sepa con cuanta gente cuenta de verdad.
 */
export default function DetalleDeActividad() {
  const volver = crearVolver('/actividades');
  const { id } = useLocalSearchParams<{ id: string }>();
  const actividad = usarActividad(id);
  const { propuestas, inscribirseEnActividad } = usarBarrio();

  const [modo, setModo] = useState<ModoDeParticipar>('asistir');
  const [tarea, setTarea] = useState<string | null>(null);

  if (actividad === undefined) {
    return (
      <Pantalla>
        <Encabezado titulo="Actividad no encontrada" onVolver={volver} />
      </Pantalla>
    );
  }

  const propuestaDeOrigen = propuestas.find(
    (propuesta) => propuesta.id === actividad.naceDePropuesta,
  );
  const faltan = actividad.voluntariosNecesarios - actividad.voluntarios;
  const yaEstaInscrita = actividad.miInscripcion !== null;

  function inscribirse() {
    if (actividad === undefined) return;
    inscribirseEnActividad(actividad.id, modo, tarea ?? undefined);
    router.push(`/actividades/inscripcion?id=${actividad.id}`);
  }

  return (
    <Pantalla desplazable espacioAlFinal={espacio.amplio}>
      <Encabezado onVolver={volver} />

      <Fila separacion={espacio.amplio} style={{ paddingHorizontal: espacio.seccion }}>
        <CuadroDeFecha actividad={actividad} ancho={72} />
        <Columna crecer={1} separacion={espacio.corto}>
          <Texto tamano={26} familia="titulo" interlineado={1.12}>
            {actividad.titulo}
          </Texto>
        </Columna>
      </Fila>

      <Columna
        separacion={espacio.comodo}
        style={{ paddingHorizontal: espacio.seccion, paddingTop: espacio.amplio }}
      >
        <Fila separacion={espacio.comodo}>
          <Icono nombre="reloj" tamano={20} color={colores.grisTexto} />
          <Texto tamano={16} style={{ flex: 1 }}>
            {`Sábado ${actividad.dia} de noviembre · ${actividad.horario}`}
          </Texto>
        </Fila>
        <Fila separacion={espacio.comodo}>
          <Icono nombre="pin" tamano={20} color={colores.grisTexto} />
          <Texto tamano={16} style={{ flex: 1 }}>
            {actividad.lugar}
          </Texto>
          <Texto
            tamano={15}
            peso="fuerte"
            color={colores.verde}
            onPress={() => router.push('/mapa')}
          >
            Ver en el mapa
          </Texto>
        </Fila>
      </Columna>

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.amplio }}>
        <Fila separacion={espacio.medio}>
          <Avatar persona={actividad.organiza} tamano={44} />
          <Columna crecer={1}>
            <Texto tamano={16.5} peso="fuerte">
              {actividad.organiza.nombre}
            </Texto>
            <Texto tamano={13.5} color={colores.grisTexto}>
              {actividad.organiza.esOrganizacion === true
                ? 'Organización verificada'
                : actividad.organiza.vinculo}
            </Texto>
          </Columna>
          {actividad.organiza.esOrganizacion === true ? (
            <Icono nombre="escudo" tamano={22} color={colores.verde} />
          ) : null}
        </Fila>

        {propuestaDeOrigen === undefined ? null : (
          <Aviso tono="logro" icono="idea">
            <Texto tamano={14.5} color="#174D34" interlineado={1.4}>
              {'Nace de la propuesta '}
              <Texto
                tamano={14.5}
                peso="fuerte"
                color="#174D34"
                style={{ textDecorationLine: 'underline' }}
                onPress={() => router.push(`/propuestas/${propuestaDeOrigen.id}`)}
              >
                {propuestaDeOrigen.titulo}
              </Texto>
              {`, apoyada por ${propuestaDeOrigen.apoyos} vecinos`}
            </Texto>
          </Aviso>
        )}

        <Texto tamano={16} interlineado={1.45}>
          {actividad.descripcion}
        </Texto>
      </Tarjeta>

      {yaEstaInscrita ? (
        <Aviso
          tono="logro"
          icono="visto"
          texto={`Ya te inscribiste como ${actividad.miInscripcion === 'voluntario' ? 'voluntaria' : 'asistente'}.`}
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
        />
      ) : (
        <Columna
          separacion={espacio.comodo}
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.seccion }}
        >
          <Texto tamano={21} familia="tituloSemi">
            ¿Cómo quieres participar?
          </Texto>
          <Opcion
            texto="Asistir"
            detalle="Llego, ayudo un rato y conozco a los vecinos"
            seleccion="unica"
            activa={modo === 'asistir'}
            onPress={() => setModo('asistir')}
          />
          <Opcion
            texto={faltan > 0 ? `Ser voluntario · faltan ${faltan}` : 'Ser voluntario'}
            detalle="Me comprometo con una tarea"
            seleccion="unica"
            activa={modo === 'voluntario'}
            onPress={() => setModo('voluntario')}
          />

          {modo === 'voluntario' && actividad.tareas.length > 0 ? (
            <Columna separacion={espacio.normal} style={{ paddingLeft: espacio.amplio }}>
              {actividad.tareas.map((cual) => (
                <Opcion
                  key={cual}
                  texto={cual}
                  seleccion="unica"
                  activa={tarea === cual}
                  onPress={() => setTarea(cual)}
                />
              ))}
            </Columna>
          ) : null}
        </Columna>
      )}

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}>
        <Fila separacion={espacio.medio}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: radio.medio,
              backgroundColor: colores.menta,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icono nombre="personas" tamano={22} color={colores.verde} />
          </View>
          <Texto tamano={16} style={{ flex: 1 }} interlineado={1.35}>
            <Texto tamano={16} peso="fuerte">
              {`${actividad.inscritos} inscritos`}
            </Texto>
            {` · ${actividad.voluntarios} de ellos como voluntarios`}
          </Texto>
        </Fila>
      </Tarjeta>

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
        <Texto tamano={21} familia="tituloSemi">
          Qué llevar
        </Texto>
        <Texto tamano={16} interlineado={1.45}>
          {actividad.queLlevar}
        </Texto>
      </Tarjeta>

      <BarraInferior alFinal={false} style={{ marginTop: espacio.seccion }}>
        {yaEstaInscrita ? (
          <Boton
            texto="Ver mi inscripción"
            variante="tonal"
            alto={56}
            tamanoDeTexto={18}
            onPress={() => router.push(`/actividades/inscripcion?id=${actividad.id}`)}
          />
        ) : (
          <Boton
            texto={modo === 'voluntario' ? 'Inscribirme como voluntario' : 'Inscribirme'}
            alto={56}
            tamanoDeTexto={18}
            deshabilitado={modo === 'voluntario' && actividad.tareas.length > 0 && tarea === null}
            onPress={inscribirse}
            vibrar
          />
        )}
      </BarraInferior>
    </Pantalla>
  );
}
