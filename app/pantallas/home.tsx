import React, { useState } from "react";
import VistaFamilia from "../bottomNavs/familia";
import VistaCasos from "../bottomNavs/casos";
import VistaAdopcionnes from "../bottomNavs/adopciones";
import {
  BottomNavigation,
  useTheme
} from 'react-native-paper';
import AppbarNav from "../componentes/navegacion/appbarNav";
import FondoGradiente from "../fondoGradiente";

export default function Home() {
  const theme = useTheme()
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
    </FondoGradiente>
  );
}
