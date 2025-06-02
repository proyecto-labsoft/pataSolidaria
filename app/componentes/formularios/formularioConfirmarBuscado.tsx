import { View,StyleSheet } from 'react-native'
import {useState} from 'react'
import { Text as TextPaper, Checkbox, Button, useTheme, Text, Portal, Modal } from 'react-native-paper'
import { Mapa } from '../mapa'
import CampoTexto from './campos/campoTexto'
import { useForm } from 'react-hook-form'
import CampoTextoArea from './campos/campoTextoArea'
import { useNavigation } from '@react-navigation/native'
import CampoSelector from './campos/campoSelector'
import DescripcionVista from '../descripcionVista'
import BackdropSuccess from '../backdropSuccess'
interface Props {
    data: {
        nombre: string,
        especie: string,
        raza: string,
        tamanio: string,
        colores: string,
        fechanac: string,
        observaciones: string,
        sexo: string,
        esterilizado: boolean,
        identificado: boolean,
        domicilio: string
        ubicacion?: string
    },
}
export default function FormularioConfirmarBuscado({data} : Props) {
    const theme = useTheme()
    const [ubic, setUbic] = useState("");
    const [cambiarDomicilio, setCambiarDomicilio] = useState(false);
    const [domic, setDomicilio] = useState("");
    const [visible,setVisible] = useState(false)
    const [post,setPost] = useState(false)
    const navigation = useNavigation()

    const { control,setValue, watch, handleSubmit, formState: {errors} } = useForm();
    const esterilizado = watch('esterilizado');
    const tieneIdentificacion = watch('tieneIdentificacion');
        
    const onSubmit = (data: any) => {
        data.ubicacion = ubic
        if(!!domic){data.domicilio = domic}
        console.log(data)
        setVisible(false)
        setPost(true)
        
    }

    // TODO: Post del nuevo caso de busqueda
    return(
        <View style={{gap:20}}>
            <Portal>
                {!visible && post && (<BackdropSuccess texto="Nueva busqueda confirmada" onTap={() => navigation.navigate('Home')}/>)}
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
                nombre="colores"
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
            <CampoTexto
                style={ styles.input }
                valor={cambiarDomicilio ? domic : ''}
                label="Domicilio"
                nombre="domicilio"
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                control={control}
                nombre="fechanac"
                label="Fecha de nacimiento"
            />
            <CampoTextoArea
                style={ styles.input }
                label="Descripción adicional"
                nombre="observaciones"
                control={control}
            />
            <View style={{ justifyContent: 'flex-start' , width: '100%' }}>
                <Text style={{textAlign:'center'}} variant="headlineSmall">Identificadores y esterilización</Text>
                    <View style={{ justifyContent: 'flex-start', width: '100%' }}>
                        <View style={{flexDirection:'row', marginVertical: 8, alignItems:'center'}}>
                            <Checkbox
                                status={esterilizado ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setValue('esterilizado', !esterilizado);
                                }}
                            />
                            <Text variant="titleLarge" onPress={() => {
                                setValue('esterilizado', !esterilizado);
                            }}>Esterilizado</Text>
                        </View>
                        <View style={{flexDirection:'row', marginVertical: 8, alignItems:'center'}}>
                            <Checkbox
                                status={tieneIdentificacion ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setValue('tieneIdentificacion', !tieneIdentificacion);
                                }}
                            />
                            <Text variant="titleLarge" onPress={() => {
                                setValue('tieneIdentificacion', !tieneIdentificacion);
                            }}>¿Está chipeado/identificado?</Text>
                        </View>
                        <CampoTexto
                            control={control}
                            disabled={!tieneIdentificacion}
                            label="Datos de la chapa, colgante, etc"
                            nombre="identificacion"
                        />
                    </View>
            </View>
            <CampoSelector
                control={control} 
                label="Sexo"
                nombre="sexo"
                opciones={['No lo sé','Macho','Hembra']}
            />
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
