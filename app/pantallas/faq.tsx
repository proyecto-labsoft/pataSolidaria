import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";
import AppbarNav from "../componentes/navegacion/appbarNav";

export default function FAQ() {
    const navigation = useNavigation();
    const theme = useTheme()
    return (
        <>
        <AppbarNav titulo="FAQ" />
        <View style={{justifyContent:'center',alignItems:'center'}}>
            <Text>Esto es el FAQ</Text>
        </View>
        </>
        
    )
}