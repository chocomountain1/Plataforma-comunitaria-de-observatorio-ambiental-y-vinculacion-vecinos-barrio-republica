import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  Aviso,
  BarraInferior,
  Boton,
  EncabezadoDePaso,
  Icono,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { listaDeCategorias, type Categoria } from '@/dominio/categorias';
import { usarBorradores } from '@/estado/borradores';

/**
 * 3.1 Que pasa.
 *
 * Primer paso del reporte. Las ocho categorias vienen de la taxonomia del
 * catastro 2022, de modo que lo que reporte un vecino hoy se pueda comparar con
 * lo que se levanto en terreno entonces.
 */
export default function PasoCategoria() {
  const { reporte, cambiarReporte, reiniciarReporte } = usarBorradores();

  function cancelar() {
    reiniciarReporte();
    router.dismissTo('/inicio');
  }

  return (
    <Pantalla>
      <EncabezadoDePaso
        paso={1}
        total={5}
        nombre="Qué pasa"
        esPrimerPaso
        textoDeCancelar="Cancelar reporte"
        onVolver={cancelar}
      />

      <Texto
        tamano={32}
        familia="titulo"
        interlineado={1.08}
        style={{ marginTop: 14, marginHorizontal: espacio.bloque, marginBottom: espacio.amplio }}
      >
        ¿Qué quieres reportar?
      </Texto>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.seccion,
          paddingBottom: espacio.amplio,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: espacio.comodo,
        }}
      >
        {listaDeCategorias.map((categoria) => (
          <CuadroDeCategoria
            key={categoria.id}
            categoria={categoria}
            elegida={reporte.categoria === categoria.id}
            onPress={() => cambiarReporte({ categoria: categoria.id })}
          />
        ))}
      </ScrollView>

      <BarraInferior>
        <Aviso
          tono="neutro"
          texto="Para delitos o emergencias llama al 133 o 132. Esta app es para mejorar el barrio."
        />
        <Boton
          texto="Siguiente"
          alto={56}
          tamanoDeTexto={18}
          icono="flechaDerecha"
          iconoAlFinal
          deshabilitado={reporte.categoria === null}
          onPress={() => router.push('/reportar/foto')}
        />
      </BarraInferior>
    </Pantalla>
  );
}

/**
 * Cuadro de una categoria. El elegido se marca con borde grueso, aro de color y
 * un visto, nunca solo con color.
 */
function CuadroDeCategoria({
  categoria,
  elegida,
  onPress,
}: {
  categoria: Categoria;
  elegida: boolean;
  onPress: () => void;
}) {
  return (
    <Presionable
      onPress={onPress}
      vibrar
      accessibilityRole="radio"
      accessibilityState={{ checked: elegida }}
      accessibilityLabel={categoria.etiqueta}
      style={{
        flexGrow: 1,
        flexBasis: '45%',
        minHeight: 100,
        borderRadius: 18,
        backgroundColor: colores.papel,
        padding: elegida ? espacio.medio : 13,
        justifyContent: 'space-between',
        ...(elegida
          ? { borderWidth: 3, borderColor: colores.bosque }
          : { borderWidth: 1.5, borderColor: colores.borde }),
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          backgroundColor: categoria.color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icono nombre={categoria.icono} tamano={24} color={colores.blanco} />
      </View>

      {elegida ? (
        <View
          style={{
            position: 'absolute',
            right: espacio.comodo,
            top: espacio.comodo,
            width: 26,
            height: 26,
            borderRadius: radio.redondo,
            backgroundColor: colores.bosque,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icono nombre="visto" tamano={16} color={colores.blanco} grosor={2.8} />
        </View>
      ) : null}

      <Texto tamano={16} peso="fuerte" interlineado={1.2}>
        {categoria.etiqueta}
      </Texto>
    </Presionable>
  );
}
