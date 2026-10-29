import type { StyleProp, ViewStyle } from 'react-native';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';

/**
 * Las cuatro familias de boton del sistema visual mas las dos que solo
 * aparecen sobre fondo bosque, donde el verde de accion no contrasta.
 */
export type VarianteBoton =
  | 'principal'
  | 'secundaria'
  | 'tonal'
  | 'brote'
  | 'contornoClaro'
  | 'peligro';

type PropsBoton = {
  texto: string;
  onPress?: () => void;
  variante?: VarianteBoton;
  icono?: NombreIcono;
  /** Por defecto el icono va antes del texto. */
  iconoAlFinal?: boolean;
  /** Alto en puntos. El minimo del sistema es 52 y la accion principal usa 56. */
  alto?: number;
  tamanoDeTexto?: number;
  /** Ocupa todo el ancho disponible del contenedor. */
  ancho?: 'completo' | 'contenido';
  deshabilitado?: boolean;
  vibrar?: boolean;
  accesibilidad?: string;
  style?: StyleProp<ViewStyle>;
};

type Apariencia = {
  fondo: string;
  texto: string;
  borde?: string;
};

const apariencias: Record<VarianteBoton, Apariencia> = {
  principal: { fondo: colores.verde, texto: colores.papel },
  secundaria: { fondo: 'transparent', texto: colores.tinta, borde: colores.bordeFuerte },
  tonal: { fondo: colores.menta, texto: '#174D34' },
  brote: { fondo: colores.brote, texto: colores.bosque },
  contornoClaro: { fondo: 'transparent', texto: colores.papel, borde: colores.bosqueBorde },
  peligro: { fondo: colores.alerta, texto: colores.blanco },
};

export function Boton({
  texto,
  onPress,
  variante = 'principal',
  icono,
  iconoAlFinal = false,
  alto = alturaTocable.boton,
  tamanoDeTexto = 16,
  ancho = 'completo',
  deshabilitado = false,
  vibrar = false,
  accesibilidad,
  style,
}: PropsBoton) {
  const apariencia = apariencias[variante];
  const contenido = (
    <>
      {icono !== undefined && !iconoAlFinal ? (
        <Icono nombre={icono} tamano={tamanoDeTexto + 3} color={apariencia.texto} grosor={2.1} />
      ) : null}
      <Texto tamano={tamanoDeTexto} peso="fuerte" color={apariencia.texto}>
        {texto}
      </Texto>
      {icono !== undefined && iconoAlFinal ? (
        <Icono nombre={icono} tamano={tamanoDeTexto + 4} color={apariencia.texto} grosor={2.2} />
      ) : null}
    </>
  );

  return (
    <Presionable
      onPress={deshabilitado ? undefined : onPress}
      vibrar={vibrar}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad ?? texto}
      accessibilityState={{ disabled: deshabilitado }}
      style={[
        {
          height: alto,
          borderRadius: radio.caja,
          backgroundColor: apariencia.fondo,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: espacio.normal,
          paddingHorizontal: espacio.amplio,
          opacity: deshabilitado ? 0.45 : 1,
          ...(ancho === 'contenido' ? { alignSelf: 'flex-start' } : null),
          ...(apariencia.borde === undefined
            ? null
            : { borderWidth: 1.5, borderColor: apariencia.borde }),
        },
        style,
      ]}
    >
      {contenido}
    </Presionable>
  );
}
