import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  BarraInferior,
  Boton,
  Chip,
  Columna,
  EncabezadoDePaso,
  Contador,
  Fila,
  Icono,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { disciplinas, tiposDeApoyo } from '@/datos/propuestas';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/** Color de la divisoria entre filas de la tarjeta de apoyos. */
const COLOR_DIVISORIA = '#EEE7D7';

/**
 * 5.3 Nueva propuesta, segundo paso.
 *
 * Declarar que se necesita es lo que permite despues que una universidad o un
 * local encuentren donde calzan. Sin esta pantalla el modulo de vinculacion no
 * tendria con que trabajar.
 */
export default function NuevaPropuestaNecesita() {
  const volver = crearVolver('/propuestas/nueva/idea');
  const { propuesta, cambiarPropuesta } = usarBorradores();

  function alternarApoyo(titulo: string) {
    const actuales = propuesta.apoyosNecesarios;
    cambiarPropuesta({
      apoyosNecesarios: actuales.includes(titulo)
        ? actuales.filter((otro) => otro !== titulo)
        : [...actuales, titulo],
    });
  }

  function alternarDisciplina(nombre: string) {
    const actuales = propuesta.disciplinas;
    cambiarPropuesta({
      disciplinas: actuales.includes(nombre)
        ? actuales.filter((otra) => otra !== nombre)
        : [...actuales, nombre],
    });
  }

  return (
    <Pantalla>
      <EncabezadoDePaso paso={2} total={3} nombre="Qué se necesita" onVolver={volver} />

      <Columna style={{ paddingHorizontal: espacio.bloque, paddingTop: 14 }}>
        <Texto tamano={32} familia="titulo" interlineado={1.08}>
          ¿Qué se necesita?
        </Texto>
        <Texto tamano={16} color={colores.grisTexto} interlineado={1.4}>
          Así vecinos, locales y universidades saben cómo sumarse.
        </Texto>
      </Columna>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.seccion,
          paddingTop: espacio.amplio,
          paddingBottom: espacio.seccion,
          gap: espacio.amplio,
        }}
      >
        <View
          style={{
            backgroundColor: colores.papel,
            borderWidth: 1,
            borderColor: colores.borde,
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          {tiposDeApoyo.map((tipo, posicion) => {
            const elegido = propuesta.apoyosNecesarios.includes(tipo.titulo);
            return (
              <Fila
                key={tipo.id}
                separacion={espacio.medio}
                style={{
                  minHeight: 60,
                  paddingVertical: espacio.normal,
                  paddingHorizontal: 14,
                  ...(posicion === tiposDeApoyo.length - 1
                    ? null
                    : { borderBottomWidth: 1, borderBottomColor: COLOR_DIVISORIA }),
                }}
              >
                <Presionable
                  onPress={() => alternarApoyo(tipo.titulo)}
                  escalaAlTocar={0.995}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: elegido }}
                  accessibilityLabel={tipo.titulo}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: espacio.medio }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      borderWidth: 2,
                      borderColor: elegido ? colores.verde : colores.bordeFuerte,
                      backgroundColor: elegido ? colores.verde : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {elegido ? (
                      <Icono nombre="visto" tamano={15} color={colores.papel} grosor={3} />
                    ) : null}
                  </View>
                  <Columna crecer={1}>
                    <Texto tamano={16.5} peso="fuerte">
                      {tipo.titulo}
                    </Texto>
                    <Texto tamano={13.5} color={colores.grisTexto}>
                      {tipo.detalle}
                    </Texto>
                  </Columna>
                </Presionable>

                {tipo.conCantidad && elegido ? (
                  <Contador
                    valor={propuesta.voluntarios}
                    onCambiar={(valor) => cambiarPropuesta({ voluntarios: valor })}
                    minimo={1}
                    accesibilidad="manos voluntarias"
                  />
                ) : null}
              </Fila>
            );
          })}
        </View>

        <Columna separacion={espacio.normal}>
          <Texto tamano={16} peso="fuerte">
            ¿Qué conocimientos ayudarían?
          </Texto>
          <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
            {disciplinas.map((nombre) => {
              const elegida = propuesta.disciplinas.includes(nombre);
              return (
                <Chip
                  key={nombre}
                  texto={nombre}
                  activo={elegida}
                  icono={elegida ? 'visto' : undefined}
                  onPress={() => alternarDisciplina(nombre)}
                  alto={42}
                  variante="marcado"
                />
              );
            })}
          </Fila>
        </Columna>
      </ScrollView>

      <BarraInferior>
        <Boton
          texto="Revisar y publicar"
          icono="flechaDerecha"
          iconoAlFinal
          alto={56}
          tamanoDeTexto={18}
          onPress={() => router.push('/propuestas/nueva/revisar')}
        />
      </BarraInferior>
    </Pantalla>
  );
}
