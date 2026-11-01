# Modelo de datos de los reportes

Traducción del tipo `Reporte` de `src/dominio/tipos.ts` a PostgreSQL con
PostGIS, para Supabase. Las ocho categorías y los cuatro estados son los mismos
del catastro 2022 que ya usa el prototipo, declarados como tipos enumerados.

## Estado

**Las dieciséis migraciones están aplicadas** en el proyecto `barrio-republica` de
Supabase, región São Paulo, con PostGIS 3.3.7. Las capas prioritarias del
catastro están cargadas: 903 elementos. El ingreso con cuenta funciona, y con
él la aplicación lee y escribe de verdad contra este esquema.

La numeración salta de la 0009 a la 0011 y conviene saber por qué: la 0010
abría la lectura del catastro al rol anónimo y **se descartó**, para no relajar
la decisión de cuenta obligatoria. No quedó sin aplicar, quedó eliminada.

## Cómo aplicarlas

Las migraciones están en `migraciones/`, numeradas y pensadas para correrse en
orden, desde cero y en este orden. La forma de aplicarlas es pegar cada archivo
en el editor SQL del panel, o conectarse con `psql`.

```
psql "$CADENA_DE_CONEXION" -f migraciones/0001_extensiones_y_taxonomias.sql
psql "$CADENA_DE_CONEXION" -f migraciones/0002_personas.sql
...
```

Si más adelante el equipo adopta la herramienta de línea de comandos de
Supabase, estos archivos se mudan a `supabase/migrations/`, que es la ruta que
esa herramienta espera. Quedaron acá porque el proyecto nombra todo en español
y porque hoy se aplican a mano.

### Qué está aplicado en una base

La tabla `migraciones_aplicadas` lleva una fila por archivo aplicado, con su
fecha. Para saber qué le falta a una base, basta compararla con el contenido de
`migraciones/`:

```sql
select archivo, aplicada_en from migraciones_aplicadas order by archivo;
```

La escribe cada migración al final de sí misma, con
`select registrar_migracion('00XX_nombre.sql');`. No hay ningún proceso que la
mantenga, así que **lo único que hay que recordar al escribir una migración
nueva es cerrarla con esa línea**.

La tabla no tiene permisos otorgados al cliente y tiene RLS activo, de modo que
solo la ve quien administra la base. Escribirla tampoco se puede desde fuera,
aunque eso recién es cierto desde la migración 0016: hasta entonces
`registrar_migracion` estaba abierta y cualquiera con la clave podía agregarle
filas. Volver a aplicar una migración actualiza la fecha en vez de fallar,
porque los archivos están escritos para poder correrse de nuevo.

## Las tres decisiones que no son una traducción mecánica

### La posición pasa a ser geografía

`posicion: {x, y}` eran píxeles para dibujar sobre un plano. Ahora es
`geography(point, 4326)` con índice GiST.

No es cosmético. La aplicación pregunta qué hay cerca de una esquina y qué cae
dentro de una manzana, y eso son consultas espaciales. Traerse todo a memoria y
filtrar aguanta los dos mil registros del catastro y deja de funcionar apenas
los vecinos empiecen a reportar.

La misma decisión obligó a cambiar el mapa de la aplicación: el plano dibujado
en SVG no podía producir coordenadas reales, así que se reemplazó por
OpenStreetMap.

### La fecha pasa a ser fecha

`publicado: string` guardaba texto como lo muestran los mockups. Ahora es
`timestamptz`.

El mecanismo de priorización aplica decaimiento exponencial con vida media de
30 días, lo que exige restar fechas. La función `peso_por_antiguedad` está en
`0005_funciones.sql` y existe justamente para que la razón quede escrita al
lado del dato. El formato legible, «hace 4 d», se calcula al mostrar.

Lo mismo aplica a `cuando` en los comentarios, que pasó a `publicado_en`, y a
`fecha` en el seguimiento, que pasó a `ocurrio_en`.

### El anonimato deja de ser la ausencia de autor

Hasta el 19 de octubre un reporte anónimo se representaba con `autor: null`. La
contraparte objetó el acceso sin cuenta porque permitía crear varias identidades
e inflar la priorización, y porque trabaja contra el sentido de pertenencia.

Ahora el autor siempre existe y hay una columna `anonimo`. Eso crea un problema
que no existía antes: **el dato está y hay que impedir activamente que salga.**

Las políticas de fila de Postgres controlan filas, no columnas, así que no hay
forma de esconder la columna del autor con una política. La solución tiene tres
piezas:

1. El cliente no tiene permiso de lectura sobre la tabla `reportes`, salvo la
   columna del identificador, que hace falta para que un `update ... where id`
   pueda ejecutarse.
2. Toda lectura pasa por la vista `reportes_publicos`, que entrega
   `case when anonimo then null else autor end` y lo mismo con el seudónimo, el
   vínculo y la marca de organización.
3. La vista corre con los permisos de su dueño y lleva `security_barrier`, para
   que un filtro astuto no pueda colarse por debajo del enmascaramiento.

La vista también entrega `es_mio`, comparando el autor con `auth.uid()`. Saber
que un reporte anónimo es propio no revela nada a nadie más, y de paso resuelve
el campo `esMio` del prototipo sin guardarlo.

## Lo que no se guarda

| Campo del prototipo | Qué se hizo |
|---|---|
| `esMio` | Lo calcula la vista comparando el autor con la sesión |
| `inicial` de Persona | Se deriva del seudónimo al dibujar el avatar |
| `resumen` | No se guarda. Es una frase derivada de categoría, dirección y antigüedad, y guardarla obligaría a reescribirla en cada cambio de estado |
| `ocurrio` del seguimiento | Se deriva de si `ocurrio_en` tiene valor |
| `confirmaciones` | Se cuenta desde `confirmaciones_de_reporte` |
| `senalamientos` | Se cuenta desde `senalamientos_de_reporte` |

Los dos últimos dejaron de ser números por una razón concreta: con un contador
no hay forma de saber si alguien ya confirmó, y la regla dice que no se puede
confirmar dos veces.

## Las reglas de negocio, y dónde quedó cada una

| Regla | Dónde vive |
|---|---|
| Tres vecinos distintos pasan un reporte a verificado | Disparador `revisar_estado` sobre la tabla de confirmaciones |
| Una persona no puede confirmar dos veces | Llave primaria `(reporte, persona)` |
| Una persona no puede confirmar su propio reporte | Restricción `nadie_confirma_lo_propio`, sostenida por una llave foránea compuesta |
| Un vecino puede señalar un reporte como inexistente | Tabla `senalamientos_de_reporte` |
| Un reporte resuelto sale de la priorización | Documentado en `peso_por_antiguedad`, se aplica al consultar |

La regla de no confirmar lo propio se resolvió sin disparador. La tabla de
confirmaciones lleva una copia del autor del reporte, amarrada con
`foreign key (reporte, autor_del_reporte) references reportes (id, autor)`, y
sobre esa copia hay un `check (persona <> autor_del_reporte)`. Es más código que
un disparador, pero no se puede saltar ni escribiendo directo en la tabla, y no
necesita mantención.

## Tablas

| Tabla | Para qué |
|---|---|
| `personas` | Perfil público. Seudónimo, nunca nombre real ni RUT |
| `gestores_territoriales` | Quién puede mover reportes por el ciclo |
| `reportes` | El reporte |
| `confirmaciones_de_reporte` | Una fila por vecino que confirma |
| `senalamientos_de_reporte` | Una fila por vecino que lo marca inexistente |
| `eventos_de_seguimiento` | Los cuatro pasos, los ocurridos y los que faltan |
| `comentarios` | Conversación sobre el reporte, con hilos |
| `utiles_de_comentario` | Una fila por persona que marca útil |
| `capas_del_catastro` | Las 31 capas del diagnóstico 2022 |
| `elementos_del_catastro` | 903 elementos de ocho capas, de los 2.032 del diagnóstico. Ver `carga/` |
| `revisiones_del_catastro` | Lo que un vecino responde sobre el estado de hoy |

## Cuatro cosas que solo aparecieron al aplicarlo

El esquema escrito se veía correcto y no funcionaba. Las dos primeras fallas
son la misma: el cliente solo puede leer `reportes.id`, que es lo que impide
filtrar al autor de un reporte anónimo, y eso rompía todo lo que necesitara
leer otra columna de esa tabla.

| Qué fallaba | Por qué | Cómo se resolvió |
|---|---|---|
| `confirmar_reporte` | Copia `reportes.autor` a la tabla de confirmaciones | Pasa a `security definer`. No abre un hueco: quien confirma lo fija la función con `auth.uid()`, y las dos reglas son restricciones de la tabla |
| Leer el seguimiento y los comentarios | Sus políticas miraban `reportes.oculto` con una subconsulta, que corre con los permisos de quien consulta | Se encapsula en `reporte_visible()`, que corre como dueña |
| Leer y crear el propio perfil | `personas` tenía políticas pero ningún permiso otorgado, y hacen falta los dos: el permiso dice si puedes tocar la tabla y la política dice cuáles filas | `grant select, insert, update on personas to authenticated`, en la migración 0011 |
| Subir una fotografía | La aplicación sube con `upsert`, que PostgREST traduce a un `insert ... on conflict do update`, y Postgres exige permiso de actualización aunque la fila no exista y aunque el conflicto nunca ocurra | `grant update` más la política de reemplazo, en la migración 0013 |

La salida fácil en los dos primeros casos era abrir la columna del autor, que
es exactamente lo que el modelo no puede hacer. El mismo patrón se repitió
después en `reporte_es_mio()`, para las fotos.

Los dos últimos son de otra familia y valen anotarse aparte. No se vieron al
escribir el esquema ni al probarlo con sesiones simuladas, sino en el primer
ingreso real y en la primera subida real, porque hasta entonces nadie había
tenido cuenta. Una política sin permiso no avisa que está incompleta: la base
responde `permission denied` sin llegar a mirarla, que es un mensaje que manda
a buscar justo donde no está el problema.

La regla operativa que queda: **cada tabla con políticas tiene que tener
otorgados los verbos que el cliente realmente usa, y `upsert` cuenta como
dos.** El caso inverso también existía y se corrigió en la migración 0012:
`gestores_territoriales` tenía una política que no podía aplicarse nunca,
porque la tabla no tiene ningún permiso otorgado al cliente y así debe
quedarse. Sacarla deja la tabla más cerrada, no menos, porque con RLS activo y
sin ninguna política Postgres niega todo lo que no venga de la dueña.

## La quinta, que no apareció sola

Las cuatro anteriores se delataron porque algo dejaba de funcionar. Esta no
rompía nada, y por eso estuvo dos días en pie sin que nadie la notara.

**Postgres concede la ejecución de cada función recién creada a `PUBLIC`.** Los
`grant execute ... to authenticated` repartidos por las migraciones no le
quitaban nada al rol anónimo: declaraban una intención que la base nunca llegó
a aplicar. La migración 0004 dejó escrito que el rol anónimo no recibe nada, y
para las tablas era cierto, porque ahí sí hay un `revoke all`.

Comprobado el 1 de noviembre llamando a la API con la clave publicable y sin
sesión abierta:

| Función | Qué devolvía sin cuenta |
|---|---|
| `reportes_cerca` | **Los reportes completos**, con el identificador de quien publicó los que no son anónimos. Es `security definer`, así que corría como dueña y el permiso de la tabla no la frenaba |
| `registrar_migracion` | **Escribía una fila.** También `security definer`, y sin validar nada |
| `es_gestor`, `reporte_visible` | `false`. Inofensivo, pero no debería contestar |
| Las demás | `permission denied`, por el permiso de la tabla que leen |

La primera es grave de verdad: contradice en los hechos la decisión de cuenta
obligatoria del 19 de octubre, que es la misma que llevó a descartar la
migración 0010. Las que fallaban por el permiso de la tabla no estaban bien,
estaban afortunadas: las defendía la segunda línea porque la primera no
existía.

La migración 0016 revoca la ejecución a `PUBLIC` en las diez funciones con
nombre y le da a `es_gestor` el permiso propio que hasta entonces no
necesitaba. Las tres funciones de disparador quedan como están, porque
PostgREST no expone lo que devuelve `trigger`.

**La regla que queda: una función nueva nace abierta.** Mientras se apliquen a
mano, cada migración que cree una función tiene que decir explícitamente quién
la ejecuta, y la forma de comprobarlo no es leer el archivo sino llamarla desde
fuera sin sesión.

## El catastro queda detrás de la cuenta

Se evaluó abrir la lectura de las capas del catastro al rol anónimo,
apoyándose en la minuta del 14 de octubre, que acordó que los contenidos
públicos se puedan ver y compartir sin tener la aplicación. Los datos del
diagnóstico son públicos y no tienen personas identificables.

**El equipo decidió no hacerlo**, para no relajar la decisión del 19 de
octubre de cuenta obligatoria. La consecuencia práctica es que el mapa no
muestra las capas hasta que exista el ingreso por correo, aunque los 903
elementos ya estén cargados y la consulta espacial funcione.

## Lo que falta

- **Un remitente que le escriba a cualquiera.** El ingreso por código funciona,
  pero el dominio de prueba del proveedor solo entrega en la casilla del
  equipo, así que una vecina todavía no puede recibir su código. Ver
  [`ingreso-por-correo.md`](ingreso-por-correo.md).
- **La ficha de un elemento del catastro**, que hoy muestra un ejemplo fijo y
  todavía no lee el elemento que se tocó.
- **Las propuestas y las actividades**, que tienen sus propios tipos en el
  prototipo y quedaron fuera de esta tarea.
- **La capa de patrimonio** no se migró ni se va a migrar sin resolver antes
  el tratamiento de datos personales: su formulario recoge nombre del dueño y
  del arrendatario junto a la dirección.
