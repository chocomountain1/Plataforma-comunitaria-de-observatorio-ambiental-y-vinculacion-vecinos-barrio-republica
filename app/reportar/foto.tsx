import * as SelectorDeImagen from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, View } from 'react-native';

import { ChipDeCategoria } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  Columna,
  EncabezadoDePaso,
  Fila,
  Icono,
  Pantalla,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/** El diseno permite hasta tres fotografias por reporte. */
const MAXIMO_DE_FOTOS = 3;

/**
 * 3.2 Foto.
 *
 * Es opcional a proposito. Una foto ayuda a reconocer el lugar, pero exigirla
 * dejaria fuera a quien reporta de paso o con poca bateria.
 */
export default function PasoFoto() {
  const volver = crearVolver('/reportar/categoria');
  const { reporte, cambiarReporte } = usarBorradores();
  const [imagenes, setImagenes] = useState<string[]>([]);

  async function elegirFoto(desde: 'camara' | 'galeria') {
    const permiso =
      desde === 'camara'
        ? await SelectorDeImagen.requestCameraPermissionsAsync()
        : await SelectorDeImagen.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) return;

    const resultado =
      desde === 'camara'
        ? await SelectorDeImagen.launchCameraAsync({ quality: 0.6 })
        : await SelectorDeImagen.launchImageLibraryAsync({ quality: 0.6 });

    const elegida = resultado.canceled ? undefined : resultado.assets[0];
    if (elegida === undefined) return;

    const siguientes = [...imagenes, elegida.uri].slice(0, MAXIMO_DE_FOTOS);
    setImagenes(siguientes);
    cambiarReporte({ fotos: siguientes.length });
  }

  return (
    <Pantalla>
      <EncabezadoDePaso paso={2} total={5} nombre="Foto" onVolver={volver} />

      <Columna
        separacion={espacio.normal}
        style={{ paddingHorizontal: espacio.bloque, paddingTop: 14 }}
      >
        {reporte.categoria === null ? null : <ChipDeCategoria categoria={reporte.categoria} />}
        <Texto tamano={32} familia="titulo" interlineado={1.08} style={{ marginTop: espacio.corto }}>
          Agrega una foto
        </Texto>
        <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
          Ayuda a que otros reconozcan el lugar. Es opcional.
        </Texto>
      </Columna>

      <View
        style={{
          marginHorizontal: espacio.seccion,
          marginTop: 18,
          height: 262,
          borderRadius: radio.tarjeta,
          borderWidth: 2.5,
          borderStyle: 'dashed',
          borderColor: '#B9AF98',
          backgroundColor: colores.papel,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          overflow: 'hidden',
          padding: espacio.medio,
        }}
      >
        {imagenes.length === 0 ? (
          <>
            <View
              style={{
                width: 76,
                height: 76,
                borderRadius: radio.redondo,
                backgroundColor: colores.menta,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icono nombre="camara" tamano={38} color={colores.verde} />
            </View>
            <Texto
              tamano={16}
              color={colores.grisTexto}
              alineacion="center"
              interlineado={1.4}
              style={{ maxWidth: 240 }}
            >
              {`Puedes subir hasta ${MAXIMO_DE_FOTOS} fotos`}
            </Texto>
          </>
        ) : (
          <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {imagenes.map((uri) => (
              <Image
                key={uri}
                source={{ uri }}
                accessibilityLabel="Foto adjunta al reporte"
                style={{ width: 100, height: 100, borderRadius: radio.boton }}
              />
            ))}
          </Fila>
        )}
      </View>

      <Fila
        separacion={espacio.comodo}
        style={{ paddingHorizontal: espacio.seccion, paddingTop: 14 }}
      >
        <Boton
          texto="Tomar foto"
          icono="camara"
          alto={56}
          tamanoDeTexto={16.5}
          onPress={() => void elegirFoto('camara')}
          style={{ flex: 1 }}
        />
        <Boton
          texto="Galería"
          icono="imagen"
          variante="secundaria"
          alto={56}
          tamanoDeTexto={16.5}
          onPress={() => void elegirFoto('galeria')}
          style={{ flex: 1 }}
        />
      </Fila>

      <Aviso
        tono="cuidado"
        icono="ojo"
        tamanoDeTexto={14.5}
        texto="Cuida la privacidad. Evita que salgan caras, patentes o el interior de casas."
        style={{ marginHorizontal: espacio.seccion, marginTop: 14 }}
      />

      <BarraInferior>
        <Fila separacion={espacio.comodo}>
          <Boton
            texto="Saltar"
            variante="secundaria"
            alto={56}
            tamanoDeTexto={17}
            onPress={() => router.push('/reportar/ubicacion')}
            style={{ flex: 1 }}
          />
          <Boton
            texto="Siguiente"
            icono="flechaDerecha"
            iconoAlFinal
            alto={56}
            tamanoDeTexto={18}
            onPress={() => router.push('/reportar/ubicacion')}
            style={{ flex: 1.5 }}
          />
        </Fila>
      </BarraInferior>
    </Pantalla>
  );
}
