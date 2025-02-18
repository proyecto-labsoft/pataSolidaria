import React, { useState } from "react"
import { StyleSheet, ScrollView, View } from "react-native";
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormularioConfirmarBuscado from "../componentes/formularios/formularioConfirmarBuscado";
import AppbarNav from "../componentes/navegacion/appbarNav";

// TODO: Request POST para la creación de un anuncio de animal extraviado
export default function ConfirmarBuscado() {
    const theme = useTheme();
    const [edicion, setEdicion] = useState(false);
    const [location, setLocation] = useState({
        latitude: -54,
        longitude: -68,
    });
    const [datosFamiliar, setDatosFamiliar] = useState({
      nombre: 'Chili',
      especie: 'Perro',
      raza: 'callejero',
      tamanio: 'grande',
      colores: 'tricolor',
      fechanac: '14/04/2021',
      observaciones: 'compañero y sociable',
      sexo: 'macho',
      esterilizado: true,
      identificado: false,
      domicilio: 'Puerto español 844',
    //   ubicacion: location,
    });
    
    const navigation = useNavigation();
    
    return (
        <>
            <AppbarNav titulo="Confirmar datos" />
            <SafeAreaView style={{ alignItems: "center",flex:1}}>
            <View style={{marginHorizontal:10,width: "100%"}}>
                <ScrollView contentContainerStyle={ {...styles.containerScroll}}>
                    
                    <FormularioConfirmarBuscado data={datosFamiliar} onSumbit={setEdicion}  />
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
    containerScroll: {
        paddingBottom: 20,
        paddingHorizontal: '5%'
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