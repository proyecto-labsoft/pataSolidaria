import React, { useState, useMemo } from "react";
import VistaFamilia from "../bottomNavs/familia";
import VistaCasos from "../bottomNavs/casos";
import VistaAdopcionnes from "../bottomNavs/adopciones";
import {
  BottomNavigation,
  useTheme,
  Text
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppbarNav from "../componentes/navegacion/appbarNav";
import FondoGradiente from "../fondoGradiente";
import BotonAlerta from "../componentes/botones/botonAlerta";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import BotonCrearFamiliar from "../componentes/botones/BotonCrearFamiliar";
import PetFriendlyHotelIcon from "../componentes/iconos/PetFriendlyHotelIcon";
import FluentMegaphoneIcon from "../componentes/iconos/FluentMegaphoneIcon";
import HomeHeartIcon from "../componentes/iconos/HomeHeartIcon";

export default function Home() {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(1);
  const [routes] = useState([
    { 
      key: 'adopciones',  
      title: <Text variant="labelLarge" style={{  fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center' }}>ADOPCIONES</Text>,
      focusedIcon: ({ color, size }: { color: string; size: number }) => <PetFriendlyHotelIcon width={size} height={size} color={color} />,
      unfocusedIcon: ({ color, size }: { color: string; size: number }) => <PetFriendlyHotelIcon width={size} height={size} color={color} />
    },
    { 
      key: 'casos', 
      title: <Text variant="labelLarge" style={{  fontWeight:  'bold',color: theme.colors.primary, textAlign: 'center' }}>CASOS</Text>,
      focusedIcon: ({ color, size }: { color: string; size: number }) => <FluentMegaphoneIcon width={size} height={size} color={color} />,
      unfocusedIcon: ({ color, size }: { color: string; size: number }) => <FluentMegaphoneIcon width={size} height={size} color={color} />
    },
    { 
      key: 'familia', 
      title: <Text variant="labelLarge" style={{  fontWeight:  'bold',color: theme.colors.primary, textAlign: 'center' }}>FAMILIA</Text>,
      focusedIcon: ({ color, size }: { color: string; size: number }) => <HomeHeartIcon width={size} height={size} color={color} />,
      unfocusedIcon: ({ color, size }: { color: string; size: number }) => <HomeHeartIcon width={size} height={size} color={color} />
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    adopciones: VistaAdopcionnes,
    familia: VistaFamilia,
    casos: VistaCasos,
  });

  const navState = useNavigationState(state => state);

  const isTabRoot = navState?.index === 0 // Para saber si esta en la raiz del tab, es el stack de navegacion

  const shouldShowBotonCrearFamiliar = useMemo(() => routes[index].key === 'familia' && isTabRoot,[index, routes, isTabRoot]);

  const shouldShowBotonAlerta = useMemo(() => routes[index].key === 'casos' && isTabRoot, [index, routes, isTabRoot]);

  return (
    <FondoGradiente>
      <AppbarNav titulo={routes[index].title} />
      <BottomNavigation
        theme={{colors:{background:'transparent'}}}
        barStyle={{ 
          width:'100%',
          backgroundColor:'transparent',
        }}
        labeled
        inactiveColor={ theme.colors.primary}
        activeColor={ theme.colors.primary}
        activeIndicatorStyle={{ backgroundColor: theme.colors.primaryContainer}}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene} 
      />
      
      <BotonAlerta 
        showButton={shouldShowBotonAlerta} 
        onPress={(ruta: string) => navigation.navigate(ruta as never)}
      />
      <BotonCrearFamiliar
        showButton={shouldShowBotonCrearFamiliar} 
        onPress={(ruta: string) => navigation.navigate(ruta as never)}
      />
    </FondoGradiente>
  );
}
