import { useRouter } from "expo-router";
import { StyleSheet, ScrollView, Image,Text, View, Pressable } from "react-native";
import { FlatList } from "react-native-reanimated/lib/typescript/Animated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { Avatar, Button, Card, Text as PaperText, useTheme } from 'react-native-paper';

export default function VistaFamilia() {
  const theme = useTheme();  
  const router = useRouter();
  const navigation = useNavigation();
  

  return (
    
    <SafeAreaView>
      <ScrollView
        style={{...styles.scrollview, backgroundColor: theme.colors.primary}}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {/* <FlatList
          data={}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            Manera de renderizar mas de u familiar en una lista
          )}

        > */}
          {/* <Pressable
            onPress={() => navigation.navigate("Familiar")}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
              },
            ]}
          >
            <View
              style={ styles.cardAnimal }
            >
              <Image
                source={{ uri: "https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg" }}
                style={ styles.fotoAnimal }
              />
              <Text>Chili</Text>
            </View>
          </Pressable> */}
          <Pressable
            onPress={() => navigation.navigate("Familiar")}
            style={({pressed}) => [
              {
                ...styles.cardAnimal,
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
              },
            ]}
            
          >
            <Card >
              <Card.Cover  style={ styles.fotoAnimal } source={{ uri: 'https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg' }} />
              <Card.Title title="Chili" subtitle="(componete card)" titleVariant="titleLarge"  />
            </Card>
          </Pressable>
      </ScrollView>
      <Text >Lo azul es el Scrollview</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  scrollview: {
    margin: 20,
    height: 200,
  },
  cardAnimal: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    width: '100%',
    height: 'auto',
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
  },
  fotoAnimal: {
    width: '100%',
    height: 'auto',
    resizeMode: 'cover',
    aspectRatio: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
  },
});
