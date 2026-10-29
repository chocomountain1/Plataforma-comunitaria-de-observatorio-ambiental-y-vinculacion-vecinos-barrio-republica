"""Regenera el capítulo 17 de DOCUMENTACION-COMPLETA.md: el código fuente.

Los capítulos 1 a 16 están escritos a mano y no los toca este script. El 17 sí
se genera, porque transcribir 97 archivos a mano garantiza que alguno quede
desactualizado o fuera.

Uso, desde la raíz del proyecto:

    python herramientas/generar-codigo-fuente.py

Escribe `herramientas/capitulo-17.md`, que después se pega al final del
documento reemplazando el capítulo 17 anterior.

El orden de los archivos es el mismo en que conviene crearlos al reconstruir el
proyecto: primero la configuración y después cada capa, de la más profunda a la
más superficial. Si se agrega un archivo al proyecto y no se agrega aquí, el
script falla a propósito en vez de generar un documento incompleto.
"""

import io
import os

SECCIONES = [
    ('17.1 Configuración del proyecto', [
        ('package.json', 'Dependencias, scripts y punto de entrada.'),
        ('app.json', 'Configuración de Expo: nombre, esquema, complementos y permisos.'),
        ('babel.config.js', 'Preset de Expo más el plugin de worklets de Reanimated.'),
        ('tsconfig.json', 'TypeScript estricto con el alias @/* hacia src.'),
    ]),
    ('17.2 Tokens de diseño · src/diseno', [
        ('src/diseno/colores.ts', 'La paleta completa. No importa nada del proyecto.'),
        ('src/diseno/tipografia.ts', 'Las dos familias, los archivos de fuente y la escala de texto.'),
        ('src/diseno/medidas.ts', 'Espacios, radios, alturas tocables y las cuatro sombras.'),
        ('src/diseno/iconos.ts', 'Los 51 íconos como datos, extraídos de los mockups.'),
    ]),
    ('17.3 Dominio · src/dominio', [
        ('src/dominio/categorias.ts', 'Las ocho categorías de reporte con su color e ícono.'),
        ('src/dominio/estados.ts', 'Los cuatro estados del reporte y las cinco etapas de una propuesta.'),
        ('src/dominio/tipos.ts', 'Todos los tipos del modelo de datos.'),
    ]),
    ('17.4 Datos de ejemplo · src/datos', [
        ('src/datos/personas.ts', 'Las siete personas y organizaciones del prototipo.'),
        ('src/datos/reportes.ts', 'Los nueve reportes, con su seguimiento y sus comentarios.'),
        ('src/datos/propuestas.ts', 'Las tres propuestas y los catálogos de ejes, apoyos y disciplinas.'),
        ('src/datos/actividades.ts', 'Las tres actividades y sus catálogos.'),
        ('src/datos/avisos.ts', 'Los cinco avisos de la bandeja.'),
        ('src/datos/catastro.ts', 'Las doce capas del mapa y la ficha de platabanda.'),
        ('src/datos/perfil.ts', 'Logros, vínculos con el barrio e intereses del mapa.'),
        ('src/datos/observatorio.ts', 'Las cifras del diagnóstico 2022 y los tres desafíos.'),
    ]),
    ('17.5 Estado · src/estado', [
        ('src/estado/barrio.tsx', 'Contenido compartido y todas las acciones que lo modifican.'),
        ('src/estado/borradores.tsx', 'Lo que la persona lleva escrito en los flujos de varios pasos.'),
        ('src/estado/preferencias.tsx', 'Lectura y accesibilidad, persistidas en el teléfono.'),
    ]),
    ('17.6 Utilidades · src/utiles', [
        ('src/utiles/navegacion.ts', 'Retroceso seguro cuando no hay historia.'),
        ('src/utiles/texto.ts', 'Singular y plural.'),
    ]),
    ('17.7 Componentes base · src/componentes/base', [
        ('src/componentes/base/index.ts', 'Punto único de entrada.'),
        ('src/componentes/base/Texto.tsx', 'Todo el texto de la aplicación pasa por aquí.'),
        ('src/componentes/base/Icono.tsx', 'Dibuja cualquiera de los 51 íconos.'),
        ('src/componentes/base/Presionable.tsx', 'Área tocable con reacción breve al tacto.'),
        ('src/componentes/base/Disposicion.tsx', 'Fila y Columna.'),
        ('src/componentes/base/Boton.tsx', 'Seis variantes de botón.'),
        ('src/componentes/base/BotonCircular.tsx', 'El botón redondo de 44 px de las cabeceras.'),
        ('src/componentes/base/Tarjeta.tsx', 'Contenedor de contenido, cuatro tonos.'),
        ('src/componentes/base/Chip.tsx', 'Filtro en pastilla y carril horizontal de chips.'),
        ('src/componentes/base/Etiqueta.tsx', 'Píldora de estado.'),
        ('src/componentes/base/CampoTexto.tsx', 'Campo de escritura.'),
        ('src/componentes/base/Opcion.tsx', 'Fila seleccionable y casilla suelta.'),
        ('src/componentes/base/Interruptor.tsx', 'Switch dibujado a mano.'),
        ('src/componentes/base/Contador.tsx', 'Contador de menos y más.'),
        ('src/componentes/base/Lista.tsx', 'Lista agrupada, fila de lista y sigla.'),
        ('src/componentes/base/Aviso.tsx', 'Nota breve, cuatro tonos.'),
        ('src/componentes/base/BarraDePasos.tsx', 'Barra de avance por tramos.'),
        ('src/componentes/base/BarraInferior.tsx', 'Barra fija con la acción principal.'),
        ('src/componentes/base/EncabezadoDePaso.tsx', 'Cabecera de los flujos de varios pasos.'),
        ('src/componentes/base/Pantalla.tsx', 'Marco de cada pantalla con márgenes seguros.'),
    ]),
    ('17.8 Componentes de aplicación · src/componentes/app', [
        ('src/componentes/app/index.ts', 'Punto único de entrada.'),
        ('src/componentes/app/Avatar.tsx', 'Círculo con la inicial de la persona.'),
        ('src/componentes/app/Encabezado.tsx', 'Volver, título y acción.'),
        ('src/componentes/app/BarraNavegacion.tsx', 'La barra de cinco destinos con el botón central.'),
        ('src/componentes/app/MarcaDeCategoria.tsx', 'Marca, rótulo y chip de categoría.'),
        ('src/componentes/app/EtiquetasDeDominio.tsx', 'Píldoras de estado y de etapa.'),
        ('src/componentes/app/TarjetaReporte.tsx', 'Barra de estado y las dos tarjetas de reporte.'),
        ('src/componentes/app/TarjetaPropuesta.tsx', 'Tarjeta y fila de propuesta.'),
        ('src/componentes/app/TarjetaActividad.tsx', 'Cuadro de fecha, tarjeta y fila de actividad.'),
        ('src/componentes/app/LineaDeTiempo.tsx', 'El recorrido de un reporte.'),
        ('src/componentes/app/MapaBarrio.tsx', 'El plano del barrio dibujado en SVG.'),
        ('src/componentes/app/MarcadorMapa.tsx', 'Chincheta, grupo y mi ubicación.'),
        ('src/componentes/app/FotoSimulada.tsx', 'Trama diagonal que reemplaza a las fotos.'),
    ]),
    ('17.9 Disposiciones · app', [
        ('app/_layout.tsx', 'Raíz: tipografías, proveedores y la pila principal.'),
        ('app/(barrio)/_layout.tsx', 'Las cinco pestañas con barra propia.'),
        ('app/reportar/_layout.tsx', 'La pila del asistente de reporte.'),
    ]),
    ('17.10 Pantallas de ingreso', [
        ('app/index.tsx', '1.1 Bienvenida.'),
        ('app/ingreso/vinculo.tsx', '1.2 Vínculo con el barrio.'),
        ('app/ingreso/intereses.tsx', '1.3 Qué quiero ver en el mapa.'),
        ('app/ingreso/cuenta.tsx', '1.4 Perfil opcional sin contraseña.'),
    ]),
    ('17.11 Pestañas e inicio', [
        ('app/(barrio)/inicio.tsx', '2.1 Inicio (feed).'),
        ('app/(barrio)/mapa.tsx', '2.2 Mapa del barrio.'),
        ('app/(barrio)/reportar.tsx', 'Redirección del destino central.'),
        ('app/(barrio)/mis-reportes.tsx', '4.1 Mis reportes.'),
        ('app/(barrio)/avisos.tsx', '7.1 Avisos.'),
    ]),
    ('17.12 Mapa', [
        ('app/mapa/capas.tsx', '2.3 Capas del mapa.'),
        ('app/mapa/ficha.tsx', '2.4 Ficha del catastro.'),
    ]),
    ('17.13 Asistente de reporte', [
        ('app/reportar/categoria.tsx', '3.1 Qué pasa.'),
        ('app/reportar/foto.tsx', '3.2 Foto.'),
        ('app/reportar/ubicacion.tsx', '3.3 Dónde.'),
        ('app/reportar/duplicado.tsx', '3.4 Posible duplicado.'),
        ('app/reportar/detalles.tsx', '3.5 Detalles.'),
        ('app/reportar/revisar.tsx', '3.6 Revisar y enviar.'),
        ('app/reportar/enviado.tsx', '3.7 Reporte enviado.'),
        ('app/reportes/[id].tsx', '4.2 Detalle y 4.3 Reporte resuelto.'),
    ]),
    ('17.14 Propuestas', [
        ('app/propuestas/index.tsx', '5.1 Propuestas del barrio.'),
        ('app/propuestas/nueva/idea.tsx', '5.2 Nueva propuesta, idea.'),
        ('app/propuestas/nueva/necesita.tsx', '5.3 Nueva propuesta, qué se necesita.'),
        ('app/propuestas/nueva/revisar.tsx', 'Paso 3, vista previa antes de publicar.'),
        ('app/propuestas/[id]/index.tsx', '5.4 Detalle de propuesta.'),
        ('app/propuestas/[id]/conversacion.tsx', '5.5 Conversación.'),
    ]),
    ('17.15 Actividades', [
        ('app/actividades/index.tsx', '6.1 Actividades.'),
        ('app/actividades/[id].tsx', '6.2 Detalle de actividad.'),
        ('app/actividades/inscripcion.tsx', '6.3 Inscripción lista.'),
        ('app/actividades/crear.tsx', '6.4 Crear actividad.'),
    ]),
    ('17.16 Perfil y ajustes', [
        ('app/perfil/index.tsx', '7.2 Perfil y logros.'),
        ('app/perfil/ajustes.tsx', '7.3 Ajustes y accesibilidad.'),
        ('app/sistema.tsx', '0 Sistema visual.'),
    ]),
    ('17.17 Instituciones y observatorio', [
        ('app/instituciones/desafios.tsx', '8.1 Desafíos para instituciones.'),
        ('app/instituciones/interes.tsx', '8.2 Mostrar interés.'),
        ('app/observatorio.tsx', '8.3 Observatorio del barrio.'),
    ]),
    ('17.18 Gestión y moderación', [
        ('app/gestion/panel.tsx', '9.1 Panel de gestión.'),
        ('app/gestion/moderar/[id].tsx', '9.2 Revisión de reporte.'),
    ]),
]

LENGUAJE = {'.ts': 'ts', '.tsx': 'tsx', '.json': 'json', '.js': 'js'}

ENCABEZADO = """## 17. Código fuente completo

Los 97 archivos del proyecto, íntegros y sin recortes, en el orden en que
conviene crearlos: primero la configuración, después cada capa de `src` y al
final las pantallas. Esta es la fuente de verdad definitiva del documento.
"""


def buscar_archivos_del_proyecto() -> set[str]:
    """Todos los .ts y .tsx de app y src, más los cuatro de configuración."""
    encontrados = {'package.json', 'app.json', 'babel.config.js', 'tsconfig.json'}
    for carpeta in ('app', 'src'):
        for base, _, nombres in os.walk(carpeta):
            for nombre in nombres:
                if nombre.endswith(('.ts', '.tsx')):
                    ruta = os.path.join(base, nombre).replace(os.sep, '/')
                    encontrados.add(ruta)
    return encontrados


def main() -> None:
    partes = [ENCABEZADO]
    incluidos: set[str] = set()

    for titulo, archivos in SECCIONES:
        partes.append(f'\n### {titulo}\n')
        for ruta, descripcion in archivos:
            contenido = io.open(ruta, encoding='utf-8').read().rstrip('\n')
            lenguaje = LENGUAJE[os.path.splitext(ruta)[1]]
            lineas = contenido.count('\n') + 1
            partes.append(f'\n#### `{ruta}`\n')
            partes.append(f'\n{descripcion} ({lineas} líneas)\n')
            partes.append(f'\n```{lenguaje}\n{contenido}\n```\n')
            incluidos.add(ruta)

    faltantes = sorted(buscar_archivos_del_proyecto() - incluidos)
    if faltantes:
        raise SystemExit(
            'Estos archivos existen en el proyecto y no están en el documento. '
            'Agrégalos a SECCIONES: ' + ', '.join(faltantes)
        )

    os.makedirs('herramientas', exist_ok=True)
    io.open('herramientas/capitulo-17.md', 'w', encoding='utf-8').write(''.join(partes))
    print(f'Capítulo 17 generado con {len(incluidos)} archivos.')


main()
