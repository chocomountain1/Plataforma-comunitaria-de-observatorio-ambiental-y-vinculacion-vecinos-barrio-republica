import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Encabezado, RotuloDeCategoria } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  Columna,
  Fila,
  Icono,
  Opcion,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { estados, idsDeEstado, type IdEstado } from '@/dominio/estados';
import { usarBarrio, usarReporte } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/** Motivos por los que se puede ocultar un reporte. */
const motivosParaOcultar = [
  'No existe o es falso',
  'Tiene datos personales u ofensas',
  'Es delito o emergencia (derivar al 133)',
];

/**
 * 9.2 Revision de reporte.
 *
 * La moderacion no es un extra: el riesgo de reportes falsos aparecio en
 * terreno como la principal causa de desconfianza hacia la plataforma, y esa
 * desconfianza es anterior al uso.
 */
export default function RevisarReporte() {
  const volver = crearVolver('/gestion/panel');
  const { id } = useLocalSearchParams<{ id: string }>();
  const reporte = usarReporte(id);
  const { reportes, cambiarEstadoDeReporte, ocultarReporte } = usarBarrio();

  const [estadoElegido, setEstadoElegido] = useState<IdEstado | null>(null);
  const [motivo, setMotivo] = useState<string | null>(null);

  if (reporte === undefined) {
    return (
      <Pantalla>
        <Encabezado titulo="Reporte no encontrado" onVolver={volver} />
      </Pantalla>
    );
  }

  const posibleDuplicado = reportes.find(
    (otro) => otro.id !== reporte.id && otro.categoria === reporte.categoria && otro.esMio === false,
  );

  function guardar() {
    if (reporte === undefined) return;
    if (estadoElegido !== null) {
      cambiarEstadoDeReporte(reporte.id, estadoElegido);
    }
    router.back();
  }

  function ocultar() {
    if (reporte === undefined || motivo === null) return;
    ocultarReporte(reporte.id);
    router.dismissTo('/gestion/panel');
  }

  return (
    <Pantalla desplazable espacioAlFinal={espacio.amplio}>
      <Encabezado
        titulo="Revisar reporte"
        tamanoDeTitulo={26}
        onVolver={volver}
        textoDeVolver="Volver al panel"
      />

      {(reporte.senalamientos ?? 0) > 0 ? (
        <Aviso
          tono="cuidado"
          icono="bandera"
          style={{ marginHorizontal: espacio.amplio, marginBottom: espacio.medio }}
        >
          <Texto tamano={14.5} color="#6F4A0E" interlineado={1.4}>
            <Texto tamano={14.5} peso="fuerte" color="#6F4A0E">
              {`Señalado por ${reporte.senalamientos} vecinos `}
            </Texto>
            {'como «no existe». Nadie más lo ha confirmado.'}
          </Texto>
        </Aviso>
      ) : null}

      <Tarjeta style={{ marginHorizontal: espacio.amplio }} relleno={18}>
        <Fila repartir="space-between" separacion={espacio.normal}>
          <RotuloDeCategoria categoria={reporte.categoria} />
          <Texto tamano={13} color={colores.grisTexto}>
            {reporte.publicado}
          </Texto>
        </Fila>
        <Texto tamano={20} familia="tituloSemi" interlineado={1.2}>
          {reporte.titulo}
        </Texto>
        <Texto tamano={14} color={colores.grisTexto}>
          {reporte.anonimo ? 'Publicado como anónimo' : `Publicado por ${reporte.autor?.nombre}`}
        </Texto>
        {reporte.descripcion === undefined ? null : (
          <Texto tamano={15.5} interlineado={1.4}>
            {`«${reporte.descripcion}»`}
          </Texto>
        )}
      </Tarjeta>

      {posibleDuplicado === undefined ? null : (
        <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
          <Fila separacion={espacio.comodo}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radio.medio,
                backgroundColor: '#F5E6C8',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icono nombre="enlace" tamano={22} color="#8A5A12" />
            </View>
            <Texto tamano={16.5} peso="fuerte" style={{ flex: 1 }} interlineado={1.3}>
              Puede ser el mismo que otro reporte
            </Texto>
          </Fila>
          <Texto tamano={14.5} color={colores.grisTexto} interlineado={1.4}>
            {`«${posibleDuplicado.titulo}», a 25 m, con ${posibleDuplicado.confirmaciones} confirmaciones.`}
          </Texto>
          <Boton texto="Unir los dos reportes" variante="secundaria" icono="enlace" />
        </Tarjeta>
      )}

      <Columna
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.seccion }}
      >
        <Texto tamano={21} familia="tituloSemi">
          Cambiar estado
        </Texto>
        <Fila separacion={espacio.normal} alinear="stretch" style={{ flexWrap: 'wrap' }}>
          {idsDeEstado.map((cual) => (
            <Opcion
              key={cual}
              texto={estados[cual].etiqueta}
              compacta
              seleccion="unica"
              activa={(estadoElegido ?? reporte.estado) === cual}
              onPress={() => setEstadoElegido(cual)}
              style={{ flexGrow: 1, flexBasis: '45%' }}
            />
          ))}
        </Fila>
      </Columna>

      <Columna
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.seccion }}
      >
        <Texto tamano={21} familia="tituloSemi">
          Si lo ocultas, ¿por qué?
        </Texto>
        {motivosParaOcultar.map((cual) => (
          <Opcion
            key={cual}
            texto={cual}
            seleccion="unica"
            activa={motivo === cual}
            onPress={() => setMotivo(cual)}
          />
        ))}
        <Texto tamano={13.5} color={colores.grisTexto}>
          Quien lo publicó recibe el motivo.
        </Texto>
      </Columna>

      <BarraInferior alFinal={false} style={{ marginTop: espacio.seccion }}>
        <Fila separacion={espacio.comodo}>
          <Boton
            texto="Ocultar"
            variante="peligro"
            deshabilitado={motivo === null}
            onPress={ocultar}
            style={{ flex: 1 }}
          />
          <Boton
            texto="Guardar cambios"
            deshabilitado={estadoElegido === null}
            onPress={guardar}
            vibrar
            style={{ flex: 1.4 }}
          />
        </Fila>
      </BarraInferior>
    </Pantalla>
  );
}
