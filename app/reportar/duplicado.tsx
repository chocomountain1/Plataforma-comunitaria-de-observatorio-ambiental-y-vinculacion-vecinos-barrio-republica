import { router } from 'expo-router';
import { View } from 'react-native';

import { EtiquetaDeEstado, FotoSimulada, RotuloDeCategoria } from '@/componentes/app';
import {
  BarraInferior,
  Boton,
  Columna,
  EncabezadoDePaso,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 3.4 Posible duplicado.
 *
 * Se intercala entre el paso de ubicacion y el de detalles, y no consume un
 * paso propio. Confirmar un reporte existente le da mas prioridad y evita
 * llenar el mapa de chinchetas repetidas, que fue el criterio que el equipo
 * eligio en vez de detectar duplicados de forma automatica.
 */
export default function PasoDuplicado() {
  const volver = crearVolver('/reportar/ubicacion');
  const { reporte, reiniciarReporte } = usarBorradores();
  const { reportes, confirmarReporte } = usarBarrio();

  const parecido = reportes.find((otro) => otro.id === reporte.posibleDuplicado);

  function confirmarQueEsElMismo() {
    if (parecido !== undefined) {
      confirmarReporte(parecido.id);
      reiniciarReporte();
      router.dismissTo(`/reportes/${parecido.id}`);
    }
  }

  return (
    <Pantalla>
      <EncabezadoDePaso paso={3} total={5} nombre="Dónde" onVolver={volver} />

      <Columna
        separacion={espacio.normal}
        style={{ paddingHorizontal: espacio.bloque, paddingTop: 18 }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: radio.caja,
            backgroundColor: '#F5E6C8',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icono nombre="enlace" tamano={28} color="#8A5A12" />
        </View>
        <Texto tamano={28} familia="titulo" interlineado={1.1}>
          ¿Es el mismo problema?
        </Texto>
        <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
          Alguien ya reportó algo parecido a 30 metros de ese punto.
        </Texto>
      </Columna>

      {parecido === undefined ? null : (
        <Tarjeta recortar style={{ marginHorizontal: espacio.seccion, marginTop: espacio.amplio }}>
          <FotoSimulada alto={110} accesibilidad="Foto del reporte existente" />
          <Columna separacion={espacio.normal} style={{ padding: espacio.amplio }}>
            <Fila repartir="space-between">
              <RotuloDeCategoria categoria={parecido.categoria} detalle={parecido.subtipo} />
              <EtiquetaDeEstado estado={parecido.estado} />
            </Fila>
            <Texto tamano={17} peso="fuerte">
              {parecido.direccion}
            </Texto>
            <Texto tamano={14} color={colores.grisTexto}>
              {`${parecido.publicado} · ${parecido.confirmaciones} vecinos lo confirman`}
            </Texto>
            {parecido.descripcion === undefined ? null : (
              <Texto tamano={15} color={colores.grisTexto} interlineado={1.4}>
                {`«${parecido.descripcion}»`}
              </Texto>
            )}
          </Columna>
        </Tarjeta>
      )}

      <BarraInferior>
        <Texto tamano={14} color={colores.grisTexto} interlineado={1.4}>
          Si es el mismo, tu confirmación le da más prioridad y evitamos reportes repetidos.
        </Texto>
        <Boton
          texto="Sí, es el mismo. Lo confirmo"
          icono="visto"
          alto={56}
          tamanoDeTexto={17}
          onPress={confirmarQueEsElMismo}
          vibrar
        />
        <Boton
          texto="No, es otro problema"
          variante="secundaria"
          tamanoDeTexto={16.5}
          onPress={() => router.push('/reportar/detalles')}
        />
      </BarraInferior>
    </Pantalla>
  );
}
