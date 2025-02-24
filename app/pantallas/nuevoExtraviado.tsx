import React from "react"
import { ScrollView, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
import FormularioNuevoExtravio from "../componentes/formularios/formularioNuevoExtravio";

//TODO: Cambiar el estadod e post por el retorno de la request Post cuando se cree el caso
export default function NuevoExtraviado() {

    return (
        <>
            <AppbarNav titulo="Nuevo caso" />     
            <SafeAreaView style={{flex:1}}>   
                <ScrollView contentContainerStyle={ {...styles.containerScroll}}>
                    <FormularioNuevoExtravio />
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
    containerScroll: {
        paddingBottom: 20
    },
});