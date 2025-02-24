import { ScrollView, View } from "react-native";
import AppbarNav from "../componentes/navegacion/appbarNav";
import DescripcionVista from "../componentes/descripcionVista";
import FormularioNuevoAvistamiento from "../componentes/formularios/formularioNuevoAvistamiento";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NuevoAvistamiento() {
    
    return(
        <>
        <AppbarNav titulo="Nuevo avistamiento" tamanioTitulo="headlineMedium"/>
        <SafeAreaView style={{ alignItems: "center",flex:1}}>
            <View style={{marginHorizontal:10,width: "100%"}}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20}}>
                    <DescripcionVista texto="Complete los datos del nuevo avistamiento" />
                    <FormularioNuevoAvistamiento /> 
                </ScrollView> 
            </View>
        </SafeAreaView>
        </>
    )
}