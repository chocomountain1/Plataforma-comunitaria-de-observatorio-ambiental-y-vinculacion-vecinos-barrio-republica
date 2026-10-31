-- Las capas del catastro socioambiental 2022.
--
-- El esquema se crea ahora porque el modelo de datos lo necesita completo. Lo
-- que no se puede hacer todavia es cargar los 2.032 elementos: eso requiere
-- autorizacion escrita de Republica Circular, que a la fecha no existe. Los
-- datos estan publicados con acceso publico y sin licencia declarada, y acceso
-- publico no equivale a licencia abierta.
--
-- Ver basedatos/carga/ANTES-DE-CARGAR.md.

create table capas_del_catastro (
  id text primary key,
  nombre text not null,
  detalle text not null,
  -- Cuantos elementos trae la capa segun el diagnostico original, para poder
  -- comprobar que la carga quedo completa.
  elementos_esperados integer not null,
  cargada_en timestamptz
);

create table elementos_del_catastro (
  id uuid primary key default gen_random_uuid(),
  capa text not null references capas_del_catastro (id) on delete cascade,

  -- Identificador que el elemento traia en el archivo original. Permite volver
  -- a correr la carga sin duplicar.
  fid integer not null,

  posicion geography (point, 4326) not null,
  direccion text,

  -- Las dos taxonomias propias del catastro. Cada elemento usa la que
  -- corresponde a su capa y deja la otra en nulo.
  estado_platabanda estado_platabanda,
  tipo_microbasural tipo_microbasural,

  -- Lo que el diagnostico anoto y que la ficha del mapa muestra tal cual.
  quien_lo_cuida text,
  anotado_en date,

  -- El resto de atributos del archivo original, sin aplanar. Las 31 capas
  -- tienen columnas distintas y crear una tabla por capa seria inmantenible
  -- para una organizacion de tres a diez personas.
  atributos jsonb not null default '{}'::jsonb,

  unique (capa, fid)
);

create index elementos_posicion on elementos_del_catastro using gist (posicion);
create index elementos_por_capa on elementos_del_catastro (capa);

-- Lo que un vecino responde cuando la ficha le pregunta como esta hoy ese
-- elemento. No se escribe encima del dato de 2022: el diagnostico queda como
-- esta y la actualizacion vive aparte, para poder comparar.
create table revisiones_del_catastro (
  id uuid primary key default gen_random_uuid(),
  elemento uuid not null references elementos_del_catastro (id) on delete cascade,
  persona uuid not null references personas (id) on delete restrict,
  estado_observado text not null,
  revisado_en timestamptz not null default now()
);

create index revisiones_por_elemento on revisiones_del_catastro (elemento, revisado_en desc);

alter table capas_del_catastro enable row level security;
alter table elementos_del_catastro enable row level security;
alter table revisiones_del_catastro enable row level security;

grant select on capas_del_catastro, elementos_del_catastro to authenticated;
grant select, insert on revisiones_del_catastro to authenticated;

create policy ver_capas on capas_del_catastro
  for select to authenticated
  using (true);

create policy ver_elementos on elementos_del_catastro
  for select to authenticated
  using (true);

create policy ver_revisiones on revisiones_del_catastro
  for select to authenticated
  using (true);

create policy revisar on revisiones_del_catastro
  for insert to authenticated
  with check (persona = auth.uid ());
