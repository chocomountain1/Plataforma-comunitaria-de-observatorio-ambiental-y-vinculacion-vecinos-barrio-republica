import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapaBarrio } from '@/componentes/app';
import {
  BarraDePasos,
  Boton,
  BotonCircular,
  Columna,
  Fila,
  Icono,
  Presionable,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio, sombras } from '@/diseno/medidas';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 3.3 Ubicacion.
 *
 * El punto queda fijo al centro y lo que se mueve es el plano. Es mas facil de
 * usar con una mano que arrastrar una chincheta chica.
 */
export default function PasoUbicacion() {
  const volver = crearVolver('/reportar/foto');
  const margenes = useSafeAreaInsets();
  const { reporte, cambiarReporte } = usarBorradores();

  function confirmar() {
    // Hay un reporte parecido a treinta metros, asi que antes de seguir se
    // pregunta si es el mismo. Evitar duplicados fue una decision explicita del
    // equipo, sin recurrir a deteccion automatica.
    cambiarReporte({ posibleDuplicado: 'microbasural-sazie' });
    router.push('/reportar/duplicado');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colores.mapaFondo }}>
      <MapaBarrio />

      <Columna
        separacion={espacio.medio}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: colores.crema,
            paddingTop: margenes.top + espacio.medio,
            paddingHorizontal: espacio.seccion,
            paddingBottom: 14,
          },
          sombras.flotante,
        ]}
      >
        <Fila separacion={14}>
          <BotonCircular icono="flechaIzquierda" accesibilidad="Paso anterior" onPress={volver} />
          <Columna crecer={1} separacion={espacio.corto}>
            <Texto tamano={14} peso="fuerte" color={colores.verde}>
              Paso 3 de 5 · Dónde
            </Texto>
            <BarraDePasos paso={3} total={5} />
          </Columna>
        </Fila>
        <Texto tamano={28} familia="titulo" interlineado={1.1}>
          ¿Dónde está?
        </Texto>
        <Texto tamano={16} color={colores.grisTexto} style={{ marginTop: -espacio.apretado }}>
          Mueve el mapa hasta dejar el punto encima
        </Texto>
      </Columna>

      <ChinchetaCentral />

      <Presionable
        accessibilityRole="button"
        accessibilityLabel="Usar mi ubicación"
        style={[
          {
            position: 'absolute',
            right: espacio.amplio,
            bottom: 260,
            width: 52,
            height: 52,
            borderRadius: radio.caja,
            backgroundColor: colores.papel,
            alignItems: 'center',
            justifyContent: 'center',
          },
          sombras.flotante,
        ]}
      >
        <Icono nombre="mira" tamano={24} color={colores.ubicacionPropia} />
      </Presionable>

      <Columna
        separacion={espacio.medio}
        style={[
          {
            marginTop: 'auto',
            backgroundColor: colores.papel,
            borderTopLeftRadius: radio.hoja,
            borderTopRightRadius: radio.hoja,
            paddingTop: 18,
            paddingHorizontal: espacio.seccion,
            paddingBottom: Math.max(margenes.bottom, espacio.seccion),
          },
          sombras.hoja,
        ]}
      >
        <Fila separacion={espacio.medio}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: radio.boton,
              backgroundColor: colores.menta,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icono nombre="pin" tamano={24} color={colores.verde} />
          </View>
          <Columna crecer={1} separacion={espacio.minimo}>
            <Texto tamano={18} peso="fuerte">
              {reporte.direccion}
            </Texto>
            <Texto tamano={14.5} color={colores.grisTexto}>
              Barrio República, Santiago
            </Texto>
          </Columna>
        </Fila>
        <Boton texto="Confirmar ubicación" alto={56} tamanoDeTexto={18} onPress={confirmar} vibrar />
      </Columna>
    </View>
  );
}

/**
 * Chincheta fija al centro del plano, con su sombra en el suelo. Marca donde
 * va a quedar el reporte.
 */
function ChinchetaCentral() {
  return (
    <View
      pointerEvents="none"
      accessible={false}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={[
          {
            width: 48,
            height: 48,
            borderTopLeftRadius: radio.redondo,
            borderTopRightRadius: radio.redondo,
            borderBottomRightRadius: radio.redondo,
            borderBottomLeftRadius: 4,
            backgroundColor: colores.bosque,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: '-45deg' }],
          },
          sombras.media,
        ]}
      >
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: radio.redondo,
            backgroundColor: colores.brote,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
      <View
        style={{
          marginTop: espacio.corto,
          width: 16,
          height: 6,
          borderRadius: radio.redondo,
          backgroundColor: 'rgba(0,0,0,0.22)',
        }}
      />
    </View>
  );
}
