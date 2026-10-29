import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { Icono } from './Icono';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { espacio, radio } from '@/diseno/medidas';

/** Los cuatro tonos de nota que aparecen en los mockups. */
export type TonoAviso = 'informativo' | 'cuidado' | 'logro' | 'neutro';

type PropsAviso = {
  texto?: string;
  children?: ReactNode;
  tono?: TonoAviso;
  icono?: NombreIcono;
  tamanoDeTexto?: number;
  style?: StyleProp<ViewStyle>;
};

const tonos: Record<TonoAviso, { fondo: string; texto: string; icono: NombreIcono }> = {
  informativo: { fondo: '#DCE7F3', texto: '#244C78', icono: 'informacion' },
  cuidado: { fondo: '#F5E6C8', texto: '#6F4A0E', icono: 'ojo' },
  logro: { fondo: colores.menta, texto: '#174D34', icono: 'visto' },
  neutro: { fondo: colores.crema, texto: colores.grisTexto, icono: 'informacion' },
};

/**
 * Nota breve que explica algo o pide cuidado. Siempre lleva icono y texto,
 * nunca solo color, como pide la regla de accesibilidad del sistema.
 */
export function Aviso({
  texto,
  children,
  tono = 'informativo',
  icono,
  tamanoDeTexto = 14,
  style,
}: PropsAviso) {
  const apariencia = tonos[tono];

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: espacio.normal,
          backgroundColor: apariencia.fondo,
          borderRadius: radio.medio,
          paddingVertical: espacio.comodo,
          paddingHorizontal: espacio.medio,
        },
        style,
      ]}
    >
      <Icono nombre={icono ?? apariencia.icono} tamano={18} color={apariencia.texto} />
      <View style={{ flex: 1 }}>
        {texto === undefined ? (
          children
        ) : (
          <Texto tamano={tamanoDeTexto} color={apariencia.texto} interlineado={1.35}>
            {texto}
          </Texto>
        )}
      </View>
    </View>
  );
}
