import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  BarraDePasos,
  BarraInferior,
  Boton,
  BotonCircular,
  Columna,
  Fila,
  Opcion,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { vinculosConElBarrio } from '@/datos/perfil';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio } from '@/diseno/medidas';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 1.2 Vinculo con el barrio.
 *
 * La organizacion ya definio en 2022 que habitante es quien vive, estudia,
 * trabaja o tiene un vinculo con el barrio, asi que se puede marcar mas de una
 * opcion y ninguna es excluyente.
 */
export default function Vinculo() {
  const volver = crearVolver('/');
  const [elegidos, setElegidos] = useState<string[]>([]);

  function alternar(id: string) {
    setElegidos((actuales) =>
      actuales.includes(id) ? actuales.filter((otro) => otro !== id) : [...actuales, id],
    );
  }

  return (
    <Pantalla>
      <Fila
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}
      >
        <BotonCircular icono="flechaIzquierda" accesibilidad="Volver" onPress={volver} />
        <View style={{ flex: 1 }}>
          <BarraDePasos paso={1} total={2} />
        </View>
        <Presionable
          onPress={() => router.push('/ingreso/intereses')}
          accessibilityRole="button"
          accessibilityLabel="Omitir"
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
      </Fila>

      <Columna separacion={espacio.normal} style={{ paddingHorizontal: espacio.bloque }}>
        <Texto tamano={14} peso="fuerte" color={colores.verde} espaciado={0.6}>
          PASO 1 DE 2
        </Texto>
        <Texto tamano={32} familia="titulo" interlineado={1.08}>
          ¿Cuál es tu relación con el barrio?
        </Texto>
        <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
          Marca todas las que correspondan. Así te mostramos lo que te sirve.
        </Texto>
      </Columna>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.seccion,
          paddingTop: espacio.amplio,
          paddingBottom: espacio.normal,
          gap: espacio.comodo,
        }}
      >
        {vinculosConElBarrio.map((vinculo) => (
          <Opcion
            key={vinculo.id}
            texto={vinculo.titulo}
            detalle={vinculo.detalle}
            activa={elegidos.includes(vinculo.id)}
            onPress={() => alternar(vinculo.id)}
          />
        ))}
      </ScrollView>

      <BarraInferior>
        <Texto tamano={14} color={colores.grisTexto} alineacion="center">
          Puedes cambiarlo cuando quieras en tu perfil.
        </Texto>
        <Boton
          texto="Continuar"
          alto={56}
          tamanoDeTexto={18}
          onPress={() => router.push('/ingreso/intereses')}
        />
      </BarraInferior>
    </Pantalla>
  );
}
