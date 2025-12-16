import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
type Props = {
    texto: string,
    tamanioTexto?: any,
    textStyle?: object,
    containerStyle?: object,
}
export default function DescripcionVista({texto,tamanioTexto,containerStyle,textStyle} : Props) {
    
    const theme = useTheme()
    return(
        <View style={{marginVertical:10,alignItems:'center',...containerStyle}}>
            <Text variant={tamanioTexto ? tamanioTexto : "titleMedium"} style={{textAlign: 'center',color: theme.colors.primary,...textStyle}}>{texto}</Text>
        </View>
    )
}