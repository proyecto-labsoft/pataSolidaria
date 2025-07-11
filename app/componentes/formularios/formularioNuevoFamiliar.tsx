import { View,StyleSheet } from 'react-native'
import {useState} from 'react'
import { Button, useTheme, Text, Portal, Modal, Checkbox, Divider } from 'react-native-paper'
import { Mapa } from '../mapa'
import CampoTexto from './campos/campoTexto'
import { useForm } from 'react-hook-form'
import CampoTextoArea from './campos/campoTextoArea'
import { useNavigation } from '@react-navigation/native'
import CampoSelector from './campos/campoSelector'
import DescripcionVista from '../descripcionVista'
import BackdropSuccess from '../backdropSuccess'
export default function FormularioNuevoFamiliar() {
    const theme = useTheme()
    const [ubic, setUbic] = useState("");
    const [visible,setVisible] = useState(false)
    const [post,setPost] = useState(false)
    const navigation = useNavigation()

    const { control,setValue, watch, handleSubmit, formState: {errors} } = useForm();
    const esterilizado = watch('esterilizado');
    const tieneIdentificacion = watch('tieneIdentificacion');
    
    const onSubmit = (data: any) => {
        console.log("onSubmit: ",data)
        data.ubicacion = ubic
        setVisible(true)
        setPost(true)
        
    }

    return(
        <View style={{gap:20}}>
            <Portal>
                {visible && post && (<BackdropSuccess texto="Nuevo integrante agregado a la familia" onTap={() => navigation.goBack()}/>)}
            </Portal>
            <DescripcionVista texto="Información del nuevo integrante" tamanioTexto="titleLarge"/>
        
            <CampoTexto
                control={control}
                label="Nombre"
                nombre="nombre"
            />
            <CampoTexto
                control={control}
                label="Fecha de nacimiento"
                // autoComplete='birthdate-day'
                nombre="fechanac"
            />
            <CampoSelector
                control={control}
                label="Especie de animal"
                nombre="especie"
                opciones={['Perro','Gato','Caballo','Otros']}
            />
            <CampoTexto
                control={control}
                label="Raza"
                nombre="raza"
            />
            <CampoSelector
                control={control} 
                label="Sexo"
                nombre="sexo"
                opciones={['No lo sé','Macho','Hembra']}
            />
            <Divider style={{marginVertical: 20}}/>
            <View style={{justifyContent:'center',alignContent:'center',gap:10}}>
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
            <Divider style={{marginVertical: 20}}/>
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10}}>
                <Text style={{textAlign:'center'}} variant="headlineSmall">Aspecto del familiar</Text>
                <CampoTexto
                    control={control}
                    label="Colores"
                    nombre="colores"
                />
            </View>
            <CampoSelector
                control={control}
                label="Tamaño"
                nombre="tamanio"
                opciones={['Muy pequeño','Pequeño','Mediano','Grande','Muy grande']}
            />
        
            <CampoTextoArea
                control={control}
                label="ObservacionesAdicionales"
                nombre="observaciones"
            />
            <View style={{ flexDirection:'row', justifyContent:'space-evenly', width: '100%'}}>
                <Button  buttonColor={theme.colors.secondary} style={{  marginHorizontal:'5%',marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => navigation.goBack()}>
                    <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</Text>
                </Button>
                <Button buttonColor={theme.colors.primary} style={{  marginHorizontal:'5%',marginVertical: 8,borderRadius:10}} uppercase mode="contained"  onPress={handleSubmit(onSubmit)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Guardar</Text>
                </Button>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
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
