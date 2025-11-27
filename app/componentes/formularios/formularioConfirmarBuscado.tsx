import { View,StyleSheet } from 'react-native'
import {useState} from 'react'
import { Text as TextPaper, Checkbox, Button, useTheme, Text, Portal, Modal, Divider, Switch } from 'react-native-paper'
import { Mapa } from '../mapa'
import CampoTexto from './campos/campoTexto'
import { useForm } from 'react-hook-form'
import CampoTextoArea from './campos/campoTextoArea'
import { useNavigation } from '@react-navigation/native'
import CampoSelector from './campos/campoSelector'
import DescripcionVista from '../descripcionVista'
import BackdropSuccess from '../backdropSuccess'
import CampoSelectorModal from './campos/campoSelectorModal'
import CampoFecha from './campos/campoFecha'
import { useApiPostExtravioFamiliar } from '@/app/api/hooks'
import { format } from 'date-fns'
import { useUsuario } from '@/app/hooks/useUsuario'
import { QueriesObserver } from '@tanstack/react-query'
interface Props {
    data: {
        nombre: string,
        especie: string,
        raza: string,
        tamanio: string,
        color: string,
        fechaNacimiento: string,
        descripcion: string,
        sexo: string,
        esterilizado: boolean,
        chipeado: boolean,
        domicilio: string
        ubicacion?: string
    },
}
export default function FormularioConfirmarBuscado({ data } : Props) {
    const theme = useTheme()
    const [ubic, setUbic] = useState("");
    const [cambiarDomicilio, setCambiarDomicilio] = useState(false);
    const [domic, setDomicilio] = useState("");
    const [visible,setVisible] = useState(false) 
    const {usuarioId} = useUsuario()
    const navigation = useNavigation()

    const { control,setValue, watch, handleSubmit, formState: {errors} } = useForm({
        defaultValues: data || {}
    });
    
    const esterilizado = watch('esterilizado');
    
    const chipeado = watch('chipeado');

    const [successMensaje, setSuccessMensaje] = useState(false);
     
    const { mutateAsync: declararExtraviado } = useApiPostExtravioFamiliar({
        params: {id: data?.id},
        queriesToInvalidate: ['useApiGetExtraviosPorUsuario','useApiGetExtravios'],
        onSuccess: () => {setSuccessMensaje(true);setVisible(false)},
    });

    const onSubmit = (formData: any) => {
        if (formData?.sexo === 'Macho') {
            formData.sexo = 'M';
        } else if (formData?.sexo === 'Hembra') {
            formData.sexo = 'H';
        } else if (formData?.sexo === 'No lo sé') {
            formData.sexo = null;
        }
        if (formData?.tamanio === 'Pequeño') {
            formData.tamanio = 'PEQUENIO';
        } else if (formData?.tamanio === 'Mediano') {
            formData.tamanio = 'MEDIANO';
        } else if (formData?.tamanio === 'Grande') {
            formData.tamanio = 'GRANDE';
        } else if (formData?.tamanio === 'Muy grande') {
            formData.tamanio = 'GIGANTE';
        }
        console.log("extraviado ", {
            creador: usuarioId, // TODO - ID del usuario, reemplazar con el ID real del usuario autenticado
            mascotaId: data?.id,
            resuelto: false, 
            latitud: formData?.latitud || null,
            longitud: formData?.longitud || null,
            direccion: formData?.direccion || null,
            zona: "", // TODO - zona, reemplazar con la zona real, datos de geoloocalizacion
            hora: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            observacion: formData?.observacionExtravio || null,
            })

        declararExtraviado({
            data: {
            creador: usuarioId, // TODO - ID del usuario, reemplazar con el ID real del usuario autenticado
            mascotaId: data?.id,
            resuelto: false, 
            latitud: formData?.latitud || null,
            longitud: formData?.longitud || null,
            direccion: formData?.direccion || null,
            zona: "", // TODO - zona, reemplazar con la zona real, datos de geoloocalizacion
            hora: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            observacion: formData?.observacionExtravio || null,
            }
        })
        // declararExtraviado({})
    }



    return(
        <View style={{gap:20}}>
            <Portal>
                {successMensaje && (
                <BackdropSuccess
                    texto="Nuevo extravío reportado con éxito"
                    onTap={() => {
                        navigation.navigate("Home")
                    }}
                />
                )}
            </Portal>
            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                    <Text style={{textAlign: 'center'}}>Al reportar la nueva busqueda compartirá sus datos de contacto con los demás usuarios.</Text>
                    <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSubmit)}>
                        <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar búsqueda</Text>
                    </Button>
                </Modal>
            </Portal>
            <DescripcionVista texto="¿Por dónde se extravió?" tamanioTexto="titleLarge"/>
            <Mapa localizar latitude={null} longitude={null} modificarDomicilio={setUbic} />
            <CampoTexto
                style={ styles.input } 
                label='Observaciones'
                nombre='observacionExtravio'
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                valor={ubic}
                label='Ubicación'
                nombre='ubicacion'
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                label="Nombre"
                nombre="nombre"
                control={control}
            /> 
            <CampoSelectorModal
                control={control} 
                label="Sexo"
                nombre="sexo"
                opciones={['No lo sé','Macho','Hembra']}
            />
            <CampoTexto
                style={ styles.input }
                label="Especie"
                nombre="especie"
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                label="Raza"
                nombre="raza"
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                label="Tamaño"
                nombre="tamanio"
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                label="Colores"
                nombre="color"
                control={control}
            />
            {cambiarDomicilio && (
                <>
                    <Mapa localizar latitude={null} longitude={null} modificarDomicilio={setDomicilio} />
                    <Button  buttonColor={theme.colors.secondary} style={{  marginHorizontal:'5%',marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => {setDomicilio("");setCambiarDomicilio(false)}}>
                        <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</Text>
                    </Button>
                </>
            )}
            {!cambiarDomicilio && (
                <Button icon="map-marker" buttonColor={theme.colors.primary} style={{  marginHorizontal:'5%',marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => setCambiarDomicilio(true)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Cambiar el domicilio</Text>
                </Button>
            )} 
            <CampoFecha
                label="Fecha de nacimiento"
                nombre="fechaNacimiento"
                control={control}
            />
            <CampoTextoArea
                style={ styles.input }
                label="Descripción adicional"
                nombre="descripcion"
                control={control}
            />
            <View style={{justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                <Text style={{textAlign:'center',width:'100%'}} variant="headlineSmall">Identificación y esterilización</Text>
                <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center'}}/>    
                
                    <View style={{flexDirection:'row', marginHorizontal: 30,marginVertical: 8, alignItems:'center', justifyContent: 'space-between'}}>
                        <Text variant="titleLarge" onPress={() => {
                            setValue('esterilizado', !esterilizado);
                        }}>Esterilizado</Text>
                        <Switch
                            value={esterilizado}
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                            onValueChange={() => {
                                setValue('esterilizado', !esterilizado);
                            }}
                        />
                        
                    </View>
                    <View style={{flexDirection:'row', marginHorizontal: 30, marginVertical: 8, alignItems:'center', justifyContent: 'space-between'}}>
                        <Text variant="titleLarge" onPress={() => {
                            setValue('chipeado', !chipeado);
                        }}>Chipeado</Text>
                        <Switch
                            value={chipeado}
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                            onValueChange={() => {
                                setValue('chipeado', !chipeado);
                            }}
                        />
                    </View>
                
            </View>
            
            <View style={{ flexDirection:'row', justifyContent:'space-evenly', width: '100%'}}>
                
                <Button  buttonColor={theme.colors.secondary} style={{  marginHorizontal:'5%',marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => navigation.goBack()}>
                    <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</Text>
                </Button>
                <Button buttonColor={theme.colors.primary} style={{  marginHorizontal:'5%',marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => setVisible(true)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Publicar buscado</Text>
                </Button>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    input:{
        marginBottom: 16,
    },
    containerStyle: {
        justifyContent: "space-around",
        alignItems: "center",
        width: '80%',
        height: '30%',
        alignSelf:"center",
        padding: 30,
        borderRadius: 20,
    },
});
