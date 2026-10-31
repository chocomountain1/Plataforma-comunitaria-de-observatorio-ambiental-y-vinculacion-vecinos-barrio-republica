import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import {
  Aviso,
  BarraInferior,
  Boton,
  BotonCircular,
  CampoTexto,
  Casilla,
  Columna,
  Etiqueta,
  Fila,
  Pantalla,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarSesion } from '@/estado/sesion';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 1.4 Crear la cuenta.
 *
 * Desde el 19 de octubre la cuenta es obligatoria para entrar, porque sin
 * ella cualquiera podria crearse varias identidades e inflar la priorizacion
 * comunitaria. Lo que se conserva de la version anterior es lo que el terreno
 * pidio: no se pide nombre real ni RUT, y no hay contrasenas, porque la
 * friccion del registro fue la barrera de abandono mas mencionada y el Banco
 * del Tiempo murio en parte por no tener recuperacion de contrasenas.
 *
 * El seudonimo se pide aqui pero se guarda despues de confirmar el codigo:
 * crear el perfil exige una sesion abierta.
 */
export default function Cuenta() {
  const volver = crearVolver('/ingreso/intereses');
  const { pedirCodigo, estado } = usarSesion();
  const [seudonimo, setSeudonimo] = useState('');
  const [correo, setCorreo] = useState('');
  const [aceptaNormas, setAceptaNormas] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const puedeEnviar =
    seudonimo.trim().length >= 2 && correo.includes('@') && aceptaNormas && !enviando;

  async function enviar() {
    // Sin credenciales configuradas no hay a quien pedirle el codigo, y el
    // prototipo tiene que seguir siendo navegable asi: es como se muestra en
    // reuniones y como lo corre quien clona el repositorio.
    if (estado === 'sinBackend') {
      router.replace('/inicio');
      return;
    }

    setEnviando(true);
    setError(null);
    try {
      await pedirCodigo(correo);
      router.push({
        pathname: '/ingreso/codigo',
        params: { correo: correo.trim().toLowerCase(), seudonimo: seudonimo.trim() },
      });
    } catch (falla: unknown) {
      setError(falla instanceof Error ? falla.message : 'No se pudo enviar el código');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Pantalla>
      <Fila style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}>
        <BotonCircular icono="flechaIzquierda" accesibilidad="Volver" onPress={volver} />
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
            <Etiqueta texto="Paso final" fondo={colores.menta} color={colores.verde} alto={30} tamanoDeTexto={13.5} />
            <Texto tamano={32} familia="titulo" interlineado={1.08}>
              Crea tu cuenta del barrio
            </Texto>
            <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
              Te avisamos cuando tu reporte avance. No pedimos tu nombre real ni tu RUT.
            </Texto>
          </Columna>

          <Columna
            separacion={espacio.amplio}
            style={{ paddingHorizontal: espacio.seccion, paddingTop: 22 }}
          >
            <CampoTexto
              etiqueta="Seudónimo"
              valor={seudonimo}
              onCambiar={setSeudonimo}
              ayuda="Es el nombre que verán tus vecinos. Puede ser inventado."
            />
            <CampoTexto
              etiqueta="Correo electrónico"
              valor={correo}
              onCambiar={setCorreo}
              marcaDeAgua="tucorreo@ejemplo.cl"
              tipoDeTeclado="correo"
            />

            <Aviso tono="logro" icono="candado">
              <Texto tamano={15} color="#173A28" interlineado={1.4}>
                <Texto tamano={15} peso="fuerte" color="#173A28">
                  Sin contraseñas.
                </Texto>
                {' Cada vez que entres te mandamos un código de 6 números a tu correo.'}
              </Texto>
            </Aviso>

            <Casilla activa={aceptaNormas} onPress={() => setAceptaNormas(!aceptaNormas)}>
              <Texto tamano={15} interlineado={1.4}>
                {'Acepto las '}
                <Texto tamano={15} peso="fuerte" style={{ textDecorationLine: 'underline' }}>
                  normas de convivencia
                </Texto>
                {' del barrio'}
              </Texto>
            </Casilla>
          </Columna>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior>
        {error === null ? null : (
          <Aviso tono="cuidado">
            <Texto tamano={15} interlineado={1.4}>
              {error}
            </Texto>
          </Aviso>
        )}
        <Boton
          texto={
            estado === 'sinBackend'
              ? 'Entrar al barrio'
              : enviando
                ? 'Enviando...'
                : 'Enviarme el código'
          }
          icono="sobre"
          alto={56}
          tamanoDeTexto={18}
          deshabilitado={!puedeEnviar}
          onPress={() => void enviar()}
          vibrar
        />
        {estado === 'sinBackend' ? null : (
          <Texto tamano={14} color={colores.grisTexto} alineacion="center">
            Llega en unos segundos. Revisa también el correo no deseado.
          </Texto>
        )}
      </BarraInferior>
    </Pantalla>
  );
}
