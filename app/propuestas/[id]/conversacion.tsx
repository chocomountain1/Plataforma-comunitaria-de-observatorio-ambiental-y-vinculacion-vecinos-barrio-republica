import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Encabezado } from '@/componentes/app';
import {
  Aviso,
  Chip,
  Columna,
  Etiqueta,
  Fila,
  Icono,
  Pantalla,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import type { Comentario, PosturaComentario } from '@/dominio/tipos';
import { familias } from '@/diseno/tipografia';
import { usarBarrio, usarPropuesta } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/** Como se ve cada postura y como se llama en la pantalla. */
const posturas: Record<PosturaComentario, { etiqueta: string; fondo: string; texto: string }> = {
  aFavor: { etiqueta: 'A favor', fondo: colores.menta, texto: '#174D34' },
  mejora: { etiqueta: 'Mejora', fondo: '#F5E6C8', texto: '#6F4A0E' },
  duda: { etiqueta: 'Duda', fondo: '#DCE7F3', texto: '#244C78' },
  enContra: { etiqueta: 'En contra', fondo: '#F3DCD7', texto: '#7A2A24' },
  respuesta: { etiqueta: 'Respuesta', fondo: colores.crema, texto: colores.grisTexto },
};

/** Posturas que alguien puede elegir al escribir. */
const posturasElegibles: PosturaComentario[] = ['aFavor', 'mejora', 'duda', 'enContra'];

/**
 * 5.5 Conversacion.
 *
 * El foro de deliberacion es uno de los tres modulos comprometidos con la
 * contraparte. Cada aporte declara su postura, de modo que la autora y el resto
 * puedan leer rapido que mejora, que duda y que objeta.
 */
export default function Conversacion() {
  const volver = crearVolver('/propuestas');
  const { id } = useLocalSearchParams<{ id: string }>();
  const propuesta = usarPropuesta(id);
  const { comentarPropuesta, marcarComentarioUtil } = usarBarrio();
  const margenes = useSafeAreaInsets();

  const [filtro, setFiltro] = useState<'todas' | PosturaComentario>('todas');
  const [postura, setPostura] = useState<PosturaComentario>('aFavor');
  const [texto, setTexto] = useState('');

  if (propuesta === undefined) {
    return (
      <Pantalla>
        <Encabezado titulo="Conversación" onVolver={volver} />
      </Pantalla>
    );
  }

  const cuantos = (cual: PosturaComentario) =>
    propuesta.comentarios.filter((comentario) => comentario.postura === cual).length;

  const visibles = propuesta.comentarios.filter(
    (comentario) => filtro === 'todas' || comentario.postura === filtro,
  );

  function enviar() {
    if (texto.trim().length === 0 || propuesta === undefined) return;
    comentarPropuesta(propuesta.id, texto.trim(), postura);
    setTexto('');
  }

  return (
    <Pantalla sinMargenInferior>
      <Encabezado
        titulo="Conversación"
        subtitulo={propuesta.titulo}
        onVolver={volver}
        tamanoDeTitulo={24}
      />

      <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.seccion }}>
        <Chip
          texto={`Todas · ${propuesta.comentarios.length}`}
          activo={filtro === 'todas'}
          onPress={() => setFiltro('todas')}
          tamanoDeTexto={14}
        />
        <Chip
          texto={`Mejoras · ${cuantos('mejora')}`}
          activo={filtro === 'mejora'}
          onPress={() => setFiltro('mejora')}
          tamanoDeTexto={14}
        />
        <Chip
          texto={`Dudas · ${cuantos('duda')}`}
          activo={filtro === 'duda'}
          onPress={() => setFiltro('duda')}
          tamanoDeTexto={14}
        />
        <Chip
          texto={`A favor · ${cuantos('aFavor')}`}
          activo={filtro === 'aFavor'}
          onPress={() => setFiltro('aFavor')}
          tamanoDeTexto={14}
        />
      </Fila>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={margenes.bottom}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: espacio.amplio,
            paddingTop: espacio.medio,
            paddingBottom: espacio.seccion,
            gap: espacio.medio,
          }}
        >
          {visibles.map((comentario) => (
            <TarjetaDeComentario
              key={comentario.id}
              comentario={comentario}
              onUtil={() => marcarComentarioUtil(propuesta.id, comentario.id)}
            />
          ))}

          {visibles.length === 0 ? (
            <Aviso tono="neutro" texto="Todavía no hay aportes de este tipo." />
          ) : null}
        </ScrollView>

        <Columna
          separacion={espacio.comodo}
          style={{
            backgroundColor: colores.papel,
            borderTopWidth: 1,
            borderTopColor: colores.borde,
            paddingHorizontal: espacio.amplio,
            paddingTop: espacio.medio,
            paddingBottom: Math.max(margenes.bottom, espacio.medio),
          }}
        >
          <Fila separacion={espacio.corto}>
            {posturasElegibles.map((cual) => (
              <Chip
                key={cual}
                texto={posturas[cual].etiqueta}
                activo={postura === cual}
                onPress={() => setPostura(cual)}
                alto={36}
                tamanoDeTexto={13.5}
                variante="marcado"
              />
            ))}
          </Fila>

          <Fila separacion={espacio.comodo} alinear="flex-end">
            <TextInput
              value={texto}
              onChangeText={setTexto}
              placeholder="Escribe tu aporte"
              placeholderTextColor={colores.grisTexto}
              accessibilityLabel="Escribe tu aporte"
              allowFontScaling={false}
              multiline
              style={{
                flex: 1,
                minHeight: alturaTocable.control,
                maxHeight: 120,
                borderRadius: radio.boton,
                borderWidth: 1.5,
                borderColor: colores.bordeFuerte,
                backgroundColor: colores.papel,
                paddingHorizontal: espacio.medio,
                paddingTop: espacio.medio,
                paddingBottom: espacio.medio,
                fontFamily: familias.texto,
                fontSize: 16,
                color: colores.tinta,
              }}
            />
            <Presionable
              onPress={enviar}
              vibrar
              accessibilityRole="button"
              accessibilityLabel="Enviar"
              style={{
                width: alturaTocable.control,
                height: alturaTocable.control,
                borderRadius: radio.boton,
                backgroundColor: texto.trim().length === 0 ? colores.bordeFuerte : colores.verde,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icono nombre="enviar" tamano={22} color={colores.papel} />
            </Presionable>
          </Fila>

          <Texto tamano={13} color={colores.grisTexto}>
            {'Conversa con respeto. '}
            <Texto
              tamano={13}
              peso="fuerte"
              color={colores.verde}
              style={{ textDecorationLine: 'underline' }}
            >
              Normas de convivencia
            </Texto>
          </Texto>
        </Columna>
      </KeyboardAvoidingView>
    </Pantalla>
  );
}

/** Un aporte con su postura, sus respuestas y el contador de utiles. */
function TarjetaDeComentario({
  comentario,
  onUtil,
}: {
  comentario: Comentario;
  onUtil: () => void;
}) {
  const estilo = posturas[comentario.postura];

  return (
    <Tarjeta separacion={espacio.comodo}>
      <Fila separacion={espacio.comodo}>
        <Avatar persona={comentario.autor} tamano={38} />
        <Columna crecer={1}>
          <Texto tamano={15.5} peso="fuerte">
            {comentario.autor.nombre}
          </Texto>
          <Texto tamano={13.5} color={colores.grisTexto}>
            {`${comentario.autor.vinculo} · ${comentario.cuando}`}
          </Texto>
        </Columna>
        {comentario.postura === 'respuesta' ? null : (
          <Etiqueta texto={estilo.etiqueta} fondo={estilo.fondo} color={estilo.texto} />
        )}
      </Fila>

      <Texto tamano={16} interlineado={1.4}>
        {comentario.texto}
      </Texto>

      {comentario.incorporado === undefined ? null : (
        <Aviso tono="logro" icono="visto" texto={comentario.incorporado} tamanoDeTexto={13.5} />
      )}

      <Fila separacion={espacio.amplio}>
        <Presionable
          onPress={onUtil}
          accessibilityRole="button"
          accessibilityLabel={`Marcar útil. Lleva ${comentario.utiles}`}
          style={{ flexDirection: 'row', alignItems: 'center', gap: espacio.corto, minHeight: 44 }}
        >
          <Icono nombre="pulgarArriba" tamano={18} color={colores.grisTexto} />
          <Texto tamano={14} peso="fuerte" color={colores.grisTexto}>
            {`Útil · ${comentario.utiles}`}
          </Texto>
        </Presionable>
        <Presionable
          accessibilityRole="button"
          accessibilityLabel="Responder"
          style={{ justifyContent: 'center', minHeight: 44 }}
        >
          <Texto tamano={14} peso="fuerte" color={colores.grisTexto}>
            Responder
          </Texto>
        </Presionable>
      </Fila>

      {comentario.respuestas.map((respuesta) => (
        <View
          key={respuesta.id}
          style={{
            marginLeft: espacio.seccion,
            paddingLeft: espacio.medio,
            borderLeftWidth: 2,
            borderLeftColor: colores.borde,
            gap: espacio.corto,
          }}
        >
          <Fila separacion={espacio.normal}>
            <Avatar persona={respuesta.autor} tamano={28} />
            <Texto tamano={14} color={colores.grisTexto} style={{ flex: 1 }}>
              <Texto tamano={14} peso="fuerte">
                {respuesta.autor.nombre}
              </Texto>
              {` · ${respuesta.autor.vinculo}`}
            </Texto>
          </Fila>
          <Texto tamano={15} interlineado={1.4}>
            {respuesta.texto}
          </Texto>
        </View>
      ))}
    </Tarjeta>
  );
}
