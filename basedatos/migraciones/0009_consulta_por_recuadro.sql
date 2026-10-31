-- Los elementos que caen dentro del recuadro que el mapa tiene a la vista.
--
-- El filtro corre contra la columna geografica para que use el indice GiST.
-- Sin esto habria que traerse los 903 elementos al telefono y descartar en
-- memoria, que es exactamente lo que el modelo de datos queria evitar y la
-- razon por la que se eligio Supabase sobre las otras tres alternativas.
create or replace function elementos_en_recuadro (
  p_sur double precision,
  p_oeste double precision,
  p_norte double precision,
  p_este double precision,
  -- Nulo trae todas las capas. La aplicacion manda solo las encendidas.
  p_capas text[] default null
) returns setof elementos_en_el_mapa
language sql
stable
as $$
  select v.*
  from elementos_en_el_mapa v
  where (p_capas is null or v.capa = any (p_capas))
    and v.id in (
      select e.id
      from elementos_del_catastro e
      where st_intersects (
        e.geometria,
        st_setsrid (st_makeenvelope (p_oeste, p_sur, p_este, p_norte), 4326)::geography
      )
    );
$$;

grant execute on function elementos_en_recuadro
  (double precision, double precision, double precision, double precision, text[])
  to authenticated;

comment on function elementos_en_recuadro is
  'Usa ST_Intersects y no ST_Within para que una ciclovia o un poligono que '
  'cruzan el borde de la pantalla sigan apareciendo.';
