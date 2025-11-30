import pandas as pd

# === CARGA DE TABLAS (una sola vez) ===

df_topoforma = pd.read_csv("data/mun_sist_topoformas.csv")
#df_radiacion = pd.read_parquet("data/radiacion.parquet")
df_municipios = pd.read_parquet("data/tabla_municipios.parquet")
df_edafologia=pd.read_csv("data/mun_edafologia.csv")
df_precip_media=pd.read_csv("data/mun_precip_media_anual.csv")
df_temp_media=pd.read_csv("data/mun_temp_media_anual.csv")
df_sequia=pd.read_csv("data/sequia_long.csv")
df_aez=pd.read_csv("data/aez_cultivos_municipios_final.csv")
df_catalogo_cultivos=pd.read_csv("data/catalogo_cultivos.csv")
df_cierre_agricola=pd.read_csv("data/final_cierreAgricola.csv")


# DICCIONARIO PARA ACCESO GLOBAL
tablas = {
    "tabla_edafologia": df_edafologia,
    "tabla_topoforma": df_topoforma,
    "tabla_municipios": df_municipios,
    "tabla_precip_media": df_precip_media,
    "tabla_temp_media": df_temp_media,
    "tabla_sequia": df_sequia,
    "tabla_aez": df_aez
}



def get_campos(tabla, columnas, cvegeo):
    """
    Regresa un diccionario con varias columnas pedidas de la tabla especificada.
    """
    df = tablas[tabla]
    fila = df[df["CVEGEO"] == cvegeo]

    if fila.empty:
        return {col: None for col in columnas}

    fila = fila.iloc[0]

    return {col: fila[col] for col in columnas}

def leer_caracteristicas_municipio(cvegeo):
    return {
        **{f"ed_{k}": v for k, v in get_campos(
            "tabla_edafologia",
            ["CLAVE_WRB","GRUPO1","GRUPO2","GRUPO3","CLASE_TEXT","FRUDICA"],
            cvegeo).items()
        },

        **{f"topo_{k}": v for k, v in get_campos(
            "tabla_topoforma",
            ["CLAVE","NOMBRE","DESCRIPCION"],
            cvegeo).items()
        },

        **{f"temp_{k}": v for k, v in get_campos(
            "tabla_temp_media",
            ["RANGOS"],
            cvegeo).items()
        },

        **{f"prec_{k}": v for k, v in get_campos(
            "tabla_precip_media",
            ["CLAVE"],
            cvegeo).items()
        },
    }

