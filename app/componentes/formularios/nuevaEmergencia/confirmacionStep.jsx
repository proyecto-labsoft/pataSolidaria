
import { View } from 'react-native'
import { useTheme, Text, Card } from 'react-native-paper' 
import PropTypes from 'prop-types'
import DescripcionVista from '../../descripcionVista'

export default function ConfirmacionStep({valores, ubic}) {
    
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
            </Card> 


            {valores?.descripcion && ( 
                <>
                    <DescripcionVista 
                        texto="Descripción adicional" 
                        tamanioTexto="titleLarge" 
                    />
                    <Card style={{ gap: 10, backgroundColor: theme.colors.surfaceVariant, padding: 15, borderRadius: 10, marginHorizontal: 10 }}>
                        
                        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            {valores?.descripcion}
                        </Text>
                        
                    </Card>
                </>
            )} 
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

