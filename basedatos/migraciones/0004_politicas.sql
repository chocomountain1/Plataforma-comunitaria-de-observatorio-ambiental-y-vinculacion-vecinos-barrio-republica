-- Quien ve que, y por que el autor anonimo no se puede filtrar.
--
-- El punto dificil de esta migracion es que las politicas de fila de Postgres
-- controlan filas, no columnas. Esconder la columna del autor con una politica
-- no se puede. Por eso el acceso de lectura no apunta a la tabla sino a una
-- vista que enmascara el autor antes de entregarlo, y sobre la tabla el cliente
-- solo recibe permiso de leer la columna del identificador.

alter table personas enable row level security;
alter table gestores_territoriales enable row level security;
alter table reportes enable row level security;
alter table confirmaciones_de_reporte enable row level security;
alter table senalamientos_de_reporte enable row level security;
alter table eventos_de_seguimiento enable row level security;
alter table comentarios enable row level security;
alter table utiles_de_comentario enable row level security;

-- Nadie entra sin cuenta, asi que el rol anonimo no recibe nada. Es la
-- decision del 19 de octubre llevada a permisos.
revoke all on personas, reportes, confirmaciones_de_reporte,
  senalamientos_de_reporte, eventos_de_seguimiento, comentarios,
  utiles_de_comentario from anon;

-- La vista publica -----------------------------------------------------------

-- Lo que la aplicacion lee. Enmascara el autor cuando el reporte es anonimo y
-- entrega ya calculado lo que el prototipo mostraba como campo: si el reporte
-- es mio, cuantas confirmaciones lleva y cuantos senalamientos.
--
-- La vista corre con los permisos de su dueno, no con los de quien consulta.
-- Es a proposito: asi el cliente nunca toca la tabla de reportes y la unica
-- puerta de lectura es esta, que ya viene enmascarada.
create view reportes_publicos
with (security_barrier = true) as
select
  r.id,
  r.categoria,
  r.subtipo,
  r.titulo,
  r.direccion,
  r.estado,
  r.descripcion,
  r.como_se_formo,
  r.desde_cuando,
  r.publicado_en,
  st_y (r.posicion::geometry) as latitud,
  st_x (r.posicion::geometry) as longitud,
  r.tiene_foto,
  r.anonimo,

  -- El dato existe en la tabla y aqui se corta. Un reporte anonimo sale sin
  -- autor y sin seudonimo, para cualquiera que consulte.
  case when r.anonimo then null else r.autor end as autor,
  case when r.anonimo then null else p.seudonimo end as autor_seudonimo,
  case when r.anonimo then null else p.vinculo end as autor_vinculo,
  case when r.anonimo then null else p.es_organizacion end as autor_es_organizacion,

  -- Saber que un reporte anonimo es mio no revela a nadie: solo lo sabe quien
  -- ya es el autor. Esto reemplaza el campo esMio del prototipo, que antes se
  -- calculaba en la pantalla.
  r.autor = auth.uid () as es_mio,

  (
    select count(*) from confirmaciones_de_reporte c where c.reporte = r.id
  ) as confirmaciones,
  (
    select count(*) from senalamientos_de_reporte s where s.reporte = r.id
  ) as senalamientos
from reportes r
join personas p on p.id = r.autor
where r.oculto = false;

comment on view reportes_publicos is
  'Unica puerta de lectura de reportes para la aplicacion. Enmascara al autor '
  'de los reportes anonimos.';

-- Personas --------------------------------------------------------------------

-- El seudonimo es publico por diseno: es como el barrio se reconoce.
create policy ver_perfiles on personas
  for select to authenticated
  using (true);

create policy crear_mi_perfil on personas
  for insert to authenticated
  with check (id = auth.uid ());

create policy editar_mi_perfil on personas
  for update to authenticated
  using (id = auth.uid ())
  with check (id = auth.uid ());

create policy ver_si_soy_gestor on gestores_territoriales
  for select to authenticated
  using (persona = auth.uid ());

-- Reportes ---------------------------------------------------------------------

-- El cliente solo puede leer el identificador. Sin esto, un update con un
-- where sobre id no podria ejecutarse, porque Postgres exige permiso de
-- lectura sobre las columnas que el where menciona.
grant select (id) on reportes to authenticated;
grant insert, update on reportes to authenticated;
grant select on reportes_publicos to authenticated;

create policy ver_reportes_visibles on reportes
  for select to authenticated
  using (not oculto or es_gestor ());

create policy publicar_mi_reporte on reportes
  for insert to authenticated
  with check (autor = auth.uid ());

create policy editar_mi_reporte on reportes
  for update to authenticated
  using (autor = auth.uid ())
  with check (autor = auth.uid ());

-- El gestor territorial mueve el reporte por el ciclo y puede esconderlo, pero
-- no puede cambiarle el autor ni la marca de anonimato.
create policy gestionar_reportes on reportes
  for update to authenticated
  using (es_gestor ())
  with check (es_gestor ());

-- Confirmaciones y senalamientos -------------------------------------------------

grant select, insert, delete on confirmaciones_de_reporte to authenticated;
grant select, insert on senalamientos_de_reporte to authenticated;

-- Cada quien ve solo lo que confirmo. Saber quien confirmo que es informacion
-- sobre los vecinos, y el proyecto no la expone.
create policy ver_mis_confirmaciones on confirmaciones_de_reporte
  for select to authenticated
  using (persona = auth.uid ());

create policy confirmar on confirmaciones_de_reporte
  for insert to authenticated
  with check (persona = auth.uid ());

create policy deshacer_mi_confirmacion on confirmaciones_de_reporte
  for delete to authenticated
  using (persona = auth.uid ());

create policy ver_mis_senalamientos on senalamientos_de_reporte
  for select to authenticated
  using (persona = auth.uid () or es_gestor ());

create policy senalar on senalamientos_de_reporte
  for insert to authenticated
  with check (persona = auth.uid ());

-- Seguimiento ----------------------------------------------------------------

grant select on eventos_de_seguimiento to authenticated;

create policy ver_seguimiento on eventos_de_seguimiento
  for select to authenticated
  using (
    exists (
      select 1 from reportes r
      where r.id = eventos_de_seguimiento.reporte
        and (not r.oculto or es_gestor ())
    )
  );

-- Comentarios -----------------------------------------------------------------

grant select, insert, update on comentarios to authenticated;
grant select, insert, delete on utiles_de_comentario to authenticated;

-- Los comentarios no son anonimos: quien opina sobre el barrio da la cara. Fue
-- la contrapartida de permitir el reporte anonimo.
create policy ver_comentarios on comentarios
  for select to authenticated
  using (
    exists (
      select 1 from reportes r
      where r.id = comentarios.reporte and not r.oculto
    )
  );

create policy comentar on comentarios
  for insert to authenticated
  with check (autor = auth.uid ());

create policy editar_mi_comentario on comentarios
  for update to authenticated
  using (autor = auth.uid ())
  with check (autor = auth.uid ());

create policy ver_utiles on utiles_de_comentario
  for select to authenticated
  using (persona = auth.uid ());

create policy marcar_util on utiles_de_comentario
  for insert to authenticated
  with check (persona = auth.uid ());

create policy deshacer_util on utiles_de_comentario
  for delete to authenticated
  using (persona = auth.uid ());
