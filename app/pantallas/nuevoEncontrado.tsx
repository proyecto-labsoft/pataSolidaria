import React,{useEffect, useState} from "react"
import { StyleSheet, ScrollView, View } from "react-native";
import { useTheme } from 'react-native-paper';
import CardFamiliar from "../componentes/cards/cardFamiliar";
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
import { useNavigation } from "../types/react-navigation";
import { LinearGradient } from "expo-linear-gradient";

export default function NuevoEncontrado() {
    return (
            <>
                <AppbarNav titulo="Seleccione un familiar" />     
                
                <SafeAreaView style={{ alignItems: "center",flex:1}}>   
                    <View style={{marginHorizontal:10}}>
                        <ScrollView
                            style={ styles.scrollView }
                            contentContainerStyle={{ alignItems: "center" }}
                        >
                            <CardFamiliar navigateTo="ConfirmarExtravio" data={{nombre: 'Chili', especie: 'Canino'}} />
                            <CardFamiliar navigateTo="ConfirmarExtravio" data={{nombre: 'Duque', especie: 'Canino'}} />
                            <CardFamiliar navigateTo="ConfirmarExtravio" data={{nombre: 'Draco', especie: 'Canino'}} />
                            <CardFamiliar navigateTo="ConfirmarExtravio" data={{nombre: 'Sur', especie: 'Felino'}} />
                        </ScrollView>
                    </View>
                    
                </SafeAreaView>
            </>
        )
}
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex:1
    },
    scrollView: {
        marginTop:5,
    
    },
    containerScroll: {
    paddingBottom: 20,
    borderRadius: 10,
    margin: 12,
    },
    input:{
    marginBottom: 16,
    },
    fotoFamiliar: {
        marginTop: 35,
    },
    nombreFamiliar: {
        // borderBottomWidth: 1,
        // borderEndColor: 'black',
        textAlign: 'center',
        width: 150,
        padding: 15,
    },
    cardFamiliar: {
    marginVertical: 5,
    },
});