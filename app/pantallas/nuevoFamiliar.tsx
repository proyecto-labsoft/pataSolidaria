import React,{ useState} from "react"
import { StyleSheet, ScrollView, View } from "react-native";
import CardFamiliar from "../componentes/cards/cardFamiliar";
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
import DescripcionVista from "../componentes/descripcionVista";
import FormularioNuevoFamiliar from "../componentes/formularios/formularioNuevoFamiliar";

export default function NuevoFamiliar() {
    
    return (
        <>
            <AppbarNav titulo="Nuevo familiar" tamanioTitulo="headlineSmall"/>     
            
            <SafeAreaView style={{flex:1}}>   
                <ScrollView contentContainerStyle={ {...styles.containerScroll}}>
                    <FormularioNuevoFamiliar />
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