
import { View } from 'react-native' 
import { useTheme, Text } from 'react-native-paper'  
import CampoFechaHora from '../campos/campoFechaHora'
import TimeNoteIcon from '../../iconos/TimeNoteIcon'
import PropTypes from 'prop-types'

export default function FechaStep({control}) {
    const theme = useTheme()
    
    return (
        <View style={{gap:20}}>
            <View style={{alignItems: 'center', marginVertical: -50}}>
                <TimeNoteIcon width={250} height={250} color={theme.colors.primary} />
            </View>
            <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.secondary }}>Fecha y hora</Text>
            <Text variant="titleLarge" style={{textAlign: 'center',color: theme.colors.secondary }}>¿Cuándo ocurrió?</Text>
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10}}>
                <CampoFechaHora
                    label="Fecha y hora del avistamiento"
                    nombre="fechaHora"
                    control={control}
                    placeholder="Seleccione fecha y hora"
                />
            </View> 
        </View>
    )
}

FechaStep.propTypes = {
    control: PropTypes.object.isRequired,
}