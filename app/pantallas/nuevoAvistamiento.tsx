import { Dimensions, View } from "react-native";
import AppbarNav from "../componentes/navegacion/appbarNav";
import { useTheme } from "react-native-paper";
import DescripcionVista from "../componentes/descripcionVista";

export default function NuevoAvistamiento() {
    const {width} = Dimensions.get('screen')
    const theme = useTheme()
    return(
        <View style={{height: '100%',width:width,backgroundColor: theme.colors.surface,alignItems:'center'}}>      
            <AppbarNav titulo="Nuevo avistamiento" tamanioTitulo="headlineMedium"/>
            <DescripcionVista texto="Complete los datos del nuevo avistamiento" />
        </View>
    )
}