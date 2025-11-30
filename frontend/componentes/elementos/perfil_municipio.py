import streamlit as st
import plotly.express as px
from data.acceso_data import *
from frontend.diseño import aplicar_estilos
from calculos.aez_comp import obtener_cultivos

aplicar_estilos()


def mostrar_perfil_municipio(fila_muni, cultivos_df=None):
    """
    Renderiza un panel tipo sidebar (pero a la derecha)
    con el perfil del municipio seleccionado.
    """

    cvegeo = fila_muni["CVEGEO"].iloc[0]
    carac = leer_caracteristicas_municipio(cvegeo)

    st.markdown('<div class="municipio-card">', unsafe_allow_html=True)
        
    st.subheader("Perfil del municipio")

    st.markdown(f"**Estado:** {fila_muni['NOM_ENT'].iloc[0]}")
    st.markdown(f"**Municipio:** {fila_muni['NOMGEO'].iloc[0]}")

    st.markdown("**Principales cultivos del municipio**")
    cultivos_muni = obtener_cultivos(cvegeo)

    if len(cultivos_muni) == 0:
        st.markdown("No hay cultivos registrados en el cierre agrícola.")
    else:
        # si quieres mostrar ID y nombre:
        nombres = df_catalogo_cultivos.set_index("Idcultivo")["Nomcultivo"].to_dict()
        lista = [f"{cid} — {nombres.get(cid, 'Desconocido')}" for cid in cultivos_muni]

        st.markdown("- " + "<br>- ".join(lista), unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)