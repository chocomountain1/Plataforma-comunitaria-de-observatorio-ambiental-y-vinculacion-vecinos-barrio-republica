import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { ChipDeCategoria } from '@/componentes/app';
import {
  BarraInferior,
  Boton,
  CampoTexto,
  Columna,
  EncabezadoDePaso,
  Fila,
  Opcion,
  Pantalla,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/** Las tres respuestas posibles sobre el origen del problema. */
const formasDeFormarse = ['Dejaron basura en la calle', 'Se rebalsó un basurero', 'No sé'];

/** Antiguedad del problema, en lenguaje cotidiano. */
const antiguedades = ['Hoy', 'Esta semana', 'Hace más de un mes'];

/**
 * 3.5 Detalles.
 *
 * Las preguntas son de alternativas y no de texto libre, para que el reporte
 * tarde menos de un minuto y para que los datos despues se puedan agrupar en el
 * observatorio.
 */
export default function PasoDetalles() {
  const volver = crearVolver('/reportar/ubicacion');
  const { reporte, cambiarReporte } = usarBorradores();

  return (
    <Pantalla>
      <EncabezadoDePaso paso={4} total={5} nombre="Detalles" onVolver={volver} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: espacio.seccion }}
        >
          <Columna
            separacion={espacio.normal}
            style={{ paddingHorizontal: espacio.bloque, paddingTop: 14 }}
          >
            {reporte.categoria === null ? null : <ChipDeCategoria categoria={reporte.categoria} />}
            <Texto tamano={32} familia="titulo" interlineado={1.08} style={{ marginTop: espacio.corto }}>
              Cuéntanos un poco más
            </Texto>
            <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
              Toca la opción que más se parezca.
            </Texto>
          </Columna>

          <Columna
            separacion={espacio.seccion}
            style={{ paddingHorizontal: espacio.seccion, paddingTop: espacio.seccion }}
          >
            <Columna separacion={espacio.comodo}>
              <Texto tamano={18} familia="tituloSemi">
                ¿Cómo se formó?
              </Texto>
              {formasDeFormarse.map((forma) => (
                <Opcion
                  key={forma}
                  texto={forma}
                  seleccion="unica"
                  activa={reporte.comoSeFormo === forma}
                  onPress={() => cambiarReporte({ comoSeFormo: forma })}
                />
              ))}
            </Columna>

            <Columna separacion={espacio.comodo}>
              <Texto tamano={18} familia="tituloSemi">
                ¿Desde cuándo lo ves?
              </Texto>
              <Fila separacion={espacio.comodo} alinear="stretch">
                {antiguedades.map((antiguedad) => (
                  <Opcion
                    key={antiguedad}
                    texto={antiguedad}
                    compacta
                    seleccion="unica"
                    activa={reporte.desdeCuando === antiguedad}
                    onPress={() => cambiarReporte({ desdeCuando: antiguedad })}
                    style={{ flex: 1 }}
                  />
                ))}
              </Fila>
            </Columna>

            <Columna separacion={espacio.comodo}>
              <Fila separacion={espacio.corto}>
                <Texto tamano={18} familia="tituloSemi">
                  ¿Algo más?
                </Texto>
                <Texto tamano={15} color={colores.grisTexto}>
                  (opcional)
                </Texto>
              </Fila>
              <CampoTexto
                valor={reporte.descripcion}
                onCambiar={(texto) => cambiarReporte({ descripcion: texto })}
                marcaDeAgua="Ej. se acumula los fines de semana"
                lineas={3}
                maximoDeCaracteres={300}
              />
            </Columna>
          </Columna>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior>
        <Boton
          texto="Siguiente"
          icono="flechaDerecha"
          iconoAlFinal
          alto={56}
          tamanoDeTexto={18}
          onPress={() => router.push('/reportar/revisar')}
        />
      </BarraInferior>
    </Pantalla>
  );
}
