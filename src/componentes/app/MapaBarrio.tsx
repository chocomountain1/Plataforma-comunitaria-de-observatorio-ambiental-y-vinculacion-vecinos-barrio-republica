import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Image,
  PanResponder,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Presionable, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio, sombras } from '@/diseno/medidas';
import {
  CENTRO_DEL_BARRIO,
  MARGEN_FUERA_DEL_BARRIO,
  RECUADRO_DEL_BARRIO,
  ZOOM_DEL_BARRIO,
  ZOOM_MAXIMO,
  ZOOM_MINIMO,
} from '@/dominio/barrio';
import type { PuntoEnMapa, RecuadroDelMapa } from '@/dominio/tipos';
import { LADO_DE_TESELA, aCoordenada, aPixeles, direccionDeTesela } from '@/utiles/geografia';

/** Convierte un punto del mapa a la posicion que ocupa en la pantalla. */
export type Ubicador = (punto: PuntoEnMapa, tamanoDelMarcador: number) => ViewStyle;

type PropsMapaBarrio = {
  /** Recibe el ubicador para colocar marcadores encima del mapa. */
  children?: (ubicar: Ubicador) => ReactNode;
  style?: StyleProp<ViewStyle>;
  centro?: PuntoEnMapa;
  zoom?: number;
  /** Avisa donde quedo el centro al terminar un arrastre. */
  alMoverse?: (centro: PuntoEnMapa) => void;
  /**
   * Avisa que area quedo a la vista, para que la pantalla pida a la base solo
   * los elementos que entran ahi.
   *
   * Tiene que venir envuelta en useCallback: se llama desde un efecto que
   * depende de ella, y una funcion nueva en cada render haria un ciclo.
   */
  alCambiarElArea?: (recuadro: RecuadroDelMapa, zoom: number) => void;
  /** Las fichas muestran el mapa como ilustracion y no se arrastran. */
  interactivo?: boolean;
};

type Arrastre = {
  x: number;
  y: number;
};

const SIN_ARRASTRE: Arrastre = { x: 0, y: 0 };

/** Cuanto hay que mover el dedo antes de que el gesto cuente como arrastre. */
const UMBRAL_DE_ARRASTRE = 3;

/**
 * Mapa del barrio sobre teselas de OpenStreetMap.
 *
 * Las teselas se dibujan con el componente Image y la proyeccion se calcula a
 * mano, sin libreria de mapas. Es deliberado: el proyecto no usa librerias de
 * interfaz de terceros, y una libreria de mapas obligaria a un development
 * build, lo que dejaria fuera el flujo de Expo Go y el navegador, que son las
 * dos formas en que hoy se muestra el prototipo.
 *
 * Los marcadores siguen viviendo fuera, como componentes de React Native
 * encima del mapa, y reciben su posicion por el ubicador. Por eso el cambio de
 * plano dibujado a mapa real no toco ninguno de ellos.
 */
export function MapaBarrio({
  children,
  style,
  centro: centroInicial = CENTRO_DEL_BARRIO,
  zoom: zoomInicial = ZOOM_DEL_BARRIO,
  alMoverse,
  alCambiarElArea,
  interactivo = true,
}: PropsMapaBarrio) {
  const [medida, setMedida] = useState({ ancho: 390, alto: 844 });
  const [centro, setCentro] = useState<PuntoEnMapa>(centroInicial);
  const [arrastre, setArrastre] = useState<Arrastre>(SIN_ARRASTRE);
  const [zoom, setZoom] = useState(zoomInicial);

  // El gesto necesita leer el centro y el zoom vigentes sin volver a crearse en
  // cada render, porque recrear el PanResponder a mitad de un arrastre corta el
  // movimiento.
  const vigente = useRef({ centro, zoom });
  vigente.current = { centro, zoom };

  function alMedir(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    setMedida({ ancho: width, alto: height });
  }

  const gesto = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_evento, estado) =>
          interactivo &&
          (Math.abs(estado.dx) > UMBRAL_DE_ARRASTRE || Math.abs(estado.dy) > UMBRAL_DE_ARRASTRE),
        onPanResponderMove: (_evento, estado) => {
          setArrastre({ x: estado.dx, y: estado.dy });
        },
        onPanResponderRelease: (_evento, estado) => {
          const { centro: centroVigente, zoom: zoomVigente } = vigente.current;
          const pixeles = aPixeles(centroVigente, zoomVigente);
          const movido = aCoordenada(
            { x: pixeles.x - estado.dx, y: pixeles.y - estado.dy },
            zoomVigente,
          );
          const limitado = dentroDelBarrio(movido);
          setCentro(limitado);
          setArrastre(SIN_ARRASTRE);
          alMoverse?.(limitado);
        },
        onPanResponderTerminate: () => setArrastre(SIN_ARRASTRE),
      }),
    [interactivo, alMoverse],
  );

  const centroEnPixeles = aPixeles(centro, zoom);
  const izquierdaDelMundo = centroEnPixeles.x - arrastre.x - medida.ancho / 2;
  const arribaDelMundo = centroEnPixeles.y - arrastre.y - medida.alto / 2;

  const ubicar: Ubicador = (punto, tamanoDelMarcador) => {
    const pixeles = aPixeles(punto, zoom);
    return {
      position: 'absolute',
      left: pixeles.x - izquierdaDelMundo - tamanoDelMarcador / 2,
      top: pixeles.y - arribaDelMundo - tamanoDelMarcador / 2,
    };
  };

  const teselas = teselasVisibles(izquierdaDelMundo, arribaDelMundo, medida, zoom);

  // Se avisa al terminar el gesto y no durante, porque arrastrar dispararia
  // una consulta por cada fotograma.
  useEffect(() => {
    if (alCambiarElArea === undefined) return;
    alCambiarElArea(areaALaVista(centro, zoom, medida), zoom);
  }, [alCambiarElArea, centro, zoom, medida]);

  function cambiarZoom(paso: number) {
    setZoom((actual) => Math.min(ZOOM_MAXIMO, Math.max(ZOOM_MINIMO, actual + paso)));
  }

  return (
    <View
      onLayout={alMedir}
      style={[{ flex: 1, backgroundColor: colores.mapaFondo, overflow: 'hidden' }, style]}
      {...gesto.panHandlers}
    >
      {teselas.map((tesela) => (
        <Image
          key={`${tesela.zoom}-${tesela.columna}-${tesela.fila}`}
          source={{ uri: direccionDeTesela(tesela.columna, tesela.fila, tesela.zoom) }}
          style={{
            position: 'absolute',
            left: tesela.izquierda,
            top: tesela.arriba,
            width: LADO_DE_TESELA,
            height: LADO_DE_TESELA,
          }}
          // El mapa es decorativo para el lector de pantalla: lo que importa
          // son los marcadores, que si se anuncian uno por uno.
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ))}

      {children?.(ubicar)}

      {interactivo ? <ControlesDeZoom alCambiar={cambiarZoom} zoom={zoom} /> : null}

      <Atribucion />
    </View>
  );
}

/** Los cuatro bordes de lo que cabe en pantalla con este centro y este zoom. */
function areaALaVista(
  centro: PuntoEnMapa,
  zoom: number,
  medida: { ancho: number; alto: number },
): RecuadroDelMapa {
  const centroEnPixeles = aPixeles(centro, zoom);
  const noroeste = aCoordenada(
    { x: centroEnPixeles.x - medida.ancho / 2, y: centroEnPixeles.y - medida.alto / 2 },
    zoom,
  );
  const sureste = aCoordenada(
    { x: centroEnPixeles.x + medida.ancho / 2, y: centroEnPixeles.y + medida.alto / 2 },
    zoom,
  );
  return {
    norte: noroeste.latitud,
    oeste: noroeste.longitud,
    sur: sureste.latitud,
    este: sureste.longitud,
  };
}

/** Deja el centro dentro del barrio, con holgura para asomarse al borde. */
function dentroDelBarrio(punto: PuntoEnMapa): PuntoEnMapa {
  const margen = MARGEN_FUERA_DEL_BARRIO;
  return {
    latitud: Math.min(
      RECUADRO_DEL_BARRIO.norte + margen,
      Math.max(RECUADRO_DEL_BARRIO.sur - margen, punto.latitud),
    ),
    longitud: Math.min(
      RECUADRO_DEL_BARRIO.este + margen,
      Math.max(RECUADRO_DEL_BARRIO.oeste - margen, punto.longitud),
    ),
  };
}

type TeselaDibujada = {
  columna: number;
  fila: number;
  zoom: number;
  izquierda: number;
  arriba: number;
};

/** Las teselas que alcanzan a verse en el recuadro visible, y donde van. */
function teselasVisibles(
  izquierdaDelMundo: number,
  arribaDelMundo: number,
  medida: { ancho: number; alto: number },
  zoom: number,
): TeselaDibujada[] {
  const ultima = 2 ** zoom - 1;
  const primeraColumna = Math.floor(izquierdaDelMundo / LADO_DE_TESELA);
  const ultimaColumna = Math.floor((izquierdaDelMundo + medida.ancho) / LADO_DE_TESELA);
  const primeraFila = Math.floor(arribaDelMundo / LADO_DE_TESELA);
  const ultimaFila = Math.floor((arribaDelMundo + medida.alto) / LADO_DE_TESELA);

  const dibujadas: TeselaDibujada[] = [];
  for (let columna = primeraColumna; columna <= ultimaColumna; columna += 1) {
    for (let fila = primeraFila; fila <= ultimaFila; fila += 1) {
      // Arriba y abajo el mundo se acaba, asi que esas filas no existen. A los
      // lados en cambio da la vuelta, aunque en el barrio no llegue a pasar.
      if (fila < 0 || fila > ultima) continue;
      dibujadas.push({
        columna: ((columna % (ultima + 1)) + ultima + 1) % (ultima + 1),
        fila,
        zoom,
        izquierda: columna * LADO_DE_TESELA - izquierdaDelMundo,
        arriba: fila * LADO_DE_TESELA - arribaDelMundo,
      });
    }
  }
  return dibujadas;
}

/** Botones de acercar y alejar, apilados como en los mockups. */
function ControlesDeZoom({
  alCambiar,
  zoom,
}: {
  alCambiar: (paso: number) => void;
  zoom: number;
}) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          right: espacio.amplio,
          top: '40%',
          borderRadius: radio.caja,
          backgroundColor: colores.papel,
          overflow: 'hidden',
        },
        sombras.flotante,
      ]}
    >
      <BotonDeZoom
        accesibilidad="Acercar el mapa"
        activo={zoom < ZOOM_MAXIMO}
        onPress={() => alCambiar(1)}
      >
        <View style={barraDeZoom} />
        <View style={[barraDeZoom, { position: 'absolute', transform: [{ rotate: '90deg' }] }]} />
      </BotonDeZoom>
      <View style={{ height: 1, backgroundColor: colores.mapaLimite }} />
      <BotonDeZoom
        accesibilidad="Alejar el mapa"
        activo={zoom > ZOOM_MINIMO}
        onPress={() => alCambiar(-1)}
      >
        <View style={barraDeZoom} />
      </BotonDeZoom>
    </View>
  );
}

const barraDeZoom: ViewStyle = {
  width: 16,
  height: 2.5,
  borderRadius: 2,
  backgroundColor: colores.verde,
};

function BotonDeZoom({
  children,
  accesibilidad,
  activo,
  onPress,
}: {
  children: ReactNode;
  accesibilidad: string;
  activo: boolean;
  onPress: () => void;
}) {
  return (
    <Presionable
      onPress={activo ? onPress : undefined}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad}
      accessibilityState={{ disabled: !activo }}
      style={{
        // Las zonas tocables del sistema visual no bajan de 44.
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: activo ? 1 : 0.35,
      }}
    >
      {children}
    </Presionable>
  );
}

/**
 * Atribucion de OpenStreetMap. No es decorativa: la licencia de los datos
 * obliga a mostrarla en cualquier vista que use sus teselas.
 */
function Atribucion() {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        paddingHorizontal: espacio.corto,
        paddingVertical: 2,
        borderTopRightRadius: radio.boton - 2,
        backgroundColor: 'rgba(255,255,255,0.78)',
      }}
    >
      <Texto tamano={10.5} color={colores.mapaTexto}>
        © OpenStreetMap
      </Texto>
    </View>
  );
}
