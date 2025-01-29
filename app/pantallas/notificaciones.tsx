import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { useTheme, Text as TextPaper, Divider } from "react-native-paper";
import React,{ useState } from "react";
import AppbarNav from "../componentes/navegacion/appbarNav";

interface Props {
  data: string | boolean,
  label: string,
  icono?: React.ReactNode
}

const Notificacion = ({label,data,icono}: Props) => {
  return (
    <View style={{alignItems: "flex-start",width:"100%"}}>  
      <TextPaper variant='titleSmall' style={{textAlign:"left",width:"100%", color: theme.colors.onSurface}}>{label}</TextPaper>
      <Divider style={{ width: '100%', height: 1, backgroundColor: theme.colors.outlineVariant, borderRadius: 20 }} />
      <TextPaper variant='titleMedium' style={{width:"100%",textAlign:"left",color: theme.colors.onSurface }}>{data}</TextPaper>
    </View>
  );
}

export default function Notificaciones() {
  
  const [edicion, setEdicion] = useState(false);

  const handleChange = () => setEdicion(!edicion);

  return (
    <AppbarNav titulo="Notificaciones" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 'auto',
    alignItems: "center",
  }
});