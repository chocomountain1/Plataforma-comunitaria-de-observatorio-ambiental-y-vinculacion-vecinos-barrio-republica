-- Las operaciones del reporte, del lado de la base.
--
-- Lo que esta aqui y no en la aplicacion son las reglas que no pueden
-- depender de que el cliente se porte bien: crear el seguimiento, pasar a
-- verificado al tercer vecino y filtrar por cercania con el indice espacial.

-- Seguimiento automatico ------------------------------------------------------

-- Los cuatro pasos se crean junto con el reporte, con los tres ultimos sin
-- fecha, porque la pantalla "En que va" los muestra desde el principio con los
-- futuros apagados. Es security definer porque quien publica no tiene permiso
-- de escribir en la tabla de seguimiento, y no deberia tenerlo: estas filas
-- las pone el sistema, no la persona.
create or replace function al_publicar_crear_seguimiento () returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into eventos_de_seguimiento (reporte, estado, detalle, ocurrio_en)
  values
    (new.id, 'recibido', 'Quedó publicado en el mapa', new.publicado_en),
    (new.id, 'verificado', 'Cuando otros vecinos confirmen que existe', null),
    (new.id, 'gestion', 'Cuando alguien tome acción, aquí verás quién y qué hizo', null),
    (new.id, 'resuelto', 'Con foto del antes y después', null);
  return new;
end;
$$;

create trigger crear_seguimiento
after insert on reportes
for each row
execute function al_publicar_crear_seguimiento ();

-- Verificacion por confirmaciones ------------------------------------------------

-- Tres vecinos distintos bastan para pasar de recibido a verificado. Es
-- security definer porque quien confirma no puede editar el reporte de otro, y
-- esta es la unica excepcion: mueve el estado y nada mas.
create or replace function al_confirmar_revisar_estado () returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cuantas integer;
begin
  select count(*) into cuantas
  from confirmaciones_de_reporte
  where reporte = new.reporte;

  if cuantas >= 3 then
    update reportes
    set estado = 'verificado'
    where id = new.reporte and estado = 'recibido';

    update eventos_de_seguimiento
    set ocurrio_en = now(),
        detalle = 'Lo confirmaron ' || cuantas || ' vecinos'
    where reporte = new.reporte and estado = 'verificado' and ocurrio_en is null;
  end if;

  return new;
end;
$$;

create trigger revisar_estado
after insert on confirmaciones_de_reporte
for each row
execute function al_confirmar_revisar_estado ();

-- Crear ----------------------------------------------------------------------

-- Recibe la posicion como dos numeros porque es lo que la aplicacion tiene a
-- mano, y arma el punto aqui. Corre con los permisos de quien llama, asi que
-- la politica de fila es la que decide si puede publicar.
create or replace function crear_reporte (
  p_categoria categoria_reporte,
  p_titulo text,
  p_direccion text,
  p_latitud double precision,
  p_longitud double precision,
  p_anonimo boolean default false,
  p_subtipo text default null,
  p_descripcion text default null,
  p_como_se_formo text default null,
  p_desde_cuando text default null,
  p_tiene_foto boolean default false
) returns uuid
language plpgsql
as $$
declare
  nuevo uuid;
begin
  insert into reportes (
    autor, anonimo, categoria, subtipo, titulo, direccion,
    descripcion, como_se_formo, desde_cuando, tiene_foto, posicion
  )
  values (
    auth.uid (), p_anonimo, p_categoria, p_subtipo, p_titulo, p_direccion,
    p_descripcion, p_como_se_formo, p_desde_cuando, p_tiene_foto,
    st_setsrid (st_makepoint (p_longitud, p_latitud), 4326)::geography
  )
  returning id into nuevo;

  return nuevo;
end;
$$;

-- Confirmar y senalar -----------------------------------------------------------

-- Devuelve cuantas confirmaciones quedaron. Si la persona ya habia confirmado
-- o es la autora, la restriccion de la tabla corta la operacion: la regla no
-- depende de que esta funcion la recuerde.
--
-- Corre como duena porque necesita leer reportes.autor para copiarlo a la
-- tabla de confirmaciones, y el cliente no puede leer esa columna: es lo que
-- impide que el autor de un reporte anonimo se filtre. No abre un hueco,
-- porque quien confirma lo fija la propia funcion con auth.uid(), y las dos
-- reglas que importan viven en la tabla y no aqui.
create or replace function confirmar_reporte (p_reporte uuid) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  cuantas integer;
begin
  insert into confirmaciones_de_reporte (reporte, persona, autor_del_reporte)
  select p_reporte, auth.uid (), r.autor
  from reportes r
  where r.id = p_reporte;

  select count(*) into cuantas
  from confirmaciones_de_reporte
  where reporte = p_reporte;

  return cuantas;
end;
$$;

create or replace function senalar_reporte (
  p_reporte uuid,
  p_motivo text default null
) returns void
language sql
as $$
  insert into senalamientos_de_reporte (reporte, persona, motivo)
  values (p_reporte, auth.uid (), p_motivo)
  on conflict do nothing;
$$;

-- Consultar -------------------------------------------------------------------

-- Reportes dentro de un radio en metros. Es security definer por una razon
-- concreta: el filtro espacial tiene que correr contra la columna geografica
-- de la tabla para que use el indice GiST, y esa columna el cliente no la
-- puede leer. Lo que devuelve sigue saliendo de la vista, asi que el autor
-- anonimo queda enmascarado igual.
create or replace function reportes_cerca (
  p_latitud double precision,
  p_longitud double precision,
  p_radio_metros double precision default 300
) returns setof reportes_publicos
language sql
stable
security definer
set search_path = public
as $$
  select v.*
  from reportes_publicos v
  where v.id in (
    select r.id
    from reportes r
    where st_dwithin (
      r.posicion,
      st_setsrid (st_makepoint (p_longitud, p_latitud), 4326)::geography,
      p_radio_metros
    )
  )
  order by st_distance (
    st_setsrid (st_makepoint (v.longitud, v.latitud), 4326)::geography,
    st_setsrid (st_makepoint (p_longitud, p_latitud), 4326)::geography
  );
$$;

-- Priorizacion -----------------------------------------------------------------

-- Decaimiento exponencial con vida media de 30 dias. Esta aqui porque es la
-- razon por la que la fecha de publicacion se guarda como fecha y no como el
-- texto que mostraban los mockups: sin restar fechas no hay decaimiento.
create or replace function peso_por_antiguedad (p_publicado_en timestamptz)
returns double precision
language sql
-- Estable y no inmutable: llama a now(), asi que su resultado cambia con el
-- tiempo aunque el argumento sea el mismo. Declararla inmutable dejaria que el
-- planificador cachee un peso viejo.
stable
as $$
  select exp (
    -ln (2) * (extract (epoch from (now() - p_publicado_en)) / 86400) / 30
  );
$$;

comment on function peso_por_antiguedad is
  'Un reporte de hoy pesa 1, uno de 30 dias pesa 0,5 y uno de 60 pesa 0,25. '
  'Los reportes resueltos quedan fuera del calculo, por decision del mecanismo '
  'de priorizacion.';

grant execute on function
  crear_reporte (categoria_reporte, text, text, double precision, double precision,
                 boolean, text, text, text, text, boolean),
  confirmar_reporte (uuid),
  senalar_reporte (uuid, text),
  reportes_cerca (double precision, double precision, double precision),
  peso_por_antiguedad (timestamptz)
to authenticated;
