import { FlatList, View } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal"; 
import { useApiGetExtravios } from "../api/hooks";
import { Text, useTheme } from "react-native-paper";
import VisitVetIcon from "../componentes/iconos/VisitVetIcon"; 

export default function VistaCasos() {
  const {data: extravios, isFetching } = useApiGetExtravios({enabled: true }) 

  const theme = useTheme();

  // Agrupa los datos de a dos por fila
  const extraviosPorFila = Array.isArray(extravios)
    ? Array.from({ length: Math.ceil(extravios.length / 2) }, (_, idx) =>
        extravios.slice(idx * 2, idx * 2 + 2)
      )
    : [];

  return ( 
    <View style={{height: '100%', marginVertical: 10}}> 
      <FlatList
        data={extraviosPorFila}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={{ justifyContent: 'center', alignItems: "center", paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <CardAnimal navigateTo="VistaExtravio" data={item[0]} />
            {item[1] ? (
              <CardAnimal navigateTo="VistaExtravio" data={item[1]} />
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
        )}
        ListEmptyComponent={
          isFetching
            ? (<View style={{alignItems: 'center', marginVertical: 50}}> 
                  <Text variant="headlineMedium" style={{textAlign: 'center', color: theme.colors.secondary}}>Buscando casos...</Text>
              </View>)
            : (<View style={{alignItems: 'center', marginVertical: 50}}>
                  <VisitVetIcon width={250} height={250} color={theme.colors.primary} />
                  <Text variant="headlineMedium" style={{textAlign: 'center', color: theme.colors.secondary}}>No hay casos de extravío</Text>
              </View>)
        }
      />
    </View> 
  );
}
