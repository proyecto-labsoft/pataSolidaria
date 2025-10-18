import { FlatList, ScrollView, View } from "react-native";
import DescripcionVista from "../componentes/descripcionVista";
import { useApiGetAdopciones } from "../api/hooks";
import CardAdopcion from "../componentes/cards/cardAdopcion";

export default function VistaAdopciones() {
  
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
          contentContainerStyle={{ justifyContent: 'center', alignItems: "flex-start", paddingBottom: 80 }}
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
              ? <View style={{ alignSelf: 'center', marginTop: 20 }}><CardAdopcion navigateTo="Familiar" data={{ nombreMascota: 'Cargando...', especie: '' }} /></View>
              : <View style={{ alignSelf: 'center', marginTop: 20 }}><CardAdopcion navigateTo="Familiar" data={{ nombreMascota: 'Sin datos', especie: '' }} /></View>
          }
        />
    </View>
  );
}

