# Ingreso por código al correo

Cómo quedó armado el ingreso a la plataforma, qué se configuró fuera del
repositorio y qué falta antes de que entre alguien del barrio que no sea del
equipo.

## La decisión

El 19 de octubre de 2026 la contraparte definió el mecanismo: crear cuenta es
obligatorio, no hay contraseña y se entra con un código de seis números que
llega al correo.

Las dos mitades responden a problemas distintos. La cuenta obligatoria existe
porque sin ella una misma persona puede crearse varias identidades e inflar la
priorización comunitaria, que es justamente lo que la plataforma promete
ordenar. La ausencia de contraseña responde a lo contrario: la fricción del
registro fue la barrera de abandono que más apareció en terreno, y el Banco del
Tiempo murió en parte por no tener recuperación de contraseñas.

La cuenta no pide nombre real ni RUT. Entrar y mostrarse son cosas separadas:
quien publica elige en cada reporte si aparece con su seudónimo o anónimo.

## Quién manda los correos

Supabase trae un servidor de correo propio, pero con dos límites que no sirven:
manda dos correos por hora para todo el proyecto y no deja editar las
plantillas, así que el correo llegaría en inglés y con un enlace en vez del
código.

Por eso el envío va por Resend, conectado como SMTP propio. Es gratis hasta
3.000 correos al mes y 100 al día, y al activarlo Supabase sube su propio
límite de 2 a 30 correos por hora.

| Campo | Valor |
|---|---|
| Servidor | `smtp.resend.com` |
| Puerto | 465 |
| Usuario | `resend` |
| Contraseña | La API Key de Resend, guardada solo en Supabase |
| Remitente | `onboarding@resend.dev`, nombre visible «Barrio República» |

La API Key no está en este repositorio ni debe estarlo. Vive cifrada en la
configuración de Supabase y, si hace falta rotarla, se crea una nueva en Resend
con permiso de solo envío y se reemplaza ahí.

## Las dos plantillas

Supabase no usa una sola plantilla para esto, y es la trampa que más fácil pasa
desapercibida: cuando el correo nunca ha entrado manda **Confirm sign up**, y
cuando ya tiene cuenta manda **Magic link or OTP**. Si se edita solo una, la
mitad de las personas recibe el código y la otra mitad recibe el enlace en
inglés. Las dos están escritas en español y las dos muestran `{{ .Token }}`.

## El largo del código

Supabase venía con códigos de ocho números. La aplicación pide seis, que es lo
que dice la decisión del 19 de octubre y lo que está escrito en la pantalla de
ingreso, así que se bajó el ajuste a seis en vez de cambiar la aplicación. El
código vence en una hora y solo se puede usar una vez.

## Lo que falta

El remitente `onboarding@resend.dev` es el dominio de prueba de Resend y **solo
puede escribirle a la casilla con que se creó la cuenta**. Sirve para probar el
ciclo completo, no para que entre una vecina.

Para abrirlo al barrio hay que verificar un dominio propio en Resend, lo que
exige tocar los registros DNS de ese dominio. Es una tarea aparte y depende de
qué dominio ponga República Circular a disposición.
