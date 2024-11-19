import {useState} from "react"
import { StyleSheet, ScrollView, Image,Text, View, Pressable } from "react-native";
import {
    Appbar,
    Avatar,
    BottomNavigation,
    useTheme
  } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { TakePictureBtn } from '@/src/components/TakePictureBtn';
import { SafeAreaView } from "react-native-safe-area-context";
import FormularioConfirmarExtravio from "./componentes/formularios/formularioConfirmarExtravio";

// TODO: Request POST para la creación de un anuncio de animal extraviado
export default function ConfirmarExtravio() {
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
            <Appbar.Header style={{ backgroundColor: theme.colors.tertiary, width: '100%', justifyContent:'space-between'}} >
                <Appbar.Action icon="arrow-left-bold" iconColor={theme.colors.onSecondary} onPress={() => navigation.goBack()} />
                <Appbar.Content title="Confirmar datos" titleStyle={{ color: theme.colors.onSecondary }} />
            </Appbar.Header>
            <SafeAreaView style={{ alignItems: "center",flex:1}}>
            <View style={{marginHorizontal:10}}>
                <ScrollView style={styles.scrollView} contentContainerStyle={ {...styles.containerScroll}}>
                    <FormularioConfirmarExtravio data={datosFamiliar} onSumbit={setEdicion}  />
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
    width: '90%',
    marginTop: 5,
    
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