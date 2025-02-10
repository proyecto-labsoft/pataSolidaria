import React,{useEffect, useState} from "react"
import { Dimensions, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
import CampoTexto from "../componentes/formularios/campos/campoTexto";
import { useForm } from "react-hook-form";
import CampoTextoArea from "../componentes/formularios/campos/campoTextoArea";
import BannerInfo from "../componentes/bannerInfo";
import CampoSelector from "../componentes/formularios/campos/campoSelector";

export default function NuevoEncontrado() {
    const theme = useTheme()
    const { control, handleSubmit, formState: {errors} } = useForm();
    const {width} = useWindowDimensions()
    
    return (
        <>
            <AppbarNav titulo="Nuevo hallazgo" />     
            
            <SafeAreaView style={{flex:1}}>   
                    
                        <ScrollView style={{paddingHorizontal: '5%',width: width}} contentContainerStyle={{flexGrow: 1,paddingBottom:30,gap: 30}}>
                            <View style={{justifyContent:'center',alignContent:'center',gap:10}}>
                            <Text style={{textAlign:'center'}} variant="headlineSmall">¿Dónde fue el hallazgo?</Text>
                            <View style={{borderColor:'black',justifyContent:'center',alignContent:'center',borderWidth:1,width:'80%',height:100}}>
                                <Text style={{textAlign:'center'}}>Acá va mapa</Text>
                            </View>
                            <CampoSelector
                                control={control} 
                                label="Sexo"
                                nombre="sexo"
                                opciones={['No lo sé','Macho','Hembra']}
                            />
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
                                <CampoTexto
                                    control={control}
                                    label="Estado de salud"
                                    nombre="estadoSalud"
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
                            <CampoTexto
                                control={control}
                                label="Tamaño"
                                nombre="tamanio"
                            />
                            <CampoTexto
                                control={control}
                                label="Sexo"
                                nombre="sexo"
                            />
                            <CampoTextoArea
                                control={control}
                                label="ObservacionesAdicionales"
                                nombre="observaciones"
                            />
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