import { ScrollView, View } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal"; 
import { useApiGetExtravios } from "../api/hooks";
import { Text } from "react-native-paper";

export default function VistaCasos() {
  const {data, isFetching } = useApiGetExtravios({enabled: true }) 

  return ( 
    <View style={{flex:1, marginTop: 20 }}> 
      <ScrollView
        contentContainerStyle={{justifyContent:'center', alignItems: "flex-start",paddingVertical: 10,paddingBottom:80}}
      >
        {isFetching ? (
          <Text>Cargando...</Text>
        ) : (
          (Array.isArray(data) && data?.length > 0 ? (
            Array.from({ length: Math.ceil((Array.isArray(data) ? data.length : 0) / 2) }).map((_, rowIdx) => {
              const safeData = Array.isArray(data) ? data : [];
              const rowItems = safeData.slice(rowIdx * 2, rowIdx * 2 + 2);
              return (
                <View key={rowIdx} style={{ flexDirection: 'row', width: '100%' }}>
                  <CardAnimal
                    key={rowItems[0]?.id || `${rowIdx}-0`}
                    navigateTo="VistaExtravio"
                    data={rowItems[0]}
                  />
                  {rowItems[1] ? (
                    <CardAnimal
                      key={rowItems[1]?.id || `${rowIdx}-1`}
                      navigateTo="VistaExtravio"
                      data={rowItems[1]}
                    />
                  ) : (
                    <View key={`${rowIdx}-empty`} style={{ flex: 1 }} />
                  )}
                </View>
              );
            })) : <Text>No hay datos disponibles</Text>
        ))}
      </ScrollView>
    </View> 
    
  );
}
