import { View, StyleSheet, Dimensions } from 'react-native'
import { Text as TextPaper, Button, useTheme, Portal, Modal, Text } from 'react-native-paper'
import BannerInfo from '../bannerInfo'
import CampoTexto from './campos/campoTexto'
import CampoTextoArea from './campos/campoTextoArea'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { useForm } from "react-hook-form";
import BackdropSuccess from '../backdropSuccess'

export default function FormularioNuevoAvistamiento() {
    const theme = useTheme()
    const {width} = Dimensions.get('screen')
    const navigation = useNavigation()
    const [visible,setVisible] = useState(false)
    const [post,setPost] = useState(false)

    const { control, handleSubmit, formState: {errors} } = useForm();

    const onSumbit = (data: any) => {
        console.log("errors: ",data)
        setVisible(false)
        
        //Cuando el post tiene exito
        setPost(true)
    }

    return(
        <View style={{gap:20,marginVertical: 16,paddingHorizontal: '5%',height: '100%',width:width,alignItems:'center'}}>
            <Portal>
                {!visible && post && (<BackdropSuccess texto="Nuevo avistamiento confirmado" onTap={() => navigation.goBack()}/>)}
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                    <Text style={{textAlign: 'center'}}>Al reportar el nuevo avistamiento compartirá sus datos de contacto con los familiares del animal.</Text>
                    <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSumbit)}>
                        <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar avistamiento</Text>
                    </Button>
                </Modal>
            </Portal>

            <View style={{borderColor:'black',justifyContent:'center',alignContent:'center',borderWidth:1,width:'80%',height:100}}>
                <Text style={{textAlign:'center'}}>Acá va mapa</Text>
            </View>
            <CampoTexto
                control={control}
                label="Ubicación del avistamiento"
                nombre="ubicacion"
            />
            <BannerInfo texto='Si quiere indicar otra ubicación modifique el campo ó marque otra ubicación en el mapa.' />
            <Button buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary} style={{ marginVertical: 8,borderRadius:50}} uppercase mode="contained" onPress={() => console.log("ir a mapa")}>
                Modificar ubicación
            </Button>
            <CampoTexto
                control={control}
                label="Hora"
                nombre="hora"
            />
            <CampoTexto
                control={control}
                label="Celular"
                nombre="celular"
            />
            <CampoTexto
                control={control}
                label="Correo electronico"
                nombre="correo"
            />
            <CampoTextoArea
                control={control}
                label="Descripción adicional"
                nombre="descripcion"
            />  

            
            <View style={{ flexDirection:'column', justifyContent:'space-evenly', width: '100%'}}>
                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => setVisible(true)}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar avistamiento</TextPaper>
                </Button>
                <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => navigation.goBack()}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</TextPaper>
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
    container: {
        height: 'auto',
        alignItems: "center",
    },
    fotoFamiliar: {
        marginTop: 35,
    },
    nombreFamiliar: {
        textAlign: 'center',
        width: 150,
        padding: 15,
    }
});
