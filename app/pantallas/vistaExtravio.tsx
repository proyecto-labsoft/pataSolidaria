import { View, ScrollView, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState} from 'react'
import {Button, Modal, Portal, Surface, Text, useTheme} from 'react-native-paper'
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';
import { useNavigation } from "@react-navigation/native";
import { Mapa } from '../componentes/mapa';
import BannerEstadoExtravio from '../componentes/bannerEstadoExtravio';
import { calcularTiempoTranscurrido } from '../utiles/calcularTiempoTranscurrido';

// Basandose en colores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
const imagenes = ImageSlider[0].imagenes

export default function VistaExtravio({route}: any) {    
    const theme = useTheme();

    const navigation = useNavigation()
    const {width,height} = useWindowDimensions()
    const [visible,setVisible] = useState(false)

    const [datosAnimal, setDatosAnimal] = useState(null);
    const [datosExtravio, setDatosExtravio] = useState(null);
    
    useEffect(() => { 
        if ( route.params?.data?.mascotaDetalle) {
            setDatosAnimal(route.params.data.mascotaDetalle);
        } 
        if (route.params?.data) {
            setDatosExtravio(route.params?.data)
        }
    },[route.params?.data])

    const ultimaModificacion = calcularTiempoTranscurrido(datosExtravio?.hora)
    return (
        <View style={{height: height,width:width,alignItems:'center'}}>      

            <AppbarNav titulo={route.params?.data?.creadoByFamiliar ? 'BUSCADO' : 'EXTRAVIADO'} />
            <BannerEstadoExtravio titulo={ultimaModificacion} tipo={route.params?.data?.creadoByFamiliar} />
            <ScrollView contentContainerStyle={{margin:12}} > 
                <Portal>
                    <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                        <Mapa puntoModificable={false} style={{width:width,height:height}} latitude={datosExtravio?.latitud} longitude={datosExtravio?.longitud}/>
                        <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained"  onPress={()=> setVisible(false)}>
                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Volver atrás</Text>
                        </Button>
                    </Modal>
                </Portal>
                <CarruselImagenes data={imagenes} />        
                <Surface style={{gap: 20, borderRadius: 20, elevation: 2, backgroundColor: theme?.colors.surfaceVariant, paddingVertical: 20,marginVertical: 20, paddingHorizontal:20,alignItems: "center"}} >
                    <View style={{ flexDirection:'column', justifyContent:'space-evenly', width: '100%'}}>
                        <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:20}} uppercase mode="contained" onPress={() => navigation.navigate('NuevoAvistamiento')}>
                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}> Ví / encontre este animal</Text>
                        </Button>
                        <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:20}} uppercase mode="contained" onPress={()=> setVisible(true)} >
                            <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Ver ubicación</Text>
                        </Button>
                    </View>
                    <ItemDato label='Nombre' data={datosAnimal?.nombre}  />
                    <ItemDato label='Especie' data={datosAnimal?.especie}  />
                    <ItemDato label='Raza' data={datosAnimal?.raza}  />
                    <ItemDato label='Tamaño' data={datosAnimal?.tamanio}  />
                    <ItemDato label='Colores' data={datosAnimal?.colores}  />
                    <ItemDato label='Fecha de nacimiento' data={datosAnimal?.fechaNacimiento}  />
                    <ItemDato label='Genero' data={datosAnimal?.genero}  />
                    <ItemDato label='¿Está esterilizado?' data={datosAnimal?.esterilizado}  />
                    <ItemDato label='¿Está chipeado?' data={datosAnimal?.chipeado} />
                    <ItemDato label='Domicilio' data={datosAnimal?.domicilio}  />
                    <ItemDato label='Observaciones' data={datosAnimal?.descripcion}  />  
                </Surface>
            
            </ScrollView>
        </View>
)}

const styles = StyleSheet.create({
    containerStyle: {
        alignItems: "center",
        width: '100%',
        height: '100%',
    },
});
