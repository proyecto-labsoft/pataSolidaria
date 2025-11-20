
import { View } from 'react-native'
import { useTheme, Text } from 'react-native-paper' 
import PropTypes from 'prop-types'

export default function ConfirmacionStep({valores, ubic}) {
    
    const theme = useTheme()

    console.log("Confirmacion",valores)

    return (
        <View style={{gap:15}}>
            <Text style={{textAlign:'center'}} variant="headlineSmall">Confirmar datos del extravío</Text>
            
            <View style={{padding: 16, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8}}>
                <Text variant="titleMedium" style={{marginBottom: 8, color: theme.colors.primary}}>Ubicación</Text>
                <Text>{valores?.ubicacion || 'No especificada'}</Text>
            </View>

            <View style={{padding: 16, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8}}>
                <Text variant="titleMedium" style={{marginBottom: 8, color: theme.colors.primary}}>Fecha y hora</Text>
                <Text>{`${valores?.fecha} ${valores?.hora}` || 'No especificada'}</Text>
                {valores?.identificacion && (
                    <Text style={{marginTop: 4}}>ID: {valores?.identificacion}</Text>
                )}
            </View>

            <View style={{padding: 16, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8}}>
                <Text variant="titleMedium" style={{marginBottom: 8, color: theme.colors.primary}}>Aspecto</Text>
                <Text>Especie: {valores?.especie || 'No especificada'}</Text>
                <Text>Raza: {valores?.raza || 'No especificada'}</Text>
                <Text>Sexo: {valores?.sexo || 'No especificado'}</Text>
                <Text>Tamaño: {valores?.tamanio || 'No especificado'}</Text>
                <Text>Colores: {valores?.color || 'No especificados'}</Text>
                {valores?.descripcion && (
                    <Text style={{marginTop: 4}}>Descripción: {valores?.descripcion}</Text>
                )}
            </View>
        </View>
    )
}

ConfirmacionStep.propTypes = {
    valores: PropTypes.shape({
        fecha: PropTypes.string,
        hora: PropTypes.string,
        ubicacion: PropTypes.string,
        identificacion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        especie: PropTypes.string,
        raza: PropTypes.string,
        sexo: PropTypes.string,
        tamanio: PropTypes.string,
        color: PropTypes.string,
        descripcion: PropTypes.string,
    }),
    ubic: PropTypes.string,
}

