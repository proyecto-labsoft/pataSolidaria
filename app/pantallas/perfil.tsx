import { View } from "react-native";
import { useTheme, Text as TextPaper, Divider, Button } from "react-native-paper";
import React,{ useState } from "react";
import FormularioEditarPerfil from "../componentes/formularios/formularioEditarPerfil";
import AppbarNav from "../componentes/navegacion/appbarNav";
import { useForm } from "react-hook-form";

interface Props {
  data: string | boolean,
  label: string,
  icono?: React.ReactNode
}

export default function Perfil() {

  const theme = useTheme()
  const [edicion, setEdicion] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: 'Delospalotes, Juan',
    celular: '2901-547800',
    domicilio: 'Puerto Argentino 1281'
  });
  
  const { control, handleSubmit, formState: {errors} } = useForm({defaultValues: datosPerfil});

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

  const onSumbit = (e: any) => {
    setEdicion(!edicion)
  };

  return (
      <View>
        <AppbarNav titulo="Mis datos" />
        {!edicion
          ? (<View style={{margin: 30, gap:30,alignItems: "center"}}>
                {/* <Item label='Nombre de usuario' data={datosPerfil?.nombre} /> */}
                <Item label='Nombre real' data={datosPerfil?.nombre} />
                <Item label='Número de teléfono' data={datosPerfil?.celular} />
                <Item label='Domicilio' data={datosPerfil?.domicilio} />
                <Button icon="pencil" buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary} disabled={edicion} style={{ marginVertical: 8,borderRadius:50}} uppercase mode="contained" onPress={() => setEdicion(true)}>
                  Editar información
                </Button>
            </View>)
          : <FormularioEditarPerfil data={datosPerfil} onSumbit={handleSubmit(onSumbit)} control={control}/>
        }
      </View>
  );
}