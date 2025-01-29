import { ScrollView, View } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal";
import { Banner, Text, useTheme } from "react-native-paper";

export default function VistaCasos() {
  const theme = useTheme()
  
  return (
    <View style={{height: '100%'}}>
          <Banner icon="information"  visible style={{margin: 10, borderRadius: 20,backgroundColor: theme.colors.tertiaryContainer}}>
            <Text style={{textAlign: 'center',color:theme.colors.onTertiaryContainer}}>Aquí podrás todos los casos de compañeros perdidos y avistados</Text>
          </Banner>
          <ScrollView
            contentContainerStyle={{justifyContent:'center', alignItems: "flex-start"}}
          >
            <View style={{flexDirection: 'row', width: '100%'}}>
              <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Chili', especie: 'Canino'}} />
              <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Duque', especie: 'Canino'}} />
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Draco', especie: 'Canino'}} />
              <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Sur', especie: 'Felino'}} />
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Draco', especie: 'Canino'}} />
              <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Sur', especie: 'Felino'}} />
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Draco', especie: 'Canino'}} />
              <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Sur', especie: 'Felino'}} />
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Draco', especie: 'Canino'}} />
              <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Sur', especie: 'Felino'}} />
            </View>
          </ScrollView>
    </View> 
  );
}
