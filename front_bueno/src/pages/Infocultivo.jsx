// ------------------------------------------------------------
//  🟢 INSTRUCCIONES PARA CONECTAR AL BACKEND (InfoCultivo.jsx)
// ------------------------------------------------------------
//
// 1️⃣ Asegúrate de que tu backend tenga un endpoint:
//
//      GET  /cultivo/<id>
//
//    Ejemplo real:
//      /cultivo/15
//
// 2️⃣ Ese endpoint DEBE regresar JSON con este formato:
//
// {
//   "id": 15,
//   "nombre": "Ajo",
//   "entorno": "Clima templado, suelo franco-arenoso",
//   "unidad": "Toneladas",
//   "siniestrada": "120 ha",
//   "rendimiento": "4.2 ton/ha",
//   "volProm": "5200 ton",
//   "precioProm": "$13,500",
//   "valorProm": "$70,200,000",
//
//   "municipios_cultivan": [
//       "Jalisco", "Veracruz", "Oaxaca"
//   ],
//
//   "municipios_potenciales": [
//       { "estado": "Jalisco", "categoria": "Muy alto" },
//       { "estado": "Oaxaca", "categoria": "Alto" }
//   ]
// }
//
// 3️⃣ Revisa que `api.js` tenga correctamente:
//
//      export const api = axios.create({
//         baseURL: "http://127.0.0.1:5000",
//      });
//
// 4️⃣ React toma el ID desde la URL con:
//
//      /cultivo?id=15
//
// 5️⃣ Cuando tu backend esté listo:
//     Solo descomenta el bloque REAL y elimina el mock.
//
// ------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function InfoCultivo() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const cultivoId = params.get("id");

  // Estados principales
  const [loaded, setLoaded] = useState(false);
  const [info, setInfo] = useState(null);
  const [municipiosCultivan, setMunicipiosCultivan] = useState([]);
  const [municipiosPotenciales, setMunicipiosPotenciales] = useState([]);

// ------------------------------------------------------------
  //  🔵  VERSIÓN REAL (DESCOMENTAR CUANDO EL BACK ESTÉ LISTO)
  // ------------------------------------------------------------
  /*
  useEffect(() => {
    if (!cultivoId) return;

    setLoaded(false);

    async function fetchData() {
      try {
        const res = await api.get(`/cultivo/${cultivoId}`);
        const data = res.data;

        setInfo({
          nombre: data.nombre,
          entorno: data.entorno,
          unidad: data.unidad,
          siniestrada: data.siniestrada,
          rendimiento: data.rendimiento,
          volProm: data.volProm,
          precioProm: data.precioProm,
          valorProm: data.valorProm
        });

        setMunicipiosCultivan(data.municipios_cultivan || []);
        setMunicipiosPotenciales(data.municipios_potenciales || []);

        setLoaded(true);

      } catch (error) {
        console.error("ERROR al cargar cultivo:", error);
      }
    }

    fetchData();
  }, [cultivoId]);
  */

  // ------------------------------------------------------------
  //  🟡 MOCK PARA PROBAR MIENTRAS EL BACK NO ESTÁ LISTO
  // ------------------------------------------------------------

  useEffect(() => {
    if (!cultivoId) return;

    setLoaded(false);

    // Simulación backend
    setTimeout(() => {
      setInfo({
        nombre: "Ajo",
        entorno: "Clima templado, suelo franco-arenoso",
        unidad: "Toneladas",
        siniestrada: "120 ha",
        rendimiento: "4.2 ton/ha",
        volProm: "5200 ton",
        precioProm: "$13,500",
        valorProm: "$70,200,000"
      });

      setMunicipiosCultivan([
        "Jalisco",
        "Veracruz",
        "Oaxaca",
        "Chihuahua",
        "Sinaloa"
      ]);

      setMunicipiosPotenciales([
        { estado: "Jalisco", categoria: "Muy alto" },
        { estado: "Veracruz", categoria: "Muy alto" },
        { estado: "Oaxaca", categoria: "Alto" },
        { estado: "Chihuahua", categoria: "Alto" },
        { estado: "Tabasco", categoria: "Medio" }
      ]);

      setLoaded(true);
    }, 400);
  }, [cultivoId]);

  // LOADING 
  if (!info) {
    return (
      <div className="text-white text-xl text-center mt-20 animate-pulse">
        Cargando información del cultivo...
      </div>
    );
  }

  // ------------------------------------------------------------
  //                UI COMPLETA (NO TOCAR) hshhshs
  // ------------------------------------------------------------
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-10 gap-10 transition-opacity duration-700 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >

      {/* COLUMNA IZQUIERDA (70%)*/}
      <div className="lg:col-span-7 space-y-10">

        {/* TÍTULO */}
        <h1 className="text-white text-center font-bold text-4xl shadowed-text">
          Información del cultivo:{" "}
          <span className="text-[var(--beige)]">{info.nombre}</span>
        </h1>

        {/*  FILA 1: TOP + GRÁFICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/*  TOP 10  */}
          <div className="bg-[var(--dark-green)] text-white rounded-xl p-5 shadow-[4px_4px_0px_#0004] h-[420px] overflow-y-auto md:row-span-2">
            <h2 className="font-bold text-xl mb-3 shadowed-text">Top 10 productores</h2>
            <ul className="space-y-1 text-sm">
              {municipiosCultivan.map((m, i) => (
                <li key={i} className="border-b border-white/20 pb-1">
                  {m}
                </li>
              ))}
            </ul>
          </div>

          {/* 🔗 GRÁFICA DEL BACKEND */}
          {/*  GRÁFICA 1  */}
          <img
            src="http://127.0.0.1:5000/grafica_principales_cultivos" onLoad={() => setLoaded(true)} //gráfica de principales cultivos aquí
            className={`w-full rounded-lg shadow-[8px_8px_0px_#0004] transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* 🔗 GRÁFICA DEL BACKEND */}
          {/*  GRÁFICA 2  */}
          <img
            src="http://127.0.0.1:5000/grafica_ingresos_economicos"
            className="w-full rounded-lg shadow-[8px_8px_0px_#0004] "
            onLoad={() => setLoaded(true)}
          />

          {/* 🔗 GRÁFICA DEL BACKEND */}
          {/*  GRÁFICA HISTÓRICA (completa)  */}
          <img
            src="http://127.0.0.1:5000/grafica_historial_agricola"
            className="w-full rounded-lg shadow-[6px_6px_0px_#0004] md:col-span-2 "
            onLoad={() => setLoaded(true)}
          />
        </div>

        {/* FILA 2: MAPA + MUNICIPIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 🔗 GRÁFICA DEL BACKEND */}
          {/*  MAPA  */}
          <div className="md:col-span-2">
            <h2 className="text-white font-bold mb-2 shadowed-text">
              Mapa de cultivos de {info.nombre}
            </h2>
            <img
              src="http://127.0.0.1:5000/mapa_cultivo"
              className="w-full h-72  rounded-lg shadow-[4px_4px_0px_#0004]"
              onLoad={() => setLoaded(true)}
            />
          </div>

          {/*  MUNICIPIOS  */}
          <div className="bg-[var(--dark-green)] text-white p-5 rounded-xl shadow-[4px_4px_0px_#0004] h-72 overflow-y-auto">
            <h2 className="font-bold text-lg mb-2 shadowed-text">Municipios que lo cultivan</h2>
            <ul className="space-y-1 text-sm">
              {municipiosCultivan.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTÓN VOLVER */}
        <div>
          <button
            onClick={() => navigate("/cultivos")}
            className="bg-[var(--dark-green)] text-white px-6 py-4 rounded-full shadow-[4px_4px_0px_#0004] hover:bg-[var(--azulito)]"
          >
            Volver a cultivos
          </button>
        </div>
      </div>

      {/* COLUMNA DERECHA (30%) */}
      <div className="lg:col-span-3 space-y-8">

        {/*  MÁS INFO  */}
        <div className="bg-[var(--beige)] p-6 rounded-xl shadow-[4px_4px_0px_#0004]">
          <h3 className="font-bold text-xl text-center mb-3 text-[var(--dark-green)]">
            Más información 
          </h3>

          <div className="space-y-3 text-sm text-black">
            <div><b>Cultivo:</b> {info.nombre}</div>
            <div><b>Entorno ideal/Necesidades:</b> {info.entorno}</div>
            <div><b>Unidad:</b> {info.unidad}</div>

            <div className="grid grid-cols-2 gap-2">
              <div><b>Siniestrada:</b> {info.siniestrada}</div>
              <div><b>Rendimiento:</b> {info.rendimiento}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div><b>Vol. prom:</b> {info.volProm}</div>
              <div><b>Precio prom:</b> {info.precioProm}</div>
              <div><b>Valor-producción prom:</b> {info.valorProm}</div>
            </div>
          </div>
        </div>

        {/*  POTENCIAL  */}
        <div className="bg-[var(--beige)] p-6 rounded-xl shadow-[4px_4px_0px_#0004]">
          <h3 className="font-bold text-xl text-center mb-1 text-[var(--dark-green)]">
            Municipios con potencial
          </h3>
          <div className="font-bold text-medium-small mb-1 text-[var(--dark-green)]">
            según índice de AC2
          </div>

          <div className="text-xs text-gray-700 mb-3">
            (Municipios que no se tiene registro que cultiven este producto)
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Estado</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              {municipiosPotenciales.map((m, i) => (
                <tr key={i} className="border-b">
                  <td>{m.estado}</td>
                  <td className="font-bold text-[var(--dark-green)]">{m.categoria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
