export const obtenerValorSexo = (valor: string | null): string | null => {
    switch (valor) {
        case 'M':
            return 'Macho';
        case 'H':
            return 'Hembra';
        default:
            return null;
    }
}

export const obtenerValorTamanio = (valor: string | null): string | null => {
    switch (valor) {
        case 'Pequeño':
            return 'PEQUENIO';
        case 'Mediano':
            return 'MEDIANO';
        case 'Grande':
            return 'GRANDE';
        case 'Muy grande':
            return 'GIGANTE';
        default:
            return 'MEDIANO';
    }
}