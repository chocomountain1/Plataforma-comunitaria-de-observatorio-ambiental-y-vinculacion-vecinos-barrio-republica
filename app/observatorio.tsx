import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Encabezado } from '@/componentes/app';
import {
  Aviso,
  Boton,
  Chip,
  Columna,
  Fila,
  FilaDeLista,
  Icono,
  ListaAgrupada,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import {
  areaVerde,
  loQueFaltaSaber,
  platabandas,
  reportesDelMes,
  trabajosDevueltos,
} from '@/datos/observatorio';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { crearVolver } from '@/utiles/navegacion';

/** Las tres vistas del observatorio. */
const vistas = ['Resumen', 'Mapa de calor', 'Datos'] as const;

/**
 * 8.3 Observatorio del barrio.
 *
 * Cruza el catastro de 2022 con lo que reportan los vecinos hoy. Las cifras del
 * diagnostico son las reales de Republica Circular, y los reportes de vecinos
 * son datos de ejemplo del prototipo, lo que la pantalla dice de forma
 * explicita para no confundir una cosa con la otra.
 */
export default function Observatorio() {
  const volver = crearVolver('/inicio');
  const [vista, setVista] = useState<string>('Resumen');

  const totalDePlatabandas = platabandas.tramos.reduce((suma, tramo) => suma + tramo.valor, 0);
  const mayorDeLosReportes = Math.max(...reportesDelMes.filas.map((fila) => fila.valor));

  return (
    <Pantalla desplazable espacioAlFinal={espacio.bloque}>
      <Encabezado
        titulo="Observatorio del barrio"
        subtitulo="Catastro 2022 y reportes de vecinos"
        tamanoDeTitulo={26}
        onVolver={volver}
      />

      <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.seccion }}>
        {vistas.map((opcion) => (
          <Chip
            key={opcion}
            texto={opcion}
            activo={vista === opcion}
            onPress={() => setVista(opcion)}
            tamanoDeTexto={14}
          />
        ))}
      </Fila>

      <Columna
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.amplio, paddingTop: espacio.amplio }}
      >
        <Tarjeta relleno={18} separacion={espacio.medio}>
          <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
            PLATABANDAS
          </Texto>
          <Texto tamano={19} familia="tituloSemi" interlineado={1.2}>
            {platabandas.titular}
          </Texto>

          <Fila
            separacion={2}
            alinear="stretch"
            style={{ height: 14, borderRadius: radio.redondo, overflow: 'hidden' }}
          >
            {platabandas.tramos.map((tramo) => (
              <View
                key={tramo.etiqueta}
                style={{
                  flex: tramo.valor / totalDePlatabandas,
                  backgroundColor: tramo.color,
                }}
              />
            ))}
          </Fila>

          {platabandas.tramos.map((tramo) => (
            <Fila key={tramo.etiqueta} separacion={espacio.normal}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: radio.redondo,
                  backgroundColor: tramo.color,
                }}
              />
              <Texto tamano={15} style={{ flex: 1 }}>
                {tramo.etiqueta}
              </Texto>
              <Texto tamano={16} peso="fuerte">
                {String(tramo.valor)}
              </Texto>
            </Fila>
          ))}

          <Texto tamano={13.5} color={colores.grisTexto}>
            {platabandas.nota}
          </Texto>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={espacio.medio}>
          <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
            ÁREA VERDE POR HABITANTE
          </Texto>
          <Texto tamano={19} familia="tituloSemi" interlineado={1.2}>
            {areaVerde.titular}
          </Texto>

          {areaVerde.barras.map((barra) => (
            <Columna key={barra.etiqueta} separacion={espacio.corto}>
              <Fila repartir="space-between" separacion={espacio.normal}>
                <Texto
                  tamano={15}
                  peso={barra.destacada === true ? 'fuerte' : 'normal'}
                  style={{ flex: 1 }}
                >
                  {barra.etiqueta}
                </Texto>
                <Texto
                  tamano={15}
                  peso="fuerte"
                  color={barra.destacada === true ? colores.alerta : colores.tinta}
                >
                  {barra.valor}
                </Texto>
              </Fila>
              <View
                style={{
                  height: 10,
                  borderRadius: radio.redondo,
                  backgroundColor: colores.borde,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${Math.max(3, barra.proporcion * 100)}%`,
                    height: 10,
                    borderRadius: radio.redondo,
                    backgroundColor: barra.destacada === true ? colores.alerta : colores.verde,
                  }}
                />
              </View>
            </Columna>
          ))}

          <Texto tamano={13} color={colores.grisTexto} interlineado={1.35}>
            {areaVerde.nota}
          </Texto>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={espacio.medio}>
          <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
            LO QUE FALTA SABER
          </Texto>
          <Texto tamano={19} familia="tituloSemi" interlineado={1.2}>
            {loQueFaltaSaber.titular}
          </Texto>

          {loQueFaltaSaber.filas.map((fila) => (
            <Columna key={fila.etiqueta} separacion={espacio.corto}>
              <Fila repartir="space-between" separacion={espacio.normal}>
                <Texto tamano={15} style={{ flex: 1 }}>
                  {fila.etiqueta}
                </Texto>
                <Texto tamano={15} peso="fuerte" color={colores.grisTexto}>
                  {`${fila.conseguido} de ${fila.total}`}
                </Texto>
              </Fila>
              <View
                style={{
                  height: 8,
                  borderRadius: radio.redondo,
                  backgroundColor: colores.borde,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${Math.max(1, (fila.conseguido / fila.total) * 100)}%`,
                    height: 8,
                    backgroundColor: colores.ocre,
                  }}
                />
              </View>
            </Columna>
          ))}

          <Boton
            texto="Ayudar a completarlo"
            variante="tonal"
            icono="mas"
            onPress={() => router.push('/mapa/ficha')}
          />
        </Tarjeta>

        <Tarjeta relleno={18} separacion={espacio.medio}>
          <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
            {reportesDelMes.titulo}
          </Texto>

          {reportesDelMes.filas.map((fila) => (
            <Fila key={fila.etiqueta} separacion={espacio.comodo}>
              <Texto tamano={15} style={{ width: 130 }}>
                {fila.etiqueta}
              </Texto>
              <View style={{ flex: 1, height: 18, justifyContent: 'center' }}>
                <View
                  style={{
                    width: `${(fila.valor / mayorDeLosReportes) * 100}%`,
                    height: 18,
                    borderRadius: radio.chico - 1,
                    backgroundColor: fila.color,
                  }}
                />
              </View>
              <Texto tamano={15} peso="fuerte" style={{ width: 26 }} alineacion="right">
                {String(fila.valor)}
              </Texto>
            </Fila>
          ))}

          <Aviso tono="neutro" texto={reportesDelMes.nota} tamanoDeTexto={13} />
        </Tarjeta>

        <ListaAgrupada encabezado="TRABAJOS DEVUELTOS AL BARRIO">
          {trabajosDevueltos.map((trabajo, posicion) => (
            <FilaDeLista
              key={trabajo.id}
              titulo={trabajo.titulo}
              detalle={trabajo.autor}
              ultima={posicion === trabajosDevueltos.length - 1}
              conFlecha
              adorno={<Icono nombre="documento" tamano={24} color={colores.grisTexto} />}
            />
          ))}
        </ListaAgrupada>

        <Tarjeta relleno={18} separacion={espacio.medio}>
          <Texto tamano={19} familia="tituloSemi">
            Datos abiertos para investigar
          </Texto>
          <Texto tamano={14.5} color={colores.grisTexto} interlineado={1.4}>
            Sin nombres ni correos. Ubicaciones redondeadas a la cuadra.
          </Texto>
          <Boton texto="Descargar CSV o GeoJSON" variante="secundaria" icono="descargar" />
        </Tarjeta>
      </Columna>
    </Pantalla>
  );
}
