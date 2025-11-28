import sys
import os
import plotly.express as px
import seaborn as sns
import matplotlib.pyplot as plt


# ==========================================================
# 1. CONFIGURAR PATH DEL PROYECTO
# ==========================================================
# Este archivo está en:
#   Distancia-360/frontend/pantallas/municipios.py
# Entonces la raíz es dos niveles arriba.
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT not in sys.path:
    sys.path.append(ROOT)


# ==========================================================
# 2. IMPORTS
# ==========================================================
import streamlit as st
from streamlit_folium import st_folium
import pandas as pd

from calculos.modelo import (
    comparar_municipios,
    comparar_municipios_detallado,
    normalizar_cvegeo
)
from frontend.graficas.grafica import graficar_similitud_municipios, graficar_sequia
# Cargar sequía (siempre aislada, ANTES de cualquier normalización del modelo)




# ==========================================================
# 3. FUNCIÓN PRINCIPAL DE LA PANTALLA
# ==========================================================
def pantalla_municipios():

    st.title(" Comparación de municipios")

    # ================================
    # Cargar datos
    # ================================
    tabla_muni = pd.read_parquet("/Users/lorenasolis/Desktop/distancia_360/Distancia-360/data/tabla_municipios.parquet")


    # ================================
    # Selectores principales
    # ================================
    col1, col2 = st.columns(2)

    with col1:
        estado_sel = st.selectbox(
            "Selecciona un estado",
            sorted(tabla_muni["NOM_ENT"].unique()),
            key="estado_sel"
        )

    municipios_estado = tabla_muni[
        tabla_muni["NOM_ENT"] == estado_sel
    ]["NOMGEO"].unique()

    with col2:
        municipio_sel = st.selectbox(
            "Selecciona un municipio",
            sorted(municipios_estado),
            key="municipio_sel"
        )

    # ================================
    # Botón para consultar el municipio
    # ================================
    consultar = st.button("Consultar municipio seleccionado")

    if consultar:
        fila = tabla_muni[
            (tabla_muni["NOM_ENT"] == estado_sel) &
            (tabla_muni["NOMGEO"] == municipio_sel)
        ]

        cvegeo = normalizar_cvegeo(fila.iloc[0]["CVEGEO"])
        st.session_state["cvegeo_seleccionado"] = cvegeo
        st.session_state["municipio_seleccionado_nombre"] = municipio_sel
        st.session_state["consulta_realizada"] = True

        st.success("Municipio cargado exitosamente.")

    # ================================
    # Si ya seleccionó un municipio
    # ================================
    if not st.session_state.get("consulta_realizada"):
        st.info("Selecciona un municipio para comenzar.")
        return  # No mostrar nada más

    # Datos de sesión
    cvegeo_base = st.session_state["cvegeo_seleccionado"]
    municipio_nombre = st.session_state["municipio_seleccionado_nombre"]

    st.subheader(f"Comparación de {municipio_nombre} con el resto del país")

    # ================================
    # Cargar lista de municipios
    # ================================
    tabla = pd.read_parquet("/Users/lorenasolis/Desktop/distancia_360/Distancia-360/data/tabla_municipios.parquet")
    tabla["CVEGEO"] = tabla["CVEGEO"].apply(normalizar_cvegeo)

    municipios_lista = tabla["CVEGEO"].unique()

    resultados = []

    # ================================
    # Calcular similitud contra todos
    # ================================
    with st.spinner("Calculando similitudes..."):
        for otro in municipios_lista:
            if otro == cvegeo_base:
                continue
            sim = comparar_municipios(cvegeo_base, otro)
            if sim is None:
                continue 


            fila_otro = tabla[tabla["CVEGEO"] == otro].iloc[0]
            nom_ent = fila_otro["NOM_ENT"]
            nom_geo = fila_otro["NOMGEO"]

            resultados.append((otro, nom_ent, nom_geo, sim))

    df_res = pd.DataFrame(resultados, columns=["CVEGEO", "NOM_ENT", "NOMGEO", "Similitud"])


    df_res = df_res.sort_values(by="Similitud", ascending=False)

    st.markdown("### Municipios más similares")
    st.dataframe(df_res.head(10), width="stretch")

    st.markdown("### Ver detalle de municipios similares")
    fig_sim = graficar_similitud_municipios(df_res)
    st.pyplot(fig_sim)

    for idx, row in df_res.head(10).iterrows():
        cve_otro = row["CVEGEO"]
        nombre_otro = f"{row['NOMGEO']} ({row['NOM_ENT']})"
        sim = row["Similitud"]
        # Botón por municipio
        if st.button(f"Ver detalle de {nombre_otro}", key=f"detalle_{cve_otro}"):
            st.markdown(f"## Comparación entre **{cvegeo_base}** y **{cve_otro}**")
            detalle = comparar_municipios_detallado(cvegeo_base, cve_otro)
            st.code(detalle)

    # Cargar sequía
    
# Convertir tipos
    df_sequia = pd.read_csv("/Users/lorenasolis/Desktop/distancia_360/Distancia-360/data/sequia_long.csv")

# Variables de ejemplo
    cvegeo_base = cvegeo_base        # CVEGEO del municipio base
    top10 = df_res.head(10)["CVEGEO"].tolist()  # Lista de municipios similares

# Crear figura
    # df_sequia: tus datos de sequía
# tabla_muni: tu tabla con nombres y estados
    fig_seq = graficar_sequia(df_sequia, cvegeo_base, top10, tabla)
    st.pyplot(fig_seq)


    











if __name__ == "__main__":
    pantalla_municipios()
