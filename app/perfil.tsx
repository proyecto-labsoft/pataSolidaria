import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Appbar, useTheme, Text as TextPaper } from "react-native-paper";
import { useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import FormularioEditarPerfil from "./componentes/formularios/formularioEditarPerfil";
import BotonEditar from './componentes/botones/botonEditar';

interface Props {
  data: string | boolean,
  label: string,
  icono?: React.ReactNode
}

export default function Index() {
  const navigation = useNavigation();
  const theme = useTheme()
  const [edicion, setEdicion] = useState(false);
  const [datosPerfil, setDatosFamiliar] = useState({
    nombre: 'Delospalotes, Juan',
    celular: '2901-547800',
    domicilio: 'Puerto Argentino 1281'
  });

  const Item = ({label,data,icono}: Props) => {
    return <>
        <View style={{flexDirection: 'row', alignItems:'center',padding: "5%",backgroundColor: theme.colors.tertiary, borderRadius: 20, paddingVertical: 8}}>
            {!!icono && <FontAwesome6 name={icono} style={{color: "#efefef"}} size={24} />}
            <TextPaper variant='titleMedium' style={{color: '#efefef', marginLeft: "5%"}}>{label}</TextPaper>
        </View>
        <TextPaper variant='titleMedium' style={{paddingLeft:16,color: theme.colors.primary }}>{data}</TextPaper>
      </>;
  }

  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface, width: '100%', justifyContent:'space-between'}} >
          <Appbar.Action icon="arrow-left-bold" iconColor={theme.colors.primary} onPress={() => navigation.goBack()} />
          <Appbar.Content title="Perfil del usuario" titleStyle={{ color: theme.colors.primary }} />
          {/* <Appbar.Action icon="account" iconColor={theme.colors.onSecondary} onPress={() => navigation.navigate("Perfil")} /> */}
        </Appbar.Header>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor:theme.colors.surface
        }}
      >
        {!edicion
          ? (<View>
                <Item label='Nombre' data={datosPerfil?.nombre} icono='pen-clip' />
                <Item label='Celular' data={datosPerfil?.celular} icono='hippo' />
                <Item label='Domicilio' data={datosPerfil?.domicilio} icono='house' />
            </View>)
          : <FormularioEditarPerfil data={datosPerfil} onSumbit={setEdicion} />
        }

        <BotonEditar showButton={!edicion} onPress={(e: boolean) => setEdicion(e)} />
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