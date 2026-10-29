import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { MarcaDeCategoria } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  CampoTexto,
  Columna,
  EncabezadoDePaso,
  Fila,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { usarBorradores } from '@/estado/borradores';

/** Largo maximo de la explicacion, igual que en el mockup. */
const MAXIMO_DE_LA_IDEA = 500;

/**
 * 5.2 Nueva propuesta, primer paso.
 *
 * La propuesta nace enganchada a un problema concreto, no en el aire. Esa es la
 * diferencia con una caja de sugerencias: cada idea responde a reportes que ya
 * existen en el mapa.
 */
export default function NuevaPropuestaIdea() {
  const { propuesta, cambiarPropuesta, reiniciarPropuesta } = usarBorradores();
  const { reportes } = usarBarrio();

  const reporteDeOrigen =
    reportes.find((reporte) => reporte.id === propuesta.reporteDeOrigen) ??
    reportes.find((reporte) => reporte.id === 'microbasural-sazie');

  function cancelar() {
    reiniciarPropuesta();
    router.back();
  }

  return (
    <Pantalla>
      <EncabezadoDePaso
        paso={1}
        total={3}
        nombre="Tu idea"
        esPrimerPaso
        textoDeCancelar="Cancelar propuesta"
        onVolver={cancelar}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: espacio.seccion }}
        >
          <Texto
            tamano={32}
            familia="titulo"
            interlineado={1.08}
            style={{ marginTop: 14, marginHorizontal: espacio.bloque, marginBottom: 14 }}
          >
            ¿Cómo lo resolverías?
          </Texto>

          <Columna separacion={espacio.corto} style={{ paddingHorizontal: espacio.seccion }}>
            <Texto tamano={15} peso="fuerte">
              Problema que quieres resolver
            </Texto>
            {reporteDeOrigen === undefined ? null : (
              <Fila
                separacion={espacio.medio}
                style={{
                  backgroundColor: colores.papel,
                  borderWidth: 1,
                  borderColor: colores.borde,
                  borderRadius: radio.caja,
                  paddingVertical: espacio.comodo,
                  paddingHorizontal: espacio.medio,
                }}
              >
                <MarcaDeCategoria
                  categoria={reporteDeOrigen.categoria}
                  tamano={38}
                  redondeo={radio.medio}
                />
                <Columna crecer={1}>
                  <Texto tamano={15.5} peso="fuerte">
                    {reporteDeOrigen.titulo}
                  </Texto>
                  <Texto tamano={13.5} color={colores.grisTexto}>
                    y 5 reportes parecidos cerca
                  </Texto>
                </Columna>
                <Presionable
                  onPress={() => router.push('/mapa')}
                  accessibilityRole="button"
                  accessibilityLabel="Cambiar el problema que quieres resolver"
                  style={{ minHeight: alturaTocable.minima, justifyContent: 'center' }}
                >
                  <Texto tamano={14.5} peso="fuerte" style={{ textDecorationLine: 'underline' }}>
                    Cambiar
                  </Texto>
                </Presionable>
              </Fila>
            )}
          </Columna>

          <Columna
            separacion={espacio.amplio}
            style={{ paddingHorizontal: espacio.seccion, paddingTop: espacio.amplio }}
          >
            <CampoTexto
              etiqueta="Tu idea en una frase"
              valor={propuesta.titulo}
              onCambiar={(texto) => cambiarPropuesta({ titulo: texto })}
              marcaDeAgua="Ej. punto limpio vecinal en la esquina"
            />
            <CampoTexto
              etiqueta="¿Cómo funcionaría?"
              valor={propuesta.idea}
              onCambiar={(texto) => cambiarPropuesta({ idea: texto })}
              lineas={5}
              maximoDeCaracteres={MAXIMO_DE_LA_IDEA}
              ayuda={`${propuesta.idea.length} / ${MAXIMO_DE_LA_IDEA}`}
            />
            <Aviso
              tono="neutro"
              icono="personas"
              texto="No tiene que estar perfecta. Los vecinos te ayudarán a mejorarla en la conversación."
            />
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
          deshabilitado={propuesta.titulo.trim().length === 0}
          onPress={() => {
            cambiarPropuesta({ reporteDeOrigen: reporteDeOrigen?.id ?? null });
            router.push('/propuestas/nueva/necesita');
          }}
        />
      </BarraInferior>
    </Pantalla>
  );
}
