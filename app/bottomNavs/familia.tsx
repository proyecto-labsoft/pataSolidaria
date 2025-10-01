import React from "react";
import { FlatList, ScrollView, View } from "react-native";
import { Divider,useTheme, Button, Text } from 'react-native-paper'
import CardFamiliar from "../componentes/cards/cardFamiliar";
import CardUsuario from "../componentes/cards/cardUsuarios";
import DescripcionVista from "../componentes/descripcionVista";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useApiGetMascotasPorUsuario } from "../api/hooks";

export default function VistaFamilia() {
  const theme = useTheme(); 
  const navigation = useNavigation();

  const {data:familiares, isFetching, refetch } = useApiGetMascotasPorUsuario({ parametros: {idUsuario: 2}}) 

  
  // useFocusEffect(
  //   React.useCallback(() => {
  //     refetch();
  //   }, [])
  // );
  // console.log("#### VistaFamilia #### familiares:",familiares)
  return (
      
        <View style={{ flex: 1, marginTop: 20 }}>
          {/* <DescripcionVista texto="Aquí podrás ver la información de tus familiares" /> */}
          <View style={{width: '100%', alignItems: 'center', gap: 10, paddingVertical: 10}}>
            <CardUsuario />
            <Divider style={{ width: '70%', height: 2, backgroundColor: theme.colors.outlineVariant, borderRadius: 20, alignSelf: 'center', marginVertical: 10 }} />
            <Button icon="plus" mode="contained" onPress={() => navigation.navigate('NuevoFamiliar')} style={{ width: '90%', alignSelf: 'center', marginBottom: 20 }}>
              Cargar nuevo familiar
            </Button>
          </View>
          {isFetching ? (
            <Text style={{ alignSelf: 'center', marginTop: 20 }}>Cargando...</Text>
          ) : (
            <FlatList
              data={Array.isArray(familiares) ? familiares : []}
              keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
              contentContainerStyle={{ alignItems: "center", gap: 40, padding: 20, width: '100%' }}
              renderItem={({ item }) => (
                <CardFamiliar navigateTo="Familiar" data={item} />
              )}
              ListEmptyComponent={
                <Text style={{ alignSelf: 'center', marginTop: 20 }}>No hay familiares cargados.</Text>
              }
            />
          )}
        </View>
  );
}

// <View style={{flex:1}}>
      //     <DescripcionVista texto="Aquí podrás ver la información de tus familiares" />
        
      //     <ScrollView contentContainerStyle={{ alignItems: "center",gap:40,padding:20,width: '100%'}}>
      //     <CardUsuario />
      //     <Divider style={{ width: '70%', height: 2, backgroundColor: theme.colors.outlineVariant, borderRadius: 20 }} />
      //     <Button icon="plus" mode="contained" onPress={() => navigation.navigate('NuevoFamiliar')} style={{width: '90%'}}>
      //       Cargar nuevo familiar
      //     </Button>
          
            {/* <FlatList
              data={}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                Manera de renderizar mas de u familiar en una lista
              )}
            > 
              <Pressable
                onPress={() => navigation.navigate("Familiar")}
                style={({pressed}) => [
                  {
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                  },
                ]
              >
              <View
                  style={ styles.cardAnimal }
                >
                  <Image
                    source={{ uri: "https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg" }}
                    style={ styles.fotoAnimal }
                  />
                  <Text>Chili</Text>
                </View>
              </Pressable>             
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Chili', especie: 'Canino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Duque', especie: 'Canino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Duque', especie: 'Canino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Draco', especie: 'Canino'}} />
              <CardFamiliar navigateTo="Familiar" data={{nombre: 'Sur', especie: 'Felino'}} />
              
          </ScrollView>          
        </View> */}
