"""Prepara la carga de las capas del catastro 2022 a la base de datos.

No escribe en la base. Lee los GeoJSON del diagnostico, los valida y genera un
archivo SQL que alguien tiene que revisar y aplicar.

La carga requiere autorizacion de Republica Circular para el uso y la
republicacion de los datos, asi que el script exige la marca --autorizacion y
se niega a producir nada sin ella. Ver ANTES-DE-CARGAR.md.
"""

import argparse
import json
import math
import pathlib
import sys

# Las capas prioritarias no se eligieron aqui. Son las ocho que el prototipo
# ya ofrece encender y apagar en la pantalla de capas, que a su vez salen de
# los ocho mapas web del diagnostico. Migrar las 31 traeria capas que el
# propio diagnostico dejo sin atributos, como los 172 semaforos o las 249
# veredas, donde solo sirve la geometria.
CAPAS_PRIORITARIAS = {
    'microbasurales': {
        'archivo': 'Microbasurales__L0',
        'nombre': 'Microbasurales',
        'detalle': '40 puntos',
        'esperados': 40,
        'taxonomia': ('tipo_microbasural', 'Tipo_forma'),
    },
    'platabandas': {
        'archivo': 'Huertas_y_jardines__L0',
        'nombre': 'Platabandas',
        'detalle': '500 franjas',
        'esperados': 500,
        'taxonomia': ('estado_platabanda', 'Stat_Uso'),
        'quien_cuida': 'Resp_Mante',
    },
    'basureros': {
        'archivo': 'Basureros__L0',
        'nombre': 'Basureros',
        'detalle': '218 en la calle',
        'esperados': 218,
    },
    'reciclaje': {
        'archivo': 'Puntos_de_reciclaje__L0',
        'nombre': 'Puntos de reciclaje',
        'detalle': '5 lugares',
        'esperados': 5,
        'direccion': 'Direccion_',
    },
    'areas-verdes': {
        'archivo': 'Espacios_Abiertos__L0',
        'nombre': 'Áreas verdes',
        'detalle': '8 plazas y 2 eriazos',
        'esperados': 10,
        'direccion': 'Direccion_',
    },
    'bancas': {
        'archivo': 'bancas__L0',
        'nombre': 'Bancas',
        'detalle': '93 bancas',
        'esperados': 93,
    },
    'paraderos': {
        'archivo': 'Paraderos_del_transporte_p_blico__L0',
        'nombre': 'Paraderos',
        'detalle': '35 paraderos',
        'esperados': 35,
    },
    'ciclovias': {
        'archivo': 'ciclovias__L0',
        'nombre': 'Ciclovías',
        'detalle': '3 tramos',
        'esperados': 3,
    },
}

# Valores admitidos por los tipos enumerados de la migracion 0001. Un valor
# fuera de estas listas es un registro invalido y no se carga.
TAXONOMIAS_VALIDAS = {
    'estado_platabanda': {'En uso', 'Abandonado', 'Eliminado'},
    'tipo_microbasural': {'Espontaneo', 'Desborde'},
}

# Recuadro del area de estudio, de la capa de delimitacion del propio catastro.
OESTE, ESTE = -70.671086, -70.655836
SUR, NORTE = -33.458024, -33.446147

# Cuanto puede alejarse del recuadro un elemento y seguir siendo del barrio.
#
# El recuadro es la envolvente del poligono de estudio, no la vereda. Medir
# los rechazos mostro un grupo de platabandas, microbasurales y paraderos
# entre 52 y 128 metros al poniente, sobre Av. Espana, que son del barrio y
# que un margen de cincuenta metros dejaba fuera. A 150 metros entran todos
# esos y sigue quedando fuera el unico punto que de verdad esta en otro
# barrio.
METROS_DE_HOLGURA = 150


def coordenadas(geometria):
    """Todos los pares de coordenadas de una geometria, sea cual sea su tipo."""
    pila = [geometria['coordinates']]
    while pila:
        actual = pila.pop()
        if actual and isinstance(actual[0], (int, float)):
            yield actual[0], actual[1]
        else:
            pila.extend(actual)


def metros_hasta_el_barrio(longitud, latitud):
    """Distancia de un punto al recuadro del area de estudio. Cero si esta dentro."""
    grados_este = max(OESTE - longitud, 0, longitud - ESTE)
    grados_norte = max(SUR - latitud, 0, latitud - NORTE)
    horizontal = grados_este * 111320 * math.cos(math.radians(latitud))
    vertical = grados_norte * 110540
    return math.hypot(horizontal, vertical)


def fuera_del_barrio(geometria):
    """Si la figura entera queda lejos del area de estudio.

    Se mide el vertice mas cercano y no el mas lejano a proposito. Una
    ciclovia o una vereda cruzan el limite por definicion, y exigirles que
    esten enteras adentro descartaria figuras correctas. Es la misma regla que
    la restriccion dentro_del_barrio de la migracion 0008, para que el script
    y la base no discrepen.
    """
    return min(
        metros_hasta_el_barrio(longitud, latitud)
        for longitud, latitud in coordenadas(geometria)
    ) > METROS_DE_HOLGURA


def texto(valor):
    """Normaliza un atributo del GeoJSON: los vacios del catastro son espacios."""
    if valor is None:
        return None
    limpio = str(valor).strip()
    return limpio if limpio else None


def escapar(valor):
    if valor is None:
        return 'null'
    return "'" + str(valor).replace("'", "''") + "'"


class Rechazos:
    """Lleva la cuenta de por que se descarta cada registro."""

    def __init__(self):
        self.sin_geometria = 0
        self.fuera_del_area = 0
        self.taxonomia_desconocida = 0
        self.duplicados = 0

    @property
    def total(self):
        return (
            self.sin_geometria
            + self.fuera_del_area
            + self.taxonomia_desconocida
            + self.duplicados
        )

    def __str__(self):
        if self.total == 0:
            return 'sin rechazos'
        partes = []
        if self.sin_geometria:
            partes.append(f'{self.sin_geometria} sin geometria')
        if self.fuera_del_area:
            partes.append(f'{self.fuera_del_area} fuera del area')
        if self.taxonomia_desconocida:
            partes.append(f'{self.taxonomia_desconocida} con taxonomia desconocida')
        if self.duplicados:
            partes.append(f'{self.duplicados} duplicados')
        return ', '.join(partes)


def preparar_capa(clave, definicion, origen):
    """Valida una capa y devuelve sus filas listas y el detalle de lo rechazado."""
    ruta = origen / f"{definicion['archivo']}.geojson"
    with ruta.open(encoding='utf-8') as archivo:
        datos = json.load(archivo)

    crs = datos.get('crs', {}).get('properties', {}).get('name', 'EPSG:4326')
    if crs != 'EPSG:4326':
        raise ValueError(f'{ruta.name} viene en {crs}, se esperaba EPSG:4326')

    columna_taxonomia, atributo_taxonomia = definicion.get('taxonomia', (None, None))
    rechazos = Rechazos()
    vistos = set()
    filas = []

    for rasgo in datos['features']:
        geometria = rasgo.get('geometry')
        if geometria is None or not geometria.get('coordinates'):
            rechazos.sin_geometria += 1
            continue
        if fuera_del_barrio(geometria):
            rechazos.fuera_del_area += 1
            continue

        propiedades = rasgo.get('properties', {})
        fid = propiedades.get('FID', rasgo.get('id'))

        # El criterio de cierre pide que no entren duplicados. El par capa mas
        # fid tambien es unico en la tabla, de modo que la regla se comprueba
        # aqui y la sostiene la base.
        if fid in vistos:
            rechazos.duplicados += 1
            continue
        vistos.add(fid)

        valor_taxonomia = None
        if columna_taxonomia is not None:
            valor_taxonomia = texto(propiedades.get(atributo_taxonomia))
            if valor_taxonomia is not None:
                if valor_taxonomia not in TAXONOMIAS_VALIDAS[columna_taxonomia]:
                    rechazos.taxonomia_desconocida += 1
                    continue

        resto = {
            nombre: texto(valor)
            for nombre, valor in propiedades.items()
            if nombre != 'FID' and texto(valor) is not None
        }

        filas.append(
            {
                'fid': fid,
                'geom': json.dumps(geometria),
                'direccion': texto(propiedades.get(definicion.get('direccion', ''))),
                'quien_cuida': texto(propiedades.get(definicion.get('quien_cuida', ''))),
                'taxonomia': valor_taxonomia,
                'atributos': resto,
            }
        )

    return filas, rechazos, columna_taxonomia


def sentencias(clave, definicion, filas, columna_taxonomia):
    """Una sola sentencia por capa, recorriendo un arreglo JSON.

    Se prefiere esto a novecientos INSERT sueltos porque el archivo resultante
    se revisa de un vistazo y la base lo aplica en una pasada.
    """
    columnas = ['capa', 'fid', 'geometria', 'direccion', 'quien_lo_cuida', 'atributos']
    valores = [
        f"{escapar(clave)}",
        "(e->>'fid')::integer",
        "st_geomfromgeojson(e->>'geom')::geography",
        "e->>'direccion'",
        "e->>'quien_cuida'",
        "(e->'atributos')::jsonb",
    ]
    if columna_taxonomia is not None:
        columnas.append(columna_taxonomia)
        valores.append(f"nullif(e->>'taxonomia','')::{columna_taxonomia}")

    datos = json.dumps(filas, ensure_ascii=False).replace("'", "''")

    return [
        f"-- {definicion['nombre']}: {len(filas)} elementos",
        'insert into capas_del_catastro (id, nombre, detalle, elementos_esperados, cargada_en)',
        f"values ({escapar(clave)}, {escapar(definicion['nombre'])}, "
        f"{escapar(definicion['detalle'])}, {definicion['esperados']}, now())",
        'on conflict (id) do update set cargada_en = now();',
        '',
        f"insert into elementos_del_catastro ({', '.join(columnas)})",
        f"select {', '.join(valores)}",
        f"from jsonb_array_elements('{datos}'::jsonb) as e",
        'on conflict (capa, fid) do nothing;',
        '',
    ]


def main():
    analizador = argparse.ArgumentParser(description=__doc__)
    analizador.add_argument('--origen', required=True, help='carpeta con los GeoJSON')
    analizador.add_argument('--salida', required=True, help='archivo SQL a escribir')
    analizador.add_argument(
        '--autorizacion',
        help='fecha, persona y medio de la autorizacion de Republica Circular',
    )
    argumentos = analizador.parse_args()

    if not argumentos.autorizacion:
        print(
            'La carga del catastro requiere autorizacion de Republica Circular y no\n'
            'se entrego la marca --autorizacion. Lee ANTES-DE-CARGAR.md.',
            file=sys.stderr,
        )
        return 2

    origen = pathlib.Path(argumentos.origen)
    lineas = [
        '-- Carga de las capas prioritarias del catastro socioambiental 2022.',
        f'-- Autorizacion declarada: {argumentos.autorizacion}',
        '-- Generado por basedatos/carga/preparar_catastro.py. Revisar antes de aplicar.',
        '',
    ]

    print(f'{"capa":<16} {"cargados":>9} {"esperados":>10}   rechazos')
    print('-' * 70)

    total_cargados = 0
    total_rechazados = 0
    for clave, definicion in CAPAS_PRIORITARIAS.items():
        filas, rechazos, columna = preparar_capa(clave, definicion, origen)
        lineas.extend(sentencias(clave, definicion, filas, columna))
        total_cargados += len(filas)
        total_rechazados += rechazos.total
        aviso = '' if len(filas) == definicion['esperados'] else '  <- no calza'
        print(
            f'{clave:<16} {len(filas):>9} {definicion["esperados"]:>10}   '
            f'{rechazos}{aviso}'
        )

    print('-' * 70)
    print(f'{"total":<16} {total_cargados:>9} {sum(d["esperados"] for d in CAPAS_PRIORITARIAS.values()):>10}'
          f'   {total_rechazados} rechazados')

    pathlib.Path(argumentos.salida).write_text('\n'.join(lineas), encoding='utf-8')
    print(f'\nSQL escrito en {argumentos.salida}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
