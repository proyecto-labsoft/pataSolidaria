/**
 * Rutas para el módulo de AUTORIZACION.
 *
 * Contiene todos los endpoints para la gestión de módulos, procesos, roles,
 * tareas, trámites y usuarios.
 *
 * @constant
 * @type {Object}
 */

/**
 * URL base de la API - Exportada para uso en otros módulos
 * @constant
 * @type {string}
 */

import URL_API from './urlApi';

export const API_URL = URL_API;

/**
 * Endpoints específicos de la API
 * @constant
 * @type {Object}
 */
export const API_ENDPOINTS = {
  usuarios: `${URL_API}/usuarios`,
  mascotas: `${URL_API}/mascotas`,
  extravios: `${URL_API}/extravios`,
  adopciones: `${URL_API}/adopciones`,
  avistamientos: `${URL_API}/avistamientos`,
  postulaciones: `${URL_API}/postulaciones`,
  pushToken: `${URL_API}/usuarios/push-token`,
  syncUser: `${URL_API}/usuarios/sync`,
  userProfile: `${URL_API}/usuarios/perfil`,
  notifications: `${URL_API}/notifications`,
};

export const rutas = {
  extravios: `${URL_API}/extravios`, // Query Params: resueltos=${resueltos}
  extravioFamiliar: `${URL_API}/extravios`,
  extravioSinFamiliar: `${URL_API}/extravios/sin-familiar`,
  extraviosPorUsuario: `${URL_API}/extravios/user/{id}`, // GET
  extraviosPorMascota: `${URL_API}/extravios/mascota/{id}`, // GET
  extravioPorId: `${URL_API}/extravios/{id}`, // GET, PUT, DELETE
  
  extravioFavoritoPorUsuario: `${URL_API}/extravios/favoritos`, 
  extraviosFavoritosPorUsuario: `${URL_API}/extravios/favoritos/user/{id}`, 
  extravioEsFavorito: `${URL_API}/extravios/es-favorito`, 
  eliminarExtravioFavorito: `${URL_API}/extravios/favoritos/{id}`, 

  mascotaPorId: `${URL_API}/mascotas/{id}`, // GET, PUT, DELETE
  registrarMascota: `${URL_API}/mascotas`, // POST
  mascotasPorUsuario: `${URL_API}/mascotas/user/{idUsuario}`, // GET

  imagenesMascota: `${URL_API}/imagenes/mascota/{mascotaId}`, // GET
  
  crearUsuario: `${URL_API}/usuarios`, // POST 
  usuarioPorId: `${URL_API}/usuarios/{id}`, // GET, PUT, DELETE

  listarAdopciones: `${URL_API}/adopciones`,
  crearAdopcion: `${URL_API}/adopciones`,

  listarPostulaciones: `${URL_API}/postulaciones`,
  crearPostulacion: `${URL_API}/postulaciones`,

  avistamientos: `${URL_API}/avistamientos`, 
  avistamientosPorExtravio: `${URL_API}/avistamientos/extravio/{id}`, 
  
  emergencias: `${URL_API}/emergencias`, 
  emergenciaPorId: `${URL_API}/emergencias/{id}`, 

  posibleTutor: `${URL_API}/posible-tutor`, 
  posiblesTutoresPorExtravio: `${URL_API}/posible-tutor/extravio/{extravioId}`, 
  // novedadesPorLicenciaCumplidas: `${URL_API}/novedades/{tipo}/{agencia}/{nroLicencia}?cumplidas=true`,
  // novedadesPorLicenciaNoCumplidas: `${URL_API}/novedades/{tipo}/{agencia}/{nroLicencia}?cumplidas=false`,
  // reporteNovedades: `${URL_API}/novedades/reporte`, // Query Params: desde={desde}, hasta={hasta} , tipo=${tipo} y licencia=${licencia}
  // reporteEmplazamientos: `${URL_API}/novedades/reporte?desde={desde}&hasta={hasta}&tipoNovedad=E`, // Query Params: tipo=${tipo} y licencia=${licencia}
  // reporteFueraServicio: `${URL_API}/novedades/reporte?desde={desde}&hasta={hasta}&tipoNovedad=F`, // Query Params: tipo=${tipo} y licencia=${licencia}
  
}   