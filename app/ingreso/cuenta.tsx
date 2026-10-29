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
import { crearVolver } from '@/utiles/navegacion';

/**
 * 1.4 Perfil opcional sin contrasena.
 *
 * El registro es la barrera de adopcion que mas aparecio en terreno, asi que
 * aqui no se pide nombre real ni RUT, no hay contrasenas y siempre queda la
 * salida de seguir sin cuenta.
 */
export default function Cuenta() {
  const volver = crearVolver('/ingreso/intereses');
  const [seudonimo, setSeudonimo] = useState('Rosa');
  const [correo, setCorreo] = useState('');
  const [aceptaNormas, setAceptaNormas] = useState(true);

  const puedeEnviar = seudonimo.trim().length > 0 && correo.includes('@') && aceptaNormas;

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
            <Etiqueta texto="Opcional" fondo={colores.menta} color={colores.verde} alto={30} tamanoDeTexto={13.5} />
            <Texto tamano={32} familia="titulo" interlineado={1.08}>
              Crea tu perfil para recibir avisos
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
        <Boton
          texto="Enviarme el código"
          icono="sobre"
          alto={56}
          tamanoDeTexto={18}
          deshabilitado={!puedeEnviar}
          onPress={() => router.replace('/inicio')}
          vibrar
        />
        <Boton
          texto="Seguir sin cuenta"
          variante="secundaria"
          tamanoDeTexto={17}
          onPress={() => router.replace('/inicio')}
        />
        <Texto tamano={14} color={colores.grisTexto} alineacion="center">
          Sin cuenta igual puedes reportar y mirar el mapa.
        </Texto>
      </BarraInferior>
    </Pantalla>
  );
}
