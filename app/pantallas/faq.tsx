import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";
import AppbarNav from "../componentes/navegacion/appbarNav";

export default function FAQ() {
    const navigation = useNavigation();
    const theme = useTheme()
    return (
        <View style={{flex:1,justifyContent: "flex-start",alignItems: "center",}}>
            <AppbarNav titulo="FAQ" />
            <Text>Esto es el FAQ</Text>
        </View>
        
    )
}