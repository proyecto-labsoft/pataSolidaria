import { FlatList, View, RefreshControl } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal"; 
import { useApiGetExtravios } from "../api/hooks";
import { Text, useTheme } from "react-native-paper";
import VisitVetIcon from "../componentes/iconos/VisitVetIcon";
import { parse } from "date-fns"; 

export default function VistaCasos() {
  const {data: extravios, isFetching, refetch } = useApiGetExtravios({enabled: true }) 

  const theme = useTheme();

  // Ordenar extravíos por hora (más reciente primero)
  const extraviosOrdenados = Array.isArray(extravios)
    ? [...extravios].sort((a, b) => {
        const fechaA = a.hora ? parse(a.hora, 'dd-MM-yyyy HH:mm:ss', new Date()).getTime() : 0;
        const fechaB = b.hora ? parse(b.hora, 'dd-MM-yyyy HH:mm:ss', new Date()).getTime() : 0;
        return fechaB - fechaA; // Descendente (más reciente primero)
      })
    : [];

  // Agrupa los datos de a dos por fila
  const extraviosPorFila = Array.isArray(extraviosOrdenados)
    ? Array.from({ length: Math.ceil(extraviosOrdenados.length / 2) }, (_, idx) =>
        extraviosOrdenados.slice(idx * 2, idx * 2 + 2)
      )
    : [];

  return ( 
    <View style={{height: '100%', marginVertical: 10}}> 
      <FlatList
        data={extraviosPorFila}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={{ justifyContent: 'center', alignItems: "center", paddingVertical: 10, gap: 5 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
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
