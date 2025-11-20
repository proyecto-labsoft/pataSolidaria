/**
 * Calcula el tiempo transcurrido desde una fecha y hora dada
 * @param fechaHora - Fecha y hora en formato "dd-MM-yyyy HH:mm:ss" o "dd-MM-yyyy HH:mm"
 * @returns Tiempo transcurrido en formato legible
 * 
 * @example
 * calcularTiempoTranscurrido("30-10-2025 14:30:00")
 * // Retorna: "hace 5 minutos" | "hace 2 horas 30 minutos" | "Hoy" | "Ayer" | "hace 2 días"
 */
export const calcularTiempoTranscurrido = (fechaHora: string | undefined): string => {
  try {
    // Validar que fechaHora no sea undefined o vacío
    if (!fechaHora || typeof fechaHora !== 'string') {
      return 'Hace poco';
    }

    // Parsear la fecha en formato dd-MM-yyyy HH:mm:ss
    const partes = fechaHora.trim().split(' ');
    
    if (partes.length < 2) {
      return 'Hace poco';
    }

    const fechaParte = partes[0]; // dd-MM-yyyy
    const horaParte = partes[1];  // HH:mm:ss o HH:mm

    const fechaComponentes = fechaParte.split('-');
    const horaComponentes = horaParte.split(':');

    if (fechaComponentes.length < 3 || horaComponentes.length < 2) {
      return 'Hace poco';
    }

    const [dia, mes, anio] = fechaComponentes.map(Number);
    const [horas, minutos] = horaComponentes.map(Number);

    // Validar que los valores sean números válidos
    if (isNaN(dia) || isNaN(mes) || isNaN(anio) || isNaN(horas) || isNaN(minutos)) {
      return 'Hace poco';
    }

    // Crear fecha en UTC
    const fechaEvento = new Date(anio, mes - 1, dia, horas, minutos, 0);
    const ahora = new Date();

    // Calcular diferencia en milisegundos
    const diferenciaMilisegundos = ahora.getTime() - fechaEvento.getTime();
    const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));
    const diferenciaHoras = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60));

    // Si es menos de una hora, retornar minutos
    if (diferenciaMinutos < 60) {
      return `hace ${diferenciaMinutos} ${diferenciaMinutos === 1 ? 'minuto' : 'minutos'}`;
    }

    // Si es menos de 16 horas, retornar horas y minutos
    if (diferenciaHoras < 16) {
      const horasRestantes = diferenciaHoras;
      const minutosRestantes = diferenciaMinutos % 60;

      if (minutosRestantes === 0) {
        return `hace ${horasRestantes} ${horasRestantes === 1 ? 'hora' : 'horas'}`;
      }

      return `hace ${horasRestantes} ${horasRestantes === 1 ? 'hora' : 'horas'} ${minutosRestantes} ${minutosRestantes === 1 ? 'minuto' : 'minutos'}`;
    }

    // Comparar fechas (sin hora)
    const fechaEventoSoloFecha = new Date(anio, mes - 1, dia);
    const ahoraSoloFecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

    const diferenciaEnDias = Math.floor(
      (ahoraSoloFecha.getTime() - fechaEventoSoloFecha.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Si es el mismo día (pero pasaron más de 16 horas)
    if (diferenciaEnDias === 0) {
      return 'Hoy';
    }

    // Si es el día anterior
    if (diferenciaEnDias === 1) {
      return 'Ayer';
    }

    // Si son más días
    return `hace ${diferenciaEnDias} días`;
  } catch (error) {
    console.error('Error al calcular tiempo transcurrido:', error);
    return 'Hace poco';
  }
};
