import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Avatar, Encabezado, EtiquetaDeEtapa } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  Columna,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { etapas, listaDeEtapas } from '@/dominio/estados';
import type { ApoyoNecesario, Propuesta } from '@/dominio/tipos';
import { usarBarrio, usarPropuesta } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 5.4 Detalle de propuesta.
 *
 * Reune la idea, en que etapa va, cuanto apoyo tiene, que le falta y quien se
 * ofrecio a ayudar. Cada apoyo vale lo mismo sin importar quien lo da: fue una
 * decision explicita para no reintroducir jerarquias entre vecinos.
 */
export default function DetalleDePropuesta() {
  const volver = crearVolver('/propuestas');
  const { id } = useLocalSearchParams<{ id: string }>();
  const propuesta = usarPropuesta(id);
  const { apoyarPropuesta } = usarBarrio();

  if (propuesta === undefined) {
    return (
      <Pantalla>
        <Encabezado titulo="Propuesta no encontrada" onVolver={volver} />
      </Pantalla>
    );
  }

  return (
    <Pantalla desplazable espacioAlFinal={espacio.amplio}>
      <Encabezado onVolver={volver} />

      <Columna separacion={espacio.comodo} style={{ paddingHorizontal: espacio.seccion }}>
        <Fila separacion={espacio.normal}>
          <EtiquetaDeEtapa etapa={propuesta.etapa} alto={30} tamanoDeTexto={13.5} />
          <Texto tamano={13.5} color={colores.grisTexto}>
            {propuesta.eje}
          </Texto>
        </Fila>
        <Texto tamano={28} familia="titulo" interlineado={1.12}>
          {propuesta.titulo}
        </Texto>
        <Fila separacion={espacio.comodo}>
          <Avatar persona={propuesta.autor} tamano={40} />
          <Columna crecer={1}>
            <Texto tamano={16} peso="fuerte">
              {propuesta.autor.nombre}
            </Texto>
            <Texto tamano={13.5} color={colores.grisTexto}>
              {`${propuesta.autor.vinculo} · ${propuesta.publicada}`}
            </Texto>
          </Columna>
        </Fila>
      </Columna>

      <BarraDeEtapas propuesta={propuesta} />

      <Tarjeta
        tono="bosque"
        relleno={18}
        separacion={14}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.amplio }}
      >
        <Fila repartir="space-between" separacion={espacio.comodo}>
          <Columna>
            <Texto tamano={40} familia="titulo" color={colores.papel} interlineado={1}>
              {String(propuesta.apoyos)}
            </Texto>
            <Texto tamano={15} color={colores.textoTenueSobreBosque}>
              vecinos apoyan esta idea
            </Texto>
          </Columna>
          <CaritasDeApoyo />
        </Fila>
        <Boton
          texto={propuesta.apoyadaPorMi ? 'Ya la apoyas' : 'Apoyar esta propuesta'}
          icono="pulgarArriba"
          variante="brote"
          alto={54}
          tamanoDeTexto={17}
          onPress={() => apoyarPropuesta(propuesta.id)}
          vibrar
        />
        <Texto tamano={13.5} color={colores.textoTenueSobreBosque} alineacion="center">
          Cada apoyo vale lo mismo, sin importar quién lo da.
        </Texto>
      </Tarjeta>

      {propuesta.respondeA === undefined ? null : (
        <Aviso
          tono="neutro"
          icono="pin"
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
        >
          <Texto tamano={14.5} color={colores.grisTexto} interlineado={1.4}>
            <Texto tamano={14.5} peso="fuerte" color={colores.tinta}>
              Responde a{' '}
            </Texto>
            {propuesta.respondeA}
          </Texto>
        </Aviso>
      )}

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
        <Texto tamano={21} familia="tituloSemi">
          La idea
        </Texto>
        <Texto tamano={16} interlineado={1.45}>
          {propuesta.idea}
        </Texto>
        {propuesta.mejoraIncorporada === undefined ? null : (
          <Aviso tono="logro" icono="visto">
            <Texto tamano={14.5} color="#174D34" interlineado={1.4}>
              <Texto tamano={14.5} peso="fuerte" color="#174D34">
                Mejorada en la conversación:{' '}
              </Texto>
              {propuesta.mejoraIncorporada}
            </Texto>
          </Aviso>
        )}
      </Tarjeta>

      {propuesta.necesita.length === 0 ? null : (
        <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
          <Texto tamano={21} familia="tituloSemi">
            Qué se necesita
          </Texto>
          {propuesta.necesita.map((apoyo) => (
            <FilaDeApoyo key={apoyo.id} apoyo={apoyo} />
          ))}
        </Tarjeta>
      )}

      {propuesta.quierenApoyar.length === 0 ? null : (
        <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
          <Texto tamano={21} familia="tituloSemi">
            Quieren apoyar
          </Texto>
          {propuesta.quierenApoyar.map((apoyo) => (
            <Fila key={apoyo.id} separacion={espacio.medio}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: radio.medio,
                  backgroundColor: apoyo.icono === 'birrete' ? '#DCE7F3' : '#F5E6C8',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icono
                  nombre={apoyo.icono}
                  tamano={22}
                  color={apoyo.icono === 'birrete' ? '#2C5A8C' : '#8A5A12'}
                />
              </View>
              <Columna crecer={1}>
                <Texto tamano={16} peso="fuerte">
                  {apoyo.nombre}
                </Texto>
                <Texto tamano={13.5} color={colores.grisTexto}>
                  {apoyo.detalle}
                </Texto>
              </Columna>
            </Fila>
          ))}
        </Tarjeta>
      )}

      <Columna
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
      >
        <Texto tamano={21} familia="tituloSemi">
          {`Conversación · ${propuesta.comentarios.length}`}
        </Texto>
        {propuesta.comentarios.slice(0, 1).map((comentario) => (
          <Tarjeta key={comentario.id} separacion={espacio.normal}>
            <Fila separacion={espacio.comodo}>
              <Avatar persona={comentario.autor} tamano={36} />
              <Texto tamano={14.5} color={colores.grisTexto} style={{ flex: 1 }}>
                <Texto tamano={14.5} peso="fuerte">
                  {comentario.autor.nombre}
                </Texto>
                {` · ${comentario.autor.vinculo}`}
              </Texto>
            </Fila>
            <Texto tamano={15.5} interlineado={1.4}>
              {comentario.texto}
            </Texto>
          </Tarjeta>
        ))}
        <Boton
          texto="Ver toda la conversación"
          variante="secundaria"
          icono="globoDialogo"
          onPress={() => router.push(`/propuestas/${propuesta.id}/conversacion`)}
        />
      </Columna>

      <BarraInferior alFinal={false} style={{ marginTop: espacio.seccion }}>
        <Fila separacion={espacio.comodo}>
          <Boton
            texto={`Apoyar · ${propuesta.apoyos}`}
            icono="pulgarArriba"
            variante={propuesta.apoyadaPorMi ? 'tonal' : 'principal'}
            onPress={() => apoyarPropuesta(propuesta.id)}
            vibrar
            style={{ flex: 1 }}
          />
          <Boton
            texto="Opinar"
            icono="globoDialogo"
            variante="secundaria"
            onPress={() => router.push(`/propuestas/${propuesta.id}/conversacion`)}
            style={{ flex: 1 }}
          />
        </Fila>
      </BarraInferior>
    </Pantalla>
  );
}

/** Las cinco etapas con la actual destacada. */
function BarraDeEtapas({ propuesta }: { propuesta: Propuesta }) {
  const etapaActual = etapas[propuesta.etapa];

  return (
    <Fila
      separacion={espacio.apretado}
      alinear="flex-start"
      accesibilidad={`Etapa ${etapaActual.numero} de 5: ${etapaActual.etiqueta}`}
      style={{ marginHorizontal: espacio.seccion, marginTop: espacio.amplio }}
    >
      {listaDeEtapas.map((etapa) => {
        const recorrida = etapa.numero < etapaActual.numero;
        const esLaActual = etapa.numero === etapaActual.numero;
        return (
          <Columna key={etapa.id} crecer={1} separacion={espacio.corto}>
            <View
              style={{
                height: 6,
                borderRadius: radio.redondo,
                backgroundColor: recorrida
                  ? colores.verde
                  : esLaActual
                    ? colores.ocre
                    : colores.borde,
              }}
            />
            <Texto
              tamano={12}
              peso={esLaActual ? 'fuerte' : 'normal'}
              color={esLaActual ? '#6F4A0E' : recorrida ? '#3E4A43' : colores.grisTexto}
            >
              {etapa.etiqueta}
            </Texto>
          </Columna>
        );
      })}
    </Fila>
  );
}

/** Una necesidad de la propuesta, con su avance cuando se cuenta en personas. */
function FilaDeApoyo({ apoyo }: { apoyo: ApoyoNecesario }) {
  const tieneCuenta = apoyo.conseguido !== undefined && apoyo.necesario !== undefined;
  const proporcion =
    tieneCuenta && apoyo.necesario !== undefined && apoyo.necesario > 0
      ? (apoyo.conseguido ?? 0) / apoyo.necesario
      : 0;

  return (
    <Columna separacion={espacio.corto}>
      <Fila repartir="space-between" separacion={espacio.normal}>
        <Texto tamano={16} peso="fuerte" style={{ flex: 1 }}>
          {apoyo.titulo}
        </Texto>
        {tieneCuenta ? (
          <Texto tamano={15} peso="fuerte" color={colores.verde}>
            {`${apoyo.conseguido} de ${apoyo.necesario}`}
          </Texto>
        ) : null}
      </Fila>
      <Texto tamano={13.5} color={colores.grisTexto}>
        {apoyo.detalle}
      </Texto>
      {tieneCuenta ? (
        <View
          style={{
            height: 6,
            borderRadius: radio.redondo,
            backgroundColor: colores.borde,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${Math.round(proporcion * 100)}%`,
              height: 6,
              borderRadius: radio.redondo,
              backgroundColor: colores.verde,
            }}
          />
        </View>
      ) : null}
    </Columna>
  );
}

/** Circulos superpuestos que sugieren quienes apoyan, sin exponer identidades. */
function CaritasDeApoyo() {
  const tonos = ['#F5E6C8', '#DCE7F3', '#DCEBD8', '#F3DCD7'];
  return (
    <View accessible={false} style={{ flexDirection: 'row' }}>
      {tonos.map((tono, posicion) => (
        <View
          key={tono}
          style={{
            width: 36,
            height: 36,
            borderRadius: radio.redondo,
            backgroundColor: tono,
            borderWidth: 3,
            borderColor: colores.bosque,
            marginLeft: posicion === 0 ? 0 : -12,
          }}
        />
      ))}
    </View>
  );
}
