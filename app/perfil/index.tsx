import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BotonCircular,
  Columna,
  Fila,
  FilaDeLista,
  Icono,
  ListaAgrupada,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { personas } from '@/datos/personas';
import { logros, resumenDelPerfil, totalDeLogros } from '@/datos/perfil';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import type { Logro } from '@/dominio/tipos';
import { usarBarrio } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';
import { pluralizar } from '@/utiles/texto';

/**
 * 7.2 Perfil y logros.
 *
 * Los logros muestran lo que alguien aporta y nada mas. La decision del equipo
 * fue explicita: nunca dan mas peso a un reporte ni a un apoyo, para que un
 * vecino antiguo no valga mas que uno nuevo con una buena idea.
 */
export default function Perfil() {
  const volver = crearVolver('/inicio');
  const margenes = useSafeAreaInsets();
  const { reportes, propuestas } = usarBarrio();

  const conseguidos = logros.filter((logro) => logro.conseguido).length;
  const misReportes = reportes.filter((reporte) => reporte.esMio).length;
  const misApoyos = propuestas.filter((propuesta) => propuesta.apoyadaPorMi).length;

  return (
    <View style={{ flex: 1, backgroundColor: colores.crema }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(margenes.bottom, espacio.bloque) }}
      >
        <Columna
          separacion={14}
          style={{
            backgroundColor: colores.bosque,
            paddingTop: margenes.top + espacio.medio,
            paddingHorizontal: espacio.seccion,
            paddingBottom: espacio.seccion,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <Fila repartir="space-between">
            <BotonCircular
              icono="flechaIzquierda"
              accesibilidad="Volver"
              onPress={volver}
              tono="oscuro"
            />
            <Presionable
              onPress={() => router.push('/perfil/ajustes')}
              accessibilityRole="button"
              accessibilityLabel="Ajustes"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: espacio.corto,
                minHeight: alturaTocable.minima,
                paddingHorizontal: espacio.medio,
                borderRadius: radio.redondo,
                borderWidth: 1.5,
                borderColor: colores.bosqueBorde,
              }}
            >
              <Icono nombre="deslizadores" tamano={20} color={colores.papel} />
              <Texto tamano={15} peso="fuerte" color={colores.papel}>
                Ajustes
              </Texto>
            </Presionable>
          </Fila>

          <Fila separacion={14}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: radio.redondo,
                backgroundColor: colores.brote,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Texto tamano={30} peso="fuerte" color={colores.bosque}>
                {personas.rosa.inicial}
              </Texto>
            </View>
            <Columna separacion={espacio.corto}>
              <Texto tamano={30} familia="titulo" color={colores.papel} interlineado={1}>
                {personas.rosa.nombre}
              </Texto>
              <Texto tamano={14} color={colores.textoTenueSobreBosque}>
                {resumenDelPerfil.desde}
              </Texto>
            </Columna>
          </Fila>

          <Fila separacion={espacio.corto} style={{ flexWrap: 'wrap' }}>
            {resumenDelPerfil.vinculos.map((vinculo) => (
              <View
                key={vinculo}
                style={{
                  height: 32,
                  paddingHorizontal: espacio.medio,
                  borderRadius: radio.redondo,
                  backgroundColor: colores.bosqueClaro,
                  justifyContent: 'center',
                }}
              >
                <Texto tamano={14} peso="fuerte" color={colores.papel}>
                  {vinculo}
                </Texto>
              </View>
            ))}
            <Presionable
              onPress={() => router.push('/ingreso/vinculo')}
              accessibilityRole="button"
              accessibilityLabel="Editar mi vínculo con el barrio"
              style={{
                minHeight: alturaTocable.minima,
                justifyContent: 'center',
                paddingHorizontal: espacio.corto,
              }}
            >
              <Texto
                tamano={14}
                peso="fuerte"
                color={colores.brote}
                style={{ textDecorationLine: 'underline' }}
              >
                Editar
              </Texto>
            </Presionable>
          </Fila>
        </Columna>

        <Fila
          separacion={espacio.normal}
          alinear="stretch"
          style={{ paddingHorizontal: espacio.amplio, paddingTop: espacio.amplio }}
        >
          <CuadroDeCifra
            valor={misReportes}
            etiqueta={pluralizar(misReportes, 'reporte', 'reportes')}
          />
          <CuadroDeCifra
            valor={resumenDelPerfil.confirmaciones}
            etiqueta={pluralizar(resumenDelPerfil.confirmaciones, 'confirmación', 'confirmaciones')}
          />
          <CuadroDeCifra
            valor={misApoyos}
            etiqueta={pluralizar(misApoyos, 'propuesta apoyada', 'propuestas apoyadas')}
          />
        </Fila>

        <Tarjeta
          relleno={18}
          separacion={14}
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
        >
          <Fila repartir="space-between" alinear="baseline">
            <Texto tamano={21} familia="tituloSemi">
              Logros
            </Texto>
            <Texto tamano={14} color={colores.grisTexto}>
              {`${conseguidos} de ${totalDeLogros}`}
            </Texto>
          </Fila>

          <Fila separacion={espacio.normal} alinear="flex-start" style={{ flexWrap: 'wrap' }}>
            {logros.map((logro) => (
              <Insignia key={logro.id} logro={logro} />
            ))}
          </Fila>

          <Texto tamano={13.5} color={colores.grisTexto} interlineado={1.4}>
            Los logros muestran lo que aportas. No dan más peso a tus reportes ni a tus apoyos.
          </Texto>
        </Tarjeta>

        <ListaAgrupada style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}>
          <FilaDeLista
            titulo="Beneficios del barrio"
            detalle="Con 3 logros ya puedes usar descuentos en locales asociados"
            conFlecha
            adorno={<Icono nombre="comercio" tamano={24} color={colores.ocre} />}
          />
          <FilaDeLista
            titulo="Soy de una universidad o institución"
            conFlecha
            onPress={() => router.push('/instituciones/desafios')}
            adorno={<Icono nombre="birrete" tamano={24} color="#2C5A8C" />}
          />
          <FilaDeLista
            titulo="Panel de gestión"
            detalle="Solo gestores y moderadores"
            ultima
            conFlecha
            onPress={() => router.push('/gestion/panel')}
            adorno={<Icono nombre="escudo" tamano={24} color={colores.verde} />}
          />
        </ListaAgrupada>
      </ScrollView>
    </View>
  );
}

/** Una de las tres cifras del resumen de aportes. */
function CuadroDeCifra({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <Columna
      crecer={1}
      style={{
        backgroundColor: colores.papel,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: radio.caja,
        padding: espacio.medio,
      }}
    >
      <Texto tamano={28} familia="titulo">
        {String(valor)}
      </Texto>
      <Texto tamano={13.5} color={colores.grisTexto}>
        {etiqueta}
      </Texto>
    </Columna>
  );
}

/** Insignia de un logro. Los que faltan van apagados y con el avance. */
function Insignia({ logro }: { logro: Logro }) {
  return (
    <Columna
      alinear="center"
      separacion={espacio.corto}
      style={{ width: '31%', minWidth: 92 }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          ...(logro.conseguido
            ? { backgroundColor: logro.color }
            : {
                backgroundColor: '#EEE7D7',
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: colores.bordeFuerte,
              }),
        }}
      >
        <Icono
          nombre={logro.icono}
          tamano={28}
          color={logro.conseguido ? colores.blanco : '#7C857F'}
          grosor={logro.icono === 'visto' ? 2.4 : 1.9}
        />
      </View>
      <Texto
        tamano={13.5}
        peso={logro.conseguido ? 'fuerte' : 'normal'}
        color={logro.conseguido ? colores.tinta : '#3E4A43'}
        alineacion="center"
        interlineado={1.2}
      >
        {logro.nombre}
      </Texto>
      {logro.avance === undefined ? null : (
        <Texto tamano={13} color={colores.grisTexto} alineacion="center">
          {logro.avance}
        </Texto>
      )}
    </Columna>
  );
}
