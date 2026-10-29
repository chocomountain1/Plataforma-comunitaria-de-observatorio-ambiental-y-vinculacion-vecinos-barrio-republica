import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Encabezado, EtiquetaDeEstado, MarcaDeCategoria } from '@/componentes/app';
import {
  BarraInferior,
  Boton,
  Chip,
  Columna,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { personas } from '@/datos/personas';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/** Los filtros rapidos del panel, en el orden del mockup. */
const filtros = ['Categoría', 'Zona: Eje universitario', 'Estado', 'Más antiguos'] as const;

/**
 * 9.1 Panel de gestion.
 *
 * Es la herramienta de trabajo diaria de Republica Circular. La organizacion
 * tiene entre tres y diez personas activas, asi que lo que importa es ver de
 * una pasada que esta senalado, que no avanza y que hay que revisar.
 */
export default function PanelDeGestion() {
  const volver = crearVolver('/perfil');
  const { reportes } = usarBarrio();
  const [filtroActivo, setFiltroActivo] = useState<string | null>('Zona: Eje universitario');

  const porRevisar = reportes.filter((reporte) => reporte.estado === 'recibido').length;
  const senalados = reportes.filter((reporte) => (reporte.senalamientos ?? 0) > 0).length;
  const sinAvance = reportes.filter((reporte) => reporte.resumen.includes('sin avance')).length;

  const delPanel = reportes.filter((reporte) => reporte.estado !== 'resuelto');

  return (
    <Pantalla>
      <Encabezado
        titulo="Panel de gestión"
        subtitulo={`${personas.camila.nombre} · Gestora territorial y moderadora`}
        tamanoDeTitulo={26}
        onVolver={volver}
      />

      <Fila
        separacion={espacio.normal}
        alinear="stretch"
        style={{ paddingHorizontal: espacio.amplio, paddingBottom: espacio.medio }}
      >
        <CuadroDeAlerta valor={porRevisar} etiqueta="Por revisar" color={colores.verde} />
        <CuadroDeAlerta valor={senalados} etiqueta="Señalados" color={colores.alerta} />
        <CuadroDeAlerta valor={sinAvance} etiqueta="Sin avance +30 d" color={colores.ocre} />
      </Fila>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: espacio.normal, paddingHorizontal: espacio.amplio }}
        style={{ flexGrow: 0 }}
      >
        {filtros.map((filtro) => (
          <Chip
            key={filtro}
            texto={filtro}
            activo={filtroActivo === filtro}
            icono="chevronAbajo"
            onPress={() => setFiltroActivo(filtroActivo === filtro ? null : filtro)}
            tamanoDeTexto={14}
          />
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingTop: espacio.amplio,
          paddingBottom: espacio.amplio,
          gap: espacio.comodo,
        }}
      >
        <Texto tamano={14} color={colores.grisTexto}>
          {`${delPanel.length} reportes en el eje universitario`}
        </Texto>

        {delPanel.map((reporte) => {
          const estaSenalado = (reporte.senalamientos ?? 0) > 0;
          return (
            <Tarjeta
              key={reporte.id}
              onPress={() => router.push(`/gestion/moderar/${reporte.id}`)}
              accesibilidad={reporte.titulo}
              relleno={14}
              separacion={espacio.normal}
              style={
                estaSenalado
                  ? { borderWidth: 1.5, borderColor: colores.alerta }
                  : undefined
              }
            >
              <Fila separacion={espacio.medio} alinear="flex-start">
                <MarcaDeCategoria
                  categoria={reporte.categoria}
                  tamano={38}
                  redondeo={radio.medio}
                />
                <Columna crecer={1} separacion={espacio.apretado}>
                  <Texto tamano={16} peso="fuerte" interlineado={1.25}>
                    {reporte.titulo}
                  </Texto>
                  <Fila separacion={espacio.corto}>
                    {estaSenalado ? (
                      <Fila separacion={espacio.apretado}>
                        <Icono nombre="bandera" tamano={16} color={colores.alerta} />
                        <Texto tamano={13.5} peso="fuerte" color={colores.alerta}>
                          {`Señalado por ${reporte.senalamientos} vecinos`}
                        </Texto>
                      </Fila>
                    ) : (
                      <Texto tamano={13.5} color={colores.grisTexto}>
                        {reporte.resumen}
                      </Texto>
                    )}
                  </Fila>
                </Columna>
                <EtiquetaDeEstado estado={reporte.estado} alto={26} tamanoDeTexto={12.5} />
              </Fila>
            </Tarjeta>
          );
        })}
      </ScrollView>

      <BarraInferior>
        <Boton texto="Exportar para la Municipalidad" variante="secundaria" icono="descargar" />
      </BarraInferior>
    </Pantalla>
  );
}

/** Contador grande de una situacion que necesita atencion. */
function CuadroDeAlerta({
  valor,
  etiqueta,
  color,
}: {
  valor: number;
  etiqueta: string;
  color: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colores.papel,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: radio.caja,
        padding: espacio.medio,
      }}
    >
      <Texto tamano={28} familia="titulo" color={color}>
        {String(valor)}
      </Texto>
      <Texto tamano={13} color={colores.grisTexto} interlineado={1.2}>
        {etiqueta}
      </Texto>
    </View>
  );
}
