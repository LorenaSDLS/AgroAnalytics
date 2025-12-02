import axios from 'axios'; 
import mockData from '../mocks/mockData.json'; 
import mockSimilar from '../mocks/mockSimilar.json';

//CONFIGURACIÓN

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'; 

/** Axios instance configurable y listo para producción */
const http = axios.create({
  baseURL: API_BASE,
  timeout: 4000,
});

// Función auxiliar para manejar fallos del backend
async function safeGet(url, fallbackKey){ 
    try{ 
        const res = await axios.get(`${API_BASE}${url}`, { timeout: 4000 }); 
        return res.data; 
    } catch(err){ 
        console.warn(`[API] Backend falló en ${url}, returning mock for:`, url, err.message); // decide qué mock devolver según endpoint 
        if(url.includes('/top_similares')) 
            return mockData.top_similares; 
        if(url.includes('/estadisticas')) 
            return mockData.estadisticas; 
        if(url.includes('/municipios')) 
            return mockData.municipios; 
        if(url.includes('/produccion_anual')) 
            return mockData.produccion_anual; // fallback general 
        if(url.includes('/sequia')) 
            return mockData.sequia; // fallback general 
        return mockData[fallbackKey]; 
    } 
} 

//api principal exportado
export const api = {
    getEstadisticasGenerales: async () => ({
        total_produccion: 12013,
        cultivos_analizados: 120,
        anios: 11,
    }),

      // INFO COMPLETA DEL MUNICIPIO SELECCIONADO
      // GET /municipio/{cvegeo}/similar
      getSimilarMunicipio: async (cvegeo) => {
        // Aquí normalmente sería:
        // return safeGet(`/municipio/${cvegeo}/similar`, "similar");

    return {
      municipios_mas_similares: [
        { cvegeo: "0009", estado: "Estado X", municipio: "Mun X", similitud: 89 },
        { cvegeo: "0010", estado: "Estado Y", municipio: "Mun Y", similitud: 85 },
      ],
      cultivos_similares: ["Maíz", "Trigo", "Sorgo"],
      cultivos_potenciales: [
        { cultivo: "Maíz", puntaje: 90, indice: "Muy Alto" },
        { cultivo: "Avena", puntaje: 96, indice: "Muy Alto" },
        { cultivo: "Fresa", puntaje: 80, indice: "Alto" },
        { cultivo: "Fresa", puntaje: 80, indice: "Alto" },
        { cultivo: "Fresa", puntaje: 80, indice: "Alto" },

      ],
      perfil_municipio: {
        estado: "Estado Prueba",
        municipio: "Municipio Prueba",
      },
      todos_los_cultivos: ["Maíz", "Avena", "Cebada", "Frijol", "Sorgo"],
    };
  },

// ESTADOS Y MUNICIPIOS
    getMunicipios: async () =>  {
    return [
      { nombre_ent: "Estado 1", cvegeo: "0001", nomgeo: "Municipio A" },
      { nombre_ent: "Estado 1", cvegeo: "0002", nomgeo: "Municipio B" },
      { nombre_ent: "Estado 2", cvegeo: "0003", nomgeo: "Municipio C" },
    ];
  },

    // PRODUCCIÓN ANUAL
    // GET /municipio/{cvegeo}/produccion_anual
    getProduccionAnual: async () => [
        { anio: 2014, produccion: 7500 },
        { anio: 2015, produccion: 7800 },
        { anio: 2016, produccion: 7100 },
        { anio: 2017, produccion: 7600 },
        { anio: 2020, produccion: 3200 },
        { anio: 2021, produccion: 8000 },
        { anio: 2024, produccion: 7900 },
    ],

    // HISTORIAL DE SEQUÍA
    // GET /municipio/{cvegeo}/sequía
    getHistorialSequia: async (cvegeo) => {
        return [
        { anio: 2014, valor: 2 },
        { anio: 2015, valor: 3 },
        { anio: 2016, valor: 5 },
        { anio: 2017, valor: 1 },
        { anio: 2018, valor: 4 },
        { anio: 2019, valor: 3 },
        { anio: 2020, valor: 6 },
        { anio: 2021, valor: 2 },
        { anio: 2022, valor: 5 },
        ];
    },

    // CULTIVOS (para la lista completa)
    getCultivos: async () => [
        { id: 'A001', nombre: 'Ajo' },
        { id: 'A002', nombre: 'Aguacate' },
        { id: 'A003', nombre: 'Albahaca' },
        { id: 'A004', nombre: 'Alfalfa' },
        { id: 'A005', nombre: 'Algodón hueso' },
        { id: 'A006', nombre: 'Amaranto' },
        { id: 'A007', nombre: 'Anís' },
        { id: 'A008', nombre: 'Apio' },
        { id: 'A009', nombre: 'Arándano' },
        { id: 'A010', nombre: 'Arroz palay' },
        { id: 'A011', nombre: 'Avena forrajera en verde' },
        { id: 'A012', nombre: 'Avena grano' },
        { id: 'B001', nombre: 'Betabel' },
        { id: 'B002', nombre: 'Brócoli' },
        { id: 'C001', nombre: 'Calabacita' },
        { id: 'C002', nombre: 'Calabaza' },
        { id: 'C003', nombre: 'Caña de azúcar' },
        { id: 'C004', nombre: 'Cártamo' },
        { id: 'C005', nombre: 'Cebada grano' },
        { id: 'C006', nombre: 'Cebolla' },
        { id: 'C007', nombre: 'Chabacano' },
        { id: 'C008', nombre: 'Chayote' },
        { id: 'C009', nombre: 'Chía' },
        { id: 'C010', nombre: 'Chile verde' },
        { id: 'C011', nombre: 'Ciruela' },
        { id: 'C012', nombre: 'Col de Bruselas' },
        { id: 'C013', nombre: 'Coliflor' },
        { id: 'D001', nombre: 'Dalia' },
        { id: 'D002', nombre: 'Durazno' },
        { id: 'E001', nombre: 'Ejote' },
        { id: 'E002', nombre: 'Elote' },
        { id: 'E003', nombre: 'Epazote' },
        { id: 'E004', nombre: 'Esparrago' },
        { id: 'E005', nombre: 'Espinaca' },
        { id: 'F001', nombre: 'Frambuesa' },
        { id: 'F002', nombre: 'Frijol' },
        { id: 'G001', nombre: 'Garbanzo grano' },
        { id: 'G002', nombre: 'Girasol' },
        { id: 'G003', nombre: 'Granada' },
        { id: 'G004', nombre: 'Guayaba' },
        { id: 'H001', nombre: 'Haba grano' },
        { id: 'H002', nombre: 'Haba verde' },
        { id: 'H003', nombre: 'Hierbabuena' },
        { id: 'H004', nombre: 'Higo' },
        { id: 'J001', nombre: 'Jitomate' },
        { id: 'J002', nombre: 'Jicama' },
        { id: 'L001', nombre: 'Lenteja' },
        { id: 'L002', nombre: 'Limón' },
        { id: 'L003', nombre: 'Lima' },
        { id: 'M001', nombre: 'Maíz grano' },
        { id: 'M002', nombre: 'Mamey' },
        { id: 'M003', nombre: 'Mango' },
        { id: 'M004', nombre: 'Manzana' },
        { id: 'M005', nombre: 'Mandarina' },
        { id: 'N001', nombre: 'Naranja' },
        { id: 'N002', nombre: 'Nopal forrajero' },
        { id: 'P001', nombre: 'Papa' },
        { id: 'P002', nombre: 'Pepino' },
        { id: 'Q001', nombre: 'Quelite' },
        { id: 'Q002', nombre: 'Quinoa' },
        { id: 'S001', nombre: 'Sandía' },
        { id: 'S002', nombre: 'Sorgo grano' },
        { id: 'T001', nombre: 'Tomate verde' },
        { id: 'T002', nombre: 'Trigo grano' },
        { id: 'U001', nombre: 'Uva' },
        { id: 'Y001', nombre: 'yu_choy' },
        { id: 'Z001', nombre: 'Zarzamora' },
        { id: 'Z002', nombre: 'Zapote' },
    ],
    getMunicipiosProductores: async (cultivoId) => {
        switch (cultivoId) {
        case 'A001': // Ajo
            return [
            { cvegeo: 'CL101', nombre: 'Zacatecas', produccion_ton: 50 },
            { cvegeo: 'CL102', nombre: 'Durango', produccion_ton: 30 },
            ];
        case 'A002': // Aguacate
            return [
            { cvegeo: 'CL201', nombre: 'Uruapan', produccion_ton: 120 },
            { cvegeo: 'CL202', nombre: 'Tancítaro', produccion_ton: 95 },
            ];
        case 'A003': // Albahaca
            return [
            { cvegeo: 'CL301', nombre: 'Morelia', produccion_ton: 15 },
            { cvegeo: 'CL302', nombre: 'Pátzcuaro', produccion_ton: 10 },
            ];
        case 'M001': // Maíz grano
            return [
            { cvegeo: 'CL401', nombre: 'Sinaloa', produccion_ton: 500 },
            { cvegeo: 'CL402', nombre: 'Jalisco', produccion_ton: 450 },
            ];
        case 'Q002': // Quinoa
            return [
            { cvegeo: 'CL501', nombre: 'Rincón de Romos', produccion_ton: 11 },
            { cvegeo: 'CL502', nombre: 'Aguascalientes', produccion_ton: 9 },
            ];
        default:
            return [];
        }
    },
    getMunicipiosMenorProduccion: async (cultivoId) => {
        switch (cultivoId) {
        case 'A001': // Ajo
            return [
            { cvegeo: 'CL007', nombre: 'Rincón de Romos', produccion_ton: 10.0 },
            ];
        case 'A002': // Aguacate
            return [
            { cvegeo: 'CL008', nombre: 'Aguascalientes', produccion_ton: 9.0 },
            ];
        case 'A003': // Albahaca
            return [
            { cvegeo: 'CL009', nombre: 'Zacatecas', produccion_ton: 8.0 },
            ];
        default:
            return [];
        }
    },
    // TOP 10 PRODUCTORES NACIONAL
    getTop10Productores: async () => {
        // 🟢 loader suave
        await new Promise(res => setTimeout(res, 900));

        // 🟢 respuesta simulada REALISTA, igual a como debe responder el backend
        return [
            { estado: "Jalisco", cultivo: "Maíz grano", produccion_ton: 885000 },
            { estado: "Sinaloa", cultivo: "Maíz grano", produccion_ton: 740000 },
            { estado: "Veracruz", cultivo: "Naranja", produccion_ton: 510000 },
            { estado: "Chihuahua", cultivo: "Alfalfa", produccion_ton: 300000 },
            { estado: "Michoacán", cultivo: "Aguacate", produccion_ton: 285000 },
            { estado: "Oaxaca", cultivo: "Café", produccion_ton: 202000 },
            { estado: "Puebla", cultivo: "Caña de azúcar", produccion_ton: 190000 },
            { estado: "Sonora", cultivo: "Trigo", produccion_ton: 170000 },
            { estado: "Yucatán", cultivo: "Limón", produccion_ton: 145000 },
            { estado: "Guanajuato", cultivo: "Brócoli", produccion_ton: 110000 },
        ];
    },

  // PARA EL MODAL DE “VER MÁS”
  // GET /municipio/{cvegeo}/comparacion
    getDetallesComparacion: async (cvegeo) => {
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve({
                estado_base: "Sonora",
                estado_similar: "Baja California",
                precipitacion: "430 mm",
                temperatura: "23°C",
                unidad_climatica: "BS1(h')",
                edafologia: "Regosol / Litosol",
                topoforma: "Lomerío suave",
                total_similitud: 89,
                cultivos_en_comun: ["Maíz", "Trigo", "Nopal", "Cártamo"],
            });
        }, 600);
  });
}


};




//ESTE ES EL BUENO SEGÚN CHAT
// import axios from "axios";
// import mockData from "../mocks/mockData.json";
// import mockSimilar from "../mocks/mockSimilar.json";

// /* ============================================
//    CONFIGURACIÓN
// ============================================ */
// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// /** Axios instance configurable y listo para producción */
// const http = axios.create({
//   baseURL: API_BASE,
//   timeout: 4000,
// });

// /* ============================================
//    FUNCIÓN PRINCIPAL DE BACKUP
// ============================================ */
// /**
//  * Ejecuta una petición GET y si falla, devuelve un mock.
//  * @param {string} url - Endpoint (ej: "/municipios")
//  * @param {string} fallbackKey - Clave dentro de mockData
//  */
// async function safeGet(url, fallbackKey) {
//   try {
//     const res = await http.get(url);
//     return res.data;
//   } catch (err) {
//     console.warn(
//       `[API] Error en ${url}, devolviendo mock → ${fallbackKey}`,
//       err.message
//     );

//     // Mocks especializados
//     if (url.includes("/similar")) return mockSimilar;

//     // Mocks generales
//     return mockData[fallbackKey];
//   }
// }

// /* ============================================
//    API PRINCIPAL
// ============================================ */
// export const api = {
//   /* --------------------------------------------
//       ESTADÍSTICAS GENERALES
//   -------------------------------------------- */
//   getEstadisticasGenerales: async () =>
//     safeGet("/estadisticas", "estadisticas"),

//   /* --------------------------------------------
//       MUNICIPIO SIMILAR
//       GET /municipio/{cvegeo}/similar
//   -------------------------------------------- */
//   getSimilarMunicipio: async (cvegeo) =>
//     safeGet(`/municipio/${cvegeo}/similar`, "similar"),

//   /* --------------------------------------------
//       ESTADOS Y MUNICIPIOS
//       GET /municipios
//   -------------------------------------------- */
//   getMunicipios: async () => safeGet("/municipios", "municipios"),

//   /* --------------------------------------------
//       PRODUCCIÓN ANUAL
//       GET /municipio/{cvegeo}/produccion_anual
//   -------------------------------------------- */
//   getProduccionAnual: async (cvegeo) =>
//     safeGet(`/municipio/${cvegeo}/produccion_anual`, "produccion_anual"),

//   /* --------------------------------------------
//       HISTORIAL DE SEQUÍA
//       GET /municipio/{cvegeo}/sequia
//   -------------------------------------------- */
//   getHistorialSequia: async (cvegeo) =>
//     safeGet(`/municipio/${cvegeo}/sequia`, "sequia"),

//   /* --------------------------------------------
//       LISTA COMPLETA DE CULTIVOS
//       GET /cultivos
//   -------------------------------------------- */
//   getCultivos: async () => safeGet("/cultivos", "cultivos"),

//   /* --------------------------------------------
//       MUNICIPIOS PRODUCTORES DE UN CULTIVO
//       GET /cultivos/{id}/municipios
//   -------------------------------------------- */
//   getMunicipiosProductores: async (cultivoId) =>
//     safeGet(`/cultivos/${cultivoId}/municipios`, "productores"),

//   /* --------------------------------------------
//       MUNICIPIOS MENOR PRODUCCIÓN
//       GET /cultivos/{id}/menor_produccion
//   -------------------------------------------- */
//   getMunicipiosMenorProduccion: async (cultivoId) =>
//     safeGet(`/cultivos/${cultivoId}/menor_produccion`, "menor_produccion"),

//   /* --------------------------------------------
//       TOP 10 PRODUCTORES NACIONAL
//       GET /top10_productores
//   -------------------------------------------- */
//   getTop10Productores: async () => {
//     await new Promise((res) => setTimeout(res, 900)); // loader suave
//     return safeGet("/top10_productores", "top10_productores");
//   },

//   /* --------------------------------------------
//       MODAL “VER MÁS”
//       GET /municipio/{cvegeo}/comparacion
//   -------------------------------------------- */
//   getDetallesComparacion: async (cvegeo) =>
//     safeGet(`/municipio/${cvegeo}/comparacion`, "comparacion"),
// };



// ⭐ 2. Cada endpoint ya está conectado a la estructura real

// Cuando esté listo tu backend, solo remplaza:

// getMunicipios: async () => safeGet("/municipios", "municipios")


// Y todo funcionará automáticamente.