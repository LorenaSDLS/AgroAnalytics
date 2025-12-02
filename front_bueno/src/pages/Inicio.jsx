/**
 * ============================================
 *   🔗 CONEXIÓN NECESARIA CON EL BACKEND
 * ============================================
 *
 * Este componente necesita recibir del backend:
 *
 * 1️⃣ **Gráficas en formato PNG/JPG** servidas desde Flask:
 *     - /grafica_historial_agricola
 *     - /grafica_cultivos_mayor_produccion
 *     - /grafica_top_municipios_potenciales
 *     - /grafica_historial_sequia_estatal
 *
 * 2️⃣ **Mapas en formato PNG/JPG** desde Flask:
 *     - /mapa_municipios_activos
 *
 *     - /mapa_tipo_suelo
 *     - /mapa_temperatura
 *     - /mapa_topoforma
 *     - /mapa_precipitacion
 *     - /mapa_unidades_climaticas
 *     - /mapa_municipios_activos
 *
 * 3️⃣ **Datos generales del panorama agrícola** (EN JSON):
 *
 *     ENDPOINT → GET `/datos_vis generales`
 *
 *     Ejemplo de respuesta del backend:
 *     {
 *       "total_produccion": 245,
 *       "anios": "10 (2014-2024)"
 *     }
 *
 *     🔧 Reemplazar los datos quemados con:
 *       useEffect(() => {
 *         fetch("http://127.0.0.1:5000/datos_generales")
 *          .then(res => res.json())
 *          .then(data => setDatos(data));
 *       }, []);
 *
 * 4️⃣ **Modal**
 *     - Solo necesita recibir la imagen en URL, no JSON.
 *
 * ============================================
 */




import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Modal from "../components/Modal";

export default function Inicio() {
  const [loaded, setLoaded] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState("");

  // Selector del mapa
  const [mapaTipo, setMapaTipo] = useState("temperatura");

  // ========= MAPEOS A ENDPOINTS DEL BACK ==========
  const mapas = {
    tipo_suelo: "http://127.0.0.1:5000/mapa_tipo_suelo",
    temperatura: "http://127.0.0.1:5000/mapa_temperatura",
    topoforma: "http://127.0.0.1:5000/mapa_topoforma",
    precipitacion: "http://127.0.0.1:5000/mapa_precipitacion",
    unidades_climaticas: "http://127.0.0.1:5000/mapa_unidades_climaticas",
  };


  
  // ========= 🔗 DATOS DESDE BACKEND ==========
  // const [datos, setDatos] = useState({
  //   total_produccion: 0,
  //   anios: "",
  // });

    /**
   * 🔥 Aquí haces la conexión real al backend
   * Solo descomenta cuando tengas el endpoint listo
   */
  /*
  useEffect(() => {
    fetch("http://127.0.0.1:5000/datos_generales")
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch((err) => console.error("❌ Error cargando datos:", err));
  }, []);
  */

  //  DATOS TEMPORALES (se eliminan cuando se conecte al back)
  const datos = {
    total_produccion: 245,
    anios: "10 (2014-2024)",
  };

  // Abrir modal
  const abrirModal = (url) => {
    setModalImg(url);
    setModalOpen(true);
  };
  
  return (
      <div className="space-y-10">
      {/* Título global */}
      <div className="text-center text-4xl font-extrabold text-white shadowed-text">
        Bienvenido a AgroAnalytics
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">

        {/*   COLUMNA IZQUIERDA (70%)  */}
        <div className="lg:col-span-6 space-y-10">

          {/* CARD PRINCIPAL */}
          <Card className="grid grid-cols-10 lg:grid-cols-10 gap-6 bg-[var(--dark-green)] text-white p-6 rounded-2xl shadow-[8px_8px_0px_#0004]">
            <h3 className="lg:col-span-5 space-y-10 text-3xl shadowed-text font-bold mb-2 p-5">Panorama general agrícola de México</h3>

            <div className="lg:col-span-5 space-y-10">

              {/* Producción */}
              <div className="bg-[var(--mostaza)] text-white p-6 rounded-xl shadow-[6px_6px_0px_#0004] text-center">
                <div className="text-medium-small shadowed-text font-bold uppercase">Producción total (10 años)</div>
                <div className="text-5xl shadowed-text p-2 font-bold">{datos.total_produccion}</div>
              </div>
            </div>

            <div className="lg:col-span-10 space-y-10">
              {/* Años considerados */}
              <div className="bg-[var(--mostaza)] text-white p-6 rounded-xl shadow-[6px_6px_0px_#0004] text-center">
                <div className="text-sm shadowed-text font-bold uppercase">Años considerados</div>
                <div className="text-3xl shadowed-text  font-bold">{datos.anios}</div>
              </div>
            </div>
          </Card>

          {/* 🔗 GRÁFICA DEL BACKEND */}
          <img
            src="http://127.0.0.1:5000/grafica_historial_agricola" //gráfica hisotrial agrícola nacional aquí
            className={`rounded-xl shadow-[8px_8px_0px_#0004] w-full transition-opacity duration-700 `}
          />

          {/* TRES MINI-CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Cuadro 1 */}
            <Card className="bg-[var(--dark-green)] text-white p-6 rounded-xl shadow-[6px_6px_0px_#0004] flex flex-col justify-between">
              <div className="text-lg font-bold mb-3 shadowed-text">Municipios activos agricolamente</div>
              {/* 🔗 GRÁFICA DEL BACKEND */}
              <img
                src="http://127.0.0.1:5000/mapa_municipios_activos"
                alt="Gráfico municipios"
                className="w-full h-64 object-contain rounded-lg shadow "
              />
              <button
                onClick={() => abrirModal("http://127.0.0.1:5000/mapa_municipios_activos")}
                className="bg-[var(--mostaza)] px-4 py-2 rounded-full font-semibold shadow-[4px_4px_0px_#0004] hover:bg-[var(--azulito)] transition"
              >
                Ver gráfico
              </button>
            </Card>

            {/* Cuadro 2 */}
            <Card className="bg-[var(--dark-green)] text-white p-6 rounded-xl shadow-[6px_6px_0px_#0004] flex flex-col justify-between">
              <div className="text-lg font-bold mb-3 shadowed-text">Cultivos con mayor producción</div>
              {/* 🔗 GRÁFICA DEL BACKEND */}
              <img
                src="http://127.0.0.1:5000/grafica_cultivos_mayor_produccion"
                alt="Gráfico municipios"
                className="w-full h-64 object-contain rounded-lg shadow "
              />
              <button
                onClick={() => abrirModal("http://127.0.0.1:5000/grafica_cultivos_mayor_produccion")}
                className="bg-[var(--mostaza)] px-4 py-2 rounded-full font-semibold shadow-[4px_4px_0px_#0004] hover:bg-[var(--azulito)] transition"
              >
                Ver gráfico
              </button>
            </Card>

            {/* Cuadro 3 */}
            <Card className="bg-[var(--dark-green)] text-white p-6 rounded-xl shadow-[6px_6px_0px_#0004] flex flex-col justify-between">
              <div className="text-lg font-bold mb-3 shadowed-text">Top municipios potentes</div>
              {/* 🔗 GRÁFICA DEL BACKEND */}
              <img
                src="http://127.0.0.1:5000/grafica_top_municipios_potenciales"
                alt="Gráfico municipios"
                className="rounded-lg img-size shadow "
              />
              <button
                onClick={() => abrirModal("http://127.0.0.1:5000/grafica_top_municipios_potenciales")}
                className="bg-[var(--mostaza)] px-4 py-2 rounded-full font-semibold shadow-[4px_4px_0px_#0004] hover:bg-[var(--azulito)] transition"
              >
                Ver gráfico
              </button>
            </Card>

          </div>
        </div>

        {/*  COLUMNA DERECHA (30%) */}
        <div className="lg:col-span-4 space-y-10">

          {/* TÍTULO + SELECTOR */}
          <div className="flex items-center gap-4">
            <div className="text-white shadowed-text text-3xl font-bold">Mapa de</div>
            {/* 🔗 CAMBIA LA IMAGEN SEGÚN EL ENDPOINT SELECCIONADO */}
            <select
              value={mapaTipo}
              onChange={(e) => setMapaTipo(e.target.value)}
              className="mt-2 p-3 rounded-full text-black shadow-[4px_4px_0px_#0004]"
            >
              <option value="tipo_suelo">tipos de suelo</option>
              <option value="temperatura">temperatura</option>
              <option value="topoforma">topoforma</option>
              <option value="precipitacion">precipitación</option>
              <option value="unidades_climaticas">unidades climáticas</option>
            </select>
          </div>

          {/* 🔗 MAPA DESDE EL BACKEND */}
          <img
            src={mapas[mapaTipo]}
            className="rounded-xl shadow-[8px_8px_0px_#0004] w-full transition-opacity duration-700"
          />

          {/* TÍTULO DE LA GRÁFICA FINAL */}
          <div className="text-white text-xl text-center shadowed-text font-bold">
            Historial de sequía estatal (últimos 10 años)
          </div>

          {/* GRÁFICA FINAL */}
          {/* 🔗 GRÁFICA DEL BACKEND */}
          <img
            src="http://127.0.0.1:5000/grafica_historial_sequia_estatal"
            className="rounded-xl shadow-[8px_8px_0px_#0004] w-full"
          />
        </div>

        {/* MODAL GLOBAL */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} imageUrl={modalImg} />

      </div>
    </div>
    );
  }
