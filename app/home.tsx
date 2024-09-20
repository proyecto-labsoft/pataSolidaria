import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import VistaFamilia from "./bottomNavs/familia";
import VistaCasos from "./bottomNavs/casos";
import VistaAdopcionnes from "./bottomNavs/adopciones";
import {
  Appbar,
  BottomNavigation,
  useTheme
} from 'react-native-paper';
import BotonAlerta from "./componentes/botonAlerta";


export default function Home() {
  const theme = useTheme()
  const [index, setIndex] = useState(1);
  const [routes] = useState([
    { key: 'adopciones', title: 'Adopciones', focusedIcon: 'album' },
    { key: 'familia', title: 'Mi familia', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
    { key: 'casos', title: 'Casos', focusedIcon: 'history' },
  ]);
  const navigation = useNavigation();

  const renderScene = BottomNavigation.SceneMap({
    adopciones: VistaAdopcionnes,
    familia: VistaFamilia,
    casos: VistaCasos
  });
  
  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.tertiary }} >
        <Appbar.Content title={routes[index].title} titleStyle={{ color: theme.colors.onSecondary, textAlign: "center" }} />
        <Appbar.Action icon="account" iconColor={theme.colors.onSecondary} onPress={() => navigation.navigate("Perfil")} />
      </Appbar.Header>
      <BotonAlerta tipo="multiple"/>
      <BottomNavigation
        barStyle={{ backgroundColor: theme.colors.tertiary }}
        inactiveColor={ theme.colors.onSecondary}
        activeColor={ theme.colors.primary}
        activeIndicatorStyle={{ backgroundColor: theme.colors.onTertiary}}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
}
