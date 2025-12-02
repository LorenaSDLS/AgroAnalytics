/*  
===============================================================
 INSTRUCCIONES PARA CONECTAR MODALCENTRO AL BACKEND
===============================================================

1. ¿QUÉ ES ESTE MODAL?
   Este modal aparece cuando el usuario da clic en un municipio 
   dentro de la tabla "Top municipios similares" en SearchPage.jsx.

   Su propósito es mostrar un resumen detallado de comparación
   entre el municipio base y otro municipio con similitud alta.

2. ¿QUIÉN LO ABRE?
   - El componente SearchPage.jsx
   - Se activa cuando el usuario da clic en el botón "ver más".
   - SearchPage llama al backend con:
       api.getDetallesComparacion(cvegeo)

3. ¿QUÉ DEBE RESPONDER EL BACKEND?
   El backend debe exponer la ruta (ejemplo):

       GET /detalles_comparacion/<cvegeo>

   Y regresar SIEMPRE un JSON con esta estructura:

   {
      "estado_base": "Zacatecas",
      "estado_similar": "San Luis Potosí",
      "precipitacion": "Muy similar (92%)",
      "temperatura": "Diferencia moderada (63%)",
      "unidad_climatica": "Alta coincidencia (88%)",
      "edafologia": "Coincide (74%)",
      "topoforma": "Muy similar (81%)",
      "total_similitud": 82.4,
      "cultivos_en_comun": [
         "Maíz",
         "Frijol",
         "Avena"
      ]
   }

   ⚠️ IMPORTANTE:
   - DEBE ENVIAR TODOS los campos.
   - Si algún dato no existe, devolver un string vacío (“”)
     o un arreglo vacío según corresponda.

4. ¿CÓMO RECIBE ESTE MODAL LA INFORMACIÓN?
   Desde SearchPage.jsx se hace:

       api.getDetallesComparacion(cvegeo).then((detalles) => {
          setModalData(detalles);
          setModalOpen(true);
       });

   Por eso ES MUY IMPORTANTE que el backend coincida EXACTAMENTE 
   con los nombres de las llaves del JSON.

5. ¿DEBO CAMBIAR ESTE COMPONENTE?
   No. El modal está listo.  
   Únicamente asegúrate de que:
   - Recibe `data` con la estructura del backend.
   - `ModalCentro` se muestra cuando `open = true`.

===============================================================
*/

import React from "react";

export default function ModalCentro({ open, onClose, data }) {
  if (!open || !data) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* MODAL desplazado un poco a la derecha */}
      <div
        className="
          fixed top-1/2 left-[62%] -translate-x-1/2 -translate-y-1/2
          bg-white w-[480px] max-h-[80vh] overflow-y-auto
          rounded-xl shadow-2xl p-6 z-50
          animate-fadeZoom
        "
      >
        {/* BOTÓN DE CIERRE */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 bg-red-500 text-white font-bold text-lg w-8 h-8 rounded-full"
        >
          ✕
        </button>

        {/* TÍTULO centrado */}
        <h2 className="text-xl font-bold text-[var(--azulito)] mb- text-center">
          Detalles de comparación entre {data.estado_base} y {data.estado_similar}
        </h2>

        {/* CUERPO alineado a la derecha */}
        <div className="space-y-2 mb-5 text-sm text-left">
          <p><strong>Precipitación:</strong> {data.precipitacion}</p>
          <p><strong>Temperatura:</strong> {data.temperatura}</p>
          <p><strong>Unidad climática:</strong> {data.unidad_climatica}</p>
          <p><strong>Edafología:</strong> {data.edafologia}</p>
          <p><strong>Topoforma:</strong> {data.topoforma}</p>
        </div>

        {/* TOTAL centrado */}
        <p className="mt-4 font-bold text-green-700 text-4xl text-center">
          Total → {data.total_similitud}%
        </p>

        {/* CULTIVOS centrado */}
        <h3 className="mt-5 text-xl font-bold text-orange-600 text-center">
          Cultivos en común
        </h3>

        <ul className="list-disc mt-2 text-sm inline-block font-bold text-left mx-auto">
          {data.cultivos_en_comun?.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
