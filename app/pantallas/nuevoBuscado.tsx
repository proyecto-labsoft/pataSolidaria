import React,{useEffect, useState} from "react"
import { StyleSheet, ScrollView, View } from "react-native";
import { useTheme } from 'react-native-paper';
import CardFamiliar from "../componentes/cards/cardFamiliar";
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
import { useNavigation } from "../types/react-navigation";
import { LinearGradient } from "expo-linear-gradient";
import DescripcionVista from "../componentes/descripcionVista";

export default function NuevoBuscado() {
    const theme = useTheme();
    const [datosFamiliar, setDatosFamiliar] = useState({
      nombre: 'Chili',
      especie: 'Perro',
      raza: 'callejero',
      tamanio: 'grande',
      colores: 'tricolor',
      fechanac: '14/04/2021',
      observaciones: 'compañero y sociable',
      sexo: 'macho',
      esterilizado: true,
      identificado: false,
      domicilio: 'Puerto español 844'
    });
   
    return (
        <>
            <AppbarNav titulo="Nueva caso" />     
            
            <SafeAreaView style={{ alignItems: "center",flex:1}}>   
                <DescripcionVista texto="¿Qué familiar esta buscando?" tamanioTexto="headlineSmall"/>
                <View style={{marginHorizontal:10}}>
                <ScrollView contentContainerStyle={{ alignItems: "center",gap:40,padding:20,width: '100%'}}>
                        <CardFamiliar navigateTo="ConfirmarBuscado" data={{nombre: 'Chili', especie: 'Canino'}} />
                        <CardFamiliar navigateTo="ConfirmarBuscado" data={{nombre: 'Duque', especie: 'Canino'}} />
                        <CardFamiliar navigateTo="ConfirmarBuscado" data={{nombre: 'Draco', especie: 'Canino'}} />
                        <CardFamiliar navigateTo="ConfirmarBuscado" data={{nombre: 'Sur', especie: 'Felino'}} />
                    </ScrollView>
                </View>
                
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