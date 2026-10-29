import { View } from 'react-native';

import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';

type PropsContador = {
  valor: number;
  onCambiar: (valor: number) => void;
  minimo?: number;
  maximo?: number;
  /** Nombre de lo que se cuenta, para el lector de pantalla. */
  accesibilidad: string;
};

/**
 * Contador de menos y mas. Se usa para decir cuantas manos voluntarias necesita
 * una propuesta o una actividad.
 */
export function Contador({
  valor,
  onCambiar,
  minimo = 0,
  maximo = 99,
  accesibilidad,
}: PropsContador) {
  return (
    <View
      accessible
      accessibilityLabel={`${accesibilidad}: ${valor}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: espacio.apretado,
        height: alturaTocable.minima,
        paddingHorizontal: espacio.apretado,
        borderWidth: 1.5,
        borderColor: colores.bordeFuerte,
        borderRadius: radio.boton - 2,
      }}
    >
      <BotonDePaso
        signo="−"
        accesibilidad={`Menos ${accesibilidad}`}
        deshabilitado={valor <= minimo}
        onPress={() => onCambiar(Math.max(minimo, valor - 1))}
      />
      <Texto tamano={16} peso="fuerte" alineacion="center" style={{ minWidth: 22 }}>
        {String(valor)}
      </Texto>
      <BotonDePaso
        signo="+"
        accesibilidad={`Más ${accesibilidad}`}
        deshabilitado={valor >= maximo}
        onPress={() => onCambiar(Math.min(maximo, valor + 1))}
      />
    </View>
  );
}

function BotonDePaso({
  signo,
  accesibilidad,
  deshabilitado,
  onPress,
}: {
  signo: string;
  accesibilidad: string;
  deshabilitado: boolean;
  onPress: () => void;
}) {
  return (
    <Presionable
      onPress={deshabilitado ? undefined : onPress}
      escalaAlTocar={0.88}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad}
      accessibilityState={{ disabled: deshabilitado }}
      style={{
        width: 32,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: deshabilitado ? 0.35 : 1,
      }}
    >
      <Texto tamano={20} peso="fuerte">
        {signo}
      </Texto>
    </Presionable>
  );
}
