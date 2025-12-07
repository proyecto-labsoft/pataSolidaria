import { View } from 'react-native'
import { useTheme, Text } from 'react-native-paper' 
import PropTypes from 'prop-types'

export default function ConfirmacionStep({valores}) {
    
    const theme = useTheme()

    return (
        <View style={{gap:15}}>
            <Text style={{textAlign:'center'}} variant="headlineSmall">Confirmar datos del extravío</Text>
            
            <View style={{padding: 16, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8}}>
                <Text variant="titleMedium" style={{marginBottom: 8, color: theme.colors.primary}}>Ubicación</Text>
                <Text>{valores?.ubicacion || 'No especificada'}</Text>
                {valores?.observacionExtravio && (
                    <Text style={{marginTop: 4}}>Observaciones: {valores?.observacionExtravio}</Text>
                )}
            </View>

            <View style={{padding: 16, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8}}>
                <Text variant="titleMedium" style={{marginBottom: 8, color: theme.colors.primary}}>Datos del animal</Text>
                {valores?.nombre && <Text>Nombre: {valores?.nombre}</Text>}
                <Text>Especie: {valores?.especie || 'No especificada'}</Text>
                <Text>Raza: {valores?.raza || 'No especificada'}</Text>
                <Text>Sexo: {valores?.sexo || 'No especificado'}</Text>
                <Text>Tamaño: {valores?.tamanio || 'No especificado'}</Text>
                <Text>Colores: {valores?.color || 'No especificados'}</Text>
                {valores?.fechaNacimiento && (
                    <Text>Fecha de nacimiento: {valores?.fechaNacimiento}</Text>
                )}
                {valores?.descripcion && (
                    <Text style={{marginTop: 4}}>Descripción: {valores?.descripcion}</Text>
                )}
                <Text style={{marginTop: 4}}>Esterilizado: {valores?.esterilizado ? 'Sí' : 'No'}</Text>
                <Text>Chipeado: {valores?.chipeado ? 'Sí' : 'No'}</Text>
            </View>
        </View>
    )
}

ConfirmacionStep.propTypes = {
    valores: PropTypes.shape({
        ubicacion: PropTypes.string,
        observacionExtravio: PropTypes.string,
        nombre: PropTypes.string,
        especie: PropTypes.string,
        raza: PropTypes.string,
        sexo: PropTypes.string,
        tamanio: PropTypes.string,
        color: PropTypes.string,
        fechaNacimiento: PropTypes.string,
        descripcion: PropTypes.string,
        esterilizado: PropTypes.bool,
        chipeado: PropTypes.bool,
    }),
}
