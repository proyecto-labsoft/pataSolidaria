import { StyleSheet, ScrollView, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider,useTheme,ActivityIndicator,Text,   Appbar, Avatar, IconButton } from 'react-native-paper'

import CardFamiliar from "../componentes/cardFamiliar";
import BotonAlerta from "../componentes/botonAlerta";

export default function VistaFamilia() {
  const theme = useTheme()
  return (
      <View style={{marginHorizontal:10}}>
        <Text style={{textAlign: 'center',color:theme.colors.secondary}}>Aquí podrás ver la información de tus familiares</Text>
        <ScrollView
          style={ styles.scrollView }
          contentContainerStyle={{ alignItems: "center" }}
        >
          {/* <FlatList
            data={}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              Manera de renderizar mas de u familiar en una lista
            )}
          > 
            <Pressable
              onPress={() => navigation.navigate("Familiar")}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                },
              ]
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
            <CardFamiliar style={ styles.cardFamiliar } navigateTo="Familiar" data={{nombre: 'Chili', especie: 'Canino'}} />
            <CardFamiliar style={ styles.cardFamiliar } navigateTo="Familiar" data={{nombre: 'Duque', especie: 'Canino'}} />
            <CardFamiliar style={ styles.cardFamiliar } navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
            <CardFamiliar style={ styles.cardFamiliar } navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
            
        </ScrollView>

      </View>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    marginTop: 5,
  },
  containerScroll: {
    paddingBottom: 20,
    borderRadius: 10,
    margin: 12,
  },
  cardFamiliar: {
    marginVertical: 15,
  },
  
});
