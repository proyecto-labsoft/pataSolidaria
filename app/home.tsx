import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import VistaFamilia from "./bottomNavs/familia";
import VistaCasos from "./bottomNavs/casos";
import VistaAdopcionnes from "./bottomNavs/adopciones";
import {
  Appbar,
  BottomNavigation,
  Text,
  useTheme
} from 'react-native-paper';

export default function Home() {
  const theme = useTheme()
  const [index, setIndex] = useState(1);
  const [routes] = useState([
    { key: 'adopciones', title: 'Adopciones', focusedIcon: 'album' },
    { key: 'casos', title: 'Casos', focusedIcon: 'history' },
    { key: 'familia', title: 'Familia', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    adopciones: VistaAdopcionnes,
    familia: VistaFamilia,
    casos: VistaCasos,
  });
  
  const navigation = useNavigation();

  return (
    <>
      {/* <Appbar.Header style={{ backgroundColor: theme.colors.surface}} >
        <Appbar.Content title={routes[index].title} titleStyle={{ color: theme.colors.primary, textAlign: "center" }} />
        <Appbar.Action icon="account" iconColor={theme.colors.primary} onPress={() => navigation.navigate("Notificaciones")} />
      </Appbar.Header> */}
      <Appbar.Header style={{ backgroundColor: theme.colors.surface, width: '100%',marginHorizontal: 4,marginVertical:8}} >
          {/* <Appbar.Action icon="arrow-left" iconColor={theme.colors.onPrimary} containerColor={theme.colors.primary} onPress={() => navigation.goBack()} /> */}
          <Appbar.Content title={<Text variant='headlineLarge' style={{width:"100%",textAlign:"center",color: theme.colors.onSurface }} >{routes[index].title}</Text>} titleStyle={{ color: theme.colors.primary,textAlign: "center" }} />
          <Appbar.Action icon="bell-outline" iconColor={theme.colors.primary} onPress={() => navigation.navigate("Notificaciones")} />
        </Appbar.Header>
      <BottomNavigation
        barStyle={{ width:'100%',backgroundColor: theme.colors.surface,overflow:'hidden'}}
        inactiveColor={ theme.colors.primary}
        activeColor={ theme.colors.primary}
        activeIndicatorStyle={{ backgroundColor: theme.colors.primaryContainer}}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
}
