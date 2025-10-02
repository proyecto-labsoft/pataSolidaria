import { View, ScrollView, Dimensions } from 'react-native'
import React, { useMemo, useState} from 'react'
import {Divider, Portal, Text, Chip, Modal, Button, TextInput, useTheme } from 'react-native-paper'
import FormularioEditarFamiliar from '../componentes/formularios/formularioEditarFamiliar';
import BotonAccionesFamiliarFAB from '../componentes/botones/botonAccionesFamiliarFAB';
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';
import { TakePictureBtn } from '../componentes/TakePictureBtn';
import { useRoute } from '@react-navigation/native';
import { useApiDeleteMascota, useApiGetMascotaPorId, useApiPostRegistrarExtravio, useApiPutActualizarMascota } from '../api/hooks';
import BackdropSuccess from '../componentes/backdropSuccess'; 
import { useNavigation } from '@react-navigation/native'

// Basandose en colores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
const imagenes = ImageSlider[0].imagenes

export default function VistaFamiliar() {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const familiarId = route.params?.id;
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [successMensaje, setSuccessMensaje] = useState(false);
  const [perdido, setPerdido] = useState(false); // TODO - usar este estado para mostrar mensaje de extravio cuando tenga el EP para saber si esta perdido
  const [cargarExtravio, setCargarExtravio] = useState(false);
  const [observacionesExtravio, setObservacionesExtravio] = useState(''); 

  // Hook para obtener datos actualizados
  const { data, refetch } = useApiGetMascotaPorId({params: { id: familiarId } });

  const datosFamiliar = useMemo(() => {
    if (!data) return null;
    return data
  }, [data]);
  const { mutateAsync: actualizarFamiliar } = useApiPutActualizarMascota({ 
    params: {id: familiarId},
    onSuccess: () => {setSuccessMensaje(true) ; refetch()}
  }); 

  const { mutateAsync: declararExtraviado } = useApiPostRegistrarExtravio({
    params: {id: familiarId},
    onSuccess: () => {setPerdido(true)}
  });

  const handleDeclararExtravio = () => {
    declararExtraviado({data: {
        creador: 2, // TODO - ID del usuario, reemplazar con el ID real del usuario autenticado
        mascotaId: familiarId,
        zona: "", // TODO - zona, reemplazar con la zona real, datos de geoloocalizacion
        hora: new Date().toISOString(),
        observacion: observacionesExtravio || null, 
        atencionMedica: false // TODO - esto va a volar
      }})
    setCargarExtravio(false);
    setObservacionesExtravio('');
  }

  const handleCloseExtravio = () => {
    setCargarExtravio(false);
    setObservacionesExtravio('');
  }

  const { mutateAsync: eliminarFamiliar, isSuccess: mascotaEliminada} = useApiDeleteMascota({ 
    onSuccess: () => {setSuccessMensaje(true)}
  }); 

  const onSubmit = (data: any) => {
      if (data?.sexo === 'Macho') {
          data.sexo = 'M';
      } else if (data?.sexo === 'Hembra') {
          data.sexo = 'H';
      } else if (data?.sexo === 'No lo sé') {
          data.sexo = null;
      }
      if (data?.tamanio === 'Pequeño') {
          data.tamanio = 'PEQUENIO';
      } else if (data?.tamanio === 'Mediano') {
          data.tamanio = 'MEDIANO';
      } else if (data?.tamanio === 'Grande') {
          data.tamanio = 'GRANDE';
      } else if (data?.tamanio === 'Muy grande') {
          data.tamanio = 'GIGANTE';
      }

      data.familiarId = 2; // TODO - ID del usuario, reemplazar con el ID real del usuario autenticado

      console.log("onSubmit actualizarFamiliar",data)
      actualizarFamiliar({ data: data })
  }
  
  const {width} = Dimensions.get('screen')
  const [foto, setFoto] = useState<string | null>('https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg');
  
  return (
      <View style={{height: '100%',width:width,alignItems:'center'}}>      
        <Portal>
          {successMensaje && (
            <BackdropSuccess
              texto="Se modificaron los datos del familiar"
              onTap={() => {
                setModoEdicion(false);
                setSuccessMensaje(false); 
              }}
            />
          )}
        </Portal>
        <Portal>
          <Modal
              visible={cargarExtravio} 
              onDismiss={handleCloseExtravio}
              contentContainerStyle={{
                  backgroundColor: theme.colors.surface,
                  margin: 20,
                  borderRadius: 8,
                  padding: 20,
                  maxHeight: '70%',
              }}
          >
              <Text variant="titleLarge" style={{ marginBottom: 16 }}>
                  ¿Declarar extravío de {datosFamiliar?.nombre}?
              </Text>

              <TextInput
                mode='outlined'
                label="Observaciones adicionales (opcional)"
                placeholder="Escribe aquí..."
                value={observacionesExtravio}
                onChangeText={setObservacionesExtravio}
                multiline
                numberOfLines={4}
                style={{ 
                    width: '100%', 
                    backgroundColor: 'transparent',
                    marginBottom: 16,
                }}
              />
              <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
              <Button 
                  mode="outlined"
                  onPress={handleCloseExtravio}
                  style={{ marginTop: 16 }}
              >
                  Cancelar
              </Button>
              <Button 
                  mode="outlined"
                  onPress={handleDeclararExtravio}
                  style={{ marginTop: 16 }}
              >
                  Confirmar
              </Button>
              </View>
          </Modal>
      </Portal>
        <Portal>
          {successMensaje && mascotaEliminada && (
            <BackdropSuccess
              texto="Se eliminó el familiar"
              onTap={() => {
                navigation.goBack()
              }}
            />
          )}
        </Portal>
        <AppbarNav titulo={datosFamiliar?.nombre} />

        <ScrollView contentContainerStyle={{margin:12}} > 
          
          <CarruselImagenes data={imagenes} />    
          
          {perdido && (
            <Chip
              icon="alert-circle"
              mode="flat"
              style={{
                marginTop: 16,
                marginBottom: 8,
                backgroundColor: '#FF6B6B',
                alignSelf: 'center',
              }}
              textStyle={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 14,
              }}
            >
              Este familiar está extravioado
            </Chip>
          )}
          
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
      
        <BotonAccionesFamiliarFAB
          showButton={!modoEdicion}
          onEditarDatos={() => setModoEdicion(true)}
          onEliminarFamiliar={() => {
            eliminarFamiliar();
          }}
          onDeclaraPerdido={() => {
            setCargarExtravio(true)
          }}
        />
      
      </View>
  )
}