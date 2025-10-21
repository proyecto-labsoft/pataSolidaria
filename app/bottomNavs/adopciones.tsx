import { FlatList, View } from "react-native"; 
import { useApiGetAdopciones } from "../api/hooks";
import CardAdopcion from "../componentes/cards/cardAdopcion";
import DogHouseIcon from "../componentes/iconos/DogHouseIcon"; 
import { Text, useTheme } from "react-native-paper";

export default function VistaAdopciones() {

  const theme = useTheme();
  const {data: adopciones, isFetching } = useApiGetAdopciones({enabled: true }) 

  // Agrupa los datos de a dos por fila
  const adopcionesPorFila = Array.isArray(adopciones)
    ? Array.from({ length: Math.ceil(adopciones.length / 2) }, (_, idx) =>
        adopciones.slice(idx * 2, idx * 2 + 2)
      )
    : [];

  return (
    <View  style={{height: '100%', marginVertical: 10}}>
        {/* <DescripcionVista texto="Compañeros en adopción bajo el cuidado de la asociación" /> */}
        <FlatList
          data={adopcionesPorFila}
          keyExtractor={(_, idx) => idx.toString()}
          contentContainerStyle={{ justifyContent: 'center', alignItems: "center", paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <CardAdopcion navigateTo="Familiar" data={item[0]} />
              {item[1] ? (
                <CardAdopcion navigateTo="Familiar" data={item[1]} />
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </View>
          )}
          ListEmptyComponent={
            isFetching
              ? (<View style={{alignItems: 'center',marginVertical: 50}}> 
                    <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.secondary }}>Cargando adopciones...</Text>
                </View>)
              : (<View style={{alignItems: 'center',marginVertical: 50}}>
                    <DogHouseIcon width={250} height={250} color={theme.colors.primary} />
                    <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.secondary }}>No tenemos compas en adopción</Text>
                </View>)
          }
        />
    </View>
  );
}

