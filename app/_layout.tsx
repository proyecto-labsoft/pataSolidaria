import { SafeAreaProvider } from "react-native-safe-area-context";

// Usar tema Material https://callstack.github.io/react-native-paper/docs/guides/theming#using-schemes
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./home";
import VistaFamiliar from "./vista-familiar";
import Perfil from "./perfil";

// Basandose en ores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
import lightheme from '../assets/light-theme.json'
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

  return (   
    <PaperProvider theme={theme} >
      <SafeAreaProvider>
        <NavigationContainer independent={true}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} options={{ headerShown:false }} />
            <Stack.Screen name="Familiar" component={VistaFamiliar} options={{ headerShown:false }}/>
            <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown:false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}