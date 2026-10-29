import { View, type ViewStyle } from 'react-native';

import { Icono, Presionable, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { radio, sombras } from '@/diseno/medidas';

type PropsMarcador = {
  icono: NombreIcono;
  color: string;
  accesibilidad: string;
  /** Posicion calculada por el plano. */
  posicion: ViewStyle;
  tamano?: number;
  /** Los reportes van en circulo y las propuestas y actividades en cuadrado. */
  forma?: 'circulo' | 'cuadrado';
  /** El marcador elegido lleva un aro verde oscuro alrededor. */
  seleccionado?: boolean;
  onPress?: () => void;
};

/** Grosor del aro verde que rodea al marcador elegido. */
const ARO_DE_SELECCION = 4;

/** Chincheta de un elemento sobre el plano del barrio. */
export function MarcadorMapa({
  icono,
  color,
  accesibilidad,
  posicion,
  tamano = 40,
  forma = 'circulo',
  seleccionado = false,
  onPress,
}: PropsMarcador) {
  const esRedondo = forma === 'circulo';
  const redondeo = esRedondo ? radio.redondo : radio.boton - 2;

  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.9}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad}
      style={[
        {
          borderRadius: radio.redondo,
          // El aro de seleccion se dibuja como un marco de color detras del
          // marcador, igual que el anillo del mockup.
          ...(seleccionado
            ? { padding: ARO_DE_SELECCION, backgroundColor: colores.bosque }
            : null),
        },
        sombras.media,
        posicion,
      ]}
    >
      <View
        style={{
          width: tamano,
          height: tamano,
          borderRadius: redondeo,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: seleccionado ? 4 : 3,
          borderColor: colores.blanco,
        }}
      >
        <Icono nombre={icono} tamano={tamano * 0.5} color={colores.blanco} />
      </View>
    </Presionable>
  );
}

/**
 * Grupo de elementos muy juntos. Al tocarlo se acerca el mapa, que es la forma
 * de evitar que la pantalla quede tapada de chinchetas.
 */
export function GrupoDeMarcadores({
  cantidad,
  posicion,
  onPress,
}: {
  cantidad: number;
  posicion: ViewStyle;
  onPress?: () => void;
}) {
  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${cantidad} elementos agrupados, acercar`}
      style={[
        {
          width: 48,
          height: 48,
          borderRadius: radio.redondo,
          backgroundColor: colores.bosque,
          borderWidth: 3,
          borderColor: colores.blanco,
          alignItems: 'center',
          justifyContent: 'center',
        },
        sombras.media,
        posicion,
      ]}
    >
      <Texto tamano={17} peso="fuerte" color={colores.blanco}>
        {String(cantidad)}
      </Texto>
    </Presionable>
  );
}

/** Punto azul que indica donde esta la persona. */
export function MiUbicacion({ posicion }: { posicion: ViewStyle }) {
  return (
    <View
      accessible
      accessibilityLabel="Tu ubicación"
      style={[
        {
          width: 22,
          height: 22,
          borderRadius: radio.redondo,
          backgroundColor: colores.ubicacionPropia,
          borderWidth: 4,
          borderColor: colores.blanco,
        },
        sombras.suave,
        posicion,
      ]}
    />
  );
}
