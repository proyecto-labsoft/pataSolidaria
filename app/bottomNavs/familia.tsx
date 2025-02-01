import { ScrollView, View } from "react-native";
import { Divider,useTheme, Button } from 'react-native-paper'
import CardFamiliar from "../componentes/cards/cardFamiliar";
import CardUsuario from "../componentes/cards/cardUsuarios";
import DescripcionVista from "../componentes/descripcionVista";

export default function VistaFamilia() {
  const theme = useTheme(); 
  
  return (
      <View style={{flex:1}}>
          <DescripcionVista texto="Aquí podrás ver la información de tus familiares" />
        
          <ScrollView contentContainerStyle={{ alignItems: "center",gap:40,padding:20,width: '100%'}}>
          <CardUsuario />
          <Divider style={{ width: '70%', height: 2, backgroundColor: theme.colors.outlineVariant, borderRadius: 20 }} />
          <Button icon="plus" mode="contained" onPress={() => console.log('Pressed')} style={{width: '90%'}}>
            Cargar nuevo familiar
          </Button>
          
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
              
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Chili', especie: 'Canino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Duque', especie: 'Canino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Duque', especie: 'Canino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
              
          </ScrollView>          
        </View>
  );
}
