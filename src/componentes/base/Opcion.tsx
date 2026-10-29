import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';

type PropsOpcion = {
  texto: string;
  activa: boolean;
  onPress: () => void;
  /** Explicacion breve bajo el texto principal. */
  detalle?: string;
  icono?: NombreIcono;
  /** Varias opciones a la vez se marcan con casilla; una sola, con circulo. */
  seleccion?: 'unica' | 'multiple';
  /** La variante compacta se usa en las rejillas de dos o tres columnas. */
  compacta?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Fila seleccionable de un formulario. Reemplaza al par radio y casilla de los
 * mockups con una sola zona tocable grande, que es mas facil de usar en el
 * telefono y cumple el minimo de 56 px.
 */
export function Opcion({
  texto,
  activa,
  onPress,
  detalle,
  icono,
  seleccion = 'multiple',
  compacta = false,
  style,
}: PropsOpcion) {
  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.98}
      accessibilityRole={seleccion === 'unica' ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: activa }}
      accessibilityLabel={texto}
      style={[
        {
          minHeight: compacta ? alturaTocable.boton : alturaTocable.principal,
          borderRadius: compacta ? radio.boton : radio.caja,
          paddingHorizontal: compacta ? espacio.normal : espacio.amplio - 2,
          paddingVertical: espacio.comodo,
          flexDirection: 'row',
          alignItems: 'center',
          gap: espacio.medio,
          backgroundColor: activa ? colores.menta : colores.papel,
          borderWidth: activa ? 2 : 1.5,
          borderColor: activa ? colores.verde : colores.borde,
          ...(compacta ? { justifyContent: 'center' } : null),
        },
        style,
      ]}
    >
      {icono === undefined ? null : (
        <Icono nombre={icono} tamano={22} color={activa ? colores.verde : colores.grisTexto} />
      )}
      {compacta ? (
        // La variante compacta no lleva marca ni caja alrededor del texto: si
        // se envuelve en una vista sin ancho, la palabra se parte letra a letra.
        <Texto tamano={16} peso={activa ? 'fuerte' : 'normal'} alineacion="center">
          {texto}
        </Texto>
      ) : (
        <>
          <MarcaDeSeleccion activa={activa} seleccion={seleccion} />
          <View style={{ flex: 1, gap: 2 }}>
            <Texto tamano={16.5} peso={activa ? 'fuerte' : 'normal'}>
              {texto}
            </Texto>
            {detalle === undefined ? null : (
              <Texto tamano={14} color={colores.grisTexto}>
                {detalle}
              </Texto>
            )}
          </View>
        </>
      )}
    </Presionable>
  );
}

/** Circulo o cuadrado de marcado, segun si la seleccion admite varias. */
function MarcaDeSeleccion({
  activa,
  seleccion,
}: {
  activa: boolean;
  seleccion: 'unica' | 'multiple';
}) {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: seleccion === 'unica' ? radio.redondo : 7,
        borderWidth: 2,
        borderColor: activa ? colores.verde : colores.bordeFuerte,
        backgroundColor: activa ? colores.verde : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {activa ? <Icono nombre="visto" tamano={15} color={colores.papel} grosor={3} /> : null}
    </View>
  );
}

/**
 * Casilla suelta, para las lineas de consentimiento que no son una opcion
 * dentro de una lista.
 */
export function Casilla({
  activa,
  onPress,
  children,
}: {
  activa: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.99}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: activa }}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: espacio.medio,
        minHeight: alturaTocable.minima,
        paddingVertical: espacio.normal,
      }}
    >
      <MarcaDeSeleccion activa={activa} seleccion="multiple" />
      <View style={{ flex: 1 }}>{children}</View>
    </Presionable>
  );
}
