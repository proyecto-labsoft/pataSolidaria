import { View,StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { useState} from 'react'
import {useTheme} from 'react-native-paper'
import FormularioEditarFamiliar from '../componentes/formularios/formularioEditarFamiliar';
import { useNavigation } from '@react-navigation/native';
import BotonEditar from '../componentes/botones/botonEditar';
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import { TakePictureBtn } from '@/src/components/TakePictureBtn';
import AppbarNav from '../componentes/navegacion/appbarNav';

// Basandose en colores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
const imagenes = ImageSlider[0].imagenes

export default function VistaFamiliar() {
  
  const theme = useTheme();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosFamiliar, setDatosFamiliar] = useState({
    nombre: 'Chili',
    especie: 'Perro',
    raza: 'callejero',
    tamanio: 'grande',
    colores: 'tricolor',
    fechanac: '14/04/2021',
    observaciones: 'compañero y sociable',
    sexo: 'macho',
    esterilizado: true,
    identificado: false,
    domicilio: 'Puerto español 844'
  });

  const navigation = useNavigation();
  
  const {width} = Dimensions.get('screen')
  const [foto, setFoto] = useState<string | null>('https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg');
  return (
      <View style={{height: '100%',width:width,backgroundColor: theme.colors.surface,alignItems:'center'}}>      
        <AppbarNav titulo={datosFamiliar?.nombre} />

        <ScrollView contentContainerStyle={{marginVertical:12}} > 
          
          <CarruselImagenes data={imagenes} />    
          {modoEdicion && <TakePictureBtn setImagen={setFoto} />}
          <View style={{gap: 20,paddingVertical:40,paddingHorizontal:20,alignItems: "center"}} >
          {!modoEdicion ? 
          (  
            <>
                <ItemDato label='Nombre' data={datosFamiliar?.nombre}  />
                <ItemDato label='Especie' data={datosFamiliar?.especie}  />
                <ItemDato label='Raza' data={datosFamiliar?.raza}  />
                <ItemDato label='Tamaño' data={datosFamiliar?.tamanio}  />
                <ItemDato label='Colores' data={datosFamiliar?.colores}  />
                <ItemDato label='Fecha de nacimiento' data={datosFamiliar?.fechanac}  />
                <ItemDato label='Genero' data={datosFamiliar?.sexo}  />
                <ItemDato label='¿Está esterilizado?' data={datosFamiliar?.esterilizado}  />
                <ItemDato label='¿Está chipeado?' data={datosFamiliar?.identificado} />
                <ItemDato label='Domicilio' data={datosFamiliar?.domicilio}  />
                <ItemDato label='Observaciones' data={datosFamiliar?.observaciones}  />
            </>
          ) :(
            <FormularioEditarFamiliar data={datosFamiliar} onSumbit={setModoEdicion} />
          )}     
          </View>
        
        </ScrollView>
      
        <BotonEditar showButton={!modoEdicion} onPress={(e: boolean) => setModoEdicion(e)} />
      
      </View>
  )
}

const styles = StyleSheet.create({
    input:{
      marginBottom: 16,
    },
    arrowBtn: {},
    arrowBtnText: {
      fontSize: 42,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
  });
