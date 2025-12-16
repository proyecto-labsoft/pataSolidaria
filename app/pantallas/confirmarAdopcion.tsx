import React from "react"
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import AppbarNav from "../componentes/navegacion/appbarNav";
import FormularioConfirmarAdopcion from "../componentes/formularios/nuevaAdopcion/formularioConfirmarAdopcion";

type Props = {
    route: any
}

export default function ConfirmarAdopcion({route}: Props) {
    
    const datos = route.params;

    return (
        <>
            <AppbarNav titulo="Confirmar adopción" tamanioTitulo="headlineSmall" />
            <SafeAreaView style={{ alignItems: "center", flex: 1}}>
                <View style={{marginHorizontal: 10, width: "100%"}}>
                    <ScrollView contentContainerStyle={ {...styles.containerScroll}}> 
                        <FormularioConfirmarAdopcion data={datos} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1
    },
    containerScroll: {
        paddingBottom: 20,
    },
});
