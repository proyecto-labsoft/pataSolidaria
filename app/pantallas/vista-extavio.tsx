import { View, ScrollView, Dimensions } from 'react-native'
import React, { useState} from 'react'
import {useTheme} from 'react-native-paper'
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';

// Basandose en colores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
const imagenes = ImageSlider[0].imagenes

export default function VistaExtravio({route}: any) {
    
    const theme = useTheme();
    const [datosCaso] = useState(route.params?.data);
    
    const {width} = Dimensions.get('screen')

    return (
        <View style={{height: '100%',width:width,backgroundColor: theme.colors.surface,alignItems:'center'}}>      
        <AppbarNav titulo={datosCaso?.nombre} />

        <ScrollView contentContainerStyle={{marginVertical:12}} > 
            
            <CarruselImagenes data={imagenes} />    
            <View style={{gap: 20,paddingVertical:40,paddingHorizontal:20,alignItems: "center"}} >
                <ItemDato label='Nombre' data={datosCaso?.nombre}  />
                <ItemDato label='Especie' data={datosCaso?.especie}  />
                <ItemDato label='Raza' data={datosCaso?.raza}  />
                <ItemDato label='Tamaño' data={datosCaso?.tamanio}  />
                <ItemDato label='Colores' data={datosCaso?.colores}  />
                <ItemDato label='Fecha de nacimiento' data={datosCaso?.fechanac}  />
                <ItemDato label='Genero' data={datosCaso?.sexo}  />
                <ItemDato label='¿Está esterilizado?' data={datosCaso?.esterilizado}  />
                <ItemDato label='¿Está chipeado?' data={datosCaso?.identificado} />
                <ItemDato label='Domicilio' data={datosCaso?.domicilio}  />
                <ItemDato label='Observaciones' data={datosCaso?.observaciones}  />  
            </View>
        
        </ScrollView>
    </View>
)}