import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Appbar, useTheme, Text as TextPaper, Divider, Button, BottomNavigation } from "react-native-paper";
import React,{ useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import FormularioEditarPerfil from "./componentes/formularios/formularioEditarPerfil";
import BotonEditar from './componentes/botones/botonEditar';
import VistaFamilia from "./bottomNavs/familia";
import VistaAdopcionnes from "./bottomNavs/adopciones";
import VistaCasos from "./bottomNavs/casos";

interface Props {
  data: string | boolean,
  label: string,
  icono?: React.ReactNode
}

export default function Perfil() {
  const navigation = useNavigation();
  const theme = useTheme()
  const [edicion, setEdicion] = useState(false);
  const [datosPerfil, setDatosFamiliar] = useState({
    nombre: 'Delospalotes, Juan',
    celular: '2901-547800',
    domicilio: 'Puerto Argentino 1281'
  });

  // <>
  //       <View style={{flexDirection: 'row', alignItems:'center',padding: "5%",backgroundColor: theme.colors.tertiary, borderRadius: 20, paddingVertical: 8}}>
  //           {!!icono && <FontAwesome6 name={icono} style={{color: "#efefef"}} size={24} />}
  //           <TextPaper variant='titleMedium' style={{color: '#efefef', marginLeft: "5%"}}>{label}</TextPaper>
  //       </View>
  //       <TextPaper variant='titleMedium' style={{paddingLeft:16,color: theme.colors.primary }}>{data}</TextPaper>
  //     </>
  const Item = ({label,data,icono}: Props) => {
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
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface, width: '100%',marginHorizontal: 4,marginVertical:8}} >
          <Appbar.Action icon="arrow-left" iconColor={theme.colors.onPrimary} containerColor={theme.colors.primary} onPress={() => navigation.goBack()} />
          <Appbar.Content title={<TextPaper variant='headlineLarge' style={{width:"100%",textAlign:"center",color: theme.colors.onSurface }} >Mis datos</TextPaper>} titleStyle={{ color: theme.colors.primary,textAlign: "center" }} />
          <Appbar.Action icon="bell-outline" iconColor={theme.colors.primary} onPress={() => navigation.navigate("Perfil")} />
        </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor:theme.colors.surface
        }}
      >
        {!edicion
          ? (<View style={{margin: 30, gap:30,alignItems: "center"}}>
                <Item label='Nombre de usuario' data={datosPerfil?.nombre} />
                <Item label='Nombre real' data={datosPerfil?.nombre} />
                <Item label='Número de teléfono' data={datosPerfil?.celular} />
                <Item label='Domicilio' data={datosPerfil?.domicilio} />
                <Button icon="pencil" disabled={edicion} mode="contained" onPress={() => handleChange()}style={{width: '90%'}}>
                  Cargar nuevo familiar
                </Button>
            </View>)
          : <FormularioEditarPerfil data={datosPerfil} onSumbit={setEdicion} />
        }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 'auto',
    alignItems: "center",
  }
});