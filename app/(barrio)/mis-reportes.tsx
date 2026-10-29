import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { TarjetaDeMiReporte } from '@/componentes/app';
import { Aviso, Chip, Columna, Fila, Pantalla, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { pluralizar } from '@/utiles/texto';
import { usarBarrio } from '@/estado/barrio';

/** Las tres cosas que una persona puede tener en curso. */
const secciones = ['Reportes', 'Propuestas', 'Actividades'] as const;
type Seccion = (typeof secciones)[number];

/**
 * 4.1 Mis reportes.
 *
 * Reune todo lo que la persona tiene en curso. La lista separa lo abierto de lo
 * resuelto porque lo que interesa de un reporte propio es saber si avanzo.
 */
export default function MisReportes() {
  const { reportes, propuestas, actividades } = usarBarrio();
  const [seccion, setSeccion] = useState<Seccion>('Reportes');
  const [verResueltos, setVerResueltos] = useState(false);

  const mios = reportes.filter((reporte) => reporte.esMio);
  const abiertos = mios.filter((reporte) => reporte.estado !== 'resuelto');
  const resueltos = mios.filter((reporte) => reporte.estado === 'resuelto');
  const visibles = verResueltos ? resueltos : abiertos;

  const misPropuestas = propuestas.filter((propuesta) => propuesta.apoyadaPorMi);
  const misActividades = actividades.filter((actividad) => actividad.miInscripcion !== null);

  const cuantos: Record<Seccion, number> = {
    Reportes: mios.length,
    Propuestas: misPropuestas.length,
    Actividades: misActividades.length,
  };

  return (
    <Pantalla>
      <Columna
        separacion={14}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.comodo }}
      >
        <Texto tamano={30} familia="titulo">
          Mis reportes
        </Texto>
        <Fila separacion={espacio.normal}>
          {secciones.map((opcion) => (
            <Chip
              key={opcion}
              texto={`${opcion} · ${cuantos[opcion]}`}
              activo={seccion === opcion}
              onPress={() => setSeccion(opcion)}
              tamanoDeTexto={14}
            />
          ))}
        </Fila>
        {seccion === 'Reportes' ? (
          <Fila separacion={espacio.normal}>
            <Chip
              texto={`Abiertos · ${abiertos.length}`}
              activo={!verResueltos}
              onPress={() => setVerResueltos(false)}
            />
            <Chip
              texto={`Resueltos · ${resueltos.length}`}
              activo={verResueltos}
              onPress={() => setVerResueltos(true)}
            />
          </Fila>
        ) : null}
      </Columna>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingTop: espacio.apretado,
          paddingBottom: espacio.bloque,
          gap: espacio.comodo,
        }}
      >
        {seccion === 'Reportes'
          ? visibles.map((reporte) => (
              <TarjetaDeMiReporte
                key={reporte.id}
                reporte={reporte}
                conNovedad={reporte.estado === 'gestion'}
                onPress={() => router.push(`/reportes/${reporte.id}`)}
              />
            ))
          : null}

        {seccion === 'Propuestas'
          ? misPropuestas.map((propuesta) => (
              <Columna
                key={propuesta.id}
                separacion={espacio.corto}
                style={{
                  backgroundColor: colores.papel,
                  borderWidth: 1,
                  borderColor: colores.borde,
                  borderRadius: 20,
                  padding: espacio.amplio,
                }}
              >
                <Texto
                  tamano={16.5}
                  peso="fuerte"
                  onPress={() => router.push(`/propuestas/${propuesta.id}`)}
                >
                  {propuesta.titulo}
                </Texto>
                <Texto tamano={14} color={colores.grisTexto}>
                  {`La apoyas · ${propuesta.apoyos} apoyos en total`}
                </Texto>
              </Columna>
            ))
          : null}

        {seccion === 'Actividades'
          ? misActividades.map((actividad) => (
              <Columna
                key={actividad.id}
                separacion={espacio.corto}
                style={{
                  backgroundColor: colores.papel,
                  borderWidth: 1,
                  borderColor: colores.borde,
                  borderRadius: 20,
                  padding: espacio.amplio,
                }}
              >
                <Texto
                  tamano={16.5}
                  peso="fuerte"
                  onPress={() => router.push(`/actividades/${actividad.id}`)}
                >
                  {actividad.titulo}
                </Texto>
                <Texto tamano={14} color={colores.grisTexto}>
                  {`${actividad.diaSemana} ${actividad.dia} ${actividad.mes} · ${
                    actividad.miInscripcion === 'voluntario' ? 'Voluntaria' : 'Asistente'
                  }`}
                </Texto>
              </Columna>
            ))
          : null}

        {seccion === 'Reportes' && visibles.length === 0 ? (
          <Aviso
            tono="neutro"
            texto={
              verResueltos
                ? 'Todavía no tienes reportes resueltos.'
                : 'No tienes reportes abiertos. Toca Reportar para abrir uno.'
            }
          />
        ) : null}

        {seccion === 'Reportes' && !verResueltos && resueltos.length > 0 ? (
          <Aviso
            tono="logro"
            icono="visto"
            texto={`${resueltos.length} ${pluralizar(resueltos.length, 'reporte resuelto', 'reportes resueltos')} este mes`}
          />
        ) : null}
      </ScrollView>
    </Pantalla>
  );
}
