import { router } from 'expo-router';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Boton, Columna, Fila, Icono, Pantalla, Presionable, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import { usarPreferencias } from '@/estado/preferencias';

/**
 * Las tres promesas de la aplicacion, en el orden del mockup.
 *
 * La primera decia "sin crear cuenta", que era cierto hasta el 19 de octubre.
 * Desde que la cuenta es obligatoria, dejarla asi seria prometer algo que la
 * pantalla siguiente desmiente. Lo que se conserva es la promesa de fondo, que
 * es la rapidez, porque la barrera que aparecio en terreno era el tiempo del
 * registro y no el registro en si.
 */
const promesas: { icono: NombreIcono; texto: string }[] = [
  { icono: 'pin', texto: 'Reporta en un minuto, sin contraseñas' },
  { icono: 'visto', texto: 'Mira en qué va cada reporte' },
  { icono: 'personas', texto: 'Propón soluciones con tus vecinos' },
];

/**
 * 1.1 Bienvenida.
 *
 * Es la unica pantalla, junto con el registro, a la que se llega sin haber
 * entrado. La friccion del registro fue la principal barrera de adopcion
 * declarada en terreno, y la respuesta a eso no es saltarse la cuenta, que la
 * contraparte descarto el 19 de octubre, sino que crearla cueste un correo y
 * un codigo de seis numeros.
 */
export default function Bienvenida() {
  const { menosAnimaciones, rotarTamanoDeTexto, factorTexto } = usarPreferencias();
  const animar = !menosAnimaciones;

  return (
    <Pantalla fondo={colores.bosque}>
      <FormasDeFondo />

      <Columna
        crecer={1}
        style={{ paddingHorizontal: espacio.bloque, paddingBottom: espacio.comodo }}
      >
        <Fila repartir="space-between" style={{ paddingTop: espacio.bloque }}>
          <Fila separacion={espacio.comodo}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radio.boton,
                backgroundColor: colores.brote,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icono nombre="hoja" tamano={26} color={colores.bosque} grosor={2.2} />
            </View>
            <Columna separacion={1}>
              <Texto tamano={19} familia="titulo" color={colores.papel} espaciado={0.2}>
                Barrio República
              </Texto>
              <Texto tamano={13} color={colores.textoTenueSobreBosque}>
                por República Circular
              </Texto>
            </Columna>
          </Fila>

          <Presionable
            onPress={rotarTamanoDeTexto}
            accessibilityRole="button"
            accessibilityLabel={`Cambiar el tamaño de la letra. Ahora está en ${Math.round(factorTexto * 100)} por ciento`}
            style={{
              minWidth: 56,
              height: 44,
              borderRadius: radio.redondo,
              borderWidth: 1.5,
              borderColor: colores.bosqueBorde,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: espacio.minimo,
            }}
          >
            <Texto tamano={16} peso="fuerte" color={colores.papel}>
              A
            </Texto>
            <Texto tamano={21} peso="fuerte" color={colores.papel}>
              A
            </Texto>
          </Presionable>
        </Fila>

        <Columna separacion={18} style={{ marginTop: 'auto' }}>
          <Animated.View entering={animar ? FadeInUp.duration(500) : undefined}>
            <Texto tamano={44} familia="titulo" color={colores.papel} interlineado={1.02} espaciado={-0.3}>
              Tu barrio mejora cuando lo hacemos{' '}
              <Texto tamano={44} familia="titulo" color={colores.brote} interlineado={1.02}>
                entre todos
              </Texto>
            </Texto>
          </Animated.View>

          <Texto tamano={18} color={colores.textoSobreBosque} interlineado={1.45}>
            Reporta lo que ves, propone cómo arreglarlo y súmate a lo que tus vecinos ya están
            haciendo.
          </Texto>

          <Columna separacion={espacio.medio} style={{ marginTop: espacio.corto }}>
            {promesas.map((promesa, posicion) => (
              <Animated.View
                key={promesa.texto}
                entering={animar ? FadeInDown.delay(120 * posicion).duration(420) : undefined}
              >
                <Fila separacion={espacio.medio}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: radio.boton - 2,
                      backgroundColor: colores.bosqueClaro,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icono nombre={promesa.icono} tamano={20} color={colores.brote} />
                  </View>
                  <Texto tamano={16} color={colores.papel} style={{ flex: 1 }}>
                    {promesa.texto}
                  </Texto>
                </Fila>
              </Animated.View>
            ))}
          </Columna>

          <Columna separacion={espacio.medio} style={{ marginTop: 14 }}>
            <Boton
              texto="Comenzar"
              variante="brote"
              icono="flechaDerecha"
              iconoAlFinal
              alto={alturaTocable.destacada}
              tamanoDeTexto={18}
              onPress={() => router.push('/ingreso/vinculo')}
              vibrar
            />
            <Boton
              texto="Ya tengo cuenta"
              variante="contornoClaro"
              alto={54}
              tamanoDeTexto={17}
              onPress={() => router.push('/ingreso/cuenta')}
            />
          </Columna>
        </Columna>
      </Columna>
    </Pantalla>
  );
}

/**
 * Las dos figuras decorativas del fondo. Van detras del contenido y no se leen
 * con el lector de pantalla.
 */
function FormasDeFondo() {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}
    >
      <View
        style={{
          position: 'absolute',
          right: -90,
          top: -70,
          width: 300,
          height: 300,
          borderRadius: radio.redondo,
          borderWidth: 46,
          borderColor: colores.bosqueClaro,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: -120,
          bottom: 180,
          width: 240,
          height: 240,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 120,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 120,
          backgroundColor: colores.bosqueMedio,
          transform: [{ rotate: '-20deg' }],
        }}
      />
    </View>
  );
}
