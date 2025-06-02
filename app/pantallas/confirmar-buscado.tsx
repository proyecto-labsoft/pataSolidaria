import React from "react"
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormularioConfirmarBuscado from "../componentes/formularios/formularioConfirmarBuscado";
import AppbarNav from "../componentes/navegacion/appbarNav";

type Props = {
    route: any
}

export default function ConfirmarBuscado({route}: Props) {
    
    const datos = route.params;

    return (
        <>
            <AppbarNav titulo="Confirmar buscado" tamanioTitulo="headlineSmall" />
            <SafeAreaView style={{ alignItems: "center",flex:1}}>
            <View style={{marginHorizontal:10,width: "100%"}}>
                <ScrollView contentContainerStyle={ {...styles.containerScroll}}>
                    
                    <FormularioConfirmarBuscado data={datos} />
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
    containerScroll: {
        paddingBottom: 20,
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