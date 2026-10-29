import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  Columna,
  Fila,
  Icono,
  Pantalla,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import type { Aviso, MomentoAviso } from '@/dominio/tipos';
import { usarBarrio } from '@/estado/barrio';

/** Titulo de cada grupo de la bandeja. */
const titulosDeMomento: Record<MomentoAviso, string> = {
  hoy: 'HOY',
  semana: 'ESTA SEMANA',
};

/**
 * 7.1 Avisos.
 *
 * Es la pieza que faltaba en las herramientas anteriores del barrio: el Banco
 * del Tiempo murio, entre otras cosas, porque no habia notificaciones. Aqui
 * cada aviso lleva a lo que lo origino.
 */
export default function Avisos() {
  const { avisos, marcarAvisoLeido, marcarTodosLosAvisosLeidos } = usarBarrio();

  const momentos: MomentoAviso[] = ['hoy', 'semana'];

  function abrir(aviso: Aviso) {
    marcarAvisoLeido(aviso.id);
    if (aviso.destino !== undefined) {
      router.push(aviso.destino as never);
    }
  }

  return (
    <Pantalla>
      <Fila
        repartir="space-between"
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.comodo }}
      >
        <Texto tamano={30} familia="titulo">
          Avisos
        </Texto>
        <Presionable
          onPress={marcarTodosLosAvisosLeidos}
          accessibilityRole="button"
          accessibilityLabel="Marcar todo como leído"
          style={{ minHeight: alturaTocable.minima, justifyContent: 'center' }}
        >
          <Texto tamano={15} peso="fuerte" color={colores.verde}>
            Marcar todo leído
          </Texto>
        </Presionable>
      </Fila>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingBottom: espacio.bloque,
          gap: espacio.comodo,
        }}
      >
        {momentos.map((momento) => {
          const delMomento = avisos.filter((aviso) => aviso.momento === momento);
          if (delMomento.length === 0) return null;

          return (
            <Columna key={momento} separacion={espacio.comodo} style={{ marginTop: espacio.normal }}>
              <Texto
                tamano={13}
                peso="fuerte"
                color={colores.grisTexto}
                espaciado={0.6}
                style={{ paddingHorizontal: espacio.apretado }}
              >
                {titulosDeMomento[momento]}
              </Texto>

              {delMomento.map((aviso) => (
                <Tarjeta
                  key={aviso.id}
                  onPress={() => abrir(aviso)}
                  accesibilidad={`${aviso.destacado} ${aviso.texto}`}
                  separacion={espacio.corto}
                  style={aviso.leido ? { opacity: 0.72 } : undefined}
                >
                  <Fila separacion={espacio.medio} alinear="flex-start">
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: radio.medio,
                        backgroundColor: aviso.fondo,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icono nombre={aviso.icono} tamano={22} color={aviso.color} />
                    </View>

                    <Columna crecer={1} separacion={espacio.apretado}>
                      <Texto tamano={16} interlineado={1.35}>
                        <Texto tamano={16} peso="fuerte">
                          {aviso.destacado}
                        </Texto>
                        {aviso.texto.startsWith('.') ? aviso.texto : ` ${aviso.texto}`}
                      </Texto>
                      <Texto tamano={13.5} color={colores.grisTexto}>
                        {aviso.cuando}
                      </Texto>
                      {aviso.pie === undefined ? null : (
                        <Texto tamano={14.5} peso="fuerte" color={colores.verde}>
                          {aviso.pie}
                        </Texto>
                      )}
                    </Columna>

                    {aviso.leido ? null : (
                      <View
                        accessible
                        accessibilityLabel="Sin leer"
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: radio.redondo,
                          backgroundColor: colores.alerta,
                          marginTop: espacio.corto,
                        }}
                      />
                    )}
                  </Fila>
                </Tarjeta>
              ))}
            </Columna>
          );
        })}
      </ScrollView>
    </Pantalla>
  );
}
