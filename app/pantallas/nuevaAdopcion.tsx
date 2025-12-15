import React from "react" 
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav"; 
import FormularioNuevaAdopcion from "../componentes/formularios/nuevaAdopcion/formularioNuevaAdopcion"; 
import { ScrollView, StyleSheet } from "react-native";

//TODO: Cambiar el estadod e post por el retorno de la request Post cuando se cree el caso
export default function NuevaAdopcion() {

    return (
        <>
            <AppbarNav titulo="Nueva adopción" tamanioTitulo="headlineSmall"/>     
            <SafeAreaView style={{flex:1}}>    
                <ScrollView contentContainerStyle={ {...styles.containerScroll}}>
                <FormularioNuevaAdopcion /> 
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