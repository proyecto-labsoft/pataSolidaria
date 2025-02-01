import { ScrollView, View } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal";
import DescripcionVista from "../componentes/descripcionVista";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "react-native-paper";

export default function VistaCasos() {
  const theme = useTheme()
  return ( 
    <View style={{flex:1}}>
      <DescripcionVista texto="Aquí podrás todos los casos de compañeros perdidos y avistados" />
      <ScrollView
        contentContainerStyle={{justifyContent:'center', alignItems: "flex-start"}}
      >
        <View key={1} style={{flexDirection: 'row', width: '100%'}}>
          <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Chili', especie: 'Canino'}} />
          <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Duque', especie: 'Canino'}} />
        </View>
        <View key={2} style={{flexDirection: 'row', width: '100%'}}>
          <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Draco', especie: 'Canino'}} />
          <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Sur', especie: 'Felino'}} />
        </View>
        <View key={3} style={{flexDirection: 'row', width: '100%'}}>
          <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Draco', especie: 'Canino'}} />
          <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Sur', especie: 'Felino'}} />
        </View>
        <View key={4} style={{flexDirection: 'row', width: '100%'}}>
          <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Draco', especie: 'Canino'}} />
          <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Sur', especie: 'Felino'}} />
        </View>
        <View key={5} style={{flexDirection: 'row', width: '100%'}}>
          <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Draco', especie: 'Canino'}} />
          <CardAnimal navigateTo="VistaExtravio"  data={{nombre: 'Sur', especie: 'Felino'}} />
        </View>
      </ScrollView>
    </View> 
    
  );
}
