-- Fotografias de los reportes.
--
-- El diagnostico 2022 dejo el campo Link_Inter en cuatro capas, pensado para
-- colgarle una foto a cada punto, y quedo vacio en los 784 registros. La
-- brecha que el proyecto puede llenar es justamente esa: la ubicacion ya esta
-- levantada y lo que falta es en que estado esta cada cosa, que es lo que un
-- vecino con un telefono puede mostrar.

-- Si el reporte es de quien pregunta -----------------------------------------

-- Mismo motivo que reporte_visible en 0004: el cliente solo puede leer
-- reportes.id, asi que una politica que mire reportes.autor desde otra tabla
-- choca con el permiso que protege al autor anonimo.
create or replace function reporte_es_mio (p_reporte uuid) returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from reportes r where r.id = p_reporte and r.autor = auth.uid ()
  );
$$;

grant execute on function reporte_es_mio (uuid) to authenticated;

-- La tabla --------------------------------------------------------------------

create table fotos_de_reporte (
  id uuid primary key default gen_random_uuid(),
  reporte uuid not null references reportes (id) on delete cascade,

  -- Ruta dentro del almacenamiento, con la forma <id del reporte>/<orden>.jpg.
  -- Que el identificador del reporte sea la carpeta permite que las politicas
  -- de almacenamiento decidan mirando solo el nombre del archivo.
  ruta text not null unique,

  -- El diseno admite hasta tres fotos por reporte. El limite vive aqui y no en
  -- la pantalla, para que valga tambien si alguien escribe por la API.
  orden smallint not null check (orden between 1 and 3),

  subida_en timestamptz not null default now(),

  unique (reporte, orden)
);

create index fotos_por_reporte on fotos_de_reporte (reporte, orden);

-- tiene_foto es un campo derivado y se mantiene solo, para que ninguna
-- pantalla tenga que acordarse de actualizarlo.
create or replace function al_cambiar_fotos_marcar_reporte () returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cual uuid := coalesce (new.reporte, old.reporte);
begin
  update reportes
  set tiene_foto = exists (select 1 from fotos_de_reporte f where f.reporte = cual)
  where id = cual;
  return coalesce (new, old);
end;
$$;

create trigger marcar_tiene_foto
after insert or delete on fotos_de_reporte
for each row
execute function al_cambiar_fotos_marcar_reporte ();

alter table fotos_de_reporte enable row level security;
grant select, insert, delete on fotos_de_reporte to authenticated;

create policy ver_fotos on fotos_de_reporte
  for select to authenticated
  using (reporte_visible (reporte));

create policy subir_fotos_de_mi_reporte on fotos_de_reporte
  for insert to authenticated
  with check (reporte_es_mio (reporte));

create policy borrar_fotos_de_mi_reporte on fotos_de_reporte
  for delete to authenticated
  using (reporte_es_mio (reporte));

-- El deposito -------------------------------------------------------------------

-- Privado, no publico. La plataforma exige cuenta para entrar desde el 19 de
-- octubre, y una foto de la vereda del vecino no tiene por que quedar legible
-- con solo adivinar una direccion.
--
-- El limite de 1,5 MB por archivo no es un numero al azar. El plan gratuito da
-- 1 GB de almacenamiento, que la bitacora senala como el primer limite que se
-- va a alcanzar. Con tres fotos por reporte comprimidas a unos 600 KB, el GB
-- alcanza para unos 550 reportes. El tope duro evita que una sola foto sin
-- comprimir se coma esa cuenta.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'fotos-de-reportes',
  'fotos-de-reportes',
  false,
  1572864,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Politicas del deposito --------------------------------------------------------

-- La primera carpeta de la ruta es el identificador del reporte. El patron
-- evita que una ruta con otra forma llegue a la conversion a uuid y reviente.
create policy ver_fotos_en_deposito on storage.objects
  for select to authenticated
  using (
    bucket_id = 'fotos-de-reportes'
    and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
    and reporte_visible (((storage.foldername (name))[1])::uuid)
  );

create policy subir_fotos_en_deposito on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'fotos-de-reportes'
    and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
    and reporte_es_mio (((storage.foldername (name))[1])::uuid)
  );

create policy borrar_fotos_en_deposito on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'fotos-de-reportes'
    and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
    and reporte_es_mio (((storage.foldername (name))[1])::uuid)
  );
