import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaSeedling } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-dark-green min-h-screen text-white p-6 font-sans">
        
      {/* Logo */}
      <div className="mb-7">
        <h1 className=" font-pixel text-large text-mostaza font-bold">
          AgroAnalytics
        </h1>
      </div>

      <p className="mb-2 text-gray-300 text-small">Navegación:</p>

      {/* Navegación */}
      <nav className="space-y-3">

        {/* Botón de inicio */}
        <NavLink
          to="/inicio"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all
            ${isActive ? "bg-mostaza text-white shadow-[4px_4px_0px_#0004]" : "hover:bg-mostaza/80 hover:shadow-[4px_4px_0px_#0004]"}`
          }
        >
          <FaHome className="text-xl" />
          Inicio
        </NavLink>

        {/* Botón de búsqueda */}
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all
            ${isActive ? "bg-mostaza text-white shadow-[4px_4px_0px_#0004]" : "hover:bg-mostaza/80 hover:shadow-[4px_4px_0px_#0004]"}`
          }
        >
          <FaSearch className="text-xl" />
          Buscador de municipios
        </NavLink>

        {/* Botón de cultivos */}
        <NavLink
          to="/cultivos"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-4 rounded-lg transition-all
            ${isActive ? "bg-mostaza text-white shadow-[4px_4px_0px_#0004]" : "hover:bg-mostaza/80 hover:shadow-[4px_4px_0px_#0004]"}`
          }
        >
          <FaSeedling className="text-xl" />
          Cultivos
        </NavLink>

      </nav>
    </aside>
  );
}
