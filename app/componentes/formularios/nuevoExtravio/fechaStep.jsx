
import { View } from 'react-native' 
import { useTheme, Text } from 'react-native-paper'  
import TimeNoteIcon from '../../iconos/TimeNoteIcon'
import PropTypes from 'prop-types'
import CampoHora from '../campos/campoHora'
import CampoFecha from '../campos/campoFecha'

export default function FechaStep({control}) {
    const theme = useTheme()

    return (
        <View style={{gap:20}}>
            <View style={{alignItems: 'center', marginVertical: -50}}>
                <TimeNoteIcon width={250} height={250} color={theme.colors.primary} />
            </View>
            <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.primary }}>Fecha y hora</Text>
            <Text variant="titleLarge" style={{textAlign: 'center',color: theme.colors.primary }}>¿Cuándo ocurrió?</Text>
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10}}>
                <CampoFecha
                    label="Fecha"
                    nombre="fecha"
                    control={control}
                    placeholder="Seleccione fecha y hora"
                />
                <CampoHora
                    control={control}
                    label="Hora"
                    nombre="hora"
                />
            </View> 
        </View>
    )
}

FechaStep.propTypes = {
    control: PropTypes.object.isRequired,
}