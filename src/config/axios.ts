import axios from "axios";

const obtions = {
  baseURL: import.meta.env.VITE_BACKEND_URI,
};
const API = axios.create(obtions);

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URI,
//   timeout: 10000, // Tiempo de espera de 10 segundos
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Puedes agregar encabezados personalizados aquí, por ejemplo, un token de autenticación
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Interceptor de respuesta
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Manejo de errores
//     if (error.response) {
//       // El servidor respondió con un estado diferente de 2xx
//       console.error("Error de respuesta:", error.response.data);
//     } else if (error.request) {
//       // La solicitud fue hecha pero no se recibió respuesta
//       console.error("Error de solicitud:", error.request);
//     } else {
//       // Algo pasó al configurar la solicitud
//       console.error("Error:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
