import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import {
  Aviso,
  BarraInferior,
  Boton,
  BotonCircular,
  CampoTexto,
  Columna,
  Fila,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio } from '@/diseno/medidas';
import { usarSesion } from '@/estado/sesion';

/** El código que manda Supabase tiene seis números. */
const LARGO_DEL_CODIGO = 6;

/**
 * 1.5 Código de ingreso.
 *
 * Es la contrapartida de no usar contrasenas. La decision del 19 de octubre
 * separa dos cosas que antes iban juntas: entrar exige cuenta, pero mostrarse
 * es decision de cada persona en cada publicacion.
 *
 * Despues de confirmar el codigo quedan dos caminos. Si la persona ya tenia
 * perfil, entra directo. Si es la primera vez, se crea el perfil con el
 * seudonimo que escribio en el paso anterior, porque crearlo exige una sesion
 * abierta y antes de este paso no la habia.
 */
export default function CodigoDeIngreso() {
  const { correo, seudonimo } = useLocalSearchParams<{
    correo: string;
    seudonimo: string;
  }>();
  const { confirmarCodigo, crearPerfil, pedirCodigo } = usarSesion();

  const [codigo, setCodigo] = useState('');
  const [comprobando, setComprobando] = useState(false);
  const [reenviado, setReenviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completo = codigo.trim().length === LARGO_DEL_CODIGO;

  async function confirmar() {
    setComprobando(true);
    setError(null);
    try {
      const sesion = await confirmarCodigo(correo, codigo);

      // El seudonimo del paso anterior solo se usa cuando todavia no hay perfil.
      // Crearlo de nuevo chocaria con el que ya existe y dejaria a la persona
      // afuera teniendo la sesion abierta y el codigo ya gastado.
      if (sesion === 'sinPerfil' && seudonimo.length > 0) {
        await crearPerfil(seudonimo, 'Vive en el barrio');
      }
      router.replace('/inicio');
    } catch (falla: unknown) {
      setError(falla instanceof Error ? falla.message : 'No se pudo confirmar el código');
    } finally {
      setComprobando(false);
    }
  }

  async function reenviar() {
    setError(null);
    try {
      await pedirCodigo(correo);
      setReenviado(true);
    } catch (falla: unknown) {
      setError(falla instanceof Error ? falla.message : 'No se pudo reenviar el código');
    }
  }

  return (
    <Pantalla>
      <Fila style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}>
        <BotonCircular
          icono="flechaIzquierda"
          accesibilidad="Volver"
          onPress={() => router.back()}
        />
      </Fila>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: espacio.seccion }}
        >
          <Columna separacion={espacio.normal} style={{ paddingHorizontal: espacio.bloque }}>
            <Texto tamano={32} familia="titulo" interlineado={1.08}>
              Escribe el código
            </Texto>
            <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
              {`Mandamos seis números a ${correo}. Llegan en unos segundos.`}
            </Texto>
          </Columna>

          <Columna
            separacion={espacio.amplio}
            style={{ paddingHorizontal: espacio.seccion, paddingTop: 22 }}
          >
            <CampoTexto
              etiqueta="Código de 6 números"
              valor={codigo}
              onCambiar={(valor) => setCodigo(valor.replace(/\D/g, '').slice(0, LARGO_DEL_CODIGO))}
              marcaDeAgua="000000"
              tipoDeTeclado="numero"
            />

            {reenviado ? (
              <Aviso tono="logro">
                <Texto tamano={15} interlineado={1.4}>
                  Te mandamos un código nuevo.
                </Texto>
              </Aviso>
            ) : null}

            {error === null ? null : (
              <Aviso tono="cuidado">
                <Texto tamano={15} interlineado={1.4}>
                  {error}
                </Texto>
              </Aviso>
            )}

            <Presionable
              onPress={() => void reenviar()}
              accessibilityRole="button"
              accessibilityLabel="Mandar el código de nuevo"
              style={{
                minHeight: alturaTocable.minima,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Texto
                tamano={16}
                color={colores.verde}
                peso="fuerte"
                style={{ textDecorationLine: 'underline' }}
              >
                No me llegó, mándalo de nuevo
              </Texto>
            </Presionable>
          </Columna>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior>
        <Boton
          texto={comprobando ? 'Comprobando...' : 'Entrar al barrio'}
          alto={56}
          tamanoDeTexto={18}
          deshabilitado={!completo || comprobando}
          onPress={() => void confirmar()}
          vibrar
        />
      </BarraInferior>
    </Pantalla>
  );
}
