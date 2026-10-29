import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icono, Presionable, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { espacio, radio, sombras } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';

/**
 * Cinco destinos fijos. Reportar va al centro, grande y con texto, porque es la
 * puerta de entrada de todo el sistema y la historia de usuario mas importante.
 */
const destinos: Record<string, { etiqueta: string; icono: NombreIcono }> = {
  inicio: { etiqueta: 'Inicio', icono: 'casa' },
  mapa: { etiqueta: 'Mapa', icono: 'mapa' },
  reportar: { etiqueta: 'Reportar', icono: 'mas' },
  'mis-reportes': { etiqueta: 'Mis reportes', icono: 'portapapeles' },
  avisos: { etiqueta: 'Avisos', icono: 'campana' },
};

export function BarraNavegacion({ state, navigation }: BottomTabBarProps) {
  const margenes = useSafeAreaInsets();
  const { avisosSinLeer } = usarBarrio();

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Navegación principal"
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: colores.papel,
        borderTopWidth: 1,
        borderTopColor: colores.borde,
        paddingTop: espacio.comodo,
        paddingBottom: Math.max(margenes.bottom, espacio.seccion),
        paddingHorizontal: espacio.apretado,
      }}
    >
      {state.routes.map((ruta, posicion) => {
        const destino = destinos[ruta.name];
        if (destino === undefined) return null;

        const activo = state.index === posicion;
        const esReportar = ruta.name === 'reportar';
        const contador = ruta.name === 'avisos' ? avisosSinLeer : 0;

        return (
          <Presionable
            key={ruta.key}
            onPress={() => navigation.navigate(ruta.name)}
            escalaAlTocar={esReportar ? 0.93 : 0.96}
            vibrar={esReportar}
            accessibilityRole="tab"
            accessibilityState={{ selected: activo }}
            accessibilityLabel={
              contador > 0 ? `${destino.etiqueta}, ${contador} sin leer` : destino.etiqueta
            }
            style={{ flex: 1, alignItems: 'center', gap: espacio.apretado }}
          >
            {esReportar ? (
              <BotonCentral />
            ) : (
              <Pastilla activo={activo} icono={destino.icono} contador={contador} />
            )}
            <Texto
              tamano={12.5}
              peso={activo || esReportar ? 'fuerte' : 'normal'}
              color={esReportar ? colores.bosque : activo ? colores.verde : colores.grisTexto}
            >
              {destino.etiqueta}
            </Texto>
          </Presionable>
        );
      })}
    </View>
  );
}

/** Icono con la pastilla verde que marca el destino actual. */
function Pastilla({
  activo,
  icono,
  contador,
}: {
  activo: boolean;
  icono: NombreIcono;
  contador: number;
}) {
  return (
    <View
      style={{
        width: 52,
        height: 30,
        borderRadius: radio.redondo,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: activo ? colores.menta : 'transparent',
      }}
    >
      <Icono nombre={icono} tamano={22} color={activo ? colores.verde : colores.grisTexto} />
      {contador > 0 ? <ContadorDeAvisos cantidad={contador} /> : null}
    </View>
  );
}

function ContadorDeAvisos({ cantidad }: { cantidad: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 10,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        paddingHorizontal: espacio.apretado,
        backgroundColor: colores.alerta,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Texto tamano={11} peso="fuerte" color={colores.blanco}>
        {String(cantidad)}
      </Texto>
    </View>
  );
}

/** Boton redondo de reportar, que sobresale por encima de la barra. */
function BotonCentral() {
  return (
    <View
      style={[
        {
          width: 58,
          height: 58,
          marginTop: -30,
          borderRadius: radio.redondo,
          backgroundColor: colores.verde,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 4,
          borderColor: colores.papel,
        },
        sombras.media,
      ]}
    >
      <Icono nombre="mas" tamano={28} color={colores.blanco} grosor={2.4} />
    </View>
  );
}
