import { Dimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
type Props = {
    texto: string
}
export default function DescripcionVista({texto} : Props) {
    const {width} = Dimensions.get('screen')
    const theme = useTheme()
    return(
        <View style={{marginVertical:10,width:width,backgroundColor: theme.colors.surface,alignItems:'center'}}>
            <Text variant="titleMedium" style={{color: theme.colors.secondary}}>{texto}</Text>
        </View>
    )
}