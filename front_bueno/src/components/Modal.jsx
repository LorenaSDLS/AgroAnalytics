/*  
===============================================================
 INSTRUCCIONES PARA CONECTAR MODAL.jsx AL BACKEND
===============================================================

1. ¿QUÉ ES ESTE MODAL?
   Este modal se usa para mostrar imágenes ampliadas cuando el
   usuario da clic sobre una gráfica generada por el backend.

2. ¿QUIÉN LO ABRE?
   Cualquier página (Infocultivo, SearchPage, Cultivos, etc.)
   que tenga una imagen generada por Flask, por ejemplo:

      http://127.0.0.1:5000/grafica_historial_sequia

3. ¿QUÉ DEBE RESPONDER EL BACKEND?
   El backend simplemente debe servir imágenes PNG o JPG desde
   rutas tipo:

      /grafica_historial_agricola
      /grafica_municipios_similares
      /grafica_principales_cultivos

   Ejemplo de endpoint Flask:

      @app.route("/grafica_historial_sequia")
      def grafica_sequia():
          fig = generar_grafica()
          output = io.BytesIO()
          fig.savefig(output, format="png")
          output.seek(0)
          return Response(output.getvalue(), mimetype="image/png")

4. ¿CÓMO FUNCIONA ESTE MODAL?
   - El componente padre debe llamar:
         setModalOpen(true)
         setModalImage(url)
   - Este modal NO llama al backend.
   - Solo muestra la imagen que YA viene desde el padre.

5. REQUISITOS:
   - Asegúrate de que tus URLs del backend nunca regresen HTML.
   - Solo deben regresar contenido tipo `image/png`.

===============================================================
*/

import React from "react";

export default function Modal({ open, onClose, imageUrl }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      {/* Botón de cierre flotante */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 bg-red-600 text-white text-2xl font-bold w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-red-500 transition"
      >
        ✕
      </button>

      {/* Contenedor del modal */}
      <div className="bg-white p-6 rounded-2xl shadow-2xl relative max-w-4xl w-full transform transition-all scale-100">
        <img
          src={imageUrl}
          className="w-full h-auto rounded-lg shadow-lg"
          alt="Vista ampliada"
        />
      </div>
    </div>
  );
}
