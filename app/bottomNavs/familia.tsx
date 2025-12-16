import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useTheme, Text, Surface } from 'react-native-paper'
import CardFamiliar from "../componentes/cards/cardFamiliar"; 
import { useApiGetExtraviosPorUsuario, useApiGetMascotasPorUsuario, useApiGetImagenesMascota } from "../api/hooks";
import { useUsuario } from "../hooks/useUsuario";
import DogHouseIcon from "../componentes/iconos/DogHouseIcon";
import VisitVetIcon from "../componentes/iconos/VisitVetIcon";

// Componente wrapper para cargar imágenes de cada mascota
const CardFamiliarWithImages = ({ item, navigateTo, estaExtraviado }) => {
  const { data: imagenes } = useApiGetImagenesMascota({ 
    parametros: { mascotaId: item.id },
    enabled: !!item.id 
  });

  return (
    <CardFamiliar 
      navigateTo={navigateTo}
      data={{ ...item, imagenes }}
      estaExtraviado={estaExtraviado}
    />
  );
};

export default function VistaFamilia() {
  const theme = useTheme();  

  const { usuarioId } = useUsuario()
  
  const {data:familiares, isFetching, refetch: refetchFamiliares } = useApiGetMascotasPorUsuario({ parametros: {idUsuario: usuarioId}, enabled: !!usuarioId }) 

  const {data: extravios, refetch: refetchExtravios } = useApiGetExtraviosPorUsuario({params: {queryParams: {resueltos: false},id: usuarioId}})

  const refetchQueries = () => {
    refetchFamiliares();
    refetchExtravios();
  }
  const cargandoVista = isFetching;
  // Crear un mapa de mascotas extraviadas para búsqueda rápida
  const extraviadosMap = React.useMemo(() => {
    if (!extravios || !Array.isArray(extravios)) return new Set();
    return new Set(extravios.map((e: any) => e.mascotaId));
  }, [extravios]);

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <FlatList
        data={Array.isArray(familiares) ? familiares : []}
        keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
        contentContainerStyle={{ alignItems: "center", gap: 40, padding: 20, width: '100%' }}
        refreshing={cargandoVista}
        onRefresh={refetchQueries}
        renderItem={({ item }) => (
          <CardFamiliarWithImages 
            item={item}
            navigateTo="Familiar" 
            estaExtraviado={extraviadosMap.has(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={{alignItems: 'center',marginVertical: 50}}>
              <DogHouseIcon width={250} height={250} color={theme.colors.primary} />
              <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.primary }}>No hay familiares registrados</Text>
          </View>
        }
      />

       {/* Overlay de carga */}
      {cargandoVista && (
        <View style={styles.loadingOverlay}>
          <Surface style={styles.loadingCard} elevation={4}>
            <VisitVetIcon width={250} height={250} color={theme.colors.primary} />
                  <Text variant="headlineMedium" style={{textAlign: 'center', color: theme.colors.primary}}>Actualizando familia...</Text>
          </Surface>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  }
})