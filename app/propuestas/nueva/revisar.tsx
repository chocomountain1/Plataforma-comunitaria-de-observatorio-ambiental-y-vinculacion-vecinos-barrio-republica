import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { Avatar, EtiquetaDeEtapa } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  Chip,
  Columna,
  EncabezadoDePaso,
  Fila,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { personas } from '@/datos/personas';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/**
 * Tercer paso de la propuesta: vista previa antes de publicar.
 *
 * Los mockups numeran este flujo como "Paso X de 3" pero solo dibujan los dos
 * primeros. Esta pantalla completa la numeracion mostrando como va a quedar la
 * propuesta, sin pedir nada nuevo.
 */
export default function RevisarPropuesta() {
  const volver = crearVolver('/propuestas/nueva/necesita');
  const { propuesta, reiniciarPropuesta } = usarBorradores();
  const { publicarPropuesta } = usarBarrio();

  function publicar() {
    const id = publicarPropuesta({
      titulo: propuesta.titulo,
      idea: propuesta.idea,
      eje: propuesta.eje,
      reporteDeOrigen: propuesta.reporteDeOrigen ?? undefined,
      apoyosNecesarios: propuesta.apoyosNecesarios,
      voluntarios: propuesta.voluntarios,
      disciplinas: propuesta.disciplinas,
    });
    reiniciarPropuesta();
    router.dismissTo(`/propuestas/${id}`);
  }

  return (
    <Pantalla>
      <EncabezadoDePaso paso={3} total={3} nombre="Revisar" onVolver={volver} />

      <Texto
        tamano={32}
        familia="titulo"
        interlineado={1.08}
        style={{ marginTop: 14, marginHorizontal: espacio.bloque, marginBottom: 14 }}
      >
        Así la verán tus vecinos
      </Texto>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingBottom: espacio.seccion,
          gap: espacio.medio,
        }}
      >
        <Tarjeta>
          <Fila separacion={espacio.normal}>
            <EtiquetaDeEtapa etapa="idea" />
            <Texto tamano={13} color={colores.grisTexto}>
              {propuesta.eje}
            </Texto>
          </Fila>
          <Texto tamano={22} familia="titulo" interlineado={1.2}>
            {propuesta.titulo}
          </Texto>
          <Fila separacion={espacio.comodo}>
            <Avatar persona={personas.rosa} tamano={36} />
            <Columna crecer={1}>
              <Texto tamano={15} peso="fuerte">
                {personas.rosa.nombre}
              </Texto>
              <Texto tamano={13.5} color={colores.grisTexto}>
                {personas.rosa.vinculo}
              </Texto>
            </Columna>
          </Fila>
          {propuesta.idea === '' ? null : (
            <Texto tamano={16} interlineado={1.45}>
              {propuesta.idea}
            </Texto>
          )}
        </Tarjeta>

        {propuesta.apoyosNecesarios.length === 0 ? null : (
          <Tarjeta>
            <Texto tamano={18} familia="tituloSemi">
              Qué se necesita
            </Texto>
            {propuesta.apoyosNecesarios.map((titulo) => (
              <Fila key={titulo} repartir="space-between" separacion={espacio.normal}>
                <Texto tamano={16}>{titulo}</Texto>
                {titulo === 'Manos voluntarias' ? (
                  <Texto tamano={15} peso="fuerte" color={colores.verde}>
                    {`0 de ${propuesta.voluntarios}`}
                  </Texto>
                ) : null}
              </Fila>
            ))}
          </Tarjeta>
        )}

        {propuesta.disciplinas.length === 0 ? null : (
          <Tarjeta>
            <Texto tamano={18} familia="tituloSemi">
              Conocimientos que ayudarían
            </Texto>
            <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
              {propuesta.disciplinas.map((nombre) => (
                <Chip key={nombre} texto={nombre} activo variante="marcado" alto={36} />
              ))}
            </Fila>
          </Tarjeta>
        )}

        <Aviso
          texto="Al publicarla queda como Idea. Sube a En conversación cuando los vecinos empiecen a opinar."
        />
      </ScrollView>

      <BarraInferior>
        <Boton
          texto="Publicar propuesta"
          icono="enviar"
          alto={56}
          tamanoDeTexto={18}
          deshabilitado={propuesta.titulo.trim().length === 0}
          onPress={publicar}
          vibrar
        />
      </BarraInferior>
    </Pantalla>
  );
}
