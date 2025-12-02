import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Inicio from './pages/Inicio';
import SearchPage from './pages/SearchPage';
import Cultivos from './pages/Cultivos';
import Bienvenida from './pages/Bienvenida';
import Infocultivo from './pages/Infocultivo';


export default function App(){
  return (
  <div className="min-h-screen flex">
    <Sidebar />
      <div className="flex-1">
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Bienvenida />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cultivos" element={<Cultivos />} />
            <Route path="/infocultivo" element={<Infocultivo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div> 
  );
};
