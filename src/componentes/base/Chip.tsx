import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { espacio, radio, sombras } from '@/diseno/medidas';

type PropsChip = {
  texto: string;
  activo?: boolean;
  onPress?: () => void;
  icono?: NombreIcono;
  alto?: number;
  tamanoDeTexto?: number;
  /** Los chips del mapa flotan sobre el plano y llevan sombra en vez de borde. */
  flotante?: boolean;
  /**
   * "relleno" pinta el chip elegido de verde con texto claro, y es el filtro
   * normal. "marcado" lo deja en menta con borde verde, que es como se ven las
   * opciones que se eligen de a varias.
   */
  variante?: 'relleno' | 'marcado';
  style?: StyleProp<ViewStyle>;
};

/**
 * Filtro en forma de pildora. Se usa para las pestanas del feed, los filtros
 * del mapa y las listas de propuestas y desafios.
 */
export function Chip({
  texto,
  activo = false,
  onPress,
  icono,
  alto = 40,
  tamanoDeTexto = 15,
  flotante = false,
  variante = 'relleno',
  style,
}: PropsChip) {
  const esMarcado = variante === 'marcado';
  const colorDeTexto = activo ? (esMarcado ? '#174D34' : colores.papel) : colores.tinta;
  const fondoActivo = esMarcado ? colores.menta : flotante ? colores.bosque : colores.verde;

  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.95}
      accessibilityRole="tab"
      accessibilityState={{ selected: activo }}
      accessibilityLabel={texto}
      style={[
        {
          height: alto,
          paddingHorizontal: espacio.amplio,
          borderRadius: radio.redondo,
          flexDirection: 'row',
          alignItems: 'center',
          gap: espacio.corto,
          backgroundColor: activo ? fondoActivo : colores.papel,
          ...(flotante
            ? sombras.suave
            : activo
              ? esMarcado
                ? { borderWidth: 2, borderColor: colores.verde }
                : null
              : { borderWidth: 1.5, borderColor: colores.bordeFuerte }),
        },
        style,
      ]}
    >
      {icono === undefined ? null : (
        <Icono nombre={icono} tamano={tamanoDeTexto + 2} color={colorDeTexto} />
      )}
      <Texto tamano={tamanoDeTexto} peso={activo ? 'fuerte' : 'normal'} color={colorDeTexto}>
        {texto}
      </Texto>
    </Presionable>
  );
}

/**
 * Carril horizontal de chips. Desplaza sin barra visible, igual que el mockup,
 * y deja aire al final para que el ultimo chip no quede pegado al borde.
 */
export function FilaDeChips({
  children,
  relleno = espacio.amplio,
}: {
  children: ReactNode;
  relleno?: number;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: espacio.normal, paddingHorizontal: relleno }}
    >
      {children}
    </ScrollView>
  );
}
