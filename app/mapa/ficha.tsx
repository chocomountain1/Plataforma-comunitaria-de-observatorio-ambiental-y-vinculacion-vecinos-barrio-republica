import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { G, Path, Rect, Text as TextoSvg } from 'react-native-svg';

import {
  Columna,
  Etiqueta,
  Fila,
  FilaDeLista,
  Icono,
  Presionable,
  Texto,
} from '@/componentes/base';
import { fichasDeCatastro } from '@/datos/catastro';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio, sombras } from '@/diseno/medidas';
import { familias } from '@/diseno/tipografia';
import { crearVolver } from '@/utiles/navegacion';

/** Alto del plano de contexto que se ve sobre la ficha. */
const ALTO_DEL_PLANO = 300;

/**
 * 2.4 Ficha del catastro.
 *
 * Cada elemento del diagnostico 2022 tiene su estado vacio en casi todos los
 * registros: 0 de 93 bancas, 0 de 172 semaforos, 4 de 218 basureros. Esta
 * pantalla es la que permite que un vecino complete ese dato con un toque.
 */
export default function FichaDelCatastro() {
  const volver = crearVolver('/mapa');
  const margenes = useSafeAreaInsets();
  const ficha = fichasDeCatastro[0];
  const [estadoDeHoy, setEstadoDeHoy] = useState<string | null>(null);

  if (ficha === undefined) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colores.mapaFondo }}>
      <PlanoDeContexto />

      <Presionable
        onPress={volver}
        accessibilityRole="button"
        accessibilityLabel="Volver al mapa"
        style={[
          {
            position: 'absolute',
            left: espacio.amplio,
            top: margenes.top + espacio.normal,
            width: 48,
            height: 48,
            borderRadius: radio.redondo,
            backgroundColor: colores.papel,
            alignItems: 'center',
            justifyContent: 'center',
          },
          sombras.flotante,
        ]}
      >
        <Icono nombre="flechaIzquierda" tamano={22} color={colores.tinta} />
      </Presionable>

      <View
        style={[
          {
            marginTop: 'auto',
            maxHeight: '72%',
            backgroundColor: colores.papel,
            borderTopLeftRadius: radio.hoja,
            borderTopRightRadius: radio.hoja,
            paddingTop: espacio.comodo,
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: espacio.seccion,
            paddingTop: espacio.medio,
            paddingBottom: Math.max(margenes.bottom, espacio.amplio),
            gap: espacio.medio,
          }}
        >
          <Fila separacion={espacio.normal}>
            <Etiqueta texto={ficha.tipo} fondo={colores.menta} color="#174D34" />
            <Etiqueta texto={ficha.fuente} fondo={colores.crema} color={colores.grisTexto} />
          </Fila>

          <Texto tamano={24} familia="titulo" interlineado={1.15}>
            {ficha.direccion}
          </Texto>

          <Fila separacion={espacio.normal} alinear="stretch">
            <DatoDeFicha etiqueta="Estado anotado" valor={ficha.estadoAnotado} color="#8A5A12" />
            <DatoDeFicha etiqueta="Quién la cuida" valor={ficha.quienLoCuida} />
            <DatoDeFicha etiqueta="Última revisión" valor={ficha.ultimaRevision} />
          </Fila>

          <Columna
            separacion={espacio.medio}
            style={{ backgroundColor: colores.bosque, borderRadius: 20, padding: espacio.amplio }}
          >
            <Columna separacion={espacio.minimo}>
              <Texto tamano={18} peso="fuerte" color={colores.papel}>
                ¿Cómo está hoy?
              </Texto>
              <Texto tamano={14} color={colores.textoTenueSobreBosque}>
                Un toque y el registro del barrio queda al día
              </Texto>
            </Columna>

            <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
              {ficha.opcionesDeEstado.map((opcion) => (
                <BotonDeEstado
                  key={opcion}
                  texto={opcion}
                  activo={estadoDeHoy === opcion}
                  esNoSe={opcion === 'No sé'}
                  onPress={() => setEstadoDeHoy(opcion)}
                />
              ))}
            </Fila>

            <Texto tamano={13.5} color={colores.textoTenueSobreBosque}>
              {'Opcional: '}
              <Texto
                tamano={13.5}
                peso="fuerte"
                color={colores.brote}
                style={{ textDecorationLine: 'underline' }}
                onPress={() => router.push('/reportar/foto')}
              >
                agrega una foto
              </Texto>
            </Texto>
          </Columna>

          <View style={{ borderWidth: 1.5, borderColor: colores.borde, borderRadius: 18 }}>
            <FilaDeLista
              titulo="Proponer recuperarla"
              detalle={ficha.dato}
              ultima
              conFlecha
              onPress={() => router.push('/propuestas/nueva/idea')}
              adorno={
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
                  <Icono nombre="idea" tamano={22} color="#8A5A12" />
                </View>
              }
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

/** Cuadro de un dato de la ficha del catastro. */
function DatoDeFicha({
  etiqueta,
  valor,
  color = colores.tinta,
}: {
  etiqueta: string;
  valor: string;
  color?: string;
}) {
  return (
    <Columna
      crecer={1}
      separacion={espacio.minimo}
      style={{ backgroundColor: colores.crema, borderRadius: radio.boton, padding: espacio.comodo }}
    >
      <Texto tamano={12.5} color={colores.grisTexto}>
        {etiqueta}
      </Texto>
      <Texto tamano={15} peso="fuerte" color={color}>
        {valor}
      </Texto>
    </Columna>
  );
}

/** Opcion de actualizacion del estado. La alternativa "No sé" no compromete. */
function BotonDeEstado({
  texto,
  activo,
  esNoSe,
  onPress,
}: {
  texto: string;
  activo: boolean;
  esNoSe: boolean;
  onPress: () => void;
}) {
  return (
    <Presionable
      onPress={onPress}
      vibrar
      accessibilityRole="radio"
      accessibilityState={{ checked: activo }}
      accessibilityLabel={texto}
      style={{
        flexGrow: 1,
        flexBasis: '45%',
        minHeight: alturaTocable.boton,
        borderRadius: radio.boton,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: espacio.corto,
        ...(activo
          ? { backgroundColor: colores.menta, borderWidth: 3, borderColor: colores.brote }
          : esNoSe
            ? { borderWidth: 1.5, borderColor: colores.bosqueBorde }
            : { backgroundColor: colores.papel }),
      }}
    >
      {activo ? <Icono nombre="visto" tamano={18} color={colores.bosque} grosor={2.6} /> : null}
      <Texto
        tamano={15.5}
        peso="fuerte"
        color={activo ? colores.bosque : esNoSe ? colores.papel : colores.tinta}
      >
        {texto}
      </Texto>
    </Presionable>
  );
}

/** Acercamiento del plano a la cuadra de la ficha. */
function PlanoDeContexto() {
  return (
    <Svg
      width="100%"
      height={ALTO_DEL_PLANO}
      viewBox="0 0 390 300"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <Rect width={390} height={300} fill={colores.mapaFondo} />
      <G stroke={colores.mapaCalle} fill="none">
        <Path d="M0 200H390" strokeWidth={22} />
        <Path d="M0 60H390" strokeWidth={12} />
        <Path d="M80 0V300" strokeWidth={18} />
        <Path d="M300 0V300" strokeWidth={16} />
      </G>
      {/* La franja ocre es la platabanda y la verde, la vereda con jardin. */}
      <Rect x={96} y={182} width={190} height={7} rx={3} fill={colores.ocre} />
      <Rect x={96} y={211} width={190} height={7} rx={3} fill={colores.mapaVerde} />
      <Rect
        x={96}
        y={176}
        width={190}
        height={19}
        rx={6}
        fill="none"
        stroke={colores.bosque}
        strokeWidth={3}
      />
      <G fill={colores.mapaTexto}>
        <TextoSvg x={210} y={234} fontSize={10} fontFamily={familias.textoFuerte}>
          GRAJALES
        </TextoSvg>
        <TextoSvg
          x={86}
          y={120}
          fontSize={10}
          fontFamily={familias.textoFuerte}
          transform="rotate(90 86 120)"
        >
          AV. REPÚBLICA
        </TextoSvg>
        <TextoSvg
          x={306}
          y={110}
          fontSize={10}
          fontFamily={familias.textoFuerte}
          transform="rotate(90 306 110)"
        >
          AV. EJÉRCITO
        </TextoSvg>
      </G>
    </Svg>
  );
}
