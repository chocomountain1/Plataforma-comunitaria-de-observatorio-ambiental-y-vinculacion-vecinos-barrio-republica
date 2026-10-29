import { ScrollView } from 'react-native';

import { Encabezado } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  BotonCircular,
  Columna,
  Fila,
  FilaDeLista,
  Interruptor,
  ListaAgrupada,
  Pantalla,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 2.3 Capas del mapa.
 *
 * El segundo grupo son las capas del diagnostico socioambiental de 2022. La
 * organizacion dejara de pagar la plataforma donde viven hoy, asi que este es
 * el lugar donde ese catastro sigue estando disponible.
 */
export default function CapasDelMapa() {
  const volver = crearVolver('/mapa');
  const { capas, alternarCapa, restablecerCapas } = usarBarrio();

  const capasDeAhora = capas.filter((capa) => capa.grupo === 'ahora');
  const capasDelCatastro = capas.filter((capa) => capa.grupo === 'catastro');

  return (
    <Pantalla>
      <Encabezado
        titulo="Capas del mapa"
        accion={<BotonCircular icono="cerrar" accesibilidad="Cerrar" onPress={volver} />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.seccion,
          paddingTop: espacio.normal,
          paddingBottom: espacio.bloque,
          gap: espacio.seccion,
        }}
      >
        <ListaAgrupada encabezado="LO QUE PASA AHORA">
          {capasDeAhora.map((capa, posicion) => (
            <FilaDeLista
              key={capa.id}
              titulo={capa.nombre}
              detalle={capa.detalle === '' ? undefined : capa.detalle}
              ultima={posicion === capasDeAhora.length - 1}
              onPress={() => alternarCapa(capa.id)}
              control={
                <Interruptor
                  activo={capa.activa}
                  onCambiar={() => alternarCapa(capa.id)}
                  accesibilidad={capa.nombre}
                />
              }
            />
          ))}
        </ListaAgrupada>

        <Columna separacion={espacio.comodo}>
          <Columna separacion={espacio.minimo} style={{ paddingHorizontal: espacio.apretado }}>
            <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
              CATASTRO DEL BARRIO 2022
            </Texto>
            <Texto tamano={13.5} color={colores.grisTexto}>
              Diagnóstico socioambiental de República Circular
            </Texto>
          </Columna>

          <ListaAgrupada>
            {capasDelCatastro.map((capa, posicion) => (
              <FilaDeLista
                key={capa.id}
                titulo={capa.nombre}
                detalle={capa.detalle}
                ultima={posicion === capasDelCatastro.length - 1}
                onPress={() => alternarCapa(capa.id)}
                control={
                  <Interruptor
                    activo={capa.activa}
                    onCambiar={() => alternarCapa(capa.id)}
                    accesibilidad={capa.nombre}
                  />
                }
              />
            ))}
          </ListaAgrupada>

          <Aviso texto="Muchos de estos puntos no tienen su estado actual. Tócalos para ayudar a completarlo." />
        </Columna>
      </ScrollView>

      <BarraInferior>
        <Fila separacion={espacio.comodo}>
          <Boton
            texto="Restablecer"
            variante="secundaria"
            onPress={restablecerCapas}
            style={{ flex: 1 }}
          />
          <Boton texto="Ver en el mapa" onPress={volver} style={{ flex: 1.4 }} />
        </Fila>
      </BarraInferior>
    </Pantalla>
  );
}
