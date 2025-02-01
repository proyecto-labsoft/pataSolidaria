import { View, ScrollView, Dimensions } from 'react-native'
import React, { useState} from 'react'
import {Button, Icon, Text, useTheme} from 'react-native-paper'
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';
import { useNavigation } from "@react-navigation/native";

// Basandose en colores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
const imagenes = ImageSlider[0].imagenes

export default function VistaExtravio({route}: any) {
    
    const theme = useTheme();
    const [datosCaso] = useState(route.params?.data);
    const navigation = useNavigation()
    const {width} = Dimensions.get('screen')
    
    return (
        <View style={{height: '100%',width:width,alignItems:'center'}}>      
            <AppbarNav titulo={datosCaso?.nombre} />

            <ScrollView contentContainerStyle={{margin:12}} > 
                
                <CarruselImagenes data={imagenes} />        
                <View style={{gap: 20,paddingVertical:40,paddingHorizontal:20,alignItems: "center"}} >
                    <View style={{ flexDirection:'row', justifyContent:'space-between', width: '100%'}}>
                        <View style={{ flexDirection:'row', justifyContent:'flex-start',alignItems:'center',gap:8}}>
                            <Icon
                                source="clock-time-eight-outline"
                                color={theme.colors.onSurface}
                                size={20}
                            />
                            <Text variant='titleMedium' style={{color: theme.colors.onSurface}}>Hace 2 horas</Text>
                        </View>
                        <View style={{ flexDirection:'row', justifyContent:'flex-start',alignItems:'center',gap:8}}>
                            <Icon
                                source="map-marker"
                                color={theme.colors.onSurface}
                                size={20}
                            />
                            <Text variant='titleMedium' style={{color: theme.colors.onSurface}}>A 300 mts</Text>
                        </View>
                    </View>
                    
                    <View style={{ flexDirection:'column', justifyContent:'space-evenly', width: '100%'}}>
                        <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:20}} uppercase mode="contained" onPress={() => navigation.navigate('NuevoAvistamiento')}>
                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Ví / Encontra este animal</Text>
                        </Button>
                        <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:20}} uppercase mode="contained" >
                            <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Ver ubicación</Text>
                        </Button>
                    </View>
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