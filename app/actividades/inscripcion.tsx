import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { CuadroDeFecha } from '@/componentes/app';
import {
  BarraInferior,
  Boton,
  Columna,
  Etiqueta,
  Fila,
  FilaDeLista,
  Icono,
  ListaAgrupada,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarActividad, usarBarrio } from '@/estado/barrio';
import { usarPreferencias } from '@/estado/preferencias';

/**
 * 6.3 Inscripcion lista.
 *
 * Cierra el flujo de actividades con lo que la persona necesita recordar: la
 * fecha, el lugar, su compromiso y la forma de avisar si al final no puede ir.
 */
export default function InscripcionLista() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const actividad = usarActividad(id);
  const { cancelarInscripcion } = usarBarrio();
  const { menosAnimaciones } = usarPreferencias();
  const margenes = useSafeAreaInsets();
  const [recordatorio, setRecordatorio] = useState(true);

  if (actividad === undefined) return null;

  const esVoluntaria = actividad.miInscripcion === 'voluntario';

  function cancelar() {
    if (actividad === undefined) return;
    cancelarInscripcion(actividad.id);
    router.dismissTo('/actividades');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colores.crema }}>
      <Columna
        alinear="center"
        separacion={espacio.medio}
        style={{
          backgroundColor: colores.bosque,
          paddingTop: margenes.top + espacio.bloque,
          paddingHorizontal: espacio.bloque,
          paddingBottom: 28,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Animated.View entering={menosAnimaciones ? undefined : ZoomIn.duration(420)}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: radio.redondo,
              backgroundColor: colores.brote,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 12,
              borderColor: colores.bosqueClaro,
            }}
          >
            <Icono nombre="visto" tamano={44} color={colores.bosque} grosor={2.6} />
          </View>
        </Animated.View>
        <Texto
          tamano={32}
          familia="titulo"
          color={colores.papel}
          alineacion="center"
          interlineado={1.08}
          style={{ marginTop: espacio.comodo }}
        >
          ¡Te esperamos el sábado!
        </Texto>
        <Texto tamano={17} color={colores.textoSobreBosque} alineacion="center" interlineado={1.45}>
          {`${actividad.organiza.nombre} ya sabe que vas${esVoluntaria ? ' como voluntaria' : ''}.`}
        </Texto>
      </Columna>

      <Fila
        separacion={espacio.amplio}
        style={{
          marginHorizontal: espacio.seccion,
          marginTop: 18,
          backgroundColor: colores.papel,
          borderWidth: 1,
          borderColor: colores.borde,
          borderRadius: 20,
          padding: espacio.amplio,
        }}
      >
        <CuadroDeFecha actividad={actividad} ancho={64} tono="menta" />
        <Columna crecer={1} separacion={espacio.corto}>
          <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.5}>
            {`${actividad.diaSemana} ${actividad.dia} ${actividad.mes} · ${actividad.horario}`}
          </Texto>
          <Texto tamano={17} peso="fuerte" interlineado={1.25}>
            {actividad.titulo}
          </Texto>
          <Texto tamano={14} color={colores.grisTexto}>
            {actividad.lugar}
          </Texto>
          {esVoluntaria ? (
            <Fila separacion={espacio.corto} style={{ marginTop: espacio.apretado }}>
              <Etiqueta texto="Voluntaria" fondo={colores.menta} color="#174D34" />
              {actividad.miTarea === undefined ? null : (
                <Texto tamano={14} color={colores.grisTexto}>
                  {actividad.miTarea}
                </Texto>
              )}
            </Fila>
          ) : null}
        </Columna>
      </Fila>

      <ListaAgrupada style={{ marginHorizontal: espacio.seccion, marginTop: espacio.medio }}>
        <FilaDeLista
          titulo="Agregar a mi calendario"
          conFlecha
          adorno={<Icono nombre="calendario" tamano={24} color={colores.verde} />}
        />
        <FilaDeLista
          titulo="Recordatorio"
          detalle="Viernes 13 a las 18:00"
          onPress={() => setRecordatorio(!recordatorio)}
          adorno={<Icono nombre="campana" tamano={24} color={colores.verde} />}
          control={
            <Icono
              nombre={recordatorio ? 'visto' : 'cerrar'}
              tamano={22}
              color={recordatorio ? colores.verde : colores.grisTexto}
            />
          }
        />
        <FilaDeLista
          titulo="Invitar a alguien por WhatsApp"
          ultima
          conFlecha
          adorno={<Icono nombre="compartir" tamano={24} color={colores.verde} />}
        />
      </ListaAgrupada>

      <BarraInferior fondo={colores.crema} style={{ borderTopWidth: 0 }}>
        <Boton
          texto="Listo"
          alto={56}
          tamanoDeTexto={18}
          onPress={() => router.dismissTo('/actividades')}
        />
        <Boton texto="Ya no puedo ir" variante="secundaria" tamanoDeTexto={16.5} onPress={cancelar} />
      </BarraInferior>
    </View>
  );
}
