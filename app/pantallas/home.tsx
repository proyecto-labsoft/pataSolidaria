import React, { useState, useMemo } from "react";
import VistaFamilia from "../bottomNavs/familia";
import VistaCasos from "../bottomNavs/casos";
import VistaAdopcionnes from "../bottomNavs/adopciones";
import {
  BottomNavigation,
  useTheme
} from 'react-native-paper';
import AppbarNav from "../componentes/navegacion/appbarNav";
import FondoGradiente from "../fondoGradiente";
import BotonAlerta from "../componentes/botones/botonAlerta";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import BotonCrearFamiliar from "../componentes/botones/BotonCrearFamiliar";

export default function Home() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [index, setIndex] = useState(1);
  const [routes] = useState([
    { key: 'adopciones', title: 'Adopciones', focusedIcon: 'album',color:'yellow'},
    { key: 'casos', title: 'Casos', focusedIcon: 'history' },
    { key: 'familia', title: 'Familia', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
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
        barStyle={{ width:'100%',overflow:'hidden',backgroundColor:'transparent'}}
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
