-- Cuantos elementos tiene de verdad cada capa.
--
-- El selector de capas mostraba elementos_esperados, que es la cifra que el
-- diagnostico 2022 declara para cada capa y que esta en la tabla para poder
-- comprobar que la carga quedo completa. Como numero interno sirve; como
-- numero en pantalla miente apenas las dos cifras no coinciden, que es
-- justamente lo que pasa en microbasurales: el diagnostico declara 40 y hay 39
-- cargados, porque uno quedo a dos kilometros del barrio y se rechazo.
--
-- La vista entrega lo que hay. La comparacion entre lo esperado y lo cargado
-- sigue siendo posible, pero es trabajo de quien revisa la migracion y no algo
-- que la pantalla deba resolver.
create view conteo_de_capas as
select
  c.id as capa,
  count(e.id)::int as elementos
from capas_del_catastro c
left join elementos_del_catastro e on e.capa = c.id
group by c.id;

grant select on conteo_de_capas to authenticated;
