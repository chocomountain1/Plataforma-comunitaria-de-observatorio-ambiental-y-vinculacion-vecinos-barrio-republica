import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Encabezado } from '@/componentes/app';
import {
  Columna,
  Fila,
  FilaDeLista,
  Icono,
  Interruptor,
  ListaAgrupada,
  Pantalla,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarPreferencias, type FactorTexto } from '@/estado/preferencias';
import { usarSesion } from '@/estado/sesion';
import { crearVolver } from '@/utiles/navegacion';

/** Nombre y tamano de muestra de cada escalon de letra. */
const tamanosDeLetra: { factor: FactorTexto; nombre: string; muestra: number }[] = [
  { factor: 1, nombre: 'Normal', muestra: 16 },
  { factor: 1.15, nombre: 'Grande', muestra: 20 },
  { factor: 1.3, nombre: 'Muy grande', muestra: 24 },
];

/**
 * 7.3 Ajustes y accesibilidad.
 *
 * La aplicacion tiene que servir a personas con distintos niveles de
 * alfabetizacion digital y de vision, asi que estos ajustes no son un extra:
 * son parte de lo que la hace usable.
 */
export default function Ajustes() {
  const volver = crearVolver('/perfil');
  const preferencias = usarPreferencias();
  const { cerrarSesion } = usarSesion();
  const [resumenSemanal, setResumenSemanal] = useState(false);
  const [mostrarVinculo, setMostrarVinculo] = useState(true);

  // Cierra la sesion guardada en el telefono y no solo vuelve a la bienvenida.
  // En un telefono prestado, que es algo que aparecio en terreno, volver sin
  // cerrar dejaria la cuenta abierta para el siguiente.
  async function salir() {
    await cerrarSesion();
    router.replace('/');
  }

  return (
    <Pantalla>
      <Encabezado titulo="Ajustes" onVolver={volver} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingTop: espacio.normal,
          paddingBottom: espacio.bloque,
          gap: espacio.seccion,
        }}
      >
        <Columna separacion={espacio.comodo}>
          <Texto
            tamano={13}
            peso="fuerte"
            color={colores.grisTexto}
            espaciado={0.6}
            style={{ paddingHorizontal: espacio.apretado }}
          >
            LECTURA Y ACCESIBILIDAD
          </Texto>

          <Tarjeta relleno={espacio.amplio} separacion={espacio.medio}>
            <Texto tamano={16.5} peso="fuerte">
              Tamaño de la letra
            </Texto>
            <Fila separacion={espacio.normal} alinear="stretch">
              {tamanosDeLetra.map((opcion) => {
                const elegido = preferencias.factorTexto === opcion.factor;
                return (
                  <Presionable
                    key={opcion.nombre}
                    onPress={() => preferencias.cambiar('factorTexto', opcion.factor)}
                    vibrar
                    accessibilityRole="radio"
                    accessibilityState={{ checked: elegido }}
                    accessibilityLabel={`Tamaño de letra ${opcion.nombre}`}
                    style={{
                      flex: 1,
                      minHeight: 76,
                      borderRadius: radio.boton,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: espacio.apretado,
                      ...(elegido
                        ? { backgroundColor: colores.menta, borderWidth: 2, borderColor: colores.verde }
                        : { borderWidth: 1.5, borderColor: colores.borde }),
                    }}
                  >
                    {/* La muestra no escala con la preferencia a proposito: es
                        la comparacion entre los tres tamanos. */}
                    <Texto tamano={opcion.muestra / preferencias.factorTexto} peso="fuerte">
                      Aa
                    </Texto>
                    <Texto tamano={13} color={elegido ? colores.verde : colores.grisTexto}>
                      {opcion.nombre}
                    </Texto>
                  </Presionable>
                );
              })}
            </Fila>
            <Texto tamano={14} color={colores.grisTexto}>
              Así se verán los textos de la aplicación.
            </Texto>
          </Tarjeta>

          <ListaAgrupada>
            <FilaDeLista
              titulo="Alto contraste"
              detalle="Bordes y textos más marcados"
              onPress={() => preferencias.cambiar('altoContraste', !preferencias.altoContraste)}
              control={
                <Interruptor
                  activo={preferencias.altoContraste}
                  onCambiar={(valor) => preferencias.cambiar('altoContraste', valor)}
                  accesibilidad="Alto contraste"
                />
              }
            />
            <FilaDeLista
              titulo="Reducir animaciones"
              ultima
              onPress={() =>
                preferencias.cambiar('menosAnimaciones', !preferencias.menosAnimaciones)
              }
              control={
                <Interruptor
                  activo={preferencias.menosAnimaciones}
                  onCambiar={(valor) => preferencias.cambiar('menosAnimaciones', valor)}
                  accesibilidad="Reducir animaciones"
                />
              }
            />
          </ListaAgrupada>
        </Columna>

        <ListaAgrupada encabezado="AVISOS">
          <FilaDeLista
            titulo="Cuando mis reportes avancen"
            control={
              <Interruptor
                activo={preferencias.avisarCambioDeEstado}
                onCambiar={(valor) => preferencias.cambiar('avisarCambioDeEstado', valor)}
                accesibilidad="Avisos de avance de reportes"
              />
            }
          />
          <FilaDeLista
            titulo="Apoyo a mis propuestas"
            control={
              <Interruptor
                activo
                onCambiar={() => undefined}
                accesibilidad="Avisos de apoyo a mis propuestas"
              />
            }
          />
          <FilaDeLista
            titulo="Actividades nuevas en el barrio"
            control={
              <Interruptor
                activo={preferencias.avisarActividades}
                onCambiar={(valor) => preferencias.cambiar('avisarActividades', valor)}
                accesibilidad="Avisos de actividades nuevas"
              />
            }
          />
          <FilaDeLista
            titulo="Resumen semanal por correo"
            detalle="Los domingos"
            ultima
            control={
              <Interruptor
                activo={resumenSemanal}
                onCambiar={setResumenSemanal}
                accesibilidad="Resumen semanal por correo"
              />
            }
          />
        </ListaAgrupada>

        <ListaAgrupada encabezado="PRIVACIDAD">
          <FilaDeLista
            titulo="Mostrar mi vínculo con el barrio"
            detalle="Ej. «Vive en el barrio»"
            control={
              <Interruptor
                activo={mostrarVinculo}
                onCambiar={setMostrarVinculo}
                accesibilidad="Mostrar mi vínculo con el barrio"
              />
            }
          />
          <FilaDeLista
            titulo="Partir en anónimo al reportar"
            detalle="Lo decides en cada reporte, antes de publicarlo"
            control={
              <Interruptor
                activo={preferencias.proponerAnonimo}
                onCambiar={(activo) => preferencias.cambiar('proponerAnonimo', activo)}
                accesibilidad="Partir en anónimo al reportar"
              />
            }
          />
          <FilaDeLista
            titulo="Descargar mis datos"
            conFlecha
            adorno={<Icono nombre="descargar" tamano={22} color={colores.grisTexto} />}
          />
          <FilaDeLista titulo="Eliminar mi cuenta" ultima peligrosa conFlecha />
        </ListaAgrupada>

        <ListaAgrupada encabezado="AYUDA">
          <FilaDeLista titulo="Cómo funciona la app" conFlecha />
          <FilaDeLista titulo="Normas de convivencia" conFlecha />
          <FilaDeLista
            titulo="Sobre República Circular"
            conFlecha
            onPress={() => router.push('/observatorio')}
          />
          <FilaDeLista
            titulo="Sistema visual"
            detalle="Colores, tipografía y reglas de accesibilidad"
            ultima
            conFlecha
            onPress={() => router.push('/sistema')}
          />
        </ListaAgrupada>

        <View>
          <FilaDeLista titulo="Cerrar sesión" ultima onPress={() => void salir()} />
        </View>
      </ScrollView>
    </Pantalla>
  );
}
