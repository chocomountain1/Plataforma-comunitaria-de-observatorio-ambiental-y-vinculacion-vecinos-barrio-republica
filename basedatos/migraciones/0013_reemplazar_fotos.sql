-- Permiso de actualizacion en las fotos, que es lo que exige subir con upsert.
--
-- La aplicacion sube cada foto con upsert para que reintentar no duplique ni
-- falle: la ruta es <reporte>/<orden>.jpg y repetirla debe reemplazar el
-- archivo. PostgREST traduce ese upsert a un insert con on conflict do update,
-- y Postgres exige permiso de actualizacion sobre la tabla aunque la fila no
-- exista todavia y aunque el conflicto nunca ocurra.
--
-- El error que devuelve es "permission denied for table fotos_de_reporte", que
-- parece un problema de politicas y no lo es: las politicas estaban bien y lo
-- que faltaba era el permiso. Un insert simple sobre la misma tabla, con la
-- misma sesion, funcionaba.
--
-- La politica acompana al permiso por la misma razon que en el resto del
-- esquema: el permiso dice si se puede tocar la tabla y la politica dice
-- cuales filas. Reemplazar una foto queda restringido a quien es autora del
-- reporte, igual que insertarla y que borrarla.
grant update on fotos_de_reporte to authenticated;

create policy reemplazar_fotos_de_mi_reporte on fotos_de_reporte
  for update to authenticated
  using (reporte_es_mio (reporte))
  with check (reporte_es_mio (reporte));
