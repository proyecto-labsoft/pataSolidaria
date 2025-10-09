import React,{ useState} from "react"
import { StyleSheet, FlatList, View } from "react-native";
import CardFamiliar from "../componentes/cards/cardFamiliar";
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
import DescripcionVista from "../componentes/descripcionVista";
import { useApiGetMascotasPorUsuario } from "../api/hooks"; 
import { Text } from "react-native-paper";

export default function NuevoBuscado() {

    const {data:familiares, isFetching, refetch } = useApiGetMascotasPorUsuario({ parametros: {idUsuario: 2}}) 

    return (
        <>
            <AppbarNav titulo="Nuevo buscado" tamanioTitulo="headlineSmall"/>     
            
            <SafeAreaView style={{ alignItems: "center",flex:1}}>   
                <DescripcionVista texto="¿Qué familiar esta buscando?" />
                <View style={{marginHorizontal:10}}>
                    <FlatList
                        data={Array.isArray(familiares) ? familiares : []}
                        keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
                        contentContainerStyle={{ alignItems: "center", gap: 40, padding: 20, width: '100%' }}
                        renderItem={({ item }) => (
                            <CardFamiliar navigateTo="ConfirmarBuscado" data={item} />
                        )}
                        ListEmptyComponent={
                            <Text style={{ alignSelf: 'center', marginTop: 20 }}>No hay familiares cargados.</Text>
                        }
                    /> 
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