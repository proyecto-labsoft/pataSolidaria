import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE_BUENOS_AIRES = 'America/Argentina/Buenos_Aires';

/**
 * Obtiene la fecha y hora actual en la zona horaria de Buenos Aires
 */
export const obtenerFechaHoraActualBuenosAires = (): Date => {
    const now = new Date();
    return toZonedTime(now, TIMEZONE_BUENOS_AIRES);
};

/**
 * Formatea una fecha en el formato dd-MM-yyyy para Buenos Aires
 */
export const formatearFechaBuenosAires = (date?: Date): string => {
    const fechaBsAs = date ? toZonedTime(date, TIMEZONE_BUENOS_AIRES) : obtenerFechaHoraActualBuenosAires();
    return format(fechaBsAs, 'dd-MM-yyyy');
};

/**
 * Formatea una hora en el formato HH:mm para Buenos Aires
 */
export const formatearHoraBuenosAires = (date?: Date): string => {
    const fechaBsAs = date ? toZonedTime(date, TIMEZONE_BUENOS_AIRES) : obtenerFechaHoraActualBuenosAires();
    return format(fechaBsAs, 'HH:mm');
};

/**
 * Formatea una fecha y hora completa en el formato dd-MM-yyyy HH:mm:ss para Buenos Aires
 */
export const formatearFechaHoraCompletaBuenosAires = (date?: Date): string => {
    const fechaBsAs = date ? toZonedTime(date, TIMEZONE_BUENOS_AIRES) : obtenerFechaHoraActualBuenosAires();
    return format(fechaBsAs, 'dd-MM-yyyy HH:mm:ss');
};
