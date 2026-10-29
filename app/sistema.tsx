import { View } from 'react-native';

import {
  Encabezado,
  EtiquetaDeEstado,
  EtiquetaDeEtapa,
  MarcaDeCategoria,
} from '@/componentes/app';
import {
  Boton,
  Columna,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { listaDeCategorias } from '@/dominio/categorias';
import { idsDeEstado, listaDeEtapas } from '@/dominio/estados';
import { crearVolver } from '@/utiles/navegacion';

/** Los ocho colores con nombre del sistema, con su codigo. */
const paleta = [
  { nombre: 'Bosque', valor: colores.bosque },
  { nombre: 'Verde', valor: colores.verde },
  { nombre: 'Brote', valor: colores.brote },
  { nombre: 'Menta', valor: colores.menta },
  { nombre: 'Crema', valor: colores.crema },
  { nombre: 'Papel', valor: colores.papel },
  { nombre: 'Ocre', valor: colores.ocre },
  { nombre: 'Tinta', valor: colores.tinta },
];

/** Las seis reglas de accesibilidad que ordenan todo el diseno. */
const reglasDeAccesibilidad = [
  'Toda zona tocable mide 44 px o más; acciones principales 56 px.',
  'Un paso por pantalla en los flujos, con «Paso X de Y» siempre visible.',
  'Íconos siempre acompañados de texto. Nunca solo color.',
  'Contraste mínimo 4,5:1 en texto. Gris de apoyo #56625B sobre crema.',
  'Tamaño de letra ajustable desde la bienvenida y en Ajustes.',
  'Lenguaje cotidiano: «En gestión», no «Ticket asignado».',
];

/**
 * 0 Sistema visual.
 *
 * La lamina del sistema visual, adaptada al telefono. Sirve de referencia viva:
 * todo lo que se ve aqui sale de los mismos componentes y tokens que usan las
 * demas pantallas, asi que si algo cambia, cambia tambien aqui.
 */
export default function SistemaVisual() {
  const volver = crearVolver('/perfil/ajustes');
  return (
    <Pantalla desplazable espacioAlFinal={espacio.bloque}>
      <Encabezado
        titulo="Sistema visual"
        subtitulo="Plataforma comunitaria Barrio República"
        tamanoDeTitulo={28}
        onVolver={volver}
      />

      <Columna
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.amplio }}
      >
        <Texto tamano={15.5} color={colores.grisTexto} interlineado={1.45}>
          Verde bosque y crema heredados de la presentación del Hito 1. Letra Atkinson
          Hyperlegible, creada para personas con baja visión, en 17 px como base. Cada color de
          categoría o estado va siempre junto a un ícono y una palabra.
        </Texto>

        <Tarjeta relleno={18} separacion={14}>
          <Texto tamano={21} familia="tituloSemi">
            Color
          </Texto>
          <Fila separacion={espacio.normal} alinear="flex-start" style={{ flexWrap: 'wrap' }}>
            {paleta.map((color) => (
              <Columna key={color.nombre} separacion={espacio.corto} style={{ width: '31%' }}>
                <View
                  style={{
                    height: 56,
                    borderRadius: radio.boton,
                    backgroundColor: color.valor,
                    borderWidth: 1,
                    borderColor: colores.borde,
                  }}
                />
                <Texto tamano={14} peso="fuerte">
                  {color.nombre}
                </Texto>
                <Texto tamano={12.5} color={colores.grisTexto}>
                  {color.valor}
                </Texto>
              </Columna>
            ))}
          </Fila>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={14}>
          <Texto tamano={21} familia="tituloSemi">
            Estados del reporte
          </Texto>
          <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
            {idsDeEstado.map((id) => (
              <EtiquetaDeEstado key={id} estado={id} alto={32} tamanoDeTexto={14} />
            ))}
          </Fila>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={14}>
          <Texto tamano={21} familia="tituloSemi">
            Tipografía
          </Texto>
          <Columna separacion={espacio.medio}>
            <MuestraDeTexto tamano={44} familia="titulo" nombre="Título 44" nota="Fira Sans Condensed 700 · portadas" />
            <MuestraDeTexto tamano={32} familia="titulo" nombre="Título de pantalla 32" nota="Fira Sans Condensed 700" />
            <MuestraDeTexto tamano={22} familia="tituloSemi" nombre="Sección 22" nota="Fira Sans Condensed 600" />
            <MuestraDeTexto
              tamano={17}
              familia="texto"
              nombre="Texto base 17"
              nota="Atkinson Hyperlegible 400 / 700. Pensado para leerse sin lentes y con sol."
            />
            <MuestraDeTexto
              tamano={14}
              familia="texto"
              nombre="Apoyo 14"
              nota="Nunca bajo 13 px"
            />
          </Columna>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={espacio.comodo}>
          <Texto tamano={21} familia="tituloSemi">
            Botones
          </Texto>
          <Texto tamano={14} color={colores.grisTexto}>
            Alto mínimo 52 px
          </Texto>
          <Boton texto="Acción principal" alto={56} tamanoDeTexto={18} />
          <Fila separacion={espacio.comodo}>
            <Boton texto="Secundaria" variante="secundaria" style={{ flex: 1 }} />
            <Boton texto="Tonal" variante="tonal" style={{ flex: 1 }} />
          </Fila>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={14}>
          <Texto tamano={21} familia="tituloSemi">
            Categorías de reporte
          </Texto>
          <Texto tamano={14} color={colores.grisTexto} interlineado={1.4}>
            Siete categorías y «Otro». Toman la taxonomía del catastro 2022 y de la HU 1.
          </Texto>
          <Fila separacion={espacio.normal} alinear="flex-start" style={{ flexWrap: 'wrap' }}>
            {listaDeCategorias.map((categoria) => (
              <Fila
                key={categoria.id}
                separacion={espacio.corto}
                style={{
                  height: 36,
                  paddingHorizontal: espacio.normal,
                  borderRadius: radio.redondo,
                  borderWidth: 1,
                  borderColor: colores.borde,
                }}
              >
                <MarcaDeCategoria categoria={categoria.id} tamano={22} />
                <Texto tamano={13.5} peso="fuerte" color={categoria.color}>
                  {categoria.etiquetaCorta}
                </Texto>
              </Fila>
            ))}
          </Fila>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={14}>
          <Texto tamano={21} familia="tituloSemi">
            Etapas de una propuesta
          </Texto>
          {listaDeEtapas.map((etapa) => (
            <Fila key={etapa.id} separacion={espacio.medio}>
              <Texto tamano={18} familia="titulo" color={colores.bordeFuerte} style={{ width: 20 }}>
                {String(etapa.numero)}
              </Texto>
              <EtiquetaDeEtapa etapa={etapa.id} />
              <Texto tamano={14} color={colores.grisTexto} style={{ flex: 1 }}>
                {etapa.explicacion}
              </Texto>
            </Fila>
          ))}
          <Texto tamano={13.5} color={colores.grisTexto} interlineado={1.4}>
            Reporte → propuesta → conversación → prioridad → convocatoria → acción → evidencia →
            dato histórico.
          </Texto>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={espacio.comodo}>
          <Texto tamano={21} familia="tituloSemi">
            Reglas de accesibilidad
          </Texto>
          {reglasDeAccesibilidad.map((regla) => (
            <Fila key={regla} separacion={espacio.comodo} alinear="flex-start">
              <Icono nombre="visto" tamano={18} color={colores.verde} grosor={2.4} />
              <Texto tamano={15} interlineado={1.4} style={{ flex: 1 }}>
                {regla}
              </Texto>
            </Fila>
          ))}
        </Tarjeta>
      </Columna>
    </Pantalla>
  );
}

/** Una linea de muestra tipografica con su nombre y su descripcion. */
function MuestraDeTexto({
  tamano,
  familia,
  nombre,
  nota,
}: {
  tamano: number;
  familia: 'titulo' | 'tituloSemi' | 'texto';
  nombre: string;
  nota: string;
}) {
  return (
    <Columna separacion={espacio.minimo}>
      <Texto tamano={tamano} familia={familia} interlineado={1.1}>
        {nombre}
      </Texto>
      <Texto tamano={13} color={colores.grisTexto} interlineado={1.35}>
        {nota}
      </Texto>
    </Columna>
  );
}
