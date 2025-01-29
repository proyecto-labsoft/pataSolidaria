import { StyleSheet, ScrollView, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider,useTheme,ActivityIndicator,Text,   Appbar, Avatar, IconButton, Button, Card, Banner } from 'react-native-paper'

import CardFamiliar from "../componentes/cards/cardFamiliar";
import BotonAlerta from "../componentes/botones/botonAlerta";
import { useNavigation } from "@react-navigation/native";

export default function VistaFamilia() {
  const theme = useTheme();  
  const navigation = useNavigation();
  return (
      <View style={{marginHorizontal:25,gap:40,alignItems: "center",height: "100%"}}>
        <Banner icon="information" visible style={{margin: 10,alignItems: "center",width: "100%" , borderRadius: 20,backgroundColor: theme.colors.tertiaryContainer}}>
          <Text style={{textAlign: 'center',width: "100%",color:theme.colors.onTertiaryContainer}}>Aquí podrás ver la información de tus familiares</Text>
        </Banner>
        <Pressable
            onPress={() => navigation.navigate("Perfil")}
            style={({pressed}) => [
            {
                width: '90%'
            },
        ]}
        >
            <Card contentStyle={{flexDirection: 'row'}} style={{backgroundColor: theme.colors.primary}} >
                {/* <Card.Cover style={ styles.fotoAnimal } source={{ uri: 'https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg' }} /> */}
                <Card.Title 
                    title="Mis datos"
                    style={{aspectRatio: 5}}
                    titleVariant="titleLarge" 
                    titleStyle={{ marginLeft: "20%", color: theme.colors.onPrimary}} 
                    leftStyle={{alignItems: 'center'}}
                    left={() => (
                        <Avatar.Image
                            source={{ uri: 'https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg' }}
                            style={ { overflow:'hidden',borderColor: theme.colors.primary,borderWidth:2} }
                            size={100}
                            onProgress={() => (<ActivityIndicator animating/>)}
                        />
                    )}
                />
            </Card>
        </Pressable>
        <Divider style={{ width: '70%', height: 2, backgroundColor: theme.colors.outlineVariant, borderRadius: 20 }} />
        <Button icon="plus" mode="contained" onPress={() => console.log('Pressed')} style={{width: '90%'}}>
          Cargar nuevo familiar
        </Button>
        <ScrollView contentContainerStyle={{ alignItems: "center"}}>
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
            <CardFamiliar style={ styles.cardFamiliar } navigateTo="Familiar" data={{nombre: 'Duque', especie: 'Canino'}} />
            <CardFamiliar style={ styles.cardFamiliar } navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
            <CardFamiliar style={ styles.cardFamiliar } navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
            
        </ScrollView>

      </View>
  );
}
const styles = StyleSheet.create({
  cardFamiliar: {
    marginVertical: 15,
  },
  
});
