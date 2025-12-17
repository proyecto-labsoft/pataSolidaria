import React, { useState, useEffect} from 'react'
import { View } from 'react-native' 
import { useTheme, Text } from 'react-native-paper'
import { Controller } from 'react-hook-form'
import { Mapa } from '../../mapa'
import CampoTexto from '../campos/campoTexto'  
import LocationIcon from '../../iconos/LocationIcon'
import PropTypes from 'prop-types'
import CampoTextoArea from '../campos/campoTextoArea'

export default function UbicacionStep({control}) {
    const theme = useTheme()
    
    const [ubicacion, setUbicacion] = useState(null);
    const [latitude, setLatitud] =  useState(null);
    const [longitud, setLongitud] =  useState(null);

    // Actualizar ubicación en el formulario cuando cambia
    useEffect(() => {
        setUbicacion(ubicacion);
    }, [ubicacion]);
    
    return (
        <View style={{gap:10}}>
            <View style={{alignItems: 'center', marginVertical: -50 }}>
                <LocationIcon width={250} height={250} color={theme.colors.primary} />
            </View>
            <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.primary }}>¿Dónde fue avistado?</Text> 

            <Mapa 
                localizar 
                latitude={latitude} 
                longitude={longitud} 
                modificarDomicilio={setUbicacion}
                onLatitudChange={setLatitud}
                onLongitudChange={setLongitud}
            />
            <CampoTexto
                valor={ubicacion}
                disabled
                label='Ubicación'
                nombre='ubicacion'
                control={control}
            />
            <CampoTextoArea
                label='Información adicional (opcional)'
                nombre='comentario'
                control={control}
            />

            {/* Campos Hidden para Latitud y Longitud */}
            <Controller
                name="latitud"
                control={control}
                defaultValue={latitude}
                render={({ field: { onChange, value } }) => {
                    // Actualizar el valor del formulario cuando latitude cambia
                    if (latitude !== null && value !== latitude) {
                        onChange(latitude);
                    }
                    return null; // No renderiza nada visualmente
                }}
            />
            
            <Controller
                name="longitud"
                control={control}
                defaultValue={longitud}
                render={({ field: { onChange, value } }) => {
                    // Actualizar el valor del formulario cuando longitud cambia
                    if (longitud !== null && value !== longitud) {
                        onChange(longitud);
                    }
                    return null; // No renderiza nada visualmente
                }}
            />
        </View>
    )
}

UbicacionStep.propTypes = {
    control: PropTypes.object.isRequired
}