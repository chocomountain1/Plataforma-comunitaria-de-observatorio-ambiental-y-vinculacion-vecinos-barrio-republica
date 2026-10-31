import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  EtiquetaDeEstado,
  GrupoDeMarcadores,
  MapaBarrio,
  MarcadorMapa,
  MiUbicacion,
  RotuloDeCategoria,
} from '@/componentes/app';
import { Boton, Chip, Columna, Fila, Icono, Presionable, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio, sombras } from '@/diseno/medidas';
import type { IdCapaDelCatastro } from '@/dominio/capas';
import { capasDelCatastro, colorDelElemento, esCapaDelCatastro } from '@/dominio/capas';
import { categorias } from '@/dominio/categorias';
import { familias } from '@/diseno/tipografia';
import { usarBarrio } from '@/estado/barrio';
import { usarElementosDelCatastro } from '@/estado/catastro';
import type { ElementoEnElMapa } from '@/dominio/tipos';
import { usarPreferencias } from '@/estado/preferencias';
import { agruparEnPantalla } from '@/utiles/agrupacion';

/** Filtros del carril superior del mapa. */
const filtros = ['Todo', 'Reportes', 'Propuestas', 'Actividades'] as const;
type Filtro = (typeof filtros)[number];

/**
 * Lado de la celda con que se agrupan las chinchetas del catastro.
 *
 * Son 44 px, la misma medida minima que el sistema visual exige para una zona
 * tocable: por debajo de eso dos chinchetas se pisan y dejan de poder tocarse
 * por separado.
 */
const LADO_DE_AGRUPACION = 44;

/** Donde esta parada la persona dentro del plano. */
const UBICACION_PROPIA = { latitud: -33.453450, longitud: -70.661741 };

/**
 * 2.2 Mapa del barrio.
 *
 * Es el eje visual de la aplicacion. Reune en un solo plano lo que se reporta,
 * lo que se propone y lo que se organiza, que es la informacion que hoy esta
 * repartida entre un tablero congelado y los grupos de mensajeria.
 */
export default function Mapa() {
  const { reportes, propuestas, actividades, capas, confirmarReporte } = usarBarrio();

  // Las capas del catastro no dependen de los chips de arriba, que filtran lo
  // que pasa ahora. Se encienden y apagan en la pantalla de capas, tal como
  // separa los dos grupos el diseno.
  const capasEncendidas = useMemo(
    () =>
      capas
        .filter((capa) => capa.grupo === 'catastro' && capa.activa)
        .map((capa) => capa.id)
        .filter(esCapaDelCatastro),
    [capas],
  );
  const catastro = usarElementosDelCatastro(capasEncendidas);
  const { menosAnimaciones } = usarPreferencias();
  const margenes = useSafeAreaInsets();
  const [filtro, setFiltro] = useState<Filtro>('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState<string>('microbasural-sazie');

  const muestra = (seccion: Filtro) => filtro === 'Todo' || filtro === seccion;
  const reporteSeleccionado = reportes.find((reporte) => reporte.id === seleccionado);

  return (
    <View style={{ flex: 1, backgroundColor: colores.mapaFondo }}>
      <MapaBarrio alCambiarElArea={catastro.alCambiarElArea}>
        {(ubicar) => (
          <>
            <MiUbicacion posicion={ubicar(UBICACION_PROPIA, 22)} />

            {muestra('Reportes')
              ? reportes
                  .filter((reporte) => reporte.estado !== 'resuelto')
                  .map((reporte) => {
                    const elegido = reporte.id === seleccionado;
                    const tamano = elegido ? 52 : 40;
                    return (
                      <MarcadorMapa
                        key={reporte.id}
                        icono={categorias[reporte.categoria].icono}
                        color={categorias[reporte.categoria].color}
                        accesibilidad={`${categorias[reporte.categoria].etiquetaCorta}, ${reporte.direccion}${elegido ? ', seleccionado' : ''}`}
                        posicion={ubicar(reporte.posicion, elegido ? tamano + 8 : tamano)}
                        tamano={tamano}
                        seleccionado={elegido}
                        onPress={() => setSeleccionado(reporte.id)}
                      />
                    );
                  })
              : null}

            {muestra('Propuestas')
              ? propuestas.map((propuesta) => (
                  <MarcadorMapa
                    key={propuesta.id}
                    icono="idea"
                    color={colores.verde}
                    forma="cuadrado"
                    accesibilidad={`Propuesta: ${propuesta.titulo}`}
                    posicion={ubicar(propuesta.posicion, 40)}
                    onPress={() => router.push(`/propuestas/${propuesta.id}`)}
                  />
                ))
              : null}

            {muestra('Actividades')
              ? actividades.map((actividad) => (
                  <MarcadorMapa
                    key={actividad.id}
                    icono="calendario"
                    color={colores.ocre}
                    forma="cuadrado"
                    accesibilidad={`Actividad: ${actividad.titulo}`}
                    posicion={ubicar(actividad.posicion, 40)}
                    onPress={() => router.push(`/actividades/${actividad.id}`)}
                  />
                ))
              : null}

            {agruparEnPantalla(
              catastro.elementos,
              (elemento) => elemento.posicion,
              catastro.zoom,
              LADO_DE_AGRUPACION,
            ).map((grupo) => {
              const primero = grupo.elementos[0];
              if (primero === undefined) return null;

              if (grupo.elementos.length > 1) {
                return (
                  <GrupoDeMarcadores
                    key={grupo.clave}
                    cantidad={grupo.elementos.length}
                    posicion={ubicar(grupo.posicion, 48)}
                  />
                );
              }

              const capa = capasDelCatastro[primero.capa as IdCapaDelCatastro];
              return (
                <MarcadorMapa
                  key={grupo.clave}
                  icono={capa.icono}
                  color={colorDelElemento(
                    primero.capa as IdCapaDelCatastro,
                    primero.estadoDePlatabanda,
                  )}
                  tamano={34}
                  accesibilidad={descripcionDelElemento(primero)}
                  posicion={ubicar(primero.posicion, 34)}
                />
              );
            })}
          </>
        )}
      </MapaBarrio>

      <Columna
        separacion={espacio.comodo}
        style={{
          position: 'absolute',
          left: espacio.amplio,
          right: espacio.amplio,
          top: margenes.top + espacio.normal,
        }}
      >
        <Fila separacion={espacio.comodo}>
          <Fila
            crecer={1}
            separacion={espacio.comodo}
            style={[
              {
                height: 52,
                borderRadius: radio.caja,
                backgroundColor: colores.papel,
                paddingHorizontal: espacio.amplio - 2,
              },
              sombras.flotante,
            ]}
          >
            <Icono nombre="lupa" tamano={22} color={colores.grisTexto} />
            <CampoDeBusqueda valor={busqueda} onCambiar={setBusqueda} />
          </Fila>
          <Presionable
            onPress={() => router.push('/mapa/capas')}
            accessibilityRole="button"
            accessibilityLabel="Capas del mapa"
            style={[
              {
                width: 52,
                height: 52,
                borderRadius: radio.caja,
                backgroundColor: colores.papel,
                alignItems: 'center',
                justifyContent: 'center',
              },
              sombras.flotante,
            ]}
          >
            <Icono nombre="capas" tamano={24} color={colores.tinta} />
          </Presionable>
        </Fila>

        <Fila separacion={espacio.normal}>
          {filtros.map((opcion) => (
            <Chip
              key={opcion}
              texto={opcion}
              activo={filtro === opcion}
              onPress={() => setFiltro(opcion)}
              flotante
              alto={40}
              tamanoDeTexto={14.5}
            />
          ))}
        </Fila>
      </Columna>

      <Presionable
        accessibilityRole="button"
        accessibilityLabel="Ir a mi ubicación"
        style={[
          {
            position: 'absolute',
            right: espacio.amplio,
            bottom: 300,
            width: 52,
            height: 52,
            borderRadius: radio.caja,
            backgroundColor: colores.papel,
            alignItems: 'center',
            justifyContent: 'center',
          },
          sombras.flotante,
        ]}
      >
        <Icono nombre="mira" tamano={24} color={colores.ubicacionPropia} />
      </Presionable>

      {reporteSeleccionado === undefined ? null : (
        <Animated.View
          key={reporteSeleccionado.id}
          entering={menosAnimaciones ? undefined : FadeInDown.duration(260)}
          style={[
            {
              marginTop: 'auto',
              backgroundColor: colores.papel,
              borderTopLeftRadius: radio.hoja,
              borderTopRightRadius: radio.hoja,
              paddingTop: espacio.comodo,
              paddingHorizontal: 18,
              paddingBottom: espacio.amplio - 2,
              gap: espacio.comodo,
            },
            sombras.hoja,
          ]}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 40,
              height: 5,
              borderRadius: radio.redondo,
              backgroundColor: '#D6CDB8',
            }}
          />
          <Fila repartir="space-between" separacion={espacio.normal}>
            <RotuloDeCategoria
              categoria={reporteSeleccionado.categoria}
              detalle={reporteSeleccionado.subtipo}
            />
            <EtiquetaDeEstado estado={reporteSeleccionado.estado} />
          </Fila>
          <Texto tamano={19} peso="fuerte" interlineado={1.25}>
            {reporteSeleccionado.direccion}
          </Texto>
          <Texto tamano={14.5} color={colores.grisTexto}>
            {`${reporteSeleccionado.publicado} · ${reporteSeleccionado.confirmaciones} vecinos lo confirman${
              reporteSeleccionado.propuestas.length > 0
                ? ` · ${reporteSeleccionado.propuestas.length} propuesta para resolverlo`
                : ''
            }`}
          </Texto>
          <Fila separacion={espacio.comodo}>
            <Boton
              texto="Ver detalle"
              alto={50}
              onPress={() => router.push(`/reportes/${reporteSeleccionado.id}`)}
              style={{ flex: 1 }}
            />
            <Boton
              texto="¿Sigue ahí?"
              variante="secundaria"
              alto={50}
              onPress={() => confirmarReporte(reporteSeleccionado.id)}
              vibrar
              style={{ flex: 1 }}
            />
          </Fila>
        </Animated.View>
      )}
    </View>
  );
}

/** Campo de busqueda del mapa, sin borde propio porque ya va dentro del cuadro. */
function CampoDeBusqueda({ valor, onCambiar }: { valor: string; onCambiar: (texto: string) => void }) {
  return (
    <TextInput
      value={valor}
      onChangeText={onCambiar}
      placeholder="Buscar calle o lugar"
      placeholderTextColor={colores.grisTexto}
      accessibilityLabel="Buscar calle o lugar"
      allowFontScaling={false}
      style={{
        flex: 1,
        minWidth: 0,
        fontFamily: familias.texto,
        fontSize: 16.5,
        color: colores.tinta,
      }}
    />
  );
}

/**
 * Lo que el lector de pantalla anuncia de un elemento del catastro.
 *
 * Lleva el dato que distingue a cada capa, porque el icono y el color no
 * bastan: la regla de accesibilidad del sistema visual pide que los iconos
 * vayan siempre acompanados de texto.
 */
function descripcionDelElemento(elemento: ElementoEnElMapa): string {
  const capa = capasDelCatastro[elemento.capa as IdCapaDelCatastro];
  const detalles = [
    elemento.estadoDePlatabanda,
    elemento.tipoDeMicrobasural,
    elemento.direccion,
    elemento.areaM2 > 0 ? `${Math.round(elemento.areaM2)} metros cuadrados` : undefined,
    elemento.largoM > 0 ? `${Math.round(elemento.largoM)} metros de largo` : undefined,
  ].filter((parte): parte is string => parte !== undefined);

  return [capa.etiqueta, ...detalles].join(', ');
}
