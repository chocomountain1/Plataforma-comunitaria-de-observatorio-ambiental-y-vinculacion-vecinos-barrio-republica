import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Encabezado } from '@/componentes/app';
import {
  Boton,
  Chip,
  Columna,
  Etiqueta,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { desafios } from '@/datos/observatorio';
import { disciplinas } from '@/datos/propuestas';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import type { Desafio } from '@/dominio/tipos';
import { crearVolver } from '@/utiles/navegacion';

/** Como se pinta cada nivel de prioridad comunitaria. */
const prioridades: Record<Desafio['prioridad'], { etiqueta: string; fondo: string; texto: string }> = {
  alta: { etiqueta: 'Prioridad alta', fondo: '#F3DCD7', texto: '#7A2A24' },
  media: { etiqueta: 'Prioridad media', fondo: '#F5E6C8', texto: '#6F4A0E' },
  baja: { etiqueta: 'Prioridad baja', fondo: colores.crema, texto: colores.grisTexto },
};

/** Las dos fuentes de desafios que puede explorar una institucion. */
const origenes = ['Propuestas', 'Problemas frecuentes'] as const;

/**
 * 8.1 Desafios para instituciones.
 *
 * Es la otra mitad del modulo de vinculacion. La universidad no entra a
 * proponer lo que cree que falta, sino a elegir dentro de lo que la comunidad
 * ya decidio que importa.
 */
export default function Desafios() {
  const volver = crearVolver('/perfil');
  const [origen, setOrigen] = useState<string>('Propuestas');
  const [disciplina, setDisciplina] = useState<string>('Ingeniería');

  const visibles = desafios.filter((desafio) => desafio.disciplinas.includes(disciplina));

  return (
    <Pantalla>
      <Encabezado
        titulo="Desafíos del barrio"
        subtitulo="FCFM · Universidad de Chile"
        tamanoDeTitulo={26}
        onVolver={volver}
      />

      <Texto
        tamano={15.5}
        color={colores.grisTexto}
        interlineado={1.4}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.medio }}
      >
        Lo que la comunidad ya propuso y priorizó. Encuentra uno que calce con tu curso o
        investigación.
      </Texto>

      <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.seccion }}>
        {origenes.map((opcion) => (
          <Chip
            key={opcion}
            texto={`${opcion} · ${opcion === 'Propuestas' ? 8 : 12}`}
            activo={origen === opcion}
            onPress={() => setOrigen(opcion)}
            tamanoDeTexto={14}
          />
        ))}
      </Fila>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: espacio.normal,
          paddingHorizontal: espacio.seccion,
          paddingTop: espacio.comodo,
        }}
        style={{ flexGrow: 0 }}
      >
        {disciplinas.map((nombre) => (
          <Chip
            key={nombre}
            texto={nombre}
            activo={disciplina === nombre}
            onPress={() => setDisciplina(nombre)}
            tamanoDeTexto={14}
          />
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingTop: espacio.amplio,
          paddingBottom: espacio.bloque,
          gap: espacio.medio,
        }}
      >
        <Texto tamano={14} color={colores.grisTexto}>
          {`${visibles.length} desafíos calzan · ordenados por prioridad comunitaria`}
        </Texto>

        {visibles.map((desafio) => (
          <Tarjeta key={desafio.id} separacion={espacio.comodo}>
            <Fila separacion={espacio.normal}>
              <Etiqueta
                texto={prioridades[desafio.prioridad].etiqueta}
                fondo={prioridades[desafio.prioridad].fondo}
                color={prioridades[desafio.prioridad].texto}
              />
              <Texto tamano={13} color={colores.grisTexto}>
                {desafio.eje}
              </Texto>
            </Fila>

            <Texto tamano={18} peso="fuerte" interlineado={1.3}>
              {desafio.titulo}
            </Texto>
            <Texto tamano={14} color={colores.grisTexto}>
              {desafio.resumen}
            </Texto>

            <Fila
              separacion={espacio.normal}
              alinear="flex-start"
              style={{
                backgroundColor: colores.crema,
                borderRadius: radio.medio,
                padding: espacio.comodo,
              }}
            >
              <Icono nombre="birrete" tamano={18} color={colores.grisTexto} />
              <Texto tamano={14} color={colores.grisTexto} interlineado={1.35} style={{ flex: 1 }}>
                <Texto tamano={14} peso="fuerte" color={colores.tinta}>
                  {'Busca: '}
                </Texto>
                {desafio.busca}
              </Texto>
            </Fila>

            {desafio.propuesta === undefined ? (
              <View />
            ) : (
              <Boton
                texto="Me interesa apoyar"
                icono="pulgarArriba"
                onPress={() => router.push(`/instituciones/interes?propuesta=${desafio.propuesta}`)}
              />
            )}
          </Tarjeta>
        ))}

        {visibles.length === 0 ? (
          <Columna separacion={espacio.comodo} style={{ paddingTop: espacio.seccion }}>
            <Texto tamano={16} alineacion="center" color={colores.grisTexto}>
              No hay desafíos que calcen con esa disciplina todavía.
            </Texto>
          </Columna>
        ) : null}
      </ScrollView>
    </Pantalla>
  );
}
