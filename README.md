# Barrio República · prototipo funcional

Prototipo navegable de la plataforma comunitaria del Barrio República, hecho con
React Native y Expo. Reproduce las 36 pantallas del diseño y deja operativas las
seis historias de usuario prioritarias, con datos de ejemplo en memoria.

Proyecto IE4000 · Equipo E02 · contraparte República Circular.

**Para quién es.** Para los vecinos del Barrio República, que hoy no tienen
dónde reportar una problemática del barrio y hacerle seguimiento, y para
República Circular, la organización socioambiental que la va a sostener. El
barrio son 129 hectáreas donde viven más de treinta mil personas y la
organización tiene entre tres y diez personas activas, así que todo lo que
necesite trabajo humano sostenido para no degradarse está bajo sospecha por
diseño.

A diferencia de las aplicaciones de seguridad ya instaladas en el barrio, acá el
reporte es el comienzo de un ciclo y no su cierre: se reporta, se propone, se
discute y se vincula con instituciones.

> **Documentación completa:** este archivo es la guía corta para arrancar. La
> documentación exhaustiva del proyecto (arquitectura, sistema de diseño,
> componentes, las 36 pantallas una por una y el código fuente íntegro) está en
> [`DOCUMENTACION-COMPLETA-APP.md`](DOCUMENTACION-COMPLETA-APP.md).

---

## Qué es y qué no es

**Es** un prototipo funcional de interfaz con datos en memoria, para validar
flujos con personas usuarias y mostrarle el producto a la contraparte. Se navega
completo, las acciones responden y el estado cambia de verdad mientras dura la
sesión.

**No es** un producto en funcionamiento. No tiene backend, autenticación real,
almacenamiento de imágenes ni notificaciones. Al cerrar la aplicación se pierde
todo lo que se hizo, porque nada se guarda fuera de la memoria del dispositivo.

---

## Cómo levantarlo

Hace falta Node 18 o superior.

```
npm install
npm start
```

Después se abre en el teléfono con la aplicación **Expo Go**, escaneando el
código QR que aparece en la terminal. También corre en el navegador con
`npm run web`, que es la forma más rápida de mostrarlo en una reunión.

Para revisar que no haya errores de tipos: `npm run revisar-tipos`.

---

## Estado de conexión con el backend

**El backend está en pie y la aplicación entra con cuenta propia.**

La decisión de stack es Supabase con PostGIS, tomada el 19 de octubre de 2026
tras comparar cuatro alternativas, por ser la única con consultas espaciales
nativas.

| Pieza | Estado |
|---|---|
| Proyecto de Supabase | Creado, región São Paulo, PostGIS 3.3.7 |
| Esquema de los reportes | Aplicado y verificado |
| Funciones de registro y consulta | Aplicadas y probadas contra la base |
| Almacenamiento de imágenes | Depósito privado y políticas aplicadas |
| Capas del catastro 2022 | 903 elementos cargados en ocho capas |
| Sesión y cuentas | Ingreso por código al correo, probado de punta a punta |
| Pausa por inactividad | Resuelta con un latido diario desde GitHub Actions |

Las políticas de fila se escriben contra `auth.uid()`, de modo que sin sesión
la aplicación no puede leer ni escribir nada. Eso es lo que hacía que el
ingreso condicionara todo lo demás, y la razón de haberlo implementado antes
que cualquier pantalla nueva. El mecanismo es el que decidió la contraparte el
19 de octubre: cuenta obligatoria, sin contraseña, con código de seis números
al correo. Cómo quedó armado el envío y qué falta para abrirlo al barrio está
en [`basedatos/ingreso-por-correo.md`](basedatos/ingreso-por-correo.md).

Las credenciales van en un `.env.local`: ver [`.env.example`](.env.example) y
[`basedatos/modelo-de-datos.md`](basedatos/modelo-de-datos.md).

La pausa por inactividad del plan gratuito, que en una organización pequeña
reproduce el patrón que ya mató dos herramientas del barrio, la resuelve una
llamada diaria programada: cómo funciona y qué hay que configurar una sola vez
está en [`basedatos/latido.md`](basedatos/latido.md).

Queda una advertencia. Las capas del catastro 2022 se migraron con la
autorización que Jorge dio de palabra en reunión, donde señaló que es
información abierta: esa autorización no quedó escrita en ninguna minuta, así
que conviene pedir una línea por correo o mensaje y guardarla junto a la
evidencia.

---

## Qué está funcionando

Las seis historias Must del backlog están operativas de punta a punta.

| # | Historia | Dónde se ve |
|---|---|---|
| 1 | Reportar problemáticas georreferenciadas | Asistente de 5 pasos, con detección de posible duplicado |
| 3 | Proponer soluciones | Asistente de 3 pasos, enganchado a un reporte existente |
| 4 | Comentar y discutir propuestas | Conversación con postura, respuestas y «útil» |
| 5 | Seguir el estado del reporte propio | Línea de tiempo de cuatro estados y avisos |
| 11 | Ver el mapa con indicadores | Plano del barrio con reportes, propuestas y actividades |
| 18 | Explorar propuestas desde una institución | Desafíos filtrables y declaración de interés |

Además están las pantallas Should: actividades con inscripción, panel de gestión,
moderación de un reporte, observatorio y el ajuste de accesibilidad.

**Lo que se puede hacer de verdad en el prototipo:** publicar un reporte y verlo
aparecer en el mapa y en «Mis reportes», confirmar reportes de otros vecinos y
que uno pase de Recibido a Verificado, apoyar y comentar propuestas, publicar
una propuesta nueva, inscribirse en una actividad como asistente o voluntario,
cambiar el estado de un reporte desde el panel de gestión y subir el tamaño de
la letra, que se aplica a toda la aplicación.

---

## Qué está simulado y por qué

| Pieza | Estado en el prototipo | Qué falta |
|---|---|---|
| Datos | Reales con sesión abierta; de ejemplo si no hay credenciales | Nada |
| Mapa | OpenStreetMap real, con arrastre, zoom y las ocho capas | Tocar un grupo y que acerque |
| Fotografías | Se eligen y se suben al publicar | Mostrarlas en el detalle del reporte |
| Avisos | Lista precargada | Notificaciones push |
| Sesión | Cuenta propia con código al correo | Un dominio propio para escribirle a cualquiera |

Las tres decisiones de stack vienen de la bitácora del proyecto: React Native
con Expo, Supabase y OpenStreetMap, todas herramientas abiertas y gratuitas.

---

## Cómo está organizado el repositorio

```
app/                      Pantallas. La ruta es la carpeta (expo-router)
  index.tsx               1.1 Bienvenida
  ingreso/                1.2 a 1.4 Registro
  (barrio)/               Las cinco pestañas fijas
  mapa/                   2.3 Capas y 2.4 Ficha del catastro
  reportar/               3.1 a 3.7 Asistente de reporte
  reportes/[id].tsx       4.2 y 4.3 Detalle del reporte
  propuestas/             5.1 a 5.5 Propuestas y conversación
  actividades/            6.1 a 6.4 Actividades
  perfil/                 7.2 Perfil y 7.3 Ajustes
  instituciones/          8.1 Desafíos y 8.2 Interés
  observatorio.tsx        8.3 Observatorio
  gestion/                9.1 Panel y 9.2 Moderación
  sistema.tsx             0 Sistema visual

src/
  diseno/                 Colores, tipografía, medidas e íconos
  componentes/base/       Piezas sin dominio: Boton, Tarjeta, Chip, Texto
  componentes/app/        Piezas con dominio: TarjetaReporte, MapaBarrio
  dominio/                Categorías, estados, etapas y tipos
  datos/                  Consultas a Supabase y datos de ejemplo
  estado/                 Contextos de React
  utiles/                 Ayudas sueltas

basedatos/
  migraciones/            Los dieciséis archivos SQL, en el orden en que se aplican
  carga/                  Preparación y validación del catastro 2022
  modelo-de-datos.md      Por qué cada tabla y cada política son así
  ingreso-por-correo.md   Cómo se manda el código y qué falta para abrirlo
  latido.md               Cómo se evita que el plan gratuito pause el proyecto

.github/workflows/        Lo único que corre solo: el latido diario
```

### La regla de dependencias

**Las dependencias apuntan siempre hacia abajo y ninguna capa importa de una
superior.**

```
app/                      pantallas y rutas (expo-router)
  |
  v
src/componentes/app/      componentes que conocen el dominio
  |
  v
src/componentes/base/     componentes sin dominio
  |
  v
src/estado/               contextos de React
  |
  v
src/datos/                acceso a datos y datos de ejemplo
  |
  v
src/dominio/              tipos y taxonomías
  |
  v
src/diseno/               tokens: colores, tipografía, medidas, íconos
```

La regla no es decorativa, sirve para algo concreto: al conectar el backend solo
cambian `src/datos` y el interior de `src/estado`. Las pantallas quedan intactas
porque la firma de cada acción no cambia. Si una pantalla importara de
`src/datos` directamente, esa garantía se cae.

### Por qué existe `componentes/base`

Ningún botón se arma de cero. Hay un solo `Boton` con seis variantes, una sola
`Tarjeta`, un solo `Chip` y un solo `Icono` que dibuja los cincuenta y tantos
íconos del catálogo. Si mañana el diseño cambia el radio de los botones, se
cambia en `src/diseno/medidas.ts` y se actualizan las 36 pantallas.

Lo mismo con el texto: todo pasa por el componente `Texto`, y por eso el ajuste
de tamaño de letra funciona en toda la aplicación sin tocar pantalla por
pantalla.

### Convenciones

- **El dominio se nombra en español** (`Reporte`, `Propuesta`, `usarBarrio`)
  porque el backlog, los mockups y la contraparte hablan en español. Lo técnico
  mantiene su nombre de siempre (`useState`, `ScrollView`).
- **Tipos explícitos.** `strict` está activado, más `noUncheckedIndexedAccess` y
  los avisos de código sin usar.
- **Un archivo por responsabilidad.** Ninguna pantalla pasa de unas 300 líneas.
- **Comentarios que explican el porqué**, no el qué. Cuando una decisión viene
  del levantamiento en terreno o de un acuerdo con la contraparte, el comentario
  lo dice.

---

## Fidelidad con el diseño

Los colores, tipografías, radios, alturas y trazos de íconos salen de los
mockups, no de aproximaciones. Las dos tipografías están incluidas en
`assets/fonts`, así que se ven igual en cualquier teléfono.

Las seis reglas de accesibilidad del sistema visual se cumplen en el código:

- Toda zona tocable mide 44 px o más, y las acciones principales 56.
- Un paso por pantalla en los flujos, con «Paso X de Y» siempre visible.
- Los íconos siempre van con texto, nunca solo color.
- El gris de apoyo es `#56625B`, que cumple 4,5:1 sobre crema.
- El tamaño de letra se ajusta desde la bienvenida y desde Ajustes.
- El lenguaje es cotidiano: «En gestión», no «Ticket asignado».

---

## Qué conviene hacer después

1. Verificar un dominio propio en Resend. Mientras el remitente sea el dominio
   de prueba, el código solo le llega a la casilla del equipo y ninguna vecina
   puede entrar.
2. Pedir por escrito la autorización de los datos del catastro y guardarla con
   la evidencia de esa tarea, porque hoy existe solo de palabra.
3. Dejar una consulta programada que toque la base una vez al día, para que el
   plan gratuito no pause el proyecto.
4. Mostrar las fotografías en el detalle del reporte: hoy se suben y se guardan,
   pero no se ven.
5. Probar con personas usuarias, incluida población flotante, y anotar dónde se
   traban.

---

## Licencia

MIT. Ver [`LICENSE`](LICENSE).

La licencia cubre el código de este repositorio. Los datos del catastro
socioambiental 2022 no están cubiertos: se usan con la autorización de la
contraparte y esa autorización todavía no está por escrito.
