import {useState} from "react"
import { StyleSheet, ScrollView, Image,Text, View, Pressable } from "react-native";
import {
    Appbar,
    Avatar,
    BottomNavigation,
    useTheme
  } from 'react-native-paper';
import CardFamiliar from "./componentes/cardFamiliar";
import { useNavigation } from "@react-navigation/native";
import { TakePictureBtn } from '@/src/components/TakePictureBtn';
import FormularioEditarFamiliar from "./componentes/formularios/formularioEditarFamiliar ";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Extravio() {
    const theme = useTheme();
    const [edicion, setEdicion] = useState(false);
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
      domicilio: 'Puerto español 844'
    });
    const navigation = useNavigation();
    
    return (
        < >          
            <Appbar.Header style={{ backgroundColor: theme.colors.surface, width: '100%', justifyContent:'space-between'}} >
                <Appbar.Action icon="arrow-left-bold" iconColor={theme.colors.primary} onPress={() => navigation.goBack()} />
                <Appbar.Content title="Seleccione un familiar" titleStyle={{ color: theme.colors.primary }} />
            </Appbar.Header>
            <SafeAreaView style={{ alignItems: "center",flex:1,backgroundColor: theme.colors.surface}}>
                <View style={{marginHorizontal:10}}>
                    <ScrollView
                        style={ styles.scrollView }
                        contentContainerStyle={{ alignItems: "center" }}
                    >
                        <CardFamiliar style={ styles.cardFamiliar } navigateTo="ConfirmarExtravio" data={{nombre: 'Chili', especie: 'Canino'}} />
                        <CardFamiliar style={ styles.cardFamiliar } navigateTo="ConfirmarExtravio" data={{nombre: 'Duque', especie: 'Canino'}} />
                        <CardFamiliar style={ styles.cardFamiliar } navigateTo="ConfirmarExtravio" data={{nombre: 'Draco', especie: 'Canino'}} />
                        <CardFamiliar style={ styles.cardFamiliar } navigateTo="ConfirmarExtravio" data={{nombre: 'Sur', especie: 'Felino'}} />
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