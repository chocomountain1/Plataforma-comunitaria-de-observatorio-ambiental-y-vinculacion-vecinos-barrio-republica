import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  Avatar,
  Encabezado,
  EtiquetaDeEstado,
  FotoSimulada,
  LineaDeTiempo,
  RotuloDeCategoria,
} from '@/componentes/app';
import {
  Aviso,
  Boton,
  BotonCircular,
  Columna,
  Etiqueta,
  Fila,
  Pantalla,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { personas } from '@/datos/personas';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { etapas } from '@/dominio/estados';
import { usarBarrio, usarReporte } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 4.2 Detalle y estado del reporte, y 4.3 cuando ya esta resuelto.
 *
 * Es la pantalla que sostiene la promesa de la aplicacion: aqui se ve quien
 * hizo que y cuando. Un reporte resuelto muestra ademas el antes y el despues,
 * la evidencia de cierre.
 */
export default function DetalleDeReporte() {
  const volver = crearVolver('/mis-reportes');
  const { id } = useLocalSearchParams<{ id: string }>();
  const reporte = usarReporte(id);
  const { propuestas, confirmarReporte, descartarReporte } = usarBarrio();
  const [respondido, setRespondido] = useState(false);

  if (reporte === undefined) {
    return (
      <Pantalla>
        <Encabezado titulo="Reporte no encontrado" onVolver={volver} />
      </Pantalla>
    );
  }

  const estaResuelto = reporte.estado === 'resuelto';
  const propuestasRelacionadas = propuestas.filter((propuesta) =>
    reporte.propuestas.includes(propuesta.id),
  );

  return (
    <Pantalla desplazable espacioAlFinal={espacio.bloque}>
      <Fila
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.amplio, paddingBottom: espacio.medio }}
      >
        <BotonCircular icono="flechaIzquierda" accesibilidad="Volver" onPress={volver} />
        <View style={{ flex: 1 }} />
        <BotonCircular icono="compartir" accesibilidad="Compartir" />
      </Fila>

      {reporte.tieneFoto ? (
        estaResuelto ? (
          <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.amplio }}>
            <FotoSimulada
              alto={150}
              rotulo="Antes · 3 nov"
              accesibilidad="Foto antes de resolver"
              style={{ flex: 1, borderRadius: radio.caja, overflow: 'hidden' }}
            />
            <FotoSimulada
              alto={150}
              rotulo="Después · 12 nov"
              accesibilidad="Foto después de resolver"
              style={{ flex: 1, borderRadius: radio.caja, overflow: 'hidden' }}
            />
          </Fila>
        ) : (
          <FotoSimulada
            alto={200}
            accesibilidad="Foto del reporte"
            style={{
              marginHorizontal: espacio.amplio,
              borderRadius: radio.tarjeta,
              overflow: 'hidden',
            }}
          />
        )
      ) : null}

      <Columna
        separacion={espacio.normal}
        style={{ paddingHorizontal: espacio.amplio, paddingTop: espacio.amplio }}
      >
        <Fila repartir="space-between" separacion={espacio.normal}>
          <RotuloDeCategoria
            categoria={reporte.categoria}
            detalle={reporte.subtipo}
          />
          <EtiquetaDeEstado estado={reporte.estado} alto={30} tamanoDeTexto={13.5} />
        </Fila>
        <Texto tamano={28} familia="titulo" interlineado={1.1}>
          {reporte.titulo}
        </Texto>
        <Texto tamano={14.5} color={colores.grisTexto}>
          {`Reportado por ${reporte.autor?.nombre ?? 'alguien anónimo'} · ${reporte.publicado}`}
        </Texto>
      </Columna>

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: 18 }} relleno={18}>
        <Texto tamano={21} familia="tituloSemi">
          {estaResuelto ? 'Qué se hizo' : '¿En qué va?'}
        </Texto>
        <LineaDeTiempo reporte={reporte} />
      </Tarjeta>

      {estaResuelto ? (
        <Columna
          separacion={espacio.medio}
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
        >
          <Tarjeta tono="menta">
            <Fila separacion={espacio.medio}>
              <Avatar persona={personas.republicaCircular} tamano={44} />
              <Columna crecer={1} separacion={espacio.minimo}>
                <Texto tamano={16.5} peso="fuerte" color="#174D34">
                  {personas.republicaCircular.nombre}
                </Texto>
                <Texto tamano={13.5} color="#174D34">
                  {personas.republicaCircular.vinculo}
                </Texto>
              </Columna>
            </Fila>
          </Tarjeta>

          <Tarjeta>
            <Texto tamano={17} peso="fuerte">
              ¿Quedó bien resuelto?
            </Texto>
            <Fila separacion={espacio.normal}>
              {['Sí', 'A medias', 'No'].map((opcion) => (
                <Boton
                  key={opcion}
                  texto={opcion}
                  variante="secundaria"
                  alto={48}
                  onPress={() => setRespondido(true)}
                  style={{ flex: 1 }}
                />
              ))}
            </Fila>
            {respondido ? (
              <Aviso tono="logro" texto="Gracias, tu respuesta quedó registrada." />
            ) : null}
          </Tarjeta>

          <Aviso
            tono="neutro"
            icono="reloj"
            texto="Este punto queda en observación por 30 días. Si vuelve la basura, avísanos y el reporte se reabre."
          />
          <Boton texto="Volvió a aparecer" variante="secundaria" icono="bandera" />
        </Columna>
      ) : (
        <Tarjeta
          tono="bosque"
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
          relleno={espacio.amplio}
        >
          <Columna separacion={espacio.minimo}>
            <Texto tamano={17} peso="fuerte" color={colores.papel}>
              ¿Sigue ahí?
            </Texto>
            <Texto tamano={14} color={colores.textoTenueSobreBosque}>
              {respondido
                ? 'Gracias, tu respuesta ya se sumó'
                : `${reporte.confirmaciones} vecinos lo confirman`}
            </Texto>
          </Columna>
          {respondido ? null : (
            <Fila separacion={espacio.comodo}>
              <Boton
                texto="Sí, sigue"
                variante="brote"
                alto={50}
                onPress={() => {
                  confirmarReporte(reporte.id);
                  setRespondido(true);
                }}
                vibrar
                style={{ flex: 1, backgroundColor: colores.papel }}
              />
              <Boton
                texto="Ya no está"
                variante="contornoClaro"
                alto={50}
                onPress={() => {
                  descartarReporte(reporte.id);
                  setRespondido(true);
                }}
                vibrar
                style={{ flex: 1 }}
              />
            </Fila>
          )}
        </Tarjeta>
      )}

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
        <Texto tamano={21} familia="tituloSemi">
          Detalles
        </Texto>
        <Fila separacion={espacio.normal} alinear="stretch">
          <DatoBreve etiqueta="Cómo se formó" valor={reporte.comoSeFormo ?? 'Sin dato'} />
          <DatoBreve etiqueta="Desde" valor={reporte.desdeCuando ?? 'Sin dato'} />
        </Fila>
        {reporte.descripcion === undefined ? null : (
          <Texto tamano={15.5} color={colores.grisTexto} interlineado={1.4}>
            {`«${reporte.descripcion}»`}
          </Texto>
        )}
        <Boton
          texto="Ver en el mapa"
          variante="secundaria"
          icono="mapa"
          onPress={() => router.push('/mapa')}
        />
      </Tarjeta>

      <Columna
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
      >
        <Texto tamano={21} familia="tituloSemi">
          {`Ideas para resolverlo · ${propuestasRelacionadas.length}`}
        </Texto>
        {propuestasRelacionadas.map((propuesta) => (
          <Tarjeta
            key={propuesta.id}
            onPress={() => router.push(`/propuestas/${propuesta.id}`)}
            accesibilidad={propuesta.titulo}
            separacion={espacio.normal}
          >
            <Texto tamano={16.5} peso="fuerte" interlineado={1.3}>
              {propuesta.titulo}
            </Texto>
            <Fila separacion={espacio.normal}>
              <Etiqueta
                texto={etapas[propuesta.etapa].etiqueta}
                fondo={etapas[propuesta.etapa].fondo}
                color={etapas[propuesta.etapa].texto}
              />
              <Texto tamano={14} color={colores.grisTexto}>
                {`${propuesta.apoyos} apoyos`}
              </Texto>
            </Fila>
          </Tarjeta>
        ))}
        <Boton
          texto="Proponer otra idea"
          variante="secundaria"
          icono="mas"
          onPress={() => router.push('/propuestas/nueva/idea')}
        />
      </Columna>

      <Columna
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
      >
        <Texto tamano={21} familia="tituloSemi">
          {`Comentarios · ${reporte.comentarios.length}`}
        </Texto>
        {reporte.comentarios.slice(0, 1).map((comentario) => (
          <Tarjeta key={comentario.id} separacion={espacio.normal}>
            <Fila separacion={espacio.comodo}>
              <Avatar persona={comentario.autor} tamano={36} />
              <Texto tamano={14.5} color={colores.grisTexto} style={{ flex: 1 }}>
                <Texto tamano={14.5} peso="fuerte">
                  {comentario.autor.nombre}
                </Texto>
                {` · ${comentario.autor.vinculo} · ${comentario.cuando}`}
              </Texto>
            </Fila>
            <Texto tamano={15.5} interlineado={1.4}>
              {comentario.texto}
            </Texto>
          </Tarjeta>
        ))}
        {reporte.comentarios.length > 1 ? (
          <Presionable
            accessibilityRole="button"
            accessibilityLabel={`Ver los ${reporte.comentarios.length} comentarios`}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <Texto tamano={16} peso="fuerte" color={colores.verde}>
              {`Ver los ${reporte.comentarios.length} comentarios`}
            </Texto>
          </Presionable>
        ) : null}
      </Columna>

      <Fila
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.seccion }}
      >
        <Boton texto="Siguiendo" variante="tonal" icono="campana" style={{ flex: 1 }} />
        <Boton texto="Compartir" variante="secundaria" icono="compartir" style={{ flex: 1 }} />
      </Fila>
    </Pantalla>
  );
}

/** Dato corto del bloque de detalles. */
function DatoBreve({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <Columna
      crecer={1}
      separacion={espacio.minimo}
      style={{ backgroundColor: colores.crema, borderRadius: radio.boton, padding: espacio.comodo }}
    >
      <Texto tamano={12.5} color={colores.grisTexto}>
        {etiqueta}
      </Texto>
      <Texto tamano={15} peso="fuerte">
        {valor}
      </Texto>
    </Columna>
  );
}
