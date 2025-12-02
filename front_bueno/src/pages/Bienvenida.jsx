import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

export default function Bienvenida() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br via-green-700 to-green-500 text-white p-8">
      
      {/* Encabezado */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-9 shadowed-text">
        🌱 Bienvenido a 🌱 
      </h1>
      <h1 className="font-pixel text-5xl text-yellow-300 md:text-7xl font-extrabold text-center mb-6 shadowed-text">
        AgroAnalytics
      </h1>
      {/* Subtítulo */}
      <p className="text-lg md:text-2xl text-center max-w-2xl mb-10 shadowed-text">
        Panorama general de la agricultura en México.
        <br />Explora estadísticas, cultivos y municipios con datos claros y visuales.
      </p>


      {/* Tarjeta destacada */}
      <Card className="bg-[var(--dark-green)] text-white max-w-xl text-center">
        <h3 className="text-xl font-bold mb-4">Tu aliado en el análisis agrícola</h3>
        <p className="text-sm mb-6">
          Descubre tendencias de producción, compara municipios y accede a información clave para la toma de decisiones de manera sencilla y visual.
        </p>
        <Link
          to="/inicio"
          className="inline-block bg-yellow-400 text-black font-bold px-8 py-4 rounded-full shadow-lg hover:bg-yellow-500 transition-colors"
        >
            ¡Comienza a explorar!
        </Link>
      </Card>

      {/* Footer */}
      <div className="mt-9 text-sm text-white/80">
        © 2025 AgroAnalytics · Datos agrícolas de México
      </div>
    </div>
  );
}
