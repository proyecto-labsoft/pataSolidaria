import { Dimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
type Props = {
    texto: string,
    tamanioTexto?: any
}
export default function DescripcionVista({texto,tamanioTexto} : Props) {
    const {width} = Dimensions.get('screen')
    const theme = useTheme()
    return(
        <View style={{paddingHorizontal:'5%',marginVertical:10,width:width,alignItems:'center'}}>
            <Text variant={tamanioTexto ? tamanioTexto : "titleMedium"} style={{textAlign: 'center',color: theme.colors.secondary}}>{texto}</Text>
        </View>
    )
}