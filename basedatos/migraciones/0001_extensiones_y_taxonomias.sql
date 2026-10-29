-- Extensiones y taxonomias del Barrio Republica.
--
-- Las taxonomias no se inventaron para la base: son las del catastro
-- socioambiental 2022 y las de las historias de usuario, las mismas que ya
-- estan en src/dominio. Se declaran como tipos enumerados y no como tablas de
-- referencia porque son cerradas: agregar una categoria es una decision de
-- producto que pasa por la contraparte, no un dato que alguien carga.

create extension if not exists postgis;

-- Las ocho categorias de reporte, en el orden en que la persona las ve.
create type categoria_reporte as enum (
  'basura',
  'arboles',
  'plagas',
  'ruido',
  'calles',
  'mobiliario',
  'patrimonio',
  'otro'
);

-- Los cuatro estados del ciclo de vida de un reporte.
create type estado_reporte as enum (
  'recibido',
  'verificado',
  'gestion',
  'resuelto'
);

-- Postura de quien comenta. Los valores van en la misma grafia que el tipo de
-- TypeScript a proposito: asi la aplicacion guarda y lee el mismo literal sin
-- una capa de traduccion que se desincronice.
create type postura_comentario as enum (
  'mejora',
  'duda',
  'aFavor',
  'enContra',
  'respuesta'
);

-- Las dos taxonomias que el catastro 2022 trae en sus capas y que conviene
-- conservar al migrarlas. Los valores salen de los atributos Stat_Uso y
-- Tipo_forma de los archivos GeoJSON originales.
create type estado_platabanda as enum (
  'En uso',
  'Abandonado',
  'Eliminado'
);

create type tipo_microbasural as enum (
  'Espontaneo',
  'Desborde'
);
