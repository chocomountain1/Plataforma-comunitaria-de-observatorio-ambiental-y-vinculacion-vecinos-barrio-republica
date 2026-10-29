import { useState, type ReactNode } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { G, Path, Rect, Text as TextoSvg } from 'react-native-svg';

import { colores } from '@/diseno/colores';
import type { PuntoEnMapa } from '@/dominio/tipos';
import { familias } from '@/diseno/tipografia';

/** Tamano del plano del barrio en las coordenadas del diseno. */
export const ANCHO_DEL_PLANO = 390;
export const ALTO_DEL_PLANO = 844;

/**
 * Calles del Barrio Republica dibujadas a escala del mockup. El eje horizontal
 * grueso de arriba es la Alameda, que marca el limite norte del barrio.
 */
const CALLES_ANCHAS = 'M0 74H390';
const CALLES_HORIZONTALES = 'M0 212H390M0 342H390M0 472H390M0 602H390M0 732H390';

const nombresDeCalle = [
  { texto: 'ALAMEDA', x: 236, y: 70 },
  { texto: 'SAZIÉ', x: 132, y: 208 },
  { texto: 'GRAJALES', x: 132, y: 338 },
  { texto: 'DOMEYKO', x: 132, y: 468 },
  { texto: 'TOESCA', x: 132, y: 598 },
  { texto: 'GORBEA', x: 300, y: 728 },
];

const nombresDeAvenida = [
  { texto: 'AV. REPÚBLICA', x: 206, y: 300 },
  { texto: 'AV. EJÉRCITO', x: 296, y: 430 },
  { texto: 'AV. ESPAÑA', x: 34, y: 700 },
];

/** Convierte un punto del plano a la posicion que ocupa en la pantalla. */
export type Ubicador = (punto: PuntoEnMapa, tamanoDelMarcador: number) => ViewStyle;

type PropsMapaBarrio = {
  /** Recibe el ubicador para colocar marcadores encima del plano. */
  children?: (ubicar: Ubicador) => ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Desplaza el plano para encuadrar otra parte del barrio. */
  desplazamiento?: PuntoEnMapa;
};

/**
 * Plano del barrio.
 *
 * En el prototipo las calles se dibujan a mano con las mismas proporciones del
 * diseno, lo que permite mostrar el recorrido completo sin depender de una
 * llave de servicio ni de conexion. La decision de stack del proyecto es
 * OpenStreetMap: cuando se integre, se reemplaza este componente y los
 * marcadores siguen funcionando igual, porque ya reciben su posicion desde
 * fuera.
 */
export function MapaBarrio({ children, style, desplazamiento }: PropsMapaBarrio) {
  const [medida, setMedida] = useState({ ancho: ANCHO_DEL_PLANO, alto: ALTO_DEL_PLANO });

  function alMedir(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    setMedida({ ancho: width, alto: height });
  }

  // El plano se agranda hasta cubrir todo el espacio disponible y se centra, de
  // modo que no quedan franjas vacias en telefonos de cualquier proporcion.
  const escala = Math.max(medida.ancho / ANCHO_DEL_PLANO, medida.alto / ALTO_DEL_PLANO);
  const anchoDibujado = ANCHO_DEL_PLANO * escala;
  const altoDibujado = ALTO_DEL_PLANO * escala;
  const izquierda = (medida.ancho - anchoDibujado) / 2 - (desplazamiento?.x ?? 0) * escala;
  const arriba = (medida.alto - altoDibujado) / 2 - (desplazamiento?.y ?? 0) * escala;

  const ubicar: Ubicador = (punto, tamanoDelMarcador) => ({
    position: 'absolute',
    left: izquierda + punto.x * escala - tamanoDelMarcador / 2,
    top: arriba + punto.y * escala - tamanoDelMarcador / 2,
  });

  return (
    <View
      onLayout={alMedir}
      style={[{ flex: 1, backgroundColor: colores.mapaFondo, overflow: 'hidden' }, style]}
    >
      <Svg
        width={anchoDibujado}
        height={altoDibujado}
        viewBox={`0 0 ${ANCHO_DEL_PLANO} ${ALTO_DEL_PLANO}`}
        style={{ position: 'absolute', left: izquierda, top: arriba }}
      >
        <Rect width={ANCHO_DEL_PLANO} height={ALTO_DEL_PLANO} fill={colores.mapaFondo} />

        <Rect x={38} y={222} width={76} height={110} rx={6} fill={colores.mapaVerde} />
        <Rect x={212} y={482} width={70} height={108} rx={6} fill={colores.mapaVerde} />
        <Rect x={300} y={352} width={62} height={40} rx={5} fill={colores.mapaManzana} />

        <G stroke={colores.mapaCalle} fill="none">
          <Path d={CALLES_ANCHAS} strokeWidth={28} />
          <Path d={CALLES_HORIZONTALES} strokeWidth={11} />
          <Path d="M30 0V844" strokeWidth={12} />
          <Path d="M120 0V844" strokeWidth={9} />
          <Path d="M202 0V844" strokeWidth={18} />
          <Path d="M292 0V844" strokeWidth={16} />
          <Path d="M372 0V844" strokeWidth={10} />
        </G>

        {/* Linea segmentada sobre la Alameda: es el limite norte del barrio. */}
        <Path d={CALLES_ANCHAS} stroke={colores.mapaLimite} strokeWidth={2} strokeDasharray="8 8" />

        <G fill={colores.mapaTexto}>
          {nombresDeCalle.map((calle) => (
            <TextoSvg
              key={calle.texto}
              x={calle.x}
              y={calle.y}
              fontSize={10}
              fontFamily={familias.textoFuerte}
              letterSpacing={0.4}
            >
              {calle.texto}
            </TextoSvg>
          ))}
          {nombresDeAvenida.map((avenida) => (
            <TextoSvg
              key={avenida.texto}
              x={avenida.x}
              y={avenida.y}
              fontSize={10}
              fontFamily={familias.textoFuerte}
              letterSpacing={0.4}
              transform={`rotate(90 ${avenida.x} ${avenida.y})`}
            >
              {avenida.texto}
            </TextoSvg>
          ))}
        </G>
      </Svg>

      {children?.(ubicar)}
    </View>
  );
}
