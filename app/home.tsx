import { useEffect, useState } from "react";
import VistaFamilia from "./(tabs)";
import VistaCasos from "./(tabs)/casos";
import VistaAdopcionnes from "./(tabs)/adopciones";
import {
    Appbar ,
    BottomNavigation
  } from 'react-native-paper';

export default function Home() {
    const [index, setIndex] = useState(1);
    const [routes] = useState([
      { key: 'adopciones', title: 'Adopciones', focusedIcon: 'album' },
      { key: 'familia', title: 'Mi familia', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
      { key: 'casos', title: 'Casos', focusedIcon: 'history' },
    ]);
  
    const renderScene = BottomNavigation.SceneMap({
      adopciones: VistaAdopcionnes,
      familia: VistaFamilia,
      casos: VistaCasos
    });
    
    return (
        <>
          <Appbar.Header>
            <Appbar.Content title={routes[index].title} />
          </Appbar.Header>
          <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
              />
        </>
    );
}
