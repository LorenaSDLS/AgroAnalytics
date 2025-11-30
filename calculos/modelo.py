import Levenshtein
import pandas as pd

# modelo similitud proporcional

def normalizar_cvegeo(valor):
    """
    Convierte un CVEGEO a string de 5 dígitos, rellenando con ceros a la izquierda.
    Ejemplo: 1002 -> "01002"
    """
    try:
        return str(valor).zfill(5)
    except:
        return None


def similitud_proporcional(x1, x2):
    """
    Calcula la similitud proporcional entre dos valores numéricos

    """
    if x1 == 0 and x2 == 0:
        return 1.0  # ambos son cero, similitud máxima
    max_val = max(abs(x1), abs(x2))
    if max_val == 0:
        return 0.0
    diff = abs(x1 - x2)
    similitud = 1 - (diff / max_val)
    return similitud

def es_numerico(valor):
    try:
        float(valor)
        return True
    except:
        return False



def es_rango(valor):
    return isinstance(valor, str) and "-" in valor


def normalizar_precipitacion(valor):
    if isinstance(valor, str):
        v = valor.strip().lower()
        if v in ["no aplica", "na", "n/a"]:
            return "no_aplica"
        if v in ["h2o", "agua", "mojado"]:
            return "h2o"
    return valor

# pasar rango a int y sacar el promedio
def rango_a_promedio(rango):
    """
    Convierte un rango en una tupla de enteros y devuelve su promedio.

    Ejemplo: "3-7" -> (3, 7) -> 5.0
    """
    try:
        partes = rango.split('-')
        if len(partes) != 2:
            raise ValueError("El rango debe tener el formato 'min-max'")
        min_val = int(partes[0].strip())
        max_val = int(partes[1].strip())
        promedio = (min_val + max_val) / 2
        return promedio
    except Exception as e:
        raise ValueError(f"Error al convertir el rango: {e}")
    

# modelo comparador de rangos

def comparador_de_rangos(rango1, rango2):
    """
    Compara dos rangos y devuelve la similitud proporcional entre sus promedios.

    Ejemplo: "3-7" y "4-8" -> promedio1=5.0, promedio2=6.0 -> similitud_proporcional(5.0, 6.0)
    """
    promedio1 = rango_a_promedio(rango1)
    promedio2 = rango_a_promedio(rango2)

    similitud=similitud_proporcional(promedio1, promedio2)


    return similitud

def comparar_edafologia(text1, text2):
    """
    Compara dos textos de edafología utilizando la distancia de Levenshtein.

    Devuelve un valor entre 0 y 1 que indica la similitud entre los textos: 
    1 → los textos son idénticos
    0 → los textos no tienen nada en común
    """
    distancia = Levenshtein.ratio(text1, text2)
    return distancia

def comparar_topoforma(text1, text2):
    """
    Compara dos textos de topoforma utilizando la distancia de Levenshtein.

    Devuelve un valor entre 0 y 1 que indica la similitud entre los textos.
    1 → los textos son idénticos
    0 → los textos no tienen nada en común
    
    """
    distancia = Levenshtein.jaro_winkler(text1, text2)
    return distancia

def precip(v1, v2):
    v1 = normalizar_precipitacion(v1)
    v2 = normalizar_precipitacion(v2)

    # Caso 1: Categorías exactas
    if v1 == "no_aplica" and v2 == "no_aplica":
        return 1.0
    if v1 == "h2o" and v2 == "h2o":
        return 1.0

    # Caso 2: Uno es categoría y otro no → incompatibles
    if (v1 in ["no_aplica", "h2o"]) != (v2 in ["no_aplica", "h2o"]):
        return 0.0

    # Caso 3: Ambos son enteros
    if es_numerico(v1) and es_numerico(v2):
        return similitud_proporcional(float(v1), float(v2))

    # Caso 4: Ambos son rangos
    if es_rango(v1) and es_rango(v2):
        return comparador_de_rangos(v1, v2)

    # Caso 5: Uno rango y otro número → comparar número vs promedio del rango
    if es_rango(v1) and es_numerico(v2):
        return similitud_proporcional(rango_a_promedio(v1), float(v2))

    if es_rango(v2) and es_numerico(v1):
        return similitud_proporcional(float(v1), rango_a_promedio(v2))

    # Todo lo demás → no comparables
    return 0.0


    
def modelo_gral(val1_prec, val2_prec, val1_temp, val2_temp, val1_uni, val2_uni, val1_eda, val2_eda, val1_topo, val2_topo):

    similitud_precip = precip(val1_prec, val2_prec)
    similitud_tempp = precip(val1_temp, val2_temp)  # si también es precip
    similitud_uni_clim = similitud_proporcional(val1_uni, val2_uni)
    similitud_edafologia = comparar_edafologia(val1_eda, val2_eda)
    similitud_topoforma = comparar_topoforma(val1_topo, val2_topo)

    integracion = (
        similitud_precip +
        similitud_tempp +
        similitud_uni_clim +
        similitud_edafologia +
        similitud_topoforma
    ) / 5

    return integracion

def unir_edafologia(fila):
    return " ".join([
        str(fila["CLAVE_WRB"]),
        str(fila["GRUPO1"]),
        str(fila["GRUPO2"]),
        str(fila["GRUPO3"]),
        str(fila["CLASE_TEXT"]),
        str(fila["FRUDICA"]),
    ])


#leer datos 
topoforma = pd.read_csv('data/mun_sist_topoformas.csv')
topoforma["CVEGEO"] = topoforma["CVEGEO"].apply(normalizar_cvegeo)

edafologia = pd.read_csv('data/mun_edafologia.csv')
edafologia["CVEGEO"] = edafologia["CVEGEO"].apply(normalizar_cvegeo)

unidades_clima = pd.read_csv('data/mun_unidades_climaticas_final.csv')
unidades_clima["CVEGEO"] = unidades_clima["CVEGEO"].apply(normalizar_cvegeo)

precipitacion = pd.read_csv('data/mun_precip_media_anual.csv')
precipitacion["CVEGEO"] = precipitacion["CVEGEO"].apply(normalizar_cvegeo)

temperatura = pd.read_csv('data/mun_temp_media_anual.csv')
temperatura["CVEGEO"] = temperatura["CVEGEO"].apply(normalizar_cvegeo)

municipios = pd.read_parquet('data/tabla_municipios.parquet')
municipios["CVEGEO"] = municipios["CVEGEO"].apply(normalizar_cvegeo)


# función para comparar 2 municipios
def comparar_municipios(mun1, mun2):
    """
    Compara dos municipios usando todos los modelos parciales:
    precipitación, temperatura, unidad climática, edafología y topoforma.
    Retorna una similitud entre 0 y 1.
    """

    mun1 = normalizar_cvegeo(mun1)
    mun2 = normalizar_cvegeo(mun2)

    # -----------------------------
    # 1. Extraer datos de cada DF
    # -----------------------------

    # Precipitación
    fila_prec_m1 = precipitacion[precipitacion["CVEGEO"] == mun1]
    fila_prec_m2 = precipitacion[precipitacion["CVEGEO"] == mun2]

    # Temperatura
    fila_temp_m1 = temperatura[temperatura["CVEGEO"] == mun1]
    fila_temp_m2 = temperatura[temperatura["CVEGEO"] == mun2]

    # Unidades climáticas
    fila_uni_m1 = unidades_clima[unidades_clima["CVEGEO"] == mun1]
    fila_uni_m2 = unidades_clima[unidades_clima["CVEGEO"] == mun2]
    # Edafología
    fila_eda_m1 = edafologia[edafologia["CVEGEO"] == mun1]
    fila_eda_m2 = edafologia[edafologia["CVEGEO"] == mun2]

    # Topoforma
    fila_topo_m1 = topoforma[topoforma["CVEGEO"] == mun1]
    fila_topo_m2 = topoforma[topoforma["CVEGEO"] == mun2]

    # -----------------------------
    # 2. Validar que existan datos
    # -----------------------------
    if fila_prec_m1.empty or fila_prec_m2.empty:
        return None
    if fila_temp_m1.empty or fila_temp_m2.empty:
        return None
    if fila_uni_m1.empty or fila_uni_m2.empty:
        return None
    if fila_eda_m1.empty or fila_eda_m2.empty:
        return None
    if fila_topo_m1.empty or fila_topo_m2.empty:
        return None


    # -----------------------------
    # 3. Obtener valores limpios
    # -----------------------------

    # Suponiendo nombre de columnas:
    v1_prec = fila_prec_m1.iloc[0]["CLAVE"]
    v2_prec = fila_prec_m2.iloc[0]["CLAVE"]

    v1_prec_2 = fila_prec_m1.iloc[0]["RANGOS"]
    v2_prec_2 = fila_prec_m2.iloc[0]["RANGOS"]


    v1_temp = fila_temp_m1.iloc[0]["RANGOS"]
    v2_temp = fila_temp_m2.iloc[0]["RANGOS"]

    v1_uni  = fila_uni_m1.iloc[0]["TIPO_N"]
    v2_uni  = fila_uni_m2.iloc[0]["TIPO_N"]

    v1_eda = unir_edafologia(fila_eda_m1.iloc[0])
    v2_eda = unir_edafologia(fila_eda_m2.iloc[0])

    v1_topo = fila_topo_m1.iloc[0]["CLAVE"]
    v2_topo = fila_topo_m2.iloc[0]["CLAVE"]


    # -----------------------------
    # 4. Llamar al modelo general
    # -----------------------------
    similitud = modelo_gral(
        v1_prec, v2_prec,
        v1_temp, v2_temp,
        v1_uni,  v2_uni,
        v1_eda,  v2_eda,
        v1_topo, v2_topo
    )

    return similitud

def comparar_municipios_detallado(mun1, mun2):
    """
    Compara dos municipios y muestra de forma detallada
    la similitud variable por variable.
    """

    fila_prec_m1 = precipitacion[precipitacion["CVEGEO"] == mun1]
    fila_prec_m2 = precipitacion[precipitacion["CVEGEO"] == mun2]

    fila_temp_m1 = temperatura[temperatura["CVEGEO"] == mun1]
    fila_temp_m2 = temperatura[temperatura["CVEGEO"] == mun2]
    fila_uni_m1 = unidades_clima[unidades_clima["CVEGEO"] == mun1]
    fila_uni_m2 = unidades_clima[unidades_clima["CVEGEO"] == mun2]

    fila_eda_m1 = edafologia[edafologia["CVEGEO"] == mun1]
    fila_eda_m2 = edafologia[edafologia["CVEGEO"] == mun2]

    fila_topo_m1 = topoforma[topoforma["CVEGEO"] == mun1]
    fila_topo_m2 = topoforma[topoforma["CVEGEO"] == mun2]

    # Validaciones
    if fila_prec_m1.empty or fila_prec_m2.empty:
        print("No hay datos de precipitación.")
        return
    if fila_temp_m1.empty or fila_temp_m2.empty:
        print("No hay datos de temperatura.")
        return
    if fila_uni_m1.empty or fila_uni_m2.empty:
        print("No hay datos de unidad climática.")
        return
    if fila_eda_m1.empty or fila_eda_m2.empty:
        print("No hay datos de edafología.")
        return
    if fila_topo_m1.empty or fila_topo_m2.empty:
        print("No hay datos de topoforma.")
        return

    # ---- EXTRAER VARIABLES ----
    v1_prec_1 = fila_prec_m1.iloc[0]["CLAVE"]
    v2_prec_1 = fila_prec_m2.iloc[0]["CLAVE"]

    v1_prec_2 = fila_prec_m1.iloc[0]["RANGOS"]
    v2_prec_2 = fila_prec_m2.iloc[0]["RANGOS"]

    v1_temp = fila_temp_m1.iloc[0]["RANGOS"]
    v2_temp = fila_temp_m2.iloc[0]["RANGOS"]

    v1_uni = fila_uni_m1.iloc[0]["TIPO_N"]
    v2_uni = fila_uni_m2.iloc[0]["TIPO_N"]

    # Campos múltiples concatenados para texto grande
    v1_eda = " ".join([
        str(fila_eda_m1.iloc[0]["CLAVE_WRB"]),
        str(fila_eda_m1.iloc[0]["GRUPO1"]),
        str(fila_eda_m1.iloc[0]["GRUPO2"]),
        str(fila_eda_m1.iloc[0]["GRUPO3"]),
        str(fila_eda_m1.iloc[0]["CLASE_TEXT"]),
        str(fila_eda_m1.iloc[0]["FRUDICA"])
    ])

    v2_eda = " ".join([
        str(fila_eda_m2.iloc[0]["CLAVE_WRB"]),
        str(fila_eda_m2.iloc[0]["GRUPO1"]),
        str(fila_eda_m2.iloc[0]["GRUPO2"]),
        str(fila_eda_m2.iloc[0]["GRUPO3"]),
        str(fila_eda_m2.iloc[0]["CLASE_TEXT"]),
        str(fila_eda_m2.iloc[0]["FRUDICA"])
    ])

    v1_topo = fila_topo_m1.iloc[0]["CLAVE"]
    v2_topo = fila_topo_m2.iloc[0]["CLAVE"]

    # ---- CALCULAR SIMILITUDES ----
    sim_prec_1 = precip(v1_prec_1, v2_prec_1)
    sim_prec_2 = precip(v1_prec_2, v2_prec_2)
    sim_temp = precip(v1_temp, v2_temp)
    sim_uni = similitud_proporcional(v1_uni, v2_uni)
    sim_eda = comparar_edafologia(v1_eda, v2_eda)
    sim_topo = comparar_topoforma(v1_topo, v2_topo)

    sim_final = (
        sim_prec_1 + sim_prec_2 + sim_temp + sim_uni + sim_eda + sim_topo
    ) / 6
    # Convertir lista a string

    # ---- construir salida en texto ----
    salida = f"""
============================================
Comparación entre {mun1} y {mun2}
============================================

PRECIPITACIÓN (CLAVE): {v1_prec_1} vs {v2_prec_1} → {sim_prec_1:.3f}
PRECIPITACIÓN (RANGO): {v1_prec_2} vs {v2_prec_2} → {sim_prec_2:.3f}
TEMPERATURA: {v1_temp} vs {v2_temp} → {sim_temp:.3f}
UNIDAD CLIMÁTICA: {v1_uni} vs {v2_uni} → {sim_uni:.3f}

EDAFOLOGÍA:
  {v1_eda}
  {v2_eda} 
  Similitud → {sim_eda:.3f}

TOPOFORMA: {v1_topo} vs {v2_topo} → {sim_topo:.3f}

--------------------------------------------
SIMILITUD FINAL PROMEDIO → {sim_final:.3f}
--------------------------------------------
"""
    return salida
