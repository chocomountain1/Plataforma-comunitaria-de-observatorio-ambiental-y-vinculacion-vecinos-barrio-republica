-- Quien es cada persona frente al resto del barrio.
--
-- Desde el 19 de octubre crear cuenta es obligatorio para entrar, asi que cada
-- perfil cuelga de un usuario de Supabase. Lo que la plataforma guarda es el
-- seudonimo, nunca el nombre real ni el RUT: esa fue la forma de conciliar la
-- objecion de la contraparte al acceso sin cuenta con el hecho de que mucha
-- gente del barrio no quiere exponerse al reportar a su vecino.

create table personas (
  id uuid primary key references auth.users (id) on delete cascade,
  seudonimo text not null unique check (length(trim(seudonimo)) between 2 and 40),
  vinculo text not null default 'Vive en el barrio',
  es_organizacion boolean not null default false,
  creada_en timestamptz not null default now()
);

-- La inicial del avatar no se guarda: se deriva del seudonimo al dibujarlo.
-- Guardarla seria un segundo lugar donde la misma verdad puede quedar vieja.

comment on table personas is
  'Perfil publico. Nunca nombre real ni RUT, solo el seudonimo que el barrio ve.';

-- Quien puede mover un reporte por el ciclo de gestion. Es una tabla y no una
-- marca en personas porque el rol se otorga y se quita, y conviene saber desde
-- cuando. El rol se llama gestor territorial y no activista, por acuerdo con la
-- contraparte del 2 de septiembre.
create table gestores_territoriales (
  persona uuid primary key references personas (id) on delete cascade,
  desde timestamptz not null default now()
);

create or replace function es_gestor() returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from gestores_territoriales where persona = auth.uid()
  );
$$;

comment on function es_gestor is
  'Usada por las politicas de fila. Es security definer para que un vecino pueda '
  'evaluarla sin tener permiso de leer la tabla de gestores.';
