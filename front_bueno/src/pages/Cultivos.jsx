/**
 * ============================================================
 *                   PANTALLA: Cultivos.jsx
 * ============================================================
 *
 * 📌 DESCRIPCIÓN
 * Pantalla principal para visualizar información agrícola a nivel nacional:
 * - Total de cultivos y años disponibles.
 * - Gráficas principales (se cargan como imágenes desde Flask).
 * - Mapa agrícola.
 * - Lista de cultivos filtrable por letra.
 * - Lista dinámica de Top 10 productores (desde backend).
 *
 * ------------------------------------------------------------
 * 🔌 ENDPOINTS QUE DEBE ENTREGAR EL BACKEND (FLASK)
 * ------------------------------------------------------------
 *
 * 1) GET /cultivos
 *    ➜ Devuelve lista de cultivos
 *    [
 *      { "id": 1, "nombre": "Aguacate" },
 *      { "id": 2, "nombre": "Café" },
 *      { "id": 3, "nombre": "Naranja" }
 *    ]
 *
 * 2) GET /total_anios
 *    ➜ Devuelve número total de años disponibles
 *    { "total": 15 }
 *
 * 3) GET /top_productores
 *    ➜ Devuelve lista del Top 10 productores por cultivo:
 *    [
 *      { "estado": "Jalisco", "cultivo": "Aguacate" },
 *      { "estado": "Veracruz", "cultivo": "Naranja" }
 *    ]
 *
 * 4) RUTAS DE IMÁGENES (usar send_file en Flask):
 *    /grafica_principales_cultivos
 *    /grafica_ingresos_economicos
 *    /grafica_historial_agricola
 *    /mapa_cultivos_principales
 *    /grafica_cultivos_siniestros
 *
 * ------------------------------------------------------------
 * 🧪 RESPUESTA DE PRUEBA PARA TOP PRODUCTORES
 * (Sustituir cuando el back ya esté terminado)
 * ------------------------------------------------------------
 * [
 *   { "estado": "Jalisco", "cultivo": "Aguacate" },
 *   { "estado": "Veracruz", "cultivo": "Naranja" },
 *   { "estado": "Chiapas", "cultivo": "Café" },
 *   { "estado": "Sinaloa", "cultivo": "Maíz" },
 *   { "estado": "Michoacán", "cultivo": "Limón" },
 *   { "estado": "Puebla", "cultivo": "Maíz" },
 *   { "estado": "Oaxaca", "cultivo": "Café" },
 *   { "estado": "Sonora", "cultivo": "Trigo" },
 *   { "estado": "Chihuahua", "cultivo": "Alfalfa" },
 *   { "estado": "Hidalgo", "cultivo": "Cebada" }
 * ]
 *
 * ------------------------------------------------------------
 * 🔗 NAVEGACIÓN
 * Cada cultivo se abre en:
 *    /infocultivo?id=ID_DEL_CULTIVO
 * ------------------------------------------------------------
 */

import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Cultivos() {
  const [loaded, setLoaded] = useState(false);

  const [cultivos, setCultivos] = useState([]);
  const [totalAnios, setTotalAnios] = useState(null);

  const [letraSeleccionada, setLetraSeleccionada] = useState('');
  const [cultivosFiltrados, setCultivosFiltrados] = useState([]);

  // Estado para top productores
  const [topProductores, setTopProductores] = useState([]);


  // ============================================
  //           CARGA DE DATOS DESDE BACKEND
  // ============================================
  useEffect(() => {
    //1) lista de culivos
    api.getCultivos().then(data => {
      setCultivos(data);
      setCultivosFiltrados(data);
    });

    // 2) Total años
    // api.getAniosCultivos().then(res => setTotalAnios(res.total));
    setTotalAnios(10); // Placeholder mientras el backend está listo

    /// 3) Top productores
    /*
    api.getTopProductoresCultivos().then(data => {
      setTopProductores(data);
    });
    */
   // ❗ Placeholder para pruebas
    setTopProductores([
      { estado: "Jalisco", cultivo: "Aguacate" },
      { estado: "Veracruz", cultivo: "Naranja" },
      { estado: "Chiapas", cultivo: "Café" },
      { estado: "Sinaloa", cultivo: "Maíz" },
    ]);

  }, []);



  // Filtrar cultivos por letra
  const filtrarPorLetra = (letra) => {
    setLetraSeleccionada(letra);
    if (letra === '') {
      setCultivosFiltrados(cultivos);
    } else {
      setCultivosFiltrados(
        cultivos.filter(c => c.nombre.toUpperCase().startsWith(letra))
      );
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">

      {/* COLUMNA IZQUIERDA */}
      <div className="lg:col-span-7 space-y-10">

        {/*  TITULO  */}
        <div className="text-white text-center font-bold text-3xl shadowed-text">
          Agricultura en México – Cultivos
        </div>

        {/*  CARDS VERDES  */}
        <div className="flex justify-center gap-10">
          <div className="bg-[var(--dark-green)] text-white px-10 py-6 shadow-[4px_4px_0px_#0004] shadowed-text rounded-lg text-xl">
            {cultivos.length} cultivos
          </div>

          <div className="bg-[var(--dark-green)] text-white px-10 py-6 shadow-[4px_4px_0px_#0004] shadowed-text rounded-lg text-xl">
            {totalAnios ?? "..."} años
          </div>
        </div>

        {/*   FILA 1   */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 🔗 GRÁFICA DEL BACKEND */}
          {/* Gráfica 1 */}
          <img
            src="http://127.0.0.1:5000/grafica_principales_cultivos" onLoad={() => setLoaded(true)} //gráfica de principales cultivos aquí
            className={`w-full rounded-lg shadow-[8px_8px_0px_#0004] transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* 🔗 GRÁFICA DEL BACKEND */}
          {/* Gráfica 2 */}
          <img
            src="http://127.0.0.1:5000/grafica_ingresos_economicos" onLoad={() => setLoaded(true)} //gráffica de ingresos económicos aquí
            className={`w-full rounded-lg shadow-[8px_8px_0px_#0004] transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Lista Top 10 productores (columna derecha) */}
          <div className="text-white bg-[var(--dark-green)] rounded-xl p-4 shadow-[4px_4px_0px_#0004] h-[420px] overflow-y-auto md:row-span-2">
            <div className="font-bold text-lg shadowed-text mb-2">Top 10 productores</div>

            <ul className="space-y-2 text-sm shadowed-text">
              {topProductores.length > 0 ? (
                topProductores.map((item, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{item.estado}</span> — {item.cultivo}
                  </li>
                ))
              ) : (
                <li>Cargando...</li>

              )}
            </ul>
          </div>

          {/* 🔗 GRÁFICA DEL BACKEND */}
          {/* Gráfica de serie histórica (ocupa 2 columnas) */}
          <img
            src="http://127.0.0.1:5000/grafica_historial_agricola" onLoad={() => setLoaded(true)} //gráfica hisotrial agrícola nacional aquí
            className={`w-full rounded-xl shadow-[4px_4px_0px_#0004] md:col-span-2 transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />

        </div>

        {/*   FILA 3   */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 🔗 MAPA DEL BACKEND */}
          {/* Mapa */}
          <img
            src="http://127.0.0.1:5000/mapa_cultivos_prinicpales" onLoad={() => setLoaded(true)} //mapa de cultivos aquí
            className={`w-full h-72 object-contain rounded-lg shadow-[4px_4px_0px_#0004] transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Gráfica de siniestralidad */}
          <img
            src="http://127.0.0.1:5000/grafica_cultivos_siniestros" onLoad={() => setLoaded(true)} //gráfica de cultivos con mayor siniestralidad aquí
            className={`w-full h-72 object-contain rounded-lg shadow-[4px_4px_0px_#0004] transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

      </div>

      {/* COLUMNA DERECHA */}
      <div className="lg:col-span-3 space-y-6">

        <div className="text-white font-bold text-2xl shadowed-text text-center">
          Filtrado de cultivos
        </div>

        {/* Botón mostrar todos */}
        <button
          onClick={() => filtrarPorLetra('')}
          className="w-full bg-[var(--dark-green)] shadowed-text text-white px-6 py-4 rounded-full shadow-[4px_4px_0px_#0004] hover:bg-[var(--azulito)]"
        >
          Mostrar todos
        </button>

        {/* Botones A–Z */}
        <div className="grid grid-cols-6 gap-2">
          {letras.map(letra => (
            <button
              key={letra}
              onClick={() => filtrarPorLetra(letra)}
              className={`px-4 py-2 rounded-full shadow-[4px_4px_0px_#0004] shadowed-text text-white 
              ${letraSeleccionada === letra ? "bg-[var(--azulito)]" : "bg-[var(--dark-green)]"}`}
            >
              {letra}
            </button>
          ))}
        </div>

        {/* Total cultivos */}
        <div className="text-white font-bold text-xl shadowed-text">
          Total de cultivos: {cultivosFiltrados.length}
        </div>

        {/* Lista de cultivos */}
        <div className="flex flex-wrap gap-2">
          {cultivosFiltrados.map(c => (
            <button
              key={c.id}
              onClick={() => window.location.href = `/infocultivo?id=${c.id}`}
              className="bg-[var(--dark-green)] shadowed-text text-white px-6 py-3 rounded-full shadow-[4px_4px_0px_#0004] hover:bg-[var(--azulito)] transition"
            >
              {c.nombre}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
