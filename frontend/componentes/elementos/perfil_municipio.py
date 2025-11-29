import streamlit as st
import plotly.express as px
from data.acceso_data import leer_caracteristicas_municipio
from frontend.diseño import aplicar_estilos

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

    st.markdown("### Principales cultivos")

    if cultivos_df is not None:
        fig = px.bar(
            cultivos_df,
            x="Cultivo",
            y="Superficie",
            title="Top cultivos",
            height=300
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No hay datos de cultivos disponibles.")

    st.markdown('</div>', unsafe_allow_html=True)