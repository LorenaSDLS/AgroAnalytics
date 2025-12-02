/**
 *  🔧 INSTRUCCIONES PARA CONECTAR SEARCHPAGE AL BACKEND
 *  =====================================================
 *
 *  Para que esta pantalla funcione correctamente con tu API Flask,
 *  necesitas habilitar 4 endpoints principales en el backend.
 *  Estos endpoints deben estar activos en: 
 *
 *      http://127.0.0.1:5000/
 *
 *  ---------------------------------------------------------------------
 *  1) 📌 GET /municipios
 *  ---------------------------------------------------------------------
 *  ✔ Devuelve un listado plano donde **cada fila representa 1 municipio**
 *  ✔ Estructura recomendada:
 *      [
 *        {
 *          "cvegeo": "20001",
 *          "nomgeo": "Abejones",
 *          "nombre_ent": "Oaxaca"
 *        },
 *        ...
 *      ]
 *
 *  ✔ SearchPage usa esto para:
 *      - llenar el select de estados
 *      - filtrar municipios por estado
 *
 *  ---------------------------------------------------------------------
 *  2) 📌 GET /similar-municipios/<cvegeo>
 *  ---------------------------------------------------------------------
 *  ✔ Se ejecuta al presionar "Consultar"
 *  ✔ Debe regresar un JSON con esta estructura EXACTA:
 *
 *      {
 *        "municipios_mas_similares": [
 *          { "cvegeo": "20005", "estado": "Oaxaca", "municipio": "Calpulalpan", "similitud": 87 },
 *          ...
 *        ],
 *
 *        "cultivos_similares": ["Maíz", "Aguacate", "Limón"],
 *
 *        "cultivos_potenciales": [
 *          { "cultivo": "Café", "puntaje": 9.4, "indice": "Alto" },
 *          ...
 *        ],
 *
 *        "perfil_municipio": {
 *          "estado": "Oaxaca",
 *          "municipio": "Abejones"
 *        },
 *
 *        "todos_los_cultivos": ["Maíz", "Avena", "Agave", ...]
 *      }
 *
 *  ✔ Todo SearchPage depende de esta estructura.
 *
 *  ---------------------------------------------------------------------
 *  3) 📌 GET /detalles-comparacion/<cvegeo>
 *  ---------------------------------------------------------------------
 *  ✔ Se llama al hacer clic en el botón "ver más".
 *  ✔ Debe devolver la información específica del municipio relacionado.
 *  ✔ Se envía a <ModalCentro /> como "data".
 *
 *  Ejemplo recomendado:
 *      {
 *        "estado": "Oaxaca",
 *        "municipio": "Calpulalpan",
 *        "similitud": 87,
 *        "variables": {
 *          "clima": {...},
 *          "suelo": {...},
 *          "producción": {...}
 *        }
 *      }
 *
 *  ---------------------------------------------------------------------
 *  4) 🖼️ ENDPOINTS DE GRÁFICAS Y MAPAS
 *  ---------------------------------------------------------------------
 *  Los siguientes deben devolver imágenes PNG:
 *
 *    GET /grafica_municipios_similares
 *    GET /grafica_historial_sequia
 *    GET /grafica__historial_agricola
 *    GET /grafica_principales_cultivos
 *
 *  ✔ Cada uno debe usar:
 *      return send_file(buffer, mimetype="image/png")
 *
 *  ---------------------------------------------------------------------
 *  5) 🧩 Integración del archivo src/services/api.js
 *  ---------------------------------------------------------------------
 *
 *  El archivo debe contener las funciones:
 *
 *      getMunicipios()
 *      getSimilarMunicipio(cvegeo)
 *      getDetallesComparacion(cvegeo)
 *
 *  Ejemplo:
 *
 *    export const api = {
 *      getMunicipios: () => fetch("/municipios").then(r => r.json()),
 *      getSimilarMunicipio: (cvegeo) =>
 *          fetch(`/similar-municipios/${cvegeo}`).then(r => r.json()),
 *      getDetallesComparacion: (cvegeo) =>
 *          fetch(`/detalles-comparacion/${cvegeo}`).then(r => r.json()),
 *    };
 *
 *  ---------------------------------------------------------------------
 *  ✔ Con todo esto configurado en backend + services/api.js:
 *     ➜ SearchPage funciona sin tocar nada más.
 *
 */

import { useEffect, useState } from "react";
import { api } from "../services/api";
import ModalCentro from "../components/ModalCentro";


export default function SearchPage() {
  const [estadosMunicipios, setEstadosMunicipios] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState("");
  const [municipiosFiltrados, setMunicipiosFiltrados] = useState([]);

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const [loaded, setLoaded] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);


  useEffect(() => {
    api.getMunicipios().then((data) => {
      setEstadosMunicipios(data);
    });
  }, []);

  useEffect(() => {
    if (!estadoSeleccionado) return;
    const filtered = estadosMunicipios.filter(
      (m) => m.nombre_ent === estadoSeleccionado
    );
    setMunicipiosFiltrados(filtered);
  }, [estadoSeleccionado, estadosMunicipios]);

  const onConsultar = () => {
    if (!municipioSeleccionado) return;

    setLoading(true);
    setResultado(null);

    api.getSimilarMunicipio(municipioSeleccionado).then((data) => {
        console.log("DATA RECIBIDA:", data);
        setResultado(data);
        setLoading(false);
    });

  };

  return (
    <div className="p-6 max-w-7xl mx-auto ">

      {/* TÍTULO */}
      <div className="text-white text-center font-bold text-principal shadowed-text mb-6">
        Buscador de Municipios
      </div>

      {/* FILTROS */}
      <div className="flex flex-col items-center space-y-4 mb-4">

        {/* Selects alineados */}
        <div className="flex flex-col md:flex-row gap-4 justify-center ">

          {/* Estado */}
          <select
            className="border p-3 rounded-full text-black px-12 shadow-[4px_4px_0px_#0004]"
            value={estadoSeleccionado}
            onChange={(e) => {
              setEstadoSeleccionado(e.target.value);
              setMunicipioSeleccionado("");
            }}
          >
            <option value="">Seleccione un estado</option>
            {[...new Set(estadosMunicipios.map((m) => m.nombre_ent))].map(
              (estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              )
            )}
          </select>

          {/* Municipio */}
          <select
            className="border p-3 rounded-full text-black px-12 shadow-[4px_4px_0px_#0004]"
            value={municipioSeleccionado}
            onChange={(e) => setMunicipioSeleccionado(e.target.value)}
          >
            <option value="">Seleccione un municipio</option>
            {municipiosFiltrados.map((m) => (
              <option key={m.cvegeo} value={m.cvegeo}>
                {m.nomgeo}
              </option>
            ))}
          </select>
        </div>

        {/* Botón consultar */}
        <button
          onClick={onConsultar}
          className="bg-[var(--dark-green)] text-white px-10 py-5 rounded-full shadow-[4px_4px_0px_#0004] hover:bg-green-800 transition"
        >
          Consultar 
        </button>
      </div>

      {/* LOADER */}
      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin h-10 w-10 border-t-4 border-[var(--dark-green)] rounded-full mx-auto"></div>
          <p className="mt-4 text-[var(--dark-green)] font-semibold">
            Calculando similitudes...
          </p>
        </div>
      )}

      {/*  RESULTADO  */}
      {resultado && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/** COLUMNA 1 **/}

          {/* Tabla top municipios similares */}
          <div >

            <h2 className="font-bold text-lg text-black mb-3">
              Top municipios similares
            </h2>

            <div className="overflow-hidden rounded-xl shadow-[4px_4px_0px_#0004]">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-[var(--azulito)] text-white">
                  <tr>
                    <th className="p-3 border-r border-white/30">Estado</th>
                    <th className="p-3 border-r border-white/30">Municipio</th>
                    <th className="p-3 border-r border-white/30">Similitud</th>
                    <th className="p-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.municipios_mas_similares.map((m) => (
                    <tr
                      key={m.cvegeo}
                      className="odd:bg-gray-100 even:bg-gray-50 hover:bg-gray-200"
                    >
                      <td className="p-3 border-r border-gray-300">{m.estado}</td>
                      <td className="p-3 border-r border-gray-300">{m.municipio}</td>
                      <td className="p-3 border-r border-gray-300 font-semibold">
                        {m.similitud}%
                      </td>
                      <td className="p-3 text-center">
                        <button
                            className={`px-3 py-1 rounded-lg text-xs shadow text-white 
                                ${selectedRow === m.cvegeo ? "bg-orange-600" : "bg-[var(--azulito)] hover:bg-blue-600"}`}
                            onClick={() => {
                                setSelectedRow(m.cvegeo);
                                // aquí llamas API o usas datos de prueba
                                api.getDetallesComparacion(m.cvegeo).then((detalles) => {
                                setModalData(detalles);
                                setModalOpen(true);
                                });
                            }}
                            > ver más
                            </button>
                            <ModalCentro
                                open={modalOpen}
                                onClose={() => setModalOpen(false)}
                                data={modalData}
                                />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MAPA */}
            <h2 className="font-bold text-lg text-black mt-6 mb-2">
              Municipios similares
            </h2>

            {/* 🔗 GRÁFICA DEL BACKEND */}
            <img
              src="http://127.0.0.1:5000/grafica_municipios_similares"
              className={`w-full rounded-xl shadow-lg transition-opacity duration-700 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLoaded(true)}
            />

            {/* Historial de sequía — SUBIDO ARRIBA */}
            <h2 className="font-bold text-lg text-black mt-6 mb-2">
            Historial de sequía
            </h2>
            {/* 🔗 GRÁFICA DEL BACKEND */}
            <img
            src="http://127.0.0.1:5000/grafica_historial_sequia"
            className={`w-full rounded-xl shadow-lg transition-opacity duration-700 ${
                loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            />

          </div>
          
            
          {/**  COLUMNA 2  **/}

          <div className="space-y-6">

            {/* Cultivos similares */}
            <div className="bg-[var(--azulito)] rounded-xl shadow-[4px_4px_0px_#0004] p-4">
              <h2 className="font-bold text-lg text-center text-white mb-3">
                Cultivos similares
              </h2>

              <ul className="list-disc ml-6 text-white font-bold text-sm">
                {resultado.cultivos_similares.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Cultivos potenciales */}
            <div >
              <h2 className="font-bold text-lg text-center text-black mb-3">
                Cultivos potenciales
              </h2>

              <div className="overflow-hidden rounded-xl shadow-[4px_4px_0px_#0004]">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-[var(--azulito)] text-white">
                    <tr>
                      <th className="p-3 border-r border-white/30">Cultivo</th>
                      <th className="p-3 border-r border-white/30">Puntaje</th>
                      <th className="p-3">Índice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.cultivos_potenciales.map((c) => (
                      <tr
                        key={c.cultivo}
                        className="odd:bg-gray-100 even:bg-gray-50 hover:bg-gray-200"
                      >
                        <td className="p-3 border-r border-gray-300">{c.cultivo}</td>
                        <td className="p-3 border-r text-center border-gray-300">{c.puntaje}</td>
                        <td className="p-3 font-semibold">{c.indice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/**  COLUMNA 3  **/}

          <div className="space-y-6">

            {/* Perfil del municipio */}
            <div className="bg-[var(--beige)] rounded-xl shadow-[4px_4px_0px_#0004] p-4">
              <h2 className="font-bold text-lg text-center text-black mb-2">
                Perfil del municipio
              </h2>

              <p className="text-center  ">
                {resultado.perfil_municipio.estado} —{" "}
                {resultado.perfil_municipio.municipio}
              </p>
              
              {/* 🔗 GRÁFICA DEL BACKEND */}
              <img
                src="http://127.0.0.1:5000/grafica__historial_agricola"
                className={`w-full rounded-xl shadow-[4px_4px_0px_#0004] mt-3 transition-opacity duration-700 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setLoaded(true)}
              />
            </div>

            {/* Cultivos */}
            <div className="bg-[var(--beige)] rounded-xl shadow-[4px_4px_0px_#0004] p-4">
              <h1 className="font-bold text-large text-center text-black mb-2">
                Cultivos
              </h1>
              
              {/* 🔗 GRÁFICA DEL BACKEND */}
              <img
                src="http://127.0.0.1:5000/grafica_principales_cultivos"
                className={`w-full rounded-xl shadow-lg mb-4 transition-opacity duration-700 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setLoaded(true)}
              />

              <h3 className="font-semibold text-center mb-2">Todos los cultivos</h3>
              <ul className="list-disc ml-6 text-sm font-bold">
                {resultado.todos_los_cultivos.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
