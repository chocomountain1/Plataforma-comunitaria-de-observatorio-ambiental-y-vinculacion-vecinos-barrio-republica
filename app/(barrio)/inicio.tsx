import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import {
  Avatar,
  BarraDeEstadoDeReporte,
  TarjetaDeActividad,
  TarjetaDePropuesta,
  TarjetaDeReporte,
} from '@/componentes/app';
import {
  Boton,
  Chip,
  Columna,
  Fila,
  Icono,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { personas } from '@/datos/personas';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { espacio, radio } from '@/diseno/medidas';
import { estados } from '@/dominio/estados';
import { usarBarrio } from '@/estado/barrio';
import { usarPreferencias } from '@/estado/preferencias';

/** Pestanas que filtran el feed. */
const pestanas = ['Todo', 'Propuestas', 'Actividades', 'Reportes'] as const;
type Pestana = (typeof pestanas)[number];

/** Los tres accesos rapidos bajo la tarjeta de novedades. */
const atajos: { etiqueta: string; icono: NombreIcono; fondo: string; color: string; destino: string }[] = [
  { etiqueta: 'Propuestas', icono: 'idea', fondo: colores.menta, color: colores.verde, destino: '/propuestas' },
  { etiqueta: 'Actividades', icono: 'calendario', fondo: '#F5E6C8', color: '#8A5A12', destino: '/actividades' },
  { etiqueta: 'Observatorio', icono: 'grafico', fondo: '#DCE7F3', color: '#2C5A8C', destino: '/observatorio' },
];

/**
 * 2.1 Inicio.
 *
 * Lo primero que se ve es el avance de un reporte propio. Esa devolucion es
 * justamente lo que falto en las herramientas anteriores del barrio: sin
 * retorno visible, el vecino reporta una vez y no vuelve.
 */
export default function Inicio() {
  const { reportes, propuestas, actividades, confirmarReporte, descartarReporte, apoyarPropuesta } =
    usarBarrio();
  const { menosAnimaciones } = usarPreferencias();
  const [pestanaActiva, setPestanaActiva] = useState<Pestana>('Todo');
  const [confirmacionRespondida, setConfirmacionRespondida] = useState(false);

  const reporteQueAvanzo = reportes.find((r) => r.esMio && r.estado === 'gestion');
  const reportePorConfirmar = reportes.find((r) => r.estado === 'verificado' && r.subtipo !== undefined);
  const propuestaDestacada = propuestas[0];
  const actividadProxima = actividades[0];
  const reporteDelFeed = reportes.find((r) => !r.esMio && r.tieneFoto);

  const muestra = (seccion: Pestana) => pestanaActiva === 'Todo' || pestanaActiva === seccion;

  function responderConfirmacion(sigue: boolean) {
    if (reportePorConfirmar === undefined) return;
    if (sigue) {
      confirmarReporte(reportePorConfirmar.id);
    } else {
      descartarReporte(reportePorConfirmar.id);
    }
    setConfirmacionRespondida(true);
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 56, paddingBottom: espacio.bloque }}
      style={{ backgroundColor: colores.crema }}
    >
      <Fila
        repartir="space-between"
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.corto }}
      >
        <Columna separacion={espacio.minimo}>
          <Fila separacion={espacio.apretado}>
            <Icono nombre="pin" tamano={16} color={colores.verde} />
            <Texto tamano={14} peso="fuerte" color={colores.verde}>
              Barrio República
            </Texto>
          </Fila>
          <Texto tamano={30} familia="titulo" interlineado={1.1}>
            {`Hola, ${personas.rosa.nombre}`}
          </Texto>
        </Columna>
        <Presionable
          onPress={() => router.push('/perfil')}
          accessibilityRole="button"
          accessibilityLabel="Mi perfil y ajustes"
        >
          <Avatar persona={personas.rosa} tamano={48} conAro />
        </Presionable>
      </Fila>

      <Columna
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.amplio, paddingTop: espacio.medio }}
      >
        {reporteQueAvanzo === undefined ? null : (
          <Animated.View entering={menosAnimaciones ? undefined : FadeInDown.duration(420)}>
            <Tarjeta
              tono="bosque"
              onPress={() => router.push(`/reportes/${reporteQueAvanzo.id}`)}
              accesibilidad={`Tu reporte avanzó: ${reporteQueAvanzo.titulo}`}
              relleno={18}
            >
              <Fila repartir="space-between">
                <Texto tamano={13.5} peso="fuerte" color={colores.brote} espaciado={0.5}>
                  TU REPORTE AVANZÓ
                </Texto>
                <Icono nombre="flechaDerecha" tamano={22} color={colores.papel} />
              </Fila>
              <Texto tamano={18} peso="fuerte" color={colores.papel} interlineado={1.3}>
                {`${reporteQueAvanzo.titulo} ahora está `}
                <Texto tamano={18} peso="fuerte" color={colores.ambarSobreBosque}>
                  {estados[reporteQueAvanzo.estado].etiqueta.toLowerCase()}
                </Texto>
              </Texto>
              <BarraDeEstadoDeReporte estado={reporteQueAvanzo.estado} sobreBosque />
              <Texto tamano={14} color={colores.textoTenueSobreBosque}>
                {reporteQueAvanzo.seguimiento.find((e) => e.estado === 'gestion')?.detalle ?? ''}
                {' · hace 2 h'}
              </Texto>
            </Tarjeta>
          </Animated.View>
        )}

        {reportePorConfirmar === undefined ? null : (
          <Tarjeta>
            <Fila separacion={espacio.medio} alinear="flex-start">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radio.boton - 2,
                  backgroundColor: '#F5E6C8',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icono nombre="interrogacion" tamano={22} color="#8A5A12" />
              </View>
              <Columna crecer={1} separacion={3}>
                <Texto tamano={16.5} peso="fuerte" interlineado={1.3}>
                  {confirmacionRespondida
                    ? 'Gracias, el mapa queda al día'
                    : `¿Sigue el ${reportePorConfirmar.subtipo} en ${reportePorConfirmar.direccion}?`}
                </Texto>
                <Texto tamano={14} color={colores.grisTexto}>
                  {confirmacionRespondida
                    ? 'Tu respuesta ya se sumó al reporte'
                    : 'Tu respuesta ayuda a mantener el mapa al día'}
                </Texto>
              </Columna>
            </Fila>
            {confirmacionRespondida ? null : (
              <Fila separacion={espacio.comodo}>
                <Boton
                  texto="Sí, sigue"
                  variante="secundaria"
                  alto={48}
                  onPress={() => responderConfirmacion(true)}
                  vibrar
                  style={{ flex: 1 }}
                />
                <Boton
                  texto="Ya no está"
                  variante="tonal"
                  alto={48}
                  onPress={() => responderConfirmacion(false)}
                  vibrar
                  style={{ flex: 1 }}
                />
              </Fila>
            )}
          </Tarjeta>
        )}

        <Fila separacion={espacio.comodo}>
          {atajos.map((atajo) => (
            <Presionable
              key={atajo.etiqueta}
              onPress={() => router.push(atajo.destino as never)}
              accessibilityRole="button"
              accessibilityLabel={atajo.etiqueta}
              style={{
                flex: 1,
                minHeight: 92,
                backgroundColor: colores.papel,
                borderWidth: 1,
                borderColor: colores.borde,
                borderRadius: 18,
                padding: espacio.medio,
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radio.medio,
                  backgroundColor: atajo.fondo,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icono nombre={atajo.icono} tamano={20} color={atajo.color} />
              </View>
              <Texto tamano={15} peso="fuerte">
                {atajo.etiqueta}
              </Texto>
            </Presionable>
          ))}
        </Fila>
      </Columna>

      <Columna separacion={espacio.medio} style={{ paddingTop: 22 }}>
        <Texto
          tamano={22}
          familia="tituloSemi"
          style={{ paddingHorizontal: espacio.seccion }}
        >
          Lo último en el barrio
        </Texto>

        <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.amplio }}>
          {pestanas.map((pestana) => (
            <Chip
              key={pestana}
              texto={pestana}
              activo={pestanaActiva === pestana}
              onPress={() => setPestanaActiva(pestana)}
            />
          ))}
        </Fila>

        <Columna separacion={espacio.medio} style={{ paddingHorizontal: espacio.amplio }}>
          {muestra('Propuestas') && propuestaDestacada !== undefined ? (
            <Animated.View entering={menosAnimaciones ? undefined : FadeIn.duration(300)}>
              <TarjetaDePropuesta
                propuesta={propuestaDestacada}
                notaDeApoyo={
                  propuestaDestacada.quierenApoyar.length > 0
                    ? 'Estudiantes de FCFM quieren apoyar'
                    : undefined
                }
                onPress={() => router.push(`/propuestas/${propuestaDestacada.id}`)}
                onApoyar={() => apoyarPropuesta(propuestaDestacada.id)}
                onOpinar={() => router.push(`/propuestas/${propuestaDestacada.id}/conversacion`)}
              />
            </Animated.View>
          ) : null}

          {muestra('Actividades') && actividadProxima !== undefined ? (
            <Animated.View entering={menosAnimaciones ? undefined : FadeIn.duration(300)}>
              <TarjetaDeActividad
                actividad={actividadProxima}
                onPress={() => router.push(`/actividades/${actividadProxima.id}`)}
              />
            </Animated.View>
          ) : null}

          {muestra('Reportes') && reporteDelFeed !== undefined ? (
            <Animated.View entering={menosAnimaciones ? undefined : FadeIn.duration(300)}>
              <TarjetaDeReporte
                reporte={reporteDelFeed}
                onPress={() => router.push(`/reportes/${reporteDelFeed.id}`)}
              />
            </Animated.View>
          ) : null}
        </Columna>
      </Columna>
    </ScrollView>
  );
}
