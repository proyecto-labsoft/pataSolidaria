/**
 * Datos mock para las pantallas principales de la app cuando MOCK_MODE está activo.
 * Cubren: VistaCasos, VistaAdopciones, VistaFamilia.
 */

// ------- EXTRAVÍOS (VistaCasos - tab "Casos") -------
export const mockExtravios = [
  {
    extravioId: 1,
    hora: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // hace 3 hs
    especie: 'Perro',
    resuelto: false,
    creadoByFamiliar: true,
    creadorId: 99,
    mascotaDetalle: {
      id: 10,
      nombre: 'Firulais',
      especie: 'Perro',
      raza: 'Labrador',
      color: 'Amarillo',
      descripcion: 'Muy juguetón, collar rojo',
      esterilizado: true,
      chipeado: false,
      sexo: 'M',
      tamanio: 'GRANDE',
      fechaNacimiento: '2019-05-10',
    },
    latitud: -31.4201,
    longitud: -64.1888,
  },
  {
    extravioId: 2,
    hora: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // hace 10 hs
    especie: 'Gato',
    resuelto: false,
    creadoByFamiliar: false,
    creadorId: 55,
    mascotaDetalle: {
      id: 11,
      nombre: null,
      especie: 'Gato',
      raza: 'Siamés',
      color: 'Blanco y gris',
      descripcion: 'Sin collar, asustadizo',
      esterilizado: false,
      chipeado: null,
      sexo: 'H',
      tamanio: 'PEQUEÑO',
      fechaNacimiento: null,
    },
    latitud: -31.4350,
    longitud: -64.1750,
  },
  {
    extravioId: 3,
    hora: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // hace 26 hs
    especie: 'Perro',
    resuelto: false,
    creadoByFamiliar: true,
    creadorId: 77,
    mascotaDetalle: {
      id: 12,
      nombre: 'Luna',
      especie: 'Perro',
      raza: 'Caniche',
      color: 'Blanco',
      descripcion: 'Tiene una mancha negra en la oreja izquierda',
      esterilizado: true,
      chipeado: true,
      sexo: 'H',
      tamanio: 'PEQUEÑO',
      fechaNacimiento: '2021-03-15',
    },
    latitud: -31.4100,
    longitud: -64.1900,
  },
  {
    extravioId: 4,
    hora: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // hace 2 días
    especie: 'Perro',
    resuelto: false,
    creadoByFamiliar: false,
    creadorId: 44,
    mascotaDetalle: {
      id: 13,
      nombre: null,
      especie: 'Perro',
      raza: 'Mestizo',
      color: 'Marrón',
      descripcion: 'Talla mediana, zona norte',
      esterilizado: null,
      chipeado: null,
      sexo: 'M',
      tamanio: 'MEDIANO',
      fechaNacimiento: null,
    },
    latitud: null,
    longitud: null,
  },
];

// ------- EMERGENCIAS (VistaCasos - tab "Casos") -------
export const mockEmergencias = [
  {
    id: 101,
    usuarioCreador: {
      id: 55,
      nombre: 'María García',
      celular: '3513001234',
      email: 'maria@example.com',
      direccion: 'Av. Colón 1200',
      administrador: false,
    },
    hora: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // hace 30 min
    zona: 'Barrio Alberdi',
    observacion: 'Perro herido en la calle, necesita atención veterinaria urgente',
    latitud: -31.4201,
    longitud: -64.1888,
    atendido: false,
    mascotaDetalle: {
      id: 20,
      nombre: 'Rex',
      especie: 'Perro',
      raza: 'Pastor Alemán',
      color: 'Negro y fuego',
      descripcion: null,
      esterilizado: null,
      chipeado: null,
      sexo: 'M',
      tamanio: 'GRANDE',
      fechaNacimiento: null,
    },
  },
  {
    id: 102,
    usuarioCreador: {
      id: 44,
      nombre: 'Carlos López',
      celular: null,
      email: 'carlos@example.com',
      direccion: null,
      administrador: false,
    },
    hora: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // hace 1.5 hs
    zona: 'Centro',
    observacion: 'Gato atropellado, sigue vivo pero no puede moverse',
    latitud: -31.4100,
    longitud: -64.1800,
    atendido: false,
    mascotaDetalle: {
      id: 21,
      nombre: null,
      especie: 'Gato',
      raza: null,
      color: 'Atigrado',
      descripcion: null,
      esterilizado: null,
      chipeado: null,
      sexo: null,
      tamanio: 'PEQUEÑO',
      fechaNacimiento: null,
    },
  },
];

// ------- FAVORITOS -------
export const mockFavoritos = [
  { extravioId: 1, usuarioId: 99 },
];

// ------- ADOPCIONES (VistaAdopciones) -------
export const mockAdopciones = [
  {
    id: 201,
    adopcionId: 201,
    publicador: {
      id: 30,
      nombre: 'Refugio Patitas Felices',
      celular: '3513009876',
      email: 'refugio@example.com',
      direccion: 'Bv. San Juan 1500',
      administrador: false,
    },
    requisitos: 'Tener espacio en el hogar. Visita domiciliaria previa.',
    transito: false,
    mascotaDetalle: {
      id: 30,
      nombre: 'Copito',
      especie: 'Perro',
      raza: 'Mestizo',
      color: 'Blanco',
      descripcion: 'Muy sociable y cariñoso',
      esterilizado: true,
      chipeado: false,
      sexo: 'M',
      tamanio: 'MEDIANO',
      fechaNacimiento: '2020-07-01',
    },
  },
  {
    id: 202,
    adopcionId: 202,
    publicador: {
      id: 31,
      nombre: 'Ana Pérez',
      celular: '3512345678',
      email: 'ana@example.com',
      direccion: 'Calle Lima 300',
      administrador: false,
    },
    requisitos: 'Familia sin niños menores de 5 años.',
    transito: true,
    mascotaDetalle: {
      id: 31,
      nombre: 'Michi',
      especie: 'Gato',
      raza: 'Común europeo',
      color: 'Naranja',
      descripcion: 'Independiente, pero muy curioso',
      esterilizado: true,
      chipeado: null,
      sexo: 'H',
      tamanio: 'PEQUEÑO',
      fechaNacimiento: '2022-01-20',
    },
  },
  {
    id: 203,
    adopcionId: 203,
    publicador: {
      id: 30,
      nombre: 'Refugio Patitas Felices',
      celular: '3513009876',
      email: 'refugio@example.com',
      direccion: 'Bv. San Juan 1500',
      administrador: false,
    },
    requisitos: 'Patio o espacio amplio. Experiencia con perros grandes.',
    transito: false,
    mascotaDetalle: {
      id: 32,
      nombre: 'Bruno',
      especie: 'Perro',
      raza: 'Dóberman',
      color: 'Negro y fuego',
      descripcion: 'Buen guardián, necesita adiestramiento',
      esterilizado: false,
      chipeado: true,
      sexo: 'M',
      tamanio: 'GRANDE',
      fechaNacimiento: '2021-11-05',
    },
  },
  {
    id: 204,
    adopcionId: 204,
    publicador: {
      id: 32,
      nombre: 'Lucas Gómez',
      celular: null,
      email: 'lucas@example.com',
      direccion: null,
      administrador: false,
    },
    requisitos: 'Ninguno, solo mucho amor.',
    transito: true,
    mascotaDetalle: {
      id: 33,
      nombre: 'Pelusa',
      especie: 'Gato',
      raza: 'Angora',
      color: 'Gris claro',
      descripcion: 'Muy tranquila y cariñosa',
      esterilizado: true,
      chipeado: null,
      sexo: 'H',
      tamanio: 'PEQUEÑO',
      fechaNacimiento: '2023-03-10',
    },
  },
];

// ------- MASCOTAS DEL USUARIO (VistaFamilia) -------
export const mockMascotas = [
  {
    id: 1,
    nombre: 'Max',
    especie: 'Perro',
    raza: 'Beagle',
    color: 'Tricolor',
    descripcion: 'Le encanta correr',
    esterilizado: true,
    chipeado: false,
    sexo: 'M',
    tamanio: 'MEDIANO',
    fechaNacimiento: '2018-06-20',
    imagenes: [],
  },
  {
    id: 2,
    nombre: 'Nala',
    especie: 'Gato',
    raza: 'Persa',
    color: 'Crema',
    descripcion: 'Muy dormilona',
    esterilizado: true,
    chipeado: null,
    sexo: 'H',
    tamanio: 'PEQUEÑO',
    fechaNacimiento: '2020-09-14',
    imagenes: [],
  },
];

// ------- EXTRAVÍOS DEL USUARIO (VistaFamilia - para saber si hay mascotas extraviadas) -------
export const mockExtraviosPorUsuario = [
  // Sin extravíos activos para el usuario mock
];

// ------- Mapa nombreHook → datos mock -------
const mockDataMap = {
  useApiGetExtravios: mockExtravios,
  useApiGetEmergencias: mockEmergencias,
  useApiGetFavoritos: mockFavoritos,
  useApiGetAdopciones: mockAdopciones,
  useApiGetMascotasPorUsuario: mockMascotas,
  useApiGetExtraviosPorUsuario: mockExtraviosPorUsuario,
  useApiGetImagenesMascota: [],
  // Agrega más hooks aquí si se necesita
};

/**
 * Retorna datos mock para el hook indicado, o un array vacío si no está mapeado.
 * @param {string} nombreHook
 * @returns {any}
 */
export function getMockData(nombreHook) {
  if (nombreHook in mockDataMap) {
    return mockDataMap[nombreHook];
  }
  console.warn(`[MOCK] No hay datos mock para el hook: "${nombreHook}". Devolviendo [].`);
  return [];
}
