# Mantener el proyecto despierto

El plan gratuito de Supabase pausa un proyecto tras **siete días sin
peticiones**. Un proyecto pausado no responde nada hasta que alguien entra al
panel y lo reactiva a mano, y el aviso llega siempre en el peor momento: al
abrir la aplicación para mostrarla.

Es el mismo patrón que mató dos herramientas anteriores del barrio, a escala
chica. Por eso se resuelve con algo que corre solo y no con un recordatorio.

## Cómo está resuelto

Dos piezas.

**La función `latido()`**, en
[`migraciones/0017_latido.sql`](migraciones/0017_latido.sql). Devuelve la hora
de la base y nada más. Es lo único que el rol anónimo puede ejecutar.

**El flujo de trabajo**
[`.github/workflows/latido-de-supabase.yml`](../.github/workflows/latido-de-supabase.yml),
que la llama una vez al día a las 12:17 UTC y falla si la respuesta no es 200.

Podría parecer que basta con pedir cualquier cosa a la API. No basta por dos
razones. La raíz de PostgREST se contesta desde su caché de esquema, así que
puede responder sin que Postgres se entere, y cualquier tabla exige cuenta, que
es justo lo que no tiene un proceso automático. Preguntar la hora deja una
respuesta que demuestra que la base contestó.

## Los dos secretos

El flujo lee `SUPABASE_URL` y `SUPABASE_CLAVE_PUBLICA` de los secretos del
repositorio. Se agregan una vez, en Settings, Secrets and variables, Actions,
con los mismos valores que están en el `.env.local`. Sin ellos el flujo falla
con un mensaje que lo dice.

La clave publicable no es secreta en el sentido fuerte: viaja dentro de la
aplicación y lo que protege los datos son las políticas de fila. Va como
secreto igual porque este repositorio es público, y dejarla escrita en un
archivo del repositorio la pone a disposición de cualquier rastreador. Que no
sirva para leer datos no quiere decir que convenga regalar el consumo del plan
gratuito.

## Dos límites que conviene conocer de antemano

Las ejecuciones programadas de GitHub **solo salen desde la rama por omisión**.
Mientras esto viva en una rama aparte no se dispara solo, por mucho que el
archivo exista.

GitHub **desactiva los flujos programados tras sesenta días sin commits** en el
repositorio, y avisa por correo al dueño. Si el proyecto queda quieto más de
dos meses, hay que volver a activarlo desde la pestaña Actions.

El horario no es en punto a propósito. El minuto cero de cada hora es el más
congestionado de la cola de GitHub y el que más se atrasa. Una llamada diaria
deja seis días de margen, que es suficiente para absorber una ejecución
atrasada o saltada.

## Probarlo a mano

Desde la pestaña Actions, con «Run workflow». O desde la línea de comandos, con
los valores del `.env.local`:

```
curl -i -X POST "$EXPO_PUBLIC_SUPABASE_URL/rest/v1/rpc/latido" \
  -H "apikey: $EXPO_PUBLIC_SUPABASE_CLAVE_PUBLICA" \
  -H 'Content-Type: application/json' -d '{}'
```

Un 200 con una fecha es lo que se espera. Un 540 significa que el proyecto ya
está pausado y hay que despertarlo desde el panel antes de que el latido sirva
de algo.
