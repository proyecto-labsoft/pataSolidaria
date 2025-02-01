import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "react-native-paper";

type Props = {
    children: JSX.Element[] | JSX.Element,
}

export default function FondoGradiente({children}:Props) {
    const theme = useTheme()
    return (
        <LinearGradient
            colors={[theme.colors.primary,theme.colors.surface,'transparent']}
            start={{x:0.5,y:0.1}}
            end={{x:0.5,y:0.15}}
            style={{ flex:1 }}
        >
            {children}
        </LinearGradient>
    )
}