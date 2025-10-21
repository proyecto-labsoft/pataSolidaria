
import { View } from 'react-native' 
import { useTheme, Text } from 'react-native-paper'
import { Mapa } from '../../mapa'
import CampoTexto from '../campos/campoTexto'  
import LocationIcon from '../../iconos/LocationIcon'
import PropTypes from 'prop-types'

export default function UbicacionStep({control, ubic, setUbic}) {
    const theme = useTheme()
    
    return (
        <View style={{gap:10}}>
            <View style={{alignItems: 'center', marginVertical: -50 }}>
                <LocationIcon width={250} height={250} color={theme.colors.primary} />
            </View>
            <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.secondary }}>Ubicación</Text>
            <Text variant="titleLarge" style={{textAlign: 'center',color: theme.colors.secondary }}>¿Por dónde se extravió?</Text>

            <Mapa localizar latitude={null} longitude={null} modificarDomicilio={setUbic} />
            <CampoTexto
                valor={ubic}
                label='Ubicación'
                nombre='ubicacion'
                control={control}
            />
        </View>
    )
}

UbicacionStep.propTypes = {
    control: PropTypes.object.isRequired,
    ubic: PropTypes.string.isRequired,
    setUbic: PropTypes.func.isRequired,
}