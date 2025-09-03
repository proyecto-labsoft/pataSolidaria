import { SafeAreaProvider } from "react-native-safe-area-context";
import React,{ useState } from "react";  
// Usar tema Material https://callstack.github.io/react-native-paper/docs/guides/theming#using-schemes
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';

import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./pantallas/home";
import VistaFamiliar from "./pantallas/vistaFamiliar";

// Basandose en ores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
import lightheme from '../assets/light-theme.json'
import BotonAlerta from "./componentes/botones/botonAlerta";
import ConfirmarBuscado from "./pantallas/confirmar-buscado";
import Notificaciones from "./pantallas/notificaciones";
import Perfil from "./pantallas/perfil";
import FAQ from "./pantallas/faq";
import VistaExtravio from "./pantallas/vistaExtravio";
import NuevoAvistamiento from "./pantallas/nuevoAvistamiento";
import FondoGradiente from "./fondoGradiente";
import NuevoExtraviado from "./pantallas/nuevoExtraviado";
import NuevoBuscado from "./pantallas/nuevoBuscado";
import NuevoFamiliar from "./pantallas/nuevoFamiliar";
import QueryClientProviderBase from "./api/QueryClientProviderBase";

// gris azulado: rgba(250, 107, 107, 1)",
// naranja pastel: rgba (211, 157, 135, 1)
const theme = {
  ...DefaultTheme,
  colors: lightheme.colors,
};

export default function Layout() {
  const Stack = createNativeStackNavigator();
  
  const [visible, setVisible] = useState(true);
  
  const navigationRef = useNavigationContainerRef();

  return (   
    <PaperProvider theme={theme} >
      <QueryClientProviderBase>
      <SafeAreaProvider>
        <FondoGradiente>
        <NavigationContainer ref={navigationRef} independent={true} onStateChange={(state) => state?.routes.length && state.routes.length > 1 ? setVisible(false) : setVisible(true)}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ contentStyle:{backgroundColor:'transparent'},headerShown: false}} >
            <Stack.Screen name="Home" component={Home} options={{ headerShown:false }} />
            <Stack.Screen name="Familiar" component={VistaFamiliar} options={{ headerShown:false }}/>
            <Stack.Screen name="NuevoBuscado" component={NuevoBuscado} options={{ headerShown:false }} />
            <Stack.Screen name="NuevoExtraviado" component={NuevoExtraviado} options={{ headerShown:false }} />
            <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown:false }} />
            <Stack.Screen name="Notificaciones" component={Notificaciones} options={{ headerShown:false }} />
            <Stack.Screen name="ConfirmarBuscado" component={ConfirmarBuscado} options={{ headerShown:false }} />
            <Stack.Screen name="Faq" component={FAQ} options={{ headerShown:false }} />
            <Stack.Screen name="VistaExtravio" component={VistaExtravio} options={{ headerShown:false }} />
            <Stack.Screen name="NuevoAvistamiento" component={NuevoAvistamiento} options={{ headerShown:false }} />
            <Stack.Screen name="NuevoFamiliar" component={NuevoFamiliar} options={{ headerShown:false }} />
          </Stack.Navigator>
        </NavigationContainer>
        <BotonAlerta showButton={visible} onPress={(ruta: string) => navigationRef.current && navigationRef.current.navigate(ruta)}/>
        </FondoGradiente>
      </SafeAreaProvider>
      </QueryClientProviderBase>
    </PaperProvider>
  );
}