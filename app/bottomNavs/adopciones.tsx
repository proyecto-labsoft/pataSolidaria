import { FlatList, View, StyleSheet } from "react-native"; 
import { useApiGetAdopciones } from "../api/hooks";
import CardAdopcion from "../componentes/cards/cardAdopcion";
import DogHouseIcon from "../componentes/iconos/DogHouseIcon"; 
import { Text, useTheme } from "react-native-paper";
import VisitVetIcon from "../componentes/iconos/VisitVetIcon";
import LogoPataIcon from "../componentes/iconos/LogoPataIcon";

export default function VistaAdopciones() {

  const theme = useTheme();
  const {data: adopciones, isFetching } = useApiGetAdopciones({enabled: true }) 

  console.log('📋 VistaAdopciones - Adopciones recibidas:', {
    count: adopciones?.length || 0,
    primeraAdopcion: adopciones?.[0] ? {
      mascotaId: adopciones[0]?.mascotaDetalle?.id,
      mascotaNombre: adopciones[0]?.mascotaDetalle?.nombre,
      publicadorId: adopciones[0]?.publicador?.id
    } : null
  });

  // Agrupa los datos de a dos por fila
  const adopcionesPorFila = Array.isArray(adopciones)
    ? Array.from({ length: Math.ceil(adopciones.length / 2) }, (_, idx) =>
        adopciones.slice(idx * 2, idx * 2 + 2)
      )
    : [];

  return (
    <View style={{height: '100%', marginVertical: 10, position: 'relative'}}>
        {/* Logo de fondo */}
        <View style={styles.logoBackground}>
          <LogoPataIcon width={400} height={520} />
        </View>
        
        <FlatList
          data={adopcionesPorFila}
          keyExtractor={(_, idx) => idx.toString()}
          contentContainerStyle={{ justifyContent: 'center', alignItems: "center", paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <CardAdopcion navigateTo="VistaAdopcion" data={item[0]} />
              {item[1] ? (
                <CardAdopcion navigateTo="VistaAdopcion" data={item[1]} />
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </View>
          )}
          ListEmptyComponent={
            isFetching
              ? (<View style={{alignItems: 'center',marginVertical: 50}}> 
                    <VisitVetIcon width={250} height={250} color={theme.colors.primary} />
                    <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.primary }}>Obteniendo adopciones...</Text>
                </View>)
              : (<View style={{alignItems: 'center',marginVertical: 50}}>
                    <DogHouseIcon width={250} height={250} color={theme.colors.primary} />
                    <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.primary }}>No existen compañeros en adopción</Text>
                </View>)
          }
        />
    </View>
  );
}

const styles = StyleSheet.create({
  logoBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -200 }, { translateY: -260 }],
    opacity: 0.05,
    zIndex: -1,
  },
});

