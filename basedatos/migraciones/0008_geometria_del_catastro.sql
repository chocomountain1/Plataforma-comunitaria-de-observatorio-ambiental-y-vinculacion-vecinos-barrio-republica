-- El catastro no es solo puntos.
--
-- La migracion 0006 declaro la posicion de cada elemento como punto, que
-- sirve para microbasurales o basureros pero pierde informacion en las otras
-- dos capas que el prototipo ya muestra: Espacios Abiertos son poligonos y
-- Ciclovias son lineas. Guardar solo un punto borraria la superficie de cada
-- plaza y el largo de cada tramo, y la superficie de area verde es uno de los
-- indicadores titulares del diagnostico.
--
-- Las migraciones no se reescriben, asi que el arreglo viene aparte.

alter table elementos_del_catastro
  rename column posicion to geometria;

alter table elementos_del_catastro
  alter column geometria type geography (geometry, 4326);

comment on column elementos_del_catastro.geometria is
  'Geometria original de la capa: punto, linea o poligono, en WGS84.';

-- El indice se rehace porque la columna cambio de tipo.
drop index if exists elementos_posicion;
create index elementos_geometria on elementos_del_catastro using gist (geometria);

-- Lo que el mapa necesita ------------------------------------------------------

-- El mapa dibuja una chincheta por elemento, asi que necesita un punto aunque
-- la geometria sea un poligono. ST_PointOnSurface devuelve un punto que cae
-- dentro de la figura, a diferencia del centroide, que en una plaza con forma
-- de ele puede quedar afuera.
create view elementos_en_el_mapa
with (security_barrier = true) as
select
  e.id,
  e.capa,
  e.fid,
  st_y (st_pointonsurface (e.geometria::geometry)) as latitud,
  st_x (st_pointonsurface (e.geometria::geometry)) as longitud,
  geometrytype (e.geometria::geometry) as tipo_de_geometria,
  -- En metros cuadrados, solo para las capas de superficie. Las demas dan 0.
  st_area (e.geometria) as area_m2,
  -- En metros, util para las ciclovias.
  st_length (e.geometria) as largo_m,
  e.direccion,
  e.estado_platabanda,
  e.tipo_microbasural,
  e.quien_lo_cuida,
  e.anotado_en,
  e.atributos
from elementos_del_catastro e;

comment on view elementos_en_el_mapa is
  'Los elementos del catastro con un punto representativo por figura, para '
  'dibujarlos sobre el mapa sin perder la geometria original.';

grant select on elementos_en_el_mapa to authenticated;

-- Que no entren registros invalidos ---------------------------------------------

-- El criterio de cierre de la migracion pide que no haya registros invalidos.
-- Dos de las tres comprobaciones viven aqui, en la base, y no solo en el
-- script de carga: una restriccion no se puede saltar reejecutando la carga
-- con otro script.
alter table elementos_del_catastro
  add constraint geometria_valida check (st_isvalid (geometria::geometry));

-- El area de estudio del catastro, con 150 metros de holgura.
--
-- El recuadro es la envolvente del poligono de estudio, no la vereda. Al
-- medir los rechazos de la primera carga aparecio un grupo de platabandas,
-- microbasurales y paraderos entre 52 y 128 metros al poniente, sobre Av.
-- Espana, que son del barrio. A 150 metros entran todos y sigue quedando
-- fuera el unico punto que esta de verdad en otro barrio, el microbasural 29,
-- que el propio mapa web del diagnostico oculta con un filtro.
--
-- ST_DWithin mide la distancia de la figura completa, de modo que una
-- ciclovia que cruza el limite pasa: le basta tocar el area.
alter table elementos_del_catastro
  add constraint dentro_del_barrio check (
    st_dwithin (
      geometria,
      st_setsrid (
        st_makeenvelope (-70.671086, -33.458024, -70.655836, -33.446147),
        4326
      )::geography,
      150
    )
  );
