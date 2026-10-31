"""Prepara la carga de las capas del catastro 2022 a la base de datos.

No escribe en la base. Lee los GeoJSON del diagnostico y genera un archivo SQL
que alguien tiene que revisar y aplicar a mano.

La carga requiere autorizacion escrita de Republica Circular y a la fecha no
existe. Por eso el script exige la marca --autorizacion y se niega a producir
nada sin ella. Ver ANTES-DE-CARGAR.md.
"""

import argparse
import json
import pathlib
import sys

# Las capas que usan una de las dos taxonomias propias del catastro. El resto
# guarda sus atributos en la columna jsonb sin aplanar.
TAXONOMIAS = {
    "Huertas_y_jardines__L0": ("estado_platabanda", "Stat_Uso"),
    "Microbasurales__L0": ("tipo_microbasural", "Tipo_forma"),
}


def primer_punto(geometria):
    """Devuelve el primer par de coordenadas, sea cual sea el tipo."""
    tipo = geometria["type"]
    coordenadas = geometria["coordinates"]
    while isinstance(coordenadas[0], list):
        coordenadas = coordenadas[0]
    if tipo not in ("Point", "MultiPoint", "LineString", "MultiLineString",
                    "Polygon", "MultiPolygon"):
        raise ValueError(f"geometria no soportada: {tipo}")
    return coordenadas[0], coordenadas[1]


def escapar(valor):
    if valor is None:
        return "null"
    texto = str(valor).strip()
    if texto == "":
        return "null"
    return "'" + texto.replace("'", "''") + "'"


def sentencias_de_capa(ruta):
    with ruta.open(encoding="utf-8") as archivo:
        datos = json.load(archivo)

    crs = datos.get("crs", {}).get("properties", {}).get("name", "")
    if crs and crs != "EPSG:4326":
        raise ValueError(f"{ruta.name} viene en {crs}, se esperaba EPSG:4326")

    capa = ruta.stem
    columna, atributo = TAXONOMIAS.get(capa, (None, None))
    rasgos = datos["features"]

    lineas = [
        f"-- {capa}: {len(rasgos)} elementos",
        "insert into capas_del_catastro (id, nombre, detalle, elementos_esperados)",
        f"values ({escapar(capa)}, {escapar(capa.replace('_', ' ').strip())}, "
        f"'Capa del catastro socioambiental 2022', {len(rasgos)})",
        "on conflict (id) do nothing;",
        "",
    ]

    for rasgo in rasgos:
        geometria = rasgo.get("geometry")
        if geometria is None:
            continue
        longitud, latitud = primer_punto(geometria)
        propiedades = rasgo.get("properties", {})
        fid = propiedades.get("FID", rasgo.get("id"))

        taxonomia = "null"
        if columna is not None:
            taxonomia = escapar(propiedades.get(atributo))

        resto = {
            clave: valor
            for clave, valor in propiedades.items()
            if clave != "FID" and str(valor).strip() != ""
        }

        columnas = "capa, fid, posicion, atributos"
        valores = (
            f"{escapar(capa)}, {fid}, "
            f"st_setsrid(st_makepoint({longitud}, {latitud}), 4326)::geography, "
            f"{escapar(json.dumps(resto, ensure_ascii=False))}::jsonb"
        )
        if columna is not None:
            columnas += f", {columna}"
            valores += f", {taxonomia}"

        lineas.append(
            f"insert into elementos_del_catastro ({columnas}) values ({valores}) "
            "on conflict (capa, fid) do nothing;"
        )

    lineas.append("")
    return lineas, len(rasgos)


def main():
    analizador = argparse.ArgumentParser(description=__doc__)
    analizador.add_argument("--origen", required=True, help="carpeta con los GeoJSON")
    analizador.add_argument("--salida", required=True, help="archivo SQL a escribir")
    analizador.add_argument(
        "--autorizacion",
        help="fecha y origen de la autorizacion escrita de Republica Circular",
    )
    argumentos = analizador.parse_args()

    if not argumentos.autorizacion:
        print(
            "La carga del catastro requiere autorizacion escrita de Republica "
            "Circular y no se entrego la marca --autorizacion.\n"
            "Lee ANTES-DE-CARGAR.md antes de insistir.",
            file=sys.stderr,
        )
        return 2

    origen = pathlib.Path(argumentos.origen)
    archivos = sorted(origen.glob("*.geojson"))
    if not archivos:
        print(f"no hay GeoJSON en {origen}", file=sys.stderr)
        return 1

    lineas = [
        "-- Carga de las capas del catastro socioambiental 2022.",
        f"-- Autorizacion declarada: {argumentos.autorizacion}",
        "-- Generado por basedatos/carga/preparar_catastro.py. Revisar antes de aplicar.",
        "",
        "begin;",
        "",
    ]
    total = 0
    for archivo in archivos:
        try:
            sentencias, cuantos = sentencias_de_capa(archivo)
        except ValueError as error:
            print(f"se omite {archivo.name}: {error}", file=sys.stderr)
            continue
        lineas.extend(sentencias)
        total += cuantos

    lineas.extend(["commit;", ""])
    pathlib.Path(argumentos.salida).write_text("\n".join(lineas), encoding="utf-8")
    print(f"{len(archivos)} capas, {total} elementos escritos en {argumentos.salida}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
