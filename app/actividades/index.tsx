import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Encabezado, FilaDeActividad, TarjetaDeActividad } from '@/componentes/app';
import {
  BotonCircular,
  Chip,
  Columna,
  Fila,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { filtrosDeActividad } from '@/datos/actividades';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/** La semana que se muestra arriba. El dia 12 es hoy en el prototipo. */
const diasDeLaSemana = [
  { sigla: 'LUN', numero: 9 },
  { sigla: 'MAR', numero: 10 },
  { sigla: 'MIÉ', numero: 11 },
  { sigla: 'HOY', numero: 12 },
  { sigla: 'VIE', numero: 13 },
  { sigla: 'SÁB', numero: 14 },
  { sigla: 'DOM', numero: 15 },
];

const DIA_DE_HOY = 12;

/**
 * 6.1 Actividades.
 *
 * Las actividades son el puente entre deliberar y hacer. La convocatoria es el
 * cuello de botella del barrio, no la voluntad, asi que la pantalla deja a la
 * vista cuantos voluntarios faltan.
 */
export default function Actividades() {
  const volver = crearVolver('/inicio');
  const { actividades } = usarBarrio();
  const [diaElegido, setDiaElegido] = useState<number>(14);
  const [filtro, setFiltro] = useState<string>('Todas');

  const visibles = actividades.filter((actividad) => {
    if (filtro === 'Buscan voluntarios') {
      return actividad.voluntariosNecesarios > actividad.voluntarios;
    }
    if (filtro === 'Me inscribí') {
      return actividad.miInscripcion !== null;
    }
    return true;
  });

  const deEsteSabado = visibles.filter((actividad) => actividad.dia === diaElegido);
  const proximas = visibles.filter((actividad) => actividad.dia !== diaElegido);

  return (
    <Pantalla>
      <Encabezado
        titulo="Actividades"
        onVolver={volver}
        accion={
          <Fila separacion={espacio.comodo}>
            <Texto tamano={15} peso="fuerte" color={colores.grisTexto}>
              Noviembre
            </Texto>
            <BotonCircular
              icono="mas"
              accesibilidad="Crear actividad"
              onPress={() => router.push('/actividades/crear')}
            />
          </Fila>
        }
      />

      <Fila
        separacion={espacio.apretado}
        alinear="stretch"
        style={{ paddingHorizontal: espacio.amplio, paddingTop: espacio.corto }}
      >
        {diasDeLaSemana.map((dia) => {
          const elegido = dia.numero === diaElegido;
          const esHoy = dia.numero === DIA_DE_HOY;
          const tieneActividad = actividades.some((actividad) => actividad.dia === dia.numero);
          return (
            <Presionable
              key={dia.numero}
              onPress={() => setDiaElegido(dia.numero)}
              escalaAlTocar={0.93}
              accessibilityRole="tab"
              accessibilityState={{ selected: elegido }}
              accessibilityLabel={`${dia.sigla} ${dia.numero}`}
              style={{
                flex: 1,
                height: 64,
                borderRadius: radio.boton,
                alignItems: 'center',
                justifyContent: 'center',
                gap: espacio.minimo,
                ...(elegido
                  ? { backgroundColor: colores.verde }
                  : esHoy
                    ? {
                        backgroundColor: colores.papel,
                        borderWidth: 1.5,
                        borderColor: colores.borde,
                      }
                    : null),
              }}
            >
              <Texto
                tamano={12.5}
                color={elegido ? colores.papel : colores.grisTexto}
              >
                {dia.sigla}
              </Texto>
              <Texto tamano={18} peso="fuerte" color={elegido ? colores.papel : colores.tinta}>
                {String(dia.numero)}
              </Texto>
              {tieneActividad ? (
                <View
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: radio.redondo,
                    backgroundColor: elegido ? colores.brote : colores.ocre,
                  }}
                />
              ) : null}
            </Presionable>
          );
        })}
      </Fila>

      <Fila
        separacion={espacio.normal}
        style={{ paddingHorizontal: espacio.seccion, paddingTop: espacio.medio }}
      >
        {filtrosDeActividad.map((opcion) => (
          <Chip
            key={opcion}
            texto={opcion}
            activo={filtro === opcion}
            onPress={() => setFiltro(opcion)}
            tamanoDeTexto={14}
          />
        ))}
      </Fila>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingTop: espacio.amplio,
          paddingBottom: espacio.bloque,
          gap: espacio.medio,
        }}
      >
        {deEsteSabado.length === 0 ? null : (
          <>
            <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
              ESTE SÁBADO
            </Texto>
            {deEsteSabado.map((actividad) => (
              <TarjetaDeActividad
                key={actividad.id}
                actividad={actividad}
                onPress={() => router.push(`/actividades/${actividad.id}`)}
              />
            ))}
          </>
        )}

        {proximas.length === 0 ? null : (
          <>
            <Texto
              tamano={13}
              peso="fuerte"
              color={colores.grisTexto}
              espaciado={0.6}
              style={{ marginTop: espacio.normal }}
            >
              PRÓXIMAS
            </Texto>
            {proximas.map((actividad) => (
              <FilaDeActividad
                key={actividad.id}
                actividad={actividad}
                onPress={() => router.push(`/actividades/${actividad.id}`)}
              />
            ))}
          </>
        )}

        {visibles.length === 0 ? (
          <Columna separacion={espacio.comodo} style={{ paddingTop: espacio.seccion }}>
            <Texto tamano={16} alineacion="center" color={colores.grisTexto}>
              No hay actividades con ese filtro.
            </Texto>
          </Columna>
        ) : null}
      </ScrollView>
    </Pantalla>
  );
}
