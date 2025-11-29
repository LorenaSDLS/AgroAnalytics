#comando para correrlo: streamlit run frontend/app.py
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import streamlit as st
import pandas as pd
from frontend.diseño import aplicar_estilos
from frontend.pantallas.inicio import pantalla_inicio
from frontend.pantallas.municipios import pantalla_municipios
from frontend.pantallas.cultivos import pantalla_cultivos
from frontend.pantallas.cultivo_detalles import pantalla_cultivo_detalles

aplicar_estilos()

pagina = st.sidebar.radio(
    "Navegación:",
    ["Inicio", "Buscador de municipios", "Cultivos"]
)
if pagina == "Inicio":
    st.title("Bienvenido a AgroAnalytics")
    pantalla_inicio()
elif pagina == "Buscador de municipios":
    st.title("Buscador de municipios")
    pantalla_municipios()
elif pagina == "Cultivos":
    st.title("Análisis de cultivos")
    pantalla_cultivos()