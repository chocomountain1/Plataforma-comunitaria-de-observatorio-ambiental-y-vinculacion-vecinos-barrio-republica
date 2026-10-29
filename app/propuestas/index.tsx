import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { FilaDePropuesta } from '@/componentes/app';
import {
  Aviso,
  Boton,
  BotonCircular,
  Chip,
  Columna,
  Fila,
  Pantalla,
  Texto,
} from '@/componentes/base';
import { ejesDePropuesta } from '@/datos/propuestas';
import { espacio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 5.1 Propuestas del barrio.
 *
 * Van ordenadas por apoyos y por cuantos reportes del mismo problema responden.
 * Ese criterio mezclado, deliberacion mas frecuencia, es el que el equipo
 * acordo con la contraparte para definir que significa priorizada.
 */
export default function Propuestas() {
  const volver = crearVolver('/inicio');
  const { propuestas } = usarBarrio();
  const { reiniciarPropuesta } = usarBorradores();
  const [eje, setEje] = useState<string>('Todas');

  const visibles = propuestas
    .filter((propuesta) => eje === 'Todas' || propuesta.eje === eje)
    .slice()
    .sort((una, otra) => otra.apoyos + otra.reportesQueResuelve * 3 - (una.apoyos + una.reportesQueResuelve * 3));

  function proponer() {
    reiniciarPropuesta();
    router.push('/propuestas/nueva/idea');
  }

  return (
    <Pantalla>
      <Fila
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}
      >
        <BotonCircular icono="flechaIzquierda" accesibilidad="Volver" onPress={volver} />
        <Texto tamano={28} familia="titulo" style={{ flex: 1 }}>
          Propuestas
        </Texto>
        <Boton
          texto="Proponer"
          icono="mas"
          alto={44}
          tamanoDeTexto={15}
          ancho="contenido"
          onPress={proponer}
        />
      </Fila>

      <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.seccion }}>
        {ejesDePropuesta.map((opcion) => (
          <Chip
            key={opcion}
            texto={opcion}
            activo={eje === opcion}
            onPress={() => setEje(opcion)}
            tamanoDeTexto={14}
          />
        ))}
      </Fila>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingTop: espacio.medio,
          paddingBottom: espacio.bloque,
          gap: espacio.comodo,
        }}
      >
        <Aviso
          tono="neutro"
          texto="Ordenadas por apoyos y reportes del mismo problema"
          tamanoDeTexto={13.5}
        />

        {visibles.map((propuesta, posicion) => (
          <FilaDePropuesta
            key={propuesta.id}
            propuesta={propuesta}
            orden={posicion + 1}
            onPress={() => router.push(`/propuestas/${propuesta.id}`)}
          />
        ))}

        {visibles.length === 0 ? (
          <Columna separacion={espacio.comodo} style={{ paddingTop: espacio.seccion }}>
            <Texto tamano={16} alineacion="center">
              Todavía no hay propuestas en este eje.
            </Texto>
            <Boton texto="Proponer la primera" onPress={proponer} />
          </Columna>
        ) : null}
      </ScrollView>
    </Pantalla>
  );
}
