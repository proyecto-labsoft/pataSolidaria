import React from "react" 
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav"; 
import FormularioNuevaEmergencia from "../componentes/formularios/nuevaEmergencia/formularioNuevaEmergencia";

//TODO: Cambiar el estadod e post por el retorno de la request Post cuando se cree el caso
export default function NuevaEmergencia() {

    return (
        <>
            <AppbarNav titulo="Nuevo extravío" tamanioTitulo="headlineSmall"/>     
            <SafeAreaView style={{flex:1}}>    
                <FormularioNuevaEmergencia /> 
            </SafeAreaView>
        </>
    )
} 