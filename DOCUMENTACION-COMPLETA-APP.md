# Documentación completa · Barrio República (prototipo funcional)

Aplicación móvil de la plataforma comunitaria del Barrio República, construida
con React Native y Expo. Este documento describe el proyecto completo: su
contexto, su arquitectura, cada token de diseño, cada componente, cada pantalla
y el código fuente íntegro de sus archivos.

**Corte.** El cuerpo de este documento describe el prototipo tal como estaba el
13 de octubre de 2026, cuando trabajaba con datos en memoria. El capítulo 18
recoge lo que cambió al conectarlo con Supabase y los trece archivos que se
sumaron. El código fuente de todos los capítulos está actualizado al 31 de
octubre.

**Propósito de este documento.** Está escrito para que alguien que nunca vio
el proyecto pueda reconstruirlo exactamente igual. Todo lo que define el
comportamiento está aquí: no hay decisiones implícitas ni archivos omitidos.

| Campo | Valor |
|---|---|
| Nombre del proyecto | `barrio-republica-app` |
| Ubicación | `Desktop Proyecto República Circular\barrio-republica-app` |
| Fecha de corte | 31 de octubre de 2026 |
| Archivos de código | 106 (41 en `app/`, 65 en `src/`) |
| Líneas de código | 14.898 |
| Pantallas | 36 del diseño, más la del código de ingreso y la del sistema visual, y 3 archivos de disposición |
| Componentes reutilizables | 31 |
| Estado de verificación | Compila sin errores de tipos y fue recorrido pantalla por pantalla en el navegador, con sesión real contra Supabase |

---

## Cómo está organizado este documento

El documento tiene dos mitades que cumplen funciones distintas.

**Parte I, capítulos 1 a 16: comprensión.** Explican qué hace cada pieza, por
qué está donde está y cómo se relaciona con el resto. Es lo que hay que leer
para entender el proyecto.

**Parte II, capítulo 17: código fuente completo.** Contiene los 97 archivos
(93 de código y 4 de configuración) transcritos uno a uno, en su totalidad y sin recortes. Es la fuente de verdad
definitiva: si alguna descripción de la Parte I contradijera al código, manda el
código.

### Índice

**Parte I · Comprensión**

1. [Contexto del proyecto](#1-contexto-del-proyecto)
2. [Stack técnico y configuración](#2-stack-técnico-y-configuración)
3. [Arquitectura y árbol de archivos](#3-arquitectura-y-árbol-de-archivos)
4. [Sistema de diseño](#4-sistema-de-diseño)
5. [Catálogo de íconos](#5-catálogo-de-íconos)
6. [Componentes base](#6-componentes-base)
7. [Componentes de aplicación](#7-componentes-de-aplicación)
8. [Modelo de dominio](#8-modelo-de-dominio)
9. [Estado de la aplicación](#9-estado-de-la-aplicación)
10. [Navegación y rutas](#10-navegación-y-rutas)
11. [Las 36 pantallas, una por una](#11-las-36-pantallas-una-por-una)
12. [Datos de ejemplo](#12-datos-de-ejemplo)
13. [Convenciones de código](#13-convenciones-de-código)
14. [Trampas conocidas](#14-trampas-conocidas)
15. [Operación: correr, verificar, extender](#15-operación-correr-verificar-extender)
16. [Trazabilidad con los mockups](#16-trazabilidad-con-los-mockups)

**Parte II · Código fuente**

17. [Código fuente completo](#17-código-fuente-completo)

### Tamaño y cómo leerlo

El documento pesa unos 578 KB, repartidos así:

| Parte | Capítulos | Tamaño | Para qué sirve |
|---|---|---|---|
| I · Comprensión | 1 a 16 | 165 KB | Entender el proyecto |
| II · Código fuente | 17 y 18 | 413 KB | Reconstruirlo |

**La Parte I por sí sola basta para entender la aplicación.** El código fuente
se consulta después, o solo las secciones que importen: de la 17.2 a la 17.6
están las capas de `src` sin componentes ni pantallas, y pesan unos 76 KB.

---

### Para reconstruir el proyecto desde cero

El orden que funciona es este:

1. Crear el proyecto con `npx create-expo-app@latest barrio-republica-app --template blank-typescript`.
2. Instalar las dependencias exactas del capítulo 2 y copiar los cuatro archivos de configuración.
3. Descargar las cuatro tipografías a `assets/fonts` (capítulo 2).
4. Crear `src/diseno`, luego `src/dominio`, luego `src/datos`, luego `src/estado`, luego `src/utiles`. En ese orden, porque cada capa depende solo de las anteriores.
5. Crear `src/componentes/base` y después `src/componentes/app`.
6. Crear `app/` empezando por `_layout.tsx`.

Todo el contenido de cada archivo está en el capítulo 17.

---

## 1. Contexto del proyecto

Entender este capítulo es lo que separa copiar la aplicación de entenderla.
Muchas decisiones de interfaz que parecen arbitrarias responden a un hallazgo
concreto del levantamiento en terreno o a un acuerdo con la contraparte.

### 1.1 Quién lo hace y para quién

| Campo | Valor |
|---|---|
| Curso | IE4000, Proyectos de Ingeniería y Ciencias al Servicio de la Comunidad |
| Institución | FCFM, Universidad de Chile |
| Equipo | E02 |
| Contraparte | República Circular, organización vecinal socioambiental |
| Territorio | Barrio República, Santiago |
| Semestre | Primavera 2026 |

República Circular tiene entre tres y diez personas activas, con un promedio
diario de una a seis. **Esa es la restricción de diseño más determinante del
proyecto**: cualquier función que exija trabajo humano constante no se sostiene.

### 1.2 El problema

El barrio se deteriora y las acciones que podrían revertirlo no logran
multiplicarse, porque la capacidad de convocar y dar continuidad es muy
limitada. La información del territorio existe (un catastro de 2022 con 2.032
elementos georreferenciados) pero está congelada desde febrero de 2023 y la
organización va a dejar de pagar la plataforma que la aloja.

### 1.3 Hallazgos del terreno que la interfaz tiene que respetar

Estos salieron de diez entrevistas aplicadas el 25 de septiembre de 2026 y
explican varias pantallas:

| Hallazgo | Consecuencia en la aplicación |
|---|---|
| Ninguna persona de población flotante supo a quién reportar | El reporte es el botón central y más grande de la barra |
| **La fricción del registro es la barrera de adopción declarada** | La cuenta es obligatoria desde el 19 de octubre, pero sin contraseñas: un correo y un código de seis números |
| Los reportes previos no recibían seguimiento visible | La línea de tiempo de cuatro estados es la pantalla más importante después del mapa |
| **El riesgo de reportes falsos es la principal causa de desconfianza** | Existe moderación, confirmación entre vecinos y señalamiento |
| Hay más apetito por apoyar o votar que por comentar | Apoyar es un botón grande; comentar es secundario |
| El mapa se lee como herramienta de seguridad y de ruta | El mapa es un destino propio, no un detalle de otra pantalla |

Dos casos previos del barrio murieron: el Banco del Tiempo, que llegó a 170
socios, **cesó porque faltaban notificaciones móviles y recuperación de
contraseñas**. De ahí vienen la pantalla de Avisos y el acceso por código al
correo en vez de contraseña.

### 1.4 Las historias de usuario que el prototipo cubre

Priorización MoSCoW validada con la contraparte el 9 de septiembre de 2026.

**Must (las seis, todas operativas):**

| # | Historia | Dónde vive |
|---|---|---|
| 1 | Reportar problemáticas georreferenciadas | `app/reportar/*`, cinco pasos |
| 3 | Proponer soluciones | `app/propuestas/nueva/*`, tres pasos |
| 4 | Comentar y discutir soluciones | `app/propuestas/[id]/conversacion.tsx` |
| 5 | Seguir el estado del reporte propio | `app/reportes/[id].tsx` |
| 11 | Ver el mapa con indicadores | `app/(barrio)/mapa.tsx` |
| 18 | Explorar propuestas desde una institución | `app/instituciones/desafios.tsx` |

**Should (implementadas):** 2 y 6 difundir y enterarse de actividades, 7
registrarse en actividades, 10 información agregada, 14 moderar, 16 panel
filtrable, 17 explorar problemáticas, 21 reconocimiento por participación.

**Fuera de alcance, por decisión explícita del equipo:** reportes de robos e
incendios (existe SoSafe y el proyecto se diferencia hacia lo socioambiental),
detección de duplicados con aprendizaje automático (se reemplazó por ubicación
más etiqueta con confirmación del usuario, modelo Waze), y niveles jerárquicos
de usuario (se reemplazaron por logros).

### 1.5 Decisiones de producto que el código refleja

| Decisión | Fecha | Fundamento |
|---|---|---|
| «Activista» pasa a «Gestor territorial» | 02/09 | Connotación peyorativa. No es solo nombre: el rol tiene permisos adicionales |
| Logros en vez de niveles jerárquicos | 02/09 | Un usuario antiguo no debe pesar más que uno nuevo con buena idea |
| Sin aprendizaje automático dentro del producto | 02/09 | Complejidad innecesaria y sin financiamiento |
| Beneficios solo de locatarios asociados y por alta participación | 09/09 | Evita competencia entre comercios |
| La plataforma como destino de migración de los datos de ArcGIS | 21/09 | La organización deja de pagar la plataforma |

Dos frases del sistema visual que se cumplen en el código a rajatabla:

> «Cada color de categoría o estado va siempre junto a un ícono y una palabra.»

> «Lenguaje cotidiano: En gestión, no Ticket asignado.»

### 1.6 Qué es este prototipo y qué no

**Es** un prototipo funcional de interfaz, con datos en memoria, pensado para
validar flujos con personas usuarias y para mostrar a la contraparte y a fondos
concursables.

**No es** un producto desplegable. No hay backend, autenticación real,
almacenamiento de imágenes ni notificaciones push. El capítulo 15 explica qué
hace falta para cada cosa.

---

## 2. Stack técnico y configuración

### 2.1 De dónde viene la decisión de stack

El stack no se eligió al construir el prototipo: estaba definido en la ficha del
proyecto como **React Native (Expo) + Supabase + OpenMaps**, con el criterio de
usar herramientas abiertas y gratuitas. El prototipo implementa la primera parte
y deja las otras dos preparadas.

### 2.2 Dependencias exactas

Estas son las versiones que se instalaron y con las que todo fue verificado.

**`dependencies`**

| Paquete | Rango en package.json | Versión instalada | Para qué se usa |
|---|---|---|---|
| `expo` | `~57.0.27` | 57.0.27 | SDK base |
| `expo-router` | `~57.0.25` | 57.0.25 | Navegación por archivos |
| `expo-font` | `~57.0.4` | 57.0.4 | Carga de las cuatro tipografías |
| `expo-splash-screen` | `~57.0.9` | 57.0.9 | Retener la pantalla de carga hasta que las fuentes estén listas |
| `expo-status-bar` | `~57.0.1` | 57.0.1 | Barra de estado |
| `expo-haptics` | `~57.0.3` | 57.0.3 | Vibración breve al confirmar acciones |
| `expo-image-picker` | `~57.0.20` | 57.0.20 | Cámara y galería en el paso de foto |
| `expo-linking` | `~57.0.12` | 57.0.12 | Enlaces profundos |
| `expo-constants` | `~57.0.21` | 57.0.21 | Dependencia de expo-router |
| `react` | `19.2.3` | 19.2.3 | |
| `react-dom` | `19.2.3` | 19.2.3 | Fijada a propósito, ver 2.6 |
| `react-native` | `0.86.3` | 0.86.3 | |
| `react-native-web` | `^0.21.2` | 0.21.4 | Ejecución en navegador |
| `react-native-svg` | `15.15.4` | 15.15.4 | Íconos, plano del barrio, tramas |
| `react-native-reanimated` | `4.5.1` | 4.5.1 | Animaciones de entrada y de presión |
| `react-native-gesture-handler` | `~2.32.0` | 2.32.0 | Requisito de la navegación |
| `react-native-safe-area-context` | `~5.7.0` | 5.7.0 | Márgenes de barra de estado y borde inferior |
| `react-native-screens` | `~4.26.0` | 4.26.2 | Requisito de la navegación |
| `@react-native-async-storage/async-storage` | `2.2.0` | 2.2.0 | Guardar las preferencias de lectura |

**`devDependencies`**

| Paquete | Rango | Versión instalada |
|---|---|---|
| `typescript` | `~6.0.3` | 6.0.3 |
| `@types/react` | `~19.2.2` | 19.2.18 |
| `babel-preset-expo` | `~57.0.0` | 57.0.14 |

**No hay librería de interfaz de terceros.** Ni NativeBase, ni Tamagui, ni
react-native-paper, ni una librería de íconos. Todo está construido sobre
`View`, `Text`, `Pressable`, `TextInput`, `ScrollView` y `react-native-svg`.
Esto es deliberado: el diseño es propio y una librería externa habría obligado a
pelear contra sus valores por defecto en cada pantalla.

### 2.3 `package.json`

```json
{
  "name": "barrio-republica-app",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "dependencies": { ... ver tabla anterior ... },
  "devDependencies": { ... },
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "revisar-tipos": "tsc --noEmit"
  },
  "private": true
}
```

Dos detalles que importan:

- **`main` es `expo-router/entry`**, no un archivo propio. Por eso no existe
  `App.tsx` ni `index.ts` en la raíz: el punto de entrada lo pone expo-router y
  la raíz real de la aplicación es `app/_layout.tsx`.
- **`revisar-tipos`** existe porque `tsc --noEmit` es la única verificación
  automática del proyecto. No hay pruebas unitarias.

El contenido íntegro está en el capítulo 17.

### 2.4 `app.json`

Lo que hay que saber de la configuración de Expo:

| Clave | Valor | Por qué |
|---|---|---|
| `name` | `Barrio República` | Nombre visible |
| `slug` | `barrio-republica-app` | |
| `scheme` | `barriorepublica` | Necesario para enlaces profundos |
| `orientation` | `portrait` | La aplicación es de una mano |
| `userInterfaceStyle` | `light` | **No hay modo oscuro.** El sistema visual define un solo tema |
| `newArchEnabled` | `true` | Arquitectura nueva de React Native |
| `splash.backgroundColor` | `#0F3D2A` | Verde bosque, para que no haya salto blanco al abrir |
| `android.package` / `ios.bundleIdentifier` | `cl.republicacircular.barriorepublica` | |
| `experiments.typedRoutes` | `true` | Tipa las rutas de expo-router |

Complementos declarados: `expo-router`, `expo-font`, `expo-splash-screen` y
`expo-image-picker` con sus dos textos de permiso en español.

### 2.5 `babel.config.js`

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-worklets/plugin'],
  };
};
```

El plugin de worklets habilita Reanimated y **tiene que ser el último de la
lista**. `babel-preset-expo` está en `devDependencies` a propósito: no queda en
la raíz de `node_modules` por sí solo y sin instalarlo el empaquetado falla con
«Cannot find module».

### 2.6 `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"],
  "exclude": ["node_modules"]
}
```

Cuatro cosas deliberadas:

- **`strict`** más **`noUncheckedIndexedAccess`**: acceder a `lista[0]` devuelve
  `T | undefined`. Obliga a manejar el caso vacío, que es justamente donde se
  caen los prototipos.
- **`noUnusedLocals` y `noUnusedParameters`**: impiden que quede código muerto.
- **`paths`** con el alias `@/*`: todas las importaciones internas son
  `@/componentes/base`, nunca `../../../`.
- **No se usa `baseUrl`**, que TypeScript 6 marca como obsoleto.

### 2.7 Tipografías

Cuatro archivos `.ttf` en `assets/fonts`, descargados del repositorio
`google/fonts`:

| Archivo | Familia | Uso |
|---|---|---|
| `AtkinsonHyperlegible-Regular.ttf` | Atkinson Hyperlegible 400 | Todo el texto corrido |
| `AtkinsonHyperlegible-Bold.ttf` | Atkinson Hyperlegible 700 | Énfasis y etiquetas |
| `FiraSansCondensed-SemiBold.ttf` | Fira Sans Condensed 600 | Títulos de sección |
| `FiraSansCondensed-Bold.ttf` | Fira Sans Condensed 700 | Títulos de pantalla y portadas |

Atkinson Hyperlegible fue diseñada por el Braille Institute para personas con
baja visión. No es una preferencia estética: es la razón por la que el texto
base son 17 px y la regla de nunca bajar de 13.

**Las fuentes viajan dentro del repositorio a propósito**, no se instalan desde
un paquete. Los paquetes `@expo-google-fonts/*` dan conflictos de dependencias
con este SDK y además obligarían a depender de la red.

Para reconstruir:

```
https://raw.githubusercontent.com/google/fonts/main/ofl/atkinsonhyperlegible/AtkinsonHyperlegible-Regular.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/atkinsonhyperlegible/AtkinsonHyperlegible-Bold.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/firasanscondensed/FiraSansCondensed-SemiBold.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/firasanscondensed/FiraSansCondensed-Bold.ttf
```

### 2.8 Nota sobre `react-dom`

`react-dom` está fijado a `19.2.3` dentro de `dependencies` aunque la aplicación
es móvil. Sin esa línea **`npm install` se rompe**: `react-dom` es un peer
opcional de `expo`, npm intenta resolverlo a la última versión y choca con la
versión de `react` que fija el SDK. Si alguien la borra, el proyecto deja de
instalarse.

---

## 3. Arquitectura y árbol de archivos

### 3.1 La idea central

El proyecto está en capas y **las dependencias apuntan siempre hacia abajo**.
Ninguna capa importa de una capa superior.

```
  app/                      pantallas y rutas
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
  src/datos/                datos de ejemplo
    |
    v
  src/dominio/              tipos y taxonomías
    |
    v
  src/diseno/               tokens: colores, tipografía, medidas, íconos
```

Las consecuencias prácticas:

- `src/diseno` **no importa nada** del proyecto. Es hoja.
- Un componente de `base/` nunca sabe qué es un reporte. Recibe texto, colores y
  funciones.
- Un componente de `app/` sí conoce el dominio: `TarjetaDeReporte` recibe un
  `Reporte` completo.
- Una pantalla casi no tiene estilos propios: compone componentes.
- `src/utiles` es transversal y solo contiene funciones puras.

La regla sirve para una cosa concreta: cuando se conecte Supabase, solo cambia
`src/datos` y el interior de `src/estado`. Nada más se toca.

### 3.2 Árbol completo con una línea por archivo

```
barrio-republica-app/
│
├── app.json                              Configuración de Expo
├── babel.config.js                       Preset de Expo + plugin de worklets
├── package.json                          Dependencias y scripts
├── tsconfig.json                         TypeScript estricto con alias @/*
├── LEEME.md                              Guía corta para el equipo
│
├── assets/
│   ├── fonts/
│   │   ├── AtkinsonHyperlegible-Bold.ttf
│   │   ├── AtkinsonHyperlegible-Regular.ttf
│   │   ├── FiraSansCondensed-Bold.ttf
│   │   └── FiraSansCondensed-SemiBold.ttf
│   ├── icon.png, splash-icon.png, favicon.png, android-icon-*.png
│
├── app/                                  RUTAS. La carpeta es la URL
│   ├── _layout.tsx            73 L       Raíz: fuentes, proveedores, Stack
│   ├── index.tsx             208 L       1.1 Bienvenida
│   ├── sistema.tsx           239 L       0 Sistema visual
│   ├── observatorio.tsx      271 L       8.3 Observatorio del barrio
│   │
│   ├── ingreso/
│   │   ├── vinculo.tsx       110 L       1.2 Vínculo con el barrio
│   │   ├── intereses.tsx     133 L       1.3 Qué quiero ver en el mapa
│   │   └── cuenta.tsx        124 L       1.4 Perfil opcional sin contraseña
│   │
│   ├── (barrio)/                         Grupo de las cinco pestañas fijas
│   │   ├── _layout.tsx        38 L       Tabs con barra propia
│   │   ├── inicio.tsx        285 L       2.1 Inicio (feed)
│   │   ├── mapa.tsx          288 L       2.2 Mapa del barrio
│   │   ├── reportar.tsx       13 L       Redirección al asistente
│   │   ├── mis-reportes.tsx  174 L       4.1 Mis reportes
│   │   └── avisos.tsx        150 L       7.1 Avisos
│   │
│   ├── mapa/
│   │   ├── capas.tsx         117 L       2.3 Capas del mapa (modal)
│   │   └── ficha.tsx         309 L       2.4 Ficha del catastro (modal)
│   │
│   ├── reportar/                         Asistente de reporte, 5 pasos
│   │   ├── _layout.tsx        24 L       Stack propio del asistente
│   │   ├── categoria.tsx     162 L       3.1 Qué pasa
│   │   ├── foto.tsx          183 L       3.2 Foto
│   │   ├── ubicacion.tsx     200 L       3.3 Dónde
│   │   ├── duplicado.tsx     117 L       3.4 Posible duplicado (intercalada)
│   │   ├── detalles.tsx      135 L       3.5 Detalles
│   │   ├── revisar.tsx       257 L       3.6 Revisar y enviar
│   │   └── enviado.tsx       230 L       3.7 Reporte enviado
│   │
│   ├── reportes/
│   │   └── [id].tsx          338 L       4.2 Detalle y 4.3 Reporte resuelto
│   │
│   ├── propuestas/
│   │   ├── index.tsx         112 L       5.1 Propuestas del barrio
│   │   ├── nueva/
│   │   │   ├── idea.tsx      160 L       5.2 Nueva propuesta · idea
│   │   │   ├── necesita.tsx  183 L       5.3 Nueva propuesta · qué se necesita
│   │   │   └── revisar.tsx   148 L       Paso 3, vista previa antes de publicar
│   │   └── [id]/
│   │       ├── index.tsx     347 L       5.4 Detalle de propuesta
│   │       └── conversacion.tsx 311 L    5.5 Conversación
│   │
│   ├── actividades/
│   │   ├── index.tsx         208 L       6.1 Actividades
│   │   ├── [id].tsx          240 L       6.2 Detalle de actividad
│   │   ├── inscripcion.tsx   167 L       6.3 Inscripción lista
│   │   └── crear.tsx         235 L       6.4 Crear actividad (gestor)
│   │
│   ├── perfil/
│   │   ├── index.tsx         293 L       7.2 Perfil y logros
│   │   └── ajustes.tsx       240 L       7.3 Ajustes y accesibilidad
│   │
│   ├── instituciones/
│   │   ├── desafios.tsx      173 L       8.1 Desafíos para instituciones
│   │   └── interes.tsx       164 L       8.2 Mostrar interés (modal)
│   │
│   └── gestion/
│       ├── panel.tsx         177 L       9.1 Panel de gestión
│       └── moderar/
│           └── [id].tsx      206 L       9.2 Revisión de reporte
│
└── src/
    ├── diseno/                           TOKENS. No importa nada del proyecto
    │   ├── colores.ts         67 L       Paleta completa con nombre
    │   ├── tipografia.ts      38 L       Familias, archivos y escala de texto
    │   ├── medidas.ts         69 L       Espacios, radios, alturas y sombras
    │   └── iconos.ts         160 L       Los 55 íconos como datos
    │
    ├── dominio/                          TIPOS Y TAXONOMÍAS
    │   ├── categorias.ts     101 L       Las 8 categorías de reporte
    │   ├── estados.ts        128 L       4 estados de reporte, 5 etapas de propuesta
    │   └── tipos.ts          233 L       Todos los tipos del modelo
    │
    ├── datos/                            DATOS DE EJEMPLO
    │   ├── personas.ts        25 L       7 personas y organizaciones
    │   ├── reportes.ts       293 L       9 reportes
    │   ├── propuestas.ts     197 L       3 propuestas y sus catálogos
    │   ├── actividades.ts     84 L       3 actividades y sus catálogos
    │   ├── avisos.ts          71 L       5 avisos
    │   ├── catastro.ts        38 L       12 capas del mapa y 1 ficha
    │   ├── perfil.ts          74 L       Logros, vínculos e intereses
    │   └── observatorio.ts   105 L       Cifras del diagnóstico y 3 desafíos
    │
    ├── estado/                           CONTEXTOS DE REACT
    │   ├── barrio.tsx        447 L       Contenido y acciones
    │   ├── borradores.tsx    110 L       Lo escrito en los flujos de varios pasos
    │   └── preferencias.tsx  111 L       Lectura y accesibilidad, persistidas
    │
    ├── utiles/
    │   ├── navegacion.ts      19 L       Retroceso seguro
    │   └── texto.ts            7 L       Singular y plural
    │
    └── componentes/
        ├── base/                         SIN DOMINIO
        │   ├── index.ts       23 L       Punto único de entrada
        │   ├── Texto.tsx      71 L       Todo el texto pasa por aquí
        │   ├── Icono.tsx      51 L       Dibuja cualquiera de los 55 íconos
        │   ├── Presionable.tsx 60 L      Área tocable con reacción al tacto
        │   ├── Boton.tsx     113 L       6 variantes
        │   ├── BotonCircular.tsx 56 L    El redondo de 44 px de las cabeceras
        │   ├── Tarjeta.tsx    69 L       4 tonos
        │   ├── Chip.tsx      105 L       Filtro en pastilla, 2 variantes
        │   ├── Etiqueta.tsx   64 L       Píldora de estado
        │   ├── CampoTexto.tsx 91 L       Entrada de texto
        │   ├── Opcion.tsx    149 L       Fila seleccionable y casilla suelta
        │   ├── Interruptor.tsx 57 L      Switch dibujado a mano
        │   ├── Contador.tsx   93 L       Menos y más
        │   ├── Lista.tsx     153 L       Lista agrupada, fila y sigla
        │   ├── Aviso.tsx      70 L       Nota breve, 4 tonos
        │   ├── BarraDePasos.tsx 75 L     Avance por tramos
        │   ├── BarraInferior.tsx 51 L    Barra fija con la acción principal
        │   ├── EncabezadoDePaso.tsx 78 L Cabecera de los flujos
        │   ├── Pantalla.tsx   58 L       Marco con márgenes seguros
        │   └── Disposicion.tsx 74 L      Fila y Columna
        │
        └── app/                          CON DOMINIO
            ├── index.ts       26 L       Punto único de entrada
            ├── Avatar.tsx     45 L       Círculo con la inicial
            ├── Encabezado.tsx 68 L       Volver, título y acción
            ├── BarraNavegacion.tsx 154 L La barra de 5 destinos
            ├── MarcaDeCategoria.tsx 95 L Cuadrado de color, rótulo y chip
            ├── EtiquetasDeDominio.tsx 51 L Píldoras de estado y de etapa
            ├── TarjetaReporte.tsx 159 L  Barra de estado y 2 tarjetas
            ├── TarjetaPropuesta.tsx 119 L Tarjeta y fila de propuesta
            ├── TarjetaActividad.tsx 129 L Cuadro de fecha, tarjeta y fila
            ├── LineaDeTiempo.tsx 111 L   Recorrido de un reporte
            ├── MapaBarrio.tsx 140 L      El plano, dibujado en SVG
            ├── MarcadorMapa.tsx 137 L    Chincheta, grupo y mi ubicación
            └── FotoSimulada.tsx 63 L     Trama diagonal de relleno
```

### 3.3 Qué pasa cuando alguien toca «Apoyar»

Un recorrido completo sirve para ver cómo encajan las capas:

1. La pantalla `app/propuestas/[id]/index.tsx` pide el contexto con
   `usarBarrio()` y saca de ahí la función `apoyarPropuesta`.
2. Dibuja un `<Boton>` de `componentes/base` con `onPress={() => apoyarPropuesta(propuesta.id)}`.
3. `Boton` envuelve a `Presionable`, que hace la animación de escala y, como
   lleva `vibrar`, pide a `expo-haptics` una vibración breve.
4. Al soltar, `apoyarPropuesta` corre dentro de `src/estado/barrio.tsx`: cambia
   el arreglo `propuestas` invirtiendo `apoyadaPorMi` y sumando o restando uno a
   `apoyos`.
5. El contexto notifica, la pantalla se vuelve a dibujar y el número cambia.
6. Todas las demás pantallas que muestran esa propuesta (el feed, la lista, el
   mapa) ven el valor nuevo, porque leen del mismo contexto.

El punto 4 es el único que cambiará cuando exista Supabase.

---

## 4. Sistema de diseño

Todos los valores de este capítulo salen de la lámina «0 Sistema visual» de los
mockups, que es la fuente de verdad del diseño. Están en `src/diseno`, en cuatro
archivos. **Ningún color, tamaño o radio se escribe suelto dentro de una
pantalla.**

### 4.1 Colores · `src/diseno/colores.ts`

#### Los ocho colores con nombre

Son los que define formalmente el sistema visual.

| Token | Valor | Papel |
|---|---|---|
| `bosque` | `#0F3D2A` | Fondo de pantallas oscuras y títulos sobre crema |
| `verde` | `#1D5E40` | Color de acción principal |
| `brote` | `#6DBE5C` | Acento vivo, solo sobre fondo oscuro |
| `menta` | `#DCEBD8` | Fondo de apoyo suave, confirmaciones y resueltos |
| `crema` | `#F4EFE3` | Fondo general de la aplicación |
| `papel` | `#FFFCF5` | Fondo de tarjetas y hojas |
| `ocre` | `#A86E1C` | Acento cálido, actividades |
| `tinta` | `#17231C` | Color del texto principal |

#### Grises y bordes

| Token | Valor | Papel |
|---|---|---|
| `grisTexto` | `#56625B` | Texto de apoyo. **Cumple 4,5:1 sobre crema y sobre papel** |
| `borde` | `#E2DACA` | Borde de tarjetas |
| `bordeFuerte` | `#CFC6B1` | Borde de controles en reposo |
| `lienzo` | `#E9E3D3` | Fondo detrás de las pantallas de bienvenida |
| `cremaHundida` | `#E9E3D3` | Campos deshabilitados y separadores |

#### Verdes que solo existen sobre fondo bosque

Sobre `#0F3D2A` el verde de acción no contrasta, así que hay una familia aparte.

| Token | Valor | Papel |
|---|---|---|
| `bosqueClaro` | `#17503A` | Cuadros de ícono y aros |
| `bosqueMedio` | `#164A34` | Figura decorativa de la bienvenida |
| `bosqueBorde` | `#3E7258` | Borde de botones de contorno claro |
| `bosqueBarra` | `#2D5E47` | Tramo pendiente de una barra de avance |
| `textoSobreBosque` | `#D9E6DA` | Párrafos |
| `textoTenueSobreBosque` | `#BFD6C3` | Texto de apoyo |

#### Acentos puntuales

| Token | Valor | Papel |
|---|---|---|
| `blanco` | `#FFFFFF` | Reservado para texto sobre marcadores de color |
| `alerta` | `#A8321F` | Contadores sin leer, acciones destructivas, señalamientos |
| `ambarSobreBosque` | `#F2C879` | «En gestión» sobre fondo bosque |

#### Colores del plano del barrio

| Token | Valor | Papel |
|---|---|---|
| `ubicacionPropia` | `#2C6FD1` | Punto azul de la persona |
| `mapaFondo` | `#E8E1CF` | Fondo del plano |
| `mapaVerde` | `#C6DBB3` | Áreas verdes |
| `mapaManzana` | `#D9CFB8` | Manzana edificada |
| `mapaCalle` | `#FBF8F0` | Calzada |
| `mapaLimite` | `#E2D9C3` | Línea segmentada del límite norte |
| `mapaTexto` | `#857C69` | Nombres de calle |

#### Trama que reemplaza a las fotografías

| Token | Valor |
|---|---|
| `fotoTramaClara` | `#E3DAC6` |
| `fotoTramaOscura` | `#DCD2BC` |
| `fotoIcono` | `#8C8370` |

El objeto se declara `as const` y exporta `type NombreColor = keyof typeof colores`.

**Hay colores que no están aquí y sí aparecen en el código**: los de las ocho
categorías de reporte, los cuatro estados y las cinco etapas. Viven en
`src/dominio` porque son significado, no decoración. Ver capítulo 8.

### 4.2 Tipografía · `src/diseno/tipografia.ts`

Dos familias y nada más.

```ts
export const familias = {
  titulo: 'FiraSansCondensed-Bold',
  tituloSemi: 'FiraSansCondensed-SemiBold',
  texto: 'AtkinsonHyperlegible-Regular',
  textoFuerte: 'AtkinsonHyperlegible-Bold',
} as const;
```

`archivosDeFuente` mapea esos cuatro nombres a los `.ttf` con `require`, y es lo
que `useFonts` recibe en `app/_layout.tsx`.

#### Escala de texto

| Escalón | Tamaño | Dónde se usa |
|---|---|---|
| `portada` | 44 | El título de la bienvenida |
| `pantalla` | 32 | Título de pantalla en los flujos |
| `titulo` | 28 | Título de las pantallas de detalle |
| `seccion` | 22 | Encabezado de sección dentro de una pantalla |
| `subtitulo` | 19 | |
| `destacado` | 18 | Acción principal, títulos de tarjeta |
| `base` | 17 | **Texto corrido. Pensado para leerse sin lentes y con sol** |
| `cuerpo` | 16 | |
| `apoyo` | 14 | Texto secundario |
| `menor` | 13 | **Mínimo absoluto. La regla prohíbe bajar de aquí** |

En la práctica las pantallas pasan números directos al componente `Texto`,
porque los mockups usan valores intermedios muy seguido: 13.5, 14.5, 15.5, 16.5,
18, 19, 21, 24, 26, 28, 30, 34, 40. La escala con nombre existe para los casos
canónicos y para documentar los escalones del sistema.

### 4.3 Medidas · `src/diseno/medidas.ts`

#### Espacios

| Token | Valor |
|---|---|
| `minimo` | 2 |
| `apretado` | 4 |
| `corto` | 6 |
| `normal` | 8 |
| `comodo` | 10 |
| `medio` | 12 |
| `amplio` | 16 |
| `seccion` | 20 |
| `bloque` | 24 |

Convención: el relleno lateral de una pantalla es `seccion` (20) cuando el
contenido es texto y `amplio` (16) cuando son tarjetas, porque la tarjeta ya
trae su propio relleno.

#### Radios

| Token | Valor | Dónde |
|---|---|---|
| `chico` | 7 | Marca de categoría de 24 px, casillas |
| `medio` | 11 | Cuadros de ícono de 36 a 42 px |
| `boton` | 14 | Botones secundarios, campos, cuadros compactos |
| `caja` | 16 | Botones principales, cuadros de dato |
| `tarjeta` | 22 | Tarjetas del feed |
| `hoja` | 26 | Esquinas superiores de las hojas inferiores |
| `redondo` | 999 | Convierte cualquier caja en píldora o círculo |

#### Alturas de zona tocable

| Token | Valor | Regla |
|---|---|---|
| `minima` | 44 | **Mínimo de cualquier elemento tocable** |
| `control` | 48 | Botones dentro de tarjetas |
| `boton` | 52 | **Mínimo de un botón según el sistema** |
| `principal` | 56 | **Acción principal de una pantalla** |
| `destacada` | 58 | El «Comenzar» de la bienvenida |

#### Sombras

iOS y Android describen las sombras distinto, así que hay una función privada
que devuelve el juego correcto con `Platform.select` y cuatro constantes:

| Token | Desplazamiento Y | Difuminado | Opacidad | Elevación | Dónde |
|---|---|---|---|---|---|
| `suave` | 2 | 8 | 0,12 | 2 | Marcadores del mapa, chips flotantes |
| `media` | 4 | 10 | 0,20 | 4 | Botón central, marcadores grandes |
| `flotante` | 4 | 16 | 0,14 | 6 | Controles sobre el mapa |
| `hoja` | **-6** | 24 | 0,14 | 12 | Hoja inferior, la sombra va hacia arriba |

El color de sombra en iOS es siempre `#17231C`, el mismo de la tinta.

### 4.4 Las seis reglas de accesibilidad

Están escritas en la lámina del sistema visual y se cumplen en el código. No son
aspiraciones: son verificables.

| Regla | Cómo se cumple |
|---|---|
| **Toda zona tocable mide 44 px o más; las acciones principales 56** | `alturaTocable.minima` y `alturaTocable.principal`. `BotonCircular` usa 44 por defecto; los `Presionable` sueltos llevan `minHeight: 44` |
| **Un paso por pantalla en los flujos, con «Paso X de Y» siempre visible** | `EncabezadoDePaso` siempre muestra el contador y la `BarraDePasos`. Los tres flujos de varios pasos lo usan |
| **Íconos siempre acompañados de texto. Nunca solo color** | `Etiqueta` exige `texto`. Los estados llevan punto más palabra, y «Resuelto» lleva visto más palabra. Las categorías llevan cuadrado de color más ícono más nombre |
| **Contraste mínimo 4,5:1 en texto** | El gris de apoyo es `#56625B` sobre crema o papel. No hay texto gris más claro |
| **Tamaño de letra ajustable desde la bienvenida y en Ajustes** | `preferencias.factorTexto` con tres escalones (1, 1,15 y 1,3). El componente `Texto` lo aplica a todo |
| **Lenguaje cotidiano** | «En gestión» y no «Ticket asignado». «¿Sigue ahí?» y no «Validar vigencia» |

Dos implementaciones concretas que conviene no romper:

- `Texto` pasa `allowFontScaling={false}` a propósito. Si no lo hiciera, el
  sistema operativo escalaría encima del ajuste propio y el resultado sería
  impredecible.
- La preferencia `menosAnimaciones` apaga todas las animaciones de entrada y de
  presión. La consultan `Presionable`, `BarraDePasos`, `Interruptor` y las
  pantallas que usan `Animated.View`.

---

## 5. Catálogo de íconos

### 5.1 Cómo funciona

No hay librería de íconos. `src/diseno/iconos.ts` guarda **los 51 íconos como
datos**, y un único componente los dibuja. Los trazos fueron extraídos uno a uno
de los mockups, así que son los mismos `path`, no una aproximación.

Todos comparten tres reglas:

- Lienzo de **24 × 24**.
- Se pintan **con línea, nunca con relleno**, para que hereden el color del
  texto que acompañan.
- Extremos y uniones redondeados (`strokeLinecap` y `strokeLinejoin` en `round`).

El tipo de un trazo:

```ts
export type TrazoIcono =
  | { figura: 'linea'; d: string }
  | { figura: 'circulo'; cx: number; cy: number; r: number }
  | { figura: 'rectangulo'; x: number; y: number; ancho: number; alto: number; radio?: number };
```

Y el catálogo es un objeto `{ nombre: TrazoIcono[] }` declarado con
`satisfies Record<string, TrazoIcono[]>`, de donde sale
`export type NombreIcono = keyof typeof iconos`. Agregar un ícono es sumar una
entrada: el componente y el tipo se actualizan solos.

El grosor base es **1,9**, y sube a 2,1 o 2,2 en los íconos que acompañan
acciones principales y a 2,6 o 2,8 en los vistos pequeños dentro de píldoras.

### 5.2 Los 51 íconos

**Navegación y flechas (6)**

| Nombre | Qué dibuja | Dónde aparece |
|---|---|---|
| `flechaIzquierda` | Chevron a la izquierda | Volver, paso anterior |
| `flechaDerecha` | Chevron a la derecha | Siguiente, abrir detalle |
| `chevronAbajo` | Chevron hacia abajo | Filtros desplegables |
| `cerrar` | Cruz | Cerrar, cancelar |
| `visto` | Marca de verificación | Confirmado, resuelto, elegido |
| `mas` | Cruz vertical | Reportar, proponer, agregar |

**Barra de navegación (4)**

| Nombre | Dónde |
|---|---|
| `casa` | Pestaña Inicio |
| `mapa` | Pestaña Mapa |
| `portapapeles` | Pestaña Mis reportes |
| `campana` | Pestaña Avisos |

**Las ocho categorías de reporte (8)**

| Nombre | Categoría |
|---|---|
| `basura` | Basura o microbasural |
| `arbol` | Árboles y jardines |
| `plaga` | Plagas |
| `ruidoLuz` | Ruido o luz molesta |
| `calle` | Calles y veredas |
| `mobiliario` | Bancas, plazas y mobiliario |
| `patrimonio` | Patrimonio en riesgo |
| `otro` | Otro problema |

**Acciones sobre contenido (9)**

| Nombre | Dónde |
|---|---|
| `idea` | Propuestas |
| `pulgarArriba` | Apoyar, marcar útil |
| `globoDialogo` | Opinar, comentarios |
| `enviar` | Enviar reporte, enviar comentario |
| `compartir` | Compartir |
| `lapiz` | Editar, detalles |
| `descargar` | Descargar datos, exportar |
| `bandera` | Señalado por vecinos, primer reporte |
| `enlace` | Posible duplicado, unir reportes |

**Mapa y ubicación (5)**

| Nombre | Dónde |
|---|---|
| `pin` | Ubicación, logro de primer reporte |
| `mira` | Ir a mi ubicación |
| `capas` | Capas del mapa |
| `lupa` | Buscar |
| `embudo` | Más filtros |

**Contenido y multimedia (5)**

| Nombre | Dónde |
|---|---|
| `imagen` | Galería, foto de relleno |
| `camara` | Tomar foto |
| `documento` | Trabajos devueltos al barrio |
| `calendario` | Actividades |
| `grafico` | Observatorio |

**Personas e instituciones (5)**

| Nombre | Dónde |
|---|---|
| `persona` | Una persona |
| `personas` | Comunidad, voluntarios |
| `birrete` | Universidad, institución |
| `comercio` | Local asociado, beneficios |
| `medalla` | Logro nuevo |

**Estado, ayuda y confianza (9)**

| Nombre | Dónde |
|---|---|
| `informacion` | Notas informativas |
| `interrogacion` | Preguntas al vecino |
| `reloj` | Horario, observación por 30 días |
| `escudo` | Moderación, organización verificada |
| `ojo` | Privacidad, logro Ojo atento |
| `candado` | Sin contraseñas, datos protegidos |
| `sobre` | Correo |
| `deslizadores` | Ajustes |
| `hoja` | Logotipo de Barrio República |

### 5.3 Decisiones que hubo que tomar al extraerlos

Los mockups tenían 56 bloques SVG distintos pero varios eran el mismo dibujo
escrito de otra forma. Se consolidaron:

| Caso | Resolución |
|---|---|
| «Árbol» aparecía como dos `path` y como uno solo | Se dejó la versión de dos `path` |
| «Ruido o luz» tenía una variante con un arco y otra con dos | Se dejó la de dos arcos, que es la del sistema visual. La de un arco solo salía en el panel a 20 px |
| «Plagas» tenía una versión con `rect` y otra con todo en `path` | Se dejó la del `rect`, más limpia |
| «Otro» aparecía como tres puntos con `h.01` y como tres círculos | Se dejó la de tres círculos de radio 1,3 |

---

## 6. Componentes base

Viven en `src/componentes/base` y **no saben nada del dominio**. No conocen qué
es un reporte ni una propuesta: reciben texto, colores y funciones. Se importan
siempre desde el barril `@/componentes/base`.

Son 20 archivos (19 de componentes más el barril) que exportan 24 componentes.

---

### 6.1 `Texto`

El componente más importante del proyecto. **Todo el texto de la aplicación pasa
por aquí**, y eso es lo que hace que el ajuste de tamaño de letra funcione en
las 36 pantallas sin tocarlas una por una.

| Prop | Tipo | Por defecto | Qué hace |
|---|---|---|---|
| `tamano` | `number` | `escalaTexto.base` (17) | Tamaño en puntos |
| `familia` | `'titulo' \| 'tituloSemi' \| 'texto'` | `'texto'` | Elige la familia tipográfica |
| `peso` | `'normal' \| 'fuerte'` | `'normal'` | Solo aplica a la familia de texto |
| `color` | `string` | `colores.tinta` | |
| `interlineado` | `number` | sin definir | Multiplicador del alto de línea (1 a 1,45) |
| `alineacion` | `TextStyle['textAlign']` | sin definir | |
| `mayusculas` | `boolean` | sin definir | |
| `espaciado` | `number` | sin definir | Separación entre letras |

Hereda además todas las props de `Text` de React Native, incluidas `onPress`,
`numberOfLines` y `style`.

**Cómo resuelve la fuente.** Si `familia` es `'texto'` elige entre
`AtkinsonHyperlegible-Regular` y `-Bold` según `peso`. Si es `'titulo'` usa
`FiraSansCondensed-Bold` y si es `'tituloSemi'`, `-SemiBold`. **No usa
`fontWeight`**: la familia ya viene en el peso correcto, que es la forma de
evitar que el sistema sintetice una negrita falsa.

**Tres cosas que no se deben cambiar:**

- `allowFontScaling={false}`. Sin eso el sistema operativo escalaría encima del
  factor propio y el resultado sería impredecible.
- El tamaño final es `tamano * factorTexto`, leído de `usarPreferencias()`.
- El `lineHeight` también se multiplica, no solo el `fontSize`.

---

### 6.2 `Icono`

Dibuja cualquiera de los 51 íconos del catálogo recorriendo sus trazos y
emitiendo `Path`, `Circle` o `Rect` de `react-native-svg`.

| Prop | Tipo | Por defecto |
|---|---|---|
| `nombre` | `NombreIcono` | obligatorio |
| `tamano` | `number` | `22` |
| `color` | `string` | `'currentColor'` |
| `grosor` | `number` | `1.9` |

---

### 6.3 `Presionable`

Envuelve a `Pressable` de React Native con una reacción breve al tacto. **Se usa
en vez de `Pressable` directo en todo el proyecto**, para que botones, tarjetas y
chips respondan igual.

| Prop | Tipo | Por defecto | Qué hace |
|---|---|---|---|
| `escalaAlTocar` | `number` | `0.97` | Cuánto se achica. Más bajo se siente más marcado |
| `vibrar` | `boolean` | `false` | Vibración breve en las acciones que confirman algo |
| `style` | `StyleProp<ViewStyle>` | | |

Hereda el resto de las props de `Pressable`.

**Comportamiento.** Al presionar anima la escala con `withTiming` en 90 ms y al
soltar vuelve en 140 ms. Si la preferencia `menosAnimaciones` está activa, no
anima la entrada pero sí restituye la escala. La vibración es
`Haptics.ImpactFeedbackStyle.Light` y falla en silencio si la plataforma no la
soporta.

Valores de escala que usa el proyecto: `0.99` en casillas, `0.985` en tarjetas,
`0.98` en opciones, `0.97` por defecto, `0.95` en chips, `0.93` en el botón
central, `0.92` en botones circulares y `0.9` en marcadores del mapa.

---

### 6.4 `Boton`

| Prop | Tipo | Por defecto |
|---|---|---|
| `texto` | `string` | obligatorio |
| `onPress` | `() => void` | |
| `variante` | `VarianteBoton` | `'principal'` |
| `icono` | `NombreIcono` | |
| `iconoAlFinal` | `boolean` | `false` |
| `alto` | `number` | `alturaTocable.boton` (52) |
| `tamanoDeTexto` | `number` | `16` |
| `ancho` | `'completo' \| 'contenido'` | `'completo'` |
| `deshabilitado` | `boolean` | `false` |
| `vibrar` | `boolean` | `false` |
| `accesibilidad` | `string` | el propio `texto` |
| `style` | `StyleProp<ViewStyle>` | |

**Las seis variantes:**

| Variante | Fondo | Texto | Borde | Dónde |
|---|---|---|---|---|
| `principal` | `verde` | `papel` | | Acción principal sobre fondo claro |
| `secundaria` | transparente | `tinta` | 1,5 `bordeFuerte` | Alternativa |
| `tonal` | `menta` | `#174D34` | | Acción suave, estado ya cumplido |
| `brote` | `brote` | `bosque` | | Acción principal **sobre fondo bosque** |
| `contornoClaro` | transparente | `papel` | 1,5 `bosqueBorde` | Alternativa sobre fondo bosque |
| `peligro` | `alerta` | `blanco` | | Ocultar un reporte. Única aparición |

El radio es siempre `radio.caja` (16). Deshabilitado baja la opacidad a 0,45 y
quita el `onPress`. El ícono mide `tamanoDeTexto + 3` antes del texto o
`tamanoDeTexto + 4` después.

Para dos botones del mismo ancho se usa `<Fila separacion={10}>` con
`style={{ flex: 1 }}` en cada uno. No hay un componente de fila de botones: sería
una abstracción que esconde algo que se lee mejor explícito.

---

### 6.5 `BotonCircular`

El botón redondo de 44 px que encabeza casi todas las pantallas.

| Prop | Tipo | Por defecto |
|---|---|---|
| `icono` | `NombreIcono` | obligatorio |
| `accesibilidad` | `string` | **obligatorio** |
| `onPress` | `() => void` | |
| `tono` | `'claro' \| 'oscuro'` | `'claro'` |
| `tamano` | `number` | `44` |

En tono claro es fondo `papel` con borde de 1 px `borde`. En tono oscuro es
transparente con borde de 1,5 px `bosqueBorde` e ícono `papel`.

`accesibilidad` es obligatoria porque el botón no tiene texto visible.

---

### 6.6 `Tarjeta`

| Prop | Tipo | Por defecto |
|---|---|---|
| `children` | `ReactNode` | obligatorio |
| `tono` | `'papel' \| 'bosque' \| 'menta' \| 'crema'` | `'papel'` |
| `separacion` | `number` | `12` |
| `relleno` | `number` | `16` |
| `onPress` | `() => void` | |
| `accesibilidad` | `string` | |
| `recortar` | `boolean` | `false` |
| `style` | `StyleProp<ViewStyle>` | |

| Tono | Fondo | Borde |
|---|---|---|
| `papel` | `papel` | 1 px `borde` |
| `bosque` | `bosque` | sin borde |
| `menta` | `menta` | sin borde |
| `crema` | `crema` | 1 px `borde` |

Radio siempre `radio.tarjeta` (22). Si se entrega `onPress` la tarjeta completa
se vuelve tocable con escala 0,985. **`recortar` pone `overflow: hidden` y anula
el relleno**: se usa cuando la tarjeta lleva una foto de cabecera a sangre.

El tono `bosque` está reservado para una sola cosa: lo que avanzó en un reporte
propio. Es el recurso visual más fuerte de la aplicación y pierde sentido si se
reparte.

---

### 6.7 `Chip`

Filtro en forma de pastilla.

| Prop | Tipo | Por defecto |
|---|---|---|
| `texto` | `string` | obligatorio |
| `activo` | `boolean` | `false` |
| `onPress` | `() => void` | |
| `icono` | `NombreIcono` | |
| `alto` | `number` | `40` |
| `tamanoDeTexto` | `number` | `15` |
| `flotante` | `boolean` | `false` |
| `variante` | `'relleno' \| 'marcado'` | `'relleno'` |

| Estado | `relleno` | `marcado` |
|---|---|---|
| Activo | Fondo `verde`, texto `papel` | Fondo `menta`, texto `#174D34`, borde 2 px `verde` |
| Inactivo | Fondo `papel`, borde 1,5 px `bordeFuerte` | igual |

`flotante` reemplaza el borde por `sombras.suave` y usa `bosque` como fondo
activo. Es para los chips que van encima del plano del mapa.

La diferencia entre variantes importa: `relleno` es para filtros donde se elige
uno, `marcado` para listas donde se eligen varios.

`FilaDeChips` es un `ScrollView` horizontal sin barra visible con relleno
lateral, exportado desde el mismo archivo.

---

### 6.8 `Etiqueta`

Píldora de estado. **Nunca comunica con el color solo**: siempre lleva la
palabra y, cuando corresponde, un punto o un ícono.

| Prop | Tipo | Por defecto |
|---|---|---|
| `texto` | `string` | **obligatorio** |
| `fondo` | `string` | obligatorio |
| `color` | `string` | obligatorio |
| `punto` | `string` | |
| `icono` | `NombreIcono` | |
| `alto` | `number` | `28` |
| `tamanoDeTexto` | `number` | `13` |

El punto mide 7 px. El ícono se dibuja con grosor 2,6. Radio `redondo`,
`alignSelf: 'flex-start'` para que no se estire.

---

### 6.9 `CampoTexto`

| Prop | Tipo | Por defecto |
|---|---|---|
| `valor` | `string` | obligatorio |
| `onCambiar` | `(valor: string) => void` | obligatorio |
| `etiqueta` | `string` | |
| `ayuda` | `string` | |
| `marcaDeAgua` | `string` | |
| `lineas` | `number` | `1` |
| `maximoDeCaracteres` | `number` | |
| `tipoDeTeclado` | `'texto' \| 'correo'` | `'texto'` |
| `autoenfocar` | `boolean` | `false` |

**El borde cambia cuando el campo está enfocado o tiene contenido**: pasa de 1,5
px `bordeFuerte` a 2 px `verde`. Es la señal de dónde está el foco.

Con `lineas > 1` se vuelve multilínea, alinea el texto arriba y calcula una
altura mínima de `26 * lineas * factorTexto + 24`. Con una sola línea la altura
es `56 * max(1, factorTexto * 0.95)`.

El tamaño de letra es 16,5 multiplicado por el factor, y lleva
`allowFontScaling={false}` por la misma razón que `Texto`.

---

### 6.10 `Opcion` y `Casilla`

`Opcion` es una fila seleccionable de formulario. Reemplaza al par radio más
etiqueta de los mockups con **una sola zona tocable grande**, que es más fácil
de usar con una mano.

| Prop | Tipo | Por defecto |
|---|---|---|
| `texto` | `string` | obligatorio |
| `activa` | `boolean` | obligatorio |
| `onPress` | `() => void` | obligatorio |
| `detalle` | `string` | |
| `icono` | `NombreIcono` | |
| `seleccion` | `'unica' \| 'multiple'` | `'multiple'` |
| `compacta` | `boolean` | `false` |
| `style` | `StyleProp<ViewStyle>` | |

| | Normal | Compacta |
|---|---|---|
| Alto mínimo | 56 | 52 |
| Radio | 16 | 14 |
| Relleno lateral | 14 | 8 |
| Marca de selección | Sí | No |
| Alineación | Izquierda, con detalle | Centrada, sin detalle |

Activa: fondo `menta`, borde 2 px `verde`, texto en negrita. Inactiva: fondo
`papel`, borde 1,5 px `borde`.

`seleccion` solo cambia la forma de la marca (círculo si es única, cuadrado de
radio 7 si es múltiple) y el `accessibilityRole` (`radio` o `checkbox`).

**La variante compacta no envuelve el texto en una vista.** Si lo hiciera con
`flex: 0`, la caja no reservaría ancho y la palabra se partiría letra por letra,
en vertical. Esto pasó y se corrigió; el comentario en el código lo advierte.

`Casilla` es la casilla suelta de las líneas de consentimiento. Recibe `activa`,
`onPress` y `children` libres.

---

### 6.11 `Interruptor`

Switch dibujado a mano con dos `Animated.View`.

| Prop | Tipo |
|---|---|
| `activo` | `boolean` |
| `onCambiar` | `(activo: boolean) => void` |
| `accesibilidad` | `string` |

Carril de 52 × 32 con radio `redondo` y relleno 3. Perilla de 26 × 26 en `papel`
que se desplaza 20 px. El carril pasa de `bordeFuerte` a `verde`. La transición
dura 180 ms, o 0 si `menosAnimaciones` está activa.

**Se dibuja a mano y no se usa el `Switch` del sistema** porque tiene que verse
igual en Android y en iOS, y con los colores del barrio.

---

### 6.12 `Contador`

| Prop | Tipo | Por defecto |
|---|---|---|
| `valor` | `number` | obligatorio |
| `onCambiar` | `(valor: number) => void` | obligatorio |
| `minimo` | `number` | `0` |
| `maximo` | `number` | `99` |
| `accesibilidad` | `string` | obligatorio |

Caja de 44 px de alto con borde 1,5 px, un botón de 32 × 36 a cada lado con los
signos `−` y `+`, y el número al centro con ancho mínimo 22. Los botones en el
tope bajan a opacidad 0,35 y dejan de responder.

---

### 6.13 `ListaAgrupada`, `FilaDeLista` y `Sigla`

El patrón de tarjeta con filas y divisorias que usan Intereses, Capas del mapa,
Ajustes, Perfil e Inscripción.

`ListaAgrupada`: `children`, `encabezado` opcional en mayúsculas sobre el grupo,
y `style`. Dibuja una caja de fondo `papel`, borde 1 px `borde`, radio 20 y
`overflow: hidden`.

`FilaDeLista`:

| Prop | Tipo | Por defecto |
|---|---|---|
| `titulo` | `string` | obligatorio |
| `detalle` | `string` | |
| `adorno` | `ReactNode` | | Elemento a la izquierda |
| `control` | `ReactNode` | | Elemento a la derecha |
| `onPress` | `() => void` | |
| `ultima` | `boolean` | `false` | Sin divisoria inferior |
| `conFlecha` | `boolean` | `false` |
| `peligrosa` | `boolean` | `false` | Título en rojo `alerta` |

Alto mínimo 64, relleno 16 lateral y 10 vertical, separación 14. La divisoria es
de 1 px en `#EEE7D7`, un color que **solo existe aquí** y por eso está como
constante privada del archivo y no en la paleta.

`Sigla` es el cuadro de 40 × 40 con radio 12 y tres letras que usan los
intereses del registro.

---

### 6.14 `Aviso`

Nota breve que explica algo o pide cuidado.

| Prop | Tipo | Por defecto |
|---|---|---|
| `texto` | `string` | | Excluyente con `children` |
| `children` | `ReactNode` | | Para texto con partes en negrita |
| `tono` | `TonoAviso` | `'informativo'` |
| `icono` | `NombreIcono` | el del tono |
| `tamanoDeTexto` | `number` | `14` |
| `style` | `StyleProp<ViewStyle>` | |

| Tono | Fondo | Texto | Ícono |
|---|---|---|---|
| `informativo` | `#DCE7F3` | `#244C78` | `informacion` |
| `cuidado` | `#F5E6C8` | `#6F4A0E` | `ojo` |
| `logro` | `menta` | `#174D34` | `visto` |
| `neutro` | `crema` | `grisTexto` | `informacion` |

Radio `medio` (11), relleno 10 vertical y 12 lateral, ícono de 18 px alineado
arriba.

---

### 6.15 `BarraDePasos`

Barra de avance por tramos. Cada tramo es un paso, así se ve cuánto falta sin
leer el texto.

| Prop | Tipo | Por defecto |
|---|---|---|
| `paso` | `number` | obligatorio |
| `total` | `number` | obligatorio |
| `color` | `string` | `verde` |
| `colorPendiente` | `string` | `borde` |
| `alto` | `number` | `6` |

Cada tramo es un `Animated.View` con `flex: 1`, radio `redondo` y separación 4,
que anima su color de fondo en 260 ms. Lleva `accessibilityRole="progressbar"`
con la etiqueta «Paso X de Y».

**Esta barra necesita que su contenedor no la aplaste.** Dentro de una `Fila`
(que centra), hay que envolverla en `<View style={{ flex: 1 }}>`. Ver capítulo 14.

---

### 6.16 `BarraInferior`

Barra fija del borde inferior con la acción principal.

| Prop | Tipo | Por defecto |
|---|---|---|
| `children` | `ReactNode` | obligatorio |
| `fondo` | `string` | `crema` |
| `separacion` | `number` | `10` |
| `alFinal` | `boolean` | `true` |
| `style` | `StyleProp<ViewStyle>` | |

Borde superior de 1 px, relleno lateral 20, superior 16 e inferior
`max(margenInferiorSeguro, 16)`. Con `alFinal` pone `marginTop: 'auto'`, que la
empuja al borde; se desactiva cuando la barra va dentro de un contenido que se
desplaza.

---

### 6.17 `EncabezadoDePaso`

Cabecera común de los tres flujos de varios pasos.

| Prop | Tipo | Por defecto |
|---|---|---|
| `paso` | `number` | obligatorio |
| `total` | `number` | obligatorio |
| `nombre` | `string` | | El nombre del paso |
| `onVolver` | `() => void` | obligatorio |
| `esPrimerPaso` | `boolean` | `false` |
| `textoDeCancelar` | `string` | `'Cancelar'` |
| `onOmitir` | `() => void` | |

En el primer paso el botón es una cruz y cancela el flujo completo. En los demás
es una flecha y retrocede un paso. Muestra `Paso X de Y · Nombre` en 14 px
`verde` negrita, y debajo la `BarraDePasos`.

---

### 6.18 `Pantalla`

Marco de cada pantalla. Resuelve el fondo y los márgenes seguros.

| Prop | Tipo | Por defecto |
|---|---|---|
| `children` | `ReactNode` | obligatorio |
| `fondo` | `string` | `crema` |
| `desplazable` | `boolean` | `false` |
| `espacioAlFinal` | `number` | `0` |
| `sinMargenInferior` | `boolean` | `false` |
| `style` | `StyleProp<ViewStyle>` | |

El margen superior es `margenSeguro.top + 12`, que reproduce los 56 px fijos de
los mockups en un teléfono real. El inferior es `margenSeguro.bottom`.

`desplazable` envuelve el contenido en un `ScrollView` sin barra visible. Se usa
en las pantallas cuyo mockup mide más de 844 px de alto.

---

### 6.19 `Fila` y `Columna`

Primitivas de disposición. Existen para que las pantallas no repitan
`flexDirection`, `alignItems` y `gap` cientos de veces.

| Prop | Tipo | Por defecto en `Fila` | Por defecto en `Columna` |
|---|---|---|---|
| `children` | `ReactNode` | | |
| `separacion` | `number` | sin definir | sin definir |
| `alinear` | `ViewStyle['alignItems']` | **`'center'`** | sin definir |
| `repartir` | `ViewStyle['justifyContent']` | sin definir | sin definir |
| `crecer` | `number` | sin definir | sin definir |
| `style` | `StyleProp<ViewStyle>` | | |
| `accesibilidad` | `string` | | |

**El valor por defecto `alinear: 'center'` de `Fila` es la causa de un error
sutil**: si un hijo solo tiene `flex` y no altura, se colapsa a cero y
desaparece sin error. Cuando eso pasa hay que poner `alinear="stretch"`. Ver
capítulo 14.

---

## 7. Componentes de aplicación

Viven en `src/componentes/app` y **sí conocen el dominio**: reciben un `Reporte`,
una `Propuesta` o una `Actividad` completos y saben cómo dibujarlos. Se importan
desde el barril `@/componentes/app`.

Son 13 archivos (12 de componentes más el barril) que exportan 20 componentes.

---

### 7.1 `Avatar`

Círculo con la inicial de la persona. **No hay fotos de perfil en el diseño**: se
identifica a cada quien por su seudónimo y su vínculo con el barrio.

| Prop | Tipo | Por defecto |
|---|---|---|
| `persona` | `Persona` | obligatorio |
| `tamano` | `number` | `40` |
| `conAro` | `boolean` | `false` |
| `color` | `string` | `bosque` si es organización, `verde` si no |

`conAro` agrega un borde de 3 px en `menta`, que es como se ve el avatar del
encabezado de Inicio. La inicial mide `tamano * 0.42`, o `tamano * 0.34` cuando
tiene dos letras, como «RC» de República Circular.

---

### 7.2 `Encabezado`

Cabecera de las pantallas de detalle.

| Prop | Tipo | Por defecto |
|---|---|---|
| `titulo` | `string` | | Opcional: sin él queda solo el botón de volver |
| `onVolver` | `() => void` | |
| `subtitulo` | `string` | |
| `accion` | `ReactNode` | | Contenido al extremo derecho |
| `tamanoDeTitulo` | `number` | `28` |
| `tono` | `'claro' \| 'oscuro'` | `'claro'` |
| `textoDeVolver` | `string` | `'Volver'` |

El título usa la familia `titulo` con interlineado 1,1. El subtítulo va en 14 px
gris. Relleno lateral 20 e inferior 8.

---

### 7.3 `BarraNavegacion`

La barra de cinco destinos. Recibe `BottomTabBarProps` de `expo-router/js-tabs`.

**Los cinco destinos**, declarados en un mapa dentro del archivo:

| Ruta | Etiqueta | Ícono |
|---|---|---|
| `inicio` | Inicio | `casa` |
| `mapa` | Mapa | `mapa` |
| `reportar` | Reportar | `mas` |
| `mis-reportes` | Mis reportes | `portapapeles` |
| `avisos` | Avisos | `campana` |

**Reportar va al centro, grande y con texto**, porque es la puerta de entrada de
todo el sistema y la historia de usuario más importante. Se dibuja como un
círculo de 58 px en `verde` con `marginTop: -30`, es decir sobresaliendo por
encima de la barra, con borde de 4 px en `papel` y `sombras.media`.

Los otros cuatro destinos usan una pastilla de 52 × 30: cuando están activos se
rellena de `menta` y el ícono y la etiqueta pasan a `verde` en negrita.

`Avisos` muestra un contador rojo de `avisosSinLeer`, leído de `usarBarrio()`.
Es un círculo de 18 px mínimo en `alerta` con el número en 11 px blanco, y la
etiqueta de accesibilidad pasa a decir «Avisos, 3 sin leer».

Relleno inferior `max(margenSeguro.bottom, 20)`, borde superior 1 px.

---

### 7.4 `MarcaDeCategoria`, `RotuloDeCategoria` y `ChipDeCategoria`

Tres formas de mostrar una categoría, en el mismo archivo.

**`MarcaDeCategoria`**: el cuadrado de color con el ícono.

| Prop | Tipo | Por defecto |
|---|---|---|
| `categoria` | `IdCategoria` | obligatorio |
| `tamano` | `number` | `24` |
| `redondeo` | `number` | `radio.chico` (7) |

El ícono mide `tamano * 0.62` y es siempre blanco. Tamaños que usa el proyecto:
24 en rótulos, 38 en resúmenes y listas, 40 en «Mis reportes», 42 en la rejilla
de categorías.

**`RotuloDeCategoria`**: la marca más el nombre en mayúsculas al lado, en el
color de la categoría. Acepta un `detalle` que se concatena con punto medio, por
ejemplo `BASURA · MICROBASURAL`.

**`ChipDeCategoria`**: píldora con la categoría ya elegida. Acompaña a los pasos
2, 4 y 5 del asistente de reporte para que siempre se vea sobre qué se está
reportando. Alto 34, fondo `papel`, borde 1 px.

---

### 7.5 `EtiquetaDeEstado` y `EtiquetaDeEtapa`

Envuelven a `Etiqueta` para que ninguna pantalla tenga que acordarse de los
colores de cada estado. Reciben `estado` o `etapa` y, opcionalmente, `alto` y
`tamanoDeTexto`.

---

### 7.6 `BarraDeEstadoDeReporte`, `TarjetaDeMiReporte` y `TarjetaDeReporte`

**`BarraDeEstadoDeReporte`** dibuja el avance de cuatro tramos.

| Prop | Tipo | Por defecto |
|---|---|---|
| `estado` | `IdEstado` | obligatorio |
| `sobreBosque` | `boolean` | `false` |

La regla de color es específica y vale la pena entenderla:

- Los tramos **anteriores** al actual van en `verde`.
- El tramo **actual** toma el color del punto de su propio estado: gris en
  Recibido, azul en Verificado, ocre en En gestión, verde en Resuelto.
- Los tramos **siguientes** van en `borde`.

Así el color refuerza lo que dice la palabra sin reemplazarla.

Con `sobreBosque`, los recorridos pasan a `brote`, los pendientes a
`bosqueBarra` y el actual de En gestión a `ambarSobreBosque`.

**`TarjetaDeMiReporte`** es la fila de la lista «Mis reportes»: marca de
categoría de 40, título y resumen, punto rojo opcional de novedad, la barra de
estado, y al pie la píldora con `Estado · paso X de 4` y los confirmantes a la
derecha. Radio 20, relleno 14.

| Prop | Tipo |
|---|---|
| `reporte` | `Reporte` |
| `conNovedad` | `boolean` |
| `onPress` | `() => void` |

**`TarjetaDeReporte`** es la del feed público: foto de cabecera si existe,
rótulo de categoría y píldora de estado en una fila, título en 17 y resumen en
14 gris. Usa `recortar` para que la foto llegue a los bordes.

---

### 7.7 `TarjetaDePropuesta` y `FilaDePropuesta`

**`TarjetaDePropuesta`** es la del feed.

| Prop | Tipo |
|---|---|
| `propuesta` | `Propuesta` |
| `onPress` | `() => void` |
| `onApoyar` | `() => void` |
| `onOpinar` | `() => void` |
| `notaDeApoyo` | `string` opcional |

Lleva el rótulo `PROPUESTA` con ícono de idea, la píldora de etapa, el título, la
línea de autoría con el vínculo y a qué reportes responde, la nota de apoyo
institucional si existe, y los dos botones. **El botón de apoyar cambia de
variante**: `principal` si todavía no la apoyas, `tonal` si ya lo hiciste, y el
texto pasa de «Apoyar · 64» a «Apoyada · 65».

**`FilaDePropuesta`** es la de la lista ordenada por prioridad: lleva su número
de orden en grande a la izquierda, que es lo que comunica la priorización.

---

### 7.8 `CuadroDeFecha`, `TarjetaDeActividad` y `FilaDeActividad`

**`CuadroDeFecha`** es el bloque con `SÁB / 14 / NOV`. Acepta `ancho` y un `tono`
de `'calido'` (fondo `#F5E6C8`, texto `#6F4A0E`) o `'menta'`, que se usa cuando
la persona ya está inscrita.

**`TarjetaDeActividad`**: el cuadro de fecha a la izquierda y a la derecha el
rótulo `ACTIVIDAD · 10:00`, el título, cuántos inscritos y cuántos voluntarios
faltan, y el botón «Me sumo», que pasa a «Ya me sumé» si corresponde.

**`FilaDeActividad`**: versión compacta sin botón, con cuadro de 56.

---

### 7.9 `LineaDeTiempo`

El recorrido de un reporte, de Recibido a Resuelto. Recibe solo `{ reporte }`.

Dibuja un paso por cada evento de `reporte.seguimiento`:

- **Círculo de 30 px.** Si el evento ya ocurrió va relleno con un visto blanco;
  si es el actual lleva además un aro de 5 px del color de fondo de su estado.
  Si no ocurrió, va vacío con borde de 2,5 px `bordeFuerte`.
- **Línea vertical de 3 px** que conecta con el siguiente, en `verde` si ya pasó
  y en `borde` si no. El último paso no la lleva.
- **Título** en 16,5. Si es el actual agrega ` · ahora` en el color del estado.
- **Detalle** en 14 gris, con la fecha delante cuando existe.

**Los pasos que todavía no ocurren se muestran igual, apagados y con la frase
que explica qué va a pasar.** Que el vecino sepa de antemano cómo sigue el
proceso es parte de la promesa de la aplicación.

---

### 7.10 `MapaBarrio`

El plano del barrio, dibujado en SVG a escala del mockup.

| Prop | Tipo |
|---|---|
| `children` | `(ubicar: Ubicador) => ReactNode` |
| `style` | `StyleProp<ViewStyle>` |
| `desplazamiento` | `PuntoEnMapa` opcional |

Exporta además `ANCHO_DEL_PLANO = 390` y `ALTO_DEL_PLANO = 844`, que son las
coordenadas del diseño.

**Qué dibuja**, con las calles reales del barrio:

| Elemento | Detalle |
|---|---|
| Fondo | Rectángulo completo en `mapaFondo` |
| Áreas verdes | `(38, 222, 76×110, r6)` y `(212, 482, 70×108, r6)` en `mapaVerde` |
| Manzana | `(300, 352, 62×40, r5)` en `mapaManzana` |
| Alameda | `M0 74H390` con grosor 28 |
| Calles horizontales | `M0 212 / 342 / 472 / 602 / 732` con grosor 11 |
| Calles verticales | `x = 30` (12), `120` (9), `202` (18), `292` (16), `372` (10) |
| Límite norte | La Alameda repetida en `mapaLimite`, grosor 2, segmentada `8 8` |
| Nombres horizontales | ALAMEDA, SAZIÉ, GRAJALES, DOMEYKO, TOESCA, GORBEA |
| Nombres verticales | AV. REPÚBLICA, AV. EJÉRCITO, AV. ESPAÑA, rotados 90° |

Los nombres van en 10 px, `AtkinsonHyperlegible-Bold`, color `mapaTexto`,
separación entre letras 0,4.

**Cómo encaja con los marcadores.** El componente se mide con `onLayout` y
calcula:

```
escala = max(ancho / 390, alto / 844)
izquierda = (ancho - 390 * escala) / 2 - desplazamientoX * escala
arriba    = (alto  - 844 * escala) / 2 - desplazamientoY * escala
```

Con eso el plano cubre toda la pantalla sin dejar franjas, y entrega a sus hijos
una función `ubicar(punto, tamanoDelMarcador)` que devuelve el estilo absoluto
donde va cada chincheta. **Los marcadores reciben su posición desde fuera**, y
por eso cuando se reemplace este componente por OpenStreetMap seguirán
funcionando.

---

### 7.11 `MarcadorMapa`, `GrupoDeMarcadores` y `MiUbicacion`

**`MarcadorMapa`**: la chincheta de un elemento.

| Prop | Tipo | Por defecto |
|---|---|---|
| `icono` | `NombreIcono` | obligatorio |
| `color` | `string` | obligatorio |
| `accesibilidad` | `string` | obligatorio |
| `posicion` | `ViewStyle` | obligatorio, viene de `ubicar` |
| `tamano` | `number` | `40` |
| `forma` | `'circulo' \| 'cuadrado'` | `'circulo'` |
| `seleccionado` | `boolean` | `false` |
| `onPress` | `() => void` | |

**Los reportes van en círculo y las propuestas y actividades en cuadrado**, para
distinguirlos sin depender del color. Borde blanco de 3 px, o 4 si está
seleccionado. El aro de selección se dibuja como un marco de 4 px en `bosque`
detrás del marcador, usando relleno en el contenedor, porque React Native no
tiene `outline`.

**`GrupoDeMarcadores`**: círculo de 48 px en `bosque` con la cantidad en blanco,
para cuando hay elementos muy juntos.

**`MiUbicacion`**: punto de 22 px en `ubicacionPropia` con borde blanco de 4 px.

---

### 7.12 `FotoSimulada`

Marcador de posición de una fotografía. Dibuja la misma trama diagonal de los
mockups con un `Pattern` de SVG de 24 × 24 con una línea diagonal de 12 px de
grosor, más el ícono `imagen` al centro.

| Prop | Tipo |
|---|---|
| `alto` | `number` |
| `rotulo` | `string` opcional, por ejemplo «Antes · 3 nov» |
| `accesibilidad` | `string` opcional |
| `style` | `StyleProp<ViewStyle>` |

**Al conectar el almacenamiento, este componente se reemplaza por la imagen y el
resto de las pantallas no cambia.**

---

## 8. Modelo de dominio

Tres archivos en `src/dominio`. Aquí vive el **significado**: qué categorías
existen, por qué estados pasa un reporte y qué forma tiene cada cosa. Los
colores de este capítulo no están en la paleta de `src/diseno` a propósito: no
son decoración, son parte del significado.

---

### 8.1 Las ocho categorías de reporte · `categorias.ts`

Toman la taxonomía del catastro socioambiental 2022 y de la historia de usuario
1. **El orden importa**: es el que ve la persona en la pantalla «Qué pasa».

| id | Etiqueta larga | Etiqueta corta | En tarjeta | Color | Ícono |
|---|---|---|---|---|---|
| `basura` | Basura o microbasural | Basura | BASURA | `#7A4A1F` | `basura` |
| `arboles` | Árboles y jardines | Árboles y jardines | ÁRBOLES | `#2E6B3F` | `arbol` |
| `plagas` | Plagas | Plagas | PLAGAS | `#6B4380` | `plaga` |
| `ruido` | Ruido o luz molesta | Ruido o luz | RUIDO O LUZ | `#2C5A8C` | `ruidoLuz` |
| `calles` | Calles y veredas | Calles y veredas | CALLES Y VEREDAS | `#4A5560` | `calle` |
| `mobiliario` | Bancas, plazas y mobiliario | Mobiliario y plazas | MOBILIARIO | `#B0581A` | `mobiliario` |
| `patrimonio` | Patrimonio en riesgo | Patrimonio | PATRIMONIO | `#9C3A33` | `patrimonio` |
| `otro` | Otro problema | Otro | OTRO | `#56625B` | `otro` |

**Por qué tres etiquetas.** La larga se usa al elegir categoría y en los
resúmenes, donde hay espacio. La corta va en chips y fichas. La de tarjeta va en
mayúsculas encabezando cada tarjeta de reporte. Tenerlas separadas evita que
cada pantalla improvise su propio recorte.

El archivo exporta:

```ts
export const idsDeCategoria = [...] as const;
export type IdCategoria = (typeof idsDeCategoria)[number];
export const categorias: Record<IdCategoria, Categoria>;
export const listaDeCategorias: Categoria[];  // en el orden de la pantalla
```

---

### 8.2 Los cuatro estados del reporte · `estados.ts`

Ciclo de vida de un reporte. **El lenguaje es cotidiano a propósito**: la regla
del sistema visual pide decir «En gestión» y no «Ticket asignado».

| id | Etiqueta | Fondo | Texto | Punto | Ícono | Paso |
|---|---|---|---|---|---|---|
| `recibido` | Recibido | `#E6E8EC` | `#3F4855` | `#5A6472` | | 1 |
| `verificado` | Verificado | `#DCE7F3` | `#244C78` | `#2C5A8C` | | 2 |
| `gestion` | En gestión | `#F5E6C8` | `#6F4A0E` | `#A86E1C` | | 3 |
| `resuelto` | Resuelto | `#DCEBD8` | `#174D34` | | `visto` | 4 |

**Resuelto es el único que lleva ícono en vez de punto.** Es deliberado: el
estado final merece una señal distinta, y además cumple la regla de no comunicar
solo con color.

#### Transiciones

| De | A | Qué la dispara |
|---|---|---|
| (nuevo) | `recibido` | Publicar un reporte |
| `recibido` | `verificado` | **Tres confirmaciones de vecinos**, o un moderador |
| cualquiera | cualquiera | Un gestor desde el panel de moderación |

La regla de las tres confirmaciones está implementada en `confirmarReporte`
dentro de `src/estado/barrio.tsx`, y es la que explica la pantalla de envío:
«Pasa a Verificado cuando otros vecinos lo confirman o lo revisa un moderador».

No hay transición automática a `gestion` ni a `resuelto`: esas las marca una
persona de la organización, porque implican que alguien tomó acción.

Exporta `totalDePasosDeEstado = 4`.

---

### 8.3 Las cinco etapas de una propuesta · `estados.ts`

A diferencia del reporte, **avanzar aquí depende de la comunidad y no de la
organización**.

| id | Etiqueta | Explicación | Fondo | Texto | N° |
|---|---|---|---|---|---|
| `idea` | Idea | recién publicada | `#E6E8EC` | `#3F4855` | 1 |
| `conversacion` | En conversación | se mejora con vecinos | `#DCE7F3` | `#244C78` | 2 |
| `priorizada` | Priorizada | apoyos y reportes la suben | `#F5E6C8` | `#6F4A0E` | 3 |
| `enMarcha` | En marcha | tiene equipo y fecha | `#1D5E40` | `#FFFFFF` | 4 |
| `lograda` | Lograda | con evidencia de cierre | `#0F3D2A` | `#6DBE5C` | 5 |

Las dos últimas invierten el contraste (fondo oscuro, texto claro) porque son
logros y tienen que destacar en una lista.

El ciclo completo que describe el sistema visual:

> Reporte → propuesta → conversación → prioridad → convocatoria → acción →
> evidencia → dato histórico.

En el prototipo una propuesta nueva nace siempre en `idea`. Las transiciones
posteriores no están automatizadas: son decisión de la organización y quedaron
como pendiente de definición (el «TODO 1» de la bitácora, el mecanismo de
priorización).

---

### 8.4 Los tipos · `tipos.ts`

Los nombres y las formas siguen lo que muestran los mockups y las historias de
usuario, **de modo que al conectar Supabase cada tipo tenga una tabla
equivalente**.

#### `Persona`

```ts
type Persona = {
  id: string;
  nombre: string;        // seudonimo visible, nunca el nombre real ni el RUT
  inicial: string;       // letra del avatar
  vinculo: string;       // "Vive en el barrio"
  esOrganizacion?: boolean;
};
```

#### `PuntoEnMapa`

```ts
type PuntoEnMapa = { x: number; y: number };
```

Coordenadas sobre el plano de 390 × 844 del diseño. Cuando exista
OpenStreetMap, esto pasa a ser latitud y longitud.

#### `Reporte`

```ts
type Reporte = {
  id: string;
  categoria: IdCategoria;
  subtipo?: string;            // "microbasural"
  titulo: string;
  direccion: string;           // "Sazié con Av. República"
  estado: IdEstado;
  descripcion?: string;
  comoSeFormo?: string;
  desdeCuando?: string;
  publicado: string;           // texto, como lo muestra el mockup
  resumen: string;             // linea de apoyo en las listas
  confirmaciones: number;
  senalamientos?: number;      // vecinos que lo marcaron como inexistente
  autor: Persona | null;       // null si es anonimo
  esMio: boolean;
  tieneFoto: boolean;
  posicion: PuntoEnMapa;
  seguimiento: EventoDeSeguimiento[];
  propuestas: string[];        // ids de propuestas que buscan resolverlo
  comentarios: Comentario[];
};
```

Tres decisiones a destacar:

- **`autor` admite `null`**, que es lo que representa un reporte anónimo. No hay
  un campo `esAnonimo` aparte: la ausencia de autor es el anonimato.
- **Las fechas son texto**, no `Date`. Los mockups muestran «hace 2 h», «Enviado
  el 28 oct», «3 nov 2026, 10:24». Formatear eso desde una fecha real exigiría
  una librería que el prototipo no necesita, y las cadenas exactas son parte de
  la fidelidad con el diseño.
- **`subtipo`** existe porque el feed dice «¿Sigue el microbasural en...?» y la
  ficha dice `BASURA · MICROBASURAL`. Es una precisión dentro de la categoría.

#### `EventoDeSeguimiento`

```ts
type EventoDeSeguimiento = {
  estado: IdEstado;
  fecha?: string;      // vacia si todavia no ocurre
  detalle: string;     // que paso, o que pasara cuando llegue el turno
  ocurrio: boolean;
};
```

Cada reporte lleva **los cuatro eventos siempre**, ocurridos o no. Por eso la
línea de tiempo puede mostrar los pasos futuros con su explicación.

#### `Comentario` y `PosturaComentario`

```ts
type PosturaComentario = 'mejora' | 'duda' | 'aFavor' | 'enContra' | 'respuesta';

type Comentario = {
  id: string;
  autor: Persona;
  cuando: string;              // "4 d"
  postura: PosturaComentario;
  texto: string;
  utiles: number;
  incorporado?: string;        // "La autora la sumó a la propuesta"
  respuestas: Comentario[];
};
```

**La postura es obligatoria.** Declararla es lo que permite filtrar la
conversación y que la autora lea rápido qué mejora, qué duda y qué objeta.
`respuesta` es la postura de las réplicas, que no muestran píldora.

#### `ApoyoNecesario` y `ApoyoInstitucional`

```ts
type ApoyoNecesario = {
  id: string;
  titulo: string;
  detalle: string;
  conseguido?: number;   // solo cuando la ayuda se cuenta en personas
  necesario?: number;
};

type ApoyoInstitucional = {
  id: string;
  nombre: string;
  detalle: string;
  icono: 'birrete' | 'comercio';
};
```

#### `Propuesta`

```ts
type Propuesta = {
  id: string;
  titulo: string;
  eje: string;                      // "Residuos"
  etapa: IdEtapa;
  autor: Persona;
  publicada: string;
  idea: string;
  mejoraIncorporada?: string;
  apoyos: number;
  reportesQueResuelve: number;
  respondeA?: string;
  necesita: ApoyoNecesario[];
  quierenApoyar: ApoyoInstitucional[];
  comentarios: Comentario[];
  posicion: PuntoEnMapa;
  disciplinas: string[];            // para el filtro de instituciones
  apoyadaPorMi: boolean;
};
```

#### `Actividad`

```ts
type ModoDeParticipar = 'asistir' | 'voluntario';

type Actividad = {
  id: string;
  titulo: string;
  diaSemana: string;   // "SÁB"
  dia: number;
  mes: string;         // "NOV"
  hora: string;        // "10:00"
  horario: string;     // "10:00 a 13:00"
  lugar: string;
  organiza: Persona;
  descripcion: string;
  queLlevar: string;
  inscritos: number;
  voluntarios: number;
  voluntariosNecesarios: number;
  tareas: string[];
  naceDePropuesta?: string;
  posicion: PuntoEnMapa;
  miInscripcion: ModoDeParticipar | null;
  miTarea?: string;
};
```

**Participar se divide en dos**: asistir, que no compromete a nada, y ser
voluntario, que toma una tarea concreta. Separarlo hace que quien organiza sepa
con cuánta gente cuenta de verdad, que es exactamente el problema que la
organización describió.

#### `Aviso`

```ts
type MomentoAviso = 'hoy' | 'semana';

type Aviso = {
  id: string;
  momento: MomentoAviso;
  destacado: string;    // la parte en negrita
  texto: string;        // el resto de la frase
  cuando: string;
  icono: 'visto' | 'birrete' | 'calendario' | 'globoDialogo' | 'medalla';
  color: string;
  fondo: string;
  leido: boolean;
  pie?: string;         // "Ver quiénes son"
  destino?: string;     // ruta a la que lleva
};
```

#### `Logro`, `CapaDelMapa`, `ElementoDeCatastro` y `Desafio`

```ts
type Logro = {
  id: string; nombre: string; icono: NombreIcono;
  color: string; conseguido: boolean; avance?: string;
};

type CapaDelMapa = {
  id: string; nombre: string; detalle: string;
  grupo: 'ahora' | 'catastro'; activa: boolean;
};

type ElementoDeCatastro = {
  id: string; tipo: string; fuente: string; direccion: string;
  estadoAnotado: string; quienLoCuida: string; ultimaRevision: string;
  opcionesDeEstado: string[]; dato: string; posicion: PuntoEnMapa;
};

type Desafio = {
  id: string; prioridad: 'alta' | 'media' | 'baja'; eje: string;
  titulo: string; resumen: string; busca: string;
  disciplinas: string[]; tiposDeApoyo: string[]; propuesta?: string;
};
```

---

## 9. Estado de la aplicación

Tres contextos de React, en `src/estado`. No hay Redux, Zustand ni Jotai: con
tres contextos bien separados alcanza y el código queda legible para alguien que
recién aprendió React.

Los tres se montan en `app/_layout.tsx`, anidados en este orden:

```
ProveedorPreferencias
  └── ProveedorBarrio
        └── ProveedorBorradores
              └── Stack
```

El orden importa: `Preferencias` va afuera porque `Texto` y `Presionable` lo
consultan desde cualquier parte del árbol.

---

### 9.1 `barrio.tsx` · contenido y acciones

El más grande, 447 líneas. Guarda cinco colecciones y expone las acciones que
las modifican.

#### Qué guarda

| Campo | Tipo | Valor inicial |
|---|---|---|
| `reportes` | `Reporte[]` | `reportesIniciales`, 9 reportes |
| `propuestas` | `Propuesta[]` | `propuestasIniciales`, 3 propuestas |
| `actividades` | `Actividad[]` | `actividadesIniciales`, 3 actividades |
| `avisos` | `Aviso[]` | `avisosIniciales`, 5 avisos |
| `capas` | `CapaDelMapa[]` | `capasIniciales`, 12 capas |
| `ultimoReportePublicado` | `string \| null` | `null` |

Y un valor derivado con `useMemo`:

| Campo | Cómo se calcula |
|---|---|
| `avisosSinLeer` | `avisos.filter(a => !a.leido).length` |

#### Acciones sobre reportes

**`confirmarReporte(id)`**
Suma uno a `confirmaciones`. **Si el reporte está en `recibido` y llega a tres
confirmaciones, pasa a `verificado`.** Es la única transición automática del
sistema y la que promete la pantalla de envío.

**`descartarReporte(id)`**
Suma uno a `senalamientos`. Es lo que ocurre al responder «Ya no está». Alimenta
el contador de «Señalados» del panel de gestión.

**`cambiarEstadoDeReporte(id, estado)`**
Cambia el estado y **recalcula todo el seguimiento**: marca `ocurrio` en los
eventos cuyo paso sea menor o igual al del estado nuevo, y si el evento que
corresponde al estado nuevo no tenía fecha, le pone `'ahora'`. La usa el panel
de moderación.

**`ocultarReporte(id)`**
Lo saca del arreglo. La usa la moderación cuando se oculta por un motivo.

**`publicarReporte(datos)` → `string`**
Crea un reporte nuevo en `recibido`, lo pone **al inicio** del arreglo, guarda su
id en `ultimoReportePublicado` y lo devuelve. Los cuatro eventos de seguimiento
se crean con sus frases a futuro. `autor` queda en `null` si `datos.anonimo`.

```ts
type DatosDeReporteNuevo = {
  categoria: IdCategoria;
  direccion: string;
  descripcion: string;
  comoSeFormo?: string;
  desdeCuando?: string;
  tieneFoto: boolean;
  anonimo: boolean;
};
```

#### Acciones sobre propuestas

**`apoyarPropuesta(id)`**
**Alterna**: invierte `apoyadaPorMi` y suma o resta uno a `apoyos`. Tocar dos
veces deja todo como estaba.

**`comentarPropuesta(id, texto, postura)`**
Agrega un `Comentario` al final, con `autor: personas.rosa`, `cuando: 'recién'`
y `utiles: 0`.

**`marcarComentarioUtil(idPropuesta, idComentario)`**
Suma uno a `utiles`. **Solo busca en el primer nivel**, no en las respuestas
anidadas.

**`publicarPropuesta(datos)` → `string`**
Crea una propuesta en etapa `idea`, con `apoyos: 1` y `apoyadaPorMi: true`
(quien propone apoya su propia idea). Convierte cada apoyo elegido en un
`ApoyoNecesario`, y si es «Manos voluntarias» le pone `conseguido: 0` y
`necesario: datos.voluntarios`.

```ts
type DatosDePropuestaNueva = {
  titulo: string; idea: string; eje: string;
  reporteDeOrigen?: string;
  apoyosNecesarios: string[];
  voluntarios: number;
  disciplinas: string[];
};
```

#### Acciones sobre actividades

**`inscribirseEnActividad(id, modo, tarea?)`**
Si ya está inscrita no hace nada. Si no, fija `miInscripcion` y `miTarea`, suma
uno a `inscritos` y, solo si el modo es `voluntario`, suma uno a `voluntarios`.

**`cancelarInscripcion(id)`**
La operación inversa exacta.

**`publicarActividad(datos)` → `string`**
Crea una actividad con `organiza: personas.republicaCircular`, porque solo
publica quien gestiona.

#### Acciones sobre avisos y capas

| Acción | Qué hace |
|---|---|
| `marcarAvisoLeido(id)` | Pone `leido: true` en uno |
| `marcarTodosLosAvisosLeidos()` | Pone `leido: true` en todos |
| `alternarCapa(id)` | Invierte `activa` |
| `restablecerCapas()` | Vuelve a `capasIniciales` |

#### Los cuatro hooks

```ts
usarBarrio(): ContextoBarrio
usarReporte(id: string | undefined): Reporte | undefined
usarPropuesta(id: string | undefined): Propuesta | undefined
usarActividad(id: string | undefined): Actividad | undefined
```

Los tres últimos son atajos para las pantallas de detalle, que siempre reciben
el identificador por la ruta. **Devuelven `undefined` cuando no existe** y cada
pantalla tiene que manejar ese caso, normalmente con un encabezado que dice «no
encontrado».

`usarBarrio` lanza un error con mensaje claro si se llama fuera del proveedor.

#### Detalles de implementación

- Todo el estado se maneja con `useState` y funciones envueltas en `useCallback`,
  no con `useReducer`. Un `switch` con veinte casos sería más ceremonia para el
  mismo resultado.
- El valor del contexto va en un `useMemo` con todas las dependencias listadas.
- Hay dos ayudas privadas: `cambiarUnReporte(id, transformar)` y
  `cambiarUnaPropuesta(id, transformar)`, que evitan repetir el `map` en cada
  acción.
- `nuevoId(prefijo)` genera `prefijo-<timestamp en base 36>`.

#### Qué cambia al conectar Supabase

**Solo el cuerpo de estas funciones.** Cada una pasa a ser una llamada a la base
y, en el camino, probablemente a invalidar una consulta. Las pantallas no
cambian, porque ya hablan con las acciones y no con los datos.

---

### 9.2 `borradores.tsx` · lo escrito en los flujos de varios pasos

Guarda lo que la persona lleva escrito en el asistente de reporte y en el de
propuesta. **Vive fuera de las pantallas porque el asistente de reporte tiene
cinco y todas tienen que ver lo mismo**, incluida la de revisión final, que
muestra un resumen de los cuatro pasos anteriores.

#### `BorradorDeReporte`

| Campo | Tipo | Inicial |
|---|---|---|
| `categoria` | `IdCategoria \| null` | `null` |
| `fotos` | `number` | `0` |
| `direccion` | `string` | `'Sazié con Av. República'` |
| `comoSeFormo` | `string \| null` | `null` |
| `desdeCuando` | `string \| null` | `null` |
| `descripcion` | `string` | `''` |
| `anonimo` | `boolean` | `false` |
| `posibleDuplicado` | `string \| null` | `null` |

#### `BorradorDePropuesta`

| Campo | Tipo | Inicial |
|---|---|---|
| `reporteDeOrigen` | `string \| null` | `null` |
| `titulo` | `string` | `''` |
| `idea` | `string` | `''` |
| `eje` | `string` | `'Residuos'` |
| `apoyosNecesarios` | `string[]` | `[]` |
| `voluntarios` | `number` | `15` |
| `disciplinas` | `string[]` | `[]` |

#### API

```ts
reporte: BorradorDeReporte;
cambiarReporte(cambios: Partial<BorradorDeReporte>): void;
reiniciarReporte(origen?: Partial<BorradorDeReporte>): void;

propuesta: BorradorDePropuesta;
cambiarPropuesta(cambios: Partial<BorradorDePropuesta>): void;
reiniciarPropuesta(origen?: Partial<BorradorDePropuesta>): void;
```

`reiniciarReporte` se llama al cancelar el flujo y después de publicar. Si no se
llamara, el siguiente reporte arrancaría con los datos del anterior.

---

### 9.3 `preferencias.tsx` · lectura y accesibilidad

El único estado que **se guarda en el teléfono**, con AsyncStorage bajo la clave
`barrio-republica.preferencias`.

| Campo | Tipo | Inicial | Quién lo consulta |
|---|---|---|---|
| `factorTexto` | `1 \| 1.15 \| 1.3` | `1` | `Texto`, `CampoTexto` |
| `altoContraste` | `boolean` | `false` | Declarado, aún sin efecto visual |
| `menosAnimaciones` | `boolean` | `false` | `Presionable`, `BarraDePasos`, `Interruptor`, pantallas con `Animated.View` |
| `avisarCambioDeEstado` | `boolean` | `true` | Ajustes |
| `avisarActividades` | `boolean` | `true` | Ajustes |

#### API

```ts
rotarTamanoDeTexto(): void   // avanza al siguiente escalon y vuelve al menor
cambiar<C extends keyof Preferencias>(clave: C, valor: Preferencias[C]): void
```

`rotarTamanoDeTexto` es lo que usa el botón «A A» de la bienvenida.

#### Cómo persiste

Al montar, lee la clave con `AsyncStorage.getItem` y mezcla lo guardado sobre los
valores iniciales. Usa una bandera `vigente` para no escribir estado si el
componente se desmontó antes de que la promesa resolviera.

Al escribir, una función de módulo `persistir()` guarda sin bloquear. **Todas
las fallas de almacenamiento se ignoran en silencio**: si el teléfono no puede
guardar la preferencia, la sesión sigue igual y no vale la pena interrumpir a
la persona por eso.

**`altoContraste` está declarada y persiste, pero todavía no cambia nada
visualmente.** Es una deuda consciente: el interruptor existe en Ajustes porque
está en el mockup, y conectarlo significa definir una segunda paleta de bordes
y grises.

---

## 10. Navegación y rutas

La navegación es **por archivos**, con expo-router: la ruta de un archivo dentro
de `app/` es su URL. No existe un archivo que declare rutas.

### 10.1 Tabla completa de rutas

| Ruta | Archivo | Pantalla del diseño | Presentación |
|---|---|---|---|
| `/` | `app/index.tsx` | 1.1 Bienvenida | Pila, desvanecido |
| `/ingreso/vinculo` | `app/ingreso/vinculo.tsx` | 1.2 Vínculo | Pila, desde la derecha |
| `/ingreso/intereses` | `app/ingreso/intereses.tsx` | 1.3 Qué quiero ver | Pila, desde la derecha |
| `/ingreso/cuenta` | `app/ingreso/cuenta.tsx` | 1.4 Perfil opcional | Pila, desde la derecha |
| `/inicio` | `app/(barrio)/inicio.tsx` | 2.1 Inicio | **Pestaña** |
| `/mapa` | `app/(barrio)/mapa.tsx` | 2.2 Mapa | **Pestaña** |
| `/reportar` | `app/(barrio)/reportar.tsx` | redirección | **Pestaña interceptada** |
| `/mis-reportes` | `app/(barrio)/mis-reportes.tsx` | 4.1 Mis reportes | **Pestaña** |
| `/avisos` | `app/(barrio)/avisos.tsx` | 7.1 Avisos | **Pestaña** |
| `/mapa/capas` | `app/mapa/capas.tsx` | 2.3 Capas del mapa | **Modal, desde abajo** |
| `/mapa/ficha` | `app/mapa/ficha.tsx` | 2.4 Ficha del catastro | **Modal, desde abajo** |
| `/reportar/categoria` | `app/reportar/categoria.tsx` | 3.1 Qué pasa | Pila propia |
| `/reportar/foto` | `app/reportar/foto.tsx` | 3.2 Foto | Pila propia |
| `/reportar/ubicacion` | `app/reportar/ubicacion.tsx` | 3.3 Dónde | Pila propia |
| `/reportar/duplicado` | `app/reportar/duplicado.tsx` | 3.4 Posible duplicado | Pila propia |
| `/reportar/detalles` | `app/reportar/detalles.tsx` | 3.5 Detalles | Pila propia |
| `/reportar/revisar` | `app/reportar/revisar.tsx` | 3.6 Revisar y enviar | Pila propia |
| `/reportar/enviado` | `app/reportar/enviado.tsx` | 3.7 Reporte enviado | **Desvanecido, sin gesto de retroceso** |
| `/reportes/[id]` | `app/reportes/[id].tsx` | 4.2 y 4.3 | Pila, desde la derecha |
| `/propuestas` | `app/propuestas/index.tsx` | 5.1 Propuestas | Pila, desde la derecha |
| `/propuestas/nueva/idea` | `app/propuestas/nueva/idea.tsx` | 5.2 Nueva propuesta | Pila |
| `/propuestas/nueva/necesita` | `app/propuestas/nueva/necesita.tsx` | 5.3 Qué se necesita | Pila |
| `/propuestas/nueva/revisar` | `app/propuestas/nueva/revisar.tsx` | paso 3, agregada | Pila |
| `/propuestas/[id]` | `app/propuestas/[id]/index.tsx` | 5.4 Detalle | Pila |
| `/propuestas/[id]/conversacion` | `app/propuestas/[id]/conversacion.tsx` | 5.5 Conversación | Pila |
| `/actividades` | `app/actividades/index.tsx` | 6.1 Actividades | Pila |
| `/actividades/[id]` | `app/actividades/[id].tsx` | 6.2 Detalle | Pila |
| `/actividades/inscripcion` | `app/actividades/inscripcion.tsx` | 6.3 Inscripción lista | **Desvanecido desde abajo** |
| `/actividades/crear` | `app/actividades/crear.tsx` | 6.4 Crear actividad | Pila |
| `/perfil` | `app/perfil/index.tsx` | 7.2 Perfil y logros | Pila |
| `/perfil/ajustes` | `app/perfil/ajustes.tsx` | 7.3 Ajustes | Pila |
| `/instituciones/desafios` | `app/instituciones/desafios.tsx` | 8.1 Desafíos | Pila |
| `/instituciones/interes` | `app/instituciones/interes.tsx` | 8.2 Mostrar interés | **Modal, desde abajo** |
| `/observatorio` | `app/observatorio.tsx` | 8.3 Observatorio | Pila |
| `/gestion/panel` | `app/gestion/panel.tsx` | 9.1 Panel de gestión | Pila |
| `/gestion/moderar/[id]` | `app/gestion/moderar/[id].tsx` | 9.2 Revisión de reporte | Pila |
| `/sistema` | `app/sistema.tsx` | 0 Sistema visual | Pila |

**`/actividades/inscripcion` recibe el id por parámetro de consulta**
(`?id=platabanda-toesca`), no por segmento de ruta, porque si fuera
`/actividades/inscripcion` como segmento chocaría con `/actividades/[id]`. Las
rutas estáticas ganan sobre las dinámicas en expo-router, así que la colisión no
rompe nada, pero el parámetro deja la intención más clara.

### 10.2 Las tres disposiciones

#### `app/_layout.tsx` · raíz

Hace cuatro cosas, en este orden:

1. Carga las cuatro tipografías con `useFonts`, reteniendo la pantalla de carga
   con `SplashScreen.preventAutoHideAsync()`. **Si se deja pasar antes, el primer
   cuadro se dibuja con la letra del sistema y se ve un salto feo.**
2. Devuelve `null` mientras las fuentes no estén listas y no haya habido error.
3. Monta `GestureHandlerRootView`, `SafeAreaProvider` y los tres proveedores.
4. Declara el `Stack` con `headerShown: false` y fondo `crema`, y le da opciones
   particulares a siete rutas.

```tsx
<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colores.crema }, animation: 'slide_from_right' }}>
  <Stack.Screen name="index"                    options={{ animation: 'fade' }} />
  <Stack.Screen name="(barrio)"                 options={{ animation: 'fade' }} />
  <Stack.Screen name="mapa/capas"               options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
  <Stack.Screen name="mapa/ficha"               options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
  <Stack.Screen name="instituciones/interes"    options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
  <Stack.Screen name="actividades/inscripcion"  options={{ animation: 'fade_from_bottom' }} />
  <Stack.Screen name="reportar/enviado"         options={{ animation: 'fade' }} />
</Stack>
```

**No hay encabezado nativo en ninguna pantalla.** Cada una dibuja el suyo, porque
el diseño pone el botón de volver dentro del contenido y con su propio estilo.

#### `app/(barrio)/_layout.tsx` · las pestañas

```tsx
<Tabs tabBar={(props) => <BarraNavegacion {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colores.crema } }}>
  <Tabs.Screen name="inicio" />
  <Tabs.Screen name="mapa" />
  <Tabs.Screen name="reportar" listeners={{ tabPress: (evento) => { evento.preventDefault(); router.push('/reportar/categoria'); } }} />
  <Tabs.Screen name="mis-reportes" />
  <Tabs.Screen name="avisos" />
</Tabs>
```

Dos cosas importantes:

- **`Tabs` se importa de `expo-router/js-tabs`**, no de `expo-router`. En el SDK
  57 la exportación desde `expo-router` está marcada como obsoleta. De ahí
  también sale el tipo `BottomTabBarProps`.
- **«Reportar» no es una pestaña de verdad.** Su pulsación se intercepta con
  `preventDefault()` y abre el asistente, que es un flujo con sus propios pasos.
  El archivo `reportar.tsx` existe solo para que la pestaña tenga una ruta
  válida, y si alguien llega por enlace directo redirige al primer paso.

#### `app/reportar/_layout.tsx` · el asistente

Una pila propia con transición desde la derecha, que es la que da la sensación
de avanzar. La pantalla final tiene `animation: 'fade'` y
**`gestureEnabled: false`**: después de enviar no se puede volver con el gesto,
porque el reporte ya existe.

### 10.3 Grafo de navegación

```
  /  Bienvenida
   ├── Comenzar ──────────> /ingreso/vinculo ──> /ingreso/intereses ──> /ingreso/cuenta ──┐
   └── Ya tengo cuenta ───> /ingreso/cuenta ─────────────────────────────────────────────┤
                                                                                          v
                                                                              /ingreso/codigo
                                                                                          │
                                                                                          v
                                                        ┌──────────────────────── /inicio (pestañas)
                                                        │
  PESTAÑAS  inicio · mapa · [reportar] · mis-reportes · avisos
     │
     ├── inicio
     │     ├── avatar ─────────> /perfil ──> /perfil/ajustes ──> /sistema
     │     ├── tarjeta oscura ─> /reportes/[id]
     │     ├── atajos ─────────> /propuestas · /actividades · /observatorio
     │     └── tarjetas ───────> /propuestas/[id] · /actividades/[id] · /reportes/[id]
     │
     ├── mapa
     │     ├── capas ──────────> /mapa/capas            (modal)
     │     ├── chincheta ──────> hoja inferior ──> /reportes/[id]
     │     ├── propuesta ──────> /propuestas/[id]
     │     ├── actividad ──────> /actividades/[id]
     │     └── patrimonio ─────> /mapa/ficha            (modal)
     │                                 └── Proponer ──> /propuestas/nueva/idea
     │
     ├── [reportar] ──> /reportar/categoria ──> foto ──> ubicacion ──> duplicado
     │                                                                    │
     │                        ┌───────────────────────────────────────────┤
     │                        │ "Sí, es el mismo"        "No, es otro"    │
     │                        v                                v          │
     │                 /reportes/[id]                      detalles ──> revisar ──> enviado
     │                                                                                 ├─> /reportes/[id]
     │                                                                                 ├─> /propuestas/nueva/idea
     │                                                                                 └─> /inicio
     │
     ├── mis-reportes ──> /reportes/[id]
     │                          ├── "Proponer otra idea" ──> /propuestas/nueva/idea
     │                          └── "Ver en el mapa" ──────> /mapa
     │
     └── avisos ──> según el aviso: /reportes/[id] · /propuestas/[id] ·
                    /propuestas/[id]/conversacion · /actividades/[id] · /perfil

  /propuestas ──> /propuestas/[id] ──> /propuestas/[id]/conversacion
       └── Proponer ──> /propuestas/nueva/idea ──> necesita ──> revisar ──> /propuestas/[id]

  /actividades ──> /actividades/[id] ──> /actividades/inscripcion?id=...
       └── "+" ──> /actividades/crear ──> /actividades/[id]

  /perfil
     ├── Soy de una universidad ──> /instituciones/desafios ──> /instituciones/interes (modal)
     ├── Panel de gestión ────────> /gestion/panel ──> /gestion/moderar/[id]
     └── Ajustes ─────────────────> /perfil/ajustes ──> /observatorio · /sistema · cerrar sesión ──> /
```

### 10.4 El retroceso seguro

`router.back()` falla cuando la pantalla se abrió directamente, por ejemplo
desde un enlace compartido o al recargar en el navegador: lanza «The action
'GO_BACK' was not handled» y el botón queda muerto.

Por eso existe `src/utiles/navegacion.ts`:

```ts
export function crearVolver(destinoAlternativo: string): () => void {
  return () => {
    if (router.canGoBack()) { router.back(); return; }
    router.replace(destinoAlternativo as never);
  };
}
```

**Las 27 pantallas que tienen botón de volver lo usan**, cada una con su destino
contenedor:

| Pantalla | Destino alternativo |
|---|---|
| `ingreso/vinculo` | `/` |
| `ingreso/intereses` | `/ingreso/vinculo` |
| `ingreso/cuenta` | `/ingreso/intereses` |
| `mapa/capas`, `mapa/ficha` | `/mapa` |
| `reportar/foto` | `/reportar/categoria` |
| `reportar/ubicacion` | `/reportar/foto` |
| `reportar/duplicado`, `reportar/detalles` | `/reportar/ubicacion` |
| `reportar/revisar` | `/reportar/detalles` |
| `reportes/[id]` | `/mis-reportes` |
| `propuestas/index` | `/inicio` |
| `propuestas/[id]`, `.../conversacion` | `/propuestas` |
| `propuestas/nueva/necesita` | `/propuestas/nueva/idea` |
| `propuestas/nueva/revisar` | `/propuestas/nueva/necesita` |
| `actividades/index` | `/inicio` |
| `actividades/[id]`, `actividades/crear` | `/actividades` |
| `perfil/index` | `/inicio` |
| `perfil/ajustes` | `/perfil` |
| `instituciones/desafios` | `/perfil` |
| `instituciones/interes` | `/instituciones/desafios` |
| `observatorio` | `/inicio` |
| `gestion/panel` | `/perfil` |
| `gestion/moderar/[id]` | `/gestion/panel` |
| `sistema` | `/perfil/ajustes` |

### 10.5 Cuándo se usa cada verbo de navegación

| Verbo | Cuándo | Ejemplo |
|---|---|---|
| `router.push` | Avanzar apilando | De una lista a un detalle |
| `router.replace` | Avanzar sin dejar vuelta atrás | Terminar el registro y entrar a `/inicio` |
| `router.back` | Retroceder un paso | Siempre vía `crearVolver` |
| `router.dismissTo` | **Salir de un flujo completo** | Al publicar un reporte o cancelar el asistente |

`dismissTo` es el que evita que, después de publicar, el botón de volver lleve
de regreso al formulario de un reporte que ya se envió.

---

## 11. Las 36 pantallas, una por una

Para cada pantalla: su ruta, de qué mockup viene, cómo está compuesta de arriba
abajo, qué datos consume, qué se puede hacer en ella y qué estados tiene.

---

### 1.1 Bienvenida · `/` · `app/index.tsx`

Fondo `bosque`. Es la única pantalla con figuras decorativas.

**Composición, de arriba abajo:**

1. **Fondo decorativo** (`FormasDeFondo`, sin lectura por el lector de pantalla):
   un aro de 300 × 300 con borde de 46 px en `bosqueClaro` desplazado a
   `right: -90, top: -70`; y una figura de 240 × 240 en `bosqueMedio` con dos
   esquinas redondeadas a 120 y rotación de −20°, en `left: -120, bottom: 180`.
2. **Cabecera**: logotipo de 44 px con radio 14 en `brote` con el ícono `hoja`
   en `bosque` y grosor 2,2; al lado «Barrio República» en 19 px familia título
   con separación 0,2 y «por República Circular» en 13 px; a la derecha el botón
   **«A A»** de 56 × 44 con borde de 1,5 px `bosqueBorde`.
3. **Bloque principal** (`marginTop: 'auto'`, separación 18):
   - Título de **44 px** familia título, interlineado 1,02, separación −0,3:
     «Tu barrio mejora cuando lo hacemos **entre todos**», con las dos últimas
     palabras en `brote`.
   - Párrafo de 18 px en `textoSobreBosque`, interlineado 1,45.
   - Tres promesas, cada una con un cuadro de 36 px radio 12 en `bosqueClaro`
     con ícono de 20 px en `brote`:
     | Ícono | Texto |
     |---|---|
     | `pin` | Reporta en un minuto, sin contraseñas |
     | `visto` | Mira en qué va cada reporte |
     | `personas` | Propón soluciones con tus vecinos |
   - Dos acciones: **«Comenzar»** variante `brote`, alto 58, con flecha al
     final y vibración; y **«Ya tengo cuenta»** variante `contornoClaro`, alto
     54. La tercera, **«Solo quiero reportar algo ahora»**, se quitó al pasar la
     cuenta a obligatoria.

**Animaciones.** El título entra con `FadeInUp` de 500 ms. Las tres promesas con
`FadeInDown` escalonado: 0, 120 y 240 ms de retraso, 420 ms de duración. Todas
se desactivan con `menosAnimaciones`.

**Interacciones.** El botón «A A» llama a `rotarTamanoDeTexto()` y su etiqueta de
accesibilidad informa el porcentaje actual.

**Por qué ya no está «Solo quiero reportar algo ahora».** La fricción del
registro fue la barrera de adopción declarada en terreno, y esta pantalla
ofrecía la salida antes de pedir nada. La contraparte objetó el acceso sin
cuenta el 19 de octubre, porque sin cuenta una misma persona puede crearse
varias identidades e inflar la priorización comunitaria. La respuesta a la
fricción dejó de ser saltarse el registro y pasó a ser que crearlo cueste un
correo y un código.

---

### 1.2 Vínculo con el barrio · `/ingreso/vinculo`

**Composición:** botón de volver, `BarraDePasos` de 2 (envuelta en
`<View style={{flex:1}}>`), enlace «Omitir»; rótulo `PASO 1 DE 2` en 14 px
`verde` con separación 0,6; título de 32 px; párrafo; lista desplazable de seis
`Opcion` de selección múltiple; `BarraInferior` con la nota «Puedes cambiarlo
cuando quieras en tu perfil» y el botón «Continuar» de alto 56.

**Las seis opciones** (de `datos/perfil.ts`):

| Título | Detalle |
|---|---|
| Vivo aquí | Residente del barrio |
| Estudio aquí | Universidad, instituto o colegio |
| Trabajo aquí | Oficina, comercio o casa particular |
| Tengo un local o emprendimiento | Almacén, feria, taller, venta desde casa |
| Represento una institución | Universidad, organización o junta de vecinos |
| Paso seguido por aquí | Lo cruzo camino a otro lugar |

**Estado:** `elegidos: string[]` local. **Se puede marcar más de una y ninguna es
excluyente**, porque la organización ya definió en 2022 que habitante es quien
vive, estudia, trabaja o tiene un vínculo con el barrio.

---

### 1.3 Qué quiero ver en el mapa · `/ingreso/intereses`

**Composición:** igual cabecera con `PASO 2 DE 2`; título; párrafo que explica
que se cambia en Mapa › Capas; una `ListaAgrupada` con siete `FilaDeLista`, cada
una con una `Sigla` de tres letras a la izquierda y un `Interruptor` a la
derecha; `BarraInferior` con «Listo».

**Los siete intereses y el color de su sigla:**

| Sigla | Título | Fondo / texto |
|---|---|---|
| REP | Problemas que reportan los vecinos | `#F5E6C8` / `#8A5A12` |
| ACT | Propuestas y actividades | `menta` / `#174D34` |
| RES | Basura y reciclaje | `#EFE2D4` / `#7A4A1F` |
| VER | Áreas verdes y platabandas | `#DDEBD4` / `#2E6B3F` |
| PAT | Patrimonio | `#F3DCD7` / `#9C3A33` |
| MOV | Movilidad | `#DCE7F3` / `#2C5A8C` |
| MOB | Bancas y mobiliario | `#E6E8EC` / `#4A5560` |

**Estado:** `encendidos: string[]`, inicia con `['reportes','propuestas','residuos']`.
Toda la fila es tocable, no solo el interruptor.

---

### 1.4 Crear la cuenta del barrio · `/ingreso/cuenta`

**Composición:** solo botón de volver; etiqueta **«Paso final»** en `menta`;
título de 32 px «Crea tu cuenta del barrio»; párrafo «Te avisamos cuando tu
reporte avance. No pedimos tu nombre real ni tu RUT»; formulario con
`CampoTexto` de **Seudónimo** (ayuda «Es el nombre que verán tus vecinos. Puede
ser inventado.») y **Correo electrónico**; un `Aviso` tono `logro` con ícono
`candado` que dice «**Sin contraseñas.** Cada vez que entres te mandamos un
código de 6 números a tu correo»; una `Casilla` de normas de convivencia sin
marcar; `BarraInferior` con «Enviarme el código» (ícono `sobre`, alto 56) y la
nota «Llega en unos segundos. Revisa también el correo no deseado».

**Validación:** el botón se habilita con seudónimo de dos letras o más, correo
con `@` y normas aceptadas. Al apretarlo manda el código y navega a
`/ingreso/codigo` llevando el correo y el seudónimo.

**Sin credenciales configuradas** el botón dice «Entrar al barrio» y entra
directo, porque no hay a quién pedirle el código y el prototipo tiene que
seguir siendo navegable para mostrarlo en reuniones.

Usa `KeyboardAvoidingView` con `behavior="padding"` solo en iOS.

**El código de 6 números en vez de contraseña responde directamente a por qué
murió el Banco del Tiempo**: faltaba recuperación de contraseñas.

---

### 0 Sistema visual · `/sistema` · `app/sistema.tsx`

El mockup es una lámina de 1280 × 1100. Aquí está adaptada al teléfono como
referencia viva: **todo lo que se ve sale de los mismos componentes y tokens que
usan las demás pantallas**, así que si algo cambia, cambia también aquí.

**Secciones:** párrafo introductorio; **Color** con los ocho colores en rejilla
de tres columnas, cada uno con su muestra de 56 px, nombre y código; **Estados
del reporte** con las cuatro píldoras; **Tipografía** con cinco muestras (44, 32,
22, 17 y 14) y su descripción; **Botones** con las tres variantes del sistema;
**Categorías de reporte** con las ocho en píldoras; **Etapas de una propuesta**
con las cinco numeradas y su explicación, más la frase del ciclo completo;
**Reglas de accesibilidad** con las seis, cada una precedida por un visto verde.

Se llega desde Ajustes › Sistema visual.

---

### 2.1 Inicio · `/inicio` · `app/(barrio)/inicio.tsx`

El mockup mide 390 × 1180, así que toda la pantalla es un `ScrollView`.

**Composición:**

1. **Cabecera**: «Barrio República» en 14 px `verde` con ícono `pin` de 16, y
   debajo «Hola, Rosa» en 30 px familia título. A la derecha, el `Avatar` de 48
   con aro que lleva a `/perfil`.
2. **Tarjeta oscura «TU REPORTE AVANZÓ»** (tono `bosque`, relleno 18): rótulo en
   13,5 px `brote` con separación 0,5 y flecha a la derecha; el título del
   reporte con el estado en `ambarSobreBosque`; la `BarraDeEstadoDeReporte` con
   `sobreBosque`; y al pie el detalle del evento en gestión más «· hace 2 h».
   Entra con `FadeInDown` de 420 ms.
3. **Tarjeta de confirmación**: cuadro de 40 px en `#F5E6C8` con el ícono
   `interrogacion`, la pregunta «¿Sigue el microbasural en Sazié con Av.
   República?» y la línea «Tu respuesta ayuda a mantener el mapa al día»; debajo
   dos botones, «Sí, sigue» (secundaria) y «Ya no está» (tonal), ambos de alto
   48 y con vibración.
4. **Tres atajos** en fila, cada uno de 92 px de alto mínimo, borde 1 px, radio
   18, con un cuadro de 36 px arriba y el nombre abajo:
   | Atajo | Ícono | Fondo / color | Destino |
   |---|---|---|---|
   | Propuestas | `idea` | `menta` / `verde` | `/propuestas` |
   | Actividades | `calendario` | `#F5E6C8` / `#8A5A12` | `/actividades` |
   | Observatorio | `grafico` | `#DCE7F3` / `#2C5A8C` | `/observatorio` |
5. **«Lo último en el barrio»** en 22 px familia `tituloSemi`.
6. **Cuatro pestañas** de filtro: Todo, Propuestas, Actividades, Reportes.
7. **Las tarjetas**: `TarjetaDePropuesta` con la nota «Estudiantes de FCFM
   quieren apoyar», `TarjetaDeActividad` y `TarjetaDeReporte`. Cada una entra con
   `FadeIn` de 300 ms.

**Cómo elige qué mostrar** (todo derivado, nada codificado a mano):

```ts
reporteQueAvanzo   = reportes.find(r => r.esMio && r.estado === 'gestion')
reportePorConfirmar= reportes.find(r => r.estado === 'verificado' && r.subtipo !== undefined)
propuestaDestacada = propuestas[0]
actividadProxima   = actividades[0]
reporteDelFeed     = reportes.find(r => !r.esMio && r.tieneFoto)
```

**Estados:** `pestanaActiva` y `confirmacionRespondida`. Al responder la
confirmación, la tarjeta cambia a «Gracias, el mapa queda al día» y los botones
desaparecen.

**Por qué lo primero que se ve es un reporte propio que avanzó.** Esa devolución
es justamente lo que faltó en las herramientas anteriores del barrio: sin
retorno visible, el vecino reporta una vez y no vuelve.

---

### 2.2 Mapa del barrio · `/mapa` · `app/(barrio)/mapa.tsx`

**Composición, por capas:**

1. `MapaBarrio` ocupando toda la pantalla, con los marcadores como hijos.
2. **Controles flotantes arriba** (posición absoluta, `top: margenSeguro + 8`):
   un buscador de 52 px de alto con ícono `lupa` y marca de agua «Buscar calle o
   lugar», y un botón cuadrado de 52 con el ícono `capas`.
3. **Cuatro chips flotantes**: Todo, Reportes, Propuestas, Actividades.
4. **Botón «Ir a mi ubicación»** a la derecha, con ícono `mira` en
   `ubicacionPropia`.
5. **Hoja inferior** con el elemento elegido: tirador de 40 × 5, rótulo de
   categoría con subtipo, píldora de estado, dirección en 19 px, línea de
   contexto con antigüedad, confirmaciones y propuestas asociadas, y dos
   botones: «Ver detalle» y «¿Sigue ahí?». Entra con `FadeInDown` de 260 ms y
   se vuelve a animar cada vez que cambia el elegido, porque la vista lleva
   `key`.

**Qué se dibuja sobre el plano:**

| Elemento | Forma | Color | Tamaño |
|---|---|---|---|
| Mi ubicación | Punto | `ubicacionPropia` | 22 |
| Reportes no resueltos | Círculo | el de su categoría | 40, o 52 si está elegido |
| Propuestas | Cuadrado | `verde` | 40 |
| Actividades | Cuadrado | `ocre` | 40 |
| Ficha de patrimonio | Círculo | `#9C3A33` | 40 |
| Grupo | Círculo con número | `bosque` | 48 |

**Estados:** `filtro`, `busqueda` y `seleccionado`, que arranca en
`'microbasural-sazie'`.

---

### 2.3 Capas del mapa · `/mapa/capas` (modal)

**Composición:** `Encabezado` con título y botón de cerrar; dos grupos de
`ListaAgrupada` con interruptores; un `Aviso` informativo; `BarraInferior` con
«Restablecer» (flex 1) y «Ver en el mapa» (flex 1,4).

**Grupo «LO QUE PASA AHORA»:** Reportes abiertos, Resueltos (Últimos 30 días),
Propuestas, Actividades.

**Grupo «CATASTRO DEL BARRIO 2022»**, con el subtítulo «Diagnóstico
socioambiental de República Circular». **Las cifras son las reales del
diagnóstico:**

| Capa | Detalle | Activa al inicio |
|---|---|---|
| Microbasurales | 40 puntos | sí |
| Platabandas | 500 franjas | no |
| Basureros | 218 en la calle | no |
| Puntos de reciclaje | 5 lugares | sí |
| Áreas verdes | 8 plazas y 2 eriazos | sí |
| Bancas | 93 bancas | no |
| Paraderos | 35 paraderos | no |
| Ciclovías | 3 tramos | no |

El aviso al pie: «Muchos de estos puntos no tienen su estado actual. Tócalos
para ayudar a completarlo».

**Esta pantalla es donde el catastro de 2022 sigue estando disponible después de
que la organización deje de pagar ArcGIS.**

---

### 2.4 Ficha del catastro · `/mapa/ficha` (modal)

**Composición:**

1. **Plano de contexto** de 300 px de alto, un SVG propio con un acercamiento a
   la cuadra: dos calles horizontales (grosores 22 y 12), dos verticales (18 y
   16), **una franja ocre de 190 × 7 que es la platabanda** y una verde que es la
   vereda con jardín, más un marco de 3 px en `bosque` que la encuadra. Nombres:
   GRAJALES, AV. REPÚBLICA y AV. EJÉRCITO.
2. Botón de volver flotante de 48 px con sombra.
3. **Hoja inferior** con altura máxima de 72 %, desplazable:
   - Dos píldoras: «Platabanda» en `menta` y «Catastro 2022» en `crema`.
   - Dirección en 24 px familia título.
   - **Tres cuadros de dato** en fila: Estado anotado (**Abandonada**, en
     `#8A5A12`), Quién la cuida (**Nadie**), Última revisión (**Feb 2023**).
   - **Bloque «¿Cómo está hoy?»** sobre fondo `bosque`: la pregunta, la línea
     «Un toque y el registro del barrio queda al día» y cuatro opciones en
     rejilla de dos columnas: Con jardín, Abandonada, Pavimentada y **No sé**.
     La elegida va en `menta` con borde de 3 px `brote` y un visto. **«No sé»
     tiene estilo propio**, de contorno claro, porque no compromete. Al pie,
     «Opcional: agrega una foto» con el enlace en `brote`.
   - Fila final que lleva a proponer, con el dato «Solo 13 de 500 platabandas
     tienen quien las cuide».

**Por qué existe esta pantalla.** El estado de conservación está vacío en casi
todos los registros del catastro: 0 de 93 bancas, 0 de 172 semáforos, 4 de 218
basureros. Esta es la pantalla que permite que un vecino complete ese dato con
un toque.

---

### 3.1 Qué pasa · `/reportar/categoria`

**Composición:** `EncabezadoDePaso` 1 de 5 con `esPrimerPaso` (botón de cruz,
«Cancelar reporte»); título de 32 px «¿Qué quieres reportar?»; **rejilla de ocho
cuadros** de dos columnas con `flexBasis: '45%'` y `flexGrow: 1`;
`BarraInferior` con un `Aviso` neutro y el botón «Siguiente».

**Cada cuadro de categoría:** 100 px de alto mínimo, radio 18, fondo `papel`, con
un cuadro de 42 px radio 13 del color de la categoría arriba y el nombre
completo abajo en 16 px negrita.

| | Elegido | No elegido |
|---|---|---|
| Borde | 3 px `bosque` | 1,5 px `borde` |
| Relleno | 12 | 13 |
| Marca | Círculo de 26 px en `bosque` con visto, arriba a la derecha | sin marca |

El relleno baja de 13 a 12 cuando el borde sube de 1,5 a 3, para que el cuadro
no cambie de tamaño al elegirlo.

**El aviso al pie:** «Para delitos o emergencias llama al 133 o 132. Esta app es
para mejorar el barrio». Está porque el equipo decidió explícitamente dejar
robos e incendios fuera del alcance.

**Cancelar** reinicia el borrador y hace `router.dismissTo('/inicio')`.

---

### 3.2 Foto · `/reportar/foto`

**Composición:** `EncabezadoDePaso` 2 de 5; `ChipDeCategoria` con la elegida;
título «Agrega una foto»; párrafo «Es opcional»; **zona de carga** de 262 px con
borde segmentado de 2,5 px en `#B9AF98`, un círculo de 76 px en `menta` con el
ícono `camara` de 38 y el texto «Puedes subir hasta 3 fotos»; dos botones
«Tomar foto» (principal) y «Galería» (secundaria), ambos de alto 56;
`Aviso` tono `cuidado` con ícono `ojo`: «Cuida la privacidad. Evita que salgan
caras, patentes o el interior de casas»; `BarraInferior` con «Saltar» (flex 1) y
«Siguiente» (flex 1,5).

**Funciona de verdad.** Usa `expo-image-picker`: pide permiso de cámara o de
galería según el botón, abre el selector con `quality: 0.6` y guarda hasta tres
URI en estado local, que se muestran como miniaturas de 100 × 100. Sincroniza
`fotos` en el borrador.

---

### 3.3 Dónde · `/reportar/ubicacion`

**Composición:**

1. `MapaBarrio` de fondo.
2. **Cabecera flotante** sobre fondo `crema` con sombra, que contiene el botón de
   volver, «Paso 3 de 5 · Dónde», la barra de pasos, el título de 28 px «¿Dónde
   está?» y la línea «Mueve el mapa hasta dejar el punto encima».
3. **Chincheta central fija**: cuadrado de 48 px rotado −45° con tres esquinas
   redondeadas y una en punta, en `bosque`, con un círculo de 16 px en `brote`
   rotado +45° dentro para compensar; debajo una sombra elíptica de 16 × 6 en
   `rgba(0,0,0,0.22)`.
4. Botón «Usar mi ubicación».
5. **Hoja inferior** con un cuadro de 44 px en `menta` con el ícono `pin`, la
   dirección en 18 px, «Barrio República, Santiago» y el botón «Confirmar
   ubicación» de alto 56 con vibración.

**El punto queda fijo al centro y lo que se mueve es el plano**: es más fácil de
usar con una mano que arrastrar una chincheta chica.

Al confirmar, fija `posibleDuplicado: 'microbasural-sazie'` en el borrador y
avanza a la pantalla de duplicado.

---

### 3.4 Posible duplicado · `/reportar/duplicado`

**No consume un paso propio**: el encabezado sigue diciendo «Paso 3 de 5 ·
Dónde», porque no pide información nueva, solo pregunta si ya existe.

**Composición:** cuadro de 52 px en `#F5E6C8` con el ícono `enlace`; título de 28
px «¿Es el mismo problema?»; párrafo «Alguien ya reportó algo parecido a 30
metros de ese punto»; una tarjeta con la foto del reporte existente, su rótulo
de categoría con subtipo, su estado, su dirección, su antigüedad y
confirmaciones, y su descripción entre comillas angulares; `BarraInferior` con
la nota «Si es el mismo, tu confirmación le da más prioridad y evitamos reportes
repetidos» y dos acciones.

| Acción | Qué hace |
|---|---|
| **«Sí, es el mismo. Lo confirmo»** | `confirmarReporte` sobre el existente, reinicia el borrador y `dismissTo` al detalle de ese reporte |
| «No, es otro problema» | Sigue a `/reportar/detalles` |

**Esta pantalla reemplaza a la detección automática de duplicados**, que el
equipo descartó el 2 de septiembre por complejidad innecesaria. El modelo es el
de Waze: ubicación más etiqueta con confirmación del usuario.

---

### 3.5 Detalles · `/reportar/detalles`

**Composición:** `EncabezadoDePaso` 4 de 5; `ChipDeCategoria`; título «Cuéntanos
un poco más»; párrafo «Toca la opción que más se parezca»; tres bloques:

| Bloque | Tipo | Opciones |
|---|---|---|
| **¿Cómo se formó?** | `Opcion` de selección única, apiladas | Dejaron basura en la calle · Se rebalsó un basurero · No sé |
| **¿Desde cuándo lo ves?** | `Opcion` **compacta** en fila de tres | Hoy · Esta semana · Hace más de un mes |
| **¿Algo más? (opcional)** | `CampoTexto` de 3 líneas, máximo 300 | marca de agua «Ej. se acumula los fines de semana» |

**Las preguntas son de alternativas y no de texto libre** para que el reporte
tarde menos de un minuto y para que los datos se puedan agrupar después en el
observatorio.

---

### 3.6 Revisar y enviar · `/reportar/revisar`

**Composición:** `EncabezadoDePaso` 5 de 5; título «¿Está todo bien?»; **tarjeta
de resumen** con cuatro filas, cada una con un adorno de 38 px, la etiqueta en
13 px gris, el valor en 16 px negrita y un enlace **«Cambiar»** subrayado;
bloque «Publicar como» con dos `Opcion` de selección única (el seudónimo y
«Anónimo»); un `Aviso` informativo con ícono `escudo`; `BarraInferior` con
«Enviar reporte».

| Fila | Adorno | Valor |
|---|---|---|
| Qué pasa | `MarcaDeCategoria` de 38 | la etiqueta larga, o «Sin elegir» |
| Foto | ícono `imagen` sobre `fotoTramaClara` | «N fotos» o «Sin foto» |
| Dónde | ícono `pin` sobre `menta` | la dirección |
| Detalles | ícono `lapiz` sobre `crema` | «Dejaron basura · esta semana», o «Sin detalles» |

**Cada «Cambiar» usa `router.dismissTo`**, no `push`: vuelve al paso sin apilar
una copia nueva.

El aviso dice: «Aparecerá como **Recibido**. Pasa a **Verificado** cuando otros
vecinos lo confirman o lo revisa un moderador». Es la promesa que cumple la
regla de las tres confirmaciones.

**Si falta la categoría** el botón se deshabilita y aparece un aviso de cuidado
que dice dónde corregirlo. Pasa cuando alguien entra por enlace directo a un
paso intermedio.

Al enviar: `publicarReporte(...)`, `reiniciarReporte()` y
`router.replace('/reportar/enviado')`.

---

### 3.7 Reporte enviado · `/reportar/enviado`

Sin gesto de retroceso: el reporte ya existe.

**Composición:**

1. **Bloque de celebración** sobre `bosque` con las esquinas inferiores
   redondeadas a 32: círculo de 84 px en `brote` con borde de 12 px en
   `bosqueClaro` y un visto de 44 px, que entra con `ZoomIn` de 420 ms; «¡Listo,
   Rosa!» en 34 px familia título; y el párrafo «Tu reporte ya está en el mapa
   del barrio. Te avisaremos cada vez que avance».
2. **Tarjeta «EN QUÉ VA»** con los cuatro estados en fila: el primero relleno en
   `verde` con aro de 5 px en `menta` y un visto, los otros tres vacíos con
   borde de 2 px. Entra con `FadeIn` tras 200 ms.
3. **Invitación a proponer** sobre `#F5E6C8`: cuadro de 46 px en `ocre` con el
   ícono `idea`, «¿Tienes una idea para resolverlo?» y «Propónla y otros vecinos
   pueden apoyarla». Lleva a `/propuestas/nueva/idea`.
4. **Fila de avisos** con el ícono `campana`, «Avisos activados para este
   reporte» y un `Interruptor`.
5. `BarraInferior` sin borde superior con «Ver mi reporte» y «Volver al inicio».

«Ver mi reporte» usa `ultimoReportePublicado` del contexto, y si fuera `null`
cae a `/mis-reportes`.

---

### 4.1 Mis reportes · `/mis-reportes` · `app/(barrio)/mis-reportes.tsx`

**Composición:** título de 30 px; tres chips de sección con sus contadores; si la
sección es Reportes, dos chips más de Abiertos y Resueltos; la lista; y al pie
avisos según el caso.

| Sección | Qué cuenta | Qué lista |
|---|---|---|
| Reportes | `reportes.filter(r => r.esMio)` | `TarjetaDeMiReporte` |
| Propuestas | `propuestas.filter(p => p.apoyadaPorMi)` | Tarjeta simple con título y apoyos |
| Actividades | `actividades.filter(a => a.miInscripcion !== null)` | Tarjeta simple con fecha y rol |

**Dos avisos al pie:**

- Si la lista está vacía: «Todavía no tienes reportes resueltos» o «No tienes
  reportes abiertos. Toca Reportar para abrir uno».
- Si hay resueltos y se está viendo Abiertos: un aviso de logro con «N reportes
  resueltos este mes», con el plural correcto gracias a `pluralizar`.

El punto rojo de novedad aparece en los reportes en estado `gestion`.

---

### 4.2 y 4.3 Detalle del reporte · `/reportes/[id]`

**Una sola pantalla cubre los dos mockups.** 4.3 «Reporte resuelto» es esta misma
con `estado === 'resuelto'`, no un archivo aparte.

**Composición común:** fila con botón de volver y botón de compartir; la foto;
rótulo de categoría con subtipo y píldora de estado; título de 28 px; línea
«Reportado por Rosa · 3 nov 2026, 10:24»; tarjeta con la `LineaDeTiempo`.

**Qué cambia según el estado:**

| | Abierto | Resuelto |
|---|---|---|
| Foto | Una, de 200 px, radio 22 | **Dos en fila**, de 150 px, con los rótulos «Antes · 3 nov» y «Después · 12 nov» |
| Título de la tarjeta de seguimiento | «¿En qué va?» | «Qué se hizo» |
| Bloque siguiente | **Tarjeta `bosque` «¿Sigue ahí?»** con «Sí, sigue» y «Ya no está» | Tarjeta `menta` con el avatar de República Circular, la pregunta «¿Quedó bien resuelto?» con Sí / A medias / No, un aviso de observación por 30 días y el botón «Volvió a aparecer» |

**Resto de la pantalla, en los dos casos:** tarjeta **Detalles** con dos cuadros
(Cómo se formó, Desde), la descripción entre comillas angulares y el botón «Ver
en el mapa»; **Ideas para resolverlo · N** con las propuestas relacionadas y el
botón «Proponer otra idea»; **Comentarios · N** con el primero y el enlace «Ver
los N comentarios»; y al pie «Siguiendo» y «Compartir».

**Estado local:** `respondido`, que al confirmar reemplaza los botones por
«Gracias, tu respuesta ya se sumó».

Si el id no existe, muestra un encabezado «Reporte no encontrado».

---

### 5.1 Propuestas del barrio · `/propuestas`

**Composición:** fila con botón de volver, título «Propuestas» y el botón
**«Proponer»** de alto 44 con ícono `mas`; cuatro chips de eje (Todas, Residuos,
Áreas verdes, Patrimonio); un `Aviso` neutro que explica el criterio; y la lista
de `FilaDePropuesta` numeradas.

**El criterio de orden es explícito y está escrito en la pantalla**: «Ordenadas
por apoyos y reportes del mismo problema». En el código:

```ts
.sort((una, otra) =>
  otra.apoyos + otra.reportesQueResuelve * 3 -
  (una.apoyos + una.reportesQueResuelve * 3))
```

Cada reporte pesa como tres apoyos. **Ese criterio mezclado, deliberación más
frecuencia, es el que el equipo acordó con la contraparte para definir qué
significa priorizada.** La ponderación exacta quedó como decisión pendiente (el
«TODO 1» de la bitácora).

Si el filtro no deja nada, muestra «Todavía no hay propuestas en este eje» y un
botón «Proponer la primera».

«Proponer» reinicia el borrador antes de abrir el flujo.

---

### 5.2 Nueva propuesta · idea · `/propuestas/nueva/idea`

**Composición:** `EncabezadoDePaso` 1 de 3 con `esPrimerPaso` («Cancelar
propuesta»); título de 32 px «¿Cómo lo resolverías?»; bloque **«Problema que
quieres resolver»** con una tarjeta que muestra la marca de categoría de 38, el
título del reporte, la línea «y 5 reportes parecidos cerca» y un enlace
«Cambiar»; `CampoTexto` **«Tu idea en una frase»**; `CampoTexto` **«¿Cómo
funcionaría?»** de 5 líneas con máximo 500 y el contador «118 / 500» como ayuda;
un `Aviso` neutro con ícono `personas`; `BarraInferior` con «Siguiente».

El aviso dice: «No tiene que estar perfecta. Los vecinos te ayudarán a mejorarla
en la conversación».

**La propuesta nace enganchada a un problema concreto, no en el aire.** Esa es
la diferencia con una caja de sugerencias: cada idea responde a reportes que ya
existen en el mapa. El reporte de origen se toma del borrador, y si no hay cae a
`microbasural-sazie`.

El botón se deshabilita con el título vacío.

---

### 5.3 Nueva propuesta · qué se necesita · `/propuestas/nueva/necesita`

**Composición:** `EncabezadoDePaso` 2 de 3; título «¿Qué se necesita?»; párrafo
«Así vecinos, locales y universidades saben cómo sumarse»; una tarjeta con
cuatro filas de casilla; un bloque de chips de disciplina; `BarraInferior` con
«Revisar y publicar».

**Los cuatro tipos de apoyo:**

| Título | Detalle | Con cantidad |
|---|---|---|
| Manos voluntarias | Para armarlo y cuidarlo | **sí** |
| Materiales o herramientas | Contenedores, pintura, palas | no |
| Conocimiento técnico | Estudiantes o profesionales | no |
| Permiso o gestión municipal | República Circular puede ayudar | no |

**Cuando «Manos voluntarias» está marcada aparece un `Contador`** a la derecha de
esa fila, que arranca en 15 y tiene mínimo 1.

**Las seis disciplinas** como `Chip` de variante `marcado`: Ingeniería, Diseño,
Arquitectura, Agronomía, Ciencias sociales, Comunicación.

**Declarar qué se necesita es lo que permite después que una universidad o un
local encuentren dónde calzan.** Sin esta pantalla el módulo de vinculación no
tendría con qué trabajar.

---

### Nueva propuesta · revisar · `/propuestas/nueva/revisar`

**Los mockups numeran este flujo como «Paso X de 3» pero solo dibujan los dos
primeros.** Esta pantalla completa la numeración mostrando cómo va a quedar la
propuesta, sin pedir nada nuevo. Está documentada como agregada, no como
reproducida.

**Composición:** `EncabezadoDePaso` 3 de 3; título «Así la verán tus vecinos»;
una tarjeta de vista previa con la píldora de etapa `idea`, el eje, el título en
22 px, el avatar y vínculo de quien propone y el texto de la idea; una tarjeta
«Qué se necesita» con los apoyos elegidos y el conteo de voluntarios; una
tarjeta con las disciplinas; un `Aviso` que explica que queda como Idea y sube a
En conversación cuando los vecinos empiecen a opinar; `BarraInferior` con
«Publicar propuesta».

Al publicar: `publicarPropuesta(...)`, `reiniciarPropuesta()` y
`router.dismissTo('/propuestas/<id nuevo>')`.

---

### 5.4 Detalle de propuesta · `/propuestas/[id]`

**Composición, de arriba abajo:**

1. `Encabezado` solo con el botón de volver.
2. Píldora de etapa y eje; título de 28 px; avatar, nombre, vínculo y fecha.
3. **`BarraDeEtapas`**: cinco columnas, cada una con un tramo de 6 px y el
   nombre debajo en 12 px. Las etapas recorridas van en `verde`, la actual en
   `ocre` con el texto en `#6F4A0E` negrita, y las que faltan en `borde` con
   texto gris. Lleva la etiqueta «Etapa 3 de 5: Priorizada».
4. **Tarjeta `bosque` de apoyo**: el número en 40 px familia título, «vecinos
   apoyan esta idea», cuatro círculos superpuestos de 36 px que sugieren a
   quienes apoyan sin exponer identidades, el botón «Apoyar esta propuesta» en
   variante `brote` de alto 54, y al pie, centrada, la frase **«Cada apoyo vale
   lo mismo, sin importar quién lo da»**.
5. Aviso neutro «**Responde a** 6 reportes de basura en esta esquina».
6. **Tarjeta «La idea»** con el texto y, si existe, un aviso de logro con
   «**Mejorada en la conversación:** se sumó un turno de cuidado los sábados,
   idea de Tomás».
7. **Tarjeta «Qué se necesita»**: por cada apoyo, su título, su detalle y, cuando
   se cuenta en personas, «9 de 15» en `verde` y una barra de avance de 6 px.
8. **Tarjeta «Quieren apoyar»**: cada institución con un cuadro de 42 px
   (`birrete` sobre azul claro, `comercio` sobre amarillo claro), nombre y
   detalle.
9. **Conversación · N** con el primer comentario y el botón «Ver toda la
   conversación».
10. `BarraInferior` con «Apoyar · 64» y «Opinar».

La frase sobre el peso de los apoyos no es decorativa: es la decisión del 2 de
septiembre de usar logros en vez de niveles jerárquicos, escrita en la interfaz.

---

### 5.5 Conversación · `/propuestas/[id]/conversacion`

**Composición:** `Encabezado` con título «Conversación» y el título de la
propuesta como subtítulo; cuatro chips de filtro con contadores; la lista de
comentarios; y el **compositor** fijo abajo.

**Las cinco posturas y su apariencia:**

| Postura | Etiqueta | Fondo | Texto |
|---|---|---|---|
| `aFavor` | A favor | `menta` | `#174D34` |
| `mejora` | Mejora | `#F5E6C8` | `#6F4A0E` |
| `duda` | Duda | `#DCE7F3` | `#244C78` |
| `enContra` | En contra | `#F3DCD7` | `#7A2A24` |
| `respuesta` | Respuesta | `crema` | `grisTexto` |

**Cada tarjeta de comentario** lleva avatar de 38, nombre, vínculo y antigüedad,
la píldora de postura a la derecha (salvo las respuestas), el texto en 16 px, el
aviso «La autora la sumó a la propuesta» cuando `incorporado` existe, y una fila
con «Útil · N» (tocable, suma uno) y «Responder».

**Las respuestas anidadas** van con sangría de 20 px y una línea vertical de 2 px
en `borde` a la izquierda, con avatar de 28.

**El compositor**, sobre fondo `papel` con borde superior: una fila de cuatro
chips de postura, un `TextInput` multilínea de 48 a 120 px de alto y un botón
cuadrado de envío de 48 px que está en `bordeFuerte` mientras el texto esté
vacío y pasa a `verde` cuando hay algo. Al pie: «Conversa con respeto. **Normas
de convivencia**».

**Declarar la postura es obligatorio** y es lo que permite que la autora lea
rápido qué mejora, qué duda y qué objeta. El foro de deliberación es uno de los
tres módulos comprometidos con la contraparte.

---

### 6.1 Actividades · `/actividades`

**Composición:** `Encabezado` con «Actividades» y «Noviembre» más un botón «+» a
la derecha; **tira de siete días**; tres chips de filtro; y dos secciones de
lista.

**La tira de días**, de lunes 9 a domingo 15, con el 12 marcado como HOY:

| | Elegido | Hoy | Normal |
|---|---|---|---|
| Fondo | `verde` | `papel` con borde 1,5 | transparente |
| Texto | `papel` | normal | sigla en gris |

Cada día con actividad lleva un punto de 5 px debajo del número: `brote` si está
elegido, `ocre` si no. El día elegido arranca en 14, el del sábado de la
jornada.

**Los tres filtros:** Todas; Buscan voluntarios (`voluntariosNecesarios >
voluntarios`); Me inscribí (`miInscripcion !== null`).

**Dos secciones:** «ESTE SÁBADO» con las actividades del día elegido usando
`TarjetaDeActividad`, y «PRÓXIMAS» con el resto usando `FilaDeActividad`.

El botón «+» lleva a crear actividad, que es la herramienta de quien gestiona.

---

### 6.2 Detalle de actividad · `/actividades/[id]`

**Composición:**

1. `Encabezado` solo con volver.
2. `CuadroDeFecha` de 72 px y el título en 26 px familia título.
3. Dos filas de datos: ícono `reloj` con «Sábado 14 de noviembre · 10:00 a
   13:00», e ícono `pin` con el lugar y el enlace «Ver en el mapa».
4. **Tarjeta de organización**: avatar, nombre, «Organización verificada» y el
   ícono `escudo` a la derecha cuando lo es. Debajo, si la actividad nace de una
   propuesta, un aviso de logro con «Nace de la propuesta **Huerta comunitaria en
   la platabanda**, apoyada por 51 vecinos», donde el título es un enlace. Y la
   descripción.
5. **«¿Cómo quieres participar?»** con dos `Opcion` de selección única:
   - **Asistir** · «Llego, ayudo un rato y conozco a los vecinos»
   - **Ser voluntario · faltan 6** · «Me comprometo con una tarea»

   Al elegir voluntario aparecen, con sangría, las tareas disponibles como
   opciones: Llevar herramientas, Regar la primera semana, Difundir.
6. Tarjeta con «**18 inscritos** · 9 de ellos como voluntarios».
7. Tarjeta «Qué llevar».
8. `BarraInferior` con «Inscribirme como voluntario» o «Inscribirme».

**Si ya está inscrita**, el bloque de participación se reemplaza por un aviso de
logro y el botón pasa a «Ver mi inscripción».

**Validación:** el botón se deshabilita si se eligió voluntario, hay tareas y no
se tomó ninguna.

---

### 6.3 Inscripción lista · `/actividades/inscripcion?id=...`

**Composición:** bloque de celebración sobre `bosque` idéntico al de reporte
enviado (círculo de 84 con visto, `ZoomIn`), con «¡Te esperamos el sábado!» y
«República Circular ya sabe que vas como voluntaria»; una tarjeta con el
`CuadroDeFecha` en tono `menta`, el horario en mayúsculas, el título, el lugar y,
si es voluntaria, la píldora «Voluntaria» con la tarea al lado; una
`ListaAgrupada` con tres filas (Agregar a mi calendario, Recordatorio con
«Viernes 13 a las 18:00», Invitar a alguien por WhatsApp); `BarraInferior` con
«Listo» y «Ya no puedo ir».

«Ya no puedo ir» llama a `cancelarInscripcion` y vuelve a la lista.

---

### 6.4 Crear actividad · `/actividades/crear`

La herramienta de quien organiza.

**Composición:** `Encabezado` «Nueva actividad» con botón de cerrar; la línea
«Publicas como República Circular» con su avatar; `CampoTexto` **Nombre**; chips
de **Tipo** (Jornada de trabajo, Taller, Recorrido, Reunión, Fiesta de barrio);
dos campos en fila, **Día** y **Hora**; `CampoTexto` **Lugar**; una tarjeta con
la casilla **«Busco voluntarios»** que, al marcarse, revela la fila «¿Cuántos?»
con un `Contador` y los chips de tareas con un botón «+ Tarea»; una tarjeta
**«NACE DE LA PROPUESTA»** con la propuesta enganchada, un botón para quitarla y
la casilla **«Avisar a quienes apoyaron la propuesta»**; una tarjeta con la
casilla **«Crear afiche con código QR»** y su detalle «Para imprimir y pegar en
el barrio»; `BarraInferior` con «Publicar actividad».

**Enganchar la actividad con la propuesta que la originó y avisar a quienes la
apoyaron es cómo se cierra el ciclo entre deliberar y hacer.** El afiche con QR
responde a que la organización difunde por Instagram, WhatsApp y afiches.

---

### 7.1 Avisos · `/avisos` · `app/(barrio)/avisos.tsx`

**Composición:** título de 30 px y el enlace «Marcar todo leído»; dos grupos,
**HOY** y **ESTA SEMANA**.

**Cada aviso** es una tarjeta tocable con un cuadro de 40 px del color del aviso,
el texto con la primera parte en negrita, la antigüedad, un pie opcional en
`verde` y, si no está leído, un punto rojo de 10 px a la derecha. Los leídos
bajan a opacidad 0,72.

**Los cinco avisos:**

| Destacado | Resto | Cuándo | Ícono / color | Destino |
|---|---|---|---|---|
| Tu reporte avanzó. | Rama caída en Toesca ahora está en gestión. | Hace 2 h | `visto` sobre `menta` | `/reportes/rama-toesca` |
| Estudiantes de FCFM | quieren apoyar la propuesta que apoyaste: Punto limpio vecinal. | Hace 5 h | `birrete` sobre `#DCE7F3` | `/propuestas/punto-limpio` |
| Este sábado 10:00 | es la recuperación de la platabanda. Te toca llevar herramientas. | Recordatorio | `calendario` sobre `#F5E6C8` | `/actividades/platabanda-toesca` |
| Tomás respondió tu comentario en | Punto limpio vecinal | Martes | `globoDialogo` sobre `crema` | `.../conversacion` |
| Nuevo logro: Ojo atento | . Confirmaste 10 reportes de otros vecinos. | Lunes | `medalla` sobre `#F5E6C8` | `/perfil` |

Al tocar uno se marca leído y se navega a su destino, lo que baja el contador
rojo de la barra.

**Esta es la pieza que faltaba en las herramientas anteriores del barrio.** El
Banco del Tiempo murió, entre otras cosas, porque no había notificaciones.

---

### 7.2 Perfil y logros · `/perfil`

**Composición:**

1. **Cabecera sobre `bosque`** con las esquinas inferiores redondeadas a 28:
   botón de volver en tono oscuro y botón «Ajustes» con ícono `deslizadores`;
   avatar cuadrado de 72 px en `brote` con la inicial en `bosque`; «Rosa» en 30
   px familia título y «En el barrio desde octubre 2026»; y las píldoras de
   vínculo en `bosqueClaro` más un enlace «Editar» en `brote`.
2. **Tres cuadros de cifra** en fila: reportes, confirmaciones y propuestas
   apoyadas. **Los números se calculan del estado real**, no son fijos, y las
   etiquetas usan `pluralizar`.
3. **Tarjeta «Logros»** con el contador «3 de 9» y las seis insignias en rejilla
   de tres columnas. Al pie, la frase **«Los logros muestran lo que aportas. No
   dan más peso a tus reportes ni a tus apoyos»**.
4. **`ListaAgrupada`** con tres accesos: Beneficios del barrio, **Soy de una
   universidad o institución** (lleva a Desafíos) y **Panel de gestión** (lleva
   al panel, con el detalle «Solo gestores y moderadores»).

**Las seis insignias:**

| Logro | Ícono | Color | Estado |
|---|---|---|---|
| Primer reporte | `pin` | `#A86E1C` | conseguido |
| Ojo atento | `ojo` | `#2C5A8C` | conseguido |
| Problema resuelto | `visto` | `#1D5E40` | conseguido |
| Guardiana de platabandas | `arbol` | `#2E6B3F` | 3 de 10 |
| Manos a la obra | `personas` | `#7A4A1F` | 0 de 3 |
| Idea que suma | `idea` | `#6B4380` | 0 de 20 apoyos |

Las conseguidas van en un cuadro de 60 px radio 20 de su color con el ícono
blanco. **Las que faltan van en `#EEE7D7` con borde segmentado** y el ícono en
gris, más su avance debajo.

---

### 7.3 Ajustes y accesibilidad · `/perfil/ajustes`

**Composición:** `Encabezado` «Ajustes» y cinco grupos.

**LECTURA Y ACCESIBILIDAD**
- Tarjeta **«Tamaño de la letra»** con tres opciones en fila de 76 px de alto
  mínimo: Normal, Grande y Muy grande, cada una con una muestra «Aa». **La
  muestra no escala con la preferencia a propósito**: se divide por el factor
  actual para que las tres sigan siendo comparables entre sí. Debajo, «Así se
  verán los textos de la aplicación», que sí escala.
- Lista con **Alto contraste** («Bordes y textos más marcados») y **Reducir
  animaciones**.

**AVISOS**: Cuando mis reportes avancen · Apoyo a mis propuestas · Actividades
nuevas en el barrio · Resumen semanal por correo (Los domingos).

**PRIVACIDAD**: Mostrar mi vínculo con el barrio («Ej. Vive en el barrio») ·
Reportar siempre como anónimo · Descargar mis datos · **Eliminar mi cuenta**, en
rojo con `peligrosa`.

**AYUDA**: Cómo funciona la app · Normas de convivencia · Sobre República
Circular (lleva al observatorio) · **Sistema visual** (lleva a `/sistema`).

Y una fila suelta **Cerrar sesión**, que hace `router.replace('/')`.

Los tres primeros interruptores de Avisos y los dos primeros de Accesibilidad
están conectados al contexto de preferencias; el resto son estado local de la
pantalla.

---

### 8.1 Desafíos para instituciones · `/instituciones/desafios`

**Composición:** `Encabezado` con «Desafíos del barrio» y «FCFM · Universidad de
Chile» como subtítulo; párrafo; dos chips de origen (Propuestas · 8, Problemas
frecuentes · 12); un carril horizontal con las seis disciplinas; la cuenta de
resultados; y las tarjetas de desafío.

**Cada tarjeta:** píldora de prioridad, eje, título en 18 px, resumen, un bloque
en `crema` con el ícono `birrete` y «**Busca:** diseño de contenedores y
logística de retiro», y el botón «Me interesa apoyar» cuando el desafío viene de
una propuesta.

**Las prioridades:**

| Nivel | Fondo | Texto |
|---|---|---|
| alta | `#F3DCD7` | `#7A2A24` |
| media | `#F5E6C8` | `#6F4A0E` |
| baja | `crema` | `grisTexto` |

**Los tres desafíos:**

| Prioridad | Eje | Título | Disciplinas |
|---|---|---|---|
| alta | Residuos | Punto limpio vecinal en Sazié con Av. República | Ingeniería, Diseño |
| alta | Áreas verdes | Sombra en calle Toesca: 21 °C más caliente sin árboles | Ingeniería, Agronomía, Arquitectura |
| media | Espacio público | Mapear el estado de las 93 bancas del barrio | Ciencias sociales, Arquitectura |

El filtro por disciplina es real: `desafios.filter(d => d.disciplinas.includes(disciplina))`.

**La universidad no entra a proponer lo que cree que falta, sino a elegir dentro
de lo que la comunidad ya decidió que importa.** Esa es la otra mitad del módulo
de vinculación.

---

### 8.2 Mostrar interés · `/instituciones/interes` (modal)

Recibe la propuesta por parámetro de consulta.

**Composición:** `Encabezado` «Quiero apoyar» con cerrar; una tarjeta con el
título de la propuesta y «Propuesta de Julia R. · 64 apoyos»; la línea «Como ·
FCFM, Universidad de Chile» con ícono `birrete`; **¿Cómo apoyarían?** con cuatro
chips de selección múltiple (Curso o taller, Tesis o memoria, Voluntariado,
Materiales); **¿Cuándo?** con tres chips (Este semestre, Otoño 2027, Por
definir); un `CampoTexto` de 4 líneas con el mensaje; un `Aviso` con ícono
`candado`: «Julia y República Circular recibirán un aviso. **Solo ellos verán tu
correo de contacto**»; `BarraInferior` con «Enviar interés».

Al enviar, el botón pasa a «Interés enviado» en variante `tonal` y aparece un
aviso de confirmación.

---

### 8.3 Observatorio del barrio · `/observatorio`

El mockup mide 390 × 1800. Es la pantalla con más datos reales.

**Composición:** `Encabezado` con «Observatorio del barrio» y «Catastro 2022 y
reportes de vecinos»; tres chips (Resumen, Mapa de calor, Datos); y seis
bloques.

**PLATABANDAS** · «262 de 500 platabandas están abandonadas o ya se
pavimentaron». Una barra apilada de 14 px y la leyenda:

| Tramo | Valor | Color |
|---|---|---|
| En uso | 238 | `#2E6B3F` |
| Abandonadas | 236 | `#A86E1C` |
| Pavimentadas, sin vuelta atrás | 26 | `#9C3A33` |

Nota: «Solo 13 tienen a alguien que las cuide».

**ÁREA VERDE POR HABITANTE** · «Entre 7 y 10 veces menos que el promedio de
Santiago». Tres barras:

| Etiqueta | Valor | Proporción |
|---|---|---|
| **Barrio República** | 0,48 a 0,68 m² | 0,068, en rojo `alerta` |
| Comuna de Santiago | 4,64 m² | 0,464 |
| Meta nacional (CNDU) | 10 m² | 1 |

Nota al pie: «Cálculo del equipo con el Censo 2017 y la capa de áreas verdes
2022. Comuna: SIEDU, INE». **La atribución importa**: esas cifras no están
publicadas en el diagnóstico, son cálculo propio, y el referente de la comuna
viene del SIEDU.

**LO QUE FALTA SABER** · «Sabemos dónde está cada banca, pero no en qué estado».
Bancas con estado 0 de 93, Semáforos 0 de 172, Basureros 4 de 218, cada uno con
una barra de 8 px en `ocre`. Botón «Ayudar a completarlo» que lleva a la ficha
del catastro.

**REPORTES DE VECINOS · NOVIEMBRE** · barras horizontales por categoría: Basura
18, Calles y veredas 9, Árboles 6, Ruido o luz 4, Plagas 3, cada una del color
de su categoría. **Con el aviso «Datos de ejemplo para el prototipo»**, que
distingue explícitamente lo real de lo simulado.

**TRABAJOS DEVUELTOS AL BARRIO** · Diagnóstico socioambiental 2022 (República
Circular) y Levantamiento con vecinos 2026 (Estudiantes FCFM · IE4000).

**Datos abiertos para investigar** · «Sin nombres ni correos. Ubicaciones
redondeadas a la cuadra» y el botón «Descargar CSV o GeoJSON».

---

### 9.1 Panel de gestión · `/gestion/panel`

**Composición:** `Encabezado` con «Panel de gestión» y «Camila · Gestora
territorial y moderadora»; tres cuadros de alerta; un carril de cuatro filtros;
la lista; y `BarraInferior` con «Exportar para la Municipalidad».

**Los tres cuadros**, calculados del estado real:

| Cuadro | Cómo se calcula | Color |
|---|---|---|
| Por revisar | reportes en `recibido` | `verde` |
| Señalados | reportes con `senalamientos > 0` | `alerta` |
| Sin avance +30 d | reportes cuyo resumen contiene «sin avance» | `ocre` |

**Los cuatro filtros** (chips con `chevronAbajo`): Categoría, **Zona: Eje
universitario** (activo por defecto), Estado, Más antiguos.

**Cada fila** lleva la marca de categoría de 38, el título, y debajo el resumen
o, si está señalado, el ícono `bandera` con «Señalado por 3 vecinos» en rojo. A
la derecha la píldora de estado. **Las filas señaladas llevan borde de 1,5 px en
`alerta`.**

**Esta es la herramienta de trabajo diaria de República Circular.** Con entre
tres y diez personas activas, lo que importa es ver de una pasada qué está
señalado, qué no avanza y qué hay que revisar.

---

### 9.2 Revisión de reporte · `/gestion/moderar/[id]`

**Composición:**

1. `Encabezado` «Revisar reporte», con «Volver al panel» como etiqueta.
2. Si tiene señalamientos, un `Aviso` de cuidado con ícono `bandera`:
   «**Señalado por 3 vecinos** como «no existe». Nadie más lo ha confirmado».
3. Tarjeta con el rótulo de categoría, la antigüedad, el título en 20 px,
   «Publicado como anónimo» o el autor, y la descripción entre comillas
   angulares.
4. **Tarjeta de posible duplicado**: cuadro de 40 px con `enlace`, «Puede ser el
   mismo que otro reporte», la referencia con distancia y confirmaciones, y el
   botón «Unir los dos reportes».
5. **«Cambiar estado»** con las cuatro opciones compactas en rejilla.
6. **«Si lo ocultas, ¿por qué?»** con tres opciones de selección única: No existe
   o es falso · Tiene datos personales u ofensas · Es delito o emergencia
   (derivar al 133). Debajo, «Quien lo publicó recibe el motivo».
7. `BarraInferior` con **«Ocultar»** en variante `peligro` (la única aparición de
   esa variante, deshabilitada hasta elegir motivo) y **«Guardar cambios»**
   (deshabilitado hasta elegir un estado).

**Por qué la moderación existe pese a estar priorizada como Should.** El riesgo
de reportes falsos apareció en terreno como la principal causa declarada de
desconfianza hacia la plataforma, y esa desconfianza es anterior al uso: no es
un problema que aparezca cuando hay volumen, es un problema que impide que lo
haya.

---

### Resumen de cobertura

| Mockup | Archivo | Nota |
|---|---|---|
| 1.1 a 1.4 | `app/index.tsx`, `app/ingreso/*` | |
| 0 Sistema visual | `app/sistema.tsx` | Adaptado de lámina ancha a teléfono |
| 2.1 a 2.4 | `app/(barrio)/{inicio,mapa}.tsx`, `app/mapa/*` | |
| 3.1 a 3.7 | `app/reportar/*` | |
| 4.1 | `app/(barrio)/mis-reportes.tsx` | |
| 4.2 y **4.3** | `app/reportes/[id].tsx` | **Una pantalla, dos estados** |
| 5.1 a 5.5 | `app/propuestas/*` | Más `nueva/revisar.tsx`, agregada |
| 6.1 a 6.4 | `app/actividades/*` | |
| 7.1 a 7.3 | `app/(barrio)/avisos.tsx`, `app/perfil/*` | |
| 8.1 a 8.3 | `app/instituciones/*`, `app/observatorio.tsx` | |
| 9.1 y 9.2 | `app/gestion/*` | |

**36 mockups, 35 archivos de pantalla más uno agregado.** La diferencia es que
4.2 y 4.3 comparten archivo, y que el paso 3 del flujo de propuesta se agregó
para completar la numeración que los propios mockups declaran.

---

## 12. Datos de ejemplo

Ocho archivos en `src/datos`. **El contenido, las fechas y los contadores son los
de los mockups**: las pantallas de inicio, mapa, mis reportes, detalle, panel de
gestión y moderación cuentan todas la misma historia, con los mismos nombres y
las mismas cifras.

Las posiciones son el **centro** de cada marcador sobre el plano de 390 × 844.

---

### 12.1 Personas · `personas.ts`

| id | Nombre | Inicial | Vínculo |
|---|---|---|---|
| `rosa` | Rosa | R | Vive en el barrio |
| `julia` | Julia R. | J | Vive en el barrio |
| `tomas` | Tomás | T | Estudia en el barrio |
| `hernan` | Don Hernán | H | Vive en el barrio |
| `camila` | Camila | C | Gestora territorial |
| `marta` | Marta | M | Tiene un local |
| `republicaCircular` | República Circular | RC | Gestión territorial · organización verificada |

`personaActual` es `personas.rosa`. El objeto se declara con
`satisfies Record<string, Persona>` y no con una anotación de tipo, **para que
`personas.hernan` esté tipado como `Persona` y no como `Persona | undefined`**,
que es lo que pasaría con `noUncheckedIndexedAccess` activado.

---

### 12.2 Reportes · `reportes.ts`

Nueve reportes.

| id | Categoría | Título | Estado | Conf. | Mío | Posición |
|---|---|---|---|---|---|---|
| `microbasural-sazie` | basura (subtipo microbasural) | Microbasural en Sazié con Av. República | verificado | 12 | sí | 202, 206 |
| `rama-toesca` | arboles | Rama caída en Toesca con Av. Ejército | gestion | 5 | sí | 292, 602 |
| `vereda-domeyko` | calles | Vereda levantada en Domeyko | recibido | 0 | sí | 68, 470 |
| `microbasural-vergara` | basura (microbasural) | Microbasural en Toesca con Vergara | **resuelto** | 9 | sí | 150, 640 |
| `contenedor-grajales` | basura | Contenedor rebalsado en Grajales | verificado | 8 | no | 120, 314 |
| `basura-grajales-vergara` | basura | Basura en Grajales con Vergara | recibido | 0 | no | 96, 336 |
| `rampa-republica` | calles | Rampa rota en Av. República | verificado | 6 | no | 212, 250 |
| `foco-domeyko` | ruido | Foco que encandila en Domeyko | recibido | 1 | no | 300, 470 |
| `arbol-toesca` | arboles | Árbol seco en Toesca | gestion | 7 | no | 196, 596 |

**Detalles que importan para que las pantallas calcen:**

- `basura-grajales-vergara` tiene **`senalamientos: 3` y `autor: null`**. Es el
  que alimenta el cuadro «Señalados» del panel y la pantalla de moderación.
- `rampa-republica` tiene el resumen «Verificado · hace 41 días **sin avance**».
  La palabra «sin avance» es la que detecta el panel para su tercer contador.
- `microbasural-sazie` es el único con `comentarios`: tres, de Don Hernán
  (duda), Camila (respuesta) y Marta (a favor). Y el único con
  `propuestas: ['punto-limpio']`.
- Los cuatro `esMio: true` son los que alimentan «Mis reportes».
- **Cada reporte lleva sus cuatro eventos de seguimiento siempre**, con
  `ocurrio` en `false` y una frase a futuro para los que no pasaron.

---

### 12.3 Propuestas · `propuestas.ts`

Tres propuestas.

| id | Título | Eje | Etapa | Apoyos | Autor |
|---|---|---|---|---|---|
| `punto-limpio` | Punto limpio vecinal en Sazié con Av. República | Residuos | priorizada | 64 | Julia R. |
| `huerta-toesca` | Huerta comunitaria en la platabanda de Toesca | Áreas verdes | enMarcha | 51 | Camila |
| `placas-casonas` | Placas con la historia de las casonas de Av. República | Patrimonio | conversacion | 38 | Don Hernán |

**`punto-limpio` es la que tiene todo el detalle**, porque es la que se recorre
en la demostración:

- `respondeA`: «6 reportes de basura en esta esquina».
- `mejoraIncorporada`: «se sumó un turno de cuidado los sábados, idea de Tomás».
- Tres `necesita`: Manos voluntarias (**9 de 15**), Conocimiento técnico
  («Estudiantes de FCFM se ofrecieron») y Permiso municipal («En trámite por
  República Circular»).
- Dos `quierenApoyar`: FCFM con ícono `birrete` y el Almacén de la esquina con
  ícono `comercio`.
- Tres comentarios de primer nivel con dos respuestas anidadas:
  - Tomás, postura **mejora**, con `incorporado: 'La autora la sumó a la
    propuesta'` y 14 útiles. Respuesta de Julia.
  - Don Hernán, postura **duda**, 5 útiles. Respuesta de Camila.
  - Marta, postura **en contra**, 6 útiles. Sin respuesta.

`huerta-toesca` tiene `apoyadaPorMi: true`, que es lo que hace que aparezca en
la pestaña Propuestas de «Mis reportes».

**Catálogos del mismo archivo:** `ejesDePropuesta` (4), `tiposDeApoyo` (4, con la
bandera `conCantidad`) y `disciplinas` (6).

---

### 12.4 Actividades · `actividades.ts`

| id | Título | Fecha | Hora | Inscritos | Voluntarios | Nace de |
|---|---|---|---|---|---|---|
| `platabanda-toesca` | Recuperemos la platabanda de Toesca | SÁB 14 NOV | 10:00 | 18 | 9 de 15 | `huerta-toesca` |
| `taller-compostaje` | Taller de compostaje en casa | MIÉ 18 NOV | 18:30 | 8 | 0 de 0 | |
| `recorrido-casonas` | Recorrido por las casonas de Av. República | SÁB 21 NOV | 11:00 | 23 | 2 de 4 | `placas-casonas` |

La primera es la de la demostración. Sus tareas: Llevar herramientas, Regar la
primera semana, Difundir. Organiza República Circular.

**Catálogos:** `filtrosDeActividad` (3) y `tiposDeActividad` (5).

---

### 12.5 Avisos · `avisos.ts`

Cinco avisos, tres en `hoy` y dos en `semana`, con los textos de la tabla del
capítulo 11. Los tres de hoy están sin leer, lo que da el contador **3** de la
barra de navegación.

---

### 12.6 Catastro · `catastro.ts`

Doce capas, cuatro del grupo `ahora` y ocho del grupo `catastro`, con las cifras
reales del diagnóstico 2022 (ver capítulo 11, pantalla 2.3).

Una ficha: `platabanda-grajales`, en Grajales entre Av. República y Av.
Ejército, estado anotado «Abandonada», nadie la cuida, última revisión «Feb
2023», con el dato «Solo 13 de 500 platabandas tienen quien las cuide».

---

### 12.7 Perfil · `perfil.ts`

- `resumenDelPerfil`: desde octubre 2026, dos vínculos, 4 reportes, 11
  confirmaciones, 6 propuestas apoyadas. **Solo `confirmaciones` se usa tal
  cual**; las otras dos cifras se calculan del estado real.
- `logros`: las seis insignias del capítulo 11, más `totalDeLogros = 9`.
- `vinculosConElBarrio`: las seis opciones del registro.
- `interesesDelMapa`: los siete intereses con su sigla.

---

### 12.8 Observatorio · `observatorio.ts`

**Todas las cifras vienen del diagnóstico socioambiental 2022 de República
Circular**, menos el área verde por habitante, que es cálculo del equipo
cruzando el polígono del barrio con el Censo 2017, y el referente de la comuna,
que viene del SIEDU. Los reportes de vecinos son datos de ejemplo y la pantalla
lo declara.

Exporta `platabandas`, `areaVerde`, `loQueFaltaSaber`, `reportesDelMes`,
`trabajosDevueltos`, `desafios` (3), `formasDeApoyoInstitucional` (4) y
`plazosDeApoyo` (3).

---

## 13. Convenciones de código

### 13.1 El dominio se nombra en español

`Reporte`, `Propuesta`, `usarBarrio`, `Boton`, `Tarjeta`, `Fila`, `Columna`. Lo
técnico mantiene su nombre de siempre: `useState`, `ScrollView`, `onPress`,
`style`.

**Es una decisión, no un accidente.** El backlog, los mockups, las historias de
usuario y la contraparte hablan en español, y así el código usa las mismas
palabras que la ficha del proyecto. Si alguien prefiere inglés, es un cambio
mecánico ahora y caro después.

Las props también van en español: `tamano`, `peso`, `separacion`, `alinear`,
`crecer`, `deshabilitado`, `accesibilidad`.

### 13.2 Un archivo, una responsabilidad

Ninguna pantalla pasa de 350 líneas. El archivo más largo del proyecto es
`src/estado/barrio.tsx` con 447, y es el único que supera las 350 porque
concentra todas las acciones a propósito.

Cuando una pantalla necesita una pieza propia, se declara **debajo** del
componente principal en el mismo archivo y no se exporta. Ejemplos:
`FormasDeFondo` en la bienvenida, `CuadroDeCategoria` en el paso 1 del reporte,
`FilaDeResumen` y `CuadroDeIcono` en la revisión, `BarraDeEtapas`,
`FilaDeApoyo` y `CaritasDeApoyo` en el detalle de propuesta, `PlanoDeContexto`
en la ficha del catastro.

Si una pieza se usa en dos pantallas, sube a `componentes/app`. Si deja de
conocer el dominio, baja a `componentes/base`.

### 13.3 Tipos explícitos

`strict` está activado, más `noUncheckedIndexedAccess`, `noUnusedLocals` y
`noUnusedParameters`. No hay un solo `any` en el proyecto. **La única aserción
es `as never`** en `router.replace`, que es necesaria por cómo expo-router tipa
las rutas.

Los tipos de props se declaran como `type PropsNombre = {...}` encima del
componente, con comentarios de documentación en las props que lo necesitan.

### 13.4 Estilo de los comentarios

- **Explican el porqué, no el qué.** `// suma uno al contador` no aporta nada.
- Cuando una decisión viene del levantamiento en terreno o de un acuerdo con la
  contraparte, el comentario lo dice.
- Cada archivo abre con un bloque que explica qué es y por qué existe. Las
  pantallas abren con el número y el nombre del mockup.
- **Sin emojis.** Sin punto y coma para separar ideas dentro de una oración: se
  usan puntos. Sin raya larga.
- Los comentarios de código van **sin tildes**, para evitar problemas de
  codificación entre editores. Los textos que ve la persona usuaria sí las
  llevan, correctamente.

### 13.5 Patrones que se repiten

| Patrón | Cómo se escribe |
|---|---|
| Render condicional | `{condicion ? <Algo /> : null}`, nunca `&&` |
| Props opcionales de estilo | `...(condicion ? { prop: valor } : null)` dentro del objeto de estilo |
| Lista con separador | `<Columna separacion={N}>`, no márgenes en cada hijo |
| Dos elementos del mismo ancho | `<Fila separacion={10}>` con `style={{ flex: 1 }}` en cada uno |
| Valor derivado | Se calcula en el cuerpo del componente, no se guarda en estado |
| Texto compuesto | `<Texto>` anidado dentro de otro `<Texto>` para las partes en negrita |

### 13.6 Qué no hay en el proyecto

- No hay `StyleSheet.create`. Los estilos van en línea, porque la mayoría
  dependen de props y el componente los compone.
- No hay archivos de constantes sueltas: todo valor compartido vive en
  `src/diseno` o `src/dominio`.
- No hay pruebas automatizadas. La única verificación es `npm run revisar-tipos`
  más el recorrido manual en el navegador.
- No hay internacionalización. La aplicación es en español y el territorio es un
  barrio específico.

---

## 14. Trampas conocidas

Cada una de estas costó tiempo. Están documentadas para que nadie las vuelva a
pisar, y varias tienen un comentario en el código advirtiéndolo.

### 14.1 Una `Fila` aplasta a los hijos que solo tienen `flex`

`Fila` trae `alignItems: 'center'` por defecto. **Si un hijo no declara altura y
solo tiene `flex`, se colapsa a cero y no se dibuja.** No hay error, no hay
advertencia: simplemente no está.

Pasó dos veces:

- La `BarraDePasos` del registro desaparecía. Se arregló envolviéndola en
  `<View style={{ flex: 1 }}>` en vez de `<Fila crecer={1}>`.
- La barra apilada de platabandas del observatorio no se veía. Se arregló
  agregando `alinear="stretch"` a la `Fila` contenedora.

**Regla:** si un hijo tiene `flex` y no altura, el contenedor necesita
`alinear="stretch"`, o el hijo necesita una altura explícita.

### 14.2 Un hijo con `flex: 0` no reserva ancho

En `Opcion` compacta, el texto estaba envuelto en una vista con `flex: 0`. El
resultado fue que «Esta semana» se dibujaba como una columna vertical de nueve
letras.

**Regla:** si la caja no necesita crecer, no envolver el texto en una vista.

### 14.3 `router.back()` falla en los enlaces directos

Al entrar por enlace compartido o al recargar en el navegador no hay historia, y
`router.back()` lanza «The action 'GO_BACK' was not handled». El botón queda
muerto.

**Solución:** `crearVolver(destino)` de `src/utiles/navegacion.ts`, que comprueba
`router.canGoBack()` y si no, hace `replace` a la pantalla contenedora. Las 27
pantallas con botón de volver lo usan.

### 14.4 Figma no lee el contenido de un `<tspan>` posicionado

No afecta a la aplicación, pero sí al paquete de diseño del que salieron estos
mockups: al exportar a SVG hay que emitir **un `<text x y>` por línea visual**.
Con tspans, Figma crea la capa de texto con la tipografía y el color correctos
pero vacía, y el resultado es una pantalla con todas las formas y ningún texto,
sin ningún mensaje de error.

### 14.5 Expo SDK 57 ya no usa `@react-navigation`

`Tabs` se importa de **`expo-router/js-tabs`**; desde `expo-router` está marcado
como obsoleto. De ahí sale también `BottomTabBarProps`. Existe además una API sin
estilos en `expo-router/ui` con `TabList`, `TabTrigger` y `TabSlot`.

Si alguien busca `@react-navigation/bottom-tabs` en `node_modules` no lo va a
encontrar.

### 14.6 `babel-preset-expo` no queda en la raíz de `node_modules`

Un `babel.config.js` que lo nombre falla con «Cannot find module
'babel-preset-expo'» y el empaquetado se cae con un error que apunta a otra
parte («Cannot read properties of undefined (reading 'transformFile')»).

**Solución:** instalarlo como dependencia de desarrollo.

### 14.7 `npm install` se rompe por `react-dom`

`react-dom` es un peer opcional de `expo`. npm intenta resolverlo a la última
versión, que pide `react ^19.3.0`, y choca con el `react 19.2.3` que fija el SDK.

**Solución:** fijar `react-dom` a la misma versión de `react` en
`dependencies`. Si alguien borra esa línea, el proyecto deja de instalarse.

### 14.8 Los paquetes `@expo-google-fonts/*` dan conflicto de peers

No se instalan con este SDK. **Sale más barato bajar los `.ttf` del repositorio
`google/fonts` a `assets/fonts`** y cargarlos con `expo-font`: además quedan
dentro del proyecto y no dependen de la red.

### 14.9 React Native no tiene `outline`

El aro de selección del marcador del mapa estaba escrito con `outlineWidth`, que
es una propiedad de la web. **Se dibuja como un marco de color detrás del
marcador**, usando relleno en el contenedor.

### 14.10 `inset: 0` puede no estar disponible

Para posicionar una capa absoluta a pantalla completa conviene escribir
`top: 0, left: 0, right: 0, bottom: 0` en vez de `inset: 0`.

### 14.11 `baseUrl` está obsoleto en TypeScript 6

`tsc` falla con «Option 'baseUrl' is deprecated». Los alias se declaran solo con
`paths` y rutas relativas (`"@/*": ["./src/*"]`).

### 14.12 Cómo verificar sin dispositivo

| Verificación | Comando | Qué detecta |
|---|---|---|
| Tipos | `npm run revisar-tipos` | Errores de tipo, imports sin usar, variables muertas |
| Empaquetado | `npx expo export --platform android` | Errores de resolución de módulos y de Babel |
| Visual | `npm run web` | Todo lo demás |

**El empaquetado detecta cosas que el chequeo de tipos no**, como un plugin de
Babel que no resuelve. Vale la pena correr los dos.

---

## 15. Operación: correr, verificar, extender

### 15.1 Instalar y correr

```bash
npm install
npm start          # luego escanear el QR con Expo Go
```

Otras formas:

```bash
npm run web        # en el navegador, la más rápida para mostrar
npm run android    # emulador o dispositivo conectado
npm run ios        # solo en macOS
npm run revisar-tipos
```

Para el teléfono hacen falta la aplicación **Expo Go** y que el computador y el
teléfono estén en la misma red wifi.

### 15.2 Diferencias del navegador

| | Teléfono | Navegador |
|---|---|---|
| Vibración | sí | no |
| Cámara y galería | sí | no |
| Datos | en memoria, se pierden al cerrar | en memoria, **se pierden al recargar** |
| Preferencias | persisten | persisten en el almacenamiento del navegador |
| Animaciones | fluidas | fluidas, pero tardan un poco más en asentarse |

### 15.3 Qué hace falta para cada pieza pendiente

#### Conectar Supabase

1. Crear las tablas a partir de `src/dominio/tipos.ts`. Cada tipo tiene una
   tabla equivalente: `personas`, `reportes`, `eventos_de_seguimiento`,
   `propuestas`, `apoyos_necesarios`, `comentarios`, `actividades`, `avisos`,
   `capas`, `logros`.
2. Habilitar **PostGIS** y cambiar `PuntoEnMapa` por una columna `geography`.
3. Reemplazar el cuerpo de las acciones de `src/estado/barrio.tsx` por llamadas
   al cliente. **La firma de cada acción no cambia**, así que las pantallas
   quedan intactas.
4. Borrar `src/datos`, o dejarlo como semilla para desarrollo.
5. Definir políticas de fila: un reporte anónimo no debe exponer su autor.

#### Cambiar el plano por OpenStreetMap

1. Instalar `react-native-maps` o una alternativa con teselas de OSM.
2. Reemplazar `src/componentes/app/MapaBarrio.tsx` manteniendo el contrato:
   recibir hijos y darles una función `ubicar(punto, tamano)`.
3. Cambiar `PuntoEnMapa` de coordenadas del plano a latitud y longitud.
4. **Para migrar las capas del catastro 2022 hace falta la autorización escrita
   de República Circular**: los datos no tienen licencia declarada y acceso
   público no equivale a licencia abierta.

#### Acceso por código al correo

Supabase trae enlaces mágicos y códigos de un solo uso. La pantalla
`ingreso/cuenta.tsx` ya tiene el formulario y el texto; falta la pantalla de
ingreso del código de seis números y conectar la sesión.

#### Notificaciones

`expo-notifications` más una función de Supabase que dispare al cambiar el
estado de un reporte. Las preferencias `avisarCambioDeEstado` y
`avisarActividades` ya existen y persisten.

#### Fotografías

Supabase Storage. `FotoSimulada` se reemplaza por `<Image>` y el paso 2 del
asistente ya entrega las URI locales.

#### Alto contraste

La preferencia existe y persiste pero no cambia nada visualmente. Conectarla
significa definir una segunda paleta de bordes y grises y hacer que los
componentes base la consulten.

### 15.4 Cómo agregar cosas

| Para agregar | Dónde |
|---|---|
| Una pantalla | Un archivo en `app/`. La ruta es la carpeta |
| Un ícono | Una entrada en `src/diseno/iconos.ts`. El tipo se actualiza solo |
| Una categoría de reporte | `src/dominio/categorias.ts`: el id en el arreglo, la entrada en el objeto, y el ícono si no existe |
| Un estado o una etapa | `src/dominio/estados.ts`. Ojo con `paso` y con `totalDePasosDeEstado` |
| Un color | `src/diseno/colores.ts`, **nunca suelto en una pantalla** |
| Una acción sobre los datos | `src/estado/barrio.tsx`: la función, el tipo del contexto y las dos listas de dependencias del `useMemo` |
| Un componente reutilizable | `componentes/base` si no conoce el dominio, `componentes/app` si sí. Y su línea en el barril |

---

## 16. Trazabilidad con los mockups

### 16.1 De dónde salieron estos valores

Los mockups originales son 36 archivos `.dc.html` exportados del lienzo de
diseño. De ellos se derivó un paquete de exportación en
`Desktop\Barrio Republica - Export Diseno` con HTML limpio, SVG, PDF, PNG y
tokens de diseño, con **99,76 % de fidelidad media verificada píxel a píxel**.

De ese paquete salieron, literalmente:

| Qué | Cómo |
|---|---|
| Los colores, tipografías, radios y espaciados | De la lámina «0 Sistema visual» y del inventario de tokens |
| **Los 51 íconos** | Extraídos con un script que recorrió los 36 HTML y recogió los `path`, `circle` y `rect` de cada `<svg class="i">` |
| Las ocho categorías con su color e ícono | Del arreglo de datos dentro de `Reportar1.dc.html` |
| Los estados y etapas con sus colores | De las píldoras de `Sistema.dc.html` |
| Los textos | De la extracción del contenido de las 36 pantallas |
| Las calles del plano | Del SVG de fondo de `Mapa.dc.html` |

### 16.2 Una advertencia sobre los mockups originales

Los `.dc.html` **no son HTML fijo**: traen lógica con `sc-for`, `sc-if` e
interpolación `{{ }}`, y su runtime (`support.js`) **no viene dentro del zip
exportado**. Cinco pantallas (Vínculo, Intereses, Reportar 1, Detalle de
propuesta y Ajustes) arman su contenido en tiempo de ejecución.

Si alguien vuelve a exportarlos sin ejecutar esa lógica, esas cinco pantallas
salen con `{{ c.label }}` literal en vez de las categorías, los intereses o los
vínculos. **El defecto es silencioso**: el resto de la pantalla se ve perfecta.

Antes de dar un export por bueno: `grep -l "{{" *.html`.

### 16.3 Diferencias deliberadas con los mockups

| Mockup | En la aplicación | Por qué |
|---|---|---|
| Lámina «0 Sistema visual» de 1280 × 1100 | Pantalla de teléfono desplazable | No cabe de otra forma, y así se alimenta de los componentes reales |
| 4.2 y 4.3 son dos láminas | Un archivo con dos estados | Es la misma pantalla con el reporte en otro estado |
| El flujo de propuesta dice «Paso X de 3» pero dibuja dos | Se agregó una vista previa como paso 3 | Completa la numeración que los propios mockups declaran |
| Radios y casillas HTML nativos | Un solo `Presionable` grande | Más fácil de usar con una mano y cumple los 56 px |
| Relleno fijo de 56 px arriba | `margenSeguro.top + 12` | Reproduce los 56 px en un teléfono real, con muesca o sin ella |
| Posiciones absolutas en 390 × 844 | Disposición flexible | Tiene que funcionar en cualquier tamaño de teléfono |

---

## 17. Código fuente completo

Los 97 archivos del proyecto, íntegros y sin recortes, en el orden en que
conviene crearlos: primero la configuración, después cada capa de `src` y al
final las pantallas. Esta es la fuente de verdad definitiva del documento.

### 17.1 Configuración del proyecto

#### `package.json`

Dependencias, scripts y punto de entrada. (41 líneas)

```json
{
  "name": "barrio-republica-app",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "dependencies": {
    "@react-native-async-storage/async-storage": "2.2.0",
    "@supabase/supabase-js": "^2.118.0",
    "expo": "~57.0.27",
    "expo-constants": "~57.0.21",
    "expo-font": "~57.0.4",
    "expo-haptics": "~57.0.3",
    "expo-image-manipulator": "~57.0.21",
    "expo-image-picker": "~57.0.20",
    "expo-linking": "~57.0.12",
    "expo-router": "~57.0.25",
    "expo-splash-screen": "~57.0.9",
    "expo-status-bar": "~57.0.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.3",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-reanimated": "4.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-svg": "15.15.4",
    "react-native-web": "^0.21.2"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "babel-preset-expo": "~57.0.0",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "revisar-tipos": "tsc --noEmit"
  },
  "private": true
}
```

#### `app.json`

Configuración de Expo: nombre, esquema, complementos y permisos. (49 líneas)

```json
{
  "expo": {
    "name": "Barrio República",
    "slug": "barrio-republica-app",
    "scheme": "barriorepublica",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0F3D2A"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "cl.republicacircular.barriorepublica"
    },
    "android": {
      "package": "cl.republicacircular.barriorepublica",
      "adaptiveIcon": {
        "backgroundColor": "#0F3D2A",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      [
        "expo-image-picker",
        {
          "photosPermission": "La aplicación usa tus fotos para adjuntar evidencia a un reporte del barrio.",
          "cameraPermission": "La aplicación usa la cámara para fotografiar lo que estás reportando."
        }
      ],
      "expo-splash-screen"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

#### `babel.config.js`

Preset de Expo más el plugin de worklets de Reanimated. (9 líneas)

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // El plugin de worklets habilita las animaciones de Reanimated y tiene que
    // ser siempre el ultimo de la lista.
    plugins: ['react-native-worklets/plugin'],
  };
};
```

#### `tsconfig.json`

TypeScript estricto con el alias @/* hacia src. (23 líneas)

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### 17.2 Tokens de diseño · src/diseno

#### `src/diseno/colores.ts`

La paleta completa. No importa nada del proyecto. (67 líneas)

```ts
/**
 * Paleta de la plataforma, tomada tal cual de la lamina "0 Sistema visual" de
 * los mockups. Ningun color se escribe suelto en las pantallas: si hace falta
 * uno nuevo, se agrega aqui con su nombre.
 */
export const colores = {
  /** Fondo de las pantallas oscuras y titulos sobre crema. */
  bosque: '#0F3D2A',
  /** Color de accion principal. */
  verde: '#1D5E40',
  /** Acento vivo sobre fondo oscuro. */
  brote: '#6DBE5C',
  /** Fondo de apoyo suave, confirmaciones y resueltos. */
  menta: '#DCEBD8',
  /** Fondo general de la aplicacion. */
  crema: '#F4EFE3',
  /** Fondo de tarjetas y hojas. */
  papel: '#FFFCF5',
  /** Acento calido para actividades. */
  ocre: '#A86E1C',
  /** Color del texto principal. */
  tinta: '#17231C',

  /** Gris de apoyo. Cumple 4,5:1 sobre crema y sobre papel. */
  grisTexto: '#56625B',
  /** Borde de tarjetas sobre crema. */
  borde: '#E2DACA',
  /** Borde de controles e interactivos en reposo. */
  bordeFuerte: '#CFC6B1',
  /** Fondo del lienzo detras de las pantallas de bienvenida. */
  lienzo: '#E9E3D3',
  /** Fondo de campos deshabilitados y separadores suaves. */
  cremaHundida: '#E9E3D3',

  /** Verdes de apoyo que solo aparecen sobre fondo bosque. */
  bosqueClaro: '#17503A',
  bosqueMedio: '#164A34',
  bosqueBorde: '#3E7258',
  bosqueBarra: '#2D5E47',
  textoSobreBosque: '#D9E6DA',
  textoTenueSobreBosque: '#BFD6C3',

  /** Blanco puro, reservado para texto sobre marcadores de color. */
  blanco: '#FFFFFF',

  /** Rojo de avisos y de errores. Solo para contadores y alertas. */
  alerta: '#A8321F',
  /** Amarillo de "en gestion" sobre fondo bosque. */
  ambarSobreBosque: '#F2C879',

  /** Azul de la ubicacion propia en el mapa. */
  ubicacionPropia: '#2C6FD1',
  /** Fondo del mapa y de sus manzanas. */
  mapaFondo: '#E8E1CF',
  mapaVerde: '#C6DBB3',
  mapaManzana: '#D9CFB8',
  mapaCalle: '#FBF8F0',
  mapaLimite: '#E2D9C3',
  mapaTexto: '#857C69',

  /** Trama diagonal que reemplaza a las fotos en el prototipo. */
  fotoTramaClara: '#E3DAC6',
  fotoTramaOscura: '#DCD2BC',
  fotoIcono: '#8C8370',
} as const;

export type NombreColor = keyof typeof colores;
```

#### `src/diseno/tipografia.ts`

Las dos familias, los archivos de fuente y la escala de texto. (38 líneas)

```ts
/**
 * Dos familias, igual que en los mockups. Fira Sans Condensed para titulos y
 * Atkinson Hyperlegible para todo lo demas, elegida porque fue disenada para
 * personas con baja vision.
 */
export const familias = {
  titulo: 'FiraSansCondensed-Bold',
  tituloSemi: 'FiraSansCondensed-SemiBold',
  texto: 'AtkinsonHyperlegible-Regular',
  textoFuerte: 'AtkinsonHyperlegible-Bold',
} as const;

/** Mapa de archivos que carga expo-font al arrancar. */
export const archivosDeFuente = {
  'FiraSansCondensed-Bold': require('../../assets/fonts/FiraSansCondensed-Bold.ttf'),
  'FiraSansCondensed-SemiBold': require('../../assets/fonts/FiraSansCondensed-SemiBold.ttf'),
  'AtkinsonHyperlegible-Regular': require('../../assets/fonts/AtkinsonHyperlegible-Regular.ttf'),
  'AtkinsonHyperlegible-Bold': require('../../assets/fonts/AtkinsonHyperlegible-Bold.ttf'),
};

/**
 * Escalones de texto del sistema visual. El tamano base es 17, pensado para
 * leerse sin lentes y con sol. La regla de accesibilidad prohibe bajar de 13.
 */
export const escalaTexto = {
  portada: 44,
  pantalla: 32,
  titulo: 28,
  seccion: 22,
  subtitulo: 19,
  destacado: 18,
  base: 17,
  cuerpo: 16,
  apoyo: 14,
  menor: 13,
} as const;

export type EscalonTexto = keyof typeof escalaTexto;
```

#### `src/diseno/medidas.ts`

Espacios, radios, alturas tocables y las cuatro sombras. (69 líneas)

```ts
import { Platform, type ViewStyle } from 'react-native';

/** Separaciones que se repiten en los mockups. */
export const espacio = {
  minimo: 2,
  apretado: 4,
  corto: 6,
  normal: 8,
  comodo: 10,
  medio: 12,
  amplio: 16,
  seccion: 20,
  bloque: 24,
} as const;

/** Radios de esquina. El valor "redondo" convierte cualquier caja en pildora. */
export const radio = {
  chico: 7,
  medio: 11,
  boton: 14,
  caja: 16,
  tarjeta: 22,
  hoja: 26,
  redondo: 999,
} as const;

/**
 * Alturas minimas de zona tocable. La regla de accesibilidad del sistema pide
 * 44 px para cualquier elemento y 56 para las acciones principales.
 */
export const alturaTocable = {
  minima: 44,
  control: 48,
  boton: 52,
  principal: 56,
  destacada: 58,
} as const;

/**
 * Las sombras se declaran aqui porque iOS y Android las describen distinto y
 * repetir los dos juegos de propiedades en cada pantalla ensucia el codigo.
 */
function sombra(
  desplazamientoY: number,
  difuminado: number,
  opacidad: number,
  elevacion: number,
): ViewStyle {
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#17231C',
      shadowOffset: { width: 0, height: desplazamientoY },
      shadowOpacity: opacidad,
      shadowRadius: difuminado,
    },
    default: { elevation: elevacion },
  }) as ViewStyle;
}

export const sombras = {
  /** Marcadores del mapa y chips flotantes. */
  suave: sombra(2, 8, 0.12, 2),
  /** Botones elevados y marcadores grandes. */
  media: sombra(4, 10, 0.2, 4),
  /** Controles flotantes sobre el mapa. */
  flotante: sombra(4, 16, 0.14, 6),
  /** Hoja inferior. La sombra va hacia arriba. */
  hoja: sombra(-6, 24, 0.14, 12),
} as const;
```

#### `src/diseno/iconos.ts`

Los 51 íconos como datos, extraídos de los mockups. (160 líneas)

```ts
/**
 * Catalogo de iconos de la aplicacion.
 *
 * Los trazos estan copiados uno a uno desde los mockups, asi que cada icono se
 * dibuja exactamente igual que en el diseno aprobado. Todos comparten el lienzo
 * de 24 x 24 y se pintan con linea, nunca con relleno, para que hereden el
 * color del texto que acompanan.
 *
 * Para agregar un icono nuevo basta con sumar una entrada aqui. El componente
 * Icono y el tipo NombreIcono se actualizan solos.
 */

export type TrazoIcono =
  | { figura: 'linea'; d: string }
  | { figura: 'circulo'; cx: number; cy: number; r: number }
  | { figura: 'rectangulo'; x: number; y: number; ancho: number; alto: number; radio?: number };

function linea(d: string): TrazoIcono {
  return { figura: 'linea', d };
}

function circulo(cx: number, cy: number, r: number): TrazoIcono {
  return { figura: 'circulo', cx, cy, r };
}

function rectangulo(
  x: number,
  y: number,
  ancho: number,
  alto: number,
  radio?: number,
): TrazoIcono {
  return { figura: 'rectangulo', x, y, ancho, alto, radio };
}

export const iconos = {
  // Navegacion y flechas
  flechaIzquierda: [linea('m15 6-6 6 6 6')],
  flechaDerecha: [linea('m9 6 6 6-6 6')],
  chevronAbajo: [linea('m6 9 6 6 6-6')],
  cerrar: [linea('M6 6l12 12M18 6 6 18')],
  visto: [linea('m5 12.5 4.5 4.5L19 7.5')],
  mas: [linea('M12 5v14M5 12h14')],

  // Barra de navegacion principal
  casa: [linea('M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z')],
  mapa: [linea('M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z'), linea('M9 4v14M15 6v14')],
  portapapeles: [
    rectangulo(5, 4, 14, 17, 2),
    linea('M9 4V3h6v1M9 10h6M9 14h6M9 18h3'),
  ],
  campana: [
    linea('M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z'),
    linea('M10 20.5a2 2 0 0 0 4 0'),
  ],

  // Las ocho categorias de reporte, en el orden del sistema visual
  basura: [linea('M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13')],
  arbol: [
    linea('M12 21v-6'),
    linea('M12 3c-3.5 0-6 2.7-6 6 0 3 2.5 6 6 6s6-3 6-6c0-3.3-2.5-6-6-6z'),
  ],
  plaga: [
    rectangulo(8, 7, 8, 13, 4),
    linea('M12 7V5M4 12h4M16 12h4M5 18l3-2M19 18l-3-2M5 7l3 2M19 7l-3 2'),
  ],
  ruidoLuz: [
    linea('M4 9h4l5-4v14l-5-4H4z'),
    linea('M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12'),
  ],
  calle: [linea('M7 21 10 3M17 21 14 3M12 6v2M12 11v2M12 16v2')],
  mobiliario: [linea('M4 10h16M3 14h18M6 14v5M18 14v5M6 10V7M18 10V7')],
  patrimonio: [linea('M3 9 12 4l9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18')],
  otro: [circulo(6, 12, 1.3), circulo(12, 12, 1.3), circulo(18, 12, 1.3)],

  // Acciones sobre contenido
  idea: [
    linea('M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'),
  ],
  pulgarArriba: [
    linea('M7 11v9H4v-9zM7 11l4-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7'),
  ],
  globoDialogo: [linea('M4 5h16v11H9l-5 4z')],
  enviar: [linea('M4 12 20 4l-6 16-3-7z')],
  compartir: [
    circulo(6, 12, 2.5),
    circulo(18, 6, 2.5),
    circulo(18, 18, 2.5),
    linea('m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6'),
  ],
  lapiz: [linea('M4 20h4L19 9l-4-4L4 16z')],
  descargar: [linea('M12 4v11M7 10l5 5 5-5M5 20h14')],
  bandera: [linea('M5 21V4M5 4h11l-2 4 2 4H5')],
  enlace: [
    linea('M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'),
  ],

  // Mapa y ubicacion
  pin: [
    linea('M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z'),
    circulo(12, 9.5, 2.5),
  ],
  mira: [circulo(12, 12, 4), linea('M12 2v3M12 19v3M2 12h3M19 12h3')],
  capas: [linea('m12 3 9 5-9 5-9-5z'), linea('m3 13 9 5 9-5')],
  lupa: [circulo(11, 11, 6.5), linea('m16 16 4.5 4.5')],
  embudo: [linea('M4 5h16l-6 8v6l-4-2v-4z')],

  // Contenido y multimedia
  imagen: [
    rectangulo(3, 4, 18, 16, 2),
    circulo(9, 10, 2),
    linea('m3 18 6-5 4 3 3-2 5 4'),
  ],
  camara: [linea('M4 8h3l2-3h6l2 3h3v11H4z'), circulo(12, 13, 3.5)],
  documento: [rectangulo(5, 3, 14, 18, 2), linea('M9 8h6M9 12h6M9 16h3')],
  calendario: [
    rectangulo(3.5, 5, 17, 15, 2),
    linea('M3.5 10h17M8 3v4M16 3v4'),
  ],
  grafico: [linea('M4 20V10M10 20V4M16 20v-7M2 20h20')],

  // Personas e instituciones
  persona: [circulo(9, 8, 3.5), linea('M2.5 20a6.5 6.5 0 0 1 13 0')],
  personas: [
    circulo(9, 8, 3.5),
    linea('M2.5 20a6.5 6.5 0 0 1 13 0'),
    linea('M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6'),
  ],
  birrete: [linea('M2 9 12 4l10 5-10 5z'), linea('M6 11v5c3 2.5 9 2.5 12 0v-5')],
  comercio: [linea('M4 9 5.5 4h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6')],
  medalla: [circulo(12, 9, 5.5), linea('M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5')],

  // Estado, ayuda y confianza
  informacion: [circulo(12, 12, 9), linea('M12 11v5M12 7.5v.5')],
  interrogacion: [
    circulo(12, 12, 9),
    linea('M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17v.5'),
  ],
  reloj: [circulo(12, 12, 9), linea('M12 7v5l3 2')],
  escudo: [
    linea('M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z'),
    linea('m9 12 2 2 4-4'),
  ],
  ojo: [
    linea('M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z'),
    circulo(12, 12, 3),
  ],
  candado: [rectangulo(5, 11, 14, 10, 2), linea('M8 11V8a4 4 0 0 1 8 0v3')],
  sobre: [rectangulo(3, 5, 18, 14, 2), linea('m3 7 9 6 9-6')],
  deslizadores: [
    linea('M4 7h10M18 7h2M4 17h4M12 17h8'),
    circulo(16, 7, 2),
    circulo(10, 17, 2),
  ],

  /** Hoja del logotipo de Barrio Republica. */
  hoja: [linea('M5 19c0-8 5-14 15-14 0 10-6 15-14 15'), linea('M5 19 13 11')],
} satisfies Record<string, TrazoIcono[]>;

export type NombreIcono = keyof typeof iconos;
```

### 17.3 Dominio · src/dominio

#### `src/dominio/categorias.ts`

Las ocho categorías de reporte con su color e ícono. (101 líneas)

```ts
import type { NombreIcono } from '@/diseno/iconos';

/**
 * Las ocho categorias de reporte. Toman la taxonomia del catastro 2022 y de la
 * historia de usuario 1, y son las mismas que muestra la lamina del sistema
 * visual. El orden importa: es el que ve la persona en la pantalla "Que pasa".
 */
export const idsDeCategoria = [
  'basura',
  'arboles',
  'plagas',
  'ruido',
  'calles',
  'mobiliario',
  'patrimonio',
  'otro',
] as const;

export type IdCategoria = (typeof idsDeCategoria)[number];

export type Categoria = {
  id: IdCategoria;
  /** Nombre completo, el que se usa al elegir categoria. */
  etiqueta: string;
  /** Version corta para chips y fichas donde no cabe el nombre largo. */
  etiquetaCorta: string;
  /** Version en mayusculas que encabeza las tarjetas de reporte. */
  etiquetaTarjeta: string;
  color: string;
  icono: NombreIcono;
};

export const categorias: Record<IdCategoria, Categoria> = {
  basura: {
    id: 'basura',
    etiqueta: 'Basura o microbasural',
    etiquetaCorta: 'Basura',
    etiquetaTarjeta: 'BASURA',
    color: '#7A4A1F',
    icono: 'basura',
  },
  arboles: {
    id: 'arboles',
    etiqueta: 'Árboles y jardines',
    etiquetaCorta: 'Árboles y jardines',
    etiquetaTarjeta: 'ÁRBOLES',
    color: '#2E6B3F',
    icono: 'arbol',
  },
  plagas: {
    id: 'plagas',
    etiqueta: 'Plagas',
    etiquetaCorta: 'Plagas',
    etiquetaTarjeta: 'PLAGAS',
    color: '#6B4380',
    icono: 'plaga',
  },
  ruido: {
    id: 'ruido',
    etiqueta: 'Ruido o luz molesta',
    etiquetaCorta: 'Ruido o luz',
    etiquetaTarjeta: 'RUIDO O LUZ',
    color: '#2C5A8C',
    icono: 'ruidoLuz',
  },
  calles: {
    id: 'calles',
    etiqueta: 'Calles y veredas',
    etiquetaCorta: 'Calles y veredas',
    etiquetaTarjeta: 'CALLES Y VEREDAS',
    color: '#4A5560',
    icono: 'calle',
  },
  mobiliario: {
    id: 'mobiliario',
    etiqueta: 'Bancas, plazas y mobiliario',
    etiquetaCorta: 'Mobiliario y plazas',
    etiquetaTarjeta: 'MOBILIARIO',
    color: '#B0581A',
    icono: 'mobiliario',
  },
  patrimonio: {
    id: 'patrimonio',
    etiqueta: 'Patrimonio en riesgo',
    etiquetaCorta: 'Patrimonio',
    etiquetaTarjeta: 'PATRIMONIO',
    color: '#9C3A33',
    icono: 'patrimonio',
  },
  otro: {
    id: 'otro',
    etiqueta: 'Otro problema',
    etiquetaCorta: 'Otro',
    etiquetaTarjeta: 'OTRO',
    color: '#56625B',
    icono: 'otro',
  },
};

/** Lista en el orden de la pantalla, util para recorrer con map. */
export const listaDeCategorias: Categoria[] = idsDeCategoria.map((id) => categorias[id]);
```

#### `src/dominio/estados.ts`

Los cuatro estados del reporte y las cinco etapas de una propuesta. (128 líneas)

```ts
import type { NombreIcono } from '@/diseno/iconos';

/**
 * Ciclo de vida de un reporte. El lenguaje es cotidiano a proposito: la regla
 * de accesibilidad del sistema visual pide decir "En gestion" y no "Ticket
 * asignado".
 */
export const idsDeEstado = ['recibido', 'verificado', 'gestion', 'resuelto'] as const;

export type IdEstado = (typeof idsDeEstado)[number];

export type EstadoReporte = {
  id: IdEstado;
  etiqueta: string;
  fondo: string;
  texto: string;
  /** Punto de color que precede al texto. El estado resuelto usa un visto. */
  punto?: string;
  icono?: NombreIcono;
  /** Posicion dentro de la barra de avance de cuatro pasos. */
  paso: number;
};

export const estados: Record<IdEstado, EstadoReporte> = {
  recibido: {
    id: 'recibido',
    etiqueta: 'Recibido',
    fondo: '#E6E8EC',
    texto: '#3F4855',
    punto: '#5A6472',
    paso: 1,
  },
  verificado: {
    id: 'verificado',
    etiqueta: 'Verificado',
    fondo: '#DCE7F3',
    texto: '#244C78',
    punto: '#2C5A8C',
    paso: 2,
  },
  gestion: {
    id: 'gestion',
    etiqueta: 'En gestión',
    fondo: '#F5E6C8',
    texto: '#6F4A0E',
    punto: '#A86E1C',
    paso: 3,
  },
  resuelto: {
    id: 'resuelto',
    etiqueta: 'Resuelto',
    fondo: '#DCEBD8',
    texto: '#174D34',
    icono: 'visto',
    paso: 4,
  },
};

export const totalDePasosDeEstado = idsDeEstado.length;

/**
 * Las cinco etapas por las que pasa una propuesta vecinal. A diferencia del
 * reporte, aqui avanzar depende de la comunidad y no de la organizacion.
 */
export const idsDeEtapa = [
  'idea',
  'conversacion',
  'priorizada',
  'enMarcha',
  'lograda',
] as const;

export type IdEtapa = (typeof idsDeEtapa)[number];

export type EtapaPropuesta = {
  id: IdEtapa;
  etiqueta: string;
  /** Frase que explica que significa estar en esta etapa. */
  explicacion: string;
  fondo: string;
  texto: string;
  numero: number;
};

export const etapas: Record<IdEtapa, EtapaPropuesta> = {
  idea: {
    id: 'idea',
    etiqueta: 'Idea',
    explicacion: 'recién publicada',
    fondo: '#E6E8EC',
    texto: '#3F4855',
    numero: 1,
  },
  conversacion: {
    id: 'conversacion',
    etiqueta: 'En conversación',
    explicacion: 'se mejora con vecinos',
    fondo: '#DCE7F3',
    texto: '#244C78',
    numero: 2,
  },
  priorizada: {
    id: 'priorizada',
    etiqueta: 'Priorizada',
    explicacion: 'apoyos y reportes la suben',
    fondo: '#F5E6C8',
    texto: '#6F4A0E',
    numero: 3,
  },
  enMarcha: {
    id: 'enMarcha',
    etiqueta: 'En marcha',
    explicacion: 'tiene equipo y fecha',
    fondo: '#1D5E40',
    texto: '#FFFFFF',
    numero: 4,
  },
  lograda: {
    id: 'lograda',
    etiqueta: 'Lograda',
    explicacion: 'con evidencia de cierre',
    fondo: '#0F3D2A',
    texto: '#6DBE5C',
    numero: 5,
  },
};

export const listaDeEtapas: EtapaPropuesta[] = idsDeEtapa.map((id) => etapas[id]);
```

#### `src/dominio/tipos.ts`

Todos los tipos del modelo de datos. (283 líneas)

```ts
import type { NombreIcono } from '@/diseno/iconos';
import type { IdCategoria } from './categorias';
import type { IdEstado, IdEtapa } from './estados';

/**
 * Modelo de datos del prototipo.
 *
 * Los nombres y las formas siguen lo que muestran los mockups y las historias
 * de usuario, de modo que al conectar Supabase cada tipo de aqui tenga una
 * tabla equivalente y no haya que redisenar la aplicacion.
 */

/** Como se identifica una persona frente al resto del barrio. */
export type Persona = {
  id: string;
  /** Seudonimo visible. Nunca el nombre real ni el RUT. */
  nombre: string;
  /** Letra del avatar circular. */
  inicial: string;
  /** Vinculo declarado, por ejemplo "Vive en el barrio". */
  vinculo: string;
  /** Las organizaciones llevan un distintivo de verificada. */
  esOrganizacion?: boolean;
};

/**
 * Posicion sobre el mapa, en grados decimales WGS84, que es el sistema en el
 * que vienen las capas del catastro 2022 y el que espera PostGIS.
 */
export type PuntoEnMapa = {
  latitud: number;
  longitud: number;
};

/** Los cuatro bordes de lo que el mapa tiene a la vista, en grados. */
export type RecuadroDelMapa = {
  sur: number;
  oeste: number;
  norte: number;
  este: number;
};

/**
 * Un elemento del catastro 2022 listo para dibujar.
 *
 * La posicion es un punto representativo aunque la figura original sea una
 * linea o un poligono, porque el mapa dibuja chinchetas. El area y el largo
 * vienen calculados sobre la geometria completa, que la base conserva.
 */
export type ElementoEnElMapa = {
  id: string;
  capa: string;
  /** Identificador que el elemento traia en el archivo del diagnostico. */
  fid: number;
  posicion: PuntoEnMapa;
  tipoDeGeometria: string;
  areaM2: number;
  largoM: number;
  direccion?: string;
  estadoDePlatabanda?: string;
  tipoDeMicrobasural?: string;
  quienLoCuida?: string;
};

/** Un paso del recorrido de un reporte, tal como se ve en "En que va". */
export type EventoDeSeguimiento = {
  estado: IdEstado;
  /** Fecha en texto corto, por ejemplo "3 nov". Vacia si aun no ocurre. */
  fecha?: string;
  /** Que paso, o que pasara cuando llegue el turno de este estado. */
  detalle: string;
  /** Un evento futuro se dibuja apagado. */
  ocurrio: boolean;
};

export type Reporte = {
  id: string;
  categoria: IdCategoria;
  /** Precision dentro de la categoria, por ejemplo "microbasural". */
  subtipo?: string;
  titulo: string;
  /** Esquina o referencia, por ejemplo "Sazié con Av. República". */
  direccion: string;
  estado: IdEstado;
  /** Texto libre que escribio quien reporto. */
  descripcion?: string;
  /** Respuestas del paso de detalles, ya resumidas para mostrar. */
  comoSeFormo?: string;
  desdeCuando?: string;
  /** Fecha de publicacion en texto, como la muestran los mockups. */
  publicado: string;
  /** Linea de apoyo bajo el titulo en las listas. */
  resumen: string;
  confirmaciones: number;
  /** Vecinos que lo marcaron como inexistente. Dispara la revision. */
  senalamientos?: number;
  /**
   * Publicado sin mostrar quien. Es una decision por publicacion y no una
   * configuracion del perfil: la misma persona puede publicar un reporte con
   * su nombre y el siguiente sin el.
   */
  anonimo: boolean;
  /**
   * Nulo cuando el reporte es anonimo. En la base el autor siempre existe;
   * lo que llega a la aplicacion ya viene enmascarado por la vista, para que
   * el dato no pueda filtrarse desde el cliente.
   */
  autor: Persona | null;
  esMio: boolean;
  tieneFoto: boolean;
  posicion: PuntoEnMapa;
  seguimiento: EventoDeSeguimiento[];
  /** Identificadores de las propuestas que buscan resolverlo. */
  propuestas: string[];
  comentarios: Comentario[];
};

/** Postura de quien comenta, usada para filtrar la conversacion. */
export type PosturaComentario = 'mejora' | 'duda' | 'aFavor' | 'enContra' | 'respuesta';

export type Comentario = {
  id: string;
  autor: Persona;
  /** Antiguedad en texto corto, por ejemplo "4 d". */
  cuando: string;
  postura: PosturaComentario;
  texto: string;
  utiles: number;
  /** Nota de la autora de la propuesta cuando incorpora el aporte. */
  incorporado?: string;
  respuestas: Comentario[];
};

/** Un tipo de ayuda que pide una propuesta para poder concretarse. */
export type ApoyoNecesario = {
  id: string;
  titulo: string;
  detalle: string;
  /** Cuando la ayuda se cuenta en personas, por ejemplo 9 de 15 voluntarios. */
  conseguido?: number;
  necesario?: number;
};

/** Institucion o local que se ofrecio a apoyar una propuesta. */
export type ApoyoInstitucional = {
  id: string;
  nombre: string;
  detalle: string;
  icono: 'birrete' | 'comercio';
};

export type Propuesta = {
  id: string;
  titulo: string;
  /** Eje tematico, por ejemplo "Residuos". */
  eje: string;
  etapa: IdEtapa;
  autor: Persona;
  publicada: string;
  idea: string;
  /** Mejora que surgio en la conversacion y la autora acepto. */
  mejoraIncorporada?: string;
  apoyos: number;
  /** Reportes que esta propuesta busca resolver. */
  reportesQueResuelve: number;
  /** Frase que resume a que reportes responde. */
  respondeA?: string;
  necesita: ApoyoNecesario[];
  quierenApoyar: ApoyoInstitucional[];
  comentarios: Comentario[];
  posicion: PuntoEnMapa;
  /** Disciplinas con las que calza, para el filtro de instituciones. */
  disciplinas: string[];
  apoyadaPorMi: boolean;
};

/** Forma de participar en una actividad. */
export type ModoDeParticipar = 'asistir' | 'voluntario';

export type Actividad = {
  id: string;
  titulo: string;
  /** Dia de la semana abreviado, como lo muestra el calendario del mockup. */
  diaSemana: string;
  dia: number;
  mes: string;
  hora: string;
  /** Rango completo, por ejemplo "10:00 a 13:00". */
  horario: string;
  lugar: string;
  organiza: Persona;
  descripcion: string;
  queLlevar: string;
  inscritos: number;
  voluntarios: number;
  voluntariosNecesarios: number;
  /** Tareas concretas que puede tomar quien se ofrece de voluntario. */
  tareas: string[];
  /** Propuesta que dio origen a la actividad. */
  naceDePropuesta?: string;
  posicion: PuntoEnMapa;
  /** Como se inscribio la persona, si es que lo hizo. */
  miInscripcion: ModoDeParticipar | null;
  /** Tarea tomada al inscribirse como voluntario. */
  miTarea?: string;
};

/** Agrupacion temporal de los avisos, tal como los ordena la pantalla. */
export type MomentoAviso = 'hoy' | 'semana';

export type Aviso = {
  id: string;
  momento: MomentoAviso;
  /** Parte en negrita del texto. */
  destacado: string;
  /** Resto de la frase. */
  texto: string;
  cuando: string;
  icono: 'visto' | 'birrete' | 'calendario' | 'globoDialogo' | 'medalla';
  color: string;
  fondo: string;
  leido: boolean;
  /** Etiqueta opcional al pie, por ejemplo "Recordatorio". */
  pie?: string;
  /** Enlace al contenido que origino el aviso. */
  destino?: string;
};

export type Logro = {
  id: string;
  nombre: string;
  icono: NombreIcono;
  /** Color de la insignia cuando ya se consiguio. */
  color: string;
  conseguido: boolean;
  /** Avance de los logros que todavia no estan completos. */
  avance?: string;
};

/** Capa que se puede encender o apagar en el mapa. */
export type CapaDelMapa = {
  id: string;
  nombre: string;
  detalle: string;
  /**
   * Con que se cuentan los elementos de esta capa: puntos, franjas, tramos.
   * Solo las capas del catastro la tienen, y es lo que permite rehacer el
   * detalle con el conteo real cuando hay sesion.
   */
  unidad?: string;
  grupo: 'ahora' | 'catastro';
  activa: boolean;
};

/** Ficha de un elemento del catastro socioambiental de 2022. */
export type ElementoDeCatastro = {
  id: string;
  tipo: string;
  fuente: string;
  direccion: string;
  estadoAnotado: string;
  quienLoCuida: string;
  ultimaRevision: string;
  /** Opciones con las que un vecino actualiza el estado de hoy. */
  opcionesDeEstado: string[];
  /** Dato del diagnostico que da contexto a la ficha. */
  dato: string;
  posicion: PuntoEnMapa;
};

/** Propuesta o problema publicado como desafio para una institucion. */
export type Desafio = {
  id: string;
  prioridad: 'alta' | 'media' | 'baja';
  eje: string;
  titulo: string;
  resumen: string;
  busca: string;
  disciplinas: string[];
  tiposDeApoyo: string[];
  /** Propuesta de origen, cuando el desafio nace de una. */
  propuesta?: string;
};
```

### 17.4 Datos de ejemplo · src/datos

#### `src/datos/personas.ts`

Las siete personas y organizaciones del prototipo. (24 líneas)

```ts
import type { Persona } from '@/dominio/tipos';

/**
 * Vecinas, vecinos y organizaciones que aparecen en el prototipo. Son los
 * mismos de los mockups, de modo que las pantallas cuentan una sola historia
 * coherente de punta a punta.
 */
export const personas = {
  rosa: { id: 'rosa', nombre: 'Rosa', inicial: 'R', vinculo: 'Vive en el barrio' },
  julia: { id: 'julia', nombre: 'Julia R.', inicial: 'J', vinculo: 'Vive en el barrio' },
  tomas: { id: 'tomas', nombre: 'Tomás', inicial: 'T', vinculo: 'Estudia en el barrio' },
  hernan: { id: 'hernan', nombre: 'Don Hernán', inicial: 'H', vinculo: 'Vive en el barrio' },
  camila: { id: 'camila', nombre: 'Camila', inicial: 'C', vinculo: 'Gestora territorial' },
  marta: { id: 'marta', nombre: 'Marta', inicial: 'M', vinculo: 'Tiene un local' },
  republicaCircular: {
    id: 'republicaCircular',
    nombre: 'República Circular',
    inicial: 'RC',
    vinculo: 'Gestión territorial · organización verificada',
    esOrganizacion: true,
  },
} satisfies Record<string, Persona>;

/** La persona que usa la aplicacion durante la demostracion. */
```

#### `src/datos/reportes.ts`

Los nueve reportes, con su seguimiento y sus comentarios. (302 líneas)

```ts
import { personas } from './personas';
import type { Reporte } from '@/dominio/tipos';

/**
 * Reportes de ejemplo. El contenido, las fechas y los contadores son los de los
 * mockups: las pantallas de inicio, mapa, mis reportes, detalle, panel de
 * gestion y moderacion cuentan todas la misma historia.
 *
 * Las posiciones son el centro de cada marcador sobre el plano del barrio, en
 * las coordenadas del mapa de 390 x 844 del diseno.
 */
export const reportesIniciales: Reporte[] = [
  {
    id: 'microbasural-sazie',
    categoria: 'basura',
    subtipo: 'microbasural',
    titulo: 'Microbasural en Sazié con Av. República',
    direccion: 'Sazié con Av. República',
    estado: 'verificado',
    descripcion: 'Bolsas y escombros en la esquina, se acumula los fines de semana.',
    comoSeFormo: 'Dejaron basura',
    desdeCuando: 'Esta semana',
    publicado: '3 nov 2026, 10:24',
    resumen: 'Enviado el 3 nov · 1 propuesta asociada',
    confirmaciones: 12,
    anonimo: false,
    autor: personas.rosa,
    esMio: true,
    tieneFoto: true,
    posicion: { latitud: -33.449046, longitud: -70.663187 },
    seguimiento: [
      { estado: 'recibido', fecha: '3 nov', detalle: 'Quedó publicado en el mapa', ocurrio: true },
      {
        estado: 'verificado',
        fecha: '4 nov',
        detalle: '12 vecinos confirmaron que existe',
        ocurrio: true,
      },
      {
        estado: 'gestion',
        detalle: 'Cuando alguien tome acción, aquí verás quién y qué hizo',
        ocurrio: false,
      },
      { estado: 'resuelto', detalle: 'Con foto del antes y después', ocurrio: false },
    ],
    propuestas: ['punto-limpio'],
    comentarios: [
      {
        id: 'c-hernan-1',
        autor: personas.hernan,
        cuando: '2 d',
        postura: 'duda',
        texto: 'Los sábados en la noche es peor, después de los eventos.',
        utiles: 4,
        respuestas: [],
      },
      {
        id: 'c-camila-1',
        autor: personas.camila,
        cuando: '1 d',
        postura: 'respuesta',
        texto: 'Lo estamos coordinando con el retiro municipal de las 20:00.',
        utiles: 2,
        respuestas: [],
      },
      {
        id: 'c-marta-1',
        autor: personas.marta,
        cuando: '20 h',
        postura: 'aFavor',
        texto: 'Si ponen el punto limpio ahí, yo ayudo a barrer la vereda.',
        utiles: 6,
        respuestas: [],
      },
    ],
  },
  {
    id: 'rama-toesca',
    categoria: 'arboles',
    titulo: 'Rama caída en Toesca con Av. Ejército',
    direccion: 'Toesca con Av. Ejército',
    estado: 'gestion',
    descripcion: 'Se cayó con el viento del domingo y ocupa media vereda.',
    comoSeFormo: 'Viento',
    desdeCuando: 'Hace más de una semana',
    publicado: '28 oct 2026, 18:40',
    resumen: 'Enviado el 28 oct · actualizado hace 2 h',
    confirmaciones: 5,
    anonimo: false,
    autor: personas.rosa,
    esMio: true,
    tieneFoto: true,
    posicion: { latitud: -33.454618, longitud: -70.659668 },
    seguimiento: [
      { estado: 'recibido', fecha: '28 oct', detalle: 'Quedó publicado en el mapa', ocurrio: true },
      { estado: 'verificado', fecha: '29 oct', detalle: '5 vecinos lo confirmaron', ocurrio: true },
      {
        estado: 'gestion',
        fecha: 'hace 2 h',
        detalle: 'República Circular coordinó el retiro con la Municipalidad',
        ocurrio: true,
      },
      { estado: 'resuelto', detalle: 'Con foto del antes y después', ocurrio: false },
    ],
    propuestas: [],
    comentarios: [],
  },
  {
    id: 'vereda-domeyko',
    categoria: 'calles',
    titulo: 'Vereda levantada en Domeyko',
    direccion: 'Domeyko con Av. España',
    estado: 'recibido',
    descripcion: 'La raíz levantó tres pastelones y se tropieza harta gente.',
    publicado: 'ayer, 09:10',
    resumen: 'Enviado ayer',
    confirmaciones: 0,
    anonimo: false,
    autor: personas.rosa,
    esMio: true,
    tieneFoto: false,
    posicion: { latitud: -33.452761, longitud: -70.668427 },
    seguimiento: [
      { estado: 'recibido', fecha: 'ayer', detalle: 'Quedó publicado en el mapa', ocurrio: true },
      {
        estado: 'verificado',
        detalle: 'Cuando otros vecinos confirmen que existe',
        ocurrio: false,
      },
      {
        estado: 'gestion',
        detalle: 'Cuando alguien tome acción, aquí verás quién y qué hizo',
        ocurrio: false,
      },
      { estado: 'resuelto', detalle: 'Con foto del antes y después', ocurrio: false },
    ],
    propuestas: [],
    comentarios: [],
  },
  {
    id: 'microbasural-vergara',
    categoria: 'basura',
    subtipo: 'microbasural',
    titulo: 'Microbasural en Toesca con Vergara',
    direccion: 'Toesca con Vergara',
    estado: 'resuelto',
    descripcion:
      'República Circular coordinó el retiro con la Municipalidad y 14 vecinos hicieron una jornada de limpieza el sábado.',
    publicado: '3 nov 2026',
    resumen: '12 nov · 9 días después de tu reporte',
    confirmaciones: 9,
    anonimo: false,
    autor: personas.rosa,
    esMio: true,
    tieneFoto: true,
    posicion: { latitud: -33.455153, longitud: -70.665221 },
    seguimiento: [
      { estado: 'recibido', fecha: '3 nov', detalle: 'Quedó publicado en el mapa', ocurrio: true },
      { estado: 'verificado', fecha: '5 nov', detalle: '9 vecinos lo confirmaron', ocurrio: true },
      {
        estado: 'gestion',
        fecha: '8 nov',
        detalle: 'República Circular coordinó el retiro con la Municipalidad',
        ocurrio: true,
      },
      {
        estado: 'resuelto',
        fecha: '12 nov',
        detalle: 'Jornada de limpieza con 14 vecinos',
        ocurrio: true,
      },
    ],
    propuestas: [],
    comentarios: [],
  },
  {
    id: 'contenedor-grajales',
    categoria: 'basura',
    titulo: 'Contenedor rebalsado en Grajales',
    direccion: 'Grajales con Av. República',
    estado: 'verificado',
    publicado: 'hace 1 día',
    resumen: 'Hace 1 día · 8 vecinos lo confirman',
    confirmaciones: 8,
    anonimo: false,
    autor: personas.hernan,
    esMio: false,
    tieneFoto: true,
    posicion: { latitud: -33.450566, longitud: -70.666394 },
    seguimiento: [
      { estado: 'recibido', fecha: 'hace 1 día', detalle: 'Quedó publicado en el mapa', ocurrio: true },
      { estado: 'verificado', fecha: 'hoy', detalle: '8 vecinos lo confirmaron', ocurrio: true },
      {
        estado: 'gestion',
        detalle: 'Cuando alguien tome acción, aquí verás quién y qué hizo',
        ocurrio: false,
      },
      { estado: 'resuelto', detalle: 'Con foto del antes y después', ocurrio: false },
    ],
    propuestas: [],
    comentarios: [],
  },
  {
    id: 'basura-grajales-vergara',
    categoria: 'basura',
    titulo: 'Basura en Grajales con Vergara',
    direccion: 'Grajales con Vergara',
    estado: 'recibido',
    descripcion: 'Siempre dejan bolsas aquí.',
    publicado: 'hace 3 días',
    resumen: 'Señalado por 3 vecinos',
    confirmaciones: 0,
    senalamientos: 3,
    anonimo: true,
    autor: null,
    esMio: false,
    tieneFoto: false,
    posicion: { latitud: -33.450875, longitud: -70.667332 },
    seguimiento: [
      { estado: 'recibido', fecha: 'hace 3 días', detalle: 'Quedó publicado en el mapa', ocurrio: true },
      { estado: 'verificado', detalle: 'En revisión por moderación', ocurrio: false },
      { estado: 'gestion', detalle: 'Cuando alguien tome acción', ocurrio: false },
      { estado: 'resuelto', detalle: 'Con foto del antes y después', ocurrio: false },
    ],
    propuestas: [],
    comentarios: [],
  },
  {
    id: 'rampa-republica',
    categoria: 'calles',
    titulo: 'Rampa rota en Av. República',
    direccion: 'Av. República con Sazié',
    estado: 'verificado',
    publicado: 'hace 41 días',
    resumen: 'Verificado · hace 41 días sin avance',
    confirmaciones: 6,
    anonimo: false,
    autor: personas.tomas,
    esMio: false,
    tieneFoto: false,
    posicion: { latitud: -33.449665, longitud: -70.662796 },
    seguimiento: [
      { estado: 'recibido', fecha: 'hace 41 días', detalle: 'Quedó publicado en el mapa', ocurrio: true },
      { estado: 'verificado', fecha: 'hace 39 días', detalle: '6 vecinos lo confirmaron', ocurrio: true },
      { estado: 'gestion', detalle: 'Sin avance hace más de un mes', ocurrio: false },
      { estado: 'resuelto', detalle: 'Con foto del antes y después', ocurrio: false },
    ],
    propuestas: [],
    comentarios: [],
  },
  {
    id: 'foco-domeyko',
    categoria: 'ruido',
    titulo: 'Foco que encandila en Domeyko',
    direccion: 'Domeyko con Av. Ejército',
    estado: 'recibido',
    publicado: 'hace 2 días',
    resumen: 'Recibido · hace 2 días',
    confirmaciones: 1,
    anonimo: false,
    autor: personas.marta,
    esMio: false,
    tieneFoto: false,
    posicion: { latitud: -33.452761, longitud: -70.659355 },
    seguimiento: [
      { estado: 'recibido', fecha: 'hace 2 días', detalle: 'Quedó publicado en el mapa', ocurrio: true },
      { estado: 'verificado', detalle: 'Cuando otros vecinos confirmen que existe', ocurrio: false },
      { estado: 'gestion', detalle: 'Cuando alguien tome acción', ocurrio: false },
      { estado: 'resuelto', detalle: 'Con foto del antes y después', ocurrio: false },
    ],
    propuestas: [],
    comentarios: [],
  },
  {
    id: 'arbol-toesca',
    categoria: 'arboles',
    titulo: 'Árbol seco en Toesca',
    direccion: 'Toesca con Av. República',
    estado: 'gestion',
    publicado: 'hace 20 días',
    resumen: 'En gestión · con la Municipalidad',
    confirmaciones: 7,
    anonimo: false,
    autor: personas.camila,
    esMio: false,
    tieneFoto: false,
    posicion: { latitud: -33.454534, longitud: -70.663422 },
    seguimiento: [
      { estado: 'recibido', fecha: 'hace 20 días', detalle: 'Quedó publicado en el mapa', ocurrio: true },
      { estado: 'verificado', fecha: 'hace 18 días', detalle: '7 vecinos lo confirmaron', ocurrio: true },
      {
        estado: 'gestion',
        fecha: 'hace 6 días',
        detalle: 'Solicitud enviada a la Municipalidad',
        ocurrio: true,
      },
      { estado: 'resuelto', detalle: 'Con foto del antes y después', ocurrio: false },
    ],
    propuestas: [],
    comentarios: [],
  },
];
```

#### `src/datos/propuestas.ts`

Las tres propuestas y los catálogos de ejes, apoyos y disciplinas. (197 líneas)

```ts
import { personas } from './personas';
import type { Propuesta } from '@/dominio/tipos';

/**
 * Propuestas vecinales del prototipo. Las tres aparecen en la pantalla
 * "Propuestas del barrio" y la primera tiene el detalle y la conversacion
 * completos, que es el recorrido que se muestra en la demostracion.
 */
export const propuestasIniciales: Propuesta[] = [
  {
    id: 'punto-limpio',
    titulo: 'Punto limpio vecinal en Sazié con Av. República',
    eje: 'Residuos',
    etapa: 'priorizada',
    autor: personas.julia,
    publicada: 'publicada hace 6 días',
    idea: 'Contenedores separados para cartón, vidrio y basura, con un horario para sacar las bolsas y un letrero hecho por los vecinos.',
    mejoraIncorporada: 'se sumó un turno de cuidado los sábados, idea de Tomás.',
    apoyos: 64,
    reportesQueResuelve: 6,
    respondeA: '6 reportes de basura en esta esquina',
    necesita: [
      {
        id: 'voluntarios',
        titulo: 'Manos voluntarias',
        detalle: 'Para armarlo y cuidarlo',
        conseguido: 9,
        necesario: 15,
      },
      {
        id: 'tecnico',
        titulo: 'Conocimiento técnico',
        detalle: 'Estudiantes de FCFM se ofrecieron',
      },
      {
        id: 'permiso',
        titulo: 'Permiso municipal',
        detalle: 'En trámite por República Circular',
      },
    ],
    quierenApoyar: [
      {
        id: 'fcfm',
        nombre: 'FCFM, Universidad de Chile',
        detalle: 'Curso de ingeniería · otoño 2027',
        icono: 'birrete',
      },
      {
        id: 'almacen',
        nombre: 'Almacén de la esquina',
        detalle: 'Local asociado · presta su vereda',
        icono: 'comercio',
      },
    ],
    comentarios: [
      {
        id: 'p1-tomas',
        autor: personas.tomas,
        cuando: '4 d',
        postura: 'mejora',
        texto: '¿Y si alguien lo cuida los sábados en la noche, que es cuando más se llena?',
        utiles: 14,
        incorporado: 'La autora la sumó a la propuesta',
        respuestas: [
          {
            id: 'p1-tomas-julia',
            autor: personas.julia,
            cuando: '3 d',
            postura: 'respuesta',
            texto: '¡Buenísima! Ya la agregué. ¿Te animas a armar el turno?',
            utiles: 3,
            respuestas: [],
          },
        ],
      },
      {
        id: 'p1-hernan',
        autor: personas.hernan,
        cuando: '3 d',
        postura: 'duda',
        texto: '¿Y quién vacía los contenedores?',
        utiles: 5,
        respuestas: [
          {
            id: 'p1-hernan-camila',
            autor: personas.camila,
            cuando: '3 d',
            postura: 'respuesta',
            texto: 'El retiro municipal pasa todos los días después de las 20:00. Lo coordinaríamos con ellos.',
            utiles: 8,
            respuestas: [],
          },
        ],
      },
      {
        id: 'p1-marta',
        autor: personas.marta,
        cuando: '2 d',
        postura: 'enContra',
        texto: 'Justo ahí está la entrada de mi local. ¿Se podría correr media cuadra?',
        utiles: 6,
        respuestas: [],
      },
    ],
    posicion: { latitud: -33.449609, longitud: -70.661076 },
    disciplinas: ['Ingeniería', 'Diseño'],
    apoyadaPorMi: false,
  },
  {
    id: 'huerta-toesca',
    titulo: 'Huerta comunitaria en la platabanda de Toesca',
    eje: 'Áreas verdes',
    etapa: 'enMarcha',
    autor: personas.camila,
    publicada: 'publicada hace 3 semanas',
    idea: 'Recuperar la platabanda abandonada de Toesca con hierbas y plantas que aguanten el sol, y dejar un turno de riego entre los vecinos de la cuadra.',
    apoyos: 51,
    reportesQueResuelve: 2,
    respondeA: '2 reportes de platabandas abandonadas',
    necesita: [
      {
        id: 'voluntarios-huerta',
        titulo: 'Manos voluntarias',
        detalle: 'Jornada del sábado 14 de noviembre',
        conseguido: 9,
        necesario: 15,
      },
      {
        id: 'herramientas',
        titulo: 'Materiales o herramientas',
        detalle: 'Tierra, plantas y una manguera larga',
      },
    ],
    quierenApoyar: [
      {
        id: 'fablab',
        nombre: 'FabLab U. de Chile',
        detalle: 'Puede armar los cajones · verano 2027',
        icono: 'birrete',
      },
    ],
    comentarios: [],
    posicion: { latitud: -33.454618, longitud: -70.659668 },
    disciplinas: ['Agronomía', 'Diseño'],
    apoyadaPorMi: true,
  },
  {
    id: 'placas-casonas',
    titulo: 'Placas con la historia de las casonas de Av. República',
    eje: 'Patrimonio',
    etapa: 'conversacion',
    autor: personas.hernan,
    publicada: 'publicada hace 9 días',
    idea: 'Poner una placa chica en cada casona con su año, quién vivió ahí y una foto antigua, con un código para leer más en el teléfono.',
    apoyos: 38,
    reportesQueResuelve: 1,
    respondeA: '1 reporte de patrimonio en riesgo',
    necesita: [
      {
        id: 'diseno-placas',
        titulo: 'Conocimiento técnico',
        detalle: 'Diseño de las placas y del código',
      },
      {
        id: 'investigacion',
        titulo: 'Conocimiento técnico',
        detalle: 'Investigación histórica de cada casona',
      },
    ],
    quierenApoyar: [],
    comentarios: [],
    posicion: { latitud: -33.451776, longitud: -70.661076 },
    disciplinas: ['Diseño', 'Arquitectura', 'Ciencias sociales'],
    apoyadaPorMi: false,
  },
];

/** Los ejes tematicos que filtran la lista de propuestas. */
export const ejesDePropuesta = ['Todas', 'Residuos', 'Áreas verdes', 'Patrimonio'] as const;

/** Tipos de apoyo que puede pedir una propuesta nueva. */
export const tiposDeApoyo = [
  { id: 'voluntarios', titulo: 'Manos voluntarias', detalle: 'Para armarlo y cuidarlo', conCantidad: true },
  { id: 'materiales', titulo: 'Materiales o herramientas', detalle: 'Contenedores, pintura, palas', conCantidad: false },
  { id: 'tecnico', titulo: 'Conocimiento técnico', detalle: 'Estudiantes o profesionales', conCantidad: false },
  { id: 'permiso', titulo: 'Permiso o gestión municipal', detalle: 'República Circular puede ayudar', conCantidad: false },
] as const;

/** Disciplinas con las que una propuesta puede pedir ayuda. */
export const disciplinas = [
  'Ingeniería',
  'Diseño',
  'Arquitectura',
  'Agronomía',
  'Ciencias sociales',
  'Comunicación',
] as const;
```

#### `src/datos/actividades.ts`

Las tres actividades y sus catálogos. (84 líneas)

```ts
import { personas } from './personas';
import type { Actividad } from '@/dominio/tipos';

/**
 * Actividades del barrio. La primera es la que se usa en la demostracion de
 * inscripcion y nace de la propuesta de la huerta, igual que en los mockups.
 */
export const actividadesIniciales: Actividad[] = [
  {
    id: 'platabanda-toesca',
    titulo: 'Recuperemos la platabanda de Toesca',
    diaSemana: 'SÁB',
    dia: 14,
    mes: 'NOV',
    hora: '10:00',
    horario: '10:00 a 13:00',
    lugar: 'Toesca con Av. Ejército',
    organiza: personas.republicaCircular,
    descripcion:
      'Vamos a sacar escombros, preparar la tierra y plantar las primeras hierbas. No necesitas saber de jardinería.',
    queLlevar:
      'Guantes, agua y ropa que se pueda ensuciar. Las palas las pone República Circular.',
    inscritos: 18,
    voluntarios: 9,
    voluntariosNecesarios: 15,
    tareas: ['Llevar herramientas', 'Regar la primera semana', 'Difundir'],
    naceDePropuesta: 'huerta-toesca',
    posicion: { latitud: -33.454253, longitud: -70.657948 },
    miInscripcion: null,
  },
  {
    id: 'taller-compostaje',
    titulo: 'Taller de compostaje en casa',
    diaSemana: 'MIÉ',
    dia: 18,
    mes: 'NOV',
    hora: '18:30',
    horario: '18:30 a 20:00',
    lugar: 'Sede junta de vecinos · 12 cupos libres',
    organiza: personas.republicaCircular,
    descripcion:
      'Cómo armar una compostera chica en un departamento y qué hacer con lo que sale. Se lleva material para empezar.',
    queLlevar: 'Un balde con tapa, si tienes. Si no, igual hay para repartir.',
    inscritos: 8,
    voluntarios: 0,
    voluntariosNecesarios: 0,
    tareas: [],
    posicion: { latitud: -33.452057, longitud: -70.665221 },
    miInscripcion: null,
  },
  {
    id: 'recorrido-casonas',
    titulo: 'Recorrido por las casonas de Av. República',
    diaSemana: 'SÁB',
    dia: 21,
    mes: 'NOV',
    hora: '11:00',
    horario: '11:00 a 13:00',
    lugar: 'Comité de Patrimonio y Cultura',
    organiza: personas.hernan,
    descripcion:
      'Caminata por seis casonas del eje República contando quién vivió ahí y por qué siguen en pie.',
    queLlevar: 'Agua y sombrero. Son dos horas de caminata tranquila.',
    inscritos: 23,
    voluntarios: 2,
    voluntariosNecesarios: 4,
    tareas: ['Tomar fotos', 'Guiar un tramo'],
    naceDePropuesta: 'placas-casonas',
    posicion: { latitud: -33.451776, longitud: -70.661076 },
    miInscripcion: null,
  },
];

/** Filtros del carril superior de la pantalla de actividades. */
export const filtrosDeActividad = ['Todas', 'Buscan voluntarios', 'Me inscribí'] as const;

/** Tipos de actividad que puede crear un gestor territorial. */
export const tiposDeActividad = [
  'Jornada de trabajo',
  'Taller',
  'Recorrido',
  'Reunión',
  'Fiesta de barrio',
] as const;
```

#### `src/datos/avisos.ts`

Los cinco avisos de la bandeja. (71 líneas)

```ts
import { colores } from '@/diseno/colores';
import type { Aviso } from '@/dominio/tipos';

/**
 * Avisos de la bandeja. El primero es el que tambien aparece como tarjeta
 * oscura en el inicio: un reporte propio que avanzo de estado, que es
 * justamente el retorno visible que pide la historia de usuario 5.
 */
export const avisosIniciales: Aviso[] = [
  {
    id: 'aviso-avance',
    momento: 'hoy',
    destacado: 'Tu reporte avanzó.',
    texto: 'Rama caída en Toesca ahora está en gestión.',
    cuando: 'Hace 2 h',
    icono: 'visto',
    color: '#174D34',
    fondo: colores.menta,
    leido: false,
    destino: '/reportes/rama-toesca',
  },
  {
    id: 'aviso-fcfm',
    momento: 'hoy',
    destacado: 'Estudiantes de FCFM',
    texto: 'quieren apoyar la propuesta que apoyaste: Punto limpio vecinal.',
    cuando: 'Hace 5 h',
    icono: 'birrete',
    color: '#244C78',
    fondo: '#DCE7F3',
    leido: false,
    pie: 'Ver quiénes son',
    destino: '/propuestas/punto-limpio',
  },
  {
    id: 'aviso-jornada',
    momento: 'hoy',
    destacado: 'Este sábado 10:00',
    texto: 'es la recuperación de la platabanda. Te toca llevar herramientas.',
    cuando: 'Recordatorio',
    icono: 'calendario',
    color: '#6F4A0E',
    fondo: '#F5E6C8',
    leido: false,
    destino: '/actividades/platabanda-toesca',
  },
  {
    id: 'aviso-respuesta',
    momento: 'semana',
    destacado: 'Tomás respondió tu comentario en',
    texto: 'Punto limpio vecinal',
    cuando: 'Martes',
    icono: 'globoDialogo',
    color: colores.grisTexto,
    fondo: colores.crema,
    leido: true,
    destino: '/propuestas/punto-limpio/conversacion',
  },
  {
    id: 'aviso-logro',
    momento: 'semana',
    destacado: 'Nuevo logro: Ojo atento',
    texto: '. Confirmaste 10 reportes de otros vecinos.',
    cuando: 'Lunes',
    icono: 'medalla',
    color: '#6F4A0E',
    fondo: '#F5E6C8',
    leido: true,
    destino: '/perfil',
  },
];
```

#### `src/datos/catastro.ts`

Las doce capas del mapa y la ficha de platabanda. (44 líneas)

```ts
import type { CapaDelMapa, ElementoDeCatastro } from '@/dominio/tipos';

/**
 * Capas del mapa y fichas del catastro socioambiental de 2022.
 *
 * Las cifras escritas aqui son las que declara el diagnostico de Republica
 * Circular: 40 microbasurales, 500 platabandas, 218 basureros, 5 puntos de
 * reciclaje, 8 areas verdes y 2 eriazos, 93 bancas, 35 paraderos y 3 tramos de
 * ciclovia. Sirven para que el prototipo sin backend muestre algo razonable.
 *
 * Con sesion abierta se reemplazan por lo que hay cargado, que no es lo mismo:
 * en microbasurales el diagnostico anota 40 y hay 39, porque uno queda a dos
 * kilometros del barrio y la carga lo rechaza. De ahi la unidad de cada capa,
 * que es lo que permite rehacer la frase con el numero de verdad.
 */
export const capasIniciales: CapaDelMapa[] = [
  { id: 'reportes-abiertos', nombre: 'Reportes abiertos', detalle: '', grupo: 'ahora', activa: true },
  { id: 'resueltos', nombre: 'Resueltos', detalle: 'Últimos 30 días', grupo: 'ahora', activa: true },
  { id: 'propuestas', nombre: 'Propuestas', detalle: '', grupo: 'ahora', activa: true },
  { id: 'actividades', nombre: 'Actividades', detalle: '', grupo: 'ahora', activa: true },
  { id: 'microbasurales', nombre: 'Microbasurales', detalle: '40 puntos', unidad: 'puntos', grupo: 'catastro', activa: true },
  { id: 'platabandas', nombre: 'Platabandas', detalle: '500 franjas', unidad: 'franjas', grupo: 'catastro', activa: false },
  { id: 'basureros', nombre: 'Basureros', detalle: '218 en la calle', unidad: 'en la calle', grupo: 'catastro', activa: false },
  { id: 'reciclaje', nombre: 'Puntos de reciclaje', detalle: '5 lugares', unidad: 'lugares', grupo: 'catastro', activa: true },
  { id: 'areas-verdes', nombre: 'Áreas verdes', detalle: '8 plazas y 2 eriazos', unidad: 'plazas y eriazos', grupo: 'catastro', activa: true },
  { id: 'bancas', nombre: 'Bancas', detalle: '93 bancas', unidad: 'bancas', grupo: 'catastro', activa: false },
  { id: 'paraderos', nombre: 'Paraderos', detalle: '35 paraderos', unidad: 'paraderos', grupo: 'catastro', activa: false },
  { id: 'ciclovias', nombre: 'Ciclovías', detalle: '3 tramos', unidad: 'tramos', grupo: 'catastro', activa: false },
];

export const fichasDeCatastro: ElementoDeCatastro[] = [
  {
    id: 'platabanda-grajales',
    tipo: 'Platabanda',
    fuente: 'Catastro 2022',
    direccion: 'Grajales, entre Av. República y Av. Ejército',
    estadoAnotado: 'Abandonada',
    quienLoCuida: 'Nadie',
    ultimaRevision: 'Feb 2023',
    opcionesDeEstado: ['Con jardín', 'Abandonada', 'Pavimentada', 'No sé'],
    dato: 'Solo 13 de 500 platabandas tienen quien las cuide',
    posicion: { latitud: -33.451776, longitud: -70.661076 },
  },
];
```

#### `src/datos/perfil.ts`

Logros, vínculos con el barrio e intereses del mapa. (74 líneas)

```ts
import type { Logro } from '@/dominio/tipos';

/**
 * Perfil y logros. La regla que decidio el equipo es explicita: los logros
 * muestran lo que alguien aporta y nunca dan mas peso a sus reportes ni a sus
 * apoyos, para no reintroducir jerarquias entre vecinos.
 */
export const resumenDelPerfil = {
  desde: 'En el barrio desde octubre 2026',
  vinculos: ['Vive en el barrio', 'Trabaja en el barrio'],
  reportes: 4,
  confirmaciones: 11,
  propuestasApoyadas: 6,
};

export const logros: Logro[] = [
  { id: 'primer-reporte', nombre: 'Primer reporte', icono: 'pin', color: '#A86E1C', conseguido: true },
  { id: 'ojo-atento', nombre: 'Ojo atento', icono: 'ojo', color: '#2C5A8C', conseguido: true },
  {
    id: 'problema-resuelto',
    nombre: 'Problema resuelto',
    icono: 'visto',
    color: '#1D5E40',
    conseguido: true,
  },
  {
    id: 'guardiana-platabandas',
    nombre: 'Guardiana de platabandas',
    icono: 'arbol',
    color: '#2E6B3F',
    conseguido: false,
    avance: '3 de 10',
  },
  {
    id: 'manos-obra',
    nombre: 'Manos a la obra',
    icono: 'personas',
    color: '#7A4A1F',
    conseguido: false,
    avance: '0 de 3',
  },
  {
    id: 'idea-que-suma',
    nombre: 'Idea que suma',
    icono: 'idea',
    color: '#6B4380',
    conseguido: false,
    avance: '0 de 20 apoyos',
  },
];

/** Cuantos logros existen en total en el sistema. */
export const totalDeLogros = 9;

/** Opciones de vinculo con el barrio del registro inicial. */
export const vinculosConElBarrio = [
  { id: 'vivo', titulo: 'Vivo aquí', detalle: 'Residente del barrio' },
  { id: 'estudio', titulo: 'Estudio aquí', detalle: 'Universidad, instituto o colegio' },
  { id: 'trabajo', titulo: 'Trabajo aquí', detalle: 'Oficina, comercio o casa particular' },
  { id: 'local', titulo: 'Tengo un local o emprendimiento', detalle: 'Almacén, feria, taller, venta desde casa' },
  { id: 'institucion', titulo: 'Represento una institución', detalle: 'Universidad, organización o junta de vecinos' },
  { id: 'paso', titulo: 'Paso seguido por aquí', detalle: 'Lo cruzo camino a otro lugar' },
] as const;

/** Intereses que deciden que capas vienen encendidas al entrar al mapa. */
export const interesesDelMapa = [
  { id: 'reportes', sigla: 'REP', titulo: 'Problemas que reportan los vecinos', detalle: 'Abiertos y resueltos hace poco' },
  { id: 'propuestas', sigla: 'ACT', titulo: 'Propuestas y actividades', detalle: 'Lo que se está organizando' },
  { id: 'residuos', sigla: 'RES', titulo: 'Basura y reciclaje', detalle: 'Microbasurales, basureros y puntos limpios' },
  { id: 'verdes', sigla: 'VER', titulo: 'Áreas verdes y platabandas', detalle: 'Plazas, jardines y huertas' },
  { id: 'patrimonio', sigla: 'PAT', titulo: 'Patrimonio', detalle: 'Casonas, teatros y lugares con historia' },
  { id: 'movilidad', sigla: 'MOV', titulo: 'Movilidad', detalle: 'Paraderos, ciclovías y cruces' },
  { id: 'mobiliario', sigla: 'MOB', titulo: 'Bancas y mobiliario', detalle: 'Bancas, semáforos y luminarias' },
] as const;
```

#### `src/datos/observatorio.ts`

Las cifras del diagnóstico 2022 y los tres desafíos. (105 líneas)

```ts
import type { Desafio } from '@/dominio/tipos';

/**
 * Cifras del observatorio.
 *
 * Todas vienen del diagnostico socioambiental 2022 de Republica Circular, menos
 * el area verde por habitante, que es calculo del equipo cruzando el poligono
 * del barrio con el Censo 2017. El referente de comparacion es la comuna de
 * Santiago segun el SIEDU. Los reportes de vecinos son datos de ejemplo del
 * prototipo y la pantalla lo dice.
 */

export const platabandas = {
  titular: '262 de 500 platabandas están abandonadas o ya se pavimentaron',
  nota: 'Solo 13 tienen a alguien que las cuide.',
  tramos: [
    { etiqueta: 'En uso', valor: 238, color: '#2E6B3F' },
    { etiqueta: 'Abandonadas', valor: 236, color: '#A86E1C' },
    { etiqueta: 'Pavimentadas, sin vuelta atrás', valor: 26, color: '#9C3A33' },
  ],
};

export const areaVerde = {
  titular: 'Entre 7 y 10 veces menos que el promedio de Santiago',
  nota: 'Cálculo del equipo con el Censo 2017 y la capa de áreas verdes 2022. Comuna: SIEDU, INE.',
  barras: [
    { etiqueta: 'Barrio República', valor: '0,48 a 0,68 m²', proporcion: 0.068, destacada: true },
    { etiqueta: 'Comuna de Santiago', valor: '4,64 m²', proporcion: 0.464 },
    { etiqueta: 'Meta nacional (CNDU)', valor: '10 m²', proporcion: 1 },
  ],
};

export const loQueFaltaSaber = {
  titular: 'Sabemos dónde está cada banca, pero no en qué estado',
  filas: [
    { etiqueta: 'Bancas con estado', conseguido: 0, total: 93 },
    { etiqueta: 'Semáforos con estado', conseguido: 0, total: 172 },
    { etiqueta: 'Basureros con estado', conseguido: 4, total: 218 },
  ],
};

export const reportesDelMes = {
  titulo: 'REPORTES DE VECINOS · NOVIEMBRE',
  nota: 'Datos de ejemplo para el prototipo',
  filas: [
    { etiqueta: 'Basura', valor: 18, color: '#7A4A1F' },
    { etiqueta: 'Calles y veredas', valor: 9, color: '#4A5560' },
    { etiqueta: 'Árboles', valor: 6, color: '#2E6B3F' },
    { etiqueta: 'Ruido o luz', valor: 4, color: '#2C5A8C' },
    { etiqueta: 'Plagas', valor: 3, color: '#6B4380' },
  ],
};

export const trabajosDevueltos = [
  { id: 'diagnostico', titulo: 'Diagnóstico socioambiental 2022', autor: 'República Circular' },
  { id: 'levantamiento', titulo: 'Levantamiento con vecinos 2026', autor: 'Estudiantes FCFM · IE4000' },
];

/**
 * Desafios publicados para las instituciones del barrio. Nacen de lo que la
 * comunidad ya propuso y priorizo, que es la mitad del modulo de vinculacion.
 */
export const desafios: Desafio[] = [
  {
    id: 'punto-limpio',
    prioridad: 'alta',
    eje: 'Residuos',
    titulo: 'Punto limpio vecinal en Sazié con Av. República',
    resumen: '64 apoyos · 6 reportes · eje universitario',
    busca: 'diseño de contenedores y logística de retiro',
    disciplinas: ['Ingeniería', 'Diseño'],
    tiposDeApoyo: ['Conocimiento técnico', 'Materiales'],
    propuesta: 'punto-limpio',
  },
  {
    id: 'sombra-toesca',
    prioridad: 'alta',
    eje: 'Áreas verdes',
    titulo: 'Sombra en calle Toesca: 21 °C más caliente sin árboles',
    resumen: '47 apoyos · medición del diagnóstico 2022',
    busca: 'medición de temperatura y propuesta de arbolado',
    disciplinas: ['Ingeniería', 'Agronomía', 'Arquitectura'],
    tiposDeApoyo: ['Conocimiento técnico'],
  },
  {
    id: 'bancas',
    prioridad: 'media',
    eje: 'Espacio público',
    titulo: 'Mapear el estado de las 93 bancas del barrio',
    resumen: '29 apoyos · ninguna tiene estado registrado',
    busca: 'levantamiento en terreno y ficha de observación',
    disciplinas: ['Ciencias sociales', 'Arquitectura'],
    tiposDeApoyo: ['Voluntariado'],
  },
];

/** Formas en que una institucion declara que puede apoyar. */
export const formasDeApoyoInstitucional = [
  'Curso o taller',
  'Tesis o memoria',
  'Voluntariado',
  'Materiales',
] as const;

export const plazosDeApoyo = ['Este semestre', 'Otoño 2027', 'Por definir'] as const;
```

### 17.5 Estado · src/estado

#### `src/estado/barrio.tsx`

Contenido compartido y todas las acciones que lo modifican. (578 líneas)

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { actividadesIniciales } from '@/datos/actividades';
import { avisosIniciales } from '@/datos/avisos';
import { capasIniciales } from '@/datos/catastro';
import { conteoPorCapa } from '@/datos/catastroEnLinea';
import { hayBackend } from '@/datos/cliente';
import { subirFotosDeReporte } from '@/datos/fotosDeReporte';
import { personas } from '@/datos/personas';
import { propuestasIniciales } from '@/datos/propuestas';
import { reportesIniciales } from '@/datos/reportes';
import {
  confirmarReporte as confirmarEnLinea,
  crearReporte as crearEnLinea,
  listarReportes as listarEnLinea,
  senalarReporte as senalarEnLinea,
} from '@/datos/reportesEnLinea';
import type { IdCategoria } from '@/dominio/categorias';
import type { IdEstado } from '@/dominio/estados';
import { estados } from '@/dominio/estados';
import { usarSesion } from './sesion';

import type {
  Actividad,
  Aviso,
  CapaDelMapa,
  Comentario,
  ModoDeParticipar,
  PosturaComentario,
  PuntoEnMapa,
  Propuesta,
  Reporte,
} from '@/dominio/tipos';

/**
 * Estado compartido de la aplicacion.
 *
 * En el prototipo todo vive en memoria. Cuando se conecte Supabase, cada
 * funcion de aqui pasa a ser una llamada a la base y las pantallas no cambian,
 * porque ya hablan con estas acciones y no con los datos directamente.
 */

export type DatosDeReporteNuevo = {
  categoria: IdCategoria;
  direccion: string;
  descripcion: string;
  comoSeFormo?: string;
  desdeCuando?: string;
  tieneFoto: boolean;
  anonimo: boolean;
  posicion: PuntoEnMapa;
  /** Rutas locales de las fotos elegidas, que se suben tras publicar. */
  imagenes: string[];
};

export type DatosDePropuestaNueva = {
  titulo: string;
  idea: string;
  eje: string;
  reporteDeOrigen?: string;
  apoyosNecesarios: string[];
  voluntarios: number;
  disciplinas: string[];
};

export type DatosDeActividadNueva = {
  titulo: string;
  tipo: string;
  dia: number;
  mes: string;
  diaSemana: string;
  hora: string;
  lugar: string;
  voluntariosNecesarios: number;
  tareas: string[];
  naceDePropuesta?: string;
};

type ContextoBarrio = {
  reportes: Reporte[];
  propuestas: Propuesta[];
  actividades: Actividad[];
  avisos: Aviso[];
  capas: CapaDelMapa[];
  /** Identificador del ultimo reporte publicado, para la pantalla de cierre. */
  ultimoReportePublicado: string | null;
  /**
   * Ultimo problema al hablar con la base, si lo hubo. Esta aqui para que un
   * fallo de red no desaparezca en silencio: la pantalla que quiera avisarlo
   * lo lee, y las que no, siguen igual que antes.
   */
  ultimoErrorDeDatos: string | null;

  confirmarReporte: (id: string) => void;
  descartarReporte: (id: string) => void;
  cambiarEstadoDeReporte: (id: string, estado: IdEstado) => void;
  ocultarReporte: (id: string) => void;
  publicarReporte: (datos: DatosDeReporteNuevo) => string;

  apoyarPropuesta: (id: string) => void;
  comentarPropuesta: (id: string, texto: string, postura: PosturaComentario) => void;
  marcarComentarioUtil: (idPropuesta: string, idComentario: string) => void;
  publicarPropuesta: (datos: DatosDePropuestaNueva) => string;

  inscribirseEnActividad: (id: string, modo: ModoDeParticipar, tarea?: string) => void;
  cancelarInscripcion: (id: string) => void;
  publicarActividad: (datos: DatosDeActividadNueva) => string;

  marcarAvisoLeido: (id: string) => void;
  marcarTodosLosAvisosLeidos: () => void;
  avisosSinLeer: number;

  alternarCapa: (id: string) => void;
  restablecerCapas: () => void;
};

const Contexto = createContext<ContextoBarrio | null>(null);

/** Genera un identificador legible y unico dentro de la sesion. */
function nuevoId(prefijo: string): string {
  return `${prefijo}-${Date.now().toString(36)}`;
}

export function ProveedorBarrio({ children }: { children: ReactNode }) {
  // Quien publica es quien tiene la sesion abierta. Sin backend el contexto
  // de sesion entrega la vecina de ejemplo, de modo que el prototipo sigue
  // siendo navegable para mostrarlo.
  const { persona } = usarSesion();
  const autor = persona ?? personas.rosa;

  const [reportes, setReportes] = useState<Reporte[]>(reportesIniciales);
  const [propuestas, setPropuestas] = useState<Propuesta[]>(propuestasIniciales);
  const [actividades, setActividades] = useState<Actividad[]>(actividadesIniciales);
  const [avisos, setAvisos] = useState<Aviso[]>(avisosIniciales);
  const [capas, setCapas] = useState<CapaDelMapa[]>(capasIniciales);
  const [ultimoReportePublicado, setUltimoReportePublicado] = useState<string | null>(null);
  const [ultimoErrorDeDatos, setUltimoErrorDeDatos] = useState<string | null>(null);

  /**
   * Manda la operacion a la base cuando hay backend configurado, y guarda el
   * error si falla.
   *
   * No se espera el resultado a proposito. Las acciones de este contexto son
   * sincronas porque asi las llaman las pantallas, y volverlas asincronas
   * obligaria a tocar las 36. La memoria se actualiza al tiro y la base
   * despues, que es el comportamiento que el prototipo ya tenia.
   */
  const sincronizar = useCallback((operacion: () => Promise<unknown>) => {
    if (!hayBackend) return;
    operacion().catch((error: unknown) => {
      // Tambien a la consola, y no solo al estado. Una falla al escribir tiene
      // que dejar rastro en alguna parte: las pantallas de cierre anuncian
      // exito apenas la operacion se dispara, sin esperar la respuesta.
      console.error('No se pudo guardar en la base', error);
      setUltimoErrorDeDatos(
        error instanceof Error ? error.message : 'No se pudo guardar en la base',
      );
    });
  }, []);

  // Con backend configurado los datos de ejemplo son solo lo que se ve
  // mientras llega la primera respuesta.
  useEffect(() => {
    if (!hayBackend) return;
    listarEnLinea()
      .then(setReportes)
      .catch((error: unknown) => {
        setUltimoErrorDeDatos(
          error instanceof Error ? error.message : 'No se pudieron cargar los reportes',
        );
      });
  }, []);

  // El detalle de cada capa del catastro dice cuantos elementos tiene. La
  // lista de ejemplo trae la cifra que declara el diagnostico, que no coincide
  // con la cargada, de modo que con sesion abierta se reemplaza por lo que hay
  // en la base. Las tablas del catastro exigen cuenta, de ahi que dependa de
  // la persona.
  useEffect(() => {
    if (!hayBackend || persona === null) return;
    sincronizar(async () => {
      const conteo = await conteoPorCapa();
      setCapas((lista) =>
        lista.map((capa) => {
          const cuantos = conteo[capa.id];
          if (capa.unidad === undefined || cuantos === undefined) return capa;
          return { ...capa, detalle: `${cuantos} ${capa.unidad}` };
        }),
      );
    });
  }, [persona, sincronizar]);

  const cambiarUnReporte = useCallback(
    (id: string, transformar: (reporte: Reporte) => Reporte) => {
      setReportes((lista) => lista.map((r) => (r.id === id ? transformar(r) : r)));
    },
    [],
  );

  const confirmarReporte = useCallback(
    (id: string) => {
      cambiarUnReporte(id, (reporte) => {
        const confirmaciones = reporte.confirmaciones + 1;
        // Tres confirmaciones bastan para pasar de Recibido a Verificado. Es la
        // regla que explica la pantalla de envio: lo confirman otros vecinos o
        // lo revisa un moderador.
        const estado: IdEstado =
          reporte.estado === 'recibido' && confirmaciones >= 3 ? 'verificado' : reporte.estado;
        return { ...reporte, confirmaciones, estado };
      });
      sincronizar(() => confirmarEnLinea(id));
    },
    [cambiarUnReporte, sincronizar],
  );

  const descartarReporte = useCallback(
    (id: string) => {
      cambiarUnReporte(id, (reporte) => ({
        ...reporte,
        senalamientos: (reporte.senalamientos ?? 0) + 1,
      }));
      sincronizar(() => senalarEnLinea(id));
    },
    [cambiarUnReporte, sincronizar],
  );

  const cambiarEstadoDeReporte = useCallback(
    (id: string, estado: IdEstado) => {
      cambiarUnReporte(id, (reporte) => ({
        ...reporte,
        estado,
        seguimiento: reporte.seguimiento.map((evento) => ({
          ...evento,
          ocurrio: estados[evento.estado].paso <= estados[estado].paso,
          fecha:
            evento.estado === estado && evento.fecha === undefined ? 'ahora' : evento.fecha,
        })),
      }));
    },
    [cambiarUnReporte],
  );

  const ocultarReporte = useCallback((id: string) => {
    setReportes((lista) => lista.filter((reporte) => reporte.id !== id));
  }, []);

  const publicarReporte = useCallback((datos: DatosDeReporteNuevo): string => {
    const id = nuevoId('reporte');
    const reporte: Reporte = {
      id,
      categoria: datos.categoria,
      titulo: datos.direccion,
      direccion: datos.direccion,
      estado: 'recibido',
      descripcion: datos.descripcion === '' ? undefined : datos.descripcion,
      comoSeFormo: datos.comoSeFormo,
      desdeCuando: datos.desdeCuando,
      publicado: 'recién',
      resumen: 'Enviado recién',
      confirmaciones: 0,
      anonimo: datos.anonimo,
      autor: datos.anonimo ? null : autor,
      esMio: true,
      tieneFoto: datos.tieneFoto,
      // El punto queda donde la persona dejo el mapa en el paso de ubicacion.
      posicion: datos.posicion,
      seguimiento: [
        { estado: 'recibido', fecha: 'recién', detalle: 'Quedó publicado en el mapa', ocurrio: true },
        {
          estado: 'verificado',
          detalle: 'Cuando otros vecinos confirmen que existe',
          ocurrio: false,
        },
        {
          estado: 'gestion',
          detalle: 'Cuando alguien tome acción, aquí verás quién y qué hizo',
          ocurrio: false,
        },
        { estado: 'resuelto', detalle: 'Con foto del antes y después', ocurrio: false },
      ],
      propuestas: [],
      comentarios: [],
    };
    setReportes((lista) => [reporte, ...lista]);
    setUltimoReportePublicado(id);

    // El identificador local sirve para que la pantalla de cierre tenga algo
    // que mostrar al instante. Cuando la base responde con el suyo, se cambia
    // en la lista para que los enlaces apunten al reporte de verdad.
    sincronizar(async () => {
      const idReal = await crearEnLinea({
        categoria: datos.categoria,
        titulo: datos.direccion,
        direccion: datos.direccion,
        posicion: datos.posicion,
        anonimo: datos.anonimo,
        descripcion: datos.descripcion === '' ? undefined : datos.descripcion,
        comoSeFormo: datos.comoSeFormo,
        desdeCuando: datos.desdeCuando,
        tieneFoto: datos.tieneFoto,
      });
      setReportes((lista) =>
        lista.map((cada) => (cada.id === id ? { ...cada, id: idReal } : cada)),
      );
      setUltimoReportePublicado((actual) => (actual === id ? idReal : actual));

      // Las fotos se suben despues y no antes porque la ruta de cada archivo
      // lleva el identificador del reporte, que es lo que permite a las
      // politicas del deposito comprobar que quien sube es la autora.
      await subirFotosDeReporte(idReal, datos.imagenes);
    });

    return id;
  }, [autor, sincronizar]);

  const cambiarUnaPropuesta = useCallback(
    (id: string, transformar: (propuesta: Propuesta) => Propuesta) => {
      setPropuestas((lista) => lista.map((p) => (p.id === id ? transformar(p) : p)));
    },
    [],
  );

  const apoyarPropuesta = useCallback(
    (id: string) => {
      cambiarUnaPropuesta(id, (propuesta) => ({
        ...propuesta,
        apoyadaPorMi: !propuesta.apoyadaPorMi,
        apoyos: propuesta.apoyos + (propuesta.apoyadaPorMi ? -1 : 1),
      }));
    },
    [cambiarUnaPropuesta],
  );

  const comentarPropuesta = useCallback(
    (id: string, texto: string, postura: PosturaComentario) => {
      const comentario: Comentario = {
        id: nuevoId('comentario'),
        autor,
        cuando: 'recién',
        postura,
        texto,
        utiles: 0,
        respuestas: [],
      };
      cambiarUnaPropuesta(id, (propuesta) => ({
        ...propuesta,
        comentarios: [...propuesta.comentarios, comentario],
      }));
    },
    [autor, cambiarUnaPropuesta],
  );

  const marcarComentarioUtil = useCallback(
    (idPropuesta: string, idComentario: string) => {
      cambiarUnaPropuesta(idPropuesta, (propuesta) => ({
        ...propuesta,
        comentarios: propuesta.comentarios.map((comentario) =>
          comentario.id === idComentario
            ? { ...comentario, utiles: comentario.utiles + 1 }
            : comentario,
        ),
      }));
    },
    [cambiarUnaPropuesta],
  );

  const publicarPropuesta = useCallback((datos: DatosDePropuestaNueva): string => {
    const id = nuevoId('propuesta');
    const propuesta: Propuesta = {
      id,
      titulo: datos.titulo,
      eje: datos.eje,
      etapa: 'idea',
      autor,
      publicada: 'publicada recién',
      idea: datos.idea,
      apoyos: 1,
      reportesQueResuelve: datos.reporteDeOrigen === undefined ? 0 : 1,
      respondeA: datos.reporteDeOrigen === undefined ? undefined : '1 reporte del barrio',
      necesita: datos.apoyosNecesarios.map((titulo) => ({
        id: `${id}-${titulo}`,
        titulo,
        detalle: titulo === 'Manos voluntarias' ? 'Para armarlo y cuidarlo' : 'Por coordinar',
        ...(titulo === 'Manos voluntarias'
          ? { conseguido: 0, necesario: datos.voluntarios }
          : null),
      })),
      quierenApoyar: [],
      comentarios: [],
      posicion: { latitud: -33.452198, longitud: -70.663461 },
      disciplinas: datos.disciplinas,
      apoyadaPorMi: true,
    };
    setPropuestas((lista) => [propuesta, ...lista]);
    return id;
  }, [autor]);

  const inscribirseEnActividad = useCallback(
    (id: string, modo: ModoDeParticipar, tarea?: string) => {
      setActividades((lista) =>
        lista.map((actividad) => {
          if (actividad.id !== id || actividad.miInscripcion !== null) return actividad;
          return {
            ...actividad,
            miInscripcion: modo,
            miTarea: tarea,
            inscritos: actividad.inscritos + 1,
            voluntarios: actividad.voluntarios + (modo === 'voluntario' ? 1 : 0),
          };
        }),
      );
    },
    [],
  );

  const cancelarInscripcion = useCallback((id: string) => {
    setActividades((lista) =>
      lista.map((actividad) => {
        if (actividad.id !== id || actividad.miInscripcion === null) return actividad;
        return {
          ...actividad,
          inscritos: actividad.inscritos - 1,
          voluntarios:
            actividad.voluntarios - (actividad.miInscripcion === 'voluntario' ? 1 : 0),
          miInscripcion: null,
          miTarea: undefined,
        };
      }),
    );
  }, []);

  const publicarActividad = useCallback((datos: DatosDeActividadNueva): string => {
    const id = nuevoId('actividad');
    const actividad: Actividad = {
      id,
      titulo: datos.titulo,
      diaSemana: datos.diaSemana,
      dia: datos.dia,
      mes: datos.mes,
      hora: datos.hora,
      horario: datos.hora,
      lugar: datos.lugar,
      organiza: personas.republicaCircular,
      descripcion: datos.tipo,
      queLlevar: 'Por confirmar con quienes se inscriban.',
      inscritos: 0,
      voluntarios: 0,
      voluntariosNecesarios: datos.voluntariosNecesarios,
      tareas: datos.tareas,
      naceDePropuesta: datos.naceDePropuesta,
      posicion: { latitud: -33.452198, longitud: -70.663461 },
      miInscripcion: null,
    };
    setActividades((lista) => [actividad, ...lista]);
    return id;
  }, []);

  const marcarAvisoLeido = useCallback((id: string) => {
    setAvisos((lista) =>
      lista.map((aviso) => (aviso.id === id ? { ...aviso, leido: true } : aviso)),
    );
  }, []);

  const marcarTodosLosAvisosLeidos = useCallback(() => {
    setAvisos((lista) => lista.map((aviso) => ({ ...aviso, leido: true })));
  }, []);

  const alternarCapa = useCallback((id: string) => {
    setCapas((lista) =>
      lista.map((capa) => (capa.id === id ? { ...capa, activa: !capa.activa } : capa)),
    );
  }, []);

  // Restablecer vuelve a las capas que vienen encendidas, y no olvida los
  // conteos que ya se leyeron de la base.
  const restablecerCapas = useCallback(() => {
    setCapas((lista) =>
      lista.map((capa) => {
        const inicial = capasIniciales.find((otra) => otra.id === capa.id);
        return inicial === undefined ? capa : { ...capa, activa: inicial.activa };
      }),
    );
  }, []);

  const avisosSinLeer = useMemo(
    () => avisos.filter((aviso) => !aviso.leido).length,
    [avisos],
  );

  const valor = useMemo<ContextoBarrio>(
    () => ({
      reportes,
      propuestas,
      actividades,
      avisos,
      capas,
      ultimoReportePublicado,
      ultimoErrorDeDatos,
      confirmarReporte,
      descartarReporte,
      cambiarEstadoDeReporte,
      ocultarReporte,
      publicarReporte,
      apoyarPropuesta,
      comentarPropuesta,
      marcarComentarioUtil,
      publicarPropuesta,
      inscribirseEnActividad,
      cancelarInscripcion,
      publicarActividad,
      marcarAvisoLeido,
      marcarTodosLosAvisosLeidos,
      avisosSinLeer,
      alternarCapa,
      restablecerCapas,
    }),
    [
      reportes,
      propuestas,
      actividades,
      avisos,
      capas,
      ultimoReportePublicado,
      ultimoErrorDeDatos,
      confirmarReporte,
      descartarReporte,
      cambiarEstadoDeReporte,
      ocultarReporte,
      publicarReporte,
      apoyarPropuesta,
      comentarPropuesta,
      marcarComentarioUtil,
      publicarPropuesta,
      inscribirseEnActividad,
      cancelarInscripcion,
      publicarActividad,
      marcarAvisoLeido,
      marcarTodosLosAvisosLeidos,
      avisosSinLeer,
      alternarCapa,
      restablecerCapas,
    ],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usarBarrio(): ContextoBarrio {
  const contexto = useContext(Contexto);
  if (contexto === null) {
    throw new Error('usarBarrio necesita estar dentro de ProveedorBarrio');
  }
  return contexto;
}

/** Atajo para las pantallas de detalle, que siempre reciben el identificador. */
export function usarReporte(id: string | undefined): Reporte | undefined {
  const { reportes } = usarBarrio();
  return reportes.find((reporte) => reporte.id === id);
}

export function usarPropuesta(id: string | undefined): Propuesta | undefined {
  const { propuestas } = usarBarrio();
  return propuestas.find((propuesta) => propuesta.id === id);
}

export function usarActividad(id: string | undefined): Actividad | undefined {
  const { actividades } = usarBarrio();
  return actividades.find((actividad) => actividad.id === id);
}
```

#### `src/estado/borradores.tsx`

Lo que la persona lleva escrito en los flujos de varios pasos. (134 líneas)

```tsx
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { CENTRO_DEL_BARRIO } from '@/dominio/barrio';
import type { IdCategoria } from '@/dominio/categorias';
import type { PuntoEnMapa } from '@/dominio/tipos';

import { usarPreferencias } from './preferencias';

/**
 * Lo que la persona lleva escrito en los flujos de varios pasos.
 *
 * Vive fuera de las pantallas porque el asistente de reporte tiene cinco y
 * todas tienen que ver lo mismo, incluida la de revision final, que muestra un
 * resumen de los cuatro pasos anteriores.
 */

export type BorradorDeReporte = {
  categoria: IdCategoria | null;
  /**
   * Las fotos adjuntas, como rutas locales del telefono. El maximo del diseno
   * es tres. Van aqui y no en la pantalla de foto porque el paso de revision
   * las muestra y porque al publicar hay que subirlas.
   */
  imagenes: string[];
  direccion: string;
  comoSeFormo: string | null;
  desdeCuando: string | null;
  descripcion: string;
  anonimo: boolean;
  /** Donde quedo el punto al terminar el paso de ubicacion. */
  posicion: PuntoEnMapa;
  /** Reporte parecido que se encontro cerca, si lo hubo. */
  posibleDuplicado: string | null;
};

const reporteVacio: BorradorDeReporte = {
  categoria: null,
  imagenes: [],
  direccion: 'Sazié con Av. República',
  comoSeFormo: null,
  desdeCuando: null,
  descripcion: '',
  anonimo: false,
  // Arranca al centro del barrio, que es donde el mapa abre el paso de
  // ubicacion. Si la persona no mueve el mapa, ese es el punto que vale.
  posicion: CENTRO_DEL_BARRIO,
  posibleDuplicado: null,
};

export type BorradorDePropuesta = {
  reporteDeOrigen: string | null;
  titulo: string;
  idea: string;
  eje: string;
  apoyosNecesarios: string[];
  voluntarios: number;
  disciplinas: string[];
};

const propuestaVacia: BorradorDePropuesta = {
  reporteDeOrigen: null,
  titulo: '',
  idea: '',
  eje: 'Residuos',
  apoyosNecesarios: [],
  voluntarios: 15,
  disciplinas: [],
};

type ContextoBorradores = {
  reporte: BorradorDeReporte;
  cambiarReporte: (cambios: Partial<BorradorDeReporte>) => void;
  reiniciarReporte: (origen?: Partial<BorradorDeReporte>) => void;

  propuesta: BorradorDePropuesta;
  cambiarPropuesta: (cambios: Partial<BorradorDePropuesta>) => void;
  reiniciarPropuesta: (origen?: Partial<BorradorDePropuesta>) => void;
};

const Contexto = createContext<ContextoBorradores | null>(null);

export function ProveedorBorradores({ children }: { children: ReactNode }) {
  // El ajuste del perfil solo decide con que valor arranca el borrador. La
  // decision de publicar sin mostrar autor se toma en cada reporte, en el paso
  // de revision, que es donde la persona ve lo que esta por publicar.
  const { proponerAnonimo } = usarPreferencias();

  const [reporte, setReporte] = useState<BorradorDeReporte>({
    ...reporteVacio,
    anonimo: proponerAnonimo,
  });
  const [propuesta, setPropuesta] = useState<BorradorDePropuesta>(propuestaVacia);

  const cambiarReporte = useCallback((cambios: Partial<BorradorDeReporte>) => {
    setReporte((actual) => ({ ...actual, ...cambios }));
  }, []);

  const reiniciarReporte = useCallback(
    (origen?: Partial<BorradorDeReporte>) => {
      setReporte({ ...reporteVacio, anonimo: proponerAnonimo, ...origen });
    },
    [proponerAnonimo],
  );

  const cambiarPropuesta = useCallback((cambios: Partial<BorradorDePropuesta>) => {
    setPropuesta((actual) => ({ ...actual, ...cambios }));
  }, []);

  const reiniciarPropuesta = useCallback((origen?: Partial<BorradorDePropuesta>) => {
    setPropuesta({ ...propuestaVacia, ...origen });
  }, []);

  const valor = useMemo<ContextoBorradores>(
    () => ({
      reporte,
      cambiarReporte,
      reiniciarReporte,
      propuesta,
      cambiarPropuesta,
      reiniciarPropuesta,
    }),
    [reporte, cambiarReporte, reiniciarReporte, propuesta, cambiarPropuesta, reiniciarPropuesta],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usarBorradores(): ContextoBorradores {
  const contexto = useContext(Contexto);
  if (contexto === null) {
    throw new Error('usarBorradores necesita estar dentro de ProveedorBorradores');
  }
  return contexto;
}
```

#### `src/estado/preferencias.tsx`

Lectura y accesibilidad, persistidas en el teléfono. (120 líneas)

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * Preferencias de lectura de la persona que usa la aplicacion.
 *
 * El sistema visual exige que el tamano de letra se pueda ajustar desde la
 * bienvenida y desde Ajustes, asi que vive en un contexto propio y lo aplica el
 * componente Texto. Queda guardado en el telefono para no tener que
 * reconfigurarlo en cada sesion.
 */

export const factoresDeTexto = [1, 1.15, 1.3] as const;

export type FactorTexto = (typeof factoresDeTexto)[number];

export type Preferencias = {
  /** Multiplica el tamano de cada texto de la aplicacion. */
  factorTexto: FactorTexto;
  /** Sube el contraste de bordes y de los textos de apoyo. */
  altoContraste: boolean;
  /** Apaga las animaciones de entrada y de transicion. */
  menosAnimaciones: boolean;
  /** Avisa cuando cambia el estado de un reporte propio. */
  avisarCambioDeEstado: boolean;
  /** Avisa de actividades nuevas en el barrio. */
  avisarActividades: boolean;
  /**
   * Deja marcado "anonimo" al empezar un reporte.
   *
   * Es una sugerencia y no una regla: el anonimato se decide publicacion por
   * publicacion, y el paso de revision siempre permite cambiarlo. Por eso
   * tampoco viaja a la base, se queda en el telefono.
   */
  proponerAnonimo: boolean;
};

const preferenciasIniciales: Preferencias = {
  factorTexto: 1,
  altoContraste: false,
  menosAnimaciones: false,
  avisarCambioDeEstado: true,
  avisarActividades: true,
  proponerAnonimo: false,
};

const CLAVE_GUARDADO = 'barrio-republica.preferencias';

/** Guarda sin bloquear. Si el almacenamiento falla la sesion sigue igual. */
function persistir(preferencias: Preferencias): void {
  AsyncStorage.setItem(CLAVE_GUARDADO, JSON.stringify(preferencias)).catch(() => {});
}

type ContextoPreferencias = Preferencias & {
  /** Avanza al siguiente tamano de letra y vuelve al menor al pasarse. */
  rotarTamanoDeTexto: () => void;
  cambiar: <C extends keyof Preferencias>(clave: C, valor: Preferencias[C]) => void;
};

const Contexto = createContext<ContextoPreferencias | null>(null);

export function ProveedorPreferencias({ children }: { children: ReactNode }) {
  const [preferencias, setPreferencias] = useState<Preferencias>(preferenciasIniciales);

  useEffect(() => {
    let vigente = true;
    AsyncStorage.getItem(CLAVE_GUARDADO)
      .then((guardado) => {
        if (!vigente || guardado === null) return;
        setPreferencias({ ...preferenciasIniciales, ...JSON.parse(guardado) });
      })
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  const cambiar = useCallback<ContextoPreferencias['cambiar']>((clave, valor) => {
    setPreferencias((actual) => {
      const siguiente = { ...actual, [clave]: valor };
      persistir(siguiente);
      return siguiente;
    });
  }, []);

  const rotarTamanoDeTexto = useCallback(() => {
    setPreferencias((actual) => {
      const posicion = factoresDeTexto.indexOf(actual.factorTexto);
      const siguiente: Preferencias = {
        ...actual,
        factorTexto: factoresDeTexto[(posicion + 1) % factoresDeTexto.length] ?? 1,
      };
      persistir(siguiente);
      return siguiente;
    });
  }, []);

  const valor = useMemo<ContextoPreferencias>(
    () => ({ ...preferencias, rotarTamanoDeTexto, cambiar }),
    [preferencias, rotarTamanoDeTexto, cambiar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usarPreferencias(): ContextoPreferencias {
  const contexto = useContext(Contexto);
  if (contexto === null) {
    throw new Error('usarPreferencias necesita estar dentro de ProveedorPreferencias');
  }
  return contexto;
}
```

### 17.6 Utilidades · src/utiles

#### `src/utiles/navegacion.ts`

Retroceso seguro cuando no hay historia. (19 líneas)

```ts
import { router } from 'expo-router';

/**
 * Retroceso seguro.
 *
 * `router.back()` falla cuando la pantalla se abrio directamente, por ejemplo
 * desde un enlace compartido o al recargar en el navegador, porque no hay nada
 * atras. En ese caso conviene llevar a la pantalla que contiene a esta en vez
 * de dejar el boton muerto.
 */
export function crearVolver(destinoAlternativo: string): () => void {
  return () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(destinoAlternativo as never);
  };
}
```

#### `src/utiles/texto.ts`

Singular y plural. (7 líneas)

```ts
/**
 * Elige entre singular y plural segun la cantidad. Evita que la aplicacion
 * muestre cosas como "1 propuestas apoyadas", que se nota descuidado.
 */
export function pluralizar(cantidad: number, singular: string, plural: string): string {
  return cantidad === 1 ? singular : plural;
}
```

### 17.7 Componentes base · src/componentes/base

#### `src/componentes/base/index.ts`

Punto único de entrada. (23 líneas)

```ts
/**
 * Punto unico de entrada a los componentes base. Las pantallas importan desde
 * aqui para no tener que conocer la ruta de cada archivo.
 */
export { Aviso, type TonoAviso } from './Aviso';
export { BarraDePasos } from './BarraDePasos';
export { BarraInferior } from './BarraInferior';
export { Boton, type VarianteBoton } from './Boton';
export { BotonCircular } from './BotonCircular';
export { CampoTexto } from './CampoTexto';
export { Chip, FilaDeChips } from './Chip';
export { Columna, Fila } from './Disposicion';
export { Contador } from './Contador';
export { EncabezadoDePaso } from './EncabezadoDePaso';
export { Etiqueta } from './Etiqueta';
export { Icono } from './Icono';
export { Interruptor } from './Interruptor';
export { FilaDeLista, ListaAgrupada, Sigla } from './Lista';
export { Casilla, Opcion } from './Opcion';
export { Pantalla } from './Pantalla';
export { Presionable } from './Presionable';
export { Tarjeta } from './Tarjeta';
export { Texto } from './Texto';
```

#### `src/componentes/base/Texto.tsx`

Todo el texto de la aplicación pasa por aquí. (71 líneas)

```tsx
import { Text, type TextProps, type TextStyle } from 'react-native';

import { colores } from '@/diseno/colores';
import { escalaTexto, familias } from '@/diseno/tipografia';
import { usarPreferencias } from '@/estado/preferencias';

type PropsTexto = TextProps & {
  /** Tamano en puntos. Por defecto el texto base del sistema, 17. */
  tamano?: number;
  /** Las dos familias del sistema: titulos condensados o texto hiperlegible. */
  familia?: 'titulo' | 'tituloSemi' | 'texto';
  peso?: 'normal' | 'fuerte';
  color?: string;
  /** Multiplicador del alto de linea. Los mockups usan entre 1 y 1.45. */
  interlineado?: number;
  alineacion?: TextStyle['textAlign'];
  mayusculas?: boolean;
  /** Separacion entre letras, usada en las etiquetas en mayusculas. */
  espaciado?: number;
};

/**
 * Todo el texto de la aplicacion pasa por aqui. Es lo que permite que el ajuste
 * de tamano de letra funcione de verdad en cada pantalla sin tener que tocarlas
 * una por una.
 */
export function Texto({
  tamano = escalaTexto.base,
  familia = 'texto',
  peso = 'normal',
  color = colores.tinta,
  interlineado,
  alineacion,
  mayusculas,
  espaciado,
  style,
  ...resto
}: PropsTexto) {
  const { factorTexto } = usarPreferencias();
  const tamanoFinal = tamano * factorTexto;

  const nombreDeFuente =
    familia === 'texto'
      ? peso === 'fuerte'
        ? familias.textoFuerte
        : familias.texto
      : familia === 'tituloSemi'
        ? familias.tituloSemi
        : familias.titulo;

  return (
    <Text
      {...resto}
      // La fuente ya viene en el peso correcto, pero sin allowFontScaling en
      // false el sistema operativo volveria a escalar encima del ajuste propio.
      allowFontScaling={false}
      style={[
        {
          fontFamily: nombreDeFuente,
          fontSize: tamanoFinal,
          color,
          ...(interlineado === undefined ? null : { lineHeight: tamanoFinal * interlineado }),
          ...(alineacion === undefined ? null : { textAlign: alineacion }),
          ...(mayusculas === true ? { textTransform: 'uppercase' as const } : null),
          ...(espaciado === undefined ? null : { letterSpacing: espaciado }),
        },
        style,
      ]}
    />
  );
}
```

#### `src/componentes/base/Icono.tsx`

Dibuja cualquiera de los 51 íconos. (51 líneas)

```tsx
import { Circle, Path, Rect, Svg } from 'react-native-svg';

import { iconos, type NombreIcono } from '@/diseno/iconos';

type PropsIcono = {
  nombre: NombreIcono;
  /** Lado del cuadrado que ocupa el icono. Los mockups usan entre 15 y 30. */
  tamano?: number;
  color?: string;
  /**
   * Grosor de linea. El valor base del diseno es 1.9 y sube a 2.2 o 2.6 en los
   * iconos que acompanan acciones principales.
   */
  grosor?: number;
};

/**
 * Dibuja uno de los iconos del catalogo. Siempre son lineas sobre un lienzo de
 * 24 x 24, asi que un solo componente sirve para los cincuenta y tantos.
 */
export function Icono({ nombre, tamano = 22, color = 'currentColor', grosor = 1.9 }: PropsIcono) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      {iconos[nombre].map((trazo, posicion) => {
        const comunes = {
          stroke: color,
          strokeWidth: grosor,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
        };
        if (trazo.figura === 'linea') {
          return <Path key={posicion} d={trazo.d} {...comunes} />;
        }
        if (trazo.figura === 'circulo') {
          return <Circle key={posicion} cx={trazo.cx} cy={trazo.cy} r={trazo.r} {...comunes} />;
        }
        return (
          <Rect
            key={posicion}
            x={trazo.x}
            y={trazo.y}
            width={trazo.ancho}
            height={trazo.alto}
            rx={trazo.radio}
            {...comunes}
          />
        );
      })}
    </Svg>
  );
}
```

#### `src/componentes/base/Presionable.tsx`

Área tocable con reacción breve al tacto. (60 líneas)

```tsx
import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { usarPreferencias } from '@/estado/preferencias';

const PressableAnimado = Animated.createAnimatedComponent(Pressable);

type PropsPresionable = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Cuanto se achica al tocarlo. Un valor mas bajo se siente mas marcado. */
  escalaAlTocar?: number;
  /** Vibracion breve al tocar. Se usa en las acciones que confirman algo. */
  vibrar?: boolean;
};

/**
 * Area tocable con una reaccion breve al tacto. Se usa en vez de Pressable
 * directo para que todos los botones y tarjetas respondan igual y para respetar
 * la preferencia de menos animaciones.
 */
export function Presionable({
  style,
  escalaAlTocar = 0.97,
  vibrar = false,
  onPressIn,
  onPressOut,
  ...resto
}: PropsPresionable) {
  const { menosAnimaciones } = usarPreferencias();
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  return (
    <PressableAnimado
      {...resto}
      onPressIn={(evento) => {
        if (!menosAnimaciones) {
          escala.value = withTiming(escalaAlTocar, { duration: 90 });
        }
        if (vibrar) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPressIn?.(evento);
      }}
      onPressOut={(evento) => {
        escala.value = withTiming(1, { duration: 140 });
        onPressOut?.(evento);
      }}
      style={[style, estiloAnimado]}
    />
  );
}
```

#### `src/componentes/base/Disposicion.tsx`

Fila y Columna. (74 líneas)

```tsx
import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

type PropsCaja = {
  children?: ReactNode;
  /** Separacion entre los hijos. */
  separacion?: number;
  /** Alineacion en el eje transversal al de la caja. */
  alinear?: ViewStyle['alignItems'];
  /** Reparto de los hijos a lo largo del eje principal. */
  repartir?: ViewStyle['justifyContent'];
  /** Cuanto espacio sobrante toma la caja dentro de su contenedor. */
  crecer?: number;
  style?: StyleProp<ViewStyle>;
  accesibilidad?: string;
};

/** Hijos uno al lado del otro. */
export function Fila({
  children,
  separacion,
  alinear = 'center',
  repartir,
  crecer,
  style,
  accesibilidad,
}: PropsCaja) {
  return (
    <View
      accessibilityLabel={accesibilidad}
      style={[
        {
          flexDirection: 'row',
          alignItems: alinear,
          ...(separacion === undefined ? null : { gap: separacion }),
          ...(repartir === undefined ? null : { justifyContent: repartir }),
          ...(crecer === undefined ? null : { flex: crecer }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Hijos uno debajo del otro. */
export function Columna({
  children,
  separacion,
  alinear,
  repartir,
  crecer,
  style,
  accesibilidad,
}: PropsCaja) {
  return (
    <View
      accessibilityLabel={accesibilidad}
      style={[
        {
          flexDirection: 'column',
          ...(alinear === undefined ? null : { alignItems: alinear }),
          ...(separacion === undefined ? null : { gap: separacion }),
          ...(repartir === undefined ? null : { justifyContent: repartir }),
          ...(crecer === undefined ? null : { flex: crecer }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
```

#### `src/componentes/base/Boton.tsx`

Seis variantes de botón. (113 líneas)

```tsx
import type { StyleProp, ViewStyle } from 'react-native';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';

/**
 * Las cuatro familias de boton del sistema visual mas las dos que solo
 * aparecen sobre fondo bosque, donde el verde de accion no contrasta.
 */
export type VarianteBoton =
  | 'principal'
  | 'secundaria'
  | 'tonal'
  | 'brote'
  | 'contornoClaro'
  | 'peligro';

type PropsBoton = {
  texto: string;
  onPress?: () => void;
  variante?: VarianteBoton;
  icono?: NombreIcono;
  /** Por defecto el icono va antes del texto. */
  iconoAlFinal?: boolean;
  /** Alto en puntos. El minimo del sistema es 52 y la accion principal usa 56. */
  alto?: number;
  tamanoDeTexto?: number;
  /** Ocupa todo el ancho disponible del contenedor. */
  ancho?: 'completo' | 'contenido';
  deshabilitado?: boolean;
  vibrar?: boolean;
  accesibilidad?: string;
  style?: StyleProp<ViewStyle>;
};

type Apariencia = {
  fondo: string;
  texto: string;
  borde?: string;
};

const apariencias: Record<VarianteBoton, Apariencia> = {
  principal: { fondo: colores.verde, texto: colores.papel },
  secundaria: { fondo: 'transparent', texto: colores.tinta, borde: colores.bordeFuerte },
  tonal: { fondo: colores.menta, texto: '#174D34' },
  brote: { fondo: colores.brote, texto: colores.bosque },
  contornoClaro: { fondo: 'transparent', texto: colores.papel, borde: colores.bosqueBorde },
  peligro: { fondo: colores.alerta, texto: colores.blanco },
};

export function Boton({
  texto,
  onPress,
  variante = 'principal',
  icono,
  iconoAlFinal = false,
  alto = alturaTocable.boton,
  tamanoDeTexto = 16,
  ancho = 'completo',
  deshabilitado = false,
  vibrar = false,
  accesibilidad,
  style,
}: PropsBoton) {
  const apariencia = apariencias[variante];
  const contenido = (
    <>
      {icono !== undefined && !iconoAlFinal ? (
        <Icono nombre={icono} tamano={tamanoDeTexto + 3} color={apariencia.texto} grosor={2.1} />
      ) : null}
      <Texto tamano={tamanoDeTexto} peso="fuerte" color={apariencia.texto}>
        {texto}
      </Texto>
      {icono !== undefined && iconoAlFinal ? (
        <Icono nombre={icono} tamano={tamanoDeTexto + 4} color={apariencia.texto} grosor={2.2} />
      ) : null}
    </>
  );

  return (
    <Presionable
      onPress={deshabilitado ? undefined : onPress}
      vibrar={vibrar}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad ?? texto}
      accessibilityState={{ disabled: deshabilitado }}
      style={[
        {
          height: alto,
          borderRadius: radio.caja,
          backgroundColor: apariencia.fondo,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: espacio.normal,
          paddingHorizontal: espacio.amplio,
          opacity: deshabilitado ? 0.45 : 1,
          ...(ancho === 'contenido' ? { alignSelf: 'flex-start' } : null),
          ...(apariencia.borde === undefined
            ? null
            : { borderWidth: 1.5, borderColor: apariencia.borde }),
        },
        style,
      ]}
    >
      {contenido}
    </Presionable>
  );
}
```

#### `src/componentes/base/BotonCircular.tsx`

El botón redondo de 44 px de las cabeceras. (56 líneas)

```tsx
import type { StyleProp, ViewStyle } from 'react-native';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { alturaTocable, radio } from '@/diseno/medidas';

type PropsBotonCircular = {
  icono: NombreIcono;
  accesibilidad: string;
  onPress?: () => void;
  /** Sobre fondo bosque el circulo claro no contrasta y hay que invertirlo. */
  tono?: 'claro' | 'oscuro';
  tamano?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * El boton redondo de 44 px que encabeza casi todas las pantallas: volver,
 * cerrar y cancelar. Cumple el minimo de zona tocable del sistema visual.
 */
export function BotonCircular({
  icono,
  accesibilidad,
  onPress,
  tono = 'claro',
  tamano = alturaTocable.minima,
  style,
}: PropsBotonCircular) {
  const esClaro = tono === 'claro';
  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.92}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad}
      style={[
        {
          width: tamano,
          height: tamano,
          borderRadius: radio.redondo,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: esClaro ? colores.papel : 'transparent',
          ...(esClaro
            ? { borderWidth: 1, borderColor: colores.borde }
            : { borderWidth: 1.5, borderColor: colores.bosqueBorde }),
        },
        style,
      ]}
    >
      <Icono nombre={icono} tamano={22} color={esClaro ? colores.tinta : colores.papel} />
    </Presionable>
  );
}
```

#### `src/componentes/base/Tarjeta.tsx`

Contenedor de contenido, cuatro tonos. (69 líneas)

```tsx
import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { Presionable } from './Presionable';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';

type PropsTarjeta = {
  children: ReactNode;
  /** Las tarjetas oscuras se reservan para lo que avanzo en un reporte propio. */
  tono?: 'papel' | 'bosque' | 'menta' | 'crema';
  separacion?: number;
  relleno?: number;
  /** Si se entrega, la tarjeta completa se vuelve tocable. */
  onPress?: () => void;
  accesibilidad?: string;
  /** Recorta el contenido que se sale, por ejemplo la foto de cabecera. */
  recortar?: boolean;
  style?: StyleProp<ViewStyle>;
};

const tonos: Record<NonNullable<PropsTarjeta['tono']>, ViewStyle> = {
  papel: { backgroundColor: colores.papel, borderWidth: 1, borderColor: colores.borde },
  bosque: { backgroundColor: colores.bosque },
  menta: { backgroundColor: colores.menta },
  crema: { backgroundColor: colores.crema, borderWidth: 1, borderColor: colores.borde },
};

/**
 * Contenedor de contenido del feed, de las listas y de los detalles. Unifica
 * radio, borde y relleno para que ninguna pantalla los vuelva a escribir.
 */
export function Tarjeta({
  children,
  tono = 'papel',
  separacion = espacio.medio,
  relleno = espacio.amplio,
  onPress,
  accesibilidad,
  recortar = false,
  style,
}: PropsTarjeta) {
  const estilo: StyleProp<ViewStyle> = [
    {
      borderRadius: radio.tarjeta,
      padding: relleno,
      gap: separacion,
      ...(recortar ? { overflow: 'hidden', padding: 0 } : null),
    },
    tonos[tono],
    style,
  ];

  if (onPress === undefined) {
    return <View style={estilo}>{children}</View>;
  }

  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.985}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad}
      style={estilo}
    >
      {children}
    </Presionable>
  );
}
```

#### `src/componentes/base/Chip.tsx`

Filtro en pastilla y carril horizontal de chips. (105 líneas)

```tsx
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { espacio, radio, sombras } from '@/diseno/medidas';

type PropsChip = {
  texto: string;
  activo?: boolean;
  onPress?: () => void;
  icono?: NombreIcono;
  alto?: number;
  tamanoDeTexto?: number;
  /** Los chips del mapa flotan sobre el plano y llevan sombra en vez de borde. */
  flotante?: boolean;
  /**
   * "relleno" pinta el chip elegido de verde con texto claro, y es el filtro
   * normal. "marcado" lo deja en menta con borde verde, que es como se ven las
   * opciones que se eligen de a varias.
   */
  variante?: 'relleno' | 'marcado';
  style?: StyleProp<ViewStyle>;
};

/**
 * Filtro en forma de pildora. Se usa para las pestanas del feed, los filtros
 * del mapa y las listas de propuestas y desafios.
 */
export function Chip({
  texto,
  activo = false,
  onPress,
  icono,
  alto = 40,
  tamanoDeTexto = 15,
  flotante = false,
  variante = 'relleno',
  style,
}: PropsChip) {
  const esMarcado = variante === 'marcado';
  const colorDeTexto = activo ? (esMarcado ? '#174D34' : colores.papel) : colores.tinta;
  const fondoActivo = esMarcado ? colores.menta : flotante ? colores.bosque : colores.verde;

  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.95}
      accessibilityRole="tab"
      accessibilityState={{ selected: activo }}
      accessibilityLabel={texto}
      style={[
        {
          height: alto,
          paddingHorizontal: espacio.amplio,
          borderRadius: radio.redondo,
          flexDirection: 'row',
          alignItems: 'center',
          gap: espacio.corto,
          backgroundColor: activo ? fondoActivo : colores.papel,
          ...(flotante
            ? sombras.suave
            : activo
              ? esMarcado
                ? { borderWidth: 2, borderColor: colores.verde }
                : null
              : { borderWidth: 1.5, borderColor: colores.bordeFuerte }),
        },
        style,
      ]}
    >
      {icono === undefined ? null : (
        <Icono nombre={icono} tamano={tamanoDeTexto + 2} color={colorDeTexto} />
      )}
      <Texto tamano={tamanoDeTexto} peso={activo ? 'fuerte' : 'normal'} color={colorDeTexto}>
        {texto}
      </Texto>
    </Presionable>
  );
}

/**
 * Carril horizontal de chips. Desplaza sin barra visible, igual que el mockup,
 * y deja aire al final para que el ultimo chip no quede pegado al borde.
 */
export function FilaDeChips({
  children,
  relleno = espacio.amplio,
}: {
  children: ReactNode;
  relleno?: number;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: espacio.normal, paddingHorizontal: relleno }}
    >
      {children}
    </ScrollView>
  );
}
```

#### `src/componentes/base/Etiqueta.tsx`

Píldora de estado. (64 líneas)

```tsx
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Icono } from './Icono';
import { Texto } from './Texto';
import type { NombreIcono } from '@/diseno/iconos';
import { espacio, radio } from '@/diseno/medidas';

type PropsEtiqueta = {
  texto: string;
  fondo: string;
  color: string;
  /** Punto de color antes del texto, como en los estados del reporte. */
  punto?: string;
  icono?: NombreIcono;
  alto?: number;
  tamanoDeTexto?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Pildora de estado. Nunca comunica con el color solo: siempre lleva la palabra
 * y, cuando corresponde, un punto o un icono, como pide la regla de
 * accesibilidad del sistema visual.
 */
export function Etiqueta({
  texto,
  fondo,
  color,
  punto,
  icono,
  alto = 28,
  tamanoDeTexto = 13,
  style,
}: PropsEtiqueta) {
  return (
    <View
      style={[
        {
          height: alto,
          paddingHorizontal: espacio.comodo,
          borderRadius: radio.redondo,
          backgroundColor: fondo,
          flexDirection: 'row',
          alignItems: 'center',
          gap: espacio.corto,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {punto === undefined ? null : (
        <View
          style={{ width: 7, height: 7, borderRadius: radio.redondo, backgroundColor: punto }}
        />
      )}
      {icono === undefined ? null : (
        <Icono nombre={icono} tamano={tamanoDeTexto + 2} color={color} grosor={2.6} />
      )}
      <Texto tamano={tamanoDeTexto} peso="fuerte" color={color}>
        {texto}
      </Texto>
    </View>
  );
}
```

#### `src/componentes/base/CampoTexto.tsx`

Campo de escritura. (98 líneas)

```tsx
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import { familias } from '@/diseno/tipografia';
import { usarPreferencias } from '@/estado/preferencias';

/** Cada tipo de dato pide su teclado: el codigo de ingreso son solo numeros. */
const teclados = {
  texto: 'default',
  correo: 'email-address',
  numero: 'number-pad',
} as const;

type PropsCampoTexto = {
  valor: string;
  onCambiar: (valor: string) => void;
  etiqueta?: string;
  /** Texto de apoyo bajo el campo, por ejemplo el limite de caracteres. */
  ayuda?: string;
  marcaDeAgua?: string;
  /** Un campo de varias lineas crece segun las filas pedidas. */
  lineas?: number;
  maximoDeCaracteres?: number;
  tipoDeTeclado?: 'texto' | 'correo' | 'numero';
  autoenfocar?: boolean;
};

/**
 * Campo de escritura del formulario. Marca el borde en verde mientras se
 * escribe, igual que los mockups, para que se vea donde esta puesto el foco.
 */
export function CampoTexto({
  valor,
  onCambiar,
  etiqueta,
  ayuda,
  marcaDeAgua,
  lineas = 1,
  maximoDeCaracteres,
  tipoDeTeclado = 'texto',
  autoenfocar = false,
}: PropsCampoTexto) {
  const { factorTexto } = usarPreferencias();
  const [enfocado, setEnfocado] = useState(false);
  const esDeVariasLineas = lineas > 1;
  const resaltado = enfocado || valor.length > 0;

  return (
    <View style={{ gap: espacio.corto }}>
      {etiqueta === undefined ? null : (
        <Texto tamano={15} peso="fuerte">
          {etiqueta}
        </Texto>
      )}
      <TextInput
        value={valor}
        onChangeText={onCambiar}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        placeholder={marcaDeAgua}
        placeholderTextColor={colores.grisTexto}
        multiline={esDeVariasLineas}
        maxLength={maximoDeCaracteres}
        autoFocus={autoenfocar}
        allowFontScaling={false}
        keyboardType={teclados[tipoDeTeclado]}
        autoCapitalize={tipoDeTeclado === 'texto' ? 'sentences' : 'none'}
        accessibilityLabel={etiqueta ?? marcaDeAgua}
        style={{
          borderRadius: radio.boton,
          borderWidth: resaltado ? 2 : 1.5,
          borderColor: resaltado ? colores.verde : colores.bordeFuerte,
          backgroundColor: colores.papel,
          fontFamily: familias.texto,
          fontSize: 16.5 * factorTexto,
          color: colores.tinta,
          paddingHorizontal: espacio.amplio - 2,
          ...(esDeVariasLineas
            ? {
                paddingTop: espacio.medio,
                paddingBottom: espacio.medio,
                minHeight: 26 * lineas * factorTexto + espacio.bloque,
                textAlignVertical: 'top' as const,
              }
            : { height: alturaTocable.principal * Math.max(1, factorTexto * 0.95) }),
        }}
      />
      {ayuda === undefined ? null : (
        <Texto tamano={13} color={colores.grisTexto}>
          {ayuda}
        </Texto>
      )}
    </View>
  );
}
```

#### `src/componentes/base/Opcion.tsx`

Fila seleccionable y casilla suelta. (149 líneas)

```tsx
import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';

type PropsOpcion = {
  texto: string;
  activa: boolean;
  onPress: () => void;
  /** Explicacion breve bajo el texto principal. */
  detalle?: string;
  icono?: NombreIcono;
  /** Varias opciones a la vez se marcan con casilla; una sola, con circulo. */
  seleccion?: 'unica' | 'multiple';
  /** La variante compacta se usa en las rejillas de dos o tres columnas. */
  compacta?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Fila seleccionable de un formulario. Reemplaza al par radio y casilla de los
 * mockups con una sola zona tocable grande, que es mas facil de usar en el
 * telefono y cumple el minimo de 56 px.
 */
export function Opcion({
  texto,
  activa,
  onPress,
  detalle,
  icono,
  seleccion = 'multiple',
  compacta = false,
  style,
}: PropsOpcion) {
  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.98}
      accessibilityRole={seleccion === 'unica' ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: activa }}
      accessibilityLabel={texto}
      style={[
        {
          minHeight: compacta ? alturaTocable.boton : alturaTocable.principal,
          borderRadius: compacta ? radio.boton : radio.caja,
          paddingHorizontal: compacta ? espacio.normal : espacio.amplio - 2,
          paddingVertical: espacio.comodo,
          flexDirection: 'row',
          alignItems: 'center',
          gap: espacio.medio,
          backgroundColor: activa ? colores.menta : colores.papel,
          borderWidth: activa ? 2 : 1.5,
          borderColor: activa ? colores.verde : colores.borde,
          ...(compacta ? { justifyContent: 'center' } : null),
        },
        style,
      ]}
    >
      {icono === undefined ? null : (
        <Icono nombre={icono} tamano={22} color={activa ? colores.verde : colores.grisTexto} />
      )}
      {compacta ? (
        // La variante compacta no lleva marca ni caja alrededor del texto: si
        // se envuelve en una vista sin ancho, la palabra se parte letra a letra.
        <Texto tamano={16} peso={activa ? 'fuerte' : 'normal'} alineacion="center">
          {texto}
        </Texto>
      ) : (
        <>
          <MarcaDeSeleccion activa={activa} seleccion={seleccion} />
          <View style={{ flex: 1, gap: 2 }}>
            <Texto tamano={16.5} peso={activa ? 'fuerte' : 'normal'}>
              {texto}
            </Texto>
            {detalle === undefined ? null : (
              <Texto tamano={14} color={colores.grisTexto}>
                {detalle}
              </Texto>
            )}
          </View>
        </>
      )}
    </Presionable>
  );
}

/** Circulo o cuadrado de marcado, segun si la seleccion admite varias. */
function MarcaDeSeleccion({
  activa,
  seleccion,
}: {
  activa: boolean;
  seleccion: 'unica' | 'multiple';
}) {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: seleccion === 'unica' ? radio.redondo : 7,
        borderWidth: 2,
        borderColor: activa ? colores.verde : colores.bordeFuerte,
        backgroundColor: activa ? colores.verde : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {activa ? <Icono nombre="visto" tamano={15} color={colores.papel} grosor={3} /> : null}
    </View>
  );
}

/**
 * Casilla suelta, para las lineas de consentimiento que no son una opcion
 * dentro de una lista.
 */
export function Casilla({
  activa,
  onPress,
  children,
}: {
  activa: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.99}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: activa }}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: espacio.medio,
        minHeight: alturaTocable.minima,
        paddingVertical: espacio.normal,
      }}
    >
      <MarcaDeSeleccion activa={activa} seleccion="multiple" />
      <View style={{ flex: 1 }}>{children}</View>
    </Presionable>
  );
}
```

#### `src/componentes/base/Interruptor.tsx`

Switch dibujado a mano. (57 líneas)

```tsx
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { colores } from '@/diseno/colores';
import { radio } from '@/diseno/medidas';
import { usarPreferencias } from '@/estado/preferencias';

type PropsInterruptor = {
  activo: boolean;
  onCambiar: (activo: boolean) => void;
  accesibilidad: string;
};

/**
 * Interruptor de encendido y apagado de los ajustes. Se dibuja a mano en vez de
 * usar el Switch del sistema operativo porque este tiene que verse igual en
 * Android y en iOS, y con los colores del barrio.
 */
export function Interruptor({ activo, onCambiar, accesibilidad }: PropsInterruptor) {
  const { menosAnimaciones } = usarPreferencias();
  const duracion = menosAnimaciones ? 0 : 180;

  const estiloDeCarril = useAnimatedStyle(() => ({
    backgroundColor: withTiming(activo ? colores.verde : colores.bordeFuerte, { duration: duracion }),
  }));

  const estiloDePerilla = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(activo ? 20 : 0, { duration: duracion }) }],
  }));

  return (
    <Pressable
      onPress={() => onCambiar(!activo)}
      accessibilityRole="switch"
      accessibilityState={{ checked: activo }}
      accessibilityLabel={accesibilidad}
      hitSlop={10}
    >
      <Animated.View
        style={[
          { width: 52, height: 32, borderRadius: radio.redondo, padding: 3, justifyContent: 'center' },
          estiloDeCarril,
        ]}
      >
        <Animated.View
          style={[
            { width: 26, height: 26, borderRadius: radio.redondo, backgroundColor: colores.papel },
            estiloDePerilla,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
```

#### `src/componentes/base/Contador.tsx`

Contador de menos y más. (93 líneas)

```tsx
import { View } from 'react-native';

import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';

type PropsContador = {
  valor: number;
  onCambiar: (valor: number) => void;
  minimo?: number;
  maximo?: number;
  /** Nombre de lo que se cuenta, para el lector de pantalla. */
  accesibilidad: string;
};

/**
 * Contador de menos y mas. Se usa para decir cuantas manos voluntarias necesita
 * una propuesta o una actividad.
 */
export function Contador({
  valor,
  onCambiar,
  minimo = 0,
  maximo = 99,
  accesibilidad,
}: PropsContador) {
  return (
    <View
      accessible
      accessibilityLabel={`${accesibilidad}: ${valor}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: espacio.apretado,
        height: alturaTocable.minima,
        paddingHorizontal: espacio.apretado,
        borderWidth: 1.5,
        borderColor: colores.bordeFuerte,
        borderRadius: radio.boton - 2,
      }}
    >
      <BotonDePaso
        signo="−"
        accesibilidad={`Menos ${accesibilidad}`}
        deshabilitado={valor <= minimo}
        onPress={() => onCambiar(Math.max(minimo, valor - 1))}
      />
      <Texto tamano={16} peso="fuerte" alineacion="center" style={{ minWidth: 22 }}>
        {String(valor)}
      </Texto>
      <BotonDePaso
        signo="+"
        accesibilidad={`Más ${accesibilidad}`}
        deshabilitado={valor >= maximo}
        onPress={() => onCambiar(Math.min(maximo, valor + 1))}
      />
    </View>
  );
}

function BotonDePaso({
  signo,
  accesibilidad,
  deshabilitado,
  onPress,
}: {
  signo: string;
  accesibilidad: string;
  deshabilitado: boolean;
  onPress: () => void;
}) {
  return (
    <Presionable
      onPress={deshabilitado ? undefined : onPress}
      escalaAlTocar={0.88}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad}
      accessibilityState={{ disabled: deshabilitado }}
      style={{
        width: 32,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: deshabilitado ? 0.35 : 1,
      }}
    >
      <Texto tamano={20} peso="fuerte">
        {signo}
      </Texto>
    </Presionable>
  );
}
```

#### `src/componentes/base/Lista.tsx`

Lista agrupada, fila de lista y sigla. (153 líneas)

```tsx
import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { Columna } from './Disposicion';
import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';

/** Linea divisoria entre filas de una lista agrupada. */
const COLOR_DIVISORIA = '#EEE7D7';

type PropsLista = {
  children: ReactNode;
  /** Titulo en mayusculas sobre el grupo, como en Ajustes. */
  encabezado?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Tarjeta que agrupa varias filas con una divisoria entre ellas. Es el patron
 * de las pantallas de intereses, capas del mapa, ajustes y perfil.
 */
export function ListaAgrupada({ children, encabezado, style }: PropsLista) {
  return (
    <Columna separacion={espacio.normal} style={style}>
      {encabezado === undefined ? null : (
        <Texto
          tamano={13}
          peso="fuerte"
          color={colores.grisTexto}
          espaciado={0.6}
          style={{ paddingHorizontal: espacio.apretado }}
        >
          {encabezado}
        </Texto>
      )}
      <View
        style={{
          backgroundColor: colores.papel,
          borderWidth: 1,
          borderColor: colores.borde,
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </Columna>
  );
}

type PropsFilaDeLista = {
  titulo: string;
  detalle?: string;
  /** Elemento a la izquierda: una sigla, un icono o una marca de categoria. */
  adorno?: ReactNode;
  /** Elemento a la derecha: un interruptor, un contador o una flecha. */
  control?: ReactNode;
  onPress?: () => void;
  /** La ultima fila del grupo no lleva divisoria. */
  ultima?: boolean;
  /** Muestra la flecha de avanzar cuando la fila abre otra pantalla. */
  conFlecha?: boolean;
  /** Tinta roja para las acciones destructivas de Ajustes. */
  peligrosa?: boolean;
};

export function FilaDeLista({
  titulo,
  detalle,
  adorno,
  control,
  onPress,
  ultima = false,
  conFlecha = false,
  peligrosa = false,
}: PropsFilaDeLista) {
  const contenido = (
    <>
      {adorno}
      <Columna crecer={1} separacion={2}>
        <Texto tamano={16.5} peso="fuerte" color={peligrosa ? colores.alerta : colores.tinta}>
          {titulo}
        </Texto>
        {detalle === undefined ? null : (
          <Texto tamano={13.5} color={colores.grisTexto}>
            {detalle}
          </Texto>
        )}
      </Columna>
      {control}
      {conFlecha ? (
        <Icono nombre="flechaDerecha" tamano={20} color={colores.grisTexto} />
      ) : null}
    </>
  );

  const estilo: StyleProp<ViewStyle> = {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.amplio - 2,
    paddingHorizontal: espacio.amplio,
    paddingVertical: espacio.comodo,
    ...(ultima ? null : { borderBottomWidth: 1, borderBottomColor: COLOR_DIVISORIA }),
  };

  if (onPress === undefined) {
    return <View style={estilo}>{contenido}</View>;
  }

  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.995}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={estilo}
    >
      {contenido}
    </Presionable>
  );
}

/** Cuadro con una sigla de tres letras, como los intereses del registro. */
export function Sigla({
  texto,
  fondo,
  color,
}: {
  texto: string;
  fondo: string;
  color: string;
}) {
  return (
    <View
      style={{
        width: alturaTocable.minima - 4,
        height: alturaTocable.minima - 4,
        borderRadius: radio.boton - 2,
        backgroundColor: fondo,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Texto tamano={13} peso="fuerte" color={color}>
        {texto}
      </Texto>
    </View>
  );
}
```

#### `src/componentes/base/Aviso.tsx`

Nota breve, cuatro tonos. (70 líneas)

```tsx
import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { Icono } from './Icono';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { espacio, radio } from '@/diseno/medidas';

/** Los cuatro tonos de nota que aparecen en los mockups. */
export type TonoAviso = 'informativo' | 'cuidado' | 'logro' | 'neutro';

type PropsAviso = {
  texto?: string;
  children?: ReactNode;
  tono?: TonoAviso;
  icono?: NombreIcono;
  tamanoDeTexto?: number;
  style?: StyleProp<ViewStyle>;
};

const tonos: Record<TonoAviso, { fondo: string; texto: string; icono: NombreIcono }> = {
  informativo: { fondo: '#DCE7F3', texto: '#244C78', icono: 'informacion' },
  cuidado: { fondo: '#F5E6C8', texto: '#6F4A0E', icono: 'ojo' },
  logro: { fondo: colores.menta, texto: '#174D34', icono: 'visto' },
  neutro: { fondo: colores.crema, texto: colores.grisTexto, icono: 'informacion' },
};

/**
 * Nota breve que explica algo o pide cuidado. Siempre lleva icono y texto,
 * nunca solo color, como pide la regla de accesibilidad del sistema.
 */
export function Aviso({
  texto,
  children,
  tono = 'informativo',
  icono,
  tamanoDeTexto = 14,
  style,
}: PropsAviso) {
  const apariencia = tonos[tono];

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: espacio.normal,
          backgroundColor: apariencia.fondo,
          borderRadius: radio.medio,
          paddingVertical: espacio.comodo,
          paddingHorizontal: espacio.medio,
        },
        style,
      ]}
    >
      <Icono nombre={icono ?? apariencia.icono} tamano={18} color={apariencia.texto} />
      <View style={{ flex: 1 }}>
        {texto === undefined ? (
          children
        ) : (
          <Texto tamano={tamanoDeTexto} color={apariencia.texto} interlineado={1.35}>
            {texto}
          </Texto>
        )}
      </View>
    </View>
  );
}
```

#### `src/componentes/base/BarraDePasos.tsx`

Barra de avance por tramos. (75 líneas)

```tsx
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarPreferencias } from '@/estado/preferencias';

type PropsBarraDePasos = {
  paso: number;
  total: number;
  /** Color de los tramos ya recorridos. */
  color?: string;
  /** Color de los tramos que faltan. */
  colorPendiente?: string;
  alto?: number;
};

/**
 * Barra de avance por tramos. Cada tramo es un paso, de modo que la persona ve
 * cuanto falta sin tener que leer el texto, que es lo que pide la regla de "un
 * paso por pantalla" del sistema visual.
 */
export function BarraDePasos({
  paso,
  total,
  color = colores.verde,
  colorPendiente = colores.borde,
  alto = 6,
}: PropsBarraDePasos) {
  const { menosAnimaciones } = usarPreferencias();

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Paso ${paso} de ${total}`}
      style={{ flexDirection: 'row', gap: espacio.apretado }}
    >
      {Array.from({ length: total }, (_, posicion) => (
        <TramoDePaso
          key={posicion}
          recorrido={posicion < paso}
          color={color}
          colorPendiente={colorPendiente}
          alto={alto}
          animar={!menosAnimaciones}
        />
      ))}
    </View>
  );
}

function TramoDePaso({
  recorrido,
  color,
  colorPendiente,
  alto,
  animar,
}: {
  recorrido: boolean;
  color: string;
  colorPendiente: string;
  alto: number;
  animar: boolean;
}) {
  const estiloAnimado = useAnimatedStyle(() => ({
    backgroundColor: animar
      ? withTiming(recorrido ? color : colorPendiente, { duration: 260 })
      : recorrido
        ? color
        : colorPendiente,
  }));

  return <Animated.View style={[{ flex: 1, height: alto, borderRadius: radio.redondo }, estiloAnimado]} />;
}
```

#### `src/componentes/base/BarraInferior.tsx`

Barra fija con la acción principal. (51 líneas)

```tsx
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';

type PropsBarraInferior = {
  children: ReactNode;
  /** Fondo de la barra. Crema en la mayoria, papel sobre listas. */
  fondo?: string;
  separacion?: number;
  /** Deja la barra pegada al borde inferior empujando el contenido de arriba. */
  alFinal?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Barra fija del borde inferior con la accion principal de la pantalla. La
 * mayoria de los flujos la usan para que el boton de continuar quede siempre a
 * la vista, sin importar cuanto se desplace el contenido.
 */
export function BarraInferior({
  children,
  fondo = colores.crema,
  separacion = espacio.comodo,
  alFinal = true,
  style,
}: PropsBarraInferior) {
  const margenes = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          backgroundColor: fondo,
          borderTopWidth: 1,
          borderTopColor: colores.borde,
          paddingHorizontal: espacio.seccion,
          paddingTop: espacio.amplio,
          paddingBottom: Math.max(margenes.bottom, espacio.amplio),
          gap: separacion,
          ...(alFinal ? { marginTop: 'auto' as const } : null),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
```

#### `src/componentes/base/EncabezadoDePaso.tsx`

Cabecera de los flujos de varios pasos. (78 líneas)

```tsx
import { View } from 'react-native';

import { BarraDePasos } from './BarraDePasos';
import { BotonCircular } from './BotonCircular';
import { Presionable } from './Presionable';
import { Texto } from './Texto';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio } from '@/diseno/medidas';

type PropsEncabezadoDePaso = {
  paso: number;
  total: number;
  /** Nombre del paso, por ejemplo "Que pasa". Va junto al contador. */
  nombre?: string;
  onVolver: () => void;
  /** El primer paso cancela el flujo completo en vez de retroceder. */
  esPrimerPaso?: boolean;
  textoDeCancelar?: string;
  /** Enlace para saltarse el paso, como el "Omitir" del registro. */
  onOmitir?: () => void;
};

/**
 * Cabecera comun de los flujos de varios pasos: reportar, proponer y el
 * registro inicial. Muestra siempre "Paso X de Y", que es una de las reglas de
 * accesibilidad del sistema visual.
 */
export function EncabezadoDePaso({
  paso,
  total,
  nombre,
  onVolver,
  esPrimerPaso = false,
  textoDeCancelar = 'Cancelar',
  onOmitir,
}: PropsEncabezadoDePaso) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: espacio.medio,
        paddingHorizontal: espacio.seccion,
        paddingBottom: espacio.corto,
      }}
    >
      <BotonCircular
        icono={esPrimerPaso ? 'cerrar' : 'flechaIzquierda'}
        accesibilidad={esPrimerPaso ? textoDeCancelar : 'Paso anterior'}
        onPress={onVolver}
      />
      <View style={{ flex: 1, gap: espacio.corto }}>
        {nombre === undefined ? null : (
          <Texto tamano={14} peso="fuerte" color={colores.verde}>
            {`Paso ${paso} de ${total} · ${nombre}`}
          </Texto>
        )}
        <BarraDePasos paso={paso} total={total} />
      </View>
      {onOmitir === undefined ? null : (
        <Presionable
          onPress={onOmitir}
          accessibilityRole="button"
          accessibilityLabel="Omitir este paso"
          style={{
            minHeight: alturaTocable.minima,
            justifyContent: 'center',
            paddingHorizontal: espacio.corto,
          }}
        >
          <Texto tamano={16} peso="fuerte" color={colores.grisTexto}>
            Omitir
          </Texto>
        </Presionable>
      )}
    </View>
  );
}
```

#### `src/componentes/base/Pantalla.tsx`

Marco de cada pantalla con márgenes seguros. (58 líneas)

```tsx
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { colores } from '@/diseno/colores';

type PropsPantalla = {
  children: ReactNode;
  /** Color de fondo. Crema para las pantallas normales, bosque para las oscuras. */
  fondo?: string;
  /**
   * Las pantallas de los mockups que miden mas de 844 px de alto se recorren
   * desplazando. Las que caben exactas en el telefono no.
   */
  desplazable?: boolean;
  /** Espacio libre bajo el contenido, para que la barra inferior no lo tape. */
  espacioAlFinal?: number;
  /** Deja el borde inferior libre cuando la pantalla termina en un boton fijo. */
  sinMargenInferior?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Marco de cada pantalla. Resuelve el fondo y el margen que piden la barra de
 * estado y el borde inferior del telefono, que en los mockups aparecen como un
 * relleno fijo de 56 px arriba y 24 abajo.
 */
export function Pantalla({
  children,
  fondo = colores.crema,
  desplazable = false,
  espacioAlFinal = 0,
  sinMargenInferior = false,
  style,
}: PropsPantalla) {
  const margenes = useSafeAreaInsets();
  const arriba = margenes.top + 12;
  const abajo = sinMargenInferior ? 0 : margenes.bottom;

  if (desplazable) {
    return (
      <View style={[{ flex: 1, backgroundColor: fondo }, style]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: arriba, paddingBottom: abajo + espacioAlFinal }}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: fondo, paddingTop: arriba, paddingBottom: abajo }, style]}>
      {children}
    </View>
  );
}
```

### 17.8 Componentes de aplicación · src/componentes/app

#### `src/componentes/app/index.ts`

Punto único de entrada. (21 líneas)

```ts
/**
 * Componentes que ya conocen el dominio del barrio: reportes, propuestas,
 * actividades y el plano. Las pantallas se arman combinando estos con los
 * componentes base.
 */
export { Avatar } from './Avatar';
export { BarraNavegacion } from './BarraNavegacion';
export { Encabezado } from './Encabezado';
export { EtiquetaDeEstado, EtiquetaDeEtapa } from './EtiquetasDeDominio';
export { FotoSimulada } from './FotoSimulada';
export { MapaBarrio, type Ubicador } from './MapaBarrio';
export { LineaDeTiempo } from './LineaDeTiempo';
export { ChipDeCategoria, MarcaDeCategoria, RotuloDeCategoria } from './MarcaDeCategoria';
export { GrupoDeMarcadores, MarcadorMapa, MiUbicacion } from './MarcadorMapa';
export { CuadroDeFecha, FilaDeActividad, TarjetaDeActividad } from './TarjetaActividad';
export { FilaDePropuesta, TarjetaDePropuesta } from './TarjetaPropuesta';
export {
  BarraDeEstadoDeReporte,
  TarjetaDeMiReporte,
  TarjetaDeReporte,
} from './TarjetaReporte';
```

#### `src/componentes/app/Avatar.tsx`

Círculo con la inicial de la persona. (45 líneas)

```tsx
import { View } from 'react-native';

import { Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { radio } from '@/diseno/medidas';
import type { Persona } from '@/dominio/tipos';

type PropsAvatar = {
  persona: Persona;
  tamano?: number;
  /** Aro claro alrededor, como el avatar del encabezado de inicio. */
  conAro?: boolean;
  color?: string;
};

/**
 * Circulo con la inicial de la persona. No hay fotos de perfil en el diseno:
 * se identifica a cada quien por su seudonimo y su vinculo con el barrio.
 */
export function Avatar({ persona, tamano = 40, conAro = false, color }: PropsAvatar) {
  const fondo = color ?? (persona.esOrganizacion ? colores.bosque : colores.verde);
  return (
    <View
      accessible
      accessibilityLabel={persona.nombre}
      style={{
        width: tamano,
        height: tamano,
        borderRadius: radio.redondo,
        backgroundColor: fondo,
        alignItems: 'center',
        justifyContent: 'center',
        ...(conAro ? { borderWidth: 3, borderColor: colores.menta } : null),
      }}
    >
      <Texto
        tamano={persona.inicial.length > 1 ? tamano * 0.34 : tamano * 0.42}
        peso="fuerte"
        color={colores.papel}
      >
        {persona.inicial}
      </Texto>
    </View>
  );
}
```

#### `src/componentes/app/Encabezado.tsx`

Volver, título y acción. (68 líneas)

```tsx
import type { ReactNode } from 'react';

import { BotonCircular, Columna, Fila, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';

type PropsEncabezado = {
  /** Sin titulo el encabezado queda solo con el boton de volver. */
  titulo?: string;
  onVolver?: () => void;
  /** Linea breve bajo el titulo. */
  subtitulo?: string;
  /** Contenido al extremo derecho, por ejemplo un boton de accion. */
  accion?: ReactNode;
  tamanoDeTitulo?: number;
  /** Sobre fondo bosque los botones y el texto se invierten. */
  tono?: 'claro' | 'oscuro';
  textoDeVolver?: string;
};

/**
 * Cabecera de las pantallas de detalle: volver, titulo y, si hace falta, una
 * accion a la derecha.
 */
export function Encabezado({
  titulo,
  onVolver,
  subtitulo,
  accion,
  tamanoDeTitulo = 28,
  tono = 'claro',
  textoDeVolver = 'Volver',
}: PropsEncabezado) {
  const colorDeTexto = tono === 'claro' ? colores.tinta : colores.papel;

  return (
    <Fila
      separacion={espacio.medio}
      alinear="center"
      style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}
    >
      {onVolver === undefined ? null : (
        <BotonCircular
          icono="flechaIzquierda"
          accesibilidad={textoDeVolver}
          onPress={onVolver}
          tono={tono}
        />
      )}
      <Columna crecer={1} separacion={2}>
        {titulo === undefined ? null : (
          <Texto tamano={tamanoDeTitulo} familia="titulo" color={colorDeTexto} interlineado={1.1}>
            {titulo}
          </Texto>
        )}
        {subtitulo === undefined ? null : (
          <Texto
            tamano={14}
            color={tono === 'claro' ? colores.grisTexto : colores.textoTenueSobreBosque}
          >
            {subtitulo}
          </Texto>
        )}
      </Columna>
      {accion}
    </Fila>
  );
}
```

#### `src/componentes/app/BarraNavegacion.tsx`

La barra de cinco destinos con el botón central. (154 líneas)

```tsx
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icono, Presionable, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { espacio, radio, sombras } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';

/**
 * Cinco destinos fijos. Reportar va al centro, grande y con texto, porque es la
 * puerta de entrada de todo el sistema y la historia de usuario mas importante.
 */
const destinos: Record<string, { etiqueta: string; icono: NombreIcono }> = {
  inicio: { etiqueta: 'Inicio', icono: 'casa' },
  mapa: { etiqueta: 'Mapa', icono: 'mapa' },
  reportar: { etiqueta: 'Reportar', icono: 'mas' },
  'mis-reportes': { etiqueta: 'Mis reportes', icono: 'portapapeles' },
  avisos: { etiqueta: 'Avisos', icono: 'campana' },
};

export function BarraNavegacion({ state, navigation }: BottomTabBarProps) {
  const margenes = useSafeAreaInsets();
  const { avisosSinLeer } = usarBarrio();

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Navegación principal"
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: colores.papel,
        borderTopWidth: 1,
        borderTopColor: colores.borde,
        paddingTop: espacio.comodo,
        paddingBottom: Math.max(margenes.bottom, espacio.seccion),
        paddingHorizontal: espacio.apretado,
      }}
    >
      {state.routes.map((ruta, posicion) => {
        const destino = destinos[ruta.name];
        if (destino === undefined) return null;

        const activo = state.index === posicion;
        const esReportar = ruta.name === 'reportar';
        const contador = ruta.name === 'avisos' ? avisosSinLeer : 0;

        return (
          <Presionable
            key={ruta.key}
            onPress={() => navigation.navigate(ruta.name)}
            escalaAlTocar={esReportar ? 0.93 : 0.96}
            vibrar={esReportar}
            accessibilityRole="tab"
            accessibilityState={{ selected: activo }}
            accessibilityLabel={
              contador > 0 ? `${destino.etiqueta}, ${contador} sin leer` : destino.etiqueta
            }
            style={{ flex: 1, alignItems: 'center', gap: espacio.apretado }}
          >
            {esReportar ? (
              <BotonCentral />
            ) : (
              <Pastilla activo={activo} icono={destino.icono} contador={contador} />
            )}
            <Texto
              tamano={12.5}
              peso={activo || esReportar ? 'fuerte' : 'normal'}
              color={esReportar ? colores.bosque : activo ? colores.verde : colores.grisTexto}
            >
              {destino.etiqueta}
            </Texto>
          </Presionable>
        );
      })}
    </View>
  );
}

/** Icono con la pastilla verde que marca el destino actual. */
function Pastilla({
  activo,
  icono,
  contador,
}: {
  activo: boolean;
  icono: NombreIcono;
  contador: number;
}) {
  return (
    <View
      style={{
        width: 52,
        height: 30,
        borderRadius: radio.redondo,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: activo ? colores.menta : 'transparent',
      }}
    >
      <Icono nombre={icono} tamano={22} color={activo ? colores.verde : colores.grisTexto} />
      {contador > 0 ? <ContadorDeAvisos cantidad={contador} /> : null}
    </View>
  );
}

function ContadorDeAvisos({ cantidad }: { cantidad: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 10,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        paddingHorizontal: espacio.apretado,
        backgroundColor: colores.alerta,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Texto tamano={11} peso="fuerte" color={colores.blanco}>
        {String(cantidad)}
      </Texto>
    </View>
  );
}

/** Boton redondo de reportar, que sobresale por encima de la barra. */
function BotonCentral() {
  return (
    <View
      style={[
        {
          width: 58,
          height: 58,
          marginTop: -30,
          borderRadius: radio.redondo,
          backgroundColor: colores.verde,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 4,
          borderColor: colores.papel,
        },
        sombras.media,
      ]}
    >
      <Icono nombre="mas" tamano={28} color={colores.blanco} grosor={2.4} />
    </View>
  );
}
```

#### `src/componentes/app/MarcaDeCategoria.tsx`

Marca, rótulo y chip de categoría. (95 líneas)

```tsx
import { View } from 'react-native';

import { Fila, Icono, Texto } from '@/componentes/base';
import { categorias, type IdCategoria } from '@/dominio/categorias';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';

type PropsMarcaDeCategoria = {
  categoria: IdCategoria;
  /** Lado del cuadrado de color. */
  tamano?: number;
  /** Radio de esquina. Los cuadros grandes del formulario usan 13. */
  redondeo?: number;
};

/**
 * Cuadrado de color con el icono de la categoria. Es la pieza que identifica a
 * que corresponde un reporte en el feed, el mapa y las listas.
 */
export function MarcaDeCategoria({
  categoria,
  tamano = 24,
  redondeo = radio.chico,
}: PropsMarcaDeCategoria) {
  const datos = categorias[categoria];
  return (
    <View
      style={{
        width: tamano,
        height: tamano,
        borderRadius: redondeo,
        backgroundColor: datos.color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icono nombre={datos.icono} tamano={tamano * 0.62} color="#FFFFFF" />
    </View>
  );
}

/**
 * Marca de categoria con su nombre en mayusculas al lado, como encabeza cada
 * tarjeta de reporte.
 */
export function RotuloDeCategoria({
  categoria,
  detalle,
  tamanoDeTexto = 13.5,
}: {
  categoria: IdCategoria;
  /** Texto adicional separado por punto medio, por ejemplo "MICROBASURAL". */
  detalle?: string;
  tamanoDeTexto?: number;
}) {
  const datos = categorias[categoria];
  return (
    <Fila separacion={espacio.normal}>
      <MarcaDeCategoria categoria={categoria} />
      <Texto tamano={tamanoDeTexto} peso="fuerte" color={datos.color}>
        {detalle === undefined
          ? datos.etiquetaTarjeta
          : `${datos.etiquetaTarjeta} · ${detalle.toUpperCase()}`}
      </Texto>
    </Fila>
  );
}

/**
 * Pildora con la categoria ya elegida. Acompana a los pasos siguientes del
 * asistente para que siempre se vea sobre que se esta reportando.
 */
export function ChipDeCategoria({ categoria }: { categoria: IdCategoria }) {
  const datos = categorias[categoria];
  return (
    <Fila
      separacion={espacio.normal}
      style={{
        alignSelf: 'flex-start',
        height: 34,
        paddingLeft: espacio.corto,
        paddingRight: espacio.medio,
        borderRadius: radio.redondo,
        backgroundColor: colores.papel,
        borderWidth: 1,
        borderColor: colores.borde,
      }}
    >
      <MarcaDeCategoria categoria={categoria} />
      <Texto tamano={14} peso="fuerte">
        {datos.etiqueta}
      </Texto>
    </Fila>
  );
}
```

#### `src/componentes/app/EtiquetasDeDominio.tsx`

Píldoras de estado y de etapa. (51 líneas)

```tsx
import { Etiqueta } from '@/componentes/base';
import { estados, etapas, type IdEstado, type IdEtapa } from '@/dominio/estados';

/**
 * Pildoras de estado y de etapa. Envuelven a Etiqueta para que ninguna pantalla
 * tenga que acordarse de los colores de cada estado.
 */

export function EtiquetaDeEstado({
  estado,
  alto,
  tamanoDeTexto,
}: {
  estado: IdEstado;
  alto?: number;
  tamanoDeTexto?: number;
}) {
  const datos = estados[estado];
  return (
    <Etiqueta
      texto={datos.etiqueta}
      fondo={datos.fondo}
      color={datos.texto}
      punto={datos.punto}
      icono={datos.icono}
      alto={alto}
      tamanoDeTexto={tamanoDeTexto}
    />
  );
}

export function EtiquetaDeEtapa({
  etapa,
  alto,
  tamanoDeTexto,
}: {
  etapa: IdEtapa;
  alto?: number;
  tamanoDeTexto?: number;
}) {
  const datos = etapas[etapa];
  return (
    <Etiqueta
      texto={datos.etiqueta}
      fondo={datos.fondo}
      color={datos.texto}
      alto={alto}
      tamanoDeTexto={tamanoDeTexto}
    />
  );
}
```

#### `src/componentes/app/TarjetaReporte.tsx`

Barra de estado y las dos tarjetas de reporte. (159 líneas)

```tsx
import { View } from 'react-native';

import { EtiquetaDeEstado } from './EtiquetasDeDominio';
import { FotoSimulada } from './FotoSimulada';
import { MarcaDeCategoria, RotuloDeCategoria } from './MarcaDeCategoria';
import { Columna, Etiqueta, Fila, Tarjeta, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { estados, totalDePasosDeEstado } from '@/dominio/estados';
import type { Reporte } from '@/dominio/tipos';
import { pluralizar } from '@/utiles/texto';

/**
 * Barra de avance de un reporte.
 *
 * Los tramos ya recorridos van en verde y el actual toma el color de su propio
 * estado, de modo que el color refuerza lo que dice la palabra sin reemplazarla.
 */
export function BarraDeEstadoDeReporte({
  estado,
  sobreBosque = false,
}: {
  estado: Reporte['estado'];
  /** Sobre fondo oscuro los verdes y el gris de pendiente no contrastan. */
  sobreBosque?: boolean;
}) {
  const pasoActual = estados[estado].paso;
  const colorRecorrido = sobreBosque ? colores.brote : colores.verde;
  const colorPendiente = sobreBosque ? colores.bosqueBarra : colores.borde;

  return (
    <Fila separacion={espacio.apretado} accesibilidad={`${estados[estado].etiqueta}, paso ${pasoActual} de ${totalDePasosDeEstado}`}>
      {Array.from({ length: totalDePasosDeEstado }, (_, posicion) => {
        const numeroDeTramo = posicion + 1;
        const colorActual = sobreBosque
          ? (estados[estado].id === 'gestion' ? colores.ambarSobreBosque : colorRecorrido)
          : (estados[estado].punto ?? colores.verde);
        const color =
          numeroDeTramo < pasoActual
            ? colorRecorrido
            : numeroDeTramo === pasoActual
              ? colorActual
              : colorPendiente;
        return (
          <View
            key={numeroDeTramo}
            style={{ flex: 1, height: 6, borderRadius: radio.redondo, backgroundColor: color }}
          />
        );
      })}
    </Fila>
  );
}

/**
 * Reporte en la lista "Mis reportes": el titulo, cuando se envio, la barra de
 * avance y cuantos vecinos lo confirman.
 */
export function TarjetaDeMiReporte({
  reporte,
  conNovedad = false,
  onPress,
}: {
  reporte: Reporte;
  /** Punto rojo cuando hubo un cambio que la persona todavia no vio. */
  conNovedad?: boolean;
  onPress: () => void;
}) {
  const pasoActual = estados[reporte.estado].paso;

  return (
    <Tarjeta
      onPress={onPress}
      accesibilidad={reporte.titulo}
      relleno={espacio.amplio - 2}
      separacion={espacio.medio}
      style={{ borderRadius: 20 }}
    >
      <Fila separacion={espacio.medio} alinear="flex-start">
        <MarcaDeCategoria categoria={reporte.categoria} tamano={40} redondeo={radio.boton - 2} />
        <Columna crecer={1} separacion={2}>
          <Texto tamano={16.5} peso="fuerte">
            {reporte.titulo}
          </Texto>
          <Texto tamano={14} color={colores.grisTexto}>
            {reporte.resumen}
          </Texto>
        </Columna>
        {conNovedad ? (
          <View
            accessible
            accessibilityLabel="Novedad"
            style={{
              width: 10,
              height: 10,
              borderRadius: radio.redondo,
              backgroundColor: colores.alerta,
              marginTop: espacio.corto,
            }}
          />
        ) : null}
      </Fila>

      <BarraDeEstadoDeReporte estado={reporte.estado} />

      <Fila repartir="space-between">
        <Etiqueta
          texto={`${estados[reporte.estado].etiqueta} · paso ${pasoActual} de ${totalDePasosDeEstado}`}
          fondo={estados[reporte.estado].fondo}
          color={estados[reporte.estado].texto}
          punto={estados[reporte.estado].punto}
          icono={estados[reporte.estado].icono}
        />
        <Texto tamano={14} color={colores.grisTexto}>
          {reporte.estado === 'recibido' && reporte.confirmaciones === 0
            ? 'Esperando confirmaciones'
            : `${reporte.confirmaciones} ${pluralizar(reporte.confirmaciones, 'confirma', 'confirman')}`}
        </Texto>
      </Fila>
    </Tarjeta>
  );
}

/**
 * Reporte en el feed del inicio y en los listados publicos. Lleva la foto
 * arriba cuando existe, porque es lo que hace reconocible el lugar.
 */
export function TarjetaDeReporte({
  reporte,
  onPress,
}: {
  reporte: Reporte;
  onPress: () => void;
}) {
  return (
    <Tarjeta onPress={onPress} accesibilidad={reporte.titulo} recortar>
      {reporte.tieneFoto ? <FotoSimulada alto={120} /> : null}
      <Columna
        separacion={espacio.normal}
        style={{
          paddingTop: espacio.amplio - 2,
          paddingHorizontal: espacio.amplio,
          paddingBottom: espacio.amplio,
        }}
      >
        <Fila repartir="space-between">
          <RotuloDeCategoria categoria={reporte.categoria} />
          <EtiquetaDeEstado estado={reporte.estado} />
        </Fila>
        <Texto tamano={17} peso="fuerte">
          {reporte.titulo}
        </Texto>
        <Texto tamano={14} color={colores.grisTexto}>
          {reporte.resumen}
        </Texto>
      </Columna>
    </Tarjeta>
  );
}
```

#### `src/componentes/app/TarjetaPropuesta.tsx`

Tarjeta y fila de propuesta. (119 líneas)

```tsx
import { EtiquetaDeEtapa } from './EtiquetasDeDominio';
import { Aviso, Boton, Columna, Fila, Icono, Tarjeta, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import type { Propuesta } from '@/dominio/tipos';

type PropsTarjetaPropuesta = {
  propuesta: Propuesta;
  onPress: () => void;
  onApoyar: () => void;
  onOpinar: () => void;
  /** Frase de apoyo institucional que se muestra en el feed del inicio. */
  notaDeApoyo?: string;
};

/**
 * Propuesta tal como aparece en el feed: quien la hizo, en que etapa va y los
 * dos botones que importan, apoyar y opinar.
 */
export function TarjetaDePropuesta({
  propuesta,
  onPress,
  onApoyar,
  onOpinar,
  notaDeApoyo,
}: PropsTarjetaPropuesta) {
  return (
    <Tarjeta>
      <Fila repartir="space-between" separacion={espacio.normal}>
        <Fila separacion={espacio.corto}>
          <Icono nombre="idea" tamano={17} color={colores.verde} />
          <Texto tamano={13.5} peso="fuerte" color={colores.verde}>
            PROPUESTA
          </Texto>
        </Fila>
        <EtiquetaDeEtapa etapa={propuesta.etapa} />
      </Fila>

      <Texto tamano={18} peso="fuerte" interlineado={1.3} onPress={onPress}>
        {propuesta.titulo}
      </Texto>

      <Texto tamano={14.5} color={colores.grisTexto}>
        {`${propuesta.autor.nombre} · ${propuesta.autor.vinculo}${
          propuesta.respondeA === undefined ? '' : ` · Responde a ${propuesta.respondeA}`
        }`}
      </Texto>

      {notaDeApoyo === undefined ? null : (
        <Aviso tono="logro" icono="birrete" texto={notaDeApoyo} />
      )}

      <Fila separacion={espacio.comodo}>
        <Boton
          texto={`${propuesta.apoyadaPorMi ? 'Apoyada' : 'Apoyar'} · ${propuesta.apoyos}`}
          icono="pulgarArriba"
          variante={propuesta.apoyadaPorMi ? 'tonal' : 'principal'}
          alto={46}
          tamanoDeTexto={15.5}
          onPress={onApoyar}
          vibrar
          style={{ flex: 1 }}
        />
        <Boton
          texto={`Opinar · ${propuesta.comentarios.length}`}
          icono="globoDialogo"
          variante="secundaria"
          alto={46}
          tamanoDeTexto={15.5}
          onPress={onOpinar}
          style={{ flex: 1 }}
        />
      </Fila>
    </Tarjeta>
  );
}

/**
 * Propuesta en la lista ordenada por prioridad comunitaria. Lleva su numero de
 * orden al lado, que es lo que comunica la priorizacion.
 */
export function FilaDePropuesta({
  propuesta,
  orden,
  onPress,
}: {
  propuesta: Propuesta;
  orden: number;
  onPress: () => void;
}) {
  return (
    <Tarjeta onPress={onPress} accesibilidad={propuesta.titulo} separacion={espacio.normal}>
      <Fila separacion={espacio.medio} alinear="flex-start">
        <Texto tamano={22} familia="titulo" color={colores.bordeFuerte}>
          {String(orden)}
        </Texto>
        <Columna crecer={1} separacion={espacio.normal}>
          <Fila separacion={espacio.corto}>
            <EtiquetaDeEtapa etapa={propuesta.etapa} alto={26} tamanoDeTexto={12.5} />
            <Texto tamano={13} color={colores.grisTexto}>
              {propuesta.eje}
            </Texto>
          </Fila>
          <Texto tamano={17} peso="fuerte" interlineado={1.3}>
            {propuesta.titulo}
          </Texto>
          <Texto tamano={14} color={colores.grisTexto}>
            {`${propuesta.apoyos} apoyos · ${propuesta.reportesQueResuelve} reportes · ${propuesta.comentarios.length} opiniones`}
          </Texto>
          {propuesta.necesita.length === 0 ? null : (
            <Texto tamano={14} color={colores.grisTexto}>
              {`Busca: ${propuesta.necesita.map((apoyo) => apoyo.titulo.toLowerCase()).join(' · ')}`}
            </Texto>
          )}
        </Columna>
      </Fila>
    </Tarjeta>
  );
}
```

#### `src/componentes/app/TarjetaActividad.tsx`

Cuadro de fecha, tarjeta y fila de actividad. (129 líneas)

```tsx
import { View } from 'react-native';

import { Boton, Columna, Fila, Tarjeta, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import type { Actividad } from '@/dominio/tipos';

/** Cuadro con la fecha que identifica a cada actividad. */
export function CuadroDeFecha({
  actividad,
  ancho = 64,
  tono = 'calido',
}: {
  actividad: Actividad;
  ancho?: number;
  tono?: 'calido' | 'menta';
}) {
  const esCalido = tono === 'calido';
  return (
    <View
      accessible
      accessibilityLabel={`${actividad.diaSemana} ${actividad.dia} de ${actividad.mes}`}
      style={{
        width: ancho,
        borderRadius: radio.caja,
        backgroundColor: esCalido ? '#F5E6C8' : colores.menta,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: espacio.normal,
      }}
    >
      <Texto tamano={13} peso="fuerte" color={esCalido ? '#6F4A0E' : '#174D34'}>
        {actividad.diaSemana}
      </Texto>
      <Texto
        tamano={28}
        familia="titulo"
        color={esCalido ? '#6F4A0E' : '#174D34'}
        interlineado={1}
      >
        {String(actividad.dia)}
      </Texto>
      <Texto tamano={13} peso="fuerte" color={esCalido ? '#6F4A0E' : '#174D34'}>
        {actividad.mes}
      </Texto>
    </View>
  );
}

/**
 * Actividad en el feed y en la lista: la fecha a la izquierda y la invitacion a
 * sumarse a la derecha.
 */
export function TarjetaDeActividad({
  actividad,
  onPress,
  onSumarse,
}: {
  actividad: Actividad;
  onPress: () => void;
  onSumarse?: () => void;
}) {
  const faltan = actividad.voluntariosNecesarios - actividad.voluntarios;

  return (
    <Tarjeta separacion={espacio.amplio - 2} style={{ flexDirection: 'row' }}>
      <CuadroDeFecha actividad={actividad} />
      <Columna crecer={1} separacion={espacio.corto}>
        <Texto tamano={13.5} peso="fuerte" color="#8A5A12">
          {`ACTIVIDAD · ${actividad.hora}`}
        </Texto>
        <Texto tamano={17} peso="fuerte" interlineado={1.3} onPress={onPress}>
          {actividad.titulo}
        </Texto>
        <Texto tamano={14} color={colores.grisTexto}>
          {faltan > 0
            ? `${actividad.inscritos} inscritos · faltan ${faltan} voluntarios`
            : `${actividad.inscritos} inscritos`}
        </Texto>
        <Boton
          texto={actividad.miInscripcion === null ? 'Me sumo' : 'Ya me sumé'}
          variante="tonal"
          alto={44}
          tamanoDeTexto={15}
          ancho="contenido"
          onPress={onSumarse ?? onPress}
          style={{ marginTop: espacio.minimo }}
        />
      </Columna>
    </Tarjeta>
  );
}

/** Version compacta de la lista de actividades, sin boton. */
export function FilaDeActividad({
  actividad,
  onPress,
}: {
  actividad: Actividad;
  onPress: () => void;
}) {
  return (
    <Tarjeta
      onPress={onPress}
      accesibilidad={actividad.titulo}
      separacion={espacio.medio}
      style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      <CuadroDeFecha
        actividad={actividad}
        ancho={56}
        tono={actividad.miInscripcion === null ? 'calido' : 'menta'}
      />
      <Columna crecer={1} separacion={espacio.apretado}>
        <Fila separacion={espacio.corto}>
          <Texto tamano={13.5} peso="fuerte" color="#8A5A12">
            {actividad.hora}
          </Texto>
        </Fila>
        <Texto tamano={16.5} peso="fuerte" interlineado={1.25}>
          {actividad.titulo}
        </Texto>
        <Texto tamano={14} color={colores.grisTexto}>
          {actividad.lugar}
        </Texto>
      </Columna>
    </Tarjeta>
  );
}
```

#### `src/componentes/app/LineaDeTiempo.tsx`

El recorrido de un reporte. (111 líneas)

```tsx
import { View } from 'react-native';

import { Columna, Fila, Icono, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { estados } from '@/dominio/estados';
import type { EventoDeSeguimiento, Reporte } from '@/dominio/tipos';

/**
 * Recorrido de un reporte, de Recibido a Resuelto.
 *
 * Los pasos que todavia no ocurren se muestran igual, apagados y con la frase
 * que explica que va a pasar en cada uno. Que el vecino sepa de antemano como
 * sigue el proceso es parte de la promesa de la aplicacion.
 */
export function LineaDeTiempo({ reporte }: { reporte: Reporte }) {
  const estadoActual = estados[reporte.estado];

  return (
    <Columna>
      {reporte.seguimiento.map((evento, posicion) => (
        <PasoDeLaLinea
          key={evento.estado}
          evento={evento}
          esElActual={evento.estado === reporte.estado}
          colorActual={estadoActual.punto ?? colores.verde}
          fondoActual={estadoActual.fondo}
          esElUltimo={posicion === reporte.seguimiento.length - 1}
        />
      ))}
    </Columna>
  );
}

function PasoDeLaLinea({
  evento,
  esElActual,
  colorActual,
  fondoActual,
  esElUltimo,
}: {
  evento: EventoDeSeguimiento;
  esElActual: boolean;
  colorActual: string;
  fondoActual: string;
  esElUltimo: boolean;
}) {
  const datos = estados[evento.estado];

  return (
    <Fila separacion={14} alinear="stretch">
      <Columna alinear="center">
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: radio.redondo,
            alignItems: 'center',
            justifyContent: 'center',
            ...(evento.ocurrio
              ? {
                  backgroundColor: esElActual ? colorActual : colores.verde,
                  ...(esElActual ? { borderWidth: 5, borderColor: fondoActual } : null),
                }
              : {
                  backgroundColor: colores.papel,
                  borderWidth: 2.5,
                  borderColor: colores.bordeFuerte,
                }),
          }}
        >
          {evento.ocurrio ? (
            <Icono nombre="visto" tamano={16} color={colores.blanco} grosor={2.8} />
          ) : null}
        </View>
        {esElUltimo ? null : (
          <View
            style={{
              flex: 1,
              width: 3,
              minHeight: 22,
              backgroundColor: evento.ocurrio && !esElActual ? colores.verde : colores.borde,
            }}
          />
        )}
      </Columna>

      <Columna
        crecer={1}
        separacion={espacio.minimo}
        style={{ paddingBottom: esElUltimo ? 0 : espacio.amplio }}
      >
        <Texto
          tamano={16.5}
          peso="fuerte"
          color={evento.ocurrio ? colores.tinta : colores.grisTexto}
        >
          {datos.etiqueta}
          {esElActual ? (
            <Texto tamano={16.5} color={colorActual}>
              {' · ahora'}
            </Texto>
          ) : null}
        </Texto>
        <Texto tamano={14} color={colores.grisTexto} interlineado={1.35}>
          {evento.fecha === undefined ? evento.detalle : `${evento.fecha} · ${evento.detalle}`}
        </Texto>
      </Columna>
    </Fila>
  );
}
```

#### `src/componentes/app/MapaBarrio.tsx`

El plano del barrio dibujado en SVG. (362 líneas)

```tsx
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Image,
  PanResponder,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Presionable, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio, sombras } from '@/diseno/medidas';
import {
  CENTRO_DEL_BARRIO,
  MARGEN_FUERA_DEL_BARRIO,
  RECUADRO_DEL_BARRIO,
  ZOOM_DEL_BARRIO,
  ZOOM_MAXIMO,
  ZOOM_MINIMO,
} from '@/dominio/barrio';
import type { PuntoEnMapa, RecuadroDelMapa } from '@/dominio/tipos';
import { LADO_DE_TESELA, aCoordenada, aPixeles, direccionDeTesela } from '@/utiles/geografia';

/** Convierte un punto del mapa a la posicion que ocupa en la pantalla. */
export type Ubicador = (punto: PuntoEnMapa, tamanoDelMarcador: number) => ViewStyle;

type PropsMapaBarrio = {
  /** Recibe el ubicador para colocar marcadores encima del mapa. */
  children?: (ubicar: Ubicador) => ReactNode;
  style?: StyleProp<ViewStyle>;
  centro?: PuntoEnMapa;
  zoom?: number;
  /** Avisa donde quedo el centro al terminar un arrastre. */
  alMoverse?: (centro: PuntoEnMapa) => void;
  /**
   * Avisa que area quedo a la vista, para que la pantalla pida a la base solo
   * los elementos que entran ahi.
   *
   * Tiene que venir envuelta en useCallback: se llama desde un efecto que
   * depende de ella, y una funcion nueva en cada render haria un ciclo.
   */
  alCambiarElArea?: (recuadro: RecuadroDelMapa, zoom: number) => void;
  /** Las fichas muestran el mapa como ilustracion y no se arrastran. */
  interactivo?: boolean;
};

type Arrastre = {
  x: number;
  y: number;
};

const SIN_ARRASTRE: Arrastre = { x: 0, y: 0 };

/** Cuanto hay que mover el dedo antes de que el gesto cuente como arrastre. */
const UMBRAL_DE_ARRASTRE = 3;

/**
 * Mapa del barrio sobre teselas de OpenStreetMap.
 *
 * Las teselas se dibujan con el componente Image y la proyeccion se calcula a
 * mano, sin libreria de mapas. Es deliberado: el proyecto no usa librerias de
 * interfaz de terceros, y una libreria de mapas obligaria a un development
 * build, lo que dejaria fuera el flujo de Expo Go y el navegador, que son las
 * dos formas en que hoy se muestra el prototipo.
 *
 * Los marcadores siguen viviendo fuera, como componentes de React Native
 * encima del mapa, y reciben su posicion por el ubicador. Por eso el cambio de
 * plano dibujado a mapa real no toco ninguno de ellos.
 */
export function MapaBarrio({
  children,
  style,
  centro: centroInicial = CENTRO_DEL_BARRIO,
  zoom: zoomInicial = ZOOM_DEL_BARRIO,
  alMoverse,
  alCambiarElArea,
  interactivo = true,
}: PropsMapaBarrio) {
  const [medida, setMedida] = useState({ ancho: 390, alto: 844 });
  const [centro, setCentro] = useState<PuntoEnMapa>(centroInicial);
  const [arrastre, setArrastre] = useState<Arrastre>(SIN_ARRASTRE);
  const [zoom, setZoom] = useState(zoomInicial);

  // El gesto necesita leer el centro y el zoom vigentes sin volver a crearse en
  // cada render, porque recrear el PanResponder a mitad de un arrastre corta el
  // movimiento.
  const vigente = useRef({ centro, zoom });
  vigente.current = { centro, zoom };

  function alMedir(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    setMedida({ ancho: width, alto: height });
  }

  const gesto = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_evento, estado) =>
          interactivo &&
          (Math.abs(estado.dx) > UMBRAL_DE_ARRASTRE || Math.abs(estado.dy) > UMBRAL_DE_ARRASTRE),
        onPanResponderMove: (_evento, estado) => {
          setArrastre({ x: estado.dx, y: estado.dy });
        },
        onPanResponderRelease: (_evento, estado) => {
          const { centro: centroVigente, zoom: zoomVigente } = vigente.current;
          const pixeles = aPixeles(centroVigente, zoomVigente);
          const movido = aCoordenada(
            { x: pixeles.x - estado.dx, y: pixeles.y - estado.dy },
            zoomVigente,
          );
          const limitado = dentroDelBarrio(movido);
          setCentro(limitado);
          setArrastre(SIN_ARRASTRE);
          alMoverse?.(limitado);
        },
        onPanResponderTerminate: () => setArrastre(SIN_ARRASTRE),
      }),
    [interactivo, alMoverse],
  );

  const centroEnPixeles = aPixeles(centro, zoom);
  const izquierdaDelMundo = centroEnPixeles.x - arrastre.x - medida.ancho / 2;
  const arribaDelMundo = centroEnPixeles.y - arrastre.y - medida.alto / 2;

  const ubicar: Ubicador = (punto, tamanoDelMarcador) => {
    const pixeles = aPixeles(punto, zoom);
    return {
      position: 'absolute',
      left: pixeles.x - izquierdaDelMundo - tamanoDelMarcador / 2,
      top: pixeles.y - arribaDelMundo - tamanoDelMarcador / 2,
    };
  };

  const teselas = teselasVisibles(izquierdaDelMundo, arribaDelMundo, medida, zoom);

  // Se avisa al terminar el gesto y no durante, porque arrastrar dispararia
  // una consulta por cada fotograma.
  useEffect(() => {
    if (alCambiarElArea === undefined) return;
    alCambiarElArea(areaALaVista(centro, zoom, medida), zoom);
  }, [alCambiarElArea, centro, zoom, medida]);

  function cambiarZoom(paso: number) {
    setZoom((actual) => Math.min(ZOOM_MAXIMO, Math.max(ZOOM_MINIMO, actual + paso)));
  }

  return (
    <View
      onLayout={alMedir}
      style={[{ flex: 1, backgroundColor: colores.mapaFondo, overflow: 'hidden' }, style]}
      {...gesto.panHandlers}
    >
      {teselas.map((tesela) => (
        <Image
          key={`${tesela.zoom}-${tesela.columna}-${tesela.fila}`}
          source={{ uri: direccionDeTesela(tesela.columna, tesela.fila, tesela.zoom) }}
          style={{
            position: 'absolute',
            left: tesela.izquierda,
            top: tesela.arriba,
            width: LADO_DE_TESELA,
            height: LADO_DE_TESELA,
          }}
          // El mapa es decorativo para el lector de pantalla: lo que importa
          // son los marcadores, que si se anuncian uno por uno.
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ))}

      {children?.(ubicar)}

      {interactivo ? <ControlesDeZoom alCambiar={cambiarZoom} zoom={zoom} /> : null}

      <Atribucion />
    </View>
  );
}

/** Los cuatro bordes de lo que cabe en pantalla con este centro y este zoom. */
function areaALaVista(
  centro: PuntoEnMapa,
  zoom: number,
  medida: { ancho: number; alto: number },
): RecuadroDelMapa {
  const centroEnPixeles = aPixeles(centro, zoom);
  const noroeste = aCoordenada(
    { x: centroEnPixeles.x - medida.ancho / 2, y: centroEnPixeles.y - medida.alto / 2 },
    zoom,
  );
  const sureste = aCoordenada(
    { x: centroEnPixeles.x + medida.ancho / 2, y: centroEnPixeles.y + medida.alto / 2 },
    zoom,
  );
  return {
    norte: noroeste.latitud,
    oeste: noroeste.longitud,
    sur: sureste.latitud,
    este: sureste.longitud,
  };
}

/** Deja el centro dentro del barrio, con holgura para asomarse al borde. */
function dentroDelBarrio(punto: PuntoEnMapa): PuntoEnMapa {
  const margen = MARGEN_FUERA_DEL_BARRIO;
  return {
    latitud: Math.min(
      RECUADRO_DEL_BARRIO.norte + margen,
      Math.max(RECUADRO_DEL_BARRIO.sur - margen, punto.latitud),
    ),
    longitud: Math.min(
      RECUADRO_DEL_BARRIO.este + margen,
      Math.max(RECUADRO_DEL_BARRIO.oeste - margen, punto.longitud),
    ),
  };
}

type TeselaDibujada = {
  columna: number;
  fila: number;
  zoom: number;
  izquierda: number;
  arriba: number;
};

/** Las teselas que alcanzan a verse en el recuadro visible, y donde van. */
function teselasVisibles(
  izquierdaDelMundo: number,
  arribaDelMundo: number,
  medida: { ancho: number; alto: number },
  zoom: number,
): TeselaDibujada[] {
  const ultima = 2 ** zoom - 1;
  const primeraColumna = Math.floor(izquierdaDelMundo / LADO_DE_TESELA);
  const ultimaColumna = Math.floor((izquierdaDelMundo + medida.ancho) / LADO_DE_TESELA);
  const primeraFila = Math.floor(arribaDelMundo / LADO_DE_TESELA);
  const ultimaFila = Math.floor((arribaDelMundo + medida.alto) / LADO_DE_TESELA);

  const dibujadas: TeselaDibujada[] = [];
  for (let columna = primeraColumna; columna <= ultimaColumna; columna += 1) {
    for (let fila = primeraFila; fila <= ultimaFila; fila += 1) {
      // Arriba y abajo el mundo se acaba, asi que esas filas no existen. A los
      // lados en cambio da la vuelta, aunque en el barrio no llegue a pasar.
      if (fila < 0 || fila > ultima) continue;
      dibujadas.push({
        columna: ((columna % (ultima + 1)) + ultima + 1) % (ultima + 1),
        fila,
        zoom,
        izquierda: columna * LADO_DE_TESELA - izquierdaDelMundo,
        arriba: fila * LADO_DE_TESELA - arribaDelMundo,
      });
    }
  }
  return dibujadas;
}

/** Botones de acercar y alejar, apilados como en los mockups. */
function ControlesDeZoom({
  alCambiar,
  zoom,
}: {
  alCambiar: (paso: number) => void;
  zoom: number;
}) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          right: espacio.amplio,
          top: '40%',
          borderRadius: radio.caja,
          backgroundColor: colores.papel,
          overflow: 'hidden',
        },
        sombras.flotante,
      ]}
    >
      <BotonDeZoom
        accesibilidad="Acercar el mapa"
        activo={zoom < ZOOM_MAXIMO}
        onPress={() => alCambiar(1)}
      >
        <View style={barraDeZoom} />
        <View style={[barraDeZoom, { position: 'absolute', transform: [{ rotate: '90deg' }] }]} />
      </BotonDeZoom>
      <View style={{ height: 1, backgroundColor: colores.mapaLimite }} />
      <BotonDeZoom
        accesibilidad="Alejar el mapa"
        activo={zoom > ZOOM_MINIMO}
        onPress={() => alCambiar(-1)}
      >
        <View style={barraDeZoom} />
      </BotonDeZoom>
    </View>
  );
}

const barraDeZoom: ViewStyle = {
  width: 16,
  height: 2.5,
  borderRadius: 2,
  backgroundColor: colores.verde,
};

function BotonDeZoom({
  children,
  accesibilidad,
  activo,
  onPress,
}: {
  children: ReactNode;
  accesibilidad: string;
  activo: boolean;
  onPress: () => void;
}) {
  return (
    <Presionable
      onPress={activo ? onPress : undefined}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad}
      accessibilityState={{ disabled: !activo }}
      style={{
        // Las zonas tocables del sistema visual no bajan de 44.
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: activo ? 1 : 0.35,
      }}
    >
      {children}
    </Presionable>
  );
}

/**
 * Atribucion de OpenStreetMap. No es decorativa: la licencia de los datos
 * obliga a mostrarla en cualquier vista que use sus teselas.
 */
function Atribucion() {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        paddingHorizontal: espacio.corto,
        paddingVertical: 2,
        borderTopRightRadius: radio.boton - 2,
        backgroundColor: 'rgba(255,255,255,0.78)',
      }}
    >
      <Texto tamano={10.5} color={colores.mapaTexto}>
        © OpenStreetMap
      </Texto>
    </View>
  );
}
```

#### `src/componentes/app/MarcadorMapa.tsx`

Chincheta, grupo y mi ubicación. (137 líneas)

```tsx
import { View, type ViewStyle } from 'react-native';

import { Icono, Presionable, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { radio, sombras } from '@/diseno/medidas';

type PropsMarcador = {
  icono: NombreIcono;
  color: string;
  accesibilidad: string;
  /** Posicion calculada por el plano. */
  posicion: ViewStyle;
  tamano?: number;
  /** Los reportes van en circulo y las propuestas y actividades en cuadrado. */
  forma?: 'circulo' | 'cuadrado';
  /** El marcador elegido lleva un aro verde oscuro alrededor. */
  seleccionado?: boolean;
  onPress?: () => void;
};

/** Grosor del aro verde que rodea al marcador elegido. */
const ARO_DE_SELECCION = 4;

/** Chincheta de un elemento sobre el plano del barrio. */
export function MarcadorMapa({
  icono,
  color,
  accesibilidad,
  posicion,
  tamano = 40,
  forma = 'circulo',
  seleccionado = false,
  onPress,
}: PropsMarcador) {
  const esRedondo = forma === 'circulo';
  const redondeo = esRedondo ? radio.redondo : radio.boton - 2;

  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.9}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad}
      style={[
        {
          borderRadius: radio.redondo,
          // El aro de seleccion se dibuja como un marco de color detras del
          // marcador, igual que el anillo del mockup.
          ...(seleccionado
            ? { padding: ARO_DE_SELECCION, backgroundColor: colores.bosque }
            : null),
        },
        sombras.media,
        posicion,
      ]}
    >
      <View
        style={{
          width: tamano,
          height: tamano,
          borderRadius: redondeo,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: seleccionado ? 4 : 3,
          borderColor: colores.blanco,
        }}
      >
        <Icono nombre={icono} tamano={tamano * 0.5} color={colores.blanco} />
      </View>
    </Presionable>
  );
}

/**
 * Grupo de elementos muy juntos. Al tocarlo se acerca el mapa, que es la forma
 * de evitar que la pantalla quede tapada de chinchetas.
 */
export function GrupoDeMarcadores({
  cantidad,
  posicion,
  onPress,
}: {
  cantidad: number;
  posicion: ViewStyle;
  onPress?: () => void;
}) {
  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${cantidad} elementos agrupados, acercar`}
      style={[
        {
          width: 48,
          height: 48,
          borderRadius: radio.redondo,
          backgroundColor: colores.bosque,
          borderWidth: 3,
          borderColor: colores.blanco,
          alignItems: 'center',
          justifyContent: 'center',
        },
        sombras.media,
        posicion,
      ]}
    >
      <Texto tamano={17} peso="fuerte" color={colores.blanco}>
        {String(cantidad)}
      </Texto>
    </Presionable>
  );
}

/** Punto azul que indica donde esta la persona. */
export function MiUbicacion({ posicion }: { posicion: ViewStyle }) {
  return (
    <View
      accessible
      accessibilityLabel="Tu ubicación"
      style={[
        {
          width: 22,
          height: 22,
          borderRadius: radio.redondo,
          backgroundColor: colores.ubicacionPropia,
          borderWidth: 4,
          borderColor: colores.blanco,
        },
        sombras.suave,
        posicion,
      ]}
    />
  );
}
```

#### `src/componentes/app/FotoSimulada.tsx`

Trama diagonal que reemplaza a las fotos. (63 líneas)

```tsx
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { Icono, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';

type PropsFotoSimulada = {
  alto: number;
  /** Rotulo opcional sobre la trama, por ejemplo "Antes · 3 nov". */
  rotulo?: string;
  accesibilidad?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Marcador de posicion de una fotografia.
 *
 * En el prototipo no hay imagenes reales, asi que se dibuja la misma trama
 * diagonal de los mockups. Al conectar el almacenamiento, este componente se
 * reemplaza por la imagen y el resto de las pantallas no cambia.
 */
export function FotoSimulada({ alto, rotulo, accesibilidad, style }: PropsFotoSimulada) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accesibilidad ?? 'Fotografía del reporte'}
      style={[
        { height: alto, backgroundColor: colores.fotoTramaClara, justifyContent: 'center', alignItems: 'center' },
        style,
      ]}
    >
      <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <Defs>
          <Pattern id="trama" width={24} height={24} patternUnits="userSpaceOnUse">
            <Rect width={24} height={24} fill={colores.fotoTramaClara} />
            <Line
              x1={-6}
              y1={30}
              x2={30}
              y2={-6}
              stroke={colores.fotoTramaOscura}
              strokeWidth={12}
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#trama)" />
      </Svg>
      <Icono nombre="imagen" tamano={30} color={colores.fotoIcono} />
      {rotulo === undefined ? null : (
        <Texto
          tamano={13}
          peso="fuerte"
          color={colores.fotoIcono}
          style={{ marginTop: espacio.corto }}
        >
          {rotulo}
        </Texto>
      )}
    </View>
  );
}
```

### 17.9 Disposiciones · app

#### `app/_layout.tsx`

Raíz: tipografías, proveedores y la pila principal. (110 líneas)

```tsx
import { useFonts } from 'expo-font';
import { router, Stack, usePathname, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colores } from '@/diseno/colores';
import { archivosDeFuente } from '@/diseno/tipografia';
import { ProveedorBarrio } from '@/estado/barrio';
import { ProveedorBorradores } from '@/estado/borradores';
import { ProveedorPreferencias } from '@/estado/preferencias';
import { ProveedorSesion, usarSesion } from '@/estado/sesion';

// La pantalla de carga se mantiene hasta que las dos tipografias esten listas.
// Si se deja pasar antes, el primer cuadro se dibuja con la letra del sistema y
// se ve un salto feo.
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * La cuenta obligatoria es una puerta y no un camino.
 *
 * El recorrido de bienvenida no alcanza para exigirla: en el navegador basta
 * escribir la direccion, y en el telefono la aplicacion vuelve a abrirse donde
 * se cerro. Quien llega sin sesion veria el barrio de ejemplo mientras la base
 * le rechaza todo, que es la peor de las dos cosas, porque parece que funciona
 * y no guarda nada.
 */
function Puerta({ children }: { children: ReactNode }) {
  const { estado } = usarSesion();
  const camino = usePathname();
  const navegacion = useRootNavigationState();

  // La bienvenida y el registro son el unico lugar donde se puede estar sin
  // haber entrado.
  const enElIngreso = camino === '/' || camino.startsWith('/ingreso');

  useEffect(() => {
    // Abriendo la aplicacion directo en una direccion, la sesion se resuelve
    // antes de que el navegador exista, y una redireccion disparada ahi se
    // pierde en silencio.
    if (navegacion?.key === undefined) return;
    if (estado === 'cargando' || estado === 'sinBackend' || estado === 'dentro') return;
    if (enElIngreso) return;
    // Con sesion abierta y sin seudonimo falta solo la mitad del registro, pero
    // el paso que lo crea vive en el mismo recorrido.
    router.replace(estado === 'sinPerfil' ? '/ingreso/cuenta' : '/');
  }, [estado, enElIngreso, navegacion?.key]);

  return <>{children}</>;
}

export default function DisposicionRaiz() {
  const [fuentesListas, errorDeFuentes] = useFonts(archivosDeFuente);

  useEffect(() => {
    if (fuentesListas || errorDeFuentes !== null) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fuentesListas, errorDeFuentes]);

  if (!fuentesListas && errorDeFuentes === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProveedorPreferencias>
          <ProveedorSesion>
            <ProveedorBarrio>
            <ProveedorBorradores>
              <StatusBar style="auto" />
              <Puerta>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colores.crema },
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="index" options={{ animation: 'fade' }} />
                <Stack.Screen name="(barrio)" options={{ animation: 'fade' }} />
                <Stack.Screen
                  name="mapa/capas"
                  options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                  name="mapa/ficha"
                  options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                  name="instituciones/interes"
                  options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                  name="actividades/inscripcion"
                  options={{ animation: 'fade_from_bottom' }}
                />
              </Stack>
              </Puerta>
            </ProveedorBorradores>
            </ProveedorBarrio>
          </ProveedorSesion>
        </ProveedorPreferencias>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

#### `app/(barrio)/_layout.tsx`

Las cinco pestañas con barra propia. (38 líneas)

```tsx
import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { BarraNavegacion } from '@/componentes/app';
import { colores } from '@/diseno/colores';

/**
 * Los cinco destinos permanentes de la aplicacion.
 *
 * "Reportar" ocupa el centro pero no es una pestana de verdad: abre el
 * asistente de reporte, que es un flujo aparte con sus propios pasos. Por eso
 * su pulsacion se intercepta antes de que la navegacion cambie de pestana.
 */
export default function DisposicionDeBarrio() {
  return (
    <Tabs
      tabBar={(props) => <BarraNavegacion {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colores.crema },
      }}
    >
      <Tabs.Screen name="inicio" />
      <Tabs.Screen name="mapa" />
      <Tabs.Screen
        name="reportar"
        listeners={{
          tabPress: (evento) => {
            evento.preventDefault();
            router.push('/reportar/categoria');
          },
        }}
      />
      <Tabs.Screen name="mis-reportes" />
      <Tabs.Screen name="avisos" />
    </Tabs>
  );
}
```

#### `app/reportar/_layout.tsx`

La pila del asistente de reporte. (24 líneas)

```tsx
import { Stack } from 'expo-router';

import { colores } from '@/diseno/colores';

/**
 * Asistente de reporte.
 *
 * Son cinco pasos y uno por pantalla, como pide la regla de accesibilidad del
 * sistema visual. La pantalla de posible duplicado se intercala sin consumir un
 * paso, porque no pide informacion nueva: solo pregunta si ya existe.
 */
export default function DisposicionDeReportar() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colores.crema },
      }}
    >
      <Stack.Screen name="enviado" options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack>
  );
}
```

### 17.10 Pantallas de ingreso

#### `app/index.tsx`

1.1 Bienvenida. (203 líneas)

```tsx
import { router } from 'expo-router';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Boton, Columna, Fila, Icono, Pantalla, Presionable, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import { usarPreferencias } from '@/estado/preferencias';

/**
 * Las tres promesas de la aplicacion, en el orden del mockup.
 *
 * La primera promete rapidez y no ausencia de registro, porque la cuenta es
 * obligatoria y la pantalla siguiente la pide. La barrera que aparecio en
 * terreno era el tiempo del registro y no el registro en si, y eso es lo que
 * la promesa tiene que responder.
 */
const promesas: { icono: NombreIcono; texto: string }[] = [
  { icono: 'pin', texto: 'Reporta en un minuto, sin contraseñas' },
  { icono: 'visto', texto: 'Mira en qué va cada reporte' },
  { icono: 'personas', texto: 'Propón soluciones con tus vecinos' },
];

/**
 * 1.1 Bienvenida.
 *
 * Es la unica pantalla, junto con el registro, a la que se llega sin haber
 * entrado. La friccion del registro fue la principal barrera de adopcion
 * declarada en terreno, y la respuesta a eso no es saltarse la cuenta, que la
 * contraparte descarto el 19 de octubre, sino que crearla cueste un correo y
 * un codigo de seis numeros.
 */
export default function Bienvenida() {
  const { menosAnimaciones, rotarTamanoDeTexto, factorTexto } = usarPreferencias();
  const animar = !menosAnimaciones;

  return (
    <Pantalla fondo={colores.bosque}>
      <FormasDeFondo />

      <Columna
        crecer={1}
        style={{ paddingHorizontal: espacio.bloque, paddingBottom: espacio.comodo }}
      >
        <Fila repartir="space-between" style={{ paddingTop: espacio.bloque }}>
          <Fila separacion={espacio.comodo}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radio.boton,
                backgroundColor: colores.brote,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icono nombre="hoja" tamano={26} color={colores.bosque} grosor={2.2} />
            </View>
            <Columna separacion={1}>
              <Texto tamano={19} familia="titulo" color={colores.papel} espaciado={0.2}>
                Barrio República
              </Texto>
              <Texto tamano={13} color={colores.textoTenueSobreBosque}>
                por República Circular
              </Texto>
            </Columna>
          </Fila>

          <Presionable
            onPress={rotarTamanoDeTexto}
            accessibilityRole="button"
            accessibilityLabel={`Cambiar el tamaño de la letra. Ahora está en ${Math.round(factorTexto * 100)} por ciento`}
            style={{
              minWidth: 56,
              height: 44,
              borderRadius: radio.redondo,
              borderWidth: 1.5,
              borderColor: colores.bosqueBorde,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: espacio.minimo,
            }}
          >
            <Texto tamano={16} peso="fuerte" color={colores.papel}>
              A
            </Texto>
            <Texto tamano={21} peso="fuerte" color={colores.papel}>
              A
            </Texto>
          </Presionable>
        </Fila>

        <Columna separacion={18} style={{ marginTop: 'auto' }}>
          <Animated.View entering={animar ? FadeInUp.duration(500) : undefined}>
            <Texto tamano={44} familia="titulo" color={colores.papel} interlineado={1.02} espaciado={-0.3}>
              Tu barrio mejora cuando lo hacemos{' '}
              <Texto tamano={44} familia="titulo" color={colores.brote} interlineado={1.02}>
                entre todos
              </Texto>
            </Texto>
          </Animated.View>

          <Texto tamano={18} color={colores.textoSobreBosque} interlineado={1.45}>
            Reporta lo que ves, propone cómo arreglarlo y súmate a lo que tus vecinos ya están
            haciendo.
          </Texto>

          <Columna separacion={espacio.medio} style={{ marginTop: espacio.corto }}>
            {promesas.map((promesa, posicion) => (
              <Animated.View
                key={promesa.texto}
                entering={animar ? FadeInDown.delay(120 * posicion).duration(420) : undefined}
              >
                <Fila separacion={espacio.medio}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: radio.boton - 2,
                      backgroundColor: colores.bosqueClaro,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icono nombre={promesa.icono} tamano={20} color={colores.brote} />
                  </View>
                  <Texto tamano={16} color={colores.papel} style={{ flex: 1 }}>
                    {promesa.texto}
                  </Texto>
                </Fila>
              </Animated.View>
            ))}
          </Columna>

          <Columna separacion={espacio.medio} style={{ marginTop: 14 }}>
            <Boton
              texto="Comenzar"
              variante="brote"
              icono="flechaDerecha"
              iconoAlFinal
              alto={alturaTocable.destacada}
              tamanoDeTexto={18}
              onPress={() => router.push('/ingreso/vinculo')}
              vibrar
            />
            <Boton
              texto="Ya tengo cuenta"
              variante="contornoClaro"
              alto={54}
              tamanoDeTexto={17}
              onPress={() => router.push('/ingreso/cuenta')}
            />
          </Columna>
        </Columna>
      </Columna>
    </Pantalla>
  );
}

/**
 * Las dos figuras decorativas del fondo. Van detras del contenido y no se leen
 * con el lector de pantalla.
 */
function FormasDeFondo() {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}
    >
      <View
        style={{
          position: 'absolute',
          right: -90,
          top: -70,
          width: 300,
          height: 300,
          borderRadius: radio.redondo,
          borderWidth: 46,
          borderColor: colores.bosqueClaro,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: -120,
          bottom: 180,
          width: 240,
          height: 240,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 120,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 120,
          backgroundColor: colores.bosqueMedio,
          transform: [{ rotate: '-20deg' }],
        }}
      />
    </View>
  );
}
```

#### `app/ingreso/vinculo.tsx`

1.2 Vínculo con el barrio. (110 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  BarraDePasos,
  BarraInferior,
  Boton,
  BotonCircular,
  Columna,
  Fila,
  Opcion,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { vinculosConElBarrio } from '@/datos/perfil';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio } from '@/diseno/medidas';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 1.2 Vinculo con el barrio.
 *
 * La organizacion ya definio en 2022 que habitante es quien vive, estudia,
 * trabaja o tiene un vinculo con el barrio, asi que se puede marcar mas de una
 * opcion y ninguna es excluyente.
 */
export default function Vinculo() {
  const volver = crearVolver('/');
  const [elegidos, setElegidos] = useState<string[]>([]);

  function alternar(id: string) {
    setElegidos((actuales) =>
      actuales.includes(id) ? actuales.filter((otro) => otro !== id) : [...actuales, id],
    );
  }

  return (
    <Pantalla>
      <Fila
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}
      >
        <BotonCircular icono="flechaIzquierda" accesibilidad="Volver" onPress={volver} />
        <View style={{ flex: 1 }}>
          <BarraDePasos paso={1} total={2} />
        </View>
        <Presionable
          onPress={() => router.push('/ingreso/intereses')}
          accessibilityRole="button"
          accessibilityLabel="Omitir"
          style={{
            minHeight: alturaTocable.minima,
            justifyContent: 'center',
            paddingHorizontal: espacio.corto,
          }}
        >
          <Texto tamano={16} peso="fuerte" color={colores.grisTexto}>
            Omitir
          </Texto>
        </Presionable>
      </Fila>

      <Columna separacion={espacio.normal} style={{ paddingHorizontal: espacio.bloque }}>
        <Texto tamano={14} peso="fuerte" color={colores.verde} espaciado={0.6}>
          PASO 1 DE 2
        </Texto>
        <Texto tamano={32} familia="titulo" interlineado={1.08}>
          ¿Cuál es tu relación con el barrio?
        </Texto>
        <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
          Marca todas las que correspondan. Así te mostramos lo que te sirve.
        </Texto>
      </Columna>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.seccion,
          paddingTop: espacio.amplio,
          paddingBottom: espacio.normal,
          gap: espacio.comodo,
        }}
      >
        {vinculosConElBarrio.map((vinculo) => (
          <Opcion
            key={vinculo.id}
            texto={vinculo.titulo}
            detalle={vinculo.detalle}
            activa={elegidos.includes(vinculo.id)}
            onPress={() => alternar(vinculo.id)}
          />
        ))}
      </ScrollView>

      <BarraInferior>
        <Texto tamano={14} color={colores.grisTexto} alineacion="center">
          Puedes cambiarlo cuando quieras en tu perfil.
        </Texto>
        <Boton
          texto="Continuar"
          alto={56}
          tamanoDeTexto={18}
          onPress={() => router.push('/ingreso/intereses')}
        />
      </BarraInferior>
    </Pantalla>
  );
}
```

#### `app/ingreso/intereses.tsx`

1.3 Qué quiero ver en el mapa. (133 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  BarraDePasos,
  BarraInferior,
  Boton,
  BotonCircular,
  Columna,
  Fila,
  FilaDeLista,
  Interruptor,
  ListaAgrupada,
  Pantalla,
  Presionable,
  Sigla,
  Texto,
} from '@/componentes/base';
import { interesesDelMapa } from '@/datos/perfil';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio } from '@/diseno/medidas';
import { crearVolver } from '@/utiles/navegacion';

/** Color de cada sigla, para que el grupo se lea de un vistazo. */
const coloresDeSigla: Record<string, { fondo: string; texto: string }> = {
  reportes: { fondo: '#F5E6C8', texto: '#8A5A12' },
  propuestas: { fondo: colores.menta, texto: '#174D34' },
  residuos: { fondo: '#EFE2D4', texto: '#7A4A1F' },
  verdes: { fondo: '#DDEBD4', texto: '#2E6B3F' },
  patrimonio: { fondo: '#F3DCD7', texto: '#9C3A33' },
  movilidad: { fondo: '#DCE7F3', texto: '#2C5A8C' },
  mobiliario: { fondo: '#E6E8EC', texto: '#4A5560' },
};

/**
 * 1.3 Que quiero ver en el mapa.
 *
 * Se muestran solo las capas elegidas para que el plano se lea facil. Es la
 * misma lista que despues aparece en Mapa y Capas.
 */
export default function Intereses() {
  const volver = crearVolver('/ingreso/vinculo');
  const [encendidos, setEncendidos] = useState<string[]>(['reportes', 'propuestas', 'residuos']);

  function alternar(id: string) {
    setEncendidos((actuales) =>
      actuales.includes(id) ? actuales.filter((otro) => otro !== id) : [...actuales, id],
    );
  }

  return (
    <Pantalla>
      <Fila
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}
      >
        <BotonCircular icono="flechaIzquierda" accesibilidad="Volver" onPress={volver} />
        <View style={{ flex: 1 }}>
          <BarraDePasos paso={2} total={2} />
        </View>
        <Presionable
          onPress={() => router.push('/ingreso/cuenta')}
          accessibilityRole="button"
          accessibilityLabel="Omitir"
          style={{
            minHeight: alturaTocable.minima,
            justifyContent: 'center',
            paddingHorizontal: espacio.corto,
          }}
        >
          <Texto tamano={16} peso="fuerte" color={colores.grisTexto}>
            Omitir
          </Texto>
        </Presionable>
      </Fila>

      <Columna separacion={espacio.normal} style={{ paddingHorizontal: espacio.bloque }}>
        <Texto tamano={14} peso="fuerte" color={colores.verde} espaciado={0.6}>
          PASO 2 DE 2
        </Texto>
        <Texto tamano={32} familia="titulo" interlineado={1.08}>
          ¿Qué quieres ver en el mapa?
        </Texto>
        <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
          Mostramos solo lo que elijas para que el mapa se lea fácil. Lo cambias cuando quieras en
          Mapa › Capas.
        </Texto>
      </Columna>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.seccion,
          paddingTop: 18,
          paddingBottom: espacio.normal,
        }}
      >
        <ListaAgrupada>
          {interesesDelMapa.map((interes, posicion) => {
            const tono = coloresDeSigla[interes.id] ?? { fondo: colores.crema, texto: colores.tinta };
            return (
              <FilaDeLista
                key={interes.id}
                titulo={interes.titulo}
                detalle={interes.detalle}
                adorno={<Sigla texto={interes.sigla} fondo={tono.fondo} color={tono.texto} />}
                ultima={posicion === interesesDelMapa.length - 1}
                onPress={() => alternar(interes.id)}
                control={
                  <Interruptor
                    activo={encendidos.includes(interes.id)}
                    onCambiar={() => alternar(interes.id)}
                    accesibilidad={interes.titulo}
                  />
                }
              />
            );
          })}
        </ListaAgrupada>
      </ScrollView>

      <BarraInferior>
        <Boton
          texto="Listo"
          alto={56}
          tamanoDeTexto={18}
          onPress={() => router.push('/ingreso/cuenta')}
        />
      </BarraInferior>
    </Pantalla>
  );
}
```

#### `app/ingreso/cuenta.tsx`

1.4 Perfil opcional sin contraseña. (168 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import {
  Aviso,
  BarraInferior,
  Boton,
  BotonCircular,
  CampoTexto,
  Casilla,
  Columna,
  Etiqueta,
  Fila,
  Pantalla,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarSesion } from '@/estado/sesion';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 1.4 Crear la cuenta.
 *
 * Desde el 19 de octubre la cuenta es obligatoria para entrar, porque sin
 * ella cualquiera podria crearse varias identidades e inflar la priorizacion
 * comunitaria. Lo que se conserva de la version anterior es lo que el terreno
 * pidio: no se pide nombre real ni RUT, y no hay contrasenas, porque la
 * friccion del registro fue la barrera de abandono mas mencionada y el Banco
 * del Tiempo murio en parte por no tener recuperacion de contrasenas.
 *
 * El seudonimo se pide aqui pero se guarda despues de confirmar el codigo:
 * crear el perfil exige una sesion abierta.
 */
export default function Cuenta() {
  const volver = crearVolver('/ingreso/intereses');
  const { pedirCodigo, estado } = usarSesion();
  const [seudonimo, setSeudonimo] = useState('');
  const [correo, setCorreo] = useState('');
  const [aceptaNormas, setAceptaNormas] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const puedeEnviar =
    seudonimo.trim().length >= 2 && correo.includes('@') && aceptaNormas && !enviando;

  async function enviar() {
    // Sin credenciales configuradas no hay a quien pedirle el codigo, y el
    // prototipo tiene que seguir siendo navegable asi: es como se muestra en
    // reuniones y como lo corre quien clona el repositorio.
    if (estado === 'sinBackend') {
      router.replace('/inicio');
      return;
    }

    setEnviando(true);
    setError(null);
    try {
      await pedirCodigo(correo);
      router.push({
        pathname: '/ingreso/codigo',
        params: { correo: correo.trim().toLowerCase(), seudonimo: seudonimo.trim() },
      });
    } catch (falla: unknown) {
      setError(falla instanceof Error ? falla.message : 'No se pudo enviar el código');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Pantalla>
      <Fila style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}>
        <BotonCircular icono="flechaIzquierda" accesibilidad="Volver" onPress={volver} />
      </Fila>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: espacio.seccion }}
        >
          <Columna separacion={espacio.normal} style={{ paddingHorizontal: espacio.bloque }}>
            <Etiqueta texto="Paso final" fondo={colores.menta} color={colores.verde} alto={30} tamanoDeTexto={13.5} />
            <Texto tamano={32} familia="titulo" interlineado={1.08}>
              Crea tu cuenta del barrio
            </Texto>
            <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
              Te avisamos cuando tu reporte avance. No pedimos tu nombre real ni tu RUT.
            </Texto>
          </Columna>

          <Columna
            separacion={espacio.amplio}
            style={{ paddingHorizontal: espacio.seccion, paddingTop: 22 }}
          >
            <CampoTexto
              etiqueta="Seudónimo"
              valor={seudonimo}
              onCambiar={setSeudonimo}
              ayuda="Es el nombre que verán tus vecinos. Puede ser inventado."
            />
            <CampoTexto
              etiqueta="Correo electrónico"
              valor={correo}
              onCambiar={setCorreo}
              marcaDeAgua="tucorreo@ejemplo.cl"
              tipoDeTeclado="correo"
            />

            <Aviso tono="logro" icono="candado">
              <Texto tamano={15} color="#173A28" interlineado={1.4}>
                <Texto tamano={15} peso="fuerte" color="#173A28">
                  Sin contraseñas.
                </Texto>
                {' Cada vez que entres te mandamos un código de 6 números a tu correo.'}
              </Texto>
            </Aviso>

            <Casilla activa={aceptaNormas} onPress={() => setAceptaNormas(!aceptaNormas)}>
              <Texto tamano={15} interlineado={1.4}>
                {'Acepto las '}
                <Texto tamano={15} peso="fuerte" style={{ textDecorationLine: 'underline' }}>
                  normas de convivencia
                </Texto>
                {' del barrio'}
              </Texto>
            </Casilla>
          </Columna>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior>
        {error === null ? null : (
          <Aviso tono="cuidado">
            <Texto tamano={15} interlineado={1.4}>
              {error}
            </Texto>
          </Aviso>
        )}
        <Boton
          texto={
            estado === 'sinBackend'
              ? 'Entrar al barrio'
              : enviando
                ? 'Enviando...'
                : 'Enviarme el código'
          }
          icono="sobre"
          alto={56}
          tamanoDeTexto={18}
          deshabilitado={!puedeEnviar}
          onPress={() => void enviar()}
          vibrar
        />
        {estado === 'sinBackend' ? null : (
          <Texto tamano={14} color={colores.grisTexto} alineacion="center">
            Llega en unos segundos. Revisa también el correo no deseado.
          </Texto>
        )}
      </BarraInferior>
    </Pantalla>
  );
}
```

### 17.11 Pestañas e inicio

#### `app/(barrio)/inicio.tsx`

2.1 Inicio (feed). (286 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import {
  Avatar,
  BarraDeEstadoDeReporte,
  TarjetaDeActividad,
  TarjetaDePropuesta,
  TarjetaDeReporte,
} from '@/componentes/app';
import {
  Boton,
  Chip,
  Columna,
  Fila,
  Icono,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { espacio, radio } from '@/diseno/medidas';
import { estados } from '@/dominio/estados';
import { usarBarrio } from '@/estado/barrio';
import { usarPreferencias } from '@/estado/preferencias';
import { usarQuienEntro } from '@/estado/sesion';

/** Pestanas que filtran el feed. */
const pestanas = ['Todo', 'Propuestas', 'Actividades', 'Reportes'] as const;
type Pestana = (typeof pestanas)[number];

/** Los tres accesos rapidos bajo la tarjeta de novedades. */
const atajos: { etiqueta: string; icono: NombreIcono; fondo: string; color: string; destino: string }[] = [
  { etiqueta: 'Propuestas', icono: 'idea', fondo: colores.menta, color: colores.verde, destino: '/propuestas' },
  { etiqueta: 'Actividades', icono: 'calendario', fondo: '#F5E6C8', color: '#8A5A12', destino: '/actividades' },
  { etiqueta: 'Observatorio', icono: 'grafico', fondo: '#DCE7F3', color: '#2C5A8C', destino: '/observatorio' },
];

/**
 * 2.1 Inicio.
 *
 * Lo primero que se ve es el avance de un reporte propio. Esa devolucion es
 * justamente lo que falto en las herramientas anteriores del barrio: sin
 * retorno visible, el vecino reporta una vez y no vuelve.
 */
export default function Inicio() {
  const { reportes, propuestas, actividades, confirmarReporte, descartarReporte, apoyarPropuesta } =
    usarBarrio();
  const { menosAnimaciones } = usarPreferencias();
  const quienEntro = usarQuienEntro();
  const [pestanaActiva, setPestanaActiva] = useState<Pestana>('Todo');
  const [confirmacionRespondida, setConfirmacionRespondida] = useState(false);

  const reporteQueAvanzo = reportes.find((r) => r.esMio && r.estado === 'gestion');
  const reportePorConfirmar = reportes.find((r) => r.estado === 'verificado' && r.subtipo !== undefined);
  const propuestaDestacada = propuestas[0];
  const actividadProxima = actividades[0];
  const reporteDelFeed = reportes.find((r) => !r.esMio && r.tieneFoto);

  const muestra = (seccion: Pestana) => pestanaActiva === 'Todo' || pestanaActiva === seccion;

  function responderConfirmacion(sigue: boolean) {
    if (reportePorConfirmar === undefined) return;
    if (sigue) {
      confirmarReporte(reportePorConfirmar.id);
    } else {
      descartarReporte(reportePorConfirmar.id);
    }
    setConfirmacionRespondida(true);
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 56, paddingBottom: espacio.bloque }}
      style={{ backgroundColor: colores.crema }}
    >
      <Fila
        repartir="space-between"
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.corto }}
      >
        <Columna separacion={espacio.minimo}>
          <Fila separacion={espacio.apretado}>
            <Icono nombre="pin" tamano={16} color={colores.verde} />
            <Texto tamano={14} peso="fuerte" color={colores.verde}>
              Barrio República
            </Texto>
          </Fila>
          <Texto tamano={30} familia="titulo" interlineado={1.1}>
            {`Hola, ${quienEntro.nombre}`}
          </Texto>
        </Columna>
        <Presionable
          onPress={() => router.push('/perfil')}
          accessibilityRole="button"
          accessibilityLabel="Mi perfil y ajustes"
        >
          <Avatar persona={quienEntro} tamano={48} conAro />
        </Presionable>
      </Fila>

      <Columna
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.amplio, paddingTop: espacio.medio }}
      >
        {reporteQueAvanzo === undefined ? null : (
          <Animated.View entering={menosAnimaciones ? undefined : FadeInDown.duration(420)}>
            <Tarjeta
              tono="bosque"
              onPress={() => router.push(`/reportes/${reporteQueAvanzo.id}`)}
              accesibilidad={`Tu reporte avanzó: ${reporteQueAvanzo.titulo}`}
              relleno={18}
            >
              <Fila repartir="space-between">
                <Texto tamano={13.5} peso="fuerte" color={colores.brote} espaciado={0.5}>
                  TU REPORTE AVANZÓ
                </Texto>
                <Icono nombre="flechaDerecha" tamano={22} color={colores.papel} />
              </Fila>
              <Texto tamano={18} peso="fuerte" color={colores.papel} interlineado={1.3}>
                {`${reporteQueAvanzo.titulo} ahora está `}
                <Texto tamano={18} peso="fuerte" color={colores.ambarSobreBosque}>
                  {estados[reporteQueAvanzo.estado].etiqueta.toLowerCase()}
                </Texto>
              </Texto>
              <BarraDeEstadoDeReporte estado={reporteQueAvanzo.estado} sobreBosque />
              <Texto tamano={14} color={colores.textoTenueSobreBosque}>
                {reporteQueAvanzo.seguimiento.find((e) => e.estado === 'gestion')?.detalle ?? ''}
                {' · hace 2 h'}
              </Texto>
            </Tarjeta>
          </Animated.View>
        )}

        {reportePorConfirmar === undefined ? null : (
          <Tarjeta>
            <Fila separacion={espacio.medio} alinear="flex-start">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radio.boton - 2,
                  backgroundColor: '#F5E6C8',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icono nombre="interrogacion" tamano={22} color="#8A5A12" />
              </View>
              <Columna crecer={1} separacion={3}>
                <Texto tamano={16.5} peso="fuerte" interlineado={1.3}>
                  {confirmacionRespondida
                    ? 'Gracias, el mapa queda al día'
                    : `¿Sigue el ${reportePorConfirmar.subtipo} en ${reportePorConfirmar.direccion}?`}
                </Texto>
                <Texto tamano={14} color={colores.grisTexto}>
                  {confirmacionRespondida
                    ? 'Tu respuesta ya se sumó al reporte'
                    : 'Tu respuesta ayuda a mantener el mapa al día'}
                </Texto>
              </Columna>
            </Fila>
            {confirmacionRespondida ? null : (
              <Fila separacion={espacio.comodo}>
                <Boton
                  texto="Sí, sigue"
                  variante="secundaria"
                  alto={48}
                  onPress={() => responderConfirmacion(true)}
                  vibrar
                  style={{ flex: 1 }}
                />
                <Boton
                  texto="Ya no está"
                  variante="tonal"
                  alto={48}
                  onPress={() => responderConfirmacion(false)}
                  vibrar
                  style={{ flex: 1 }}
                />
              </Fila>
            )}
          </Tarjeta>
        )}

        <Fila separacion={espacio.comodo}>
          {atajos.map((atajo) => (
            <Presionable
              key={atajo.etiqueta}
              onPress={() => router.push(atajo.destino as never)}
              accessibilityRole="button"
              accessibilityLabel={atajo.etiqueta}
              style={{
                flex: 1,
                minHeight: 92,
                backgroundColor: colores.papel,
                borderWidth: 1,
                borderColor: colores.borde,
                borderRadius: 18,
                padding: espacio.medio,
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radio.medio,
                  backgroundColor: atajo.fondo,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icono nombre={atajo.icono} tamano={20} color={atajo.color} />
              </View>
              <Texto tamano={15} peso="fuerte">
                {atajo.etiqueta}
              </Texto>
            </Presionable>
          ))}
        </Fila>
      </Columna>

      <Columna separacion={espacio.medio} style={{ paddingTop: 22 }}>
        <Texto
          tamano={22}
          familia="tituloSemi"
          style={{ paddingHorizontal: espacio.seccion }}
        >
          Lo último en el barrio
        </Texto>

        <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.amplio }}>
          {pestanas.map((pestana) => (
            <Chip
              key={pestana}
              texto={pestana}
              activo={pestanaActiva === pestana}
              onPress={() => setPestanaActiva(pestana)}
            />
          ))}
        </Fila>

        <Columna separacion={espacio.medio} style={{ paddingHorizontal: espacio.amplio }}>
          {muestra('Propuestas') && propuestaDestacada !== undefined ? (
            <Animated.View entering={menosAnimaciones ? undefined : FadeIn.duration(300)}>
              <TarjetaDePropuesta
                propuesta={propuestaDestacada}
                notaDeApoyo={
                  propuestaDestacada.quierenApoyar.length > 0
                    ? 'Estudiantes de FCFM quieren apoyar'
                    : undefined
                }
                onPress={() => router.push(`/propuestas/${propuestaDestacada.id}`)}
                onApoyar={() => apoyarPropuesta(propuestaDestacada.id)}
                onOpinar={() => router.push(`/propuestas/${propuestaDestacada.id}/conversacion`)}
              />
            </Animated.View>
          ) : null}

          {muestra('Actividades') && actividadProxima !== undefined ? (
            <Animated.View entering={menosAnimaciones ? undefined : FadeIn.duration(300)}>
              <TarjetaDeActividad
                actividad={actividadProxima}
                onPress={() => router.push(`/actividades/${actividadProxima.id}`)}
              />
            </Animated.View>
          ) : null}

          {muestra('Reportes') && reporteDelFeed !== undefined ? (
            <Animated.View entering={menosAnimaciones ? undefined : FadeIn.duration(300)}>
              <TarjetaDeReporte
                reporte={reporteDelFeed}
                onPress={() => router.push(`/reportes/${reporteDelFeed.id}`)}
              />
            </Animated.View>
          ) : null}
        </Columna>
      </Columna>
    </ScrollView>
  );
}
```

#### `app/(barrio)/mapa.tsx`

2.2 Mapa del barrio. (356 líneas)

```tsx
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  EtiquetaDeEstado,
  GrupoDeMarcadores,
  MapaBarrio,
  MarcadorMapa,
  MiUbicacion,
  RotuloDeCategoria,
} from '@/componentes/app';
import { Boton, Chip, Columna, Fila, Icono, Presionable, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio, sombras } from '@/diseno/medidas';
import type { IdCapaDelCatastro } from '@/dominio/capas';
import { capasDelCatastro, colorDelElemento, esCapaDelCatastro } from '@/dominio/capas';
import { categorias } from '@/dominio/categorias';
import { familias } from '@/diseno/tipografia';
import { usarBarrio } from '@/estado/barrio';
import { usarElementosDelCatastro } from '@/estado/catastro';
import type { ElementoEnElMapa } from '@/dominio/tipos';
import { usarPreferencias } from '@/estado/preferencias';
import { agruparEnPantalla } from '@/utiles/agrupacion';

/** Filtros del carril superior del mapa. */
const filtros = ['Todo', 'Reportes', 'Propuestas', 'Actividades'] as const;
type Filtro = (typeof filtros)[number];

/**
 * Lado de la celda con que se agrupan las chinchetas del catastro.
 *
 * Son 44 px, la misma medida minima que el sistema visual exige para una zona
 * tocable: por debajo de eso dos chinchetas se pisan y dejan de poder tocarse
 * por separado.
 */
const LADO_DE_AGRUPACION = 44;

/** Donde esta parada la persona dentro del plano. */
const UBICACION_PROPIA = { latitud: -33.453450, longitud: -70.661741 };

/**
 * 2.2 Mapa del barrio.
 *
 * Es el eje visual de la aplicacion. Reune en un solo plano lo que se reporta,
 * lo que se propone y lo que se organiza, que es la informacion que hoy esta
 * repartida entre un tablero congelado y los grupos de mensajeria.
 */
export default function Mapa() {
  const { reportes, propuestas, actividades, capas, confirmarReporte } = usarBarrio();

  // Las capas del catastro no dependen de los chips de arriba, que filtran lo
  // que pasa ahora. Se encienden y apagan en la pantalla de capas, tal como
  // separa los dos grupos el diseno.
  const capasEncendidas = useMemo(
    () =>
      capas
        .filter((capa) => capa.grupo === 'catastro' && capa.activa)
        .map((capa) => capa.id)
        .filter(esCapaDelCatastro),
    [capas],
  );
  const catastro = usarElementosDelCatastro(capasEncendidas);
  const { menosAnimaciones } = usarPreferencias();
  const margenes = useSafeAreaInsets();
  const [filtro, setFiltro] = useState<Filtro>('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState<string>('microbasural-sazie');

  const muestra = (seccion: Filtro) => filtro === 'Todo' || filtro === seccion;
  const reporteSeleccionado = reportes.find((reporte) => reporte.id === seleccionado);

  return (
    <View style={{ flex: 1, backgroundColor: colores.mapaFondo }}>
      <MapaBarrio alCambiarElArea={catastro.alCambiarElArea}>
        {(ubicar) => (
          <>
            <MiUbicacion posicion={ubicar(UBICACION_PROPIA, 22)} />

            {muestra('Reportes')
              ? reportes
                  .filter((reporte) => reporte.estado !== 'resuelto')
                  .map((reporte) => {
                    const elegido = reporte.id === seleccionado;
                    const tamano = elegido ? 52 : 40;
                    return (
                      <MarcadorMapa
                        key={reporte.id}
                        icono={categorias[reporte.categoria].icono}
                        color={categorias[reporte.categoria].color}
                        accesibilidad={`${categorias[reporte.categoria].etiquetaCorta}, ${reporte.direccion}${elegido ? ', seleccionado' : ''}`}
                        posicion={ubicar(reporte.posicion, elegido ? tamano + 8 : tamano)}
                        tamano={tamano}
                        seleccionado={elegido}
                        onPress={() => setSeleccionado(reporte.id)}
                      />
                    );
                  })
              : null}

            {muestra('Propuestas')
              ? propuestas.map((propuesta) => (
                  <MarcadorMapa
                    key={propuesta.id}
                    icono="idea"
                    color={colores.verde}
                    forma="cuadrado"
                    accesibilidad={`Propuesta: ${propuesta.titulo}`}
                    posicion={ubicar(propuesta.posicion, 40)}
                    onPress={() => router.push(`/propuestas/${propuesta.id}`)}
                  />
                ))
              : null}

            {muestra('Actividades')
              ? actividades.map((actividad) => (
                  <MarcadorMapa
                    key={actividad.id}
                    icono="calendario"
                    color={colores.ocre}
                    forma="cuadrado"
                    accesibilidad={`Actividad: ${actividad.titulo}`}
                    posicion={ubicar(actividad.posicion, 40)}
                    onPress={() => router.push(`/actividades/${actividad.id}`)}
                  />
                ))
              : null}

            {agruparEnPantalla(
              catastro.elementos,
              (elemento) => elemento.posicion,
              catastro.zoom,
              LADO_DE_AGRUPACION,
            ).map((grupo) => {
              const primero = grupo.elementos[0];
              if (primero === undefined) return null;

              if (grupo.elementos.length > 1) {
                return (
                  <GrupoDeMarcadores
                    key={grupo.clave}
                    cantidad={grupo.elementos.length}
                    posicion={ubicar(grupo.posicion, 48)}
                  />
                );
              }

              const capa = capasDelCatastro[primero.capa as IdCapaDelCatastro];
              return (
                <MarcadorMapa
                  key={grupo.clave}
                  icono={capa.icono}
                  color={colorDelElemento(
                    primero.capa as IdCapaDelCatastro,
                    primero.estadoDePlatabanda,
                  )}
                  tamano={34}
                  accesibilidad={descripcionDelElemento(primero)}
                  posicion={ubicar(primero.posicion, 34)}
                />
              );
            })}
          </>
        )}
      </MapaBarrio>

      <Columna
        separacion={espacio.comodo}
        style={{
          position: 'absolute',
          left: espacio.amplio,
          right: espacio.amplio,
          top: margenes.top + espacio.normal,
        }}
      >
        <Fila separacion={espacio.comodo}>
          <Fila
            crecer={1}
            separacion={espacio.comodo}
            style={[
              {
                height: 52,
                borderRadius: radio.caja,
                backgroundColor: colores.papel,
                paddingHorizontal: espacio.amplio - 2,
              },
              sombras.flotante,
            ]}
          >
            <Icono nombre="lupa" tamano={22} color={colores.grisTexto} />
            <CampoDeBusqueda valor={busqueda} onCambiar={setBusqueda} />
          </Fila>
          <Presionable
            onPress={() => router.push('/mapa/capas')}
            accessibilityRole="button"
            accessibilityLabel="Capas del mapa"
            style={[
              {
                width: 52,
                height: 52,
                borderRadius: radio.caja,
                backgroundColor: colores.papel,
                alignItems: 'center',
                justifyContent: 'center',
              },
              sombras.flotante,
            ]}
          >
            <Icono nombre="capas" tamano={24} color={colores.tinta} />
          </Presionable>
        </Fila>

        <Fila separacion={espacio.normal}>
          {filtros.map((opcion) => (
            <Chip
              key={opcion}
              texto={opcion}
              activo={filtro === opcion}
              onPress={() => setFiltro(opcion)}
              flotante
              alto={40}
              tamanoDeTexto={14.5}
            />
          ))}
        </Fila>
      </Columna>

      <Presionable
        accessibilityRole="button"
        accessibilityLabel="Ir a mi ubicación"
        style={[
          {
            position: 'absolute',
            right: espacio.amplio,
            bottom: 300,
            width: 52,
            height: 52,
            borderRadius: radio.caja,
            backgroundColor: colores.papel,
            alignItems: 'center',
            justifyContent: 'center',
          },
          sombras.flotante,
        ]}
      >
        <Icono nombre="mira" tamano={24} color={colores.ubicacionPropia} />
      </Presionable>

      {reporteSeleccionado === undefined ? null : (
        <Animated.View
          key={reporteSeleccionado.id}
          entering={menosAnimaciones ? undefined : FadeInDown.duration(260)}
          style={[
            {
              marginTop: 'auto',
              backgroundColor: colores.papel,
              borderTopLeftRadius: radio.hoja,
              borderTopRightRadius: radio.hoja,
              paddingTop: espacio.comodo,
              paddingHorizontal: 18,
              paddingBottom: espacio.amplio - 2,
              gap: espacio.comodo,
            },
            sombras.hoja,
          ]}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 40,
              height: 5,
              borderRadius: radio.redondo,
              backgroundColor: '#D6CDB8',
            }}
          />
          <Fila repartir="space-between" separacion={espacio.normal}>
            <RotuloDeCategoria
              categoria={reporteSeleccionado.categoria}
              detalle={reporteSeleccionado.subtipo}
            />
            <EtiquetaDeEstado estado={reporteSeleccionado.estado} />
          </Fila>
          <Texto tamano={19} peso="fuerte" interlineado={1.25}>
            {reporteSeleccionado.direccion}
          </Texto>
          <Texto tamano={14.5} color={colores.grisTexto}>
            {`${reporteSeleccionado.publicado} · ${reporteSeleccionado.confirmaciones} vecinos lo confirman${
              reporteSeleccionado.propuestas.length > 0
                ? ` · ${reporteSeleccionado.propuestas.length} propuesta para resolverlo`
                : ''
            }`}
          </Texto>
          <Fila separacion={espacio.comodo}>
            <Boton
              texto="Ver detalle"
              alto={50}
              onPress={() => router.push(`/reportes/${reporteSeleccionado.id}`)}
              style={{ flex: 1 }}
            />
            <Boton
              texto="¿Sigue ahí?"
              variante="secundaria"
              alto={50}
              onPress={() => confirmarReporte(reporteSeleccionado.id)}
              vibrar
              style={{ flex: 1 }}
            />
          </Fila>
        </Animated.View>
      )}
    </View>
  );
}

/** Campo de busqueda del mapa, sin borde propio porque ya va dentro del cuadro. */
function CampoDeBusqueda({ valor, onCambiar }: { valor: string; onCambiar: (texto: string) => void }) {
  return (
    <TextInput
      value={valor}
      onChangeText={onCambiar}
      placeholder="Buscar calle o lugar"
      placeholderTextColor={colores.grisTexto}
      accessibilityLabel="Buscar calle o lugar"
      allowFontScaling={false}
      style={{
        flex: 1,
        minWidth: 0,
        fontFamily: familias.texto,
        fontSize: 16.5,
        color: colores.tinta,
      }}
    />
  );
}

/**
 * Lo que el lector de pantalla anuncia de un elemento del catastro.
 *
 * Lleva el dato que distingue a cada capa, porque el icono y el color no
 * bastan: la regla de accesibilidad del sistema visual pide que los iconos
 * vayan siempre acompanados de texto.
 */
function descripcionDelElemento(elemento: ElementoEnElMapa): string {
  const capa = capasDelCatastro[elemento.capa as IdCapaDelCatastro];
  const detalles = [
    elemento.estadoDePlatabanda,
    elemento.tipoDeMicrobasural,
    elemento.direccion,
    elemento.areaM2 > 0 ? `${Math.round(elemento.areaM2)} metros cuadrados` : undefined,
    elemento.largoM > 0 ? `${Math.round(elemento.largoM)} metros de largo` : undefined,
  ].filter((parte): parte is string => parte !== undefined);

  return [capa.etiqueta, ...detalles].join(', ');
}
```

#### `app/(barrio)/reportar.tsx`

Redirección del destino central. (13 líneas)

```tsx
import { Redirect } from 'expo-router';

/**
 * Destino central de la barra de navegacion.
 *
 * La pulsacion ya se intercepta en la disposicion de pestanas, asi que esta
 * pantalla casi nunca se dibuja. Existe para que la pestana tenga una ruta
 * valida y para que, si alguien llega por un enlace directo, igual termine en
 * el primer paso del asistente.
 */
export default function AtajoDeReportar() {
  return <Redirect href="/reportar/categoria" />;
}
```

#### `app/(barrio)/mis-reportes.tsx`

4.1 Mis reportes. (174 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { TarjetaDeMiReporte } from '@/componentes/app';
import { Aviso, Chip, Columna, Fila, Pantalla, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { pluralizar } from '@/utiles/texto';
import { usarBarrio } from '@/estado/barrio';

/** Las tres cosas que una persona puede tener en curso. */
const secciones = ['Reportes', 'Propuestas', 'Actividades'] as const;
type Seccion = (typeof secciones)[number];

/**
 * 4.1 Mis reportes.
 *
 * Reune todo lo que la persona tiene en curso. La lista separa lo abierto de lo
 * resuelto porque lo que interesa de un reporte propio es saber si avanzo.
 */
export default function MisReportes() {
  const { reportes, propuestas, actividades } = usarBarrio();
  const [seccion, setSeccion] = useState<Seccion>('Reportes');
  const [verResueltos, setVerResueltos] = useState(false);

  const mios = reportes.filter((reporte) => reporte.esMio);
  const abiertos = mios.filter((reporte) => reporte.estado !== 'resuelto');
  const resueltos = mios.filter((reporte) => reporte.estado === 'resuelto');
  const visibles = verResueltos ? resueltos : abiertos;

  const misPropuestas = propuestas.filter((propuesta) => propuesta.apoyadaPorMi);
  const misActividades = actividades.filter((actividad) => actividad.miInscripcion !== null);

  const cuantos: Record<Seccion, number> = {
    Reportes: mios.length,
    Propuestas: misPropuestas.length,
    Actividades: misActividades.length,
  };

  return (
    <Pantalla>
      <Columna
        separacion={14}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.comodo }}
      >
        <Texto tamano={30} familia="titulo">
          Mis reportes
        </Texto>
        <Fila separacion={espacio.normal}>
          {secciones.map((opcion) => (
            <Chip
              key={opcion}
              texto={`${opcion} · ${cuantos[opcion]}`}
              activo={seccion === opcion}
              onPress={() => setSeccion(opcion)}
              tamanoDeTexto={14}
            />
          ))}
        </Fila>
        {seccion === 'Reportes' ? (
          <Fila separacion={espacio.normal}>
            <Chip
              texto={`Abiertos · ${abiertos.length}`}
              activo={!verResueltos}
              onPress={() => setVerResueltos(false)}
            />
            <Chip
              texto={`Resueltos · ${resueltos.length}`}
              activo={verResueltos}
              onPress={() => setVerResueltos(true)}
            />
          </Fila>
        ) : null}
      </Columna>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingTop: espacio.apretado,
          paddingBottom: espacio.bloque,
          gap: espacio.comodo,
        }}
      >
        {seccion === 'Reportes'
          ? visibles.map((reporte) => (
              <TarjetaDeMiReporte
                key={reporte.id}
                reporte={reporte}
                conNovedad={reporte.estado === 'gestion'}
                onPress={() => router.push(`/reportes/${reporte.id}`)}
              />
            ))
          : null}

        {seccion === 'Propuestas'
          ? misPropuestas.map((propuesta) => (
              <Columna
                key={propuesta.id}
                separacion={espacio.corto}
                style={{
                  backgroundColor: colores.papel,
                  borderWidth: 1,
                  borderColor: colores.borde,
                  borderRadius: 20,
                  padding: espacio.amplio,
                }}
              >
                <Texto
                  tamano={16.5}
                  peso="fuerte"
                  onPress={() => router.push(`/propuestas/${propuesta.id}`)}
                >
                  {propuesta.titulo}
                </Texto>
                <Texto tamano={14} color={colores.grisTexto}>
                  {`La apoyas · ${propuesta.apoyos} apoyos en total`}
                </Texto>
              </Columna>
            ))
          : null}

        {seccion === 'Actividades'
          ? misActividades.map((actividad) => (
              <Columna
                key={actividad.id}
                separacion={espacio.corto}
                style={{
                  backgroundColor: colores.papel,
                  borderWidth: 1,
                  borderColor: colores.borde,
                  borderRadius: 20,
                  padding: espacio.amplio,
                }}
              >
                <Texto
                  tamano={16.5}
                  peso="fuerte"
                  onPress={() => router.push(`/actividades/${actividad.id}`)}
                >
                  {actividad.titulo}
                </Texto>
                <Texto tamano={14} color={colores.grisTexto}>
                  {`${actividad.diaSemana} ${actividad.dia} ${actividad.mes} · ${
                    actividad.miInscripcion === 'voluntario' ? 'Voluntaria' : 'Asistente'
                  }`}
                </Texto>
              </Columna>
            ))
          : null}

        {seccion === 'Reportes' && visibles.length === 0 ? (
          <Aviso
            tono="neutro"
            texto={
              verResueltos
                ? 'Todavía no tienes reportes resueltos.'
                : 'No tienes reportes abiertos. Toca Reportar para abrir uno.'
            }
          />
        ) : null}

        {seccion === 'Reportes' && !verResueltos && resueltos.length > 0 ? (
          <Aviso
            tono="logro"
            icono="visto"
            texto={`${resueltos.length} ${pluralizar(resueltos.length, 'reporte resuelto', 'reportes resueltos')} este mes`}
          />
        ) : null}
      </ScrollView>
    </Pantalla>
  );
}
```

#### `app/(barrio)/avisos.tsx`

7.1 Avisos. (150 líneas)

```tsx
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  Columna,
  Fila,
  Icono,
  Pantalla,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import type { Aviso, MomentoAviso } from '@/dominio/tipos';
import { usarBarrio } from '@/estado/barrio';

/** Titulo de cada grupo de la bandeja. */
const titulosDeMomento: Record<MomentoAviso, string> = {
  hoy: 'HOY',
  semana: 'ESTA SEMANA',
};

/**
 * 7.1 Avisos.
 *
 * Es la pieza que faltaba en las herramientas anteriores del barrio: el Banco
 * del Tiempo murio, entre otras cosas, porque no habia notificaciones. Aqui
 * cada aviso lleva a lo que lo origino.
 */
export default function Avisos() {
  const { avisos, marcarAvisoLeido, marcarTodosLosAvisosLeidos } = usarBarrio();

  const momentos: MomentoAviso[] = ['hoy', 'semana'];

  function abrir(aviso: Aviso) {
    marcarAvisoLeido(aviso.id);
    if (aviso.destino !== undefined) {
      router.push(aviso.destino as never);
    }
  }

  return (
    <Pantalla>
      <Fila
        repartir="space-between"
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.comodo }}
      >
        <Texto tamano={30} familia="titulo">
          Avisos
        </Texto>
        <Presionable
          onPress={marcarTodosLosAvisosLeidos}
          accessibilityRole="button"
          accessibilityLabel="Marcar todo como leído"
          style={{ minHeight: alturaTocable.minima, justifyContent: 'center' }}
        >
          <Texto tamano={15} peso="fuerte" color={colores.verde}>
            Marcar todo leído
          </Texto>
        </Presionable>
      </Fila>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingBottom: espacio.bloque,
          gap: espacio.comodo,
        }}
      >
        {momentos.map((momento) => {
          const delMomento = avisos.filter((aviso) => aviso.momento === momento);
          if (delMomento.length === 0) return null;

          return (
            <Columna key={momento} separacion={espacio.comodo} style={{ marginTop: espacio.normal }}>
              <Texto
                tamano={13}
                peso="fuerte"
                color={colores.grisTexto}
                espaciado={0.6}
                style={{ paddingHorizontal: espacio.apretado }}
              >
                {titulosDeMomento[momento]}
              </Texto>

              {delMomento.map((aviso) => (
                <Tarjeta
                  key={aviso.id}
                  onPress={() => abrir(aviso)}
                  accesibilidad={`${aviso.destacado} ${aviso.texto}`}
                  separacion={espacio.corto}
                  style={aviso.leido ? { opacity: 0.72 } : undefined}
                >
                  <Fila separacion={espacio.medio} alinear="flex-start">
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: radio.medio,
                        backgroundColor: aviso.fondo,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icono nombre={aviso.icono} tamano={22} color={aviso.color} />
                    </View>

                    <Columna crecer={1} separacion={espacio.apretado}>
                      <Texto tamano={16} interlineado={1.35}>
                        <Texto tamano={16} peso="fuerte">
                          {aviso.destacado}
                        </Texto>
                        {aviso.texto.startsWith('.') ? aviso.texto : ` ${aviso.texto}`}
                      </Texto>
                      <Texto tamano={13.5} color={colores.grisTexto}>
                        {aviso.cuando}
                      </Texto>
                      {aviso.pie === undefined ? null : (
                        <Texto tamano={14.5} peso="fuerte" color={colores.verde}>
                          {aviso.pie}
                        </Texto>
                      )}
                    </Columna>

                    {aviso.leido ? null : (
                      <View
                        accessible
                        accessibilityLabel="Sin leer"
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: radio.redondo,
                          backgroundColor: colores.alerta,
                          marginTop: espacio.corto,
                        }}
                      />
                    )}
                  </Fila>
                </Tarjeta>
              ))}
            </Columna>
          );
        })}
      </ScrollView>
    </Pantalla>
  );
}
```

### 17.12 Mapa

#### `app/mapa/capas.tsx`

2.3 Capas del mapa. (117 líneas)

```tsx
import { ScrollView } from 'react-native';

import { Encabezado } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  BotonCircular,
  Columna,
  Fila,
  FilaDeLista,
  Interruptor,
  ListaAgrupada,
  Pantalla,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 2.3 Capas del mapa.
 *
 * El segundo grupo son las capas del diagnostico socioambiental de 2022. La
 * organizacion dejara de pagar la plataforma donde viven hoy, asi que este es
 * el lugar donde ese catastro sigue estando disponible.
 */
export default function CapasDelMapa() {
  const volver = crearVolver('/mapa');
  const { capas, alternarCapa, restablecerCapas } = usarBarrio();

  const capasDeAhora = capas.filter((capa) => capa.grupo === 'ahora');
  const capasDelCatastro = capas.filter((capa) => capa.grupo === 'catastro');

  return (
    <Pantalla>
      <Encabezado
        titulo="Capas del mapa"
        accion={<BotonCircular icono="cerrar" accesibilidad="Cerrar" onPress={volver} />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.seccion,
          paddingTop: espacio.normal,
          paddingBottom: espacio.bloque,
          gap: espacio.seccion,
        }}
      >
        <ListaAgrupada encabezado="LO QUE PASA AHORA">
          {capasDeAhora.map((capa, posicion) => (
            <FilaDeLista
              key={capa.id}
              titulo={capa.nombre}
              detalle={capa.detalle === '' ? undefined : capa.detalle}
              ultima={posicion === capasDeAhora.length - 1}
              onPress={() => alternarCapa(capa.id)}
              control={
                <Interruptor
                  activo={capa.activa}
                  onCambiar={() => alternarCapa(capa.id)}
                  accesibilidad={capa.nombre}
                />
              }
            />
          ))}
        </ListaAgrupada>

        <Columna separacion={espacio.comodo}>
          <Columna separacion={espacio.minimo} style={{ paddingHorizontal: espacio.apretado }}>
            <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
              CATASTRO DEL BARRIO 2022
            </Texto>
            <Texto tamano={13.5} color={colores.grisTexto}>
              Diagnóstico socioambiental de República Circular
            </Texto>
          </Columna>

          <ListaAgrupada>
            {capasDelCatastro.map((capa, posicion) => (
              <FilaDeLista
                key={capa.id}
                titulo={capa.nombre}
                detalle={capa.detalle}
                ultima={posicion === capasDelCatastro.length - 1}
                onPress={() => alternarCapa(capa.id)}
                control={
                  <Interruptor
                    activo={capa.activa}
                    onCambiar={() => alternarCapa(capa.id)}
                    accesibilidad={capa.nombre}
                  />
                }
              />
            ))}
          </ListaAgrupada>

          <Aviso texto="Muchos de estos puntos no tienen su estado actual. Tócalos para ayudar a completarlo." />
        </Columna>
      </ScrollView>

      <BarraInferior>
        <Fila separacion={espacio.comodo}>
          <Boton
            texto="Restablecer"
            variante="secundaria"
            onPress={restablecerCapas}
            style={{ flex: 1 }}
          />
          <Boton texto="Ver en el mapa" onPress={volver} style={{ flex: 1.4 }} />
        </Fila>
      </BarraInferior>
    </Pantalla>
  );
}
```

#### `app/mapa/ficha.tsx`

2.4 Ficha del catastro. (309 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { G, Path, Rect, Text as TextoSvg } from 'react-native-svg';

import {
  Columna,
  Etiqueta,
  Fila,
  FilaDeLista,
  Icono,
  Presionable,
  Texto,
} from '@/componentes/base';
import { fichasDeCatastro } from '@/datos/catastro';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio, sombras } from '@/diseno/medidas';
import { familias } from '@/diseno/tipografia';
import { crearVolver } from '@/utiles/navegacion';

/** Alto del plano de contexto que se ve sobre la ficha. */
const ALTO_DEL_PLANO = 300;

/**
 * 2.4 Ficha del catastro.
 *
 * Cada elemento del diagnostico 2022 tiene su estado vacio en casi todos los
 * registros: 0 de 93 bancas, 0 de 172 semaforos, 4 de 218 basureros. Esta
 * pantalla es la que permite que un vecino complete ese dato con un toque.
 */
export default function FichaDelCatastro() {
  const volver = crearVolver('/mapa');
  const margenes = useSafeAreaInsets();
  const ficha = fichasDeCatastro[0];
  const [estadoDeHoy, setEstadoDeHoy] = useState<string | null>(null);

  if (ficha === undefined) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colores.mapaFondo }}>
      <PlanoDeContexto />

      <Presionable
        onPress={volver}
        accessibilityRole="button"
        accessibilityLabel="Volver al mapa"
        style={[
          {
            position: 'absolute',
            left: espacio.amplio,
            top: margenes.top + espacio.normal,
            width: 48,
            height: 48,
            borderRadius: radio.redondo,
            backgroundColor: colores.papel,
            alignItems: 'center',
            justifyContent: 'center',
          },
          sombras.flotante,
        ]}
      >
        <Icono nombre="flechaIzquierda" tamano={22} color={colores.tinta} />
      </Presionable>

      <View
        style={[
          {
            marginTop: 'auto',
            maxHeight: '72%',
            backgroundColor: colores.papel,
            borderTopLeftRadius: radio.hoja,
            borderTopRightRadius: radio.hoja,
            paddingTop: espacio.comodo,
          },
          sombras.hoja,
        ]}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 5,
            borderRadius: radio.redondo,
            backgroundColor: '#D6CDB8',
          }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: espacio.seccion,
            paddingTop: espacio.medio,
            paddingBottom: Math.max(margenes.bottom, espacio.amplio),
            gap: espacio.medio,
          }}
        >
          <Fila separacion={espacio.normal}>
            <Etiqueta texto={ficha.tipo} fondo={colores.menta} color="#174D34" />
            <Etiqueta texto={ficha.fuente} fondo={colores.crema} color={colores.grisTexto} />
          </Fila>

          <Texto tamano={24} familia="titulo" interlineado={1.15}>
            {ficha.direccion}
          </Texto>

          <Fila separacion={espacio.normal} alinear="stretch">
            <DatoDeFicha etiqueta="Estado anotado" valor={ficha.estadoAnotado} color="#8A5A12" />
            <DatoDeFicha etiqueta="Quién la cuida" valor={ficha.quienLoCuida} />
            <DatoDeFicha etiqueta="Última revisión" valor={ficha.ultimaRevision} />
          </Fila>

          <Columna
            separacion={espacio.medio}
            style={{ backgroundColor: colores.bosque, borderRadius: 20, padding: espacio.amplio }}
          >
            <Columna separacion={espacio.minimo}>
              <Texto tamano={18} peso="fuerte" color={colores.papel}>
                ¿Cómo está hoy?
              </Texto>
              <Texto tamano={14} color={colores.textoTenueSobreBosque}>
                Un toque y el registro del barrio queda al día
              </Texto>
            </Columna>

            <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
              {ficha.opcionesDeEstado.map((opcion) => (
                <BotonDeEstado
                  key={opcion}
                  texto={opcion}
                  activo={estadoDeHoy === opcion}
                  esNoSe={opcion === 'No sé'}
                  onPress={() => setEstadoDeHoy(opcion)}
                />
              ))}
            </Fila>

            <Texto tamano={13.5} color={colores.textoTenueSobreBosque}>
              {'Opcional: '}
              <Texto
                tamano={13.5}
                peso="fuerte"
                color={colores.brote}
                style={{ textDecorationLine: 'underline' }}
                onPress={() => router.push('/reportar/foto')}
              >
                agrega una foto
              </Texto>
            </Texto>
          </Columna>

          <View style={{ borderWidth: 1.5, borderColor: colores.borde, borderRadius: 18 }}>
            <FilaDeLista
              titulo="Proponer recuperarla"
              detalle={ficha.dato}
              ultima
              conFlecha
              onPress={() => router.push('/propuestas/nueva/idea')}
              adorno={
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radio.boton - 2,
                    backgroundColor: '#F5E6C8',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icono nombre="idea" tamano={22} color="#8A5A12" />
                </View>
              }
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

/** Cuadro de un dato de la ficha del catastro. */
function DatoDeFicha({
  etiqueta,
  valor,
  color = colores.tinta,
}: {
  etiqueta: string;
  valor: string;
  color?: string;
}) {
  return (
    <Columna
      crecer={1}
      separacion={espacio.minimo}
      style={{ backgroundColor: colores.crema, borderRadius: radio.boton, padding: espacio.comodo }}
    >
      <Texto tamano={12.5} color={colores.grisTexto}>
        {etiqueta}
      </Texto>
      <Texto tamano={15} peso="fuerte" color={color}>
        {valor}
      </Texto>
    </Columna>
  );
}

/** Opcion de actualizacion del estado. La alternativa "No sé" no compromete. */
function BotonDeEstado({
  texto,
  activo,
  esNoSe,
  onPress,
}: {
  texto: string;
  activo: boolean;
  esNoSe: boolean;
  onPress: () => void;
}) {
  return (
    <Presionable
      onPress={onPress}
      vibrar
      accessibilityRole="radio"
      accessibilityState={{ checked: activo }}
      accessibilityLabel={texto}
      style={{
        flexGrow: 1,
        flexBasis: '45%',
        minHeight: alturaTocable.boton,
        borderRadius: radio.boton,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: espacio.corto,
        ...(activo
          ? { backgroundColor: colores.menta, borderWidth: 3, borderColor: colores.brote }
          : esNoSe
            ? { borderWidth: 1.5, borderColor: colores.bosqueBorde }
            : { backgroundColor: colores.papel }),
      }}
    >
      {activo ? <Icono nombre="visto" tamano={18} color={colores.bosque} grosor={2.6} /> : null}
      <Texto
        tamano={15.5}
        peso="fuerte"
        color={activo ? colores.bosque : esNoSe ? colores.papel : colores.tinta}
      >
        {texto}
      </Texto>
    </Presionable>
  );
}

/** Acercamiento del plano a la cuadra de la ficha. */
function PlanoDeContexto() {
  return (
    <Svg
      width="100%"
      height={ALTO_DEL_PLANO}
      viewBox="0 0 390 300"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <Rect width={390} height={300} fill={colores.mapaFondo} />
      <G stroke={colores.mapaCalle} fill="none">
        <Path d="M0 200H390" strokeWidth={22} />
        <Path d="M0 60H390" strokeWidth={12} />
        <Path d="M80 0V300" strokeWidth={18} />
        <Path d="M300 0V300" strokeWidth={16} />
      </G>
      {/* La franja ocre es la platabanda y la verde, la vereda con jardin. */}
      <Rect x={96} y={182} width={190} height={7} rx={3} fill={colores.ocre} />
      <Rect x={96} y={211} width={190} height={7} rx={3} fill={colores.mapaVerde} />
      <Rect
        x={96}
        y={176}
        width={190}
        height={19}
        rx={6}
        fill="none"
        stroke={colores.bosque}
        strokeWidth={3}
      />
      <G fill={colores.mapaTexto}>
        <TextoSvg x={210} y={234} fontSize={10} fontFamily={familias.textoFuerte}>
          GRAJALES
        </TextoSvg>
        <TextoSvg
          x={86}
          y={120}
          fontSize={10}
          fontFamily={familias.textoFuerte}
          transform="rotate(90 86 120)"
        >
          AV. REPÚBLICA
        </TextoSvg>
        <TextoSvg
          x={306}
          y={110}
          fontSize={10}
          fontFamily={familias.textoFuerte}
          transform="rotate(90 306 110)"
        >
          AV. EJÉRCITO
        </TextoSvg>
      </G>
    </Svg>
  );
}
```

### 17.13 Asistente de reporte

#### `app/reportar/categoria.tsx`

3.1 Qué pasa. (162 líneas)

```tsx
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
```

#### `app/reportar/foto.tsx`

3.2 Foto. (182 líneas)

```tsx
import * as SelectorDeImagen from 'expo-image-picker';
import { router } from 'expo-router';
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
import { MAXIMO_DE_FOTOS } from '@/datos/fotosDeReporte';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 3.2 Foto.
 *
 * Es opcional a proposito. Una foto ayuda a reconocer el lugar, pero exigirla
 * dejaria fuera a quien reporta de paso o con poca bateria.
 */
export default function PasoFoto() {
  const volver = crearVolver('/reportar/categoria');
  const { reporte, cambiarReporte } = usarBorradores();
  // Las fotos viven en el borrador y no aqui: antes se guardaban en esta
  // pantalla y se perdian al avanzar, de modo que al publicar solo viajaba
  // cuantas eran.
  const imagenes = reporte.imagenes;

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
    cambiarReporte({ imagenes: siguientes });
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
```

#### `app/reportar/ubicacion.tsx`

3.3 Dónde. (205 líneas)

```tsx
import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapaBarrio } from '@/componentes/app';
import {
  BarraDePasos,
  Boton,
  BotonCircular,
  Columna,
  Fila,
  Icono,
  Presionable,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio, sombras } from '@/diseno/medidas';
import { ZOOM_PARA_UBICAR } from '@/dominio/barrio';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 3.3 Ubicacion.
 *
 * El punto queda fijo al centro y lo que se mueve es el plano. Es mas facil de
 * usar con una mano que arrastrar una chincheta chica.
 */
export default function PasoUbicacion() {
  const volver = crearVolver('/reportar/foto');
  const margenes = useSafeAreaInsets();
  const { reporte, cambiarReporte } = usarBorradores();

  function confirmar() {
    // Hay un reporte parecido a treinta metros, asi que antes de seguir se
    // pregunta si es el mismo. Evitar duplicados fue una decision explicita del
    // equipo, sin recurrir a deteccion automatica.
    cambiarReporte({ posibleDuplicado: 'microbasural-sazie' });
    router.push('/reportar/duplicado');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colores.mapaFondo }}>
      <MapaBarrio
        centro={reporte.posicion}
        zoom={ZOOM_PARA_UBICAR}
        alMoverse={(centro) => cambiarReporte({ posicion: centro })}
      />

      <Columna
        separacion={espacio.medio}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: colores.crema,
            paddingTop: margenes.top + espacio.medio,
            paddingHorizontal: espacio.seccion,
            paddingBottom: 14,
          },
          sombras.flotante,
        ]}
      >
        <Fila separacion={14}>
          <BotonCircular icono="flechaIzquierda" accesibilidad="Paso anterior" onPress={volver} />
          <Columna crecer={1} separacion={espacio.corto}>
            <Texto tamano={14} peso="fuerte" color={colores.verde}>
              Paso 3 de 5 · Dónde
            </Texto>
            <BarraDePasos paso={3} total={5} />
          </Columna>
        </Fila>
        <Texto tamano={28} familia="titulo" interlineado={1.1}>
          ¿Dónde está?
        </Texto>
        <Texto tamano={16} color={colores.grisTexto} style={{ marginTop: -espacio.apretado }}>
          Mueve el mapa hasta dejar el punto encima
        </Texto>
      </Columna>

      <ChinchetaCentral />

      <Presionable
        accessibilityRole="button"
        accessibilityLabel="Usar mi ubicación"
        style={[
          {
            position: 'absolute',
            right: espacio.amplio,
            bottom: 260,
            width: 52,
            height: 52,
            borderRadius: radio.caja,
            backgroundColor: colores.papel,
            alignItems: 'center',
            justifyContent: 'center',
          },
          sombras.flotante,
        ]}
      >
        <Icono nombre="mira" tamano={24} color={colores.ubicacionPropia} />
      </Presionable>

      <Columna
        separacion={espacio.medio}
        style={[
          {
            marginTop: 'auto',
            backgroundColor: colores.papel,
            borderTopLeftRadius: radio.hoja,
            borderTopRightRadius: radio.hoja,
            paddingTop: 18,
            paddingHorizontal: espacio.seccion,
            paddingBottom: Math.max(margenes.bottom, espacio.seccion),
          },
          sombras.hoja,
        ]}
      >
        <Fila separacion={espacio.medio}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: radio.boton,
              backgroundColor: colores.menta,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icono nombre="pin" tamano={24} color={colores.verde} />
          </View>
          <Columna crecer={1} separacion={espacio.minimo}>
            <Texto tamano={18} peso="fuerte">
              {reporte.direccion}
            </Texto>
            <Texto tamano={14.5} color={colores.grisTexto}>
              Barrio República, Santiago
            </Texto>
          </Columna>
        </Fila>
        <Boton texto="Confirmar ubicación" alto={56} tamanoDeTexto={18} onPress={confirmar} vibrar />
      </Columna>
    </View>
  );
}

/**
 * Chincheta fija al centro del plano, con su sombra en el suelo. Marca donde
 * va a quedar el reporte.
 */
function ChinchetaCentral() {
  return (
    <View
      pointerEvents="none"
      accessible={false}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={[
          {
            width: 48,
            height: 48,
            borderTopLeftRadius: radio.redondo,
            borderTopRightRadius: radio.redondo,
            borderBottomRightRadius: radio.redondo,
            borderBottomLeftRadius: 4,
            backgroundColor: colores.bosque,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: '-45deg' }],
          },
          sombras.media,
        ]}
      >
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: radio.redondo,
            backgroundColor: colores.brote,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
      <View
        style={{
          marginTop: espacio.corto,
          width: 16,
          height: 6,
          borderRadius: radio.redondo,
          backgroundColor: 'rgba(0,0,0,0.22)',
        }}
      />
    </View>
  );
}
```

#### `app/reportar/duplicado.tsx`

3.4 Posible duplicado. (117 líneas)

```tsx
import { router } from 'expo-router';
import { View } from 'react-native';

import { EtiquetaDeEstado, FotoSimulada, RotuloDeCategoria } from '@/componentes/app';
import {
  BarraInferior,
  Boton,
  Columna,
  EncabezadoDePaso,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 3.4 Posible duplicado.
 *
 * Se intercala entre el paso de ubicacion y el de detalles, y no consume un
 * paso propio. Confirmar un reporte existente le da mas prioridad y evita
 * llenar el mapa de chinchetas repetidas, que fue el criterio que el equipo
 * eligio en vez de detectar duplicados de forma automatica.
 */
export default function PasoDuplicado() {
  const volver = crearVolver('/reportar/ubicacion');
  const { reporte, reiniciarReporte } = usarBorradores();
  const { reportes, confirmarReporte } = usarBarrio();

  const parecido = reportes.find((otro) => otro.id === reporte.posibleDuplicado);

  function confirmarQueEsElMismo() {
    if (parecido !== undefined) {
      confirmarReporte(parecido.id);
      reiniciarReporte();
      router.dismissTo(`/reportes/${parecido.id}`);
    }
  }

  return (
    <Pantalla>
      <EncabezadoDePaso paso={3} total={5} nombre="Dónde" onVolver={volver} />

      <Columna
        separacion={espacio.normal}
        style={{ paddingHorizontal: espacio.bloque, paddingTop: 18 }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: radio.caja,
            backgroundColor: '#F5E6C8',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icono nombre="enlace" tamano={28} color="#8A5A12" />
        </View>
        <Texto tamano={28} familia="titulo" interlineado={1.1}>
          ¿Es el mismo problema?
        </Texto>
        <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
          Alguien ya reportó algo parecido a 30 metros de ese punto.
        </Texto>
      </Columna>

      {parecido === undefined ? null : (
        <Tarjeta recortar style={{ marginHorizontal: espacio.seccion, marginTop: espacio.amplio }}>
          <FotoSimulada alto={110} accesibilidad="Foto del reporte existente" />
          <Columna separacion={espacio.normal} style={{ padding: espacio.amplio }}>
            <Fila repartir="space-between">
              <RotuloDeCategoria categoria={parecido.categoria} detalle={parecido.subtipo} />
              <EtiquetaDeEstado estado={parecido.estado} />
            </Fila>
            <Texto tamano={17} peso="fuerte">
              {parecido.direccion}
            </Texto>
            <Texto tamano={14} color={colores.grisTexto}>
              {`${parecido.publicado} · ${parecido.confirmaciones} vecinos lo confirman`}
            </Texto>
            {parecido.descripcion === undefined ? null : (
              <Texto tamano={15} color={colores.grisTexto} interlineado={1.4}>
                {`«${parecido.descripcion}»`}
              </Texto>
            )}
          </Columna>
        </Tarjeta>
      )}

      <BarraInferior>
        <Texto tamano={14} color={colores.grisTexto} interlineado={1.4}>
          Si es el mismo, tu confirmación le da más prioridad y evitamos reportes repetidos.
        </Texto>
        <Boton
          texto="Sí, es el mismo. Lo confirmo"
          icono="visto"
          alto={56}
          tamanoDeTexto={17}
          onPress={confirmarQueEsElMismo}
          vibrar
        />
        <Boton
          texto="No, es otro problema"
          variante="secundaria"
          tamanoDeTexto={16.5}
          onPress={() => router.push('/reportar/detalles')}
        />
      </BarraInferior>
    </Pantalla>
  );
}
```

#### `app/reportar/detalles.tsx`

3.5 Detalles. (135 líneas)

```tsx
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { ChipDeCategoria } from '@/componentes/app';
import {
  BarraInferior,
  Boton,
  CampoTexto,
  Columna,
  EncabezadoDePaso,
  Fila,
  Opcion,
  Pantalla,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/** Las tres respuestas posibles sobre el origen del problema. */
const formasDeFormarse = ['Dejaron basura en la calle', 'Se rebalsó un basurero', 'No sé'];

/** Antiguedad del problema, en lenguaje cotidiano. */
const antiguedades = ['Hoy', 'Esta semana', 'Hace más de un mes'];

/**
 * 3.5 Detalles.
 *
 * Las preguntas son de alternativas y no de texto libre, para que el reporte
 * tarde menos de un minuto y para que los datos despues se puedan agrupar en el
 * observatorio.
 */
export default function PasoDetalles() {
  const volver = crearVolver('/reportar/ubicacion');
  const { reporte, cambiarReporte } = usarBorradores();

  return (
    <Pantalla>
      <EncabezadoDePaso paso={4} total={5} nombre="Detalles" onVolver={volver} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: espacio.seccion }}
        >
          <Columna
            separacion={espacio.normal}
            style={{ paddingHorizontal: espacio.bloque, paddingTop: 14 }}
          >
            {reporte.categoria === null ? null : <ChipDeCategoria categoria={reporte.categoria} />}
            <Texto tamano={32} familia="titulo" interlineado={1.08} style={{ marginTop: espacio.corto }}>
              Cuéntanos un poco más
            </Texto>
            <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
              Toca la opción que más se parezca.
            </Texto>
          </Columna>

          <Columna
            separacion={espacio.seccion}
            style={{ paddingHorizontal: espacio.seccion, paddingTop: espacio.seccion }}
          >
            <Columna separacion={espacio.comodo}>
              <Texto tamano={18} familia="tituloSemi">
                ¿Cómo se formó?
              </Texto>
              {formasDeFormarse.map((forma) => (
                <Opcion
                  key={forma}
                  texto={forma}
                  seleccion="unica"
                  activa={reporte.comoSeFormo === forma}
                  onPress={() => cambiarReporte({ comoSeFormo: forma })}
                />
              ))}
            </Columna>

            <Columna separacion={espacio.comodo}>
              <Texto tamano={18} familia="tituloSemi">
                ¿Desde cuándo lo ves?
              </Texto>
              <Fila separacion={espacio.comodo} alinear="stretch">
                {antiguedades.map((antiguedad) => (
                  <Opcion
                    key={antiguedad}
                    texto={antiguedad}
                    compacta
                    seleccion="unica"
                    activa={reporte.desdeCuando === antiguedad}
                    onPress={() => cambiarReporte({ desdeCuando: antiguedad })}
                    style={{ flex: 1 }}
                  />
                ))}
              </Fila>
            </Columna>

            <Columna separacion={espacio.comodo}>
              <Fila separacion={espacio.corto}>
                <Texto tamano={18} familia="tituloSemi">
                  ¿Algo más?
                </Texto>
                <Texto tamano={15} color={colores.grisTexto}>
                  (opcional)
                </Texto>
              </Fila>
              <CampoTexto
                valor={reporte.descripcion}
                onCambiar={(texto) => cambiarReporte({ descripcion: texto })}
                marcaDeAgua="Ej. se acumula los fines de semana"
                lineas={3}
                maximoDeCaracteres={300}
              />
            </Columna>
          </Columna>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior>
        <Boton
          texto="Siguiente"
          icono="flechaDerecha"
          iconoAlFinal
          alto={56}
          tamanoDeTexto={18}
          onPress={() => router.push('/reportar/revisar')}
        />
      </BarraInferior>
    </Pantalla>
  );
}
```

#### `app/reportar/revisar.tsx`

3.6 Revisar y enviar. (267 líneas)

```tsx
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
import { colores } from '@/diseno/colores';
import type { NombreIcono } from '@/diseno/iconos';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import { categorias } from '@/dominio/categorias';
import { usarBarrio } from '@/estado/barrio';
import { usarBorradores } from '@/estado/borradores';
import { usarQuienEntro } from '@/estado/sesion';
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
  const quienEntro = usarQuienEntro();

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
              texto={quienEntro.nombre}
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
```

#### `app/reportar/enviado.tsx`

3.7 Reporte enviado. (231 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import {
  BarraInferior,
  Boton,
  Columna,
  Fila,
  Icono,
  Interruptor,
  Presionable,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { idsDeEstado, estados } from '@/dominio/estados';
import { usarBarrio } from '@/estado/barrio';
import { usarPreferencias } from '@/estado/preferencias';
import { usarQuienEntro } from '@/estado/sesion';

/**
 * 3.7 Reporte enviado.
 *
 * Cierra el flujo mostrando el recorrido completo que le espera al reporte. Es
 * la promesa de retorno que la aplicacion tiene que cumplir despues: sin ella,
 * el vecino reporta una vez y no vuelve.
 */
export default function ReporteEnviado() {
  const margenes = useSafeAreaInsets();
  const { ultimoReportePublicado } = usarBarrio();
  const { menosAnimaciones } = usarPreferencias();
  const quienEntro = usarQuienEntro();
  const [avisosActivos, setAvisosActivos] = useState(true);

  const animar = !menosAnimaciones;

  return (
    <View style={{ flex: 1, backgroundColor: colores.crema }}>
      <Columna
        alinear="center"
        separacion={espacio.medio}
        style={{
          backgroundColor: colores.bosque,
          paddingTop: margenes.top + espacio.bloque,
          paddingHorizontal: espacio.bloque,
          paddingBottom: 28,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Animated.View entering={animar ? ZoomIn.duration(420) : undefined}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: radio.redondo,
              backgroundColor: colores.brote,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 12,
              borderColor: colores.bosqueClaro,
            }}
          >
            <Icono nombre="visto" tamano={44} color={colores.bosque} grosor={2.6} />
          </View>
        </Animated.View>

        <Texto
          tamano={34}
          familia="titulo"
          color={colores.papel}
          alineacion="center"
          interlineado={1.05}
          style={{ marginTop: espacio.comodo }}
        >
          {`¡Listo, ${quienEntro.nombre}!`}
        </Texto>
        <Texto
          tamano={17}
          color={colores.textoSobreBosque}
          alineacion="center"
          interlineado={1.45}
        >
          Tu reporte ya está en el mapa del barrio. Te avisaremos cada vez que avance.
        </Texto>
      </Columna>

      <Animated.View entering={animar ? FadeIn.delay(200).duration(400) : undefined}>
        <Columna
          separacion={14}
          style={{
            marginHorizontal: espacio.seccion,
            marginTop: 18,
            backgroundColor: colores.papel,
            borderWidth: 1,
            borderColor: colores.borde,
            borderRadius: 20,
            padding: espacio.amplio,
          }}
        >
          <Texto tamano={15} peso="fuerte" color={colores.grisTexto} espaciado={0.4}>
            EN QUÉ VA
          </Texto>
          <Fila alinear="flex-start">
            {idsDeEstado.map((id) => {
              const alcanzado = estados[id].paso === 1;
              return (
                <Columna key={id} crecer={1} alinear="center" separacion={espacio.corto}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: radio.redondo,
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...(alcanzado
                        ? { backgroundColor: colores.verde, borderWidth: 5, borderColor: colores.menta }
                        : {
                            backgroundColor: colores.papel,
                            borderWidth: 2,
                            borderColor: colores.bordeFuerte,
                          }),
                    }}
                  >
                    {alcanzado ? (
                      <Icono nombre="visto" tamano={16} color={colores.blanco} grosor={2.8} />
                    ) : null}
                  </View>
                  <Texto
                    tamano={13.5}
                    peso={alcanzado ? 'fuerte' : 'normal'}
                    color={alcanzado ? colores.tinta : colores.grisTexto}
                    alineacion="center"
                  >
                    {estados[id].etiqueta}
                  </Texto>
                </Columna>
              );
            })}
          </Fila>
        </Columna>
      </Animated.View>

      <Presionable
        onPress={() => router.replace('/propuestas/nueva/idea')}
        accessibilityRole="button"
        accessibilityLabel="¿Tienes una idea para resolverlo? Propónla"
        style={{
          marginHorizontal: espacio.seccion,
          marginTop: espacio.medio,
          backgroundColor: '#F5E6C8',
          borderRadius: 20,
          padding: espacio.amplio,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: radio.boton,
            backgroundColor: colores.ocre,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icono nombre="idea" tamano={24} color={colores.blanco} />
        </View>
        <Columna crecer={1} separacion={espacio.minimo}>
          <Texto tamano={17} peso="fuerte" color="#3E2A08">
            ¿Tienes una idea para resolverlo?
          </Texto>
          <Texto tamano={14.5} color="#3E2A08" interlineado={1.35}>
            Propónla y otros vecinos pueden apoyarla
          </Texto>
        </Columna>
        <Icono nombre="flechaDerecha" tamano={22} color="#3E2A08" />
      </Presionable>

      <Fila
        separacion={espacio.medio}
        style={{
          marginHorizontal: espacio.seccion,
          marginTop: espacio.medio,
          backgroundColor: colores.papel,
          borderWidth: 1,
          borderColor: colores.borde,
          borderRadius: 20,
          paddingVertical: 14,
          paddingHorizontal: espacio.amplio,
        }}
      >
        <Icono nombre="campana" tamano={24} color={colores.verde} />
        <Texto tamano={15} interlineado={1.35} style={{ flex: 1 }}>
          Avisos activados para este reporte
        </Texto>
        <Interruptor
          activo={avisosActivos}
          onCambiar={setAvisosActivos}
          accesibilidad="Avisos de este reporte"
        />
      </Fila>

      <BarraInferior fondo={colores.crema} style={{ borderTopWidth: 0 }}>
        <Boton
          texto="Ver mi reporte"
          alto={56}
          tamanoDeTexto={18}
          onPress={() =>
            router.replace(
              ultimoReportePublicado === null
                ? '/mis-reportes'
                : `/reportes/${ultimoReportePublicado}`,
            )
          }
        />
        <Boton
          texto="Volver al inicio"
          variante="secundaria"
          tamanoDeTexto={17}
          onPress={() => router.replace('/inicio')}
        />
      </BarraInferior>
    </View>
  );
}
```

#### `app/reportes/[id].tsx`

4.2 Detalle y 4.3 Reporte resuelto. (338 líneas)

```tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  Avatar,
  Encabezado,
  EtiquetaDeEstado,
  FotoSimulada,
  LineaDeTiempo,
  RotuloDeCategoria,
} from '@/componentes/app';
import {
  Aviso,
  Boton,
  BotonCircular,
  Columna,
  Etiqueta,
  Fila,
  Pantalla,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { personas } from '@/datos/personas';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { etapas } from '@/dominio/estados';
import { usarBarrio, usarReporte } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 4.2 Detalle y estado del reporte, y 4.3 cuando ya esta resuelto.
 *
 * Es la pantalla que sostiene la promesa de la aplicacion: aqui se ve quien
 * hizo que y cuando. Un reporte resuelto muestra ademas el antes y el despues,
 * la evidencia de cierre.
 */
export default function DetalleDeReporte() {
  const volver = crearVolver('/mis-reportes');
  const { id } = useLocalSearchParams<{ id: string }>();
  const reporte = usarReporte(id);
  const { propuestas, confirmarReporte, descartarReporte } = usarBarrio();
  const [respondido, setRespondido] = useState(false);

  if (reporte === undefined) {
    return (
      <Pantalla>
        <Encabezado titulo="Reporte no encontrado" onVolver={volver} />
      </Pantalla>
    );
  }

  const estaResuelto = reporte.estado === 'resuelto';
  const propuestasRelacionadas = propuestas.filter((propuesta) =>
    reporte.propuestas.includes(propuesta.id),
  );

  return (
    <Pantalla desplazable espacioAlFinal={espacio.bloque}>
      <Fila
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.amplio, paddingBottom: espacio.medio }}
      >
        <BotonCircular icono="flechaIzquierda" accesibilidad="Volver" onPress={volver} />
        <View style={{ flex: 1 }} />
        <BotonCircular icono="compartir" accesibilidad="Compartir" />
      </Fila>

      {reporte.tieneFoto ? (
        estaResuelto ? (
          <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.amplio }}>
            <FotoSimulada
              alto={150}
              rotulo="Antes · 3 nov"
              accesibilidad="Foto antes de resolver"
              style={{ flex: 1, borderRadius: radio.caja, overflow: 'hidden' }}
            />
            <FotoSimulada
              alto={150}
              rotulo="Después · 12 nov"
              accesibilidad="Foto después de resolver"
              style={{ flex: 1, borderRadius: radio.caja, overflow: 'hidden' }}
            />
          </Fila>
        ) : (
          <FotoSimulada
            alto={200}
            accesibilidad="Foto del reporte"
            style={{
              marginHorizontal: espacio.amplio,
              borderRadius: radio.tarjeta,
              overflow: 'hidden',
            }}
          />
        )
      ) : null}

      <Columna
        separacion={espacio.normal}
        style={{ paddingHorizontal: espacio.amplio, paddingTop: espacio.amplio }}
      >
        <Fila repartir="space-between" separacion={espacio.normal}>
          <RotuloDeCategoria
            categoria={reporte.categoria}
            detalle={reporte.subtipo}
          />
          <EtiquetaDeEstado estado={reporte.estado} alto={30} tamanoDeTexto={13.5} />
        </Fila>
        <Texto tamano={28} familia="titulo" interlineado={1.1}>
          {reporte.titulo}
        </Texto>
        <Texto tamano={14.5} color={colores.grisTexto}>
          {`Reportado por ${reporte.autor?.nombre ?? 'alguien anónimo'} · ${reporte.publicado}`}
        </Texto>
      </Columna>

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: 18 }} relleno={18}>
        <Texto tamano={21} familia="tituloSemi">
          {estaResuelto ? 'Qué se hizo' : '¿En qué va?'}
        </Texto>
        <LineaDeTiempo reporte={reporte} />
      </Tarjeta>

      {estaResuelto ? (
        <Columna
          separacion={espacio.medio}
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
        >
          <Tarjeta tono="menta">
            <Fila separacion={espacio.medio}>
              <Avatar persona={personas.republicaCircular} tamano={44} />
              <Columna crecer={1} separacion={espacio.minimo}>
                <Texto tamano={16.5} peso="fuerte" color="#174D34">
                  {personas.republicaCircular.nombre}
                </Texto>
                <Texto tamano={13.5} color="#174D34">
                  {personas.republicaCircular.vinculo}
                </Texto>
              </Columna>
            </Fila>
          </Tarjeta>

          <Tarjeta>
            <Texto tamano={17} peso="fuerte">
              ¿Quedó bien resuelto?
            </Texto>
            <Fila separacion={espacio.normal}>
              {['Sí', 'A medias', 'No'].map((opcion) => (
                <Boton
                  key={opcion}
                  texto={opcion}
                  variante="secundaria"
                  alto={48}
                  onPress={() => setRespondido(true)}
                  style={{ flex: 1 }}
                />
              ))}
            </Fila>
            {respondido ? (
              <Aviso tono="logro" texto="Gracias, tu respuesta quedó registrada." />
            ) : null}
          </Tarjeta>

          <Aviso
            tono="neutro"
            icono="reloj"
            texto="Este punto queda en observación por 30 días. Si vuelve la basura, avísanos y el reporte se reabre."
          />
          <Boton texto="Volvió a aparecer" variante="secundaria" icono="bandera" />
        </Columna>
      ) : (
        <Tarjeta
          tono="bosque"
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
          relleno={espacio.amplio}
        >
          <Columna separacion={espacio.minimo}>
            <Texto tamano={17} peso="fuerte" color={colores.papel}>
              ¿Sigue ahí?
            </Texto>
            <Texto tamano={14} color={colores.textoTenueSobreBosque}>
              {respondido
                ? 'Gracias, tu respuesta ya se sumó'
                : `${reporte.confirmaciones} vecinos lo confirman`}
            </Texto>
          </Columna>
          {respondido ? null : (
            <Fila separacion={espacio.comodo}>
              <Boton
                texto="Sí, sigue"
                variante="brote"
                alto={50}
                onPress={() => {
                  confirmarReporte(reporte.id);
                  setRespondido(true);
                }}
                vibrar
                style={{ flex: 1, backgroundColor: colores.papel }}
              />
              <Boton
                texto="Ya no está"
                variante="contornoClaro"
                alto={50}
                onPress={() => {
                  descartarReporte(reporte.id);
                  setRespondido(true);
                }}
                vibrar
                style={{ flex: 1 }}
              />
            </Fila>
          )}
        </Tarjeta>
      )}

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
        <Texto tamano={21} familia="tituloSemi">
          Detalles
        </Texto>
        <Fila separacion={espacio.normal} alinear="stretch">
          <DatoBreve etiqueta="Cómo se formó" valor={reporte.comoSeFormo ?? 'Sin dato'} />
          <DatoBreve etiqueta="Desde" valor={reporte.desdeCuando ?? 'Sin dato'} />
        </Fila>
        {reporte.descripcion === undefined ? null : (
          <Texto tamano={15.5} color={colores.grisTexto} interlineado={1.4}>
            {`«${reporte.descripcion}»`}
          </Texto>
        )}
        <Boton
          texto="Ver en el mapa"
          variante="secundaria"
          icono="mapa"
          onPress={() => router.push('/mapa')}
        />
      </Tarjeta>

      <Columna
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
      >
        <Texto tamano={21} familia="tituloSemi">
          {`Ideas para resolverlo · ${propuestasRelacionadas.length}`}
        </Texto>
        {propuestasRelacionadas.map((propuesta) => (
          <Tarjeta
            key={propuesta.id}
            onPress={() => router.push(`/propuestas/${propuesta.id}`)}
            accesibilidad={propuesta.titulo}
            separacion={espacio.normal}
          >
            <Texto tamano={16.5} peso="fuerte" interlineado={1.3}>
              {propuesta.titulo}
            </Texto>
            <Fila separacion={espacio.normal}>
              <Etiqueta
                texto={etapas[propuesta.etapa].etiqueta}
                fondo={etapas[propuesta.etapa].fondo}
                color={etapas[propuesta.etapa].texto}
              />
              <Texto tamano={14} color={colores.grisTexto}>
                {`${propuesta.apoyos} apoyos`}
              </Texto>
            </Fila>
          </Tarjeta>
        ))}
        <Boton
          texto="Proponer otra idea"
          variante="secundaria"
          icono="mas"
          onPress={() => router.push('/propuestas/nueva/idea')}
        />
      </Columna>

      <Columna
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
      >
        <Texto tamano={21} familia="tituloSemi">
          {`Comentarios · ${reporte.comentarios.length}`}
        </Texto>
        {reporte.comentarios.slice(0, 1).map((comentario) => (
          <Tarjeta key={comentario.id} separacion={espacio.normal}>
            <Fila separacion={espacio.comodo}>
              <Avatar persona={comentario.autor} tamano={36} />
              <Texto tamano={14.5} color={colores.grisTexto} style={{ flex: 1 }}>
                <Texto tamano={14.5} peso="fuerte">
                  {comentario.autor.nombre}
                </Texto>
                {` · ${comentario.autor.vinculo} · ${comentario.cuando}`}
              </Texto>
            </Fila>
            <Texto tamano={15.5} interlineado={1.4}>
              {comentario.texto}
            </Texto>
          </Tarjeta>
        ))}
        {reporte.comentarios.length > 1 ? (
          <Presionable
            accessibilityRole="button"
            accessibilityLabel={`Ver los ${reporte.comentarios.length} comentarios`}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <Texto tamano={16} peso="fuerte" color={colores.verde}>
              {`Ver los ${reporte.comentarios.length} comentarios`}
            </Texto>
          </Presionable>
        ) : null}
      </Columna>

      <Fila
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.seccion }}
      >
        <Boton texto="Siguiendo" variante="tonal" icono="campana" style={{ flex: 1 }} />
        <Boton texto="Compartir" variante="secundaria" icono="compartir" style={{ flex: 1 }} />
      </Fila>
    </Pantalla>
  );
}

/** Dato corto del bloque de detalles. */
function DatoBreve({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <Columna
      crecer={1}
      separacion={espacio.minimo}
      style={{ backgroundColor: colores.crema, borderRadius: radio.boton, padding: espacio.comodo }}
    >
      <Texto tamano={12.5} color={colores.grisTexto}>
        {etiqueta}
      </Texto>
      <Texto tamano={15} peso="fuerte">
        {valor}
      </Texto>
    </Columna>
  );
}
```

### 17.14 Propuestas

#### `app/propuestas/index.tsx`

5.1 Propuestas del barrio. (112 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { FilaDePropuesta } from '@/componentes/app';
import {
  Aviso,
  Boton,
  BotonCircular,
  Chip,
  Columna,
  Fila,
  Pantalla,
  Texto,
} from '@/componentes/base';
import { ejesDePropuesta } from '@/datos/propuestas';
import { espacio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 5.1 Propuestas del barrio.
 *
 * Van ordenadas por apoyos y por cuantos reportes del mismo problema responden.
 * Ese criterio mezclado, deliberacion mas frecuencia, es el que el equipo
 * acordo con la contraparte para definir que significa priorizada.
 */
export default function Propuestas() {
  const volver = crearVolver('/inicio');
  const { propuestas } = usarBarrio();
  const { reiniciarPropuesta } = usarBorradores();
  const [eje, setEje] = useState<string>('Todas');

  const visibles = propuestas
    .filter((propuesta) => eje === 'Todas' || propuesta.eje === eje)
    .slice()
    .sort((una, otra) => otra.apoyos + otra.reportesQueResuelve * 3 - (una.apoyos + una.reportesQueResuelve * 3));

  function proponer() {
    reiniciarPropuesta();
    router.push('/propuestas/nueva/idea');
  }

  return (
    <Pantalla>
      <Fila
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}
      >
        <BotonCircular icono="flechaIzquierda" accesibilidad="Volver" onPress={volver} />
        <Texto tamano={28} familia="titulo" style={{ flex: 1 }}>
          Propuestas
        </Texto>
        <Boton
          texto="Proponer"
          icono="mas"
          alto={44}
          tamanoDeTexto={15}
          ancho="contenido"
          onPress={proponer}
        />
      </Fila>

      <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.seccion }}>
        {ejesDePropuesta.map((opcion) => (
          <Chip
            key={opcion}
            texto={opcion}
            activo={eje === opcion}
            onPress={() => setEje(opcion)}
            tamanoDeTexto={14}
          />
        ))}
      </Fila>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingTop: espacio.medio,
          paddingBottom: espacio.bloque,
          gap: espacio.comodo,
        }}
      >
        <Aviso
          tono="neutro"
          texto="Ordenadas por apoyos y reportes del mismo problema"
          tamanoDeTexto={13.5}
        />

        {visibles.map((propuesta, posicion) => (
          <FilaDePropuesta
            key={propuesta.id}
            propuesta={propuesta}
            orden={posicion + 1}
            onPress={() => router.push(`/propuestas/${propuesta.id}`)}
          />
        ))}

        {visibles.length === 0 ? (
          <Columna separacion={espacio.comodo} style={{ paddingTop: espacio.seccion }}>
            <Texto tamano={16} alineacion="center">
              Todavía no hay propuestas en este eje.
            </Texto>
            <Boton texto="Proponer la primera" onPress={proponer} />
          </Columna>
        ) : null}
      </ScrollView>
    </Pantalla>
  );
}
```

#### `app/propuestas/nueva/idea.tsx`

5.2 Nueva propuesta, idea. (160 líneas)

```tsx
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { MarcaDeCategoria } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  CampoTexto,
  Columna,
  EncabezadoDePaso,
  Fila,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { usarBorradores } from '@/estado/borradores';

/** Largo maximo de la explicacion, igual que en el mockup. */
const MAXIMO_DE_LA_IDEA = 500;

/**
 * 5.2 Nueva propuesta, primer paso.
 *
 * La propuesta nace enganchada a un problema concreto, no en el aire. Esa es la
 * diferencia con una caja de sugerencias: cada idea responde a reportes que ya
 * existen en el mapa.
 */
export default function NuevaPropuestaIdea() {
  const { propuesta, cambiarPropuesta, reiniciarPropuesta } = usarBorradores();
  const { reportes } = usarBarrio();

  const reporteDeOrigen =
    reportes.find((reporte) => reporte.id === propuesta.reporteDeOrigen) ??
    reportes.find((reporte) => reporte.id === 'microbasural-sazie');

  function cancelar() {
    reiniciarPropuesta();
    router.back();
  }

  return (
    <Pantalla>
      <EncabezadoDePaso
        paso={1}
        total={3}
        nombre="Tu idea"
        esPrimerPaso
        textoDeCancelar="Cancelar propuesta"
        onVolver={cancelar}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: espacio.seccion }}
        >
          <Texto
            tamano={32}
            familia="titulo"
            interlineado={1.08}
            style={{ marginTop: 14, marginHorizontal: espacio.bloque, marginBottom: 14 }}
          >
            ¿Cómo lo resolverías?
          </Texto>

          <Columna separacion={espacio.corto} style={{ paddingHorizontal: espacio.seccion }}>
            <Texto tamano={15} peso="fuerte">
              Problema que quieres resolver
            </Texto>
            {reporteDeOrigen === undefined ? null : (
              <Fila
                separacion={espacio.medio}
                style={{
                  backgroundColor: colores.papel,
                  borderWidth: 1,
                  borderColor: colores.borde,
                  borderRadius: radio.caja,
                  paddingVertical: espacio.comodo,
                  paddingHorizontal: espacio.medio,
                }}
              >
                <MarcaDeCategoria
                  categoria={reporteDeOrigen.categoria}
                  tamano={38}
                  redondeo={radio.medio}
                />
                <Columna crecer={1}>
                  <Texto tamano={15.5} peso="fuerte">
                    {reporteDeOrigen.titulo}
                  </Texto>
                  <Texto tamano={13.5} color={colores.grisTexto}>
                    y 5 reportes parecidos cerca
                  </Texto>
                </Columna>
                <Presionable
                  onPress={() => router.push('/mapa')}
                  accessibilityRole="button"
                  accessibilityLabel="Cambiar el problema que quieres resolver"
                  style={{ minHeight: alturaTocable.minima, justifyContent: 'center' }}
                >
                  <Texto tamano={14.5} peso="fuerte" style={{ textDecorationLine: 'underline' }}>
                    Cambiar
                  </Texto>
                </Presionable>
              </Fila>
            )}
          </Columna>

          <Columna
            separacion={espacio.amplio}
            style={{ paddingHorizontal: espacio.seccion, paddingTop: espacio.amplio }}
          >
            <CampoTexto
              etiqueta="Tu idea en una frase"
              valor={propuesta.titulo}
              onCambiar={(texto) => cambiarPropuesta({ titulo: texto })}
              marcaDeAgua="Ej. punto limpio vecinal en la esquina"
            />
            <CampoTexto
              etiqueta="¿Cómo funcionaría?"
              valor={propuesta.idea}
              onCambiar={(texto) => cambiarPropuesta({ idea: texto })}
              lineas={5}
              maximoDeCaracteres={MAXIMO_DE_LA_IDEA}
              ayuda={`${propuesta.idea.length} / ${MAXIMO_DE_LA_IDEA}`}
            />
            <Aviso
              tono="neutro"
              icono="personas"
              texto="No tiene que estar perfecta. Los vecinos te ayudarán a mejorarla en la conversación."
            />
          </Columna>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior>
        <Boton
          texto="Siguiente"
          icono="flechaDerecha"
          iconoAlFinal
          alto={56}
          tamanoDeTexto={18}
          deshabilitado={propuesta.titulo.trim().length === 0}
          onPress={() => {
            cambiarPropuesta({ reporteDeOrigen: reporteDeOrigen?.id ?? null });
            router.push('/propuestas/nueva/necesita');
          }}
        />
      </BarraInferior>
    </Pantalla>
  );
}
```

#### `app/propuestas/nueva/necesita.tsx`

5.3 Nueva propuesta, qué se necesita. (183 líneas)

```tsx
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  BarraInferior,
  Boton,
  Chip,
  Columna,
  EncabezadoDePaso,
  Contador,
  Fila,
  Icono,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { disciplinas, tiposDeApoyo } from '@/datos/propuestas';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarBorradores } from '@/estado/borradores';
import { crearVolver } from '@/utiles/navegacion';

/** Color de la divisoria entre filas de la tarjeta de apoyos. */
const COLOR_DIVISORIA = '#EEE7D7';

/**
 * 5.3 Nueva propuesta, segundo paso.
 *
 * Declarar que se necesita es lo que permite despues que una universidad o un
 * local encuentren donde calzan. Sin esta pantalla el modulo de vinculacion no
 * tendria con que trabajar.
 */
export default function NuevaPropuestaNecesita() {
  const volver = crearVolver('/propuestas/nueva/idea');
  const { propuesta, cambiarPropuesta } = usarBorradores();

  function alternarApoyo(titulo: string) {
    const actuales = propuesta.apoyosNecesarios;
    cambiarPropuesta({
      apoyosNecesarios: actuales.includes(titulo)
        ? actuales.filter((otro) => otro !== titulo)
        : [...actuales, titulo],
    });
  }

  function alternarDisciplina(nombre: string) {
    const actuales = propuesta.disciplinas;
    cambiarPropuesta({
      disciplinas: actuales.includes(nombre)
        ? actuales.filter((otra) => otra !== nombre)
        : [...actuales, nombre],
    });
  }

  return (
    <Pantalla>
      <EncabezadoDePaso paso={2} total={3} nombre="Qué se necesita" onVolver={volver} />

      <Columna style={{ paddingHorizontal: espacio.bloque, paddingTop: 14 }}>
        <Texto tamano={32} familia="titulo" interlineado={1.08}>
          ¿Qué se necesita?
        </Texto>
        <Texto tamano={16} color={colores.grisTexto} interlineado={1.4}>
          Así vecinos, locales y universidades saben cómo sumarse.
        </Texto>
      </Columna>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.seccion,
          paddingTop: espacio.amplio,
          paddingBottom: espacio.seccion,
          gap: espacio.amplio,
        }}
      >
        <View
          style={{
            backgroundColor: colores.papel,
            borderWidth: 1,
            borderColor: colores.borde,
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          {tiposDeApoyo.map((tipo, posicion) => {
            const elegido = propuesta.apoyosNecesarios.includes(tipo.titulo);
            return (
              <Fila
                key={tipo.id}
                separacion={espacio.medio}
                style={{
                  minHeight: 60,
                  paddingVertical: espacio.normal,
                  paddingHorizontal: 14,
                  ...(posicion === tiposDeApoyo.length - 1
                    ? null
                    : { borderBottomWidth: 1, borderBottomColor: COLOR_DIVISORIA }),
                }}
              >
                <Presionable
                  onPress={() => alternarApoyo(tipo.titulo)}
                  escalaAlTocar={0.995}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: elegido }}
                  accessibilityLabel={tipo.titulo}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: espacio.medio }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      borderWidth: 2,
                      borderColor: elegido ? colores.verde : colores.bordeFuerte,
                      backgroundColor: elegido ? colores.verde : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {elegido ? (
                      <Icono nombre="visto" tamano={15} color={colores.papel} grosor={3} />
                    ) : null}
                  </View>
                  <Columna crecer={1}>
                    <Texto tamano={16.5} peso="fuerte">
                      {tipo.titulo}
                    </Texto>
                    <Texto tamano={13.5} color={colores.grisTexto}>
                      {tipo.detalle}
                    </Texto>
                  </Columna>
                </Presionable>

                {tipo.conCantidad && elegido ? (
                  <Contador
                    valor={propuesta.voluntarios}
                    onCambiar={(valor) => cambiarPropuesta({ voluntarios: valor })}
                    minimo={1}
                    accesibilidad="manos voluntarias"
                  />
                ) : null}
              </Fila>
            );
          })}
        </View>

        <Columna separacion={espacio.normal}>
          <Texto tamano={16} peso="fuerte">
            ¿Qué conocimientos ayudarían?
          </Texto>
          <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
            {disciplinas.map((nombre) => {
              const elegida = propuesta.disciplinas.includes(nombre);
              return (
                <Chip
                  key={nombre}
                  texto={nombre}
                  activo={elegida}
                  icono={elegida ? 'visto' : undefined}
                  onPress={() => alternarDisciplina(nombre)}
                  alto={42}
                  variante="marcado"
                />
              );
            })}
          </Fila>
        </Columna>
      </ScrollView>

      <BarraInferior>
        <Boton
          texto="Revisar y publicar"
          icono="flechaDerecha"
          iconoAlFinal
          alto={56}
          tamanoDeTexto={18}
          onPress={() => router.push('/propuestas/nueva/revisar')}
        />
      </BarraInferior>
    </Pantalla>
  );
}
```

#### `app/propuestas/nueva/revisar.tsx`

Paso 3, vista previa antes de publicar. (149 líneas)

```tsx
import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { Avatar, EtiquetaDeEtapa } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  Chip,
  Columna,
  EncabezadoDePaso,
  Fila,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { usarBorradores } from '@/estado/borradores';
import { usarQuienEntro } from '@/estado/sesion';
import { crearVolver } from '@/utiles/navegacion';

/**
 * Tercer paso de la propuesta: vista previa antes de publicar.
 *
 * Los mockups numeran este flujo como "Paso X de 3" pero solo dibujan los dos
 * primeros. Esta pantalla completa la numeracion mostrando como va a quedar la
 * propuesta, sin pedir nada nuevo.
 */
export default function RevisarPropuesta() {
  const volver = crearVolver('/propuestas/nueva/necesita');
  const { propuesta, reiniciarPropuesta } = usarBorradores();
  const { publicarPropuesta } = usarBarrio();
  const quienEntro = usarQuienEntro();

  function publicar() {
    const id = publicarPropuesta({
      titulo: propuesta.titulo,
      idea: propuesta.idea,
      eje: propuesta.eje,
      reporteDeOrigen: propuesta.reporteDeOrigen ?? undefined,
      apoyosNecesarios: propuesta.apoyosNecesarios,
      voluntarios: propuesta.voluntarios,
      disciplinas: propuesta.disciplinas,
    });
    reiniciarPropuesta();
    router.dismissTo(`/propuestas/${id}`);
  }

  return (
    <Pantalla>
      <EncabezadoDePaso paso={3} total={3} nombre="Revisar" onVolver={volver} />

      <Texto
        tamano={32}
        familia="titulo"
        interlineado={1.08}
        style={{ marginTop: 14, marginHorizontal: espacio.bloque, marginBottom: 14 }}
      >
        Así la verán tus vecinos
      </Texto>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingBottom: espacio.seccion,
          gap: espacio.medio,
        }}
      >
        <Tarjeta>
          <Fila separacion={espacio.normal}>
            <EtiquetaDeEtapa etapa="idea" />
            <Texto tamano={13} color={colores.grisTexto}>
              {propuesta.eje}
            </Texto>
          </Fila>
          <Texto tamano={22} familia="titulo" interlineado={1.2}>
            {propuesta.titulo}
          </Texto>
          <Fila separacion={espacio.comodo}>
            <Avatar persona={quienEntro} tamano={36} />
            <Columna crecer={1}>
              <Texto tamano={15} peso="fuerte">
                {quienEntro.nombre}
              </Texto>
              <Texto tamano={13.5} color={colores.grisTexto}>
                {quienEntro.vinculo}
              </Texto>
            </Columna>
          </Fila>
          {propuesta.idea === '' ? null : (
            <Texto tamano={16} interlineado={1.45}>
              {propuesta.idea}
            </Texto>
          )}
        </Tarjeta>

        {propuesta.apoyosNecesarios.length === 0 ? null : (
          <Tarjeta>
            <Texto tamano={18} familia="tituloSemi">
              Qué se necesita
            </Texto>
            {propuesta.apoyosNecesarios.map((titulo) => (
              <Fila key={titulo} repartir="space-between" separacion={espacio.normal}>
                <Texto tamano={16}>{titulo}</Texto>
                {titulo === 'Manos voluntarias' ? (
                  <Texto tamano={15} peso="fuerte" color={colores.verde}>
                    {`0 de ${propuesta.voluntarios}`}
                  </Texto>
                ) : null}
              </Fila>
            ))}
          </Tarjeta>
        )}

        {propuesta.disciplinas.length === 0 ? null : (
          <Tarjeta>
            <Texto tamano={18} familia="tituloSemi">
              Conocimientos que ayudarían
            </Texto>
            <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
              {propuesta.disciplinas.map((nombre) => (
                <Chip key={nombre} texto={nombre} activo variante="marcado" alto={36} />
              ))}
            </Fila>
          </Tarjeta>
        )}

        <Aviso
          texto="Al publicarla queda como Idea. Sube a En conversación cuando los vecinos empiecen a opinar."
        />
      </ScrollView>

      <BarraInferior>
        <Boton
          texto="Publicar propuesta"
          icono="enviar"
          alto={56}
          tamanoDeTexto={18}
          deshabilitado={propuesta.titulo.trim().length === 0}
          onPress={publicar}
          vibrar
        />
      </BarraInferior>
    </Pantalla>
  );
}
```

#### `app/propuestas/[id]/index.tsx`

5.4 Detalle de propuesta. (347 líneas)

```tsx
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Avatar, Encabezado, EtiquetaDeEtapa } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  Columna,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { etapas, listaDeEtapas } from '@/dominio/estados';
import type { ApoyoNecesario, Propuesta } from '@/dominio/tipos';
import { usarBarrio, usarPropuesta } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 5.4 Detalle de propuesta.
 *
 * Reune la idea, en que etapa va, cuanto apoyo tiene, que le falta y quien se
 * ofrecio a ayudar. Cada apoyo vale lo mismo sin importar quien lo da: fue una
 * decision explicita para no reintroducir jerarquias entre vecinos.
 */
export default function DetalleDePropuesta() {
  const volver = crearVolver('/propuestas');
  const { id } = useLocalSearchParams<{ id: string }>();
  const propuesta = usarPropuesta(id);
  const { apoyarPropuesta } = usarBarrio();

  if (propuesta === undefined) {
    return (
      <Pantalla>
        <Encabezado titulo="Propuesta no encontrada" onVolver={volver} />
      </Pantalla>
    );
  }

  return (
    <Pantalla desplazable espacioAlFinal={espacio.amplio}>
      <Encabezado onVolver={volver} />

      <Columna separacion={espacio.comodo} style={{ paddingHorizontal: espacio.seccion }}>
        <Fila separacion={espacio.normal}>
          <EtiquetaDeEtapa etapa={propuesta.etapa} alto={30} tamanoDeTexto={13.5} />
          <Texto tamano={13.5} color={colores.grisTexto}>
            {propuesta.eje}
          </Texto>
        </Fila>
        <Texto tamano={28} familia="titulo" interlineado={1.12}>
          {propuesta.titulo}
        </Texto>
        <Fila separacion={espacio.comodo}>
          <Avatar persona={propuesta.autor} tamano={40} />
          <Columna crecer={1}>
            <Texto tamano={16} peso="fuerte">
              {propuesta.autor.nombre}
            </Texto>
            <Texto tamano={13.5} color={colores.grisTexto}>
              {`${propuesta.autor.vinculo} · ${propuesta.publicada}`}
            </Texto>
          </Columna>
        </Fila>
      </Columna>

      <BarraDeEtapas propuesta={propuesta} />

      <Tarjeta
        tono="bosque"
        relleno={18}
        separacion={14}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.amplio }}
      >
        <Fila repartir="space-between" separacion={espacio.comodo}>
          <Columna>
            <Texto tamano={40} familia="titulo" color={colores.papel} interlineado={1}>
              {String(propuesta.apoyos)}
            </Texto>
            <Texto tamano={15} color={colores.textoTenueSobreBosque}>
              vecinos apoyan esta idea
            </Texto>
          </Columna>
          <CaritasDeApoyo />
        </Fila>
        <Boton
          texto={propuesta.apoyadaPorMi ? 'Ya la apoyas' : 'Apoyar esta propuesta'}
          icono="pulgarArriba"
          variante="brote"
          alto={54}
          tamanoDeTexto={17}
          onPress={() => apoyarPropuesta(propuesta.id)}
          vibrar
        />
        <Texto tamano={13.5} color={colores.textoTenueSobreBosque} alineacion="center">
          Cada apoyo vale lo mismo, sin importar quién lo da.
        </Texto>
      </Tarjeta>

      {propuesta.respondeA === undefined ? null : (
        <Aviso
          tono="neutro"
          icono="pin"
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
        >
          <Texto tamano={14.5} color={colores.grisTexto} interlineado={1.4}>
            <Texto tamano={14.5} peso="fuerte" color={colores.tinta}>
              Responde a{' '}
            </Texto>
            {propuesta.respondeA}
          </Texto>
        </Aviso>
      )}

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
        <Texto tamano={21} familia="tituloSemi">
          La idea
        </Texto>
        <Texto tamano={16} interlineado={1.45}>
          {propuesta.idea}
        </Texto>
        {propuesta.mejoraIncorporada === undefined ? null : (
          <Aviso tono="logro" icono="visto">
            <Texto tamano={14.5} color="#174D34" interlineado={1.4}>
              <Texto tamano={14.5} peso="fuerte" color="#174D34">
                Mejorada en la conversación:{' '}
              </Texto>
              {propuesta.mejoraIncorporada}
            </Texto>
          </Aviso>
        )}
      </Tarjeta>

      {propuesta.necesita.length === 0 ? null : (
        <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
          <Texto tamano={21} familia="tituloSemi">
            Qué se necesita
          </Texto>
          {propuesta.necesita.map((apoyo) => (
            <FilaDeApoyo key={apoyo.id} apoyo={apoyo} />
          ))}
        </Tarjeta>
      )}

      {propuesta.quierenApoyar.length === 0 ? null : (
        <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
          <Texto tamano={21} familia="tituloSemi">
            Quieren apoyar
          </Texto>
          {propuesta.quierenApoyar.map((apoyo) => (
            <Fila key={apoyo.id} separacion={espacio.medio}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: radio.medio,
                  backgroundColor: apoyo.icono === 'birrete' ? '#DCE7F3' : '#F5E6C8',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icono
                  nombre={apoyo.icono}
                  tamano={22}
                  color={apoyo.icono === 'birrete' ? '#2C5A8C' : '#8A5A12'}
                />
              </View>
              <Columna crecer={1}>
                <Texto tamano={16} peso="fuerte">
                  {apoyo.nombre}
                </Texto>
                <Texto tamano={13.5} color={colores.grisTexto}>
                  {apoyo.detalle}
                </Texto>
              </Columna>
            </Fila>
          ))}
        </Tarjeta>
      )}

      <Columna
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
      >
        <Texto tamano={21} familia="tituloSemi">
          {`Conversación · ${propuesta.comentarios.length}`}
        </Texto>
        {propuesta.comentarios.slice(0, 1).map((comentario) => (
          <Tarjeta key={comentario.id} separacion={espacio.normal}>
            <Fila separacion={espacio.comodo}>
              <Avatar persona={comentario.autor} tamano={36} />
              <Texto tamano={14.5} color={colores.grisTexto} style={{ flex: 1 }}>
                <Texto tamano={14.5} peso="fuerte">
                  {comentario.autor.nombre}
                </Texto>
                {` · ${comentario.autor.vinculo}`}
              </Texto>
            </Fila>
            <Texto tamano={15.5} interlineado={1.4}>
              {comentario.texto}
            </Texto>
          </Tarjeta>
        ))}
        <Boton
          texto="Ver toda la conversación"
          variante="secundaria"
          icono="globoDialogo"
          onPress={() => router.push(`/propuestas/${propuesta.id}/conversacion`)}
        />
      </Columna>

      <BarraInferior alFinal={false} style={{ marginTop: espacio.seccion }}>
        <Fila separacion={espacio.comodo}>
          <Boton
            texto={`Apoyar · ${propuesta.apoyos}`}
            icono="pulgarArriba"
            variante={propuesta.apoyadaPorMi ? 'tonal' : 'principal'}
            onPress={() => apoyarPropuesta(propuesta.id)}
            vibrar
            style={{ flex: 1 }}
          />
          <Boton
            texto="Opinar"
            icono="globoDialogo"
            variante="secundaria"
            onPress={() => router.push(`/propuestas/${propuesta.id}/conversacion`)}
            style={{ flex: 1 }}
          />
        </Fila>
      </BarraInferior>
    </Pantalla>
  );
}

/** Las cinco etapas con la actual destacada. */
function BarraDeEtapas({ propuesta }: { propuesta: Propuesta }) {
  const etapaActual = etapas[propuesta.etapa];

  return (
    <Fila
      separacion={espacio.apretado}
      alinear="flex-start"
      accesibilidad={`Etapa ${etapaActual.numero} de 5: ${etapaActual.etiqueta}`}
      style={{ marginHorizontal: espacio.seccion, marginTop: espacio.amplio }}
    >
      {listaDeEtapas.map((etapa) => {
        const recorrida = etapa.numero < etapaActual.numero;
        const esLaActual = etapa.numero === etapaActual.numero;
        return (
          <Columna key={etapa.id} crecer={1} separacion={espacio.corto}>
            <View
              style={{
                height: 6,
                borderRadius: radio.redondo,
                backgroundColor: recorrida
                  ? colores.verde
                  : esLaActual
                    ? colores.ocre
                    : colores.borde,
              }}
            />
            <Texto
              tamano={12}
              peso={esLaActual ? 'fuerte' : 'normal'}
              color={esLaActual ? '#6F4A0E' : recorrida ? '#3E4A43' : colores.grisTexto}
            >
              {etapa.etiqueta}
            </Texto>
          </Columna>
        );
      })}
    </Fila>
  );
}

/** Una necesidad de la propuesta, con su avance cuando se cuenta en personas. */
function FilaDeApoyo({ apoyo }: { apoyo: ApoyoNecesario }) {
  const tieneCuenta = apoyo.conseguido !== undefined && apoyo.necesario !== undefined;
  const proporcion =
    tieneCuenta && apoyo.necesario !== undefined && apoyo.necesario > 0
      ? (apoyo.conseguido ?? 0) / apoyo.necesario
      : 0;

  return (
    <Columna separacion={espacio.corto}>
      <Fila repartir="space-between" separacion={espacio.normal}>
        <Texto tamano={16} peso="fuerte" style={{ flex: 1 }}>
          {apoyo.titulo}
        </Texto>
        {tieneCuenta ? (
          <Texto tamano={15} peso="fuerte" color={colores.verde}>
            {`${apoyo.conseguido} de ${apoyo.necesario}`}
          </Texto>
        ) : null}
      </Fila>
      <Texto tamano={13.5} color={colores.grisTexto}>
        {apoyo.detalle}
      </Texto>
      {tieneCuenta ? (
        <View
          style={{
            height: 6,
            borderRadius: radio.redondo,
            backgroundColor: colores.borde,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${Math.round(proporcion * 100)}%`,
              height: 6,
              borderRadius: radio.redondo,
              backgroundColor: colores.verde,
            }}
          />
        </View>
      ) : null}
    </Columna>
  );
}

/** Circulos superpuestos que sugieren quienes apoyan, sin exponer identidades. */
function CaritasDeApoyo() {
  const tonos = ['#F5E6C8', '#DCE7F3', '#DCEBD8', '#F3DCD7'];
  return (
    <View accessible={false} style={{ flexDirection: 'row' }}>
      {tonos.map((tono, posicion) => (
        <View
          key={tono}
          style={{
            width: 36,
            height: 36,
            borderRadius: radio.redondo,
            backgroundColor: tono,
            borderWidth: 3,
            borderColor: colores.bosque,
            marginLeft: posicion === 0 ? 0 : -12,
          }}
        />
      ))}
    </View>
  );
}
```

#### `app/propuestas/[id]/conversacion.tsx`

5.5 Conversación. (311 líneas)

```tsx
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Encabezado } from '@/componentes/app';
import {
  Aviso,
  Chip,
  Columna,
  Etiqueta,
  Fila,
  Icono,
  Pantalla,
  Presionable,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import type { Comentario, PosturaComentario } from '@/dominio/tipos';
import { familias } from '@/diseno/tipografia';
import { usarBarrio, usarPropuesta } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/** Como se ve cada postura y como se llama en la pantalla. */
const posturas: Record<PosturaComentario, { etiqueta: string; fondo: string; texto: string }> = {
  aFavor: { etiqueta: 'A favor', fondo: colores.menta, texto: '#174D34' },
  mejora: { etiqueta: 'Mejora', fondo: '#F5E6C8', texto: '#6F4A0E' },
  duda: { etiqueta: 'Duda', fondo: '#DCE7F3', texto: '#244C78' },
  enContra: { etiqueta: 'En contra', fondo: '#F3DCD7', texto: '#7A2A24' },
  respuesta: { etiqueta: 'Respuesta', fondo: colores.crema, texto: colores.grisTexto },
};

/** Posturas que alguien puede elegir al escribir. */
const posturasElegibles: PosturaComentario[] = ['aFavor', 'mejora', 'duda', 'enContra'];

/**
 * 5.5 Conversacion.
 *
 * El foro de deliberacion es uno de los tres modulos comprometidos con la
 * contraparte. Cada aporte declara su postura, de modo que la autora y el resto
 * puedan leer rapido que mejora, que duda y que objeta.
 */
export default function Conversacion() {
  const volver = crearVolver('/propuestas');
  const { id } = useLocalSearchParams<{ id: string }>();
  const propuesta = usarPropuesta(id);
  const { comentarPropuesta, marcarComentarioUtil } = usarBarrio();
  const margenes = useSafeAreaInsets();

  const [filtro, setFiltro] = useState<'todas' | PosturaComentario>('todas');
  const [postura, setPostura] = useState<PosturaComentario>('aFavor');
  const [texto, setTexto] = useState('');

  if (propuesta === undefined) {
    return (
      <Pantalla>
        <Encabezado titulo="Conversación" onVolver={volver} />
      </Pantalla>
    );
  }

  const cuantos = (cual: PosturaComentario) =>
    propuesta.comentarios.filter((comentario) => comentario.postura === cual).length;

  const visibles = propuesta.comentarios.filter(
    (comentario) => filtro === 'todas' || comentario.postura === filtro,
  );

  function enviar() {
    if (texto.trim().length === 0 || propuesta === undefined) return;
    comentarPropuesta(propuesta.id, texto.trim(), postura);
    setTexto('');
  }

  return (
    <Pantalla sinMargenInferior>
      <Encabezado
        titulo="Conversación"
        subtitulo={propuesta.titulo}
        onVolver={volver}
        tamanoDeTitulo={24}
      />

      <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.seccion }}>
        <Chip
          texto={`Todas · ${propuesta.comentarios.length}`}
          activo={filtro === 'todas'}
          onPress={() => setFiltro('todas')}
          tamanoDeTexto={14}
        />
        <Chip
          texto={`Mejoras · ${cuantos('mejora')}`}
          activo={filtro === 'mejora'}
          onPress={() => setFiltro('mejora')}
          tamanoDeTexto={14}
        />
        <Chip
          texto={`Dudas · ${cuantos('duda')}`}
          activo={filtro === 'duda'}
          onPress={() => setFiltro('duda')}
          tamanoDeTexto={14}
        />
        <Chip
          texto={`A favor · ${cuantos('aFavor')}`}
          activo={filtro === 'aFavor'}
          onPress={() => setFiltro('aFavor')}
          tamanoDeTexto={14}
        />
      </Fila>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={margenes.bottom}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: espacio.amplio,
            paddingTop: espacio.medio,
            paddingBottom: espacio.seccion,
            gap: espacio.medio,
          }}
        >
          {visibles.map((comentario) => (
            <TarjetaDeComentario
              key={comentario.id}
              comentario={comentario}
              onUtil={() => marcarComentarioUtil(propuesta.id, comentario.id)}
            />
          ))}

          {visibles.length === 0 ? (
            <Aviso tono="neutro" texto="Todavía no hay aportes de este tipo." />
          ) : null}
        </ScrollView>

        <Columna
          separacion={espacio.comodo}
          style={{
            backgroundColor: colores.papel,
            borderTopWidth: 1,
            borderTopColor: colores.borde,
            paddingHorizontal: espacio.amplio,
            paddingTop: espacio.medio,
            paddingBottom: Math.max(margenes.bottom, espacio.medio),
          }}
        >
          <Fila separacion={espacio.corto}>
            {posturasElegibles.map((cual) => (
              <Chip
                key={cual}
                texto={posturas[cual].etiqueta}
                activo={postura === cual}
                onPress={() => setPostura(cual)}
                alto={36}
                tamanoDeTexto={13.5}
                variante="marcado"
              />
            ))}
          </Fila>

          <Fila separacion={espacio.comodo} alinear="flex-end">
            <TextInput
              value={texto}
              onChangeText={setTexto}
              placeholder="Escribe tu aporte"
              placeholderTextColor={colores.grisTexto}
              accessibilityLabel="Escribe tu aporte"
              allowFontScaling={false}
              multiline
              style={{
                flex: 1,
                minHeight: alturaTocable.control,
                maxHeight: 120,
                borderRadius: radio.boton,
                borderWidth: 1.5,
                borderColor: colores.bordeFuerte,
                backgroundColor: colores.papel,
                paddingHorizontal: espacio.medio,
                paddingTop: espacio.medio,
                paddingBottom: espacio.medio,
                fontFamily: familias.texto,
                fontSize: 16,
                color: colores.tinta,
              }}
            />
            <Presionable
              onPress={enviar}
              vibrar
              accessibilityRole="button"
              accessibilityLabel="Enviar"
              style={{
                width: alturaTocable.control,
                height: alturaTocable.control,
                borderRadius: radio.boton,
                backgroundColor: texto.trim().length === 0 ? colores.bordeFuerte : colores.verde,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icono nombre="enviar" tamano={22} color={colores.papel} />
            </Presionable>
          </Fila>

          <Texto tamano={13} color={colores.grisTexto}>
            {'Conversa con respeto. '}
            <Texto
              tamano={13}
              peso="fuerte"
              color={colores.verde}
              style={{ textDecorationLine: 'underline' }}
            >
              Normas de convivencia
            </Texto>
          </Texto>
        </Columna>
      </KeyboardAvoidingView>
    </Pantalla>
  );
}

/** Un aporte con su postura, sus respuestas y el contador de utiles. */
function TarjetaDeComentario({
  comentario,
  onUtil,
}: {
  comentario: Comentario;
  onUtil: () => void;
}) {
  const estilo = posturas[comentario.postura];

  return (
    <Tarjeta separacion={espacio.comodo}>
      <Fila separacion={espacio.comodo}>
        <Avatar persona={comentario.autor} tamano={38} />
        <Columna crecer={1}>
          <Texto tamano={15.5} peso="fuerte">
            {comentario.autor.nombre}
          </Texto>
          <Texto tamano={13.5} color={colores.grisTexto}>
            {`${comentario.autor.vinculo} · ${comentario.cuando}`}
          </Texto>
        </Columna>
        {comentario.postura === 'respuesta' ? null : (
          <Etiqueta texto={estilo.etiqueta} fondo={estilo.fondo} color={estilo.texto} />
        )}
      </Fila>

      <Texto tamano={16} interlineado={1.4}>
        {comentario.texto}
      </Texto>

      {comentario.incorporado === undefined ? null : (
        <Aviso tono="logro" icono="visto" texto={comentario.incorporado} tamanoDeTexto={13.5} />
      )}

      <Fila separacion={espacio.amplio}>
        <Presionable
          onPress={onUtil}
          accessibilityRole="button"
          accessibilityLabel={`Marcar útil. Lleva ${comentario.utiles}`}
          style={{ flexDirection: 'row', alignItems: 'center', gap: espacio.corto, minHeight: 44 }}
        >
          <Icono nombre="pulgarArriba" tamano={18} color={colores.grisTexto} />
          <Texto tamano={14} peso="fuerte" color={colores.grisTexto}>
            {`Útil · ${comentario.utiles}`}
          </Texto>
        </Presionable>
        <Presionable
          accessibilityRole="button"
          accessibilityLabel="Responder"
          style={{ justifyContent: 'center', minHeight: 44 }}
        >
          <Texto tamano={14} peso="fuerte" color={colores.grisTexto}>
            Responder
          </Texto>
        </Presionable>
      </Fila>

      {comentario.respuestas.map((respuesta) => (
        <View
          key={respuesta.id}
          style={{
            marginLeft: espacio.seccion,
            paddingLeft: espacio.medio,
            borderLeftWidth: 2,
            borderLeftColor: colores.borde,
            gap: espacio.corto,
          }}
        >
          <Fila separacion={espacio.normal}>
            <Avatar persona={respuesta.autor} tamano={28} />
            <Texto tamano={14} color={colores.grisTexto} style={{ flex: 1 }}>
              <Texto tamano={14} peso="fuerte">
                {respuesta.autor.nombre}
              </Texto>
              {` · ${respuesta.autor.vinculo}`}
            </Texto>
          </Fila>
          <Texto tamano={15} interlineado={1.4}>
            {respuesta.texto}
          </Texto>
        </View>
      ))}
    </Tarjeta>
  );
}
```

### 17.15 Actividades

#### `app/actividades/index.tsx`

6.1 Actividades. (208 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Encabezado, FilaDeActividad, TarjetaDeActividad } from '@/componentes/app';
import {
  BotonCircular,
  Chip,
  Columna,
  Fila,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { filtrosDeActividad } from '@/datos/actividades';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarBarrio } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/** La semana que se muestra arriba. El dia 12 es hoy en el prototipo. */
const diasDeLaSemana = [
  { sigla: 'LUN', numero: 9 },
  { sigla: 'MAR', numero: 10 },
  { sigla: 'MIÉ', numero: 11 },
  { sigla: 'HOY', numero: 12 },
  { sigla: 'VIE', numero: 13 },
  { sigla: 'SÁB', numero: 14 },
  { sigla: 'DOM', numero: 15 },
];

const DIA_DE_HOY = 12;

/**
 * 6.1 Actividades.
 *
 * Las actividades son el puente entre deliberar y hacer. La convocatoria es el
 * cuello de botella del barrio, no la voluntad, asi que la pantalla deja a la
 * vista cuantos voluntarios faltan.
 */
export default function Actividades() {
  const volver = crearVolver('/inicio');
  const { actividades } = usarBarrio();
  const [diaElegido, setDiaElegido] = useState<number>(14);
  const [filtro, setFiltro] = useState<string>('Todas');

  const visibles = actividades.filter((actividad) => {
    if (filtro === 'Buscan voluntarios') {
      return actividad.voluntariosNecesarios > actividad.voluntarios;
    }
    if (filtro === 'Me inscribí') {
      return actividad.miInscripcion !== null;
    }
    return true;
  });

  const deEsteSabado = visibles.filter((actividad) => actividad.dia === diaElegido);
  const proximas = visibles.filter((actividad) => actividad.dia !== diaElegido);

  return (
    <Pantalla>
      <Encabezado
        titulo="Actividades"
        onVolver={volver}
        accion={
          <Fila separacion={espacio.comodo}>
            <Texto tamano={15} peso="fuerte" color={colores.grisTexto}>
              Noviembre
            </Texto>
            <BotonCircular
              icono="mas"
              accesibilidad="Crear actividad"
              onPress={() => router.push('/actividades/crear')}
            />
          </Fila>
        }
      />

      <Fila
        separacion={espacio.apretado}
        alinear="stretch"
        style={{ paddingHorizontal: espacio.amplio, paddingTop: espacio.corto }}
      >
        {diasDeLaSemana.map((dia) => {
          const elegido = dia.numero === diaElegido;
          const esHoy = dia.numero === DIA_DE_HOY;
          const tieneActividad = actividades.some((actividad) => actividad.dia === dia.numero);
          return (
            <Presionable
              key={dia.numero}
              onPress={() => setDiaElegido(dia.numero)}
              escalaAlTocar={0.93}
              accessibilityRole="tab"
              accessibilityState={{ selected: elegido }}
              accessibilityLabel={`${dia.sigla} ${dia.numero}`}
              style={{
                flex: 1,
                height: 64,
                borderRadius: radio.boton,
                alignItems: 'center',
                justifyContent: 'center',
                gap: espacio.minimo,
                ...(elegido
                  ? { backgroundColor: colores.verde }
                  : esHoy
                    ? {
                        backgroundColor: colores.papel,
                        borderWidth: 1.5,
                        borderColor: colores.borde,
                      }
                    : null),
              }}
            >
              <Texto
                tamano={12.5}
                color={elegido ? colores.papel : colores.grisTexto}
              >
                {dia.sigla}
              </Texto>
              <Texto tamano={18} peso="fuerte" color={elegido ? colores.papel : colores.tinta}>
                {String(dia.numero)}
              </Texto>
              {tieneActividad ? (
                <View
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: radio.redondo,
                    backgroundColor: elegido ? colores.brote : colores.ocre,
                  }}
                />
              ) : null}
            </Presionable>
          );
        })}
      </Fila>

      <Fila
        separacion={espacio.normal}
        style={{ paddingHorizontal: espacio.seccion, paddingTop: espacio.medio }}
      >
        {filtrosDeActividad.map((opcion) => (
          <Chip
            key={opcion}
            texto={opcion}
            activo={filtro === opcion}
            onPress={() => setFiltro(opcion)}
            tamanoDeTexto={14}
          />
        ))}
      </Fila>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingTop: espacio.amplio,
          paddingBottom: espacio.bloque,
          gap: espacio.medio,
        }}
      >
        {deEsteSabado.length === 0 ? null : (
          <>
            <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
              ESTE SÁBADO
            </Texto>
            {deEsteSabado.map((actividad) => (
              <TarjetaDeActividad
                key={actividad.id}
                actividad={actividad}
                onPress={() => router.push(`/actividades/${actividad.id}`)}
              />
            ))}
          </>
        )}

        {proximas.length === 0 ? null : (
          <>
            <Texto
              tamano={13}
              peso="fuerte"
              color={colores.grisTexto}
              espaciado={0.6}
              style={{ marginTop: espacio.normal }}
            >
              PRÓXIMAS
            </Texto>
            {proximas.map((actividad) => (
              <FilaDeActividad
                key={actividad.id}
                actividad={actividad}
                onPress={() => router.push(`/actividades/${actividad.id}`)}
              />
            ))}
          </>
        )}

        {visibles.length === 0 ? (
          <Columna separacion={espacio.comodo} style={{ paddingTop: espacio.seccion }}>
            <Texto tamano={16} alineacion="center" color={colores.grisTexto}>
              No hay actividades con ese filtro.
            </Texto>
          </Columna>
        ) : null}
      </ScrollView>
    </Pantalla>
  );
}
```

#### `app/actividades/[id].tsx`

6.2 Detalle de actividad. (240 líneas)

```tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Avatar, CuadroDeFecha, Encabezado } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  Columna,
  Fila,
  Icono,
  Opcion,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import type { ModoDeParticipar } from '@/dominio/tipos';
import { usarActividad, usarBarrio } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 6.2 Detalle de actividad.
 *
 * Participar se divide en dos: asistir, que no compromete a nada, y ser
 * voluntario, que toma una tarea concreta. Separarlo hace que quien organiza
 * sepa con cuanta gente cuenta de verdad.
 */
export default function DetalleDeActividad() {
  const volver = crearVolver('/actividades');
  const { id } = useLocalSearchParams<{ id: string }>();
  const actividad = usarActividad(id);
  const { propuestas, inscribirseEnActividad } = usarBarrio();

  const [modo, setModo] = useState<ModoDeParticipar>('asistir');
  const [tarea, setTarea] = useState<string | null>(null);

  if (actividad === undefined) {
    return (
      <Pantalla>
        <Encabezado titulo="Actividad no encontrada" onVolver={volver} />
      </Pantalla>
    );
  }

  const propuestaDeOrigen = propuestas.find(
    (propuesta) => propuesta.id === actividad.naceDePropuesta,
  );
  const faltan = actividad.voluntariosNecesarios - actividad.voluntarios;
  const yaEstaInscrita = actividad.miInscripcion !== null;

  function inscribirse() {
    if (actividad === undefined) return;
    inscribirseEnActividad(actividad.id, modo, tarea ?? undefined);
    router.push(`/actividades/inscripcion?id=${actividad.id}`);
  }

  return (
    <Pantalla desplazable espacioAlFinal={espacio.amplio}>
      <Encabezado onVolver={volver} />

      <Fila separacion={espacio.amplio} style={{ paddingHorizontal: espacio.seccion }}>
        <CuadroDeFecha actividad={actividad} ancho={72} />
        <Columna crecer={1} separacion={espacio.corto}>
          <Texto tamano={26} familia="titulo" interlineado={1.12}>
            {actividad.titulo}
          </Texto>
        </Columna>
      </Fila>

      <Columna
        separacion={espacio.comodo}
        style={{ paddingHorizontal: espacio.seccion, paddingTop: espacio.amplio }}
      >
        <Fila separacion={espacio.comodo}>
          <Icono nombre="reloj" tamano={20} color={colores.grisTexto} />
          <Texto tamano={16} style={{ flex: 1 }}>
            {`Sábado ${actividad.dia} de noviembre · ${actividad.horario}`}
          </Texto>
        </Fila>
        <Fila separacion={espacio.comodo}>
          <Icono nombre="pin" tamano={20} color={colores.grisTexto} />
          <Texto tamano={16} style={{ flex: 1 }}>
            {actividad.lugar}
          </Texto>
          <Texto
            tamano={15}
            peso="fuerte"
            color={colores.verde}
            onPress={() => router.push('/mapa')}
          >
            Ver en el mapa
          </Texto>
        </Fila>
      </Columna>

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.amplio }}>
        <Fila separacion={espacio.medio}>
          <Avatar persona={actividad.organiza} tamano={44} />
          <Columna crecer={1}>
            <Texto tamano={16.5} peso="fuerte">
              {actividad.organiza.nombre}
            </Texto>
            <Texto tamano={13.5} color={colores.grisTexto}>
              {actividad.organiza.esOrganizacion === true
                ? 'Organización verificada'
                : actividad.organiza.vinculo}
            </Texto>
          </Columna>
          {actividad.organiza.esOrganizacion === true ? (
            <Icono nombre="escudo" tamano={22} color={colores.verde} />
          ) : null}
        </Fila>

        {propuestaDeOrigen === undefined ? null : (
          <Aviso tono="logro" icono="idea">
            <Texto tamano={14.5} color="#174D34" interlineado={1.4}>
              {'Nace de la propuesta '}
              <Texto
                tamano={14.5}
                peso="fuerte"
                color="#174D34"
                style={{ textDecorationLine: 'underline' }}
                onPress={() => router.push(`/propuestas/${propuestaDeOrigen.id}`)}
              >
                {propuestaDeOrigen.titulo}
              </Texto>
              {`, apoyada por ${propuestaDeOrigen.apoyos} vecinos`}
            </Texto>
          </Aviso>
        )}

        <Texto tamano={16} interlineado={1.45}>
          {actividad.descripcion}
        </Texto>
      </Tarjeta>

      {yaEstaInscrita ? (
        <Aviso
          tono="logro"
          icono="visto"
          texto={`Ya te inscribiste como ${actividad.miInscripcion === 'voluntario' ? 'voluntaria' : 'asistente'}.`}
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}
        />
      ) : (
        <Columna
          separacion={espacio.comodo}
          style={{ marginHorizontal: espacio.amplio, marginTop: espacio.seccion }}
        >
          <Texto tamano={21} familia="tituloSemi">
            ¿Cómo quieres participar?
          </Texto>
          <Opcion
            texto="Asistir"
            detalle="Llego, ayudo un rato y conozco a los vecinos"
            seleccion="unica"
            activa={modo === 'asistir'}
            onPress={() => setModo('asistir')}
          />
          <Opcion
            texto={faltan > 0 ? `Ser voluntario · faltan ${faltan}` : 'Ser voluntario'}
            detalle="Me comprometo con una tarea"
            seleccion="unica"
            activa={modo === 'voluntario'}
            onPress={() => setModo('voluntario')}
          />

          {modo === 'voluntario' && actividad.tareas.length > 0 ? (
            <Columna separacion={espacio.normal} style={{ paddingLeft: espacio.amplio }}>
              {actividad.tareas.map((cual) => (
                <Opcion
                  key={cual}
                  texto={cual}
                  seleccion="unica"
                  activa={tarea === cual}
                  onPress={() => setTarea(cual)}
                />
              ))}
            </Columna>
          ) : null}
        </Columna>
      )}

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }}>
        <Fila separacion={espacio.medio}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: radio.medio,
              backgroundColor: colores.menta,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icono nombre="personas" tamano={22} color={colores.verde} />
          </View>
          <Texto tamano={16} style={{ flex: 1 }} interlineado={1.35}>
            <Texto tamano={16} peso="fuerte">
              {`${actividad.inscritos} inscritos`}
            </Texto>
            {` · ${actividad.voluntarios} de ellos como voluntarios`}
          </Texto>
        </Fila>
      </Tarjeta>

      <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
        <Texto tamano={21} familia="tituloSemi">
          Qué llevar
        </Texto>
        <Texto tamano={16} interlineado={1.45}>
          {actividad.queLlevar}
        </Texto>
      </Tarjeta>

      <BarraInferior alFinal={false} style={{ marginTop: espacio.seccion }}>
        {yaEstaInscrita ? (
          <Boton
            texto="Ver mi inscripción"
            variante="tonal"
            alto={56}
            tamanoDeTexto={18}
            onPress={() => router.push(`/actividades/inscripcion?id=${actividad.id}`)}
          />
        ) : (
          <Boton
            texto={modo === 'voluntario' ? 'Inscribirme como voluntario' : 'Inscribirme'}
            alto={56}
            tamanoDeTexto={18}
            deshabilitado={modo === 'voluntario' && actividad.tareas.length > 0 && tarea === null}
            onPress={inscribirse}
            vibrar
          />
        )}
      </BarraInferior>
    </Pantalla>
  );
}
```

#### `app/actividades/inscripcion.tsx`

6.3 Inscripción lista. (167 líneas)

```tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { CuadroDeFecha } from '@/componentes/app';
import {
  BarraInferior,
  Boton,
  Columna,
  Etiqueta,
  Fila,
  FilaDeLista,
  Icono,
  ListaAgrupada,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { usarActividad, usarBarrio } from '@/estado/barrio';
import { usarPreferencias } from '@/estado/preferencias';

/**
 * 6.3 Inscripcion lista.
 *
 * Cierra el flujo de actividades con lo que la persona necesita recordar: la
 * fecha, el lugar, su compromiso y la forma de avisar si al final no puede ir.
 */
export default function InscripcionLista() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const actividad = usarActividad(id);
  const { cancelarInscripcion } = usarBarrio();
  const { menosAnimaciones } = usarPreferencias();
  const margenes = useSafeAreaInsets();
  const [recordatorio, setRecordatorio] = useState(true);

  if (actividad === undefined) return null;

  const esVoluntaria = actividad.miInscripcion === 'voluntario';

  function cancelar() {
    if (actividad === undefined) return;
    cancelarInscripcion(actividad.id);
    router.dismissTo('/actividades');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colores.crema }}>
      <Columna
        alinear="center"
        separacion={espacio.medio}
        style={{
          backgroundColor: colores.bosque,
          paddingTop: margenes.top + espacio.bloque,
          paddingHorizontal: espacio.bloque,
          paddingBottom: 28,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Animated.View entering={menosAnimaciones ? undefined : ZoomIn.duration(420)}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: radio.redondo,
              backgroundColor: colores.brote,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 12,
              borderColor: colores.bosqueClaro,
            }}
          >
            <Icono nombre="visto" tamano={44} color={colores.bosque} grosor={2.6} />
          </View>
        </Animated.View>
        <Texto
          tamano={32}
          familia="titulo"
          color={colores.papel}
          alineacion="center"
          interlineado={1.08}
          style={{ marginTop: espacio.comodo }}
        >
          ¡Te esperamos el sábado!
        </Texto>
        <Texto tamano={17} color={colores.textoSobreBosque} alineacion="center" interlineado={1.45}>
          {`${actividad.organiza.nombre} ya sabe que vas${esVoluntaria ? ' como voluntaria' : ''}.`}
        </Texto>
      </Columna>

      <Fila
        separacion={espacio.amplio}
        style={{
          marginHorizontal: espacio.seccion,
          marginTop: 18,
          backgroundColor: colores.papel,
          borderWidth: 1,
          borderColor: colores.borde,
          borderRadius: 20,
          padding: espacio.amplio,
        }}
      >
        <CuadroDeFecha actividad={actividad} ancho={64} tono="menta" />
        <Columna crecer={1} separacion={espacio.corto}>
          <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.5}>
            {`${actividad.diaSemana} ${actividad.dia} ${actividad.mes} · ${actividad.horario}`}
          </Texto>
          <Texto tamano={17} peso="fuerte" interlineado={1.25}>
            {actividad.titulo}
          </Texto>
          <Texto tamano={14} color={colores.grisTexto}>
            {actividad.lugar}
          </Texto>
          {esVoluntaria ? (
            <Fila separacion={espacio.corto} style={{ marginTop: espacio.apretado }}>
              <Etiqueta texto="Voluntaria" fondo={colores.menta} color="#174D34" />
              {actividad.miTarea === undefined ? null : (
                <Texto tamano={14} color={colores.grisTexto}>
                  {actividad.miTarea}
                </Texto>
              )}
            </Fila>
          ) : null}
        </Columna>
      </Fila>

      <ListaAgrupada style={{ marginHorizontal: espacio.seccion, marginTop: espacio.medio }}>
        <FilaDeLista
          titulo="Agregar a mi calendario"
          conFlecha
          adorno={<Icono nombre="calendario" tamano={24} color={colores.verde} />}
        />
        <FilaDeLista
          titulo="Recordatorio"
          detalle="Viernes 13 a las 18:00"
          onPress={() => setRecordatorio(!recordatorio)}
          adorno={<Icono nombre="campana" tamano={24} color={colores.verde} />}
          control={
            <Icono
              nombre={recordatorio ? 'visto' : 'cerrar'}
              tamano={22}
              color={recordatorio ? colores.verde : colores.grisTexto}
            />
          }
        />
        <FilaDeLista
          titulo="Invitar a alguien por WhatsApp"
          ultima
          conFlecha
          adorno={<Icono nombre="compartir" tamano={24} color={colores.verde} />}
        />
      </ListaAgrupada>

      <BarraInferior fondo={colores.crema} style={{ borderTopWidth: 0 }}>
        <Boton
          texto="Listo"
          alto={56}
          tamanoDeTexto={18}
          onPress={() => router.dismissTo('/actividades')}
        />
        <Boton texto="Ya no puedo ir" variante="secundaria" tamanoDeTexto={16.5} onPress={cancelar} />
      </BarraInferior>
    </View>
  );
}
```

#### `app/actividades/crear.tsx`

6.4 Crear actividad. (235 líneas)

```tsx
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
```

### 17.16 Perfil y ajustes

#### `app/perfil/index.tsx`

7.2 Perfil y logros. (294 líneas)

```tsx
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
import { logros, resumenDelPerfil, totalDeLogros } from '@/datos/perfil';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio, radio } from '@/diseno/medidas';
import type { Logro } from '@/dominio/tipos';
import { usarBarrio } from '@/estado/barrio';
import { usarQuienEntro } from '@/estado/sesion';
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
  const quienEntro = usarQuienEntro();

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
                {quienEntro.inicial}
              </Texto>
            </View>
            <Columna separacion={espacio.corto}>
              <Texto tamano={30} familia="titulo" color={colores.papel} interlineado={1}>
                {quienEntro.nombre}
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
```

#### `app/perfil/ajustes.tsx`

7.3 Ajustes y accesibilidad. (250 líneas)

```tsx
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
```

#### `app/sistema.tsx`

0 Sistema visual. (239 líneas)

```tsx
import { View } from 'react-native';

import {
  Encabezado,
  EtiquetaDeEstado,
  EtiquetaDeEtapa,
  MarcaDeCategoria,
} from '@/componentes/app';
import {
  Boton,
  Columna,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { listaDeCategorias } from '@/dominio/categorias';
import { idsDeEstado, listaDeEtapas } from '@/dominio/estados';
import { crearVolver } from '@/utiles/navegacion';

/** Los ocho colores con nombre del sistema, con su codigo. */
const paleta = [
  { nombre: 'Bosque', valor: colores.bosque },
  { nombre: 'Verde', valor: colores.verde },
  { nombre: 'Brote', valor: colores.brote },
  { nombre: 'Menta', valor: colores.menta },
  { nombre: 'Crema', valor: colores.crema },
  { nombre: 'Papel', valor: colores.papel },
  { nombre: 'Ocre', valor: colores.ocre },
  { nombre: 'Tinta', valor: colores.tinta },
];

/** Las seis reglas de accesibilidad que ordenan todo el diseno. */
const reglasDeAccesibilidad = [
  'Toda zona tocable mide 44 px o más; acciones principales 56 px.',
  'Un paso por pantalla en los flujos, con «Paso X de Y» siempre visible.',
  'Íconos siempre acompañados de texto. Nunca solo color.',
  'Contraste mínimo 4,5:1 en texto. Gris de apoyo #56625B sobre crema.',
  'Tamaño de letra ajustable desde la bienvenida y en Ajustes.',
  'Lenguaje cotidiano: «En gestión», no «Ticket asignado».',
];

/**
 * 0 Sistema visual.
 *
 * La lamina del sistema visual, adaptada al telefono. Sirve de referencia viva:
 * todo lo que se ve aqui sale de los mismos componentes y tokens que usan las
 * demas pantallas, asi que si algo cambia, cambia tambien aqui.
 */
export default function SistemaVisual() {
  const volver = crearVolver('/perfil/ajustes');
  return (
    <Pantalla desplazable espacioAlFinal={espacio.bloque}>
      <Encabezado
        titulo="Sistema visual"
        subtitulo="Plataforma comunitaria Barrio República"
        tamanoDeTitulo={28}
        onVolver={volver}
      />

      <Columna
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.amplio }}
      >
        <Texto tamano={15.5} color={colores.grisTexto} interlineado={1.45}>
          Verde bosque y crema heredados de la presentación del Hito 1. Letra Atkinson
          Hyperlegible, creada para personas con baja visión, en 17 px como base. Cada color de
          categoría o estado va siempre junto a un ícono y una palabra.
        </Texto>

        <Tarjeta relleno={18} separacion={14}>
          <Texto tamano={21} familia="tituloSemi">
            Color
          </Texto>
          <Fila separacion={espacio.normal} alinear="flex-start" style={{ flexWrap: 'wrap' }}>
            {paleta.map((color) => (
              <Columna key={color.nombre} separacion={espacio.corto} style={{ width: '31%' }}>
                <View
                  style={{
                    height: 56,
                    borderRadius: radio.boton,
                    backgroundColor: color.valor,
                    borderWidth: 1,
                    borderColor: colores.borde,
                  }}
                />
                <Texto tamano={14} peso="fuerte">
                  {color.nombre}
                </Texto>
                <Texto tamano={12.5} color={colores.grisTexto}>
                  {color.valor}
                </Texto>
              </Columna>
            ))}
          </Fila>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={14}>
          <Texto tamano={21} familia="tituloSemi">
            Estados del reporte
          </Texto>
          <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
            {idsDeEstado.map((id) => (
              <EtiquetaDeEstado key={id} estado={id} alto={32} tamanoDeTexto={14} />
            ))}
          </Fila>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={14}>
          <Texto tamano={21} familia="tituloSemi">
            Tipografía
          </Texto>
          <Columna separacion={espacio.medio}>
            <MuestraDeTexto tamano={44} familia="titulo" nombre="Título 44" nota="Fira Sans Condensed 700 · portadas" />
            <MuestraDeTexto tamano={32} familia="titulo" nombre="Título de pantalla 32" nota="Fira Sans Condensed 700" />
            <MuestraDeTexto tamano={22} familia="tituloSemi" nombre="Sección 22" nota="Fira Sans Condensed 600" />
            <MuestraDeTexto
              tamano={17}
              familia="texto"
              nombre="Texto base 17"
              nota="Atkinson Hyperlegible 400 / 700. Pensado para leerse sin lentes y con sol."
            />
            <MuestraDeTexto
              tamano={14}
              familia="texto"
              nombre="Apoyo 14"
              nota="Nunca bajo 13 px"
            />
          </Columna>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={espacio.comodo}>
          <Texto tamano={21} familia="tituloSemi">
            Botones
          </Texto>
          <Texto tamano={14} color={colores.grisTexto}>
            Alto mínimo 52 px
          </Texto>
          <Boton texto="Acción principal" alto={56} tamanoDeTexto={18} />
          <Fila separacion={espacio.comodo}>
            <Boton texto="Secundaria" variante="secundaria" style={{ flex: 1 }} />
            <Boton texto="Tonal" variante="tonal" style={{ flex: 1 }} />
          </Fila>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={14}>
          <Texto tamano={21} familia="tituloSemi">
            Categorías de reporte
          </Texto>
          <Texto tamano={14} color={colores.grisTexto} interlineado={1.4}>
            Siete categorías y «Otro». Toman la taxonomía del catastro 2022 y de la HU 1.
          </Texto>
          <Fila separacion={espacio.normal} alinear="flex-start" style={{ flexWrap: 'wrap' }}>
            {listaDeCategorias.map((categoria) => (
              <Fila
                key={categoria.id}
                separacion={espacio.corto}
                style={{
                  height: 36,
                  paddingHorizontal: espacio.normal,
                  borderRadius: radio.redondo,
                  borderWidth: 1,
                  borderColor: colores.borde,
                }}
              >
                <MarcaDeCategoria categoria={categoria.id} tamano={22} />
                <Texto tamano={13.5} peso="fuerte" color={categoria.color}>
                  {categoria.etiquetaCorta}
                </Texto>
              </Fila>
            ))}
          </Fila>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={14}>
          <Texto tamano={21} familia="tituloSemi">
            Etapas de una propuesta
          </Texto>
          {listaDeEtapas.map((etapa) => (
            <Fila key={etapa.id} separacion={espacio.medio}>
              <Texto tamano={18} familia="titulo" color={colores.bordeFuerte} style={{ width: 20 }}>
                {String(etapa.numero)}
              </Texto>
              <EtiquetaDeEtapa etapa={etapa.id} />
              <Texto tamano={14} color={colores.grisTexto} style={{ flex: 1 }}>
                {etapa.explicacion}
              </Texto>
            </Fila>
          ))}
          <Texto tamano={13.5} color={colores.grisTexto} interlineado={1.4}>
            Reporte → propuesta → conversación → prioridad → convocatoria → acción → evidencia →
            dato histórico.
          </Texto>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={espacio.comodo}>
          <Texto tamano={21} familia="tituloSemi">
            Reglas de accesibilidad
          </Texto>
          {reglasDeAccesibilidad.map((regla) => (
            <Fila key={regla} separacion={espacio.comodo} alinear="flex-start">
              <Icono nombre="visto" tamano={18} color={colores.verde} grosor={2.4} />
              <Texto tamano={15} interlineado={1.4} style={{ flex: 1 }}>
                {regla}
              </Texto>
            </Fila>
          ))}
        </Tarjeta>
      </Columna>
    </Pantalla>
  );
}

/** Una linea de muestra tipografica con su nombre y su descripcion. */
function MuestraDeTexto({
  tamano,
  familia,
  nombre,
  nota,
}: {
  tamano: number;
  familia: 'titulo' | 'tituloSemi' | 'texto';
  nombre: string;
  nota: string;
}) {
  return (
    <Columna separacion={espacio.minimo}>
      <Texto tamano={tamano} familia={familia} interlineado={1.1}>
        {nombre}
      </Texto>
      <Texto tamano={13} color={colores.grisTexto} interlineado={1.35}>
        {nota}
      </Texto>
    </Columna>
  );
}
```

### 17.17 Instituciones y observatorio

#### `app/instituciones/desafios.tsx`

8.1 Desafíos para instituciones. (173 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Encabezado } from '@/componentes/app';
import {
  Boton,
  Chip,
  Columna,
  Etiqueta,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { desafios } from '@/datos/observatorio';
import { disciplinas } from '@/datos/propuestas';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import type { Desafio } from '@/dominio/tipos';
import { crearVolver } from '@/utiles/navegacion';

/** Como se pinta cada nivel de prioridad comunitaria. */
const prioridades: Record<Desafio['prioridad'], { etiqueta: string; fondo: string; texto: string }> = {
  alta: { etiqueta: 'Prioridad alta', fondo: '#F3DCD7', texto: '#7A2A24' },
  media: { etiqueta: 'Prioridad media', fondo: '#F5E6C8', texto: '#6F4A0E' },
  baja: { etiqueta: 'Prioridad baja', fondo: colores.crema, texto: colores.grisTexto },
};

/** Las dos fuentes de desafios que puede explorar una institucion. */
const origenes = ['Propuestas', 'Problemas frecuentes'] as const;

/**
 * 8.1 Desafios para instituciones.
 *
 * Es la otra mitad del modulo de vinculacion. La universidad no entra a
 * proponer lo que cree que falta, sino a elegir dentro de lo que la comunidad
 * ya decidio que importa.
 */
export default function Desafios() {
  const volver = crearVolver('/perfil');
  const [origen, setOrigen] = useState<string>('Propuestas');
  const [disciplina, setDisciplina] = useState<string>('Ingeniería');

  const visibles = desafios.filter((desafio) => desafio.disciplinas.includes(disciplina));

  return (
    <Pantalla>
      <Encabezado
        titulo="Desafíos del barrio"
        subtitulo="FCFM · Universidad de Chile"
        tamanoDeTitulo={26}
        onVolver={volver}
      />

      <Texto
        tamano={15.5}
        color={colores.grisTexto}
        interlineado={1.4}
        style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.medio }}
      >
        Lo que la comunidad ya propuso y priorizó. Encuentra uno que calce con tu curso o
        investigación.
      </Texto>

      <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.seccion }}>
        {origenes.map((opcion) => (
          <Chip
            key={opcion}
            texto={`${opcion} · ${opcion === 'Propuestas' ? 8 : 12}`}
            activo={origen === opcion}
            onPress={() => setOrigen(opcion)}
            tamanoDeTexto={14}
          />
        ))}
      </Fila>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: espacio.normal,
          paddingHorizontal: espacio.seccion,
          paddingTop: espacio.comodo,
        }}
        style={{ flexGrow: 0 }}
      >
        {disciplinas.map((nombre) => (
          <Chip
            key={nombre}
            texto={nombre}
            activo={disciplina === nombre}
            onPress={() => setDisciplina(nombre)}
            tamanoDeTexto={14}
          />
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: espacio.amplio,
          paddingTop: espacio.amplio,
          paddingBottom: espacio.bloque,
          gap: espacio.medio,
        }}
      >
        <Texto tamano={14} color={colores.grisTexto}>
          {`${visibles.length} desafíos calzan · ordenados por prioridad comunitaria`}
        </Texto>

        {visibles.map((desafio) => (
          <Tarjeta key={desafio.id} separacion={espacio.comodo}>
            <Fila separacion={espacio.normal}>
              <Etiqueta
                texto={prioridades[desafio.prioridad].etiqueta}
                fondo={prioridades[desafio.prioridad].fondo}
                color={prioridades[desafio.prioridad].texto}
              />
              <Texto tamano={13} color={colores.grisTexto}>
                {desafio.eje}
              </Texto>
            </Fila>

            <Texto tamano={18} peso="fuerte" interlineado={1.3}>
              {desafio.titulo}
            </Texto>
            <Texto tamano={14} color={colores.grisTexto}>
              {desafio.resumen}
            </Texto>

            <Fila
              separacion={espacio.normal}
              alinear="flex-start"
              style={{
                backgroundColor: colores.crema,
                borderRadius: radio.medio,
                padding: espacio.comodo,
              }}
            >
              <Icono nombre="birrete" tamano={18} color={colores.grisTexto} />
              <Texto tamano={14} color={colores.grisTexto} interlineado={1.35} style={{ flex: 1 }}>
                <Texto tamano={14} peso="fuerte" color={colores.tinta}>
                  {'Busca: '}
                </Texto>
                {desafio.busca}
              </Texto>
            </Fila>

            {desafio.propuesta === undefined ? (
              <View />
            ) : (
              <Boton
                texto="Me interesa apoyar"
                icono="pulgarArriba"
                onPress={() => router.push(`/instituciones/interes?propuesta=${desafio.propuesta}`)}
              />
            )}
          </Tarjeta>
        ))}

        {visibles.length === 0 ? (
          <Columna separacion={espacio.comodo} style={{ paddingTop: espacio.seccion }}>
            <Texto tamano={16} alineacion="center" color={colores.grisTexto}>
              No hay desafíos que calcen con esa disciplina todavía.
            </Texto>
          </Columna>
        ) : null}
      </ScrollView>
    </Pantalla>
  );
}
```

#### `app/instituciones/interes.tsx`

8.2 Mostrar interés. (164 líneas)

```tsx
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { Encabezado } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  BotonCircular,
  CampoTexto,
  Chip,
  Columna,
  Fila,
  Icono,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { formasDeApoyoInstitucional, plazosDeApoyo } from '@/datos/observatorio';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';
import { usarPropuesta } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/**
 * 8.2 Mostrar interes.
 *
 * Una institucion declara como podria apoyar y cuando. Solo quien propone y
 * Republica Circular ven el correo de contacto, para que el interes no se
 * convierta en una lista publica de datos.
 */
export default function MostrarInteres() {
  const volver = crearVolver('/instituciones/desafios');
  const { propuesta: idDePropuesta } = useLocalSearchParams<{ propuesta?: string }>();
  const propuesta = usarPropuesta(idDePropuesta);

  const [formas, setFormas] = useState<string[]>(['Curso o taller']);
  const [plazo, setPlazo] = useState<string>('Este semestre');
  const [mensaje, setMensaje] = useState(
    'Un grupo del curso de diseño en ingeniería podría prototipar los contenedores.',
  );
  const [enviado, setEnviado] = useState(false);

  function alternarForma(forma: string) {
    setFormas((actuales) =>
      actuales.includes(forma) ? actuales.filter((otra) => otra !== forma) : [...actuales, forma],
    );
  }

  return (
    <Pantalla>
      <Encabezado
        titulo="Quiero apoyar"
        tamanoDeTitulo={26}
        accion={<BotonCircular icono="cerrar" accesibilidad="Cerrar" onPress={volver} />}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: espacio.amplio,
            paddingTop: espacio.normal,
            paddingBottom: espacio.seccion,
            gap: espacio.amplio,
          }}
        >
          {propuesta === undefined ? null : (
            <Tarjeta separacion={espacio.corto}>
              <Texto tamano={17} peso="fuerte" interlineado={1.3}>
                {propuesta.titulo}
              </Texto>
              <Texto tamano={14} color={colores.grisTexto}>
                {`Propuesta de ${propuesta.autor.nombre} · ${propuesta.apoyos} apoyos`}
              </Texto>
            </Tarjeta>
          )}

          <Fila separacion={espacio.medio}>
            <Icono nombre="birrete" tamano={24} color="#2C5A8C" />
            <Columna crecer={1}>
              <Texto tamano={13} color={colores.grisTexto}>
                Como
              </Texto>
              <Texto tamano={16.5} peso="fuerte">
                FCFM, Universidad de Chile
              </Texto>
            </Columna>
          </Fila>

          <Columna separacion={espacio.comodo}>
            <Texto tamano={16} peso="fuerte">
              ¿Cómo apoyarían?
            </Texto>
            <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
              {formasDeApoyoInstitucional.map((forma) => (
                <Chip
                  key={forma}
                  texto={forma}
                  activo={formas.includes(forma)}
                  onPress={() => alternarForma(forma)}
                  variante="marcado"
                  alto={42}
                />
              ))}
            </Fila>
          </Columna>

          <Columna separacion={espacio.comodo}>
            <Texto tamano={16} peso="fuerte">
              ¿Cuándo?
            </Texto>
            <Fila separacion={espacio.normal} style={{ flexWrap: 'wrap' }}>
              {plazosDeApoyo.map((opcion) => (
                <Chip
                  key={opcion}
                  texto={opcion}
                  activo={plazo === opcion}
                  onPress={() => setPlazo(opcion)}
                  alto={42}
                />
              ))}
            </Fila>
          </Columna>

          <CampoTexto
            etiqueta="Mensaje para quienes proponen"
            valor={mensaje}
            onCambiar={setMensaje}
            lineas={4}
            maximoDeCaracteres={400}
          />

          <Aviso
            icono="candado"
            texto="Julia y República Circular recibirán un aviso. Solo ellos verán tu correo de contacto."
          />

          {enviado ? (
            <Aviso tono="logro" icono="visto" texto="Tu interés quedó enviado. Te van a escribir." />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior>
        <Boton
          texto={enviado ? 'Interés enviado' : 'Enviar interés'}
          icono={enviado ? 'visto' : 'enviar'}
          alto={56}
          tamanoDeTexto={18}
          variante={enviado ? 'tonal' : 'principal'}
          deshabilitado={formas.length === 0}
          onPress={() => setEnviado(true)}
          vibrar
        />
      </BarraInferior>
    </Pantalla>
  );
}
```

#### `app/observatorio.tsx`

8.3 Observatorio del barrio. (271 líneas)

```tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Encabezado } from '@/componentes/app';
import {
  Aviso,
  Boton,
  Chip,
  Columna,
  Fila,
  FilaDeLista,
  Icono,
  ListaAgrupada,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import {
  areaVerde,
  loQueFaltaSaber,
  platabandas,
  reportesDelMes,
  trabajosDevueltos,
} from '@/datos/observatorio';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { crearVolver } from '@/utiles/navegacion';

/** Las tres vistas del observatorio. */
const vistas = ['Resumen', 'Mapa de calor', 'Datos'] as const;

/**
 * 8.3 Observatorio del barrio.
 *
 * Cruza el catastro de 2022 con lo que reportan los vecinos hoy. Las cifras del
 * diagnostico son las reales de Republica Circular, y los reportes de vecinos
 * son datos de ejemplo del prototipo, lo que la pantalla dice de forma
 * explicita para no confundir una cosa con la otra.
 */
export default function Observatorio() {
  const volver = crearVolver('/inicio');
  const [vista, setVista] = useState<string>('Resumen');

  const totalDePlatabandas = platabandas.tramos.reduce((suma, tramo) => suma + tramo.valor, 0);
  const mayorDeLosReportes = Math.max(...reportesDelMes.filas.map((fila) => fila.valor));

  return (
    <Pantalla desplazable espacioAlFinal={espacio.bloque}>
      <Encabezado
        titulo="Observatorio del barrio"
        subtitulo="Catastro 2022 y reportes de vecinos"
        tamanoDeTitulo={26}
        onVolver={volver}
      />

      <Fila separacion={espacio.normal} style={{ paddingHorizontal: espacio.seccion }}>
        {vistas.map((opcion) => (
          <Chip
            key={opcion}
            texto={opcion}
            activo={vista === opcion}
            onPress={() => setVista(opcion)}
            tamanoDeTexto={14}
          />
        ))}
      </Fila>

      <Columna
        separacion={espacio.medio}
        style={{ paddingHorizontal: espacio.amplio, paddingTop: espacio.amplio }}
      >
        <Tarjeta relleno={18} separacion={espacio.medio}>
          <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
            PLATABANDAS
          </Texto>
          <Texto tamano={19} familia="tituloSemi" interlineado={1.2}>
            {platabandas.titular}
          </Texto>

          <Fila
            separacion={2}
            alinear="stretch"
            style={{ height: 14, borderRadius: radio.redondo, overflow: 'hidden' }}
          >
            {platabandas.tramos.map((tramo) => (
              <View
                key={tramo.etiqueta}
                style={{
                  flex: tramo.valor / totalDePlatabandas,
                  backgroundColor: tramo.color,
                }}
              />
            ))}
          </Fila>

          {platabandas.tramos.map((tramo) => (
            <Fila key={tramo.etiqueta} separacion={espacio.normal}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: radio.redondo,
                  backgroundColor: tramo.color,
                }}
              />
              <Texto tamano={15} style={{ flex: 1 }}>
                {tramo.etiqueta}
              </Texto>
              <Texto tamano={16} peso="fuerte">
                {String(tramo.valor)}
              </Texto>
            </Fila>
          ))}

          <Texto tamano={13.5} color={colores.grisTexto}>
            {platabandas.nota}
          </Texto>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={espacio.medio}>
          <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
            ÁREA VERDE POR HABITANTE
          </Texto>
          <Texto tamano={19} familia="tituloSemi" interlineado={1.2}>
            {areaVerde.titular}
          </Texto>

          {areaVerde.barras.map((barra) => (
            <Columna key={barra.etiqueta} separacion={espacio.corto}>
              <Fila repartir="space-between" separacion={espacio.normal}>
                <Texto
                  tamano={15}
                  peso={barra.destacada === true ? 'fuerte' : 'normal'}
                  style={{ flex: 1 }}
                >
                  {barra.etiqueta}
                </Texto>
                <Texto
                  tamano={15}
                  peso="fuerte"
                  color={barra.destacada === true ? colores.alerta : colores.tinta}
                >
                  {barra.valor}
                </Texto>
              </Fila>
              <View
                style={{
                  height: 10,
                  borderRadius: radio.redondo,
                  backgroundColor: colores.borde,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${Math.max(3, barra.proporcion * 100)}%`,
                    height: 10,
                    borderRadius: radio.redondo,
                    backgroundColor: barra.destacada === true ? colores.alerta : colores.verde,
                  }}
                />
              </View>
            </Columna>
          ))}

          <Texto tamano={13} color={colores.grisTexto} interlineado={1.35}>
            {areaVerde.nota}
          </Texto>
        </Tarjeta>

        <Tarjeta relleno={18} separacion={espacio.medio}>
          <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
            LO QUE FALTA SABER
          </Texto>
          <Texto tamano={19} familia="tituloSemi" interlineado={1.2}>
            {loQueFaltaSaber.titular}
          </Texto>

          {loQueFaltaSaber.filas.map((fila) => (
            <Columna key={fila.etiqueta} separacion={espacio.corto}>
              <Fila repartir="space-between" separacion={espacio.normal}>
                <Texto tamano={15} style={{ flex: 1 }}>
                  {fila.etiqueta}
                </Texto>
                <Texto tamano={15} peso="fuerte" color={colores.grisTexto}>
                  {`${fila.conseguido} de ${fila.total}`}
                </Texto>
              </Fila>
              <View
                style={{
                  height: 8,
                  borderRadius: radio.redondo,
                  backgroundColor: colores.borde,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${Math.max(1, (fila.conseguido / fila.total) * 100)}%`,
                    height: 8,
                    backgroundColor: colores.ocre,
                  }}
                />
              </View>
            </Columna>
          ))}

          <Boton
            texto="Ayudar a completarlo"
            variante="tonal"
            icono="mas"
            onPress={() => router.push('/mapa/ficha')}
          />
        </Tarjeta>

        <Tarjeta relleno={18} separacion={espacio.medio}>
          <Texto tamano={13} peso="fuerte" color={colores.grisTexto} espaciado={0.6}>
            {reportesDelMes.titulo}
          </Texto>

          {reportesDelMes.filas.map((fila) => (
            <Fila key={fila.etiqueta} separacion={espacio.comodo}>
              <Texto tamano={15} style={{ width: 130 }}>
                {fila.etiqueta}
              </Texto>
              <View style={{ flex: 1, height: 18, justifyContent: 'center' }}>
                <View
                  style={{
                    width: `${(fila.valor / mayorDeLosReportes) * 100}%`,
                    height: 18,
                    borderRadius: radio.chico - 1,
                    backgroundColor: fila.color,
                  }}
                />
              </View>
              <Texto tamano={15} peso="fuerte" style={{ width: 26 }} alineacion="right">
                {String(fila.valor)}
              </Texto>
            </Fila>
          ))}

          <Aviso tono="neutro" texto={reportesDelMes.nota} tamanoDeTexto={13} />
        </Tarjeta>

        <ListaAgrupada encabezado="TRABAJOS DEVUELTOS AL BARRIO">
          {trabajosDevueltos.map((trabajo, posicion) => (
            <FilaDeLista
              key={trabajo.id}
              titulo={trabajo.titulo}
              detalle={trabajo.autor}
              ultima={posicion === trabajosDevueltos.length - 1}
              conFlecha
              adorno={<Icono nombre="documento" tamano={24} color={colores.grisTexto} />}
            />
          ))}
        </ListaAgrupada>

        <Tarjeta relleno={18} separacion={espacio.medio}>
          <Texto tamano={19} familia="tituloSemi">
            Datos abiertos para investigar
          </Texto>
          <Texto tamano={14.5} color={colores.grisTexto} interlineado={1.4}>
            Sin nombres ni correos. Ubicaciones redondeadas a la cuadra.
          </Texto>
          <Boton texto="Descargar CSV o GeoJSON" variante="secundaria" icono="descargar" />
        </Tarjeta>
      </Columna>
    </Pantalla>
  );
}
```

### 17.18 Gestión y moderación

#### `app/gestion/panel.tsx`

9.1 Panel de gestión. (177 líneas)

```tsx
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
```

#### `app/gestion/moderar/[id].tsx`

9.2 Revisión de reporte. (206 líneas)

```tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Encabezado, RotuloDeCategoria } from '@/componentes/app';
import {
  Aviso,
  BarraInferior,
  Boton,
  Columna,
  Fila,
  Icono,
  Opcion,
  Pantalla,
  Tarjeta,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';
import { estados, idsDeEstado, type IdEstado } from '@/dominio/estados';
import { usarBarrio, usarReporte } from '@/estado/barrio';
import { crearVolver } from '@/utiles/navegacion';

/** Motivos por los que se puede ocultar un reporte. */
const motivosParaOcultar = [
  'No existe o es falso',
  'Tiene datos personales u ofensas',
  'Es delito o emergencia (derivar al 133)',
];

/**
 * 9.2 Revision de reporte.
 *
 * La moderacion no es un extra: el riesgo de reportes falsos aparecio en
 * terreno como la principal causa de desconfianza hacia la plataforma, y esa
 * desconfianza es anterior al uso.
 */
export default function RevisarReporte() {
  const volver = crearVolver('/gestion/panel');
  const { id } = useLocalSearchParams<{ id: string }>();
  const reporte = usarReporte(id);
  const { reportes, cambiarEstadoDeReporte, ocultarReporte } = usarBarrio();

  const [estadoElegido, setEstadoElegido] = useState<IdEstado | null>(null);
  const [motivo, setMotivo] = useState<string | null>(null);

  if (reporte === undefined) {
    return (
      <Pantalla>
        <Encabezado titulo="Reporte no encontrado" onVolver={volver} />
      </Pantalla>
    );
  }

  const posibleDuplicado = reportes.find(
    (otro) => otro.id !== reporte.id && otro.categoria === reporte.categoria && otro.esMio === false,
  );

  function guardar() {
    if (reporte === undefined) return;
    if (estadoElegido !== null) {
      cambiarEstadoDeReporte(reporte.id, estadoElegido);
    }
    router.back();
  }

  function ocultar() {
    if (reporte === undefined || motivo === null) return;
    ocultarReporte(reporte.id);
    router.dismissTo('/gestion/panel');
  }

  return (
    <Pantalla desplazable espacioAlFinal={espacio.amplio}>
      <Encabezado
        titulo="Revisar reporte"
        tamanoDeTitulo={26}
        onVolver={volver}
        textoDeVolver="Volver al panel"
      />

      {(reporte.senalamientos ?? 0) > 0 ? (
        <Aviso
          tono="cuidado"
          icono="bandera"
          style={{ marginHorizontal: espacio.amplio, marginBottom: espacio.medio }}
        >
          <Texto tamano={14.5} color="#6F4A0E" interlineado={1.4}>
            <Texto tamano={14.5} peso="fuerte" color="#6F4A0E">
              {`Señalado por ${reporte.senalamientos} vecinos `}
            </Texto>
            {'como «no existe». Nadie más lo ha confirmado.'}
          </Texto>
        </Aviso>
      ) : null}

      <Tarjeta style={{ marginHorizontal: espacio.amplio }} relleno={18}>
        <Fila repartir="space-between" separacion={espacio.normal}>
          <RotuloDeCategoria categoria={reporte.categoria} />
          <Texto tamano={13} color={colores.grisTexto}>
            {reporte.publicado}
          </Texto>
        </Fila>
        <Texto tamano={20} familia="tituloSemi" interlineado={1.2}>
          {reporte.titulo}
        </Texto>
        <Texto tamano={14} color={colores.grisTexto}>
          {reporte.anonimo ? 'Publicado como anónimo' : `Publicado por ${reporte.autor?.nombre}`}
        </Texto>
        {reporte.descripcion === undefined ? null : (
          <Texto tamano={15.5} interlineado={1.4}>
            {`«${reporte.descripcion}»`}
          </Texto>
        )}
      </Tarjeta>

      {posibleDuplicado === undefined ? null : (
        <Tarjeta style={{ marginHorizontal: espacio.amplio, marginTop: espacio.medio }} relleno={18}>
          <Fila separacion={espacio.comodo}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radio.medio,
                backgroundColor: '#F5E6C8',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icono nombre="enlace" tamano={22} color="#8A5A12" />
            </View>
            <Texto tamano={16.5} peso="fuerte" style={{ flex: 1 }} interlineado={1.3}>
              Puede ser el mismo que otro reporte
            </Texto>
          </Fila>
          <Texto tamano={14.5} color={colores.grisTexto} interlineado={1.4}>
            {`«${posibleDuplicado.titulo}», a 25 m, con ${posibleDuplicado.confirmaciones} confirmaciones.`}
          </Texto>
          <Boton texto="Unir los dos reportes" variante="secundaria" icono="enlace" />
        </Tarjeta>
      )}

      <Columna
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.seccion }}
      >
        <Texto tamano={21} familia="tituloSemi">
          Cambiar estado
        </Texto>
        <Fila separacion={espacio.normal} alinear="stretch" style={{ flexWrap: 'wrap' }}>
          {idsDeEstado.map((cual) => (
            <Opcion
              key={cual}
              texto={estados[cual].etiqueta}
              compacta
              seleccion="unica"
              activa={(estadoElegido ?? reporte.estado) === cual}
              onPress={() => setEstadoElegido(cual)}
              style={{ flexGrow: 1, flexBasis: '45%' }}
            />
          ))}
        </Fila>
      </Columna>

      <Columna
        separacion={espacio.comodo}
        style={{ marginHorizontal: espacio.amplio, marginTop: espacio.seccion }}
      >
        <Texto tamano={21} familia="tituloSemi">
          Si lo ocultas, ¿por qué?
        </Texto>
        {motivosParaOcultar.map((cual) => (
          <Opcion
            key={cual}
            texto={cual}
            seleccion="unica"
            activa={motivo === cual}
            onPress={() => setMotivo(cual)}
          />
        ))}
        <Texto tamano={13.5} color={colores.grisTexto}>
          Quien lo publicó recibe el motivo.
        </Texto>
      </Columna>

      <BarraInferior alFinal={false} style={{ marginTop: espacio.seccion }}>
        <Fila separacion={espacio.comodo}>
          <Boton
            texto="Ocultar"
            variante="peligro"
            deshabilitado={motivo === null}
            onPress={ocultar}
            style={{ flex: 1 }}
          />
          <Boton
            texto="Guardar cambios"
            deshabilitado={estadoElegido === null}
            onPress={guardar}
            vibrar
            style={{ flex: 1.4 }}
          />
        </Fila>
      </BarraInferior>
    </Pantalla>
  );
}
```

---

---

## 18. Lo que se sumó al conectar el backend

Este capítulo recoge lo que entró al proyecto después del corte del 13 de
octubre, cuando la aplicación pasó de trabajar con datos en memoria a hacerlo
contra Supabase. El capítulo 11 describe las pantallas tal como estaban en ese
corte; la tabla siguiente dice cuáles cambiaron y en qué.

| Pantalla | Qué cambió |
|---|---|
| 1.1 Bienvenida | Dejó de ofrecer reportar sin crear cuenta |
| 1.4 Crear la cuenta | Dejó de ser opcional y ahora manda el código al correo |
| 1.5 Código de ingreso | Pantalla nueva |
| 2.2 Mapa | Teselas reales de OpenStreetMap y las capas del catastro |
| 2.3 Capas del mapa | El detalle de cada capa cuenta los elementos cargados |
| 3.2 Foto | Las fotografías se suben al depósito al publicar |
| 3.4 Ubicación | La posición elegida se guarda como geografía |
| 3.5 Revisar | El autor que se muestra es el de la sesión |
| 3.7 Enviado | El saludo usa el nombre de quien entró |
| 4.1 Inicio | El saludo y el avatar son los de la sesión |
| 7.2 Perfil | El nombre y la inicial son los de la sesión |
| 7.3 Ajustes | «Cerrar sesión» cierra la sesión de verdad |
| Disposición raíz | Comprueba la sesión antes de dejar entrar a cualquier dirección |

Los trece archivos que no existían en el corte anterior van a continuación, con
el mismo formato del capítulo 17.


### 18.1 Acceso a datos

#### `src/datos/cliente.ts`

Conexion con Supabase. Es opcional a proposito: sin credenciales configuradas la aplicacion sigue navegable con los datos de ejemplo. (68 líneas)

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Conexion con Supabase.
 *
 * El prototipo tiene que seguir corriendo sin backend, porque asi se muestra
 * en reuniones y se prueba con vecinos. Por eso la conexion es opcional: si no
 * hay credenciales configuradas, hayBackend queda en falso y el estado sigue
 * trabajando con los datos de ejemplo en memoria.
 *
 * Las credenciales van en un archivo .env.local, que el .gitignore excluye.
 * Ver .env.example.
 */

const direccion = process.env.EXPO_PUBLIC_SUPABASE_URL;

// Clave publicable, la que Supabase reemplazo por la antigua clave anonima.
// Viaja dentro de la aplicacion y eso es correcto: lo que protege los datos no
// es esconderla, son las politicas de fila.
const clavePublica = process.env.EXPO_PUBLIC_SUPABASE_CLAVE_PUBLICA;

export const hayBackend: boolean =
  typeof direccion === 'string' &&
  direccion !== '' &&
  typeof clavePublica === 'string' &&
  clavePublica !== '';

/**
 * Nulo mientras no haya credenciales. Las funciones de datos lo comprueban
 * antes de usarlo, en vez de dejar que reviente en medio de una pantalla.
 */
export const cliente: SupabaseClient | null = hayBackend
  ? createClient(direccion as string, clavePublica as string, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        // En un telefono no hay barra de direcciones de donde leer la sesion,
        // y en el navegador la aplicacion no usa enlaces de retorno.
        detectSessionInUrl: false,
      },
    })
  : null;

/**
 * Si hay una sesion abierta.
 *
 * Casi todo lo que la base expone exige cuenta, incluidas las capas del
 * catastro. Preguntarlo antes de consultar evita disparar peticiones que la
 * base va a rechazar mientras el ingreso por correo no exista.
 */
export async function haySesion(): Promise<boolean> {
  if (cliente === null) return false;
  const { data } = await cliente.auth.getSession();
  return data.session !== null;
}

/** Atajo para las funciones de datos, que no pueden trabajar sin conexion. */
export function exigirCliente(): SupabaseClient {
  if (cliente === null) {
    throw new Error(
      'No hay conexion con Supabase. Falta configurar EXPO_PUBLIC_SUPABASE_URL y ' +
        'EXPO_PUBLIC_SUPABASE_CLAVE_PUBLICA en .env.local.',
    );
  }
  return cliente;
}
```

#### `src/datos/sesion.ts`

Pedir el codigo, canjearlo, cerrar sesion y leer o crear el perfil. (133 líneas)

```ts
import type { Persona } from '@/dominio/tipos';
import { inicialDe } from '@/utiles/fechas';

import { cliente, exigirCliente } from './cliente';

/**
 * Entrar a la plataforma.
 *
 * El mecanismo lo decidio la contraparte el 19 de octubre: crear cuenta es
 * obligatorio, no hay contrasena y se entra con un codigo de seis numeros que
 * llega al correo. La cuenta no pide nombre real ni RUT.
 *
 * El por que de cada mitad: la cuenta obligatoria responde a que alguien
 * podria crearse varias identidades e inflar la priorizacion comunitaria. La
 * ausencia de contrasena responde a lo contrario, a que la friccion del
 * registro fue la barrera de abandono que mas aparecio en terreno, y a que el
 * Banco del Tiempo murio en parte por no tener recuperacion de contrasenas.
 */

type FilaDePersona = {
  id: string;
  seudonimo: string;
  vinculo: string;
  es_organizacion: boolean;
};

function personaDesde(fila: FilaDePersona): Persona {
  return {
    id: fila.id,
    nombre: fila.seudonimo,
    inicial: inicialDe(fila.seudonimo),
    vinculo: fila.vinculo,
    esOrganizacion: fila.es_organizacion,
  };
}

/** Manda el codigo al correo. Crea la cuenta si todavia no existe. */
export async function pedirCodigo(correo: string): Promise<void> {
  const { error } = await exigirCliente().auth.signInWithOtp({
    email: correo.trim().toLowerCase(),
    options: { shouldCreateUser: true },
  });
  if (error !== null) throw new Error(traducir(error.message));
}

/** Canjea el codigo por una sesion. */
export async function confirmarCodigo(correo: string, codigo: string): Promise<void> {
  const { error } = await exigirCliente().auth.verifyOtp({
    email: correo.trim().toLowerCase(),
    token: codigo.trim(),
    type: 'email',
  });
  if (error !== null) throw new Error(traducir(error.message));
}

export async function cerrarSesion(): Promise<void> {
  if (cliente === null) return;
  await cliente.auth.signOut();
}

/**
 * El perfil de quien tiene la sesion abierta, o nulo si todavia no lo creo.
 *
 * Entrar y tener perfil son dos cosas distintas: la cuenta nace con el
 * codigo al correo, y el seudonimo con que el barrio te reconoce se elige
 * despues, en el paso de perfil.
 */
export async function perfilActual(): Promise<Persona | null> {
  if (cliente === null) return null;

  const { data: sesion } = await cliente.auth.getSession();
  const identificador = sesion.session?.user.id;
  if (identificador === undefined) return null;

  const { data, error } = await cliente
    .from('personas')
    .select('id, seudonimo, vinculo, es_organizacion')
    .eq('id', identificador)
    .maybeSingle();

  if (error !== null) throw new Error(error.message);
  if (data === null) return null;
  return personaDesde(data as FilaDePersona);
}

/** Crea el perfil de quien acaba de entrar. */
export async function crearPerfil(seudonimo: string, vinculo: string): Promise<Persona> {
  const supabase = exigirCliente();
  const { data: sesion } = await supabase.auth.getSession();
  const identificador = sesion.session?.user.id;
  if (identificador === undefined) throw new Error('No hay sesión abierta');

  const { data, error } = await supabase
    .from('personas')
    .insert({ id: identificador, seudonimo: seudonimo.trim(), vinculo })
    .select('id, seudonimo, vinculo, es_organizacion')
    .single();

  if (error !== null) {
    if (error.code === '23505') throw new Error('Ese seudónimo ya lo usa alguien del barrio');
    throw new Error(error.message);
  }
  return personaDesde(data as FilaDePersona);
}

/** Avisa cuando la sesion se abre o se cierra, para que el estado reaccione. */
export function alCambiarLaSesion(hacer: () => void): () => void {
  if (cliente === null) return () => {};
  const { data } = cliente.auth.onAuthStateChange(() => hacer());
  return () => data.subscription.unsubscribe();
}

/**
 * Los mensajes de Supabase llegan en ingles y hablan de tokens. Se traducen a
 * algo que una vecina pueda entender, que es la regla de lenguaje del
 * sistema visual.
 */
function traducir(mensaje: string): string {
  const minusculas = mensaje.toLowerCase();
  if (minusculas.includes('invalid') && minusculas.includes('token')) {
    return 'Ese código no es correcto. Revísalo o pide uno nuevo.';
  }
  if (minusculas.includes('expired')) {
    return 'El código ya venció. Pide uno nuevo.';
  }
  if (minusculas.includes('rate limit') || minusculas.includes('too many')) {
    return 'Pediste varios códigos seguidos. Espera un momento y vuelve a intentar.';
  }
  if (minusculas.includes('invalid') && minusculas.includes('email')) {
    return 'Ese correo no parece válido.';
  }
  return mensaje;
}
```

#### `src/datos/reportesEnLinea.ts`

Las funciones de reportes contra la base: publicar, listar, confirmar, senalar y buscar cerca. (268 líneas)

```ts
import type { IdCategoria } from '@/dominio/categorias';
import type { IdEstado } from '@/dominio/estados';
import type { EventoDeSeguimiento, Persona, PuntoEnMapa, Reporte } from '@/dominio/tipos';
import { diaYMes, hace, inicialDe } from '@/utiles/fechas';

import { exigirCliente } from './cliente';

/**
 * Registrar y consultar reportes contra Supabase.
 *
 * Vive en src/datos y no en src/estado por la regla de capas: el estado llama
 * a estas funciones y las pantallas llaman al estado. Ninguna pantalla importa
 * este archivo.
 *
 * Toda lectura pasa por la vista reportes_publicos, que es la unica puerta que
 * la base abre al cliente. Un reporte anonimo llega sin autor porque la vista
 * ya lo corto, no porque aqui se decida esconderlo.
 */

/** Lo que la vista reportes_publicos devuelve por cada reporte. */
type FilaDeReporte = {
  id: string;
  categoria: IdCategoria;
  subtipo: string | null;
  titulo: string;
  direccion: string;
  estado: IdEstado;
  descripcion: string | null;
  como_se_formo: string | null;
  desde_cuando: string | null;
  publicado_en: string;
  latitud: number;
  longitud: number;
  tiene_foto: boolean;
  anonimo: boolean;
  autor: string | null;
  autor_seudonimo: string | null;
  autor_vinculo: string | null;
  autor_es_organizacion: boolean | null;
  es_mio: boolean;
  confirmaciones: number;
  senalamientos: number;
};

type FilaDeSeguimiento = {
  reporte: string;
  estado: IdEstado;
  detalle: string;
  ocurrio_en: string | null;
};

export type DatosParaCrearReporte = {
  categoria: IdCategoria;
  titulo: string;
  direccion: string;
  posicion: PuntoEnMapa;
  anonimo: boolean;
  subtipo?: string;
  descripcion?: string;
  comoSeFormo?: string;
  desdeCuando?: string;
  tieneFoto: boolean;
};

export type FiltroDeReportes = {
  categoria?: IdCategoria;
  estado?: IdEstado;
  soloMios?: boolean;
};

/** Las columnas de la vista, en el orden en que la base las entrega. */
const COLUMNAS = '*';

/**
 * Arma la persona a partir de lo que la vista deja pasar. Devuelve nulo
 * cuando el reporte es anonimo, que es como el resto de la aplicacion
 * representa que no hay a quien mostrar.
 */
function personaDesde(fila: FilaDeReporte): Persona | null {
  if (fila.anonimo || fila.autor === null || fila.autor_seudonimo === null) {
    return null;
  }
  return {
    id: fila.autor,
    nombre: fila.autor_seudonimo,
    // La inicial se deriva del seudonimo, no se guarda en la base.
    inicial: inicialDe(fila.autor_seudonimo),
    vinculo: fila.autor_vinculo ?? '',
    esOrganizacion: fila.autor_es_organizacion ?? false,
  };
}

function seguimientoDesde(filas: FilaDeSeguimiento[]): EventoDeSeguimiento[] {
  return filas.map((fila) => ({
    estado: fila.estado,
    fecha: fila.ocurrio_en === null ? undefined : diaYMes(new Date(fila.ocurrio_en)),
    detalle: fila.detalle,
    // Que el paso ya haya ocurrido se deriva de si tiene fecha, no se guarda.
    ocurrio: fila.ocurrio_en !== null,
  }));
}

function reporteDesde(fila: FilaDeReporte, seguimiento: EventoDeSeguimiento[]): Reporte {
  const publicado = new Date(fila.publicado_en);
  return {
    id: fila.id,
    categoria: fila.categoria,
    subtipo: fila.subtipo ?? undefined,
    titulo: fila.titulo,
    direccion: fila.direccion,
    estado: fila.estado,
    descripcion: fila.descripcion ?? undefined,
    comoSeFormo: fila.como_se_formo ?? undefined,
    desdeCuando: fila.desde_cuando ?? undefined,
    publicado: hace(publicado),
    // El resumen tampoco se guarda: se arma al mostrar, por eso siempre dice
    // la verdad aunque el reporte lleve meses publicado.
    resumen: `Enviado ${hace(publicado)}`,
    confirmaciones: fila.confirmaciones,
    senalamientos: fila.senalamientos,
    anonimo: fila.anonimo,
    autor: personaDesde(fila),
    esMio: fila.es_mio,
    tieneFoto: fila.tiene_foto,
    posicion: { latitud: fila.latitud, longitud: fila.longitud },
    seguimiento,
    // Las propuestas y los comentarios se traen aparte, cuando la pantalla de
    // detalle los necesita. No se cargan al listar el mapa.
    propuestas: [],
    comentarios: [],
  };
}

/** Trae el seguimiento de varios reportes de una vez, agrupado por reporte. */
async function seguimientoDe(ids: string[]): Promise<Map<string, EventoDeSeguimiento[]>> {
  const agrupado = new Map<string, EventoDeSeguimiento[]>();
  if (ids.length === 0) return agrupado;

  const { data, error } = await exigirCliente()
    .from('eventos_de_seguimiento')
    .select('reporte, estado, detalle, ocurrio_en')
    .in('reporte', ids);

  if (error !== null) throw new Error(error.message);

  const filas = (data ?? []) as FilaDeSeguimiento[];
  for (const id of ids) {
    agrupado.set(
      id,
      seguimientoDesde(filas.filter((fila) => fila.reporte === id)),
    );
  }
  return agrupado;
}

/**
 * Publica un reporte y devuelve su identificador.
 *
 * El autor no se manda: lo pone la base a partir de la sesion, que es la unica
 * forma de que nadie publique a nombre de otro.
 */
export async function crearReporte(datos: DatosParaCrearReporte): Promise<string> {
  const { data, error } = await exigirCliente().rpc('crear_reporte', {
    p_categoria: datos.categoria,
    p_titulo: datos.titulo,
    p_direccion: datos.direccion,
    p_latitud: datos.posicion.latitud,
    p_longitud: datos.posicion.longitud,
    p_anonimo: datos.anonimo,
    p_subtipo: datos.subtipo ?? null,
    p_descripcion: datos.descripcion ?? null,
    p_como_se_formo: datos.comoSeFormo ?? null,
    p_desde_cuando: datos.desdeCuando ?? null,
    p_tiene_foto: datos.tieneFoto,
  });

  if (error !== null) throw new Error(error.message);
  return data as string;
}

/** Un reporte con su seguimiento, para la pantalla de detalle. */
export async function obtenerReporte(id: string): Promise<Reporte | undefined> {
  const { data, error } = await exigirCliente()
    .from('reportes_publicos')
    .select(COLUMNAS)
    .eq('id', id)
    .maybeSingle();

  if (error !== null) throw new Error(error.message);
  if (data === null) return undefined;

  const fila = data as FilaDeReporte;
  const seguimiento = await seguimientoDe([fila.id]);
  return reporteDesde(fila, seguimiento.get(fila.id) ?? []);
}

/** Listado para el mapa y para el panel de gestion. */
export async function listarReportes(filtro: FiltroDeReportes = {}): Promise<Reporte[]> {
  let consulta = exigirCliente()
    .from('reportes_publicos')
    .select(COLUMNAS)
    .order('publicado_en', { ascending: false });

  if (filtro.categoria !== undefined) consulta = consulta.eq('categoria', filtro.categoria);
  if (filtro.estado !== undefined) consulta = consulta.eq('estado', filtro.estado);
  if (filtro.soloMios === true) consulta = consulta.eq('es_mio', true);

  const { data, error } = await consulta;
  if (error !== null) throw new Error(error.message);

  const filas = (data ?? []) as FilaDeReporte[];
  const seguimiento = await seguimientoDe(filas.map((fila) => fila.id));
  return filas.map((fila) => reporteDesde(fila, seguimiento.get(fila.id) ?? []));
}

/**
 * Reportes dentro de un radio, ordenados del mas cercano al mas lejano.
 *
 * El filtro corre en la base contra el indice espacial. Es lo que permite que
 * el paso de ubicacion avise de un posible duplicado sin descargar el barrio
 * entero.
 */
export async function listarReportesCerca(
  punto: PuntoEnMapa,
  radioEnMetros = 300,
): Promise<Reporte[]> {
  const { data, error } = await exigirCliente().rpc('reportes_cerca', {
    p_latitud: punto.latitud,
    p_longitud: punto.longitud,
    p_radio_metros: radioEnMetros,
  });

  if (error !== null) throw new Error(error.message);

  const filas = (data ?? []) as FilaDeReporte[];
  const seguimiento = await seguimientoDe(filas.map((fila) => fila.id));
  return filas.map((fila) => reporteDesde(fila, seguimiento.get(fila.id) ?? []));
}

/**
 * Confirma que el reporte existe y devuelve cuantas confirmaciones lleva.
 *
 * Confirmar dos veces o confirmar el reporte propio lo rechaza la base, no
 * esta funcion. Aqui solo se traduce el rechazo a un mensaje que la pantalla
 * pueda mostrar.
 */
export async function confirmarReporte(id: string): Promise<number> {
  const { data, error } = await exigirCliente().rpc('confirmar_reporte', {
    p_reporte: id,
  });

  if (error !== null) {
    if (error.code === '23505') throw new Error('Ya confirmaste este reporte');
    if (error.code === '23514') throw new Error('No puedes confirmar tu propio reporte');
    throw new Error(error.message);
  }
  return data as number;
}

/** Marca el reporte como posiblemente inexistente, lo que dispara revision. */
export async function senalarReporte(id: string, motivo?: string): Promise<void> {
  const { error } = await exigirCliente().rpc('senalar_reporte', {
    p_reporte: id,
    p_motivo: motivo ?? null,
  });

  if (error !== null) throw new Error(error.message);
}
```

#### `src/datos/fotosDeReporte.ts`

Subir una fotografia reducida, asociarla al reporte y entregarla con enlaces firmados que caducan. (157 líneas)

```ts
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { exigirCliente } from './cliente';

/**
 * Fotografias de los reportes.
 *
 * El diagnostico 2022 dejo previsto un campo para colgarle una foto a cada
 * punto y nunca lo lleno. Esto es lo que cierra esa brecha: la ubicacion ya
 * estaba levantada y lo que faltaba era mostrar en que estado esta.
 *
 * El deposito es privado, asi que las fotos no se leen por direccion publica
 * sino con un enlace firmado que caduca.
 */

const DEPOSITO = 'fotos-de-reportes';

/** El diseno admite hasta tres fotos por reporte. */
export const MAXIMO_DE_FOTOS = 3;

/**
 * Lado mayor al que se reduce cada foto antes de subirla.
 *
 * El plan gratuito da 1 GB de almacenamiento y la bitacora lo senala como el
 * primer limite que se va a alcanzar. A 1600 pixeles y calidad 0,6 una foto
 * de telefono queda en unos 300 a 600 KB, de modo que el GB alcanza para unos
 * 550 reportes con tres fotos cada uno. Sin reducir, alcanzaria para 70.
 */
const LADO_MAYOR = 1600;
const CALIDAD = 0.6;

/** Cuanto dura el enlace firmado con el que se muestra una foto. */
const SEGUNDOS_DE_VIGENCIA = 60 * 60;

export type FotoDeReporte = {
  id: string;
  orden: number;
  /** Enlace firmado, listo para pasarle a un componente Image. */
  url: string;
};

type FilaDeFoto = {
  id: string;
  ruta: string;
  orden: number;
};

/**
 * Reduce y recomprime antes de subir.
 *
 * Recomprimir tiene un efecto secundario buscado: la imagen resultante se
 * escribe de nuevo y pierde los metadatos EXIF del original, donde el telefono
 * suele dejar la coordenada exacta y el modelo del aparato. La posicion del
 * reporte la elige la persona en el mapa, no la foto.
 */
async function prepararParaSubir(uri: string): Promise<Blob> {
  const contexto = ImageManipulator.manipulate(uri).resize({ width: LADO_MAYOR });
  const imagen = await contexto.renderAsync();
  const reducida = await imagen.saveAsync({
    compress: CALIDAD,
    format: SaveFormat.JPEG,
  });

  const respuesta = await fetch(reducida.uri);
  return await respuesta.blob();
}

/**
 * Sube una foto y la asocia al reporte.
 *
 * La ruta lleva el identificador del reporte como carpeta, que es lo que
 * permite que las politicas del deposito decidan si quien sube es la autora
 * mirando solo el nombre del archivo.
 */
export async function subirFotoDeReporte(
  idReporte: string,
  uri: string,
  orden: number,
): Promise<void> {
  const supabase = exigirCliente();
  const ruta = `${idReporte}/${orden}.jpg`;
  const contenido = await prepararParaSubir(uri);

  const { error: errorAlSubir } = await supabase.storage
    .from(DEPOSITO)
    .upload(ruta, contenido, { contentType: 'image/jpeg', upsert: true });

  if (errorAlSubir !== null) throw new Error(errorAlSubir.message);

  const { error: errorAlAsociar } = await supabase
    .from('fotos_de_reporte')
    .upsert({ reporte: idReporte, ruta, orden }, { onConflict: 'reporte,orden' });

  // Si la fila no se pudo escribir, el archivo quedaria huerfano ocupando
  // espacio sin que ninguna pantalla lo muestre, asi que se retira.
  if (errorAlAsociar !== null) {
    await supabase.storage.from(DEPOSITO).remove([ruta]);
    throw new Error(errorAlAsociar.message);
  }
}

/** Sube las fotos de un reporte recien publicado, en orden. */
export async function subirFotosDeReporte(idReporte: string, uris: string[]): Promise<void> {
  const cuantas = Math.min(uris.length, MAXIMO_DE_FOTOS);
  for (let posicion = 0; posicion < cuantas; posicion += 1) {
    const uri = uris[posicion];
    if (uri === undefined) continue;
    await subirFotoDeReporte(idReporte, uri, posicion + 1);
  }
}

/** Las fotos de un reporte, con enlaces firmados listos para mostrar. */
export async function fotosDeReporte(idReporte: string): Promise<FotoDeReporte[]> {
  const supabase = exigirCliente();

  const { data, error } = await supabase
    .from('fotos_de_reporte')
    .select('id, ruta, orden')
    .eq('reporte', idReporte)
    .order('orden');

  if (error !== null) throw new Error(error.message);

  const filas = (data ?? []) as FilaDeFoto[];
  if (filas.length === 0) return [];

  const { data: firmadas, error: errorAlFirmar } = await supabase.storage
    .from(DEPOSITO)
    .createSignedUrls(
      filas.map((fila) => fila.ruta),
      SEGUNDOS_DE_VIGENCIA,
    );

  if (errorAlFirmar !== null) throw new Error(errorAlFirmar.message);

  return filas.flatMap((fila, posicion) => {
    const url = firmadas?.[posicion]?.signedUrl;
    if (url === undefined || url === null) return [];
    return [{ id: fila.id, orden: fila.orden, url }];
  });
}

/** Quita una foto del reporte y del deposito. */
export async function borrarFotoDeReporte(idReporte: string, orden: number): Promise<void> {
  const supabase = exigirCliente();
  const ruta = `${idReporte}/${orden}.jpg`;

  const { error } = await supabase
    .from('fotos_de_reporte')
    .delete()
    .eq('reporte', idReporte)
    .eq('orden', orden);

  if (error !== null) throw new Error(error.message);

  await supabase.storage.from(DEPOSITO).remove([ruta]);
}
```

#### `src/datos/catastroEnLinea.ts`

Los elementos del catastro dentro de un recuadro y cuantos tiene cada capa. (96 líneas)

```ts
import type { IdCapaDelCatastro } from '@/dominio/capas';
import { esCapaDelCatastro } from '@/dominio/capas';
import type { ElementoEnElMapa, RecuadroDelMapa } from '@/dominio/tipos';

import { exigirCliente } from './cliente';

/**
 * Las capas del catastro socioambiental 2022, leidas desde la base.
 *
 * La consulta pide solo lo que entra en el recuadro visible y solo de las
 * capas encendidas. El filtro corre en la base contra el indice espacial: con
 * 903 elementos traerlos todos todavia funcionaria, pero el catastro completo
 * son 2.032 y el barrio sigue reportando.
 */

type FilaDeElemento = {
  id: string;
  capa: string;
  fid: number;
  latitud: number;
  longitud: number;
  tipo_de_geometria: string;
  area_m2: number;
  largo_m: number;
  direccion: string | null;
  estado_platabanda: string | null;
  tipo_microbasural: string | null;
  quien_lo_cuida: string | null;
  anotado_en: string | null;
};

function elementoDesde(fila: FilaDeElemento): ElementoEnElMapa | null {
  // Una capa que exista en la base pero que la aplicacion no sepa dibujar se
  // omite en vez de romper la pantalla. Pasaria si alguien carga una de las
  // veintitres capas que quedaron fuera.
  if (!esCapaDelCatastro(fila.capa)) return null;

  return {
    id: fila.id,
    capa: fila.capa,
    fid: fila.fid,
    posicion: { latitud: fila.latitud, longitud: fila.longitud },
    tipoDeGeometria: fila.tipo_de_geometria,
    areaM2: fila.area_m2,
    largoM: fila.largo_m,
    direccion: fila.direccion ?? undefined,
    estadoDePlatabanda: fila.estado_platabanda ?? undefined,
    tipoDeMicrobasural: fila.tipo_microbasural ?? undefined,
    quienLoCuida: fila.quien_lo_cuida ?? undefined,
  };
}

/** Los elementos visibles en un recuadro, de las capas que se le pidan. */
export async function elementosEnRecuadro(
  recuadro: RecuadroDelMapa,
  capas: IdCapaDelCatastro[],
): Promise<ElementoEnElMapa[]> {
  if (capas.length === 0) return [];

  const { data, error } = await exigirCliente().rpc('elementos_en_recuadro', {
    p_sur: recuadro.sur,
    p_oeste: recuadro.oeste,
    p_norte: recuadro.norte,
    p_este: recuadro.este,
    p_capas: capas,
  });

  if (error !== null) throw new Error(error.message);

  return ((data ?? []) as FilaDeElemento[]).flatMap((fila) => {
    const elemento = elementoDesde(fila);
    return elemento === null ? [] : [elemento];
  });
}

/**
 * Cuantos elementos cargados tiene cada capa, para el detalle de la lista.
 *
 * Cuenta lo que hay y no lo que el diagnostico declara. Son cifras distintas:
 * en microbasurales el diagnostico anota 40 y hay 39, porque uno queda a dos
 * kilometros del barrio y la carga lo rechaza. Un numero en pantalla que no
 * corresponde a lo que se puede tocar en el mapa es peor que no mostrarlo.
 */
export async function conteoPorCapa(): Promise<Record<string, number>> {
  const { data, error } = await exigirCliente()
    .from('conteo_de_capas')
    .select('capa, elementos');

  if (error !== null) throw new Error(error.message);

  const conteo: Record<string, number> = {};
  for (const fila of (data ?? []) as { capa: string; elementos: number }[]) {
    conteo[fila.capa] = fila.elementos;
  }
  return conteo;
}
```


### 18.2 Dominio

#### `src/dominio/barrio.ts`

El recuadro del barrio y los niveles de acercamiento del mapa. (34 líneas)

```ts
import type { PuntoEnMapa } from './tipos';

/**
 * Donde queda el barrio, en coordenadas reales.
 *
 * El recuadro sale de la capa "Delimitacion de area de estudio" del catastro
 * socioambiental 2022, que viene en EPSG:4326. No es una aproximacion dibujada
 * a ojo: es el mismo poligono con el que la contraparte levanto el diagnostico,
 * y por eso define que entra y que no entra al barrio en toda la aplicacion.
 */
export const RECUADRO_DEL_BARRIO = {
  oeste: -70.671086,
  este: -70.655836,
  sur: -33.458024,
  norte: -33.446147,
} as const;

export const CENTRO_DEL_BARRIO: PuntoEnMapa = {
  latitud: (RECUADRO_DEL_BARRIO.sur + RECUADRO_DEL_BARRIO.norte) / 2,
  longitud: (RECUADRO_DEL_BARRIO.oeste + RECUADRO_DEL_BARRIO.este) / 2,
};

/**
 * El barrio mide alrededor de 1,4 km de lado. En zoom 15 cabe entero en una
 * pantalla de telefono y en 16 se distingue la vereda, que es el detalle que
 * hace falta para dejar un reporte donde corresponde.
 */
export const ZOOM_MINIMO = 14;
export const ZOOM_MAXIMO = 18;
export const ZOOM_DEL_BARRIO = 15;
export const ZOOM_PARA_UBICAR = 17;

/** Hasta donde se puede arrastrar el mapa antes de salirse del barrio. */
export const MARGEN_FUERA_DEL_BARRIO = 0.004;
```

#### `src/dominio/capas.ts`

Las ocho capas del catastro con su icono y su color, y los colores por estado de platabanda. (114 líneas)

```ts
import type { NombreIcono } from '@/diseno/iconos';

/**
 * Las capas del catastro socioambiental 2022 que la plataforma muestra.
 *
 * Son ocho y no las treinta y una del diagnostico. Las otras veintitres o
 * bien no estan en los mapas web que la organizacion publico, o bien quedaron
 * con la geometria levantada y los atributos vacios, como los 172 semaforos y
 * las 249 veredas. Mostrar un punto del que no se sabe nada no ayuda a nadie.
 *
 * Los colores viven aqui y no en la paleta general por la misma razon que los
 * de las categorias de reporte: son vocabulario del dominio, no decoracion.
 */

export const idsDeCapaDelCatastro = [
  'microbasurales',
  'platabandas',
  'basureros',
  'reciclaje',
  'areas-verdes',
  'bancas',
  'paraderos',
  'ciclovias',
] as const;

export type IdCapaDelCatastro = (typeof idsDeCapaDelCatastro)[number];

export type CapaDelCatastro = {
  id: IdCapaDelCatastro;
  etiqueta: string;
  color: string;
  icono: NombreIcono;
};

export const capasDelCatastro: Record<IdCapaDelCatastro, CapaDelCatastro> = {
  microbasurales: {
    id: 'microbasurales',
    etiqueta: 'Microbasurales',
    color: '#7A4A1F',
    icono: 'basura',
  },
  platabandas: {
    id: 'platabandas',
    etiqueta: 'Platabandas',
    color: '#2E6B3F',
    icono: 'arbol',
  },
  basureros: {
    id: 'basureros',
    etiqueta: 'Basureros',
    color: '#4A5560',
    icono: 'basura',
  },
  reciclaje: {
    id: 'reciclaje',
    etiqueta: 'Puntos de reciclaje',
    color: '#1F7A6B',
    icono: 'hoja',
  },
  'areas-verdes': {
    id: 'areas-verdes',
    etiqueta: 'Áreas verdes',
    color: '#3F8F4F',
    icono: 'arbol',
  },
  bancas: {
    id: 'bancas',
    etiqueta: 'Bancas',
    color: '#8C6A3F',
    icono: 'mobiliario',
  },
  paraderos: {
    id: 'paraderos',
    etiqueta: 'Paraderos',
    color: '#2C5A8C',
    icono: 'calle',
  },
  ciclovias: {
    id: 'ciclovias',
    etiqueta: 'Ciclovías',
    color: '#6B4380',
    icono: 'calle',
  },
};

/**
 * Las platabandas se colorean por su estado de uso y no con un color unico.
 *
 * Es la unica capa que lo hace, y no es un capricho: el diagnostico la
 * simboliza asi en su propio mapa web, y el dato que importa del barrio es
 * que 262 de las 500 estan abandonadas o ya se pavimentaron. Con un color
 * plano esa cifra deja de verse en el mapa.
 */
export const coloresPorEstadoDePlatabanda: Record<string, string> = {
  'En uso': '#2E6B3F',
  Abandonado: '#B0581A',
  Eliminado: '#6B6257',
};

/** El color con que se dibuja un elemento, segun su capa y su taxonomia. */
export function colorDelElemento(
  capa: IdCapaDelCatastro,
  estadoDePlatabanda?: string,
): string {
  if (capa === 'platabandas' && estadoDePlatabanda !== undefined) {
    return coloresPorEstadoDePlatabanda[estadoDePlatabanda] ?? capasDelCatastro[capa].color;
  }
  return capasDelCatastro[capa].color;
}

/** Si el identificador corresponde a una capa del catastro que se dibuja. */
export function esCapaDelCatastro(id: string): id is IdCapaDelCatastro {
  return (idsDeCapaDelCatastro as readonly string[]).includes(id);
}
```


### 18.3 Estado

#### `src/estado/sesion.tsx`

Quien esta usando la aplicacion, en cinco situaciones distintas, y el atajo para las pantallas que muestran su nombre. (137 líneas)

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { hayBackend, haySesion } from '@/datos/cliente';
import { personas } from '@/datos/personas';
import {
  alCambiarLaSesion,
  cerrarSesion as cerrarSesionEnLinea,
  confirmarCodigo as confirmarCodigoEnLinea,
  crearPerfil as crearPerfilEnLinea,
  pedirCodigo as pedirCodigoEnLinea,
  perfilActual,
} from '@/datos/sesion';
import type { Persona } from '@/dominio/tipos';

/**
 * Quien esta usando la aplicacion.
 *
 * Son cuatro situaciones y no dos, porque entrar y tener perfil son cosas
 * distintas. La cuenta nace cuando el codigo del correo se canjea; el
 * seudonimo con que el barrio reconoce a esa persona se elige despues.
 */
export type EstadoDeSesion =
  /** Todavia se esta averiguando si hay sesion guardada. */
  | 'cargando'
  /** Hay backend y nadie ha entrado. */
  | 'sinCuenta'
  /** Entro con el codigo pero aun no elige seudonimo. */
  | 'sinPerfil'
  /** Entro y tiene perfil. */
  | 'dentro'
  /** No hay credenciales configuradas: el prototipo corre con datos de ejemplo. */
  | 'sinBackend';

type ContextoSesion = {
  estado: EstadoDeSesion;
  /** Quien publica, comenta y confirma. Nunca es nula si se puede usar la app. */
  persona: Persona | null;
  pedirCodigo: (correo: string) => Promise<void>;
  /** Devuelve en que queda la sesion: de eso depende si hay que crear perfil. */
  confirmarCodigo: (correo: string, codigo: string) => Promise<EstadoDeSesion>;
  crearPerfil: (seudonimo: string, vinculo: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
};

const Contexto = createContext<ContextoSesion | null>(null);

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoDeSesion>(hayBackend ? 'cargando' : 'sinBackend');
  const [persona, setPersona] = useState<Persona | null>(
    // Sin backend el prototipo sigue siendo navegable, que es como se muestra
    // en reuniones y como se prueba con vecinos.
    hayBackend ? null : personas.rosa,
  );

  const revisar = useCallback(async (): Promise<EstadoDeSesion> => {
    if (!hayBackend) return 'sinBackend';
    const perfil = await perfilActual();
    if (perfil !== null) {
      setPersona(perfil);
      setEstado('dentro');
      return 'dentro';
    }
    setPersona(null);
    // perfilActual devuelve nulo tanto si no hay sesion como si la hay y aun
    // no se elige seudonimo, asi que hay que distinguirlas aqui.
    const siguiente: EstadoDeSesion = (await haySesion()) ? 'sinPerfil' : 'sinCuenta';
    setEstado(siguiente);
    return siguiente;
  }, []);

  useEffect(() => {
    if (!hayBackend) return;
    void revisar();
    return alCambiarLaSesion(() => void revisar());
  }, [revisar]);

  const pedirCodigo = useCallback(async (correo: string) => {
    await pedirCodigoEnLinea(correo);
  }, []);

  // Devuelve el estado en vez de dejar que la pantalla lo lea del contexto,
  // donde todavia figura el de antes de entrar hasta el siguiente dibujo.
  const confirmarCodigo = useCallback(
    async (correo: string, codigo: string) => {
      await confirmarCodigoEnLinea(correo, codigo);
      return revisar();
    },
    [revisar],
  );

  const crearPerfil = useCallback(async (seudonimo: string, vinculo: string) => {
    const nueva = await crearPerfilEnLinea(seudonimo, vinculo);
    setPersona(nueva);
    setEstado('dentro');
  }, []);

  const cerrarSesion = useCallback(async () => {
    await cerrarSesionEnLinea();
    setPersona(null);
    setEstado('sinCuenta');
  }, []);

  const valor = useMemo<ContextoSesion>(
    () => ({ estado, persona, pedirCodigo, confirmarCodigo, crearPerfil, cerrarSesion }),
    [estado, persona, pedirCodigo, confirmarCodigo, crearPerfil, cerrarSesion],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

/**
 * Quien entro, para las pantallas que muestran su nombre o su avatar.
 *
 * El respaldo al vecino de ejemplo es el mismo que usa el proveedor cuando no
 * hay credenciales: asi el prototipo sigue siendo navegable para mostrarlo en
 * reuniones. Con backend configurado, estas pantallas van detras del ingreso y
 * la persona nunca es nula.
 */
export function usarQuienEntro(): Persona {
  return usarSesion().persona ?? personas.rosa;
}

export function usarSesion(): ContextoSesion {
  const contexto = useContext(Contexto);
  if (contexto === null) {
    throw new Error('usarSesion necesita estar dentro de ProveedorSesion');
  }
  return contexto;
}
```

#### `src/estado/catastro.tsx`

Los elementos del catastro que corresponden al area visible del mapa. (86 líneas)

```tsx
import { useCallback, useEffect, useMemo, useState } from 'react';

import { elementosEnRecuadro } from '@/datos/catastroEnLinea';
import { hayBackend, haySesion } from '@/datos/cliente';
import type { IdCapaDelCatastro } from '@/dominio/capas';
import { ZOOM_DEL_BARRIO } from '@/dominio/barrio';
import type { ElementoEnElMapa, RecuadroDelMapa } from '@/dominio/tipos';

/**
 * Los elementos del catastro que caben en lo que el mapa tiene a la vista.
 *
 * No es un contexto sino un enganche, porque lo que se pide depende del
 * encuadre de una pantalla y no del estado compartido de la aplicacion.
 */

type AreaMirada = {
  recuadro: RecuadroDelMapa;
  zoom: number;
};

export type ElementosDelCatastro = {
  elementos: ElementoEnElMapa[];
  /** Zoom vigente, que la pantalla necesita para agrupar las chinchetas. */
  zoom: number;
  /** Se le pasa al mapa para que avise cuando cambia el encuadre. */
  alCambiarElArea: (recuadro: RecuadroDelMapa, zoom: number) => void;
  error: string | null;
};

export function usarElementosDelCatastro(
  capasEncendidas: IdCapaDelCatastro[],
): ElementosDelCatastro {
  const [area, setArea] = useState<AreaMirada | null>(null);
  const [elementos, setElementos] = useState<ElementoEnElMapa[]>([]);
  const [error, setError] = useState<string | null>(null);

  const alCambiarElArea = useCallback((recuadro: RecuadroDelMapa, zoom: number) => {
    setArea({ recuadro, zoom });
  }, []);

  // Un arreglo nuevo en cada render volveria a disparar el efecto sin parar,
  // asi que lo que entra en las dependencias es el contenido y no el arreglo.
  const clave = useMemo(() => [...capasEncendidas].sort().join(','), [capasEncendidas]);

  useEffect(() => {
    if (!hayBackend || area === null || clave === '') {
      setElementos([]);
      return;
    }

    let vigente = true;
    haySesion()
      .then(async (abierta) => {
        // Las capas del catastro quedan detras de la cuenta, igual que el
        // resto. Sin sesion no se pide nada, en vez de intentar y que la base
        // rechace una peticion por cada movimiento del mapa.
        if (!abierta) return [];
        return await elementosEnRecuadro(
          area.recuadro,
          clave.split(',') as IdCapaDelCatastro[],
        );
      })
      .then((lista) => {
        if (vigente) setElementos(lista);
      })
      .catch((falla: unknown) => {
        if (!vigente) return;
        setError(
          falla instanceof Error ? falla.message : 'No se pudieron cargar las capas',
        );
      });

    // Si el mapa se mueve antes de que llegue la respuesta, esa respuesta ya
    // no corresponde a lo que se esta viendo y se descarta.
    return () => {
      vigente = false;
    };
  }, [area, clave]);

  return {
    elementos,
    zoom: area?.zoom ?? ZOOM_DEL_BARRIO,
    alCambiarElArea,
    error,
  };
}
```


### 18.4 Utiles

#### `src/utiles/geografia.ts`

Proyeccion de Mercator, direcciones de tesela, metros por pixel y distancias. (84 líneas)

```ts
import type { PuntoEnMapa } from '@/dominio/tipos';

/**
 * Proyeccion Web Mercator, la que usan las teselas de OpenStreetMap.
 *
 * Esta aqui y no dentro del componente del mapa porque tambien la necesitan la
 * pantalla de ubicacion, para saber donde quedo el punto, y mas adelante las
 * consultas por cercania, para estimar el radio en metros antes de preguntarle
 * a la base.
 */

/** Las teselas de OpenStreetMap miden 256 pixeles de lado. */
export const LADO_DE_TESELA = 256;

/** Radio de la Tierra en metros, el valor que asume Web Mercator. */
const RADIO_TERRESTRE = 6378137;

export type PuntoEnPixeles = {
  x: number;
  y: number;
};

/** Cuantos pixeles de lado tiene el mundo entero en un nivel de zoom. */
function ladoDelMundo(zoom: number): number {
  return LADO_DE_TESELA * 2 ** zoom;
}

/** Pasa una coordenada geografica a pixeles absolutos del mundo. */
export function aPixeles(punto: PuntoEnMapa, zoom: number): PuntoEnPixeles {
  const lado = ladoDelMundo(zoom);
  const seno = Math.sin((punto.latitud * Math.PI) / 180);
  return {
    x: ((punto.longitud + 180) / 360) * lado,
    y: (0.5 - Math.log((1 + seno) / (1 - seno)) / (4 * Math.PI)) * lado,
  };
}

/** El camino de vuelta: de pixeles absolutos a coordenada geografica. */
export function aCoordenada(pixeles: PuntoEnPixeles, zoom: number): PuntoEnMapa {
  const lado = ladoDelMundo(zoom);
  const n = Math.PI - (2 * Math.PI * pixeles.y) / lado;
  return {
    latitud: (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
    longitud: (pixeles.x / lado) * 360 - 180,
  };
}

/**
 * Direccion de una tesela en el servidor de OpenStreetMap.
 *
 * La politica de uso del servidor publico permite trafico liviano como el de
 * un prototipo, y exige mostrar la atribucion, que el mapa dibuja en la
 * esquina. Si la aplicacion llega a produccion hay que cambiar esto por un
 * proveedor propio o contratado.
 */
export function direccionDeTesela(columna: number, fila: number, zoom: number): string {
  return `https://tile.openstreetmap.org/${zoom}/${columna}/${fila}.png`;
}

/**
 * Metros por pixel en un nivel de zoom, corregidos por la latitud.
 *
 * Mercator estira las distancias a medida que uno se aleja del ecuador, asi
 * que sin esta correccion un radio de cien metros en Santiago se dibujaria
 * veinte por ciento mas grande de lo que es.
 */
export function metrosPorPixel(latitud: number, zoom: number): number {
  return (
    (2 * Math.PI * RADIO_TERRESTRE * Math.cos((latitud * Math.PI) / 180)) / ladoDelMundo(zoom)
  );
}

/** Distancia en metros entre dos puntos, por la formula del semiverseno. */
export function distanciaEnMetros(uno: PuntoEnMapa, otro: PuntoEnMapa): number {
  const aRadianes = (grados: number): number => (grados * Math.PI) / 180;
  const diferenciaLatitud = aRadianes(otro.latitud - uno.latitud);
  const diferenciaLongitud = aRadianes(otro.longitud - uno.longitud);
  const a =
    Math.sin(diferenciaLatitud / 2) ** 2 +
    Math.cos(aRadianes(uno.latitud)) *
      Math.cos(aRadianes(otro.latitud)) *
      Math.sin(diferenciaLongitud / 2) ** 2;
  return 2 * RADIO_TERRESTRE * Math.asin(Math.sqrt(a));
}
```

#### `src/utiles/fechas.ts`

Fechas legibles, antiguedad corta e inicial de un seudonimo. (68 líneas)

```ts
/**
 * Como se escriben las fechas de cara a la persona.
 *
 * La base guarda fechas reales porque el mecanismo de priorizacion necesita
 * restarlas. Lo que los mockups muestran, "recien" o "hace 2 h", es una forma
 * de escribirlas y se calcula aqui, al mostrar. Guardar el texto seria
 * guardar algo que envejece solo.
 */

const MESES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const UN_MINUTO = 60 * 1000;
const UNA_HORA = 60 * UN_MINUTO;
const UN_DIA = 24 * UNA_HORA;

/** Dia y mes abreviados, como los rotula la linea de tiempo: "3 nov". */
export function diaYMes(fecha: Date): string {
  return `${fecha.getDate()} ${MESES[fecha.getMonth()] ?? ''}`;
}

/**
 * Antiguedad en el formato largo de las listas. Pasada una semana deja de
 * contar dias y muestra la fecha, que es mas util que "hace 23 d".
 */
export function hace(fecha: Date, ahora: Date = new Date()): string {
  const transcurrido = ahora.getTime() - fecha.getTime();

  if (transcurrido < 2 * UN_MINUTO) return 'recién';
  if (transcurrido < UNA_HORA) return `hace ${Math.floor(transcurrido / UN_MINUTO)} min`;
  if (transcurrido < UN_DIA) return `hace ${Math.floor(transcurrido / UNA_HORA)} h`;
  if (transcurrido < 2 * UN_DIA) return 'ayer';
  if (transcurrido < 7 * UN_DIA) return `hace ${Math.floor(transcurrido / UN_DIA)} días`;
  return diaYMes(fecha);
}

/** Antiguedad apretada, la de los comentarios: "4 d", "2 h". */
export function antiguedadCorta(fecha: Date, ahora: Date = new Date()): string {
  const transcurrido = ahora.getTime() - fecha.getTime();

  if (transcurrido < UNA_HORA) return `${Math.max(1, Math.floor(transcurrido / UN_MINUTO))} min`;
  if (transcurrido < UN_DIA) return `${Math.floor(transcurrido / UNA_HORA)} h`;
  return `${Math.floor(transcurrido / UN_DIA)} d`;
}

/** La inicial del avatar sale del seudonimo, no se guarda en la base. */
export function inicialDe(seudonimo: string): string {
  const limpio = seudonimo.trim();
  if (limpio === '') return '?';
  const palabras = limpio.split(/\s+/);
  // Las organizaciones llevan dos letras, como "RC" para Republica Circular.
  if (palabras.length > 1 && palabras.every((palabra) => palabra.length > 2)) {
    return `${palabras[0]?.[0] ?? ''}${palabras[1]?.[0] ?? ''}`.toUpperCase();
  }
  return (limpio[0] ?? '?').toUpperCase();
}
```

#### `src/utiles/agrupacion.ts`

Agrupa marcadores por celdas de pantalla para que no se pisen. (79 líneas)

```ts
import type { PuntoEnMapa } from '@/dominio/tipos';

import { aPixeles } from './geografia';

/**
 * Agrupa lo que queda demasiado junto en la pantalla.
 *
 * Hace falta porque el catastro trae 500 platabandas en 129 hectareas:
 * dibujadas una por una tapan el mapa y dejan de decir nada. La pantalla de
 * capas del prototipo ya contemplaba esto, con un marcador de grupo que al
 * tocarlo acerca el mapa.
 *
 * La agrupacion se hace en pixeles y no en grados a proposito: lo que molesta
 * es que dos chinchetas se pisen en la pantalla, y cuanto se pisan depende
 * del zoom, no de la distancia real.
 */

export type Grupo<T> = {
  /** Estable mientras no cambie el zoom, sirve de clave de React. */
  clave: string;
  elementos: T[];
  /** Centro del grupo, donde se dibuja la chincheta. */
  posicion: PuntoEnMapa;
};

export function agruparEnPantalla<T>(
  elementos: T[],
  posicionDe: (elemento: T) => PuntoEnMapa,
  zoom: number,
  ladoDeCeldaEnPixeles: number,
): Grupo<T>[] {
  const celdas = new Map<string, T[]>();

  for (const elemento of elementos) {
    const pixeles = aPixeles(posicionDe(elemento), zoom);
    const columna = Math.floor(pixeles.x / ladoDeCeldaEnPixeles);
    const fila = Math.floor(pixeles.y / ladoDeCeldaEnPixeles);
    const clave = `${columna},${fila}`;
    const existentes = celdas.get(clave);
    if (existentes === undefined) {
      celdas.set(clave, [elemento]);
    } else {
      existentes.push(elemento);
    }
  }

  const grupos: Grupo<T>[] = [];
  for (const [clave, miembros] of celdas) {
    grupos.push({
      clave: `${zoom}-${clave}`,
      elementos: miembros,
      posicion: promedio(miembros.map(posicionDe)),
    });
  }
  return grupos;
}

/**
 * Centro de un grupo.
 *
 * El promedio simple alcanza porque una celda mide unas pocas decenas de
 * metros, una escala donde la curvatura de la Tierra no cambia el resultado.
 */
function promedio(puntos: PuntoEnMapa[]): PuntoEnMapa {
  const inicial = { latitud: 0, longitud: 0 };
  if (puntos.length === 0) return inicial;

  const suma = puntos.reduce(
    (acumulado, punto) => ({
      latitud: acumulado.latitud + punto.latitud,
      longitud: acumulado.longitud + punto.longitud,
    }),
    inicial,
  );
  return {
    latitud: suma.latitud / puntos.length,
    longitud: suma.longitud / puntos.length,
  };
}
```


### 18.5 Pantalla nueva

#### `app/ingreso/codigo.tsx`

1.5 Codigo de ingreso. Es la contrapartida de no usar contrasenas. (171 líneas)

```tsx
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import {
  Aviso,
  BarraInferior,
  Boton,
  BotonCircular,
  CampoTexto,
  Columna,
  Fila,
  Pantalla,
  Presionable,
  Texto,
} from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { alturaTocable, espacio } from '@/diseno/medidas';
import { usarSesion } from '@/estado/sesion';

/** El código que manda Supabase tiene seis números. */
const LARGO_DEL_CODIGO = 6;

/**
 * 1.5 Código de ingreso.
 *
 * Es la contrapartida de no usar contrasenas. La decision del 19 de octubre
 * separa dos cosas que antes iban juntas: entrar exige cuenta, pero mostrarse
 * es decision de cada persona en cada publicacion.
 *
 * Despues de confirmar el codigo quedan dos caminos. Si la persona ya tenia
 * perfil, entra directo. Si es la primera vez, se crea el perfil con el
 * seudonimo que escribio en el paso anterior, porque crearlo exige una sesion
 * abierta y antes de este paso no la habia.
 */
export default function CodigoDeIngreso() {
  const { correo, seudonimo } = useLocalSearchParams<{
    correo: string;
    seudonimo: string;
  }>();
  const { confirmarCodigo, crearPerfil, pedirCodigo } = usarSesion();

  const [codigo, setCodigo] = useState('');
  const [comprobando, setComprobando] = useState(false);
  const [reenviado, setReenviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completo = codigo.trim().length === LARGO_DEL_CODIGO;

  async function confirmar() {
    setComprobando(true);
    setError(null);
    try {
      const sesion = await confirmarCodigo(correo, codigo);

      // El seudonimo del paso anterior solo se usa cuando todavia no hay perfil.
      // Crearlo de nuevo chocaria con el que ya existe y dejaria a la persona
      // afuera teniendo la sesion abierta y el codigo ya gastado.
      if (sesion === 'sinPerfil' && seudonimo.length > 0) {
        await crearPerfil(seudonimo, 'Vive en el barrio');
      }
      router.replace('/inicio');
    } catch (falla: unknown) {
      setError(falla instanceof Error ? falla.message : 'No se pudo confirmar el código');
    } finally {
      setComprobando(false);
    }
  }

  async function reenviar() {
    setError(null);
    try {
      await pedirCodigo(correo);
      setReenviado(true);
    } catch (falla: unknown) {
      setError(falla instanceof Error ? falla.message : 'No se pudo reenviar el código');
    }
  }

  return (
    <Pantalla>
      <Fila style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}>
        <BotonCircular
          icono="flechaIzquierda"
          accesibilidad="Volver"
          onPress={() => router.back()}
        />
      </Fila>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: espacio.seccion }}
        >
          <Columna separacion={espacio.normal} style={{ paddingHorizontal: espacio.bloque }}>
            <Texto tamano={32} familia="titulo" interlineado={1.08}>
              Escribe el código
            </Texto>
            <Texto tamano={17} color={colores.grisTexto} interlineado={1.45}>
              {`Mandamos seis números a ${correo}. Llegan en unos segundos.`}
            </Texto>
          </Columna>

          <Columna
            separacion={espacio.amplio}
            style={{ paddingHorizontal: espacio.seccion, paddingTop: 22 }}
          >
            <CampoTexto
              etiqueta="Código de 6 números"
              valor={codigo}
              onCambiar={(valor) => setCodigo(valor.replace(/\D/g, '').slice(0, LARGO_DEL_CODIGO))}
              marcaDeAgua="000000"
              tipoDeTeclado="numero"
            />

            {reenviado ? (
              <Aviso tono="logro">
                <Texto tamano={15} interlineado={1.4}>
                  Te mandamos un código nuevo.
                </Texto>
              </Aviso>
            ) : null}

            {error === null ? null : (
              <Aviso tono="cuidado">
                <Texto tamano={15} interlineado={1.4}>
                  {error}
                </Texto>
              </Aviso>
            )}

            <Presionable
              onPress={() => void reenviar()}
              accessibilityRole="button"
              accessibilityLabel="Mandar el código de nuevo"
              style={{
                minHeight: alturaTocable.minima,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Texto
                tamano={16}
                color={colores.verde}
                peso="fuerte"
                style={{ textDecorationLine: 'underline' }}
              >
                No me llegó, mándalo de nuevo
              </Texto>
            </Presionable>
          </Columna>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior>
        <Boton
          texto={comprobando ? 'Comprobando...' : 'Entrar al barrio'}
          alto={56}
          tamanoDeTexto={18}
          deshabilitado={!completo || comprobando}
          onPress={() => void confirmar()}
          vibrar
        />
      </BarraInferior>
    </Pantalla>
  );
}
```

## Cierre

Este documento se generó el 13 de octubre de 2026 a partir del estado real del
proyecto en disco. Los capítulos 1 a 16 están escritos a mano. **El capítulo 17
no**: lo produce `herramientas/generar-codigo-fuente.py`, que lee cada archivo y
falla a propósito si alguno del proyecto no está listado, en vez de generar un
documento incompleto.

Si el código cambia, este documento queda desactualizado. Para ponerlo al día:

```
python herramientas/generar-codigo-fuente.py
```

y reemplazar el capítulo 17 por el contenido de `herramientas/capitulo-17.md`.

**Para quien lo reciba sin contexto:** lo mínimo para entender de qué se trata
son los capítulos 1 (de dónde viene el proyecto), 3 (cómo está organizado) y 11
(qué hace cada pantalla). Para reconstruirlo, el capítulo 17 tiene todo.
