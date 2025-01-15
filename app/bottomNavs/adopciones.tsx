import {ScrollView,StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardFamiliar from "../componentes/cardFamiliar";
import CardAdopcion from "../componentes/cardAdopcion";
import { Text, useTheme } from "react-native-paper";

export default function VistaAdopcionnes() {
  const theme = useTheme()
  return (
    <View>
        <Text style={{textAlign: 'center',color:theme.colors.secondary}}>Compañeros en adopción bajo el cuidado de la asociación</Text>
        <ScrollView
          style={ styles.scrollView }
          contentContainerStyle={{ alignItems: "center"  ,width: '100%'}}
        >
          <View style={{flexDirection: 'row'}}>
            <CardAdopcion style={ styles.cardAdopcion } navigateTo="Familiar" data={{nombre: 'Chili', especie: 'Canino'}} />
            <CardAdopcion style={ styles.cardAdopcion } navigateTo="Familiar" data={{nombre: 'Duque', especie: 'Canino'}} />
            
          </View>
          <View style={{flexDirection: 'row', width:'100%'}}>
            <CardAdopcion style={ styles.cardAdopcion } navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
            <CardAdopcion style={ styles.cardAdopcion } navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
          </View>
          <View style={{flexDirection: 'row', width:'100%'}}>
            <CardAdopcion style={ styles.cardAdopcion } navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
            <CardAdopcion style={ styles.cardAdopcion } navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
          </View>
          <View style={{flexDirection: 'row', width:'100%'}}>
            <CardAdopcion style={ styles.cardAdopcion } navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
            <CardAdopcion style={ styles.cardAdopcion } navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
          </View>
          <View style={{flexDirection: 'row', width:'100%'}}>
            <CardAdopcion style={ styles.cardAdopcion } navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
            <CardAdopcion style={ styles.cardAdopcion } navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
          </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%'
  },
  containerScroll: {
    paddingBottom: 20,
    borderRadius: 10,
  },
  cardAdopcion: {
    margin: 5,
  }
});

