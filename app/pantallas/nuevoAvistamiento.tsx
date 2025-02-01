import { Dimensions, ScrollView, View } from "react-native";
import AppbarNav from "../componentes/navegacion/appbarNav";
import DescripcionVista from "../componentes/descripcionVista";
import FormularioNuevoAvistamiento from "../componentes/formularios/formularioNuevoAvistamiento";

export default function NuevoAvistamiento() {
    const {width} = Dimensions.get('screen')
    
    const onSumbit = () => {
        console.log("onSumbit")
    }
    return(
        <View style={{height: '100%',width: width,alignItems:'center'}}>      
            <AppbarNav titulo="Nuevo avistamiento" tamanioTitulo="headlineMedium"/>
            <ScrollView style={{marginVertical:16}} >
            
                <DescripcionVista texto="Complete los datos del nuevo avistamiento" />
                <FormularioNuevoAvistamiento onSumbit={onSumbit}/> 
            
            </ScrollView> 
    
        </View>
    )
}