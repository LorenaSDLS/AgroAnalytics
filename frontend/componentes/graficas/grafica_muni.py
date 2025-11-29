import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def graficar_similitud_municipios(df_similitud):
    df_similitud = df_similitud.sort_values("Similitud", ascending=False)

    plt.figure(figsize=(8, 4))
    sns.barplot(
        data=df_similitud.head(10),
        x="Similitud",
        y="NOMGEO",
        hue="NOMGEO",
        palette="viridis",
        legend=False
    )
    plt.title("Top 10 Municipios Con Mayor Similitud")
    plt.xlabel("Similitud")
    plt.ylabel("Municipio")
    plt.xlim(0, 1)
    plt.tight_layout()

    return plt.gcf()

def graficar_sequia(df_sequia, municipio, lista_municipios, tabla_muni):
    """
    df_sequia: DataFrame con columnas 'CVEGEO', 'Fecha', 'Nivel_Sequia'
    municipio: CVEGEO del municipio base
    lista_municipios: lista de CVEGEO de municipios a comparar
    tabla_muni: DataFrame con columnas 'CVEGEO', 'NOMGEO', 'NOM_ENT' para los nombres legibles
    """
    df_sequia["CVEGEO"] = df_sequia["CVEGEO"].astype(str).str.zfill(5)
    municipio = str(municipio).zfill(5)
    lista_municipios = [str(x).zfill(5) for x in lista_municipios]

    df_sequia["Fecha"] = pd.to_datetime(df_sequia["Fecha"], errors="coerce")
    df_sequia["Año"] = df_sequia["Fecha"].dt.year

    df_anual = (
        df_sequia
        .groupby(["CVEGEO", "Año"], as_index=False)
        .agg(Nivel_Sequia=("Nivel_Sequia", lambda x: round(x.mean())))
    )

    # Filtrar solo los municipios que nos interesan
    df_anual = df_anual[df_anual["CVEGEO"].isin(lista_municipios + [municipio])]

    # Mapear nombres legibles
    nombres_map = tabla_muni.set_index("CVEGEO").apply(lambda row: f"{row['NOMGEO']} ({row['NOM_ENT']})", axis=1)
    df_anual["Nombre"] = df_anual["CVEGEO"].map(nombres_map)

    # Pivotar para heatmap usando el nombre legible
    heat_df = df_anual.pivot(index="Nombre", columns="Año", values="Nivel_Sequia")

    # --- Crear figura explícita ---
    fig, ax = plt.subplots(figsize=(10,5))
    sns.heatmap(
        heat_df,
        annot=True,
        fmt=".0f",
        cmap="YlOrRd",
        cbar_kws={'label': 'Nivel de sequía'},
        ax=ax
    )
    ax.set_ylabel("Municipio")
    ax.set_xlabel("Año")
    ax.set_title("Historial de sequía")
    fig.tight_layout()

    return fig

