import {ScrollView, View } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal";
import { Banner, Text, useTheme } from "react-native-paper";

export default function VistaAdopciones() {
  const theme = useTheme()
  return (
    <View>
        <Banner icon="information"  visible style={{margin: 10, borderRadius: 20,backgroundColor: theme.colors.tertiaryContainer}}>
          <Text style={{textAlign: 'center',color:theme.colors.onTertiaryContainer}}>Compañeros en adopción bajo el cuidado de la asociación</Text>
        </Banner>
        <ScrollView
          contentContainerStyle={{justifyContent:'center', alignItems: "flex-start"}}
        >
          <View style={{flexDirection: 'row', width: '100%'}}>
            <CardAnimal navigateTo="Familiar" data={{nombre: 'Chili', especie: 'Canino'}} />
            <CardAnimal navigateTo="Familiar" data={{nombre: 'Duque', especie: 'Canino'}} />
            
          </View>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <CardAnimal navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
            <CardAnimal navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
          </View>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <CardAnimal navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
            <CardAnimal navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
          </View>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <CardAnimal navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
            <CardAnimal navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
          </View>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <CardAnimal navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
            <CardAnimal navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
          </View>
        </ScrollView>
    </View>
  );
}

