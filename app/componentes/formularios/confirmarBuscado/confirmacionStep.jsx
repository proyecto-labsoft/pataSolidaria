import { View } from 'react-native'
import { useTheme, Text, Card } from 'react-native-paper' 
import PropTypes from 'prop-types'
import DescripcionVista from '../../descripcionVista'

export default function ConfirmacionStep({valores}) {
    
    const theme = useTheme()

    return (
        <View style={{gap:15}}>
            <DescripcionVista style={{textAlign:'center'}} tamanioTexto="headlineSmall" texto="Confirmar datos" />
            
            <Card style={{ gap: 10, backgroundColor: theme.colors.surfaceVariant, padding: 15, marginHorizontal: 10,borderRadius: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Ubicación:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.ubicacion || 'No especificada'}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Fecha y hora:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.fecha && valores?.hora ? `${valores.fecha} ${valores.hora}` : 'No especificada'}</Text>
                </View>
                
            </Card>

            <DescripcionVista texto="Aspecto del animal" tamanioTexto="titleLarge" />
            <Card style={{ gap: 10, backgroundColor: theme.colors.surfaceVariant, padding: 15, marginHorizontal: 10,borderRadius: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Nombre:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.nombre || 'No especificada'}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Especie:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.especie || 'No especificada'}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Raza:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.raza || 'No especificada'}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Sexo:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.sexo || 'No especificado'}</Text>
                </View>
                            
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Tamaño:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.tamanio || 'No especificado'}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Colores:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.color || 'No especificados'}</Text>
                </View>

                {valores?.fechaNacimiento && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Fecha de nacimiento:</Text>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.fechaNacimiento}</Text>
                    </View>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Esterilizado:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.esterilizado ? 'Sí' : 'No'}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Chipeado:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.chipeado ? 'Sí' : 'No'}</Text>
                </View> 
                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Descripción adicional:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{valores?.descripcion}</Text>
                </View> 
            </Card> 


            {valores?.observacionExtravio && ( 
                <>
                    <DescripcionVista 
                        texto="Observaciones del extravío" 
                        tamanioTexto="titleLarge" 
                    />
                    <Card style={{ gap: 10, backgroundColor: theme.colors.surfaceVariant, padding: 15, borderRadius: 10, marginHorizontal: 10 }}>
                        
                        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            {valores?.observacionExtravio}
                        </Text>
                        
                    </Card>
                </>
            )} 
            {/* <Text style={{textAlign:'center'}} variant="headlineSmall">Confirmar datos del extravío</Text>
            
            <View style={{padding: 16, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8}}>
                <Text variant="titleMedium" style={{marginBottom: 8, color: theme.colors.primary}}>Ubicación</Text>
                <Text>{valores?.ubicacion || 'No especificada'}</Text>
                {valores?.observacionExtravio && (
                    <Text style={{marginTop: 4}}>Observaciones: {valores?.observacionExtravio}</Text>
                )}
            </View> */}

            {/* <View style={{padding: 16, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8}}>
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
            </View> */}
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
