-- Quien puede ejecutar las funciones de esta base.
--
-- La migracion 0004 dejo escrito que el rol anonimo no recibe nada, y para las
-- tablas es cierto. Para las funciones no lo era. Postgres concede la
-- ejecucion a PUBLIC sobre cada funcion recien creada, y otorgarla despues a
-- authenticated no le quita nada a anon: los grant que ya existian declaraban
-- una intencion que la base nunca llego a aplicar.
--
-- Comprobado llamando a la API con la clave publicable y sin sesion abierta.
-- La mayoria no entregaba nada, porque fallaban al leer una tabla que anon
-- tampoco puede leer, pero dos si:
--
--   reportes_cerca    devolvia los reportes completos, con el identificador de
--                     quien publico los que no son anonimos. Eso es
--                     exactamente lo que la decision de cuenta obligatoria del
--                     19 de octubre queria impedir.
--   registrar_migracion  escribia una fila. Es security definer, asi que corria
--                     como dueña y cualquiera con la clave podia ensuciar el
--                     registro de migraciones.
--
-- Las que fallaban por el permiso de la tabla no estaban bien, estaban
-- afortunadas: las defendia la segunda linea porque la primera no existia.

revoke execute on function
  es_gestor (),
  reporte_visible (uuid),
  reporte_es_mio (uuid),
  crear_reporte (categoria_reporte, text, text, double precision, double precision,
                 boolean, text, text, text, text, boolean),
  confirmar_reporte (uuid),
  senalar_reporte (uuid, text),
  reportes_cerca (double precision, double precision, double precision),
  peso_por_antiguedad (timestamptz),
  elementos_en_recuadro (double precision, double precision, double precision,
                         double precision, text[]),
  registrar_migracion (text)
from public;

-- es_gestor es la unica que no tenia grant propio, porque hasta ahora le
-- bastaba el de PUBLIC. Las politicas de fila la evaluan con el rol de quien
-- consulta, de modo que sin esta linea las politicas se quedarian sin poder
-- leerla y la aplicacion dejaria de mostrar los reportes.
grant execute on function es_gestor () to authenticated;

-- registrar_migracion se queda sin ningun grant. Las migraciones se aplican
-- desde el editor SQL, que corre como dueña, y la dueña conserva la ejecucion
-- aunque se revoque a PUBLIC.

-- Las tres funciones de disparador quedan como estan. PostgREST no expone lo
-- que devuelve trigger, asi que no son una puerta, y moverles los permisos solo
-- arriesga los disparadores que dependen de ellas.

-- La fila que dejo la comprobacion. Se escribio a proposito desde fuera, sin
-- sesion, para demostrar que la puerta estaba abierta, y no corresponde a
-- ningun archivo de migraciones/.
delete from migraciones_aplicadas where archivo = 'PRUEBA_NO_APLICAR.sql';

select registrar_migracion('0016_funciones_cerradas.sql');
