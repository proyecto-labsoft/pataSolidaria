import React from "react"
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
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