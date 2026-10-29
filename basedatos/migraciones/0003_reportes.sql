-- El reporte y todo lo que cuelga de el.
--
-- Tres campos no son una traduccion directa del tipo Reporte del prototipo, y
-- cada uno tiene su razon anotada donde se declara: la posicion, la fecha de
-- publicacion y el anonimato.

create table reportes (
  id uuid primary key default gen_random_uuid(),

  -- El autor siempre existe. Antes un reporte anonimo se representaba sin
  -- autor, y eso dejaba a la plataforma sin forma de impedir que una misma
  -- persona inflara la priorizacion con varias identidades.
  autor uuid not null references personas (id) on delete restrict,

  -- El anonimato es una decision por publicacion y no una configuracion del
  -- perfil. Quien publica asi sigue registrado aqui: lo que cambia es que
  -- nadie mas puede verlo, y de eso se encargan las politicas de fila.
  anonimo boolean not null default false,

  categoria categoria_reporte not null,
  subtipo text,
  titulo text not null check (length(trim(titulo)) > 0),
  direccion text not null,
  estado estado_reporte not null default 'recibido',
  descripcion text,
  como_se_formo text,
  desde_cuando text,

  -- Fecha real y no texto. El mecanismo de priorizacion aplica un decaimiento
  -- exponencial con vida media de 30 dias, que necesita restar fechas. El
  -- formato legible, "hace 4 d", se calcula al mostrar.
  publicado_en timestamptz not null default now(),

  -- Columna geografica y no un par de numeros. La aplicacion pregunta que hay
  -- cerca de una esquina y que cae dentro de una manzana, y eso son consultas
  -- espaciales. Traerse todo a memoria aguanta los dos mil registros del
  -- catastro y se cae apenas los vecinos empiecen a reportar.
  posicion geography (point, 4326) not null,

  tiene_foto boolean not null default false,

  -- La moderacion esconde un reporte en vez de borrarlo, para que quede
  -- rastro de que existio y de quien lo bajo.
  oculto boolean not null default false,
  ocultado_en timestamptz,

  -- Permite la llave foranea compuesta de la tabla de confirmaciones, que es
  -- lo que impide confirmar el reporte propio sin recurrir a un disparador.
  unique (id, autor)
);

-- El resumen que el prototipo muestra bajo el titulo no se guarda. Es una
-- frase derivada de la categoria, la direccion y la antiguedad, y guardarla
-- obligaria a reescribirla cada vez que el reporte cambia de estado.

create index reportes_posicion on reportes using gist (posicion);
create index reportes_categoria on reportes (categoria);
create index reportes_estado on reportes (estado);
create index reportes_publicado_en on reportes (publicado_en desc);
create index reportes_autor on reportes (autor);

comment on column reportes.posicion is
  'Punto en WGS84, el mismo sistema de las capas del catastro 2022.';

-- Confirmaciones ------------------------------------------------------------

-- Tres vecinos distintos confirmando pasan un reporte a verificado. Para
-- contar vecinos distintos hace falta una fila por persona, no un contador:
-- con un numero no hay forma de saber si alguien ya confirmo.
create table confirmaciones_de_reporte (
  reporte uuid not null references reportes (id) on delete cascade,
  persona uuid not null references personas (id) on delete cascade,
  creada_en timestamptz not null default now(),

  -- Copia del autor del reporte, sostenida por la llave foranea compuesta de
  -- mas abajo. Existe para que la regla de no confirmar lo propio sea una
  -- restriccion de la base y no una validacion que alguien pueda saltarse
  -- escribiendo directo en la tabla.
  autor_del_reporte uuid not null,

  primary key (reporte, persona),
  foreign key (reporte, autor_del_reporte) references reportes (id, autor),
  constraint nadie_confirma_lo_propio check (persona <> autor_del_reporte)
);

create index confirmaciones_por_persona on confirmaciones_de_reporte (persona);

-- Senalamientos -------------------------------------------------------------

-- Un vecino puede marcar un reporte como inexistente, lo que dispara revision.
-- Misma forma que las confirmaciones y por la misma razon.
create table senalamientos_de_reporte (
  reporte uuid not null references reportes (id) on delete cascade,
  persona uuid not null references personas (id) on delete cascade,
  creada_en timestamptz not null default now(),
  motivo text,
  primary key (reporte, persona)
);

-- Seguimiento ---------------------------------------------------------------

-- Los pasos que el reporte ya dio y los que le faltan. La pantalla "En que va"
-- muestra los cuatro desde el principio, con los futuros apagados.
create table eventos_de_seguimiento (
  id uuid primary key default gen_random_uuid(),
  reporte uuid not null references reportes (id) on delete cascade,
  estado estado_reporte not null,
  detalle text not null,

  -- Nulo mientras el paso no ocurre. El campo ocurrio del prototipo se deriva
  -- de aqui, no se guarda aparte.
  ocurrio_en timestamptz,

  unique (reporte, estado)
);

create index seguimiento_por_reporte on eventos_de_seguimiento (reporte);

-- Comentarios ---------------------------------------------------------------

create table comentarios (
  id uuid primary key default gen_random_uuid(),
  reporte uuid not null references reportes (id) on delete cascade,
  autor uuid not null references personas (id) on delete restrict,
  postura postura_comentario not null,
  texto text not null check (length(trim(texto)) > 0),

  -- Fecha real, igual que en el reporte. La antiguedad corta, "4 d", se
  -- calcula al mostrar.
  publicado_en timestamptz not null default now(),

  -- Respuesta dentro del hilo. Nulo si cuelga directo del reporte.
  respuesta_a uuid references comentarios (id) on delete cascade,

  -- Nota de quien propuso, cuando incorpora el aporte del comentario.
  incorporado text
);

create index comentarios_por_reporte on comentarios (reporte, publicado_en);

-- Quien marco util un comentario. Una fila por persona, por la misma razon
-- que las confirmaciones: un contador no sabe quien ya voto.
create table utiles_de_comentario (
  comentario uuid not null references comentarios (id) on delete cascade,
  persona uuid not null references personas (id) on delete cascade,
  creada_en timestamptz not null default now(),
  primary key (comentario, persona)
);
