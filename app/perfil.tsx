import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={ styles.container }>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Text>Acá va el perfil de usuario.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 'auto',
    alignItems: "center",
  }
});