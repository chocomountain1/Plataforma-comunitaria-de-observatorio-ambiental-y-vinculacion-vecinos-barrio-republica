import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { Avatar, Encabezado } from '@/componentes/app';
import {
  BarraInferior,
  Boton,
  BotonCircular,
  CampoTexto,
  Casilla,
  Chip,
  Columna,
  Contador,
  Fila,
  Icono,
  Pantalla,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { tiposDeActividad } from '@/datos/actividades';
import { personas } from '@/datos/personas';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 6.4 Crear actividad.
 *
 * Es la herramienta de quien organiza. Permite enganchar la actividad con la
 * propuesta que la origino y avisar a quienes la apoyaron, que es como se cierra
 * el ciclo entre deliberar y hacer.
 */
export default function CrearActividad() {
  const volver = crearVolver('/actividades');
  const { propuestas, publicarActividad } = usarBarrio();

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<string>('Jornada de trabajo');
  const [dia, setDia] = useState('14');
  const [hora, setHora] = useState('10:00');
  const [lugar, setLugar] = useState('Toesca con Av. Ejército');
  const [buscaVoluntarios, setBuscaVoluntarios] = useState(true);
  const [cuantos, setCuantos] = useState(15);
  const [tareas, setTareas] = useState<string[]>(['Llevar herramientas', 'Regar']);
  const [propuestaDeOrigen, setPropuestaDeOrigen] = useState<string | null>('huerta-toesca');
  const [avisarApoyos, setAvisarApoyos] = useState(true);
  const [crearAfiche, setCrearAfiche] = useState(false);

  const propuestaElegida = propuestas.find((propuesta) => propuesta.id === propuestaDeOrigen);

  function publicar() {
    const id = publicarActividad({
      titulo,
      tipo,
      dia: Number(dia),
      mes: 'NOV',
      diaSemana: 'SÁB',
      hora,
      lugar,
      voluntariosNecesarios: buscaVoluntarios ? cuantos : 0,
      tareas: buscaVoluntarios ? tareas : [],
      naceDePropuesta: propuestaDeOrigen ?? undefined,
    });
    router.dismissTo(`/actividades/${id}`);
  }

  return (
    <Pantalla>
      <Encabezado
        titulo="Nueva actividad"
        tamanoDeTitulo={26}
        accion={<BotonCircular icono="cerrar" accesibilidad="Cancelar" onPress={volver} />}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: espacio.seccion,
            paddingTop: espacio.normal,
            paddingBottom: espacio.seccion,
            gap: espacio.amplio,
          }}
        >
          <Fila separacion={espacio.medio}>
            <Avatar persona={personas.republicaCircular} tamano={40} />
            <Texto tamano={15} color={colores.grisTexto} style={{ flex: 1 }}>
              {`Publicas como ${personas.republicaCircular.nombre}`}
            </Texto>
          </Fila>

          <CampoTexto
            etiqueta="Nombre"
            valor={titulo}
            onCambiar={setTitulo}
            marcaDeAgua="Ej. recuperemos la platabanda de Toesca"
          />

          <Columna separacion={espacio.normal}>
            <Texto tamano={16} peso="fuerte">
              Tipo
            </Texto>
            <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
              {tiposDeActividad.map((opcion) => (
                <Chip
                  key={opcion}
                  texto={opcion}
                  activo={tipo === opcion}
                  onPress={() => setTipo(opcion)}
                  alto={42}
                  variante="marcado"
                />
              ))}
            </Fila>
          </Columna>

          <Fila separacion={espacio.medio} alinear="flex-start">
            <View style={{ flex: 1 }}>
              <CampoTexto etiqueta="Día" valor={dia} onCambiar={setDia} />
            </View>
            <View style={{ flex: 1 }}>
              <CampoTexto etiqueta="Hora" valor={hora} onCambiar={setHora} />
            </View>
          </Fila>

          <CampoTexto etiqueta="Lugar" valor={lugar} onCambiar={setLugar} />

          <Tarjeta>
            <Casilla activa={buscaVoluntarios} onPress={() => setBuscaVoluntarios(!buscaVoluntarios)}>
              <Texto tamano={16.5} peso="fuerte">
                Busco voluntarios
              </Texto>
            </Casilla>

            {buscaVoluntarios ? (
              <>
                <Fila repartir="space-between" separacion={espacio.medio}>
                  <Texto tamano={16}>¿Cuántos?</Texto>
                  <Contador
                    valor={cuantos}
                    onCambiar={setCuantos}
                    minimo={1}
                    accesibilidad="voluntarios"
                  />
                </Fila>

                <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
                  {tareas.map((cual) => (
                    <Chip key={cual} texto={cual} activo variante="marcado" alto={38} />
                  ))}
                  <Presionable
                    onPress={() => setTareas([...tareas, `Tarea ${tareas.length + 1}`])}
                    accessibilityRole="button"
                    accessibilityLabel="Agregar tarea"
                    style={{
                      height: 38,
                      paddingHorizontal: espacio.medio,
                      borderRadius: radio.redondo,
                      borderWidth: 1.5,
                      borderColor: colores.bordeFuerte,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: espacio.apretado,
                    }}
                  >
                    <Icono nombre="mas" tamano={16} color={colores.tinta} />
                    <Texto tamano={14}>Tarea</Texto>
                  </Presionable>
                </Fila>
              </>
            ) : null}
          </Tarjeta>

          {propuestaElegida === undefined ? null : (
            <Tarjeta>
              <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.5}>
                NACE DE LA PROPUESTA
              </Texto>
              <Fila separacion={espacio.medio}>
                <Icono nombre="idea" tamano={24} color={colores.ocre} />
                <Texto tamano={16} peso="fuerte" style={{ flex: 1 }}>
                  {propuestaElegida.titulo}
                </Texto>
                <Presionable
                  onPress={() => setPropuestaDeOrigen(null)}
                  accessibilityRole="button"
                  accessibilityLabel="Quitar la propuesta de origen"
                  style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icono nombre="cerrar" tamano={20} color={colores.grisTexto} />
                </Presionable>
              </Fila>
              <Casilla activa={avisarApoyos} onPress={() => setAvisarApoyos(!avisarApoyos)}>
                <Texto tamano={15.5} interlineado={1.35}>
                  Avisar a quienes apoyaron la propuesta
                </Texto>
              </Casilla>
            </Tarjeta>
          )}

          <Tarjeta>
            <Casilla activa={crearAfiche} onPress={() => setCrearAfiche(!crearAfiche)}>
              <Columna separacion={espacio.minimo}>
                <Texto tamano={16.5} peso="fuerte">
                  Crear afiche con código QR
                </Texto>
                <Texto tamano={13.5} color={colores.grisTexto}>
                  Para imprimir y pegar en el barrio
                </Texto>
              </Columna>
            </Casilla>
          </Tarjeta>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior>
        <Boton
          texto="Publicar actividad"
          alto={56}
          tamanoDeTexto={18}
          deshabilitado={titulo.trim().length === 0}
          onPress={publicar}
          vibrar
        />
      </BarraInferior>
    </Pantalla>
  );
}
