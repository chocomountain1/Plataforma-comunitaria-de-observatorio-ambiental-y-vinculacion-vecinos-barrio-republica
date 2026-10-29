import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { Encabezado } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  BotonCircular,
  CampoTexto,
  Chip,
  Columna,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { formasDeApoyoInstitucional, plazosDeApoyo } from '@/datos/observatorio';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarPropuesta } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 8.2 Mostrar interes.
 *
 * Una institucion declara como podria apoyar y cuando. Solo quien propone y
 * Republica Circular ven el correo de contacto, para que el interes no se
 * convierta en una lista publica de datos.
 */
export default function MostrarInteres() {
  const volver = crearVolver('/instituciones/desafios');
  const { propuesta: idDePropuesta } = useLocalSearchParams<{ propuesta?: string }>();
  const propuesta = usarPropuesta(idDePropuesta);

  const [formas, setFormas] = useState<string[]>(['Curso o taller']);
  const [plazo, setPlazo] = useState<string>('Este semestre');
  const [mensaje, setMensaje] = useState(
    'Un grupo del curso de diseño en ingeniería podría prototipar los contenedores.',
  );
  const [enviado, setEnviado] = useState(false);

  function alternarForma(forma: string) {
    setFormas((actuales) =>
      actuales.includes(forma) ? actuales.filter((otra) => otra !== forma) : [...actuales, forma],
    );
  }

  return (
    <Pantalla>
      <Encabezado
        titulo="Quiero apoyar"
        tamanoDeTitulo={26}
        accion={<BotonCircular icono="cerrar" accesibilidad="Cerrar" onPress={volver} />}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: espacio.amplio,
            paddingTop: espacio.normal,
            paddingBottom: espacio.seccion,
            gap: espacio.amplio,
          }}
        >
          {propuesta === undefined ? null : (
            <Tarjeta separacion={espacio.corto}>
              <Texto tamano={17} peso="fuerte" interlineado={1.3}>
                {propuesta.titulo}
              </Texto>
              <Texto tamano={14} color={colores.grisTexto}>
                {`Propuesta de ${propuesta.autor.nombre} · ${propuesta.apoyos} apoyos`}
              </Texto>
            </Tarjeta>
          )}

          <Fila separacion={espacio.medio}>
            <Icono nombre="birrete" tamano={24} color="#2C5A8C" />
            <Columna crecer={1}>
              <Texto tamano={13} color={colores.grisTexto}>
                Como
              </Texto>
              <Texto tamano={16.5} peso="fuerte">
                FCFM, Universidad de Chile
              </Texto>
            </Columna>
          </Fila>

          <Columna separacion={espacio.comodo}>
            <Texto tamano={16} peso="fuerte">
              ¿Cómo apoyarían?
            </Texto>
            <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
              {formasDeApoyoInstitucional.map((forma) => (
                <Chip
                  key={forma}
                  texto={forma}
                  activo={formas.includes(forma)}
                  onPress={() => alternarForma(forma)}
                  variante="marcado"
                  alto={42}
                />
              ))}
            </Fila>
          </Columna>

          <Columna separacion={espacio.comodo}>
            <Texto tamano={16} peso="fuerte">
              ¿Cuándo?
            </Texto>
            <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
              {plazosDeApoyo.map((opcion) => (
                <Chip
                  key={opcion}
                  texto={opcion}
                  activo={plazo === opcion}
                  onPress={() => setPlazo(opcion)}
                  alto={42}
                />
              ))}
            </Fila>
          </Columna>

          <CampoTexto
            etiqueta="Mensaje para quienes proponen"
            valor={mensaje}
            onCambiar={setMensaje}
            lineas={4}
            maximoDeCaracteres={400}
          />

          <Aviso
            icono="candado"
            texto="Julia y República Circular recibirán un aviso. Solo ellos verán tu correo de contacto."
          />

          {enviado ? (
            <Aviso tono="logro" icono="visto" texto="Tu interés quedó enviado. Te van a escribir." />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior>
        <Boton
          texto={enviado ? 'Interés enviado' : 'Enviar interés'}
          icono={enviado ? 'visto' : 'enviar'}
          alto={56}
          tamanoDeTexto={18}
          variante={enviado ? 'tonal' : 'principal'}
          deshabilitado={formas.length === 0}
          onPress={() => setEnviado(true)}
          vibrar
        />
      </BarraInferior>
    </Pantalla>
  );
}
