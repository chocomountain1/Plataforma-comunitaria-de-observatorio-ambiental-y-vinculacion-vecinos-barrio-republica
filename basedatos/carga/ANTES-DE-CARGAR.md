# Antes de cargar el catastro

**La autorización de República Circular existe de palabra y todavía no por
escrito.** Esta página dice qué se cargó, con qué respaldo y qué falta.

Los 2.032 elementos del diagnóstico 2022 están publicados con acceso público,
pero sin licencia declarada. Acceso público no equivale a licencia abierta: que
un archivo se pueda descargar no dice nada sobre si se puede redistribuir
dentro de otra plataforma, que es exactamente lo que hace esta carga.

## Qué se cargó

El 29 de octubre de 2026 se migraron las ocho capas prioritarias: 904 elementos
candidatos, de los que entraron 903. El único rechazo es un microbasural que
queda a 1.980 metros del barrio, y el propio mapa web del diagnóstico lo
esconde con un filtro.

Las 23 capas restantes del diagnóstico siguen sin migrar.

## Con qué respaldo

Jorge Ortiz, de la contraparte, autorizó el uso en una reunión de equipo,
señalando que la información es abierta y de uso libre. Esa es la declaración
que quedó anotada en la cabecera del archivo SQL generado:

```
Jorge Ortiz, contraparte, verbal en reunion de equipo; declaro que la
informacion es abierta y de uso libre. Sin registro escrito localizado al
29-10-2026.
```

Se revisaron las cuatro minutas disponibles, del 26 de agosto, 2 de septiembre,
9 de septiembre y 14 de octubre, buscando términos de autorización, licencia,
republicación, catastro y diagnóstico. La autorización no aparece en ninguna.

## Qué falta

1. Pedir a Jorge una confirmación escrita, por correo o mensaje, que diga qué
   capas se pueden incorporar y bajo qué condiciones de atribución.
2. Anotar acá la fecha y adjuntarla a la evidencia de la actividad.

Hasta que eso ocurra, el criterio de cierre de la actividad de migración no
está cumplido al pie de la letra, y así lo declara su evidencia.

## Cómo se corre

El script no toca la base. Lee los GeoJSON y escribe un archivo SQL que alguien
tiene que revisar y aplicar a mano, que es a propósito: una carga de datos de
terceros no debería poder ocurrir por accidente.

```
python preparar_catastro.py \
  --origen "ruta/a/Republica_Circular_ArcGIS/datos_crudos" \
  --salida carga_catastro.sql \
  --autorizacion "quién la otorgó, cuándo y por qué medio"
```

Sin `--autorizacion` el script se niega a escribir nada, y lo que se le pase
queda copiado en la cabecera del SQL. No es una molestia decorativa: es el
único punto del repositorio donde la condición queda convertida en algo que el
código verifica, y en el único lugar donde queda registrado con qué respaldo se
cargó cada vez.

El archivo SQL generado no se versiona. Contiene los datos de la contraparte, y
subirlos a un repositorio es publicarlos, que es justamente lo que la
autorización escrita todavía no cubre.

## Estado

| Dato | Valor |
|---|---|
| Autorización verbal | Jorge Ortiz, en reunión de equipo |
| Autorización escrita | **No existe** |
| Fecha de la carga | 29 de octubre de 2026 |
| Capas migradas | 8 de 31 |
| Elementos migrados | 903 de 904 candidatos |
