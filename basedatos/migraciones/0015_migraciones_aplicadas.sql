-- Que migraciones estan aplicadas en esta base.
--
-- Hasta ahora la respuesta vivia en un documento, que es suficiente con una
-- sola base y una sola persona aplicandolas a mano. Deja de serlo apenas
-- aparezca un segundo entorno o un segundo par de manos: dos bases pueden
-- diferir en una migracion y nada lo delata hasta que algo falla.
--
-- La tabla la escribe cada migracion al final de si misma. No hay un proceso
-- que la mantenga, de modo que lo unico que hay que recordar es cerrar cada
-- archivo nuevo con la llamada a registrar_migracion.
create table migraciones_aplicadas (
  archivo text primary key,
  aplicada_en timestamptz not null default now()
);

comment on table migraciones_aplicadas is
  'Una fila por archivo de migraciones/ aplicado en esta base. La escribe cada '
  'migracion al final de si misma.';

-- El cliente no la necesita y no recibe ningun permiso. Queda cerrada igual que
-- gestores_territoriales: sin permisos otorgados y con RLS activo, Postgres
-- niega todo lo que no venga de la dueña.
alter table migraciones_aplicadas enable row level security;

create or replace function registrar_migracion(p_archivo text) returns void
language sql
security definer
set search_path = public
as $$
  insert into migraciones_aplicadas (archivo)
  values (p_archivo)
  on conflict (archivo) do update set aplicada_en = now();
$$;

comment on function registrar_migracion is
  'Anota que una migracion quedo aplicada. Volver a correrla actualiza la fecha '
  'en vez de fallar, porque los archivos estan escritos para ser reaplicables.';

-- Las trece anteriores ya estan aplicadas y sus fechas se conocen: las nueve
-- primeras el 29 de octubre, cuando se creo el proyecto y se cargo el catastro,
-- y las cuatro siguientes el 31, al conectar la aplicacion de verdad.
insert into migraciones_aplicadas (archivo, aplicada_en) values
  ('0001_extensiones_y_taxonomias.sql', '2026-10-29'),
  ('0002_personas.sql', '2026-10-29'),
  ('0003_reportes.sql', '2026-10-29'),
  ('0004_politicas.sql', '2026-10-29'),
  ('0005_funciones.sql', '2026-10-29'),
  ('0006_catastro.sql', '2026-10-29'),
  ('0007_almacenamiento.sql', '2026-10-29'),
  ('0008_geometria_del_catastro.sql', '2026-10-29'),
  ('0009_consulta_por_recuadro.sql', '2026-10-29'),
  ('0011_permisos_de_personas.sql', '2026-10-31'),
  ('0012_politica_sin_puerta.sql', '2026-10-31'),
  ('0013_reemplazar_fotos.sql', '2026-10-31'),
  ('0014_conteo_de_capas.sql', '2026-10-31')
on conflict (archivo) do nothing;

-- Falta la 0010 a proposito. Abria la lectura del catastro sin exigir cuenta y
-- se descarto para no relajar la decision de cuenta obligatoria, asi que no
-- existe como archivo ni como fila.

select registrar_migracion('0015_migraciones_aplicadas.sql');
