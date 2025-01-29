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
import VistaFamiliar from "./pantallas/vista-familiar";

// Basandose en ores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
import lightheme from '../assets/light-theme.json'
import BotonAlerta from "./componentes/botones/botonAlerta";
import Extravio from "./pantallas/extraviado";
import ConfirmarExtravio from "./pantallas/confirmar-extravio";
import Notificaciones from "./pantallas/notificaciones";
import Perfil from "./pantallas/perfil";
import FAQ from "./pantallas/faq";
import VistaExtravio from "./pantallas/vista-extavio";

const theme = {
  ...DefaultTheme,
  colors: lightheme.colors,
};

export default function Layout() {
  
  //  return (   
  //    <PaperProvider theme={theme}>
  //      <SafeAreaProvider>
  //        <Head>
  //          <title>Expo Router Layouts Demo</title>
  //          <meta name="description" content="Expo Router Layouts Demo" />
  //        </Head>
  //        <Stack>
  //          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  //          <Stack.Screen
  //              name="vista-familiar"
  //              options={{ headerShown: false }}
  //          />
  //        </Stack>
  //      </SafeAreaProvider>
  //    </PaperProvider>
  //  );
  const Stack = createNativeStackNavigator();
  
  const [visible, setVisible] = useState(true);
  
  const navigationRef = useNavigationContainerRef();

  return (   
    <PaperProvider theme={theme} >
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef} independent={true} onStateChange={(state) => state?.routes.length && state.routes.length > 1 ? setVisible(false) : setVisible(true)}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false}} >
            <Stack.Screen name="Home" component={Home} options={{ headerShown:false }} />
            <Stack.Screen name="Familiar" component={VistaFamiliar} options={{ headerShown:false }}/>
            <Stack.Screen name="Extravio" component={Extravio} options={{ headerShown:false }} />
            <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown:false }} />
            <Stack.Screen name="Notificaciones" component={Notificaciones} options={{ headerShown:false }} />
            <Stack.Screen name="ConfirmarExtravio" component={ConfirmarExtravio} options={{ headerShown:false }} />
            <Stack.Screen name="Faq" component={FAQ} options={{ headerShown:false }} />
            <Stack.Screen name="VistaExtravio" component={VistaExtravio} options={{ headerShown:false }} />
            
          </Stack.Navigator>
        </NavigationContainer>
        <BotonAlerta showButton={visible} onPress={(ruta: string) => navigationRef.current && navigationRef.current.navigate(ruta)}/>
      </SafeAreaProvider>
    </PaperProvider>
  );
}