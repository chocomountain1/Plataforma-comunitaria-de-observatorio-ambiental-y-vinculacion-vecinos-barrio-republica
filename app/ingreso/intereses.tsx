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
  FilaDeLista,
  Interruptor,
  ListaAgrupada,
  Pantalla,
  Presionable,
  Sigla,
  Texto,
} from '@/componentes/base';
import { interesesDelMapa } from '@/datos/perfil';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio } from '@/diseno/medidas';
import { crearVolver } from '@/utiles/navegacion';

/** Color de cada sigla, para que el grupo se lea de un vistazo. */
const coloresDeSigla: Record<string, { fondo: string; texto: string }> = {
  reportes: { fondo: '#F5E6C8', texto: '#8A5A12' },
  propuestas: { fondo: colores.menta, texto: '#174D34' },
  residuos: { fondo: '#EFE2D4', texto: '#7A4A1F' },
  verdes: { fondo: '#DDEBD4', texto: '#2E6B3F' },
  patrimonio: { fondo: '#F3DCD7', texto: '#9C3A33' },
  movilidad: { fondo: '#DCE7F3', texto: '#2C5A8C' },
  mobiliario: { fondo: '#E6E8EC', texto: '#4A5560' },
};

/**
 * 1.3 Que quiero ver en el mapa.
 *
 * Se muestran solo las capas elegidas para que el plano se lea facil. Es la
 * misma lista que despues aparece en Mapa y Capas.
 */
export default function Intereses() {
  const volver = crearVolver('/ingreso/vinculo');
  const [encendidos, setEncendidos] = useState<string[]>(['reportes', 'propuestas', 'residuos']);

  function alternar(id: string) {
    setEncendidos((actuales) =>
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
          <BarraDePasos paso={2} total={2} />
        </View>
        <Presionable
          onPress={() => router.push('/ingreso/cuenta')}
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
          PASO 2 DE 2
        </Texto>
        <Texto tamano={32} familia="titulo" interlineado={1.08}>
          ¿Qué quieres ver en el mapa?
        </Texto>
        <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
          Mostramos solo lo que elijas para que el mapa se lea fácil. Lo cambias cuando quieras en
          Mapa › Capas.
        </Texto>
      </Columna>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.seccion,
          paddingTop: 18,
          paddingBottom: espacio.normal,
        }}
      >
        <ListaAgrupada>
          {interesesDelMapa.map((interes, posicion) => {
            const tono = coloresDeSigla[interes.id] ?? { fondo: colores.crema, texto: colores.tinta };
            return (
              <FilaDeLista
                key={interes.id}
                titulo={interes.titulo}
                detalle={interes.detalle}
                adorno={<Sigla texto={interes.sigla} fondo={tono.fondo} color={tono.texto} />}
                ultima={posicion === interesesDelMapa.length - 1}
                onPress={() => alternar(interes.id)}
                control={
                  <Interruptor
                    activo={encendidos.includes(interes.id)}
                    onCambiar={() => alternar(interes.id)}
                    accesibilidad={interes.titulo}
                  />
                }
              />
            );
          })}
        </ListaAgrupada>
      </ScrollView>

      <BarraInferior>
        <Boton
          texto="Listo"
          alto={56}
          tamanoDeTexto={18}
          onPress={() => router.push('/ingreso/cuenta')}
        />
      </BarraInferior>
    </Pantalla>
  );
}
