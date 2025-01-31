import { ScrollView, View } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal";
import DescripcionVista from "../componentes/descripcionVista";

export default function VistaAdopciones() {
  
  return (
    <View  style={{height: '100%'}}>
        <DescripcionVista texto="Compañeros en adopción bajo el cuidado de la asociación" />
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

