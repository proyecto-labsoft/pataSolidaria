import { View,StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { useMemo, useState} from 'react'
import {Divider, Text, useTheme} from 'react-native-paper'
import FormularioEditarFamiliar from '../componentes/formularios/formularioEditarFamiliar';
import BotonEditar from '../componentes/botones/botonEditar';
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';
import { TakePictureBtn } from '../componentes/TakePictureBtn';
import { useRoute } from '@react-navigation/native';
import { useApiPutActualizarMascota } from '../api/hooks';

// Basandose en colores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
const imagenes = ImageSlider[0].imagenes

export default function VistaFamiliar() {
  const route = useRoute();

  const datosFamiliar = useMemo(() => route.params, [route.params]);
  // console.log("VistaFamiliar",datosFamiliar)

  const { mutateAsync: actualizarFamiliar } = useApiPutActualizarMascota({ params: {id: datosFamiliar?.id }}); // Descomentar cuando la API esté lista
   // {
    //     "chipeado": true, 
    //     "color": "Blanco y Negro", 
    //     "descripcion": "Gata tranquila y cariñosa", 
    //     "especie": "Gato", 
    //     "esterilizado": true, 
    //     "fnacimiento": null, 
    //     "id": 2, 
    //     "nombre": "Luna", 
    //     "raza": "Siames", 
    //     "sexo": "H"
    // }
  const [modoEdicion, setModoEdicion] = useState(false);

  const onSubmit = (data: any) => {
    console.log("Formulario enviado:", data);
    actualizarFamiliar({ form: data }) // Descomentar cuando la API esté lista
  }
  
  const {width} = Dimensions.get('screen')
  const [foto, setFoto] = useState<string | null>('https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg');
  
  return (
      <View style={{height: '100%',width:width,alignItems:'center'}}>      
        <AppbarNav titulo={datosFamiliar?.nombreCompaniero} />

        <ScrollView contentContainerStyle={{margin:12}} > 
          
          <CarruselImagenes data={imagenes} />    
          {modoEdicion && <TakePictureBtn setImagen={setFoto} />}
          <View style={{gap: 20,paddingVertical:40,alignItems: "center"}} >
          {!modoEdicion ? 
          (  
            <>
                <View style={{width:'90%',justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                    {/* <ItemDato label='Nombre' data={datosFamiliar?.nombreCompaniero}  /> */}
                    <ItemDato label='Fecha de nacimiento' data={datosFamiliar?.fechaNacimiento}  />
                    <ItemDato label='Especie' data={datosFamiliar?.especie}  />
                    <ItemDato label='Raza' data={datosFamiliar?.raza}  />
                    <ItemDato label='Genero' data={datosFamiliar?.sexo} />
                </View>
                <View style={{width:'90%',justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                  <Text style={{textAlign:'center',width:'100%'}} variant="headlineSmall">Aspecto físico</Text>
                  <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center'}}/>
                  <ItemDato label='Tamaño' data={datosFamiliar?.tamanio}  />
                  <ItemDato label='Colores' data={datosFamiliar?.colores}  />
                  <ItemDato label='Observaciones' data={datosFamiliar?.observaciones}  />
                </View>
                <View style={{width:'90%',justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                  <Text style={{textAlign:'center',width:'100%'}} variant="headlineSmall">Domicilio</Text>
                  <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center'}}/>    
                  <ItemDato label='Domicilio' data={datosFamiliar?.domicilio}  />
                </View>
                <View style={{width:'90%',justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                  <Text style={{textAlign:'center',width:'100%'}} variant="headlineSmall">Controles veterinarios</Text>
                  <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center'}}/>    
                  <ItemDato label='¿Está esterilizado?' data={datosFamiliar?.esterilizado}  />
                  <ItemDato label='¿Está chipeado?' data={datosFamiliar?.identificado} />
                </View>
                
                
            </>
          ) :(
            <FormularioEditarFamiliar data={datosFamiliar} onCancel={() => setModoEdicion(false)} onSubmit={onSubmit} />
          )}     
          </View>
        
        </ScrollView>
      
        <BotonEditar showButton={!modoEdicion} onPress={(e: boolean) => setModoEdicion(e)} />
      
      </View>
  )
}