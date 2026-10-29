import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { colores } from '@/diseno/colores';

type PropsPantalla = {
  children: ReactNode;
  /** Color de fondo. Crema para las pantallas normales, bosque para las oscuras. */
  fondo?: string;
  /**
   * Las pantallas de los mockups que miden mas de 844 px de alto se recorren
   * desplazando. Las que caben exactas en el telefono no.
   */
  desplazable?: boolean;
  /** Espacio libre bajo el contenido, para que la barra inferior no lo tape. */
  espacioAlFinal?: number;
  /** Deja el borde inferior libre cuando la pantalla termina en un boton fijo. */
  sinMargenInferior?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Marco de cada pantalla. Resuelve el fondo y el margen que piden la barra de
 * estado y el borde inferior del telefono, que en los mockups aparecen como un
 * relleno fijo de 56 px arriba y 24 abajo.
 */
export function Pantalla({
  children,
  fondo = colores.crema,
  desplazable = false,
  espacioAlFinal = 0,
  sinMargenInferior = false,
  style,
}: PropsPantalla) {
  const margenes = useSafeAreaInsets();
  const arriba = margenes.top + 12;
  const abajo = sinMargenInferior ? 0 : margenes.bottom;

  if (desplazable) {
    return (
      <View style={[{ flex: 1, backgroundColor: fondo }, style]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: arriba, paddingBottom: abajo + espacioAlFinal }}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: fondo, paddingTop: arriba, paddingBottom: abajo }, style]}>
      {children}
    </View>
  );
}
