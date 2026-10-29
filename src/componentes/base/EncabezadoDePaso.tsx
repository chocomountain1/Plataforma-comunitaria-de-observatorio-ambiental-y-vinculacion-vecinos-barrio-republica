import { View } from 'react-native';

import { BarraDePasos } from './BarraDePasos';
import { BotonCircular } from './BotonCircular';
import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio } from '@/diseno/medidas';

type PropsEncabezadoDePaso = {
  paso: number;
  total: number;
  /** Nombre del paso, por ejemplo "Que pasa". Va junto al contador. */
  nombre?: string;
  onVolver: () => void;
  /** El primer paso cancela el flujo completo en vez de retroceder. */
  esPrimerPaso?: boolean;
  textoDeCancelar?: string;
  /** Enlace para saltarse el paso, como el "Omitir" del registro. */
  onOmitir?: () => void;
};

/**
 * Cabecera comun de los flujos de varios pasos: reportar, proponer y el
 * registro inicial. Muestra siempre "Paso X de Y", que es una de las reglas de
 * accesibilidad del sistema visual.
 */
export function EncabezadoDePaso({
  paso,
  total,
  nombre,
  onVolver,
  esPrimerPaso = false,
  textoDeCancelar = 'Cancelar',
  onOmitir,
}: PropsEncabezadoDePaso) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: espacio.medio,
        paddingHorizontal: espacio.seccion,
        paddingBottom: espacio.corto,
      }}
    >
      <BotonCircular
        icono={esPrimerPaso ? 'cerrar' : 'flechaIzquierda'}
        accesibilidad={esPrimerPaso ? textoDeCancelar : 'Paso anterior'}
        onPress={onVolver}
      />
      <View style={{ flex: 1, gap: espacio.corto }}>
        {nombre === undefined ? null : (
          <Texto tamano={14} peso="fuerte" color={colores.verde}>
            {`Paso ${paso} de ${total} · ${nombre}`}
          </Texto>
        )}
        <BarraDePasos paso={paso} total={total} />
      </View>
      {onOmitir === undefined ? null : (
        <Presionable
          onPress={onOmitir}
          accessibilityRole="button"
          accessibilityLabel="Omitir este paso"
          style={{
            minHeight: alturaTocable.minima,
            justifyContent: 'center',
            paddingHorizontal: espacio.corto,
          }}
        >
          <Texto tamano={16} peso="fuerte" color={colores.grisTexto}>
            Omitir
          </Texto>
        </Presionable>
      )}
    </View>
  );
}
