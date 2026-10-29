-- El catastro 2022 se puede mirar sin cuenta.
--
-- La decision del 19 de octubre dice que crear cuenta es obligatoria para
-- entrar. Esa decision es sobre participar: publicar, confirmar, comentar y
-- ver a los vecinos. La minuta del 14 de octubre acordo algo distinto y
-- compatible, que los contenidos publicos se puedan ver y compartir por
-- enlace sin exigir que el receptor tenga la aplicacion.
--
-- Las capas del diagnostico caen de ese lado. Son datos ya publicados por la
-- organizacion en su propio visor, no tienen personas identificables y son
-- justamente lo que le muestra a alguien de afuera por que vale la pena
-- entrar. Lo que sigue exigiendo cuenta es todo lo demas: reportes, personas,
-- comentarios, confirmaciones y las revisiones que los vecinos hacen sobre
-- estos mismos elementos.
--
-- La capa de patrimonio queda fuera de esto y de la plataforma entera: su
-- formulario recoge nombre del dueno y del arrendatario junto a la direccion.

grant select on capas_del_catastro to anon;
grant select on elementos_del_catastro to anon;
grant select on elementos_en_el_mapa to anon;

grant execute on function elementos_en_recuadro
  (double precision, double precision, double precision, double precision, text[])
  to anon;

create policy ver_capas_sin_cuenta on capas_del_catastro
  for select to anon
  using (true);

create policy ver_elementos_sin_cuenta on elementos_del_catastro
  for select to anon
  using (true);

-- Las revisiones no se abren. Son aportes de vecinos identificados, y quien
-- quiera leerlos o escribirlos necesita cuenta.
