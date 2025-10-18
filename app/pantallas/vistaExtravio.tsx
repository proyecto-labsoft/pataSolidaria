import { View, ScrollView, Dimensions, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useState} from 'react'
import {Button, Divider, Icon, Modal, Portal, Text, useTheme} from 'react-native-paper'
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';
import { useNavigation } from "@react-navigation/native";
import BackdropSuccess from '../componentes/backdropSuccess';
import { Mapa } from '../componentes/mapa';
import BannerEstadoExtravio from '../componentes/bannerEstadoExtravio';

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

    const [esBuscado,setEsBuscado] = useState(false)
    const [datosAnimal, setDatosAnimal] = useState(null);
    useEffect(() => {
        if ( route.params?.data?.mascotaDetalle) {
            setDatosAnimal(route.params.data.mascotaDetalle);
        }
        if (route.params?.data?.mascotaId) {
            setEsBuscado(true)
        }
    },[route.params?.data])

    return (
        <View style={{height: height,width:width,alignItems:'center'}}>      

            <AppbarNav titulo={datosAnimal?.nombre} />
            <BannerEstadoExtravio esBuscado={esBuscado} />
            <ScrollView contentContainerStyle={{margin:12}} > 
                <Portal>
                    <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                        <Mapa style={{width:width,height:height}} latitude={null} longitude={null}/>
                        <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained"  onPress={()=> setVisible(false)}>
                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Volver atrás</Text>
                        </Button>
                    </Modal>
                </Portal>
                <CarruselImagenes data={imagenes} />        
                <View style={{gap: 20,paddingVertical:40,paddingHorizontal:20,alignItems: "center"}} >
                    
                        <View style={{width: (width*60)/100,justifyContent:'center',alignItems:'center',gap:4}}>

                            <Text variant='titleLarge' style={{color: theme.colors.onSurface}}>Último avistamiento</Text>
                            <Divider style={{ width: '100%', height: 1, backgroundColor: theme.colors.outlineVariant, borderRadius: 20 }} />
                            <Text variant='titleMedium' style={{color: theme.colors.onSurface}}>Hace 2 horas</Text>
                            
                        </View>
                    
                    
                    <View style={{ flexDirection:'column', justifyContent:'space-evenly', width: '100%'}}>
                        <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:20}} uppercase mode="contained" onPress={() => navigation.navigate('NuevoAvistamiento')}>
                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Ví / Encontra este animal</Text>
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
                </View>
            
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
