import React,{ useNavigation } from "@react-navigation/native";
import { Appbar, Text, useTheme } from 'react-native-paper';
import AccesoNotificaciones from "./accesoNotificaciones";

type Props = {
  titulo: string,
  tamanioTitulo?: string
}
export default function AppbarNav({titulo,tamanioTitulo} : Props) {
    const navigation = useNavigation()
    const theme = useTheme()
    return (
        <Appbar.Header style={{backgroundColor: theme.colors.primary, width: '100%'}} >
          {navigation.canGoBack() 
            ? <Appbar.BackAction iconColor={theme.colors.onPrimary} containerColor={theme.colors.primary} onPress={() => navigation.goBack()} />
            : <Appbar.Action icon="help-circle-outline" iconColor={theme.colors.onPrimary}  onPress={() => navigation.navigate("Faq")}/>
          }
          <Appbar.Content title={<Text variant={!!tamanioTitulo ? tamanioTitulo : 'headlineLarge'} style={{width:"100%",textAlign:"center",color: theme.colors.onPrimary }} >{titulo}</Text>} titleStyle={{ color: theme.colors.primary}} />
          <AccesoNotificaciones />
        </Appbar.Header>
    )
}