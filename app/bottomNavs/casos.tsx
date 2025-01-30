import { ScrollView, View } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal";
import BannerInfo from "../componentes/bannerInfo";

export default function VistaCasos() {
  
  return (
    <View style={{height: '100%'}}>
          <BannerInfo texto="Aquí podrás todos los casos de compañeros perdidos y avistados" />
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
