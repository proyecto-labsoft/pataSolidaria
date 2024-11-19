import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { Appbar,useTheme } from "react-native-paper";

export default function Index() {
  const navigation = useNavigation();
  const theme = useTheme()

  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface, width: '100%', justifyContent:'space-between'}} >
          <Appbar.Action icon="arrow-left-bold" iconColor={theme.colors.primary} onPress={() => navigation.goBack()} />
          <Appbar.Content title="Perfil del usuario" titleStyle={{ color: theme.colors.primary }} />
          {/* <Appbar.Action icon="account" iconColor={theme.colors.onSecondary} onPress={() => navigation.navigate("Perfil")} /> */}
        </Appbar.Header>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor:theme.colors.surface
        }}
      >
        <Text>Acá va el perfil de usuario.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 'auto',
    alignItems: "center",
  }
});