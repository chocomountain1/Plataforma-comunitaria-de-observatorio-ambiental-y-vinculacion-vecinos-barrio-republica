# Antes de cargar el catastro

**La carga de las capas del catastro 2022 está bloqueada hasta que exista
autorización escrita de República Circular.**

Los 2.032 elementos del diagnóstico están publicados con acceso público, pero
sin licencia declarada. Acceso público no equivale a licencia abierta: que un
archivo se pueda descargar no dice nada sobre si se puede redistribuir dentro de
otra plataforma, que es exactamente lo que haría esta carga.

El esquema sí está implementado, en
[`../migraciones/0006_catastro.sql`](../migraciones/0006_catastro.sql). Se puede
revisar, discutir y probar con datos inventados. Lo único que falta es el
permiso para poner los datos reales adentro.

## Qué hace falta para desbloquearlo

1. Pedir a República Circular una autorización escrita que diga qué capas se
   pueden incorporar y bajo qué condiciones de atribución.
2. Anotar acá la fecha y quién la otorgó.
3. Recién entonces correr el preparador con la marca de autorización.

## Cómo se corre, cuando se pueda

El script no toca la base. Lee los GeoJSON y escribe un archivo SQL que alguien
tiene que revisar y aplicar a mano, que es a propósito: una carga de datos de
terceros no debería poder ocurrir por accidente.

```
python preparar_catastro.py \
  --origen "ruta/a/Republica_Circular_ArcGIS/datos_crudos" \
  --salida carga_catastro.sql \
  --autorizacion "2026-11-05, otorgada por <nombre>, correo del <fecha>"
```

Sin `--autorizacion` el script se niega a escribir nada. No es una molestia
decorativa: es el único punto del repositorio donde la condición legal queda
convertida en algo que el código verifica.

## Estado

| Dato | Valor |
|---|---|
| Autorización | **No existe** |
| Fecha en que se pidió | Por anotar |
| Capas que cubriría | 31 |
| Elementos | 2.032 |
