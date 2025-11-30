import pandas as pd
from data.acceso_data import *

nombres_cultivos = df_catalogo_cultivos.set_index("Idcultivo")["Nomcultivo"].to_dict()

def ids_a_nombres(lista_ids):
    return [nombres_cultivos.get(i, f"{i}") for i in lista_ids]

# Función para obtener todos los cultivos de un municipio: esto para comparar cultivos entre muncipios y sacar los similares
def obtener_cultivos(cvegeo_municipio):
    """
    Devuelve lista de Idcultivo presentes en el municipio.
    """
    cvegeo_municipio = str(cvegeo_municipio).zfill(5)

    df = df_cierre_agricola[
        df_cierre_agricola["CVEGEO"].astype(str).str.zfill(5) == cvegeo_municipio
    ]
    if df.empty:
        return []
    ids= df["Idcultivo"].dropna().unique().tolist()
    return ids_a_nombres(ids)


# función para obtener los cultivos similares entre dos municipios
def cultivos_similares(cvegeo_a, cvegeo_b):
    """
    Devuelve los cultivos que ambos municipios comparten.
    """
    cultivos_a = set(obtener_cultivos(cvegeo_a))
    cultivos_b = set(obtener_cultivos(cvegeo_b))

    ids_sim= list(cultivos_a.intersection(cultivos_b))
    return ids_a_nombres(ids_sim)

#función para saber qué cultivos no tiene el municipio base pero sí el otro municipio
def cultivos_que_le_faltan(base, otro):
    """
    Cultivos del municipio 'otro' que no existen en el municipio 'base'.
    """
    cult_base = set(obtener_cultivos(base))
    cult_otro = set(obtener_cultivos(otro))

    return ids_a_nombres(list(cult_otro - cult_base))

#función para saber qué tan apto es el municipio base en los cultivos del otro municipio
def aptitud_municipio_para_cultivos(cvegeo_base, cultivos):
    """
    Regresa un dataframe con el puntaje de aptitud del municipio base
    hacia una lista de cultivos.
    """
    df = df_aez[df_aez["CVEGEO"] == cvegeo_base]

    if df.empty:
        return pd.DataFrame()

    df_filtrado = df[df["CULTIVO"].isin(cultivos)]
    df_filtrado["NombreCultivo"] = df_filtrado["CULTIVO"].map(nombres_cultivos)

    return df_filtrado[["CULTIVO", "NombreCultivo","APTITUD"]]

# función para recomendar los cultivos donde el municioio base salió mejor (los puntajes más altos)
def recomendar_mejores_cultivos(cvegeo_base, top_n=5):
    """
    Recomienda los mejores cultivos para un municipio basados en su aptitud AEZ.
    """
    df = df_aez[df_aez["CVEGEO"] == cvegeo_base]

    if df.empty:
        return pd.DataFrame()

    df_ordenado = df.sort_values(by="APTITUD", ascending=False)
    df["NombreCultivo"] = df["CULTIVO"].map(nombres_cultivos)

    return df_ordenado.head(top_n)[["CULTIVO", "NombreCultivo", "APTITUD"]]

# función que toma el cultivo y busca en el aez a los municipios más aptos para ese cultivo
def municipios_mas_apto_por_cultivo(cultivo, top_n=10):
    """
    Regresa los municipios más aptos para un cultivo usando la tabla AEZ.
    """
    df = df_aez[df_aez["CULTIVO"] == cultivo]

    if df.empty:
        return pd.DataFrame()

    df_orden = df.sort_values(by="APTITUD", ascending=False)

    return df_orden.head(top_n)[["CVEGEO", "APTITUD"]]


def comparar_municipios_cultivo(cvegeo_a, cvegeo_b):
    return {
        "cultivos_comunes": cultivos_similares(cvegeo_a, cvegeo_b),
        "cultivos_faltantes": cultivos_que_le_faltan(cvegeo_a, cvegeo_b),
        "aptitud_base_en_cultivos_del_otro": aptitud_municipio_para_cultivos(
            cvegeo_a,
            cultivos_que_le_faltan(cvegeo_a, cvegeo_b)
        ),
        "recomendaciones_base": recomendar_mejores_cultivos(cvegeo_a)
    }




