import { View, Alert, ActivityIndicator } from "react-native";
import { useTheme, Text as TextPaper, Divider, Button } from "react-native-paper";
import React,{ useState, useEffect } from "react";
import FormularioEditarPerfil from "../componentes/formularios/formularioEditarPerfil";
import AppbarNav from "../componentes/navegacion/appbarNav";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  data: string | boolean,
  label: string,
  icono?: React.ReactNode
}

export default function Perfil() {

  const theme = useTheme()
  const { user, logout, userProfile, loadUserProfile, updateUserProfile } = useAuth();
  const [edicion, setEdicion] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: '',
    celular: '',
    domicilio: '',
    email: user?.email || ''
  });
  
  const { control, handleSubmit, reset } = useForm({defaultValues: datosPerfil});

  // Cargar el perfil cuando el componente se monta
  useEffect(() => {
    const cargarPerfil = async () => {
      if (userProfile) {
        // Si ya tenemos el perfil en el contexto, usarlo
        const perfil = {
          nombre: userProfile.nombre || user?.displayName || '',
          celular: userProfile.celular || '',
          domicilio: userProfile.direccion || '',
          email: userProfile.email || user?.email || ''
        };
        setDatosPerfil(perfil);
        reset(perfil);
      } else {
        // Si no, cargarlo del backend
        setCargando(true);
        const profile = await loadUserProfile();
        if (profile) {
          const perfil = {
            nombre: profile.nombre || user?.displayName || '',
            celular: profile.celular || '',
            domicilio: profile.direccion || '',
            email: profile.email || user?.email || ''
          };
          setDatosPerfil(perfil);
          reset(perfil);
        }
        setCargando(false);
      }
    };

    cargarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, user]);

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

  const onSumbit = async (formData: any) => {
    setCargando(true);
    console.log('📝 Guardando perfil:', formData);
    
    const success = await updateUserProfile(
      formData.nombre,
      formData.celular,
      formData.domicilio
    );
    
    if (success) {
      // Actualizar el estado local con los nuevos datos
      setDatosPerfil({
        nombre: formData.nombre,
        celular: formData.celular,
        domicilio: formData.domicilio,
        email: datosPerfil.email
      });
      setEdicion(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } else {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
    
    setCargando(false);
  };

  const onCancel = () => {
    // Restaurar los valores originales del formulario
    reset(datosPerfil);
    setEdicion(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
            // La navegación al Login se maneja automáticamente por el AuthNavigator
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View>
        <AppbarNav titulo="Mis datos" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <TextPaper style={{ marginTop: 10 }}>Cargando perfil...</TextPaper>
        </View>
      </View>
    );
  }

  return (
      <View>
        <AppbarNav titulo="Mis datos" />
        {!edicion
          ? (<View style={{margin: 30, gap:30,alignItems: "center"}}>
                {/* <Item label='Nombre de usuario' data={datosPerfil?.nombre} /> */}
                <Item label='Nombre real' data={datosPerfil?.nombre || 'No especificado'} />
                <Item label='Email' data={datosPerfil?.email} />
                <Item label='Número de teléfono' data={datosPerfil?.celular || 'No especificado'} />
                <Item label='Domicilio' data={datosPerfil?.domicilio || 'No especificado'} />
                <Button icon="pencil" buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary} disabled={edicion} style={{ marginVertical: 8,borderRadius:50}} uppercase mode="contained" onPress={() => setEdicion(true)}>
                  Editar información
                </Button>
                <Button 
                  icon="logout" 
                  buttonColor={theme.colors.error} 
                  textColor={theme.colors.onError} 
                  style={{ marginVertical: 8, borderRadius:50, width: '100%' }} 
                  uppercase 
                  mode="contained" 
                  onPress={handleLogout}
                >
                  Cerrar Sesión
                </Button>
            </View>)
          : <FormularioEditarPerfil data={datosPerfil} onSumbit={handleSubmit(onSumbit)} onCancel={onCancel} control={control}/>
        }
      </View>
  );
}