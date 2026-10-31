import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import {
  BarraInferior,
  Boton,
  Columna,
  Fila,
  Icono,
  Interruptor,
  Presionable,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { idsDeEstado, estados } from '@/dominio/estados';
import { usarBarrio } from '@/estado/barrio';
import { usarPreferencias } from '@/estado/preferencias';
import { usarQuienEntro } from '@/estado/sesion';

/**
 * 3.7 Reporte enviado.
 *
 * Cierra el flujo mostrando el recorrido completo que le espera al reporte. Es
 * la promesa de retorno que la aplicacion tiene que cumplir despues: sin ella,
 * el vecino reporta una vez y no vuelve.
 */
export default function ReporteEnviado() {
  const margenes = useSafeAreaInsets();
  const { ultimoReportePublicado } = usarBarrio();
  const { menosAnimaciones } = usarPreferencias();
  const quienEntro = usarQuienEntro();
  const [avisosActivos, setAvisosActivos] = useState(true);

  const animar = !menosAnimaciones;

  return (
    <View style={{ flex: 1, backgroundColor: colores.crema }}>
      <Columna
        alinear="center"
        separacion={espacio.medio}
        style={{
          backgroundColor: colores.bosque,
          paddingTop: margenes.top + espacio.bloque,
          paddingHorizontal: espacio.bloque,
          paddingBottom: 28,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Animated.View entering={animar ? ZoomIn.duration(420) : undefined}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: radio.redondo,
              backgroundColor: colores.brote,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 12,
              borderColor: colores.bosqueClaro,
            }}
          >
            <Icono nombre="visto" tamano={44} color={colores.bosque} grosor={2.6} />
          </View>
        </Animated.View>

        <Texto
          tamano={34}
          familia="titulo"
          color={colores.papel}
          alineacion="center"
          interlineado={1.05}
          style={{ marginTop: espacio.comodo }}
        >
          {`¡Listo, ${quienEntro.nombre}!`}
        </Texto>
        <Texto
          tamano={17}
          color={colores.textoSobreBosque}
          alineacion="center"
          interlineado={1.45}
        >
          Tu reporte ya está en el mapa del barrio. Te avisaremos cada vez que avance.
        </Texto>
      </Columna>

      <Animated.View entering={animar ? FadeIn.delay(200).duration(400) : undefined}>
        <Columna
          separacion={14}
          style={{
            marginHorizontal: espacio.seccion,
            marginTop: 18,
            backgroundColor: colores.papel,
            borderWidth: 1,
            borderColor: colores.borde,
            borderRadius: 20,
            padding: espacio.amplio,
          }}
        >
          <Texto tamano={15} peso="fuerte" color={colores.grisTexto} espaciado={0.4}>
            EN QUÉ VA
          </Texto>
          <Fila alinear="flex-start">
            {idsDeEstado.map((id) => {
              const alcanzado = estados[id].paso === 1;
              return (
                <Columna key={id} crecer={1} alinear="center" separacion={espacio.corto}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: radio.redondo,
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...(alcanzado
                        ? { backgroundColor: colores.verde, borderWidth: 5, borderColor: colores.menta }
                        : {
                            backgroundColor: colores.papel,
                            borderWidth: 2,
                            borderColor: colores.bordeFuerte,
                          }),
                    }}
                  >
                    {alcanzado ? (
                      <Icono nombre="visto" tamano={16} color={colores.blanco} grosor={2.8} />
                    ) : null}
                  </View>
                  <Texto
                    tamano={13.5}
                    peso={alcanzado ? 'fuerte' : 'normal'}
                    color={alcanzado ? colores.tinta : colores.grisTexto}
                    alineacion="center"
                  >
                    {estados[id].etiqueta}
                  </Texto>
                </Columna>
              );
            })}
          </Fila>
        </Columna>
      </Animated.View>

      <Presionable
        onPress={() => router.replace('/propuestas/nueva/idea')}
        accessibilityRole="button"
        accessibilityLabel="¿Tienes una idea para resolverlo? Propónla"
        style={{
          marginHorizontal: espacio.seccion,
          marginTop: espacio.medio,
          backgroundColor: '#F5E6C8',
          borderRadius: 20,
          padding: espacio.amplio,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: radio.boton,
            backgroundColor: colores.ocre,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icono nombre="idea" tamano={24} color={colores.blanco} />
        </View>
        <Columna crecer={1} separacion={espacio.minimo}>
          <Texto tamano={17} peso="fuerte" color="#3E2A08">
            ¿Tienes una idea para resolverlo?
          </Texto>
          <Texto tamano={14.5} color="#3E2A08" interlineado={1.35}>
            Propónla y otros vecinos pueden apoyarla
          </Texto>
        </Columna>
        <Icono nombre="flechaDerecha" tamano={22} color="#3E2A08" />
      </Presionable>

      <Fila
        separacion={espacio.medio}
        style={{
          marginHorizontal: espacio.seccion,
          marginTop: espacio.medio,
          backgroundColor: colores.papel,
          borderWidth: 1,
          borderColor: colores.borde,
          borderRadius: 20,
          paddingVertical: 14,
          paddingHorizontal: espacio.amplio,
        }}
      >
        <Icono nombre="campana" tamano={24} color={colores.verde} />
        <Texto tamano={15} interlineado={1.35} style={{ flex: 1 }}>
          Avisos activados para este reporte
        </Texto>
        <Interruptor
          activo={avisosActivos}
          onCambiar={setAvisosActivos}
          accesibilidad="Avisos de este reporte"
        />
      </Fila>

      <BarraInferior fondo={colores.crema} style={{ borderTopWidth: 0 }}>
        <Boton
          texto="Ver mi reporte"
          alto={56}
          tamanoDeTexto={18}
          onPress={() =>
            router.replace(
              ultimoReportePublicado === null
                ? '/mis-reportes'
                : `/reportes/${ultimoReportePublicado}`,
            )
          }
        />
        <Boton
          texto="Volver al inicio"
          variante="secundaria"
          tamanoDeTexto={17}
          onPress={() => router.replace('/inicio')}
        />
      </BarraInferior>
    </View>
  );
}
