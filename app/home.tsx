import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import VistaFamilia from "./bottomNavs/familia";
import VistaCasos from "./bottomNavs/casos";
import VistaAdopcionnes from "./bottomNavs/adopciones";
import {
  Appbar,
  BottomNavigation,
  useTheme
} from 'react-native-paper';

export default function Home() {
  const theme = useTheme()
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
  
  const navigation = useNavigation();

  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }} >
        <Appbar.Content title={routes[index].title} titleStyle={{ color: theme.colors.primary, textAlign: "center" }} />
        <Appbar.Action icon="account" iconColor={theme.colors.primary} onPress={() => navigation.navigate("Perfil")} />
      </Appbar.Header>
      <BottomNavigation
        barStyle={{ backgroundColor: theme.colors.surface }}
        inactiveColor={ theme.colors.primary}
        activeColor={ theme.colors.primary}
        activeIndicatorStyle={{ backgroundColor: theme.colors.inversePrimary}}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
}
