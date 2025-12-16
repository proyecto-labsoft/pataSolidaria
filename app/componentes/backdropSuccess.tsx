import { View, Pressable } from 'react-native'
import { Icon, Text, useTheme } from 'react-native-paper'

type Props = {
    onTap: Function,
    texto: string,
    color?: string,
    backgroundColor?: string,
}
export default function BackdropSuccess({onTap,backgroundColor, color, texto}:Props){

    const theme = useTheme()
    return (
        <Pressable
            onPress={() => onTap()}
        >
            <View style={{gap:20,backgroundColor: backgroundColor || theme.colors.primaryContainer, width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                <Icon
                    source="checkbox-marked-circle"
                    color={color || theme.colors.onSurface}
                    size={200}
                />
                <Text variant='titleLarge' style={{color: color || theme.colors.onSurface}}>{texto}</Text>
            </View>
        </Pressable>
    )
}