import React from "react" 
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
import FormularioNuevoExtravio from "../componentes/formularios/nuevoExtravio/formularioNuevoExtravio";

//TODO: Cambiar el estadod e post por el retorno de la request Post cuando se cree el caso
export default function NuevoExtraviado() {

    return (
        <>
            <AppbarNav titulo="Nuevo extravío" tamanioTitulo="headlineSmall"/>     
            <SafeAreaView style={{flex:1}}>    
                <FormularioNuevoExtravio /> 
            </SafeAreaView>
        </>
    )
} 