-- Una funcion que solo sirve para que alguien pregunte la hora.
--
-- El plan gratuito de Supabase pausa el proyecto tras siete dias sin
-- peticiones, y despertarlo es a mano desde el panel. Entre dos semanas de
-- trabajo eso llega como sorpresa justo cuando alguien quiere mostrar la
-- aplicacion, que es el peor momento posible. El flujo de trabajo
-- .github/workflows/latido-de-supabase.yml la llama una vez al dia.
--
-- Existe como funcion, y no como una consulta cualquiera, por dos razones. La
-- raiz de PostgREST se responde desde su cache de esquema, de modo que puede
-- contestar sin que Postgres se entere, y cualquier tabla exige cuenta, que es
-- justo lo que no tiene un proceso automatico. Preguntar la hora de la base
-- deja una respuesta que demuestra que la base contesto.
create or replace function latido () returns timestamptz
language sql
stable
as $$
  select now ();
$$;

comment on function latido is
  'Devuelve la hora de la base. La llama el flujo de trabajo latido-de-supabase '
  'para que el plan gratuito no pause el proyecto por inactividad.';

-- Lo unico que el rol anonimo puede hacer en toda la base. No recibe
-- argumentos, no lee ninguna tabla y no escribe nada, asi que no hay por donde
-- sacarle mas que la hora. El revoke esta porque Postgres acaba de concedersela
-- a PUBLIC al crearla, igual que a todas las demas.
revoke execute on function latido () from public;
grant execute on function latido () to anon;

select registrar_migracion('0017_latido.sql');
