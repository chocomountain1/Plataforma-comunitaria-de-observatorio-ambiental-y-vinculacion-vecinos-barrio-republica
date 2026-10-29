import { View } from 'react-native';

import { Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { radio } from '@/diseno/medidas';
import type { Persona } from '@/dominio/tipos';

type PropsAvatar = {
  persona: Persona;
  tamano?: number;
  /** Aro claro alrededor, como el avatar del encabezado de inicio. */
  conAro?: boolean;
  color?: string;
};

/**
 * Circulo con la inicial de la persona. No hay fotos de perfil en el diseno:
 * se identifica a cada quien por su seudonimo y su vinculo con el barrio.
 */
export function Avatar({ persona, tamano = 40, conAro = false, color }: PropsAvatar) {
  const fondo = color ?? (persona.esOrganizacion ? colores.bosque : colores.verde);
  return (
    <View
      accessible
      accessibilityLabel={persona.nombre}
      style={{
        width: tamano,
        height: tamano,
        borderRadius: radio.redondo,
        backgroundColor: fondo,
        alignItems: 'center',
        justifyContent: 'center',
        ...(conAro ? { borderWidth: 3, borderColor: colores.menta } : null),
      }}
    >
      <Texto
        tamano={persona.inicial.length > 1 ? tamano * 0.34 : tamano * 0.42}
        peso="fuerte"
        color={colores.papel}
      >
        {persona.inicial}
      </Texto>
    </View>
  );
}
