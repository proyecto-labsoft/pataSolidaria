import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Appbar, useTheme, Text as TextPaper, Divider, Button, BottomNavigation } from "react-native-paper";
import React,{ useState } from "react";
import FormularioEditarPerfil from "./componentes/formularios/formularioEditarPerfil";

interface Props {
  data: string | boolean,
  label: string,
  icono?: React.ReactNode
}

export default function Notificaciones() {
  const navigation = useNavigation();
  const theme = useTheme()
  const [edicion, setEdicion] = useState(false);
  
  const Notificacion = ({label,data,icono}: Props) => {
    return (
      <View style={{alignItems: "flex-start",width:"100%"}}>  
        <TextPaper variant='titleSmall' style={{textAlign:"left",width:"100%", color: theme.colors.onSurface}}>{label}</TextPaper>
        <Divider style={{ width: '100%', height: 1, backgroundColor: theme.colors.outlineVariant, borderRadius: 20 }} />
        <TextPaper variant='titleMedium' style={{width:"100%",textAlign:"left",color: theme.colors.onSurface }}>{data}</TextPaper>
      </View>
    );
  }

  const handleChange = () => setEdicion(!edicion);

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surface, width: '100%',marginHorizontal: 4,marginVertical:8}} >
        <Appbar.Action icon="arrow-left" iconColor={theme.colors.onPrimary} containerColor={theme.colors.primary} onPress={() => navigation.goBack()} />
        <Appbar.Content title={<TextPaper variant='headlineLarge' style={{width:"100%",textAlign:"center",color: theme.colors.onSurface }} >Notificaciones</TextPaper>} titleStyle={{ color: theme.colors.primary,textAlign: "center" }} />
        <Appbar.Action icon="bell-outline" iconColor={theme.colors.primary} onPress={() => navigation.navigate("Home")} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 'auto',
    alignItems: "center",
  }
});