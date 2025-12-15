import { View, ScrollView, Dimensions } from 'react-native'
import React, { useMemo, useEffect, useState} from 'react'
import {Divider, Portal, Text, Modal, Button, TextInput, useTheme } from 'react-native-paper'
import FormularioEditarFamiliar from '../componentes/formularios/formularioEditarFamiliar';
import BotonAccionesFamiliarFAB from '../componentes/botones/botonAccionesFamiliarFAB';
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';
import BannerEstadoExtravio from '../componentes/bannerEstadoExtravio';
import { TakePictureBtn } from '../componentes/TakePictureBtn';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { useApiDeleteMascota, useApiGetExtravioPorMascota, useApiGetMascotaPorId, useApiPostExtravioFamiliar, useApiPutActualizarExtravio, useApiPutActualizarMascota } from '../api/hooks';
import BackdropSuccess from '../componentes/backdropSuccess'; 
import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns';
import { useUsuario } from '../hooks/useUsuario';
import { calcularTiempoTranscurrido } from '../utiles/calcularTiempoTranscurrido';

// Basandose en colores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
const imagenes = ImageSlider[0].imagenes

export default function VistaFamiliar() {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const isFocused = useIsFocused(); // Hook para saber si la pantalla está enfocada
  const familiarId = route.params?.id;

  const { usuarioId } = useUsuario()
  
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
  const { mutateAsync: actualizarFamiliar, isPending: actualizandoFamiliar } = useApiPutActualizarMascota({ 
    params: {id: familiarId},
    onSuccess: () => {setSuccessMensaje(true) ; refetch()}
  }); 

  const { data: extravio } = useApiGetExtravioPorMascota({ params: {id: familiarId}})

  useEffect(() => { 
    console.log("extravio?.estaExtraviado",extravio?.estaExtraviado)
    setPerdido(extravio?.estaExtraviado);
  }, [extravio]);
  const { mutateAsync: declararExtraviado } = useApiPostExtravioFamiliar({
    params: {id: familiarId},
    onSuccess: () => {setPerdido(true)}
  });

  const { mutateAsync: resolverExtravio } = useApiPutActualizarExtravio({
    params: { id: extravio?.extravio?.id },
    onSuccess: () => {
      setPerdido(false);
    }
  });

  const resolverCaso = () => {
    const {id, ...restoDAta} = extravio?.extravio;

    resolverExtravio({data: {
      ...restoDAta,
      resuelto: true
    }});
  }

  const handleDeclararExtravio = () => {
    navigation.navigate("ConfirmarBuscado", { ...datosFamiliar }) 
    setCargarExtravio(false);
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

      data.familiarId = usuarioId; // TODO - ID del usuario, reemplazar con el ID real del usuario autenticado
 
      actualizarFamiliar({ data: data })
  }
  
  const {width} = Dimensions.get('screen')
  const [foto, setFoto] = useState<string | null>('https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg');
  
  return (
      <View style={{height: '100%',width:width,alignItems:'center'}}>      
        <Portal>
          {successMensaje && !mascotaEliminada && (
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
              <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 16 }}>
                  {`¿Declarar extravío de ${datosFamiliar?.nombre}?`}
              </Text> 
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

        {perdido && (
          <BannerEstadoExtravio 
            tipo={false} 
            titulo={`EXTRAVIADO - ${calcularTiempoTranscurrido(extravio?.extravio.hora)}`}
          />
        )}

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
                    <ItemDato label='Sexo' data={datosFamiliar?.sexo === 'H' ? 'Hembra' : datosFamiliar?.sexo === 'M' ? 'Macho' : 'No lo sé'} />
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
                  <ItemDato label='¿Está chipeado?' data={datosFamiliar?.chipeado} />
                </View>
                
                
            </>
          ) :(
            <FormularioEditarFamiliar data={datosFamiliar} submitting={actualizandoFamiliar} onCancel={() => setModoEdicion(false)} onSubmit={onSubmit} />
          )}     
          </View>
        
        </ScrollView>
      
        <BotonAccionesFamiliarFAB
          showButton={!modoEdicion && isFocused}
          casoResuelto={perdido}
          onEditarDatos={() => setModoEdicion(true)}
          onEliminarFamiliar={() => {
            eliminarFamiliar({ params: { id: familiarId } });
          }}
          onDeclaraPerdido={() => {
            setCargarExtravio(true)
          }}
          onResolverCaso={() => {
            resolverCaso()
          }}
        />
      
      </View>
  )
}