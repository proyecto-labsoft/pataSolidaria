import React,{useEffect, useState} from "react"
import { Dimensions, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
import CampoTexto from "../componentes/formularios/campos/campoTexto";
import { useForm } from "react-hook-form";
import CampoTextoArea from "../componentes/formularios/campos/campoTextoArea";
import BannerInfo from "../componentes/bannerInfo";
import CampoSelector from "../componentes/formularios/campos/campoSelector";
import BackdropSuccess from "../componentes/backdropSuccess";
import { useNavigation } from "@react-navigation/native";

//TODO: Cambiar el estadod e post por el retorno de la request Post cuando se cree el caso
export default function NuevoEncontrado() {
    const theme = useTheme()
    const navigation = useNavigation()
    const [visible,setVisible] = useState(false)
    const [post,setPost] = useState(false) 
    const { control, handleSubmit, formState: {errors} } = useForm();
    const {width} = useWindowDimensions()
    const onSumbit = (data: any) => {
        console.log("errors: ",data)
        setVisible(false)
        
        //Cuando el post tiene exito
        setPost(true)
    }

    return (
        <>
            <AppbarNav titulo="Nuevo hallazgo" />     
            
            <SafeAreaView style={{flex:1}}>   
                        <Portal>
                            {!visible && post && (<BackdropSuccess texto="Se generó el nuevo caso" onTap={() => navigation.goBack()}/>)}
                            <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.modalStyle,backgroundColor:theme.colors.surface}}>
                                <Text style={{textAlign: 'center'}}>Se creara un caso de extravío con los datos provistos.</Text>
                                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSumbit)}>
                                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar publicación</Text>
                                </Button>
                            </Modal>
                        </Portal>
                        <ScrollView style={{paddingHorizontal: '5%',width: width}} contentContainerStyle={{flexGrow: 1,paddingBottom:30,gap: 30}}>
                            <View style={{justifyContent:'center',alignContent:'center',gap:10}}>
                            <Text style={{textAlign:'center'}} variant="headlineSmall">¿Dónde fue el hallazgo?</Text>
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
                            </View>
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
                            <View style={{ flexDirection:'column', justifyContent:'space-evenly', width: '100%'}}>
                                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => setVisible(true)}>
                                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar datos</Text>
                                </Button>
                                <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => navigation.goBack()}>
                                    <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</Text>
                                </Button>
                            </View>
                        </ScrollView>
                
            </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex:1
    },
    scrollView: {
        marginTop:5,
    
    },
    modalStyle: {
        justifyContent: "space-around",
        alignItems: "center",
        width: '80%',
        height: '30%',
        alignSelf:"center",
        padding: 30,
        borderRadius: 20,
    },
    containerScroll: {
    paddingBottom: 20,
    borderRadius: 10,
    margin: 12,
    },
    input:{
    marginBottom: 16,
    },
    fotoFamiliar: {
        marginTop: 35,
    },
    nombreFamiliar: {
        // borderBottomWidth: 1,
        // borderEndColor: 'black',
        textAlign: 'center',
        width: 150,
        padding: 15,
    },
    cardFamiliar: {
    marginVertical: 5,
    },
});