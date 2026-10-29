import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { MarcaDeCategoria } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  Columna,
  EncabezadoDePaso,
  Fila,
  Icono,
  Opcion,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { personas } from '@/datos/personas';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import { categorias } from '@/dominio/categorias';
import { usarBarrio } from '@/estado/barrio';
import { usarBorradores } from '@/estado/borradores';
import { pluralizar } from '@/utiles/texto';
import { crearVolver } from '@/utiles/navegacion';

/** Color de la divisoria entre filas del resumen. */
const COLOR_DIVISORIA = '#EEE7D7';

/**
 * 3.6 Revisar y enviar.
 *
 * Ultimo paso. Resume los cuatro anteriores con un enlace para corregir cada
 * uno, y deja claro en que estado va a quedar el reporte y quien lo hace
 * avanzar.
 */
export default function PasoRevisar() {
  const volver = crearVolver('/reportar/detalles');
  const { reporte, cambiarReporte, reiniciarReporte } = usarBorradores();
  const { publicarReporte } = usarBarrio();

  const categoria = reporte.categoria === null ? undefined : categorias[reporte.categoria];
  const detalles = [reporte.comoSeFormo, reporte.desdeCuando?.toLowerCase()]
    .filter((parte): parte is string => parte !== null && parte !== undefined)
    .join(' · ');

  function enviar() {
    if (reporte.categoria === null) return;
    publicarReporte({
      categoria: reporte.categoria,
      direccion: reporte.direccion,
      descripcion: reporte.descripcion,
      comoSeFormo: reporte.comoSeFormo ?? undefined,
      desdeCuando: reporte.desdeCuando ?? undefined,
      tieneFoto: reporte.imagenes.length > 0,
      imagenes: reporte.imagenes,
      anonimo: reporte.anonimo,
      posicion: reporte.posicion,
    });
    reiniciarReporte();
    router.replace('/reportar/enviado');
  }

  return (
    <Pantalla>
      <EncabezadoDePaso paso={5} total={5} nombre="Revisar" onVolver={volver} />

      <Texto
        tamano={32}
        familia="titulo"
        interlineado={1.08}
        style={{ marginTop: 14, marginHorizontal: espacio.bloque, marginBottom: 14 }}
      >
        ¿Está todo bien?
      </Texto>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: espacio.amplio }}
      >
        <View
          style={{
            marginHorizontal: espacio.seccion,
            backgroundColor: colores.papel,
            borderWidth: 1,
            borderColor: colores.borde,
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          <FilaDeResumen
            etiqueta="Qué pasa"
            valor={categoria?.etiqueta ?? 'Sin elegir'}
            adorno={
              categoria === undefined ? null : (
                <MarcaDeCategoria categoria={categoria.id} tamano={38} redondeo={radio.medio} />
              )
            }
            onCambiar={() => router.dismissTo('/reportar/categoria')}
          />
          <FilaDeResumen
            etiqueta="Foto"
            valor={textoDeFotos(reporte.imagenes.length)}
            adorno={<CuadroDeIcono icono="imagen" fondo={colores.fotoTramaClara} color={colores.fotoIcono} />}
            onCambiar={() => router.dismissTo('/reportar/foto')}
          />
          <FilaDeResumen
            etiqueta="Dónde"
            valor={reporte.direccion}
            adorno={<CuadroDeIcono icono="pin" fondo={colores.menta} color={colores.verde} />}
            onCambiar={() => router.dismissTo('/reportar/ubicacion')}
          />
          <FilaDeResumen
            etiqueta="Detalles"
            valor={detalles === '' ? 'Sin detalles' : detalles}
            adorno={<CuadroDeIcono icono="lapiz" fondo={colores.crema} color={colores.grisTexto} />}
            onCambiar={() => router.dismissTo('/reportar/detalles')}
            ultima
          />
        </View>

        <Columna
          separacion={espacio.normal}
          style={{ marginHorizontal: espacio.seccion, marginTop: espacio.amplio }}
        >
          <Texto tamano={17} peso="fuerte">
            Publicar como
          </Texto>
          <Fila separacion={espacio.normal} alinear="stretch">
            <Opcion
              texto={personas.rosa.nombre}
              seleccion="unica"
              activa={!reporte.anonimo}
              onPress={() => cambiarReporte({ anonimo: false })}
              style={{ flex: 1 }}
            />
            <Opcion
              texto="Anónimo"
              seleccion="unica"
              activa={reporte.anonimo}
              onPress={() => cambiarReporte({ anonimo: true })}
              style={{ flex: 1 }}
            />
          </Fila>
        </Columna>

        <Aviso
          icono="escudo"
          tamanoDeTexto={14.5}
          style={{ marginHorizontal: espacio.seccion, marginTop: 14 }}
        >
          <Texto tamano={14.5} color="#1E3F63" interlineado={1.4}>
            {'Aparecerá como '}
            <Texto tamano={14.5} peso="fuerte" color="#1E3F63">
              Recibido
            </Texto>
            {'. Pasa a '}
            <Texto tamano={14.5} peso="fuerte" color="#1E3F63">
              Verificado
            </Texto>
            {' cuando otros vecinos lo confirman o lo revisa un moderador.'}
          </Texto>
        </Aviso>
      </ScrollView>

      <BarraInferior>
        {categoria === undefined ? (
          <Aviso
            tono="cuidado"
            texto="Falta elegir qué pasa. Toca «Cambiar» en la primera fila."
          />
        ) : null}
        <Boton
          texto="Enviar reporte"
          icono="enviar"
          alto={56}
          tamanoDeTexto={18}
          deshabilitado={categoria === undefined}
          onPress={enviar}
          vibrar
        />
      </BarraInferior>
    </Pantalla>
  );
}

/** Fila del resumen con su enlace para corregir ese paso. */
function FilaDeResumen({
  etiqueta,
  valor,
  adorno,
  onCambiar,
  ultima = false,
}: {
  etiqueta: string;
  valor: string;
  adorno: ReactNode;
  onCambiar: () => void;
  ultima?: boolean;
}) {
  return (
    <Fila
      separacion={espacio.medio}
      style={{
        minHeight: 66,
        paddingVertical: espacio.comodo,
        paddingHorizontal: 14,
        ...(ultima ? null : { borderBottomWidth: 1, borderBottomColor: COLOR_DIVISORIA }),
      }}
    >
      {adorno}
      <Columna crecer={1}>
        <Texto tamano={13} color={colores.grisTexto}>
          {etiqueta}
        </Texto>
        <Texto tamano={16} peso="fuerte">
          {valor}
        </Texto>
      </Columna>
      <Presionable
        onPress={onCambiar}
        accessibilityRole="button"
        accessibilityLabel={`Cambiar ${etiqueta}`}
        style={{ minHeight: alturaTocable.minima, justifyContent: 'center' }}
      >
        <Texto tamano={15} peso="fuerte" style={{ textDecorationLine: 'underline' }}>
          Cambiar
        </Texto>
      </Presionable>
    </Fila>
  );
}

/** Cuadro de 38 px con un icono, para las filas que no tienen categoria. */
function CuadroDeIcono({
  icono,
  fondo,
  color,
}: {
  icono: NombreIcono;
  fondo: string;
  color: string;
}) {
  return (
    <View
      style={{
        width: 38,
        height: 38,
        borderRadius: radio.medio,
        backgroundColor: fondo,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icono nombre={icono} tamano={20} color={color} />
    </View>
  );
}

/** Resumen de cuantas fotos lleva el reporte, para la fila de revision. */
function textoDeFotos(cuantas: number): string {
  if (cuantas === 0) return 'Sin foto';
  return `${cuantas} ${pluralizar(cuantas, 'foto', 'fotos')}`;
}
