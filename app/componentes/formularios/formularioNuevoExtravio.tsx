import { View,StyleSheet } from 'react-native'
import {useState} from 'react'
import { Button, useTheme, Text, Portal, Modal } from 'react-native-paper'
import { Mapa } from '../mapa'
import CampoTexto from './campos/campoTexto'
import { useForm } from 'react-hook-form'
import CampoTextoArea from './campos/campoTextoArea'
import { useNavigation } from '@react-navigation/native'
import CampoSelector from './campos/campoSelector'
import DescripcionVista from '../descripcionVista'
import BackdropSuccess from '../backdropSuccess'

export default function FormularioNuevoExtravio() {
    const theme = useTheme()
    const [ubic, setUbic] = useState("");
    const [visible,setVisible] = useState(false)
    const [post,setPost] = useState(false)
    const navigation = useNavigation()

    const { control, handleSubmit, formState: {errors} } = useForm();
    
    const onSubmit = (data: any) => {
        data.ubicacion = ubic
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
                    <Text style={{textAlign: 'center'}}>Al reportar el extravío compartirá sus datos de contacto con los demás usuarios para que se comuniquen con usted.</Text>
                    <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSubmit)}>
                        <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar extravío</Text>
                    </Button>
                </Modal>
            </Portal>
            <DescripcionVista texto="¿Por dónde se extravió?" tamanioTexto="titleLarge"/>
            <Mapa localizar latitude={null} longitude={null} modificarDomicilio={setUbic} />
            <CampoTexto
                valor={ubic}
                label='Ubicación'
                nombre='ubicacion'
                control={control}
            />
            <View style={{justifyContent:'center',alignContent:'center',gap:10}}>
                <Text style={{textAlign:'center'}} variant="headlineSmall">¿Posee alguna identificación?</Text>
                <CampoTexto
                    control={control}
                    label="Texto de la chapa, colgante, etc"
                    nombre="identificacion"
                />
            </View>
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10}}>
                <Text style={{textAlign:'center'}} variant="headlineSmall">¿Cuál es su estado de salud?</Text>
                <CampoSelector
                    control={control}
                    label="Estado de salud"
                    nombre="estadoSalud"
                    opciones={['Vulnerable','Buen estado','Herido','De urgencia','Mal estado']}
                />
            </View>
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10}}>
                <Text style={{textAlign:'center'}} variant="headlineSmall">¿Cuándo lo encontró?</Text>
                <CampoTexto
                    control={control}
                    label="Hora"
                    nombre="hora"
                />
            </View>
        
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10}}>
                <Text style={{textAlign:'center'}} variant="headlineSmall">¿Qué aspecto tiene?</Text>
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
            <CampoSelector
                control={control} 
                label="Sexo"
                nombre="sexo"
                opciones={['No lo sé','Macho','Hembra']}
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
                <Button buttonColor={theme.colors.primary} style={{  marginHorizontal:'5%',marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => setVisible(true)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Publicar extravío</Text>
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
