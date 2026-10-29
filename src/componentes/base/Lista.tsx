import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { Columna } from './Disposicion';
import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';

/** Linea divisoria entre filas de una lista agrupada. */
const COLOR_DIVISORIA = '#EEE7D7';

type PropsLista = {
  children: ReactNode;
  /** Titulo en mayusculas sobre el grupo, como en Ajustes. */
  encabezado?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Tarjeta que agrupa varias filas con una divisoria entre ellas. Es el patron
 * de las pantallas de intereses, capas del mapa, ajustes y perfil.
 */
export function ListaAgrupada({ children, encabezado, style }: PropsLista) {
  return (
    <Columna separacion={espacio.normal} style={style}>
      {encabezado === undefined ? null : (
        <Texto
          tamano={13}
          peso="fuerte"
          color={colores.grisTexto}
          espaciado={0.6}
          style={{ paddingHorizontal: espacio.apretado }}
        >
          {encabezado}
        </Texto>
      )}
      <View
        style={{
          backgroundColor: colores.papel,
          borderWidth: 1,
          borderColor: colores.borde,
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </Columna>
  );
}

type PropsFilaDeLista = {
  titulo: string;
  detalle?: string;
  /** Elemento a la izquierda: una sigla, un icono o una marca de categoria. */
  adorno?: ReactNode;
  /** Elemento a la derecha: un interruptor, un contador o una flecha. */
  control?: ReactNode;
  onPress?: () => void;
  /** La ultima fila del grupo no lleva divisoria. */
  ultima?: boolean;
  /** Muestra la flecha de avanzar cuando la fila abre otra pantalla. */
  conFlecha?: boolean;
  /** Tinta roja para las acciones destructivas de Ajustes. */
  peligrosa?: boolean;
};

export function FilaDeLista({
  titulo,
  detalle,
  adorno,
  control,
  onPress,
  ultima = false,
  conFlecha = false,
  peligrosa = false,
}: PropsFilaDeLista) {
  const contenido = (
    <>
      {adorno}
      <Columna crecer={1} separacion={2}>
        <Texto tamano={16.5} peso="fuerte" color={peligrosa ? colores.alerta : colores.tinta}>
          {titulo}
        </Texto>
        {detalle === undefined ? null : (
          <Texto tamano={13.5} color={colores.grisTexto}>
            {detalle}
          </Texto>
        )}
      </Columna>
      {control}
      {conFlecha ? (
        <Icono nombre="flechaDerecha" tamano={20} color={colores.grisTexto} />
      ) : null}
    </>
  );

  const estilo: StyleProp<ViewStyle> = {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.amplio - 2,
    paddingHorizontal: espacio.amplio,
    paddingVertical: espacio.comodo,
    ...(ultima ? null : { borderBottomWidth: 1, borderBottomColor: COLOR_DIVISORIA }),
  };

  if (onPress === undefined) {
    return <View style={estilo}>{contenido}</View>;
  }

  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.995}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={estilo}
    >
      {contenido}
    </Presionable>
  );
}

/** Cuadro con una sigla de tres letras, como los intereses del registro. */
export function Sigla({
  texto,
  fondo,
  color,
}: {
  texto: string;
  fondo: string;
  color: string;
}) {
  return (
    <View
      style={{
        width: alturaTocable.minima - 4,
        height: alturaTocable.minima - 4,
        borderRadius: radio.boton - 2,
        backgroundColor: fondo,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Texto tamano={13} peso="fuerte" color={color}>
        {texto}
      </Texto>
    </View>
  );
}
