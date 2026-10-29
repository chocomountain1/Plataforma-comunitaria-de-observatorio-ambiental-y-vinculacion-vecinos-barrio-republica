import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

type PropsCaja = {
  children?: ReactNode;
  /** Separacion entre los hijos. */
  separacion?: number;
  /** Alineacion en el eje transversal al de la caja. */
  alinear?: ViewStyle['alignItems'];
  /** Reparto de los hijos a lo largo del eje principal. */
  repartir?: ViewStyle['justifyContent'];
  /** Cuanto espacio sobrante toma la caja dentro de su contenedor. */
  crecer?: number;
  style?: StyleProp<ViewStyle>;
  accesibilidad?: string;
};

/** Hijos uno al lado del otro. */
export function Fila({
  children,
  separacion,
  alinear = 'center',
  repartir,
  crecer,
  style,
  accesibilidad,
}: PropsCaja) {
  return (
    <View
      accessibilityLabel={accesibilidad}
      style={[
        {
          flexDirection: 'row',
          alignItems: alinear,
          ...(separacion === undefined ? null : { gap: separacion }),
          ...(repartir === undefined ? null : { justifyContent: repartir }),
          ...(crecer === undefined ? null : { flex: crecer }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Hijos uno debajo del otro. */
export function Columna({
  children,
  separacion,
  alinear,
  repartir,
  crecer,
  style,
  accesibilidad,
}: PropsCaja) {
  return (
    <View
      accessibilityLabel={accesibilidad}
      style={[
        {
          flexDirection: 'column',
          ...(alinear === undefined ? null : { alignItems: alinear }),
          ...(separacion === undefined ? null : { gap: separacion }),
          ...(repartir === undefined ? null : { justifyContent: repartir }),
          ...(crecer === undefined ? null : { flex: crecer }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
