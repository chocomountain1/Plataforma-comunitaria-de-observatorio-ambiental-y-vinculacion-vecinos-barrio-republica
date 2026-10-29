import { EtiquetaDeEtapa } from './EtiquetasDeDominio';
import { Aviso, Boton, Columna, Fila, Icono, Tarjeta, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import type { Propuesta } from '@/dominio/tipos';

type PropsTarjetaPropuesta = {
  propuesta: Propuesta;
  onPress: () => void;
  onApoyar: () => void;
  onOpinar: () => void;
  /** Frase de apoyo institucional que se muestra en el feed del inicio. */
  notaDeApoyo?: string;
};

/**
 * Propuesta tal como aparece en el feed: quien la hizo, en que etapa va y los
 * dos botones que importan, apoyar y opinar.
 */
export function TarjetaDePropuesta({
  propuesta,
  onPress,
  onApoyar,
  onOpinar,
  notaDeApoyo,
}: PropsTarjetaPropuesta) {
  return (
    <Tarjeta>
      <Fila repartir="space-between" separacion={espacio.normal}>
        <Fila separacion={espacio.corto}>
          <Icono nombre="idea" tamano={17} color={colores.verde} />
          <Texto tamano={13.5} peso="fuerte" color={colores.verde}>
            PROPUESTA
          </Texto>
        </Fila>
        <EtiquetaDeEtapa etapa={propuesta.etapa} />
      </Fila>

      <Texto tamano={18} peso="fuerte" interlineado={1.3} onPress={onPress}>
        {propuesta.titulo}
      </Texto>

      <Texto tamano={14.5} color={colores.grisTexto}>
        {`${propuesta.autor.nombre} · ${propuesta.autor.vinculo}${
          propuesta.respondeA === undefined ? '' : ` · Responde a ${propuesta.respondeA}`
        }`}
      </Texto>

      {notaDeApoyo === undefined ? null : (
        <Aviso tono="logro" icono="birrete" texto={notaDeApoyo} />
      )}

      <Fila separacion={espacio.comodo}>
        <Boton
          texto={`${propuesta.apoyadaPorMi ? 'Apoyada' : 'Apoyar'} · ${propuesta.apoyos}`}
          icono="pulgarArriba"
          variante={propuesta.apoyadaPorMi ? 'tonal' : 'principal'}
          alto={46}
          tamanoDeTexto={15.5}
          onPress={onApoyar}
          vibrar
          style={{ flex: 1 }}
        />
        <Boton
          texto={`Opinar · ${propuesta.comentarios.length}`}
          icono="globoDialogo"
          variante="secundaria"
          alto={46}
          tamanoDeTexto={15.5}
          onPress={onOpinar}
          style={{ flex: 1 }}
        />
      </Fila>
    </Tarjeta>
  );
}

/**
 * Propuesta en la lista ordenada por prioridad comunitaria. Lleva su numero de
 * orden al lado, que es lo que comunica la priorizacion.
 */
export function FilaDePropuesta({
  propuesta,
  orden,
  onPress,
}: {
  propuesta: Propuesta;
  orden: number;
  onPress: () => void;
}) {
  return (
    <Tarjeta onPress={onPress} accesibilidad={propuesta.titulo} separacion={espacio.normal}>
      <Fila separacion={espacio.medio} alinear="flex-start">
        <Texto tamano={22} familia="titulo" color={colores.bordeFuerte}>
          {String(orden)}
        </Texto>
        <Columna crecer={1} separacion={espacio.normal}>
          <Fila separacion={espacio.corto}>
            <EtiquetaDeEtapa etapa={propuesta.etapa} alto={26} tamanoDeTexto={12.5} />
            <Texto tamano={13} color={colores.grisTexto}>
              {propuesta.eje}
            </Texto>
          </Fila>
          <Texto tamano={17} peso="fuerte" interlineado={1.3}>
            {propuesta.titulo}
          </Texto>
          <Texto tamano={14} color={colores.grisTexto}>
            {`${propuesta.apoyos} apoyos · ${propuesta.reportesQueResuelve} reportes · ${propuesta.comentarios.length} opiniones`}
          </Texto>
          {propuesta.necesita.length === 0 ? null : (
            <Texto tamano={14} color={colores.grisTexto}>
              {`Busca: ${propuesta.necesita.map((apoyo) => apoyo.titulo.toLowerCase()).join(' · ')}`}
            </Texto>
          )}
        </Columna>
      </Fila>
    </Tarjeta>
  );
}
