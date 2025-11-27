import React from "react";
import { FlatList, View } from "react-native";
import { useTheme, Text } from 'react-native-paper'
import CardFamiliar from "../componentes/cards/cardFamiliar";
import { useNavigation } from "@react-navigation/native";
import { useApiGetExtraviosPorUsuario, useApiGetMascotasPorUsuario } from "../api/hooks";
import { useUsuario } from "../hooks/useUsuario";
import DogHouseIcon from "../componentes/iconos/DogHouseIcon";
import VisitVetIcon from "../componentes/iconos/VisitVetIcon";

export default function VistaFamilia() {
  const theme = useTheme(); 
  const navigation = useNavigation();

  const { usuarioId } = useUsuario()
  
  const {data:familiares, isFetching, refetch } = useApiGetMascotasPorUsuario({ parametros: {idUsuario: usuarioId}}) 

  const {data: extravios } = useApiGetExtraviosPorUsuario({params: {queryParams: {resueltos: false},id: usuarioId}})

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
        renderItem={({ item }) => (
          <CardFamiliar 
            navigateTo="Familiar" 
            data={item} 
            estaExtraviado={extraviadosMap.has(item.id)}
          />
        )}
        ListEmptyComponent={
          isFetching
          ? (<View style={{alignItems: 'center',marginVertical: 50}}> 
                <VisitVetIcon width={250} height={250} color={theme.colors.primary} />
                <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.primary }}>Obteniendo familiares...</Text>
            </View>)
          : (<View style={{alignItems: 'center',marginVertical: 50}}>
                <DogHouseIcon width={250} height={250} color={theme.colors.primary} />
                <Text variant="headlineMedium" style={{textAlign: 'center',color: theme.colors.primary }}>No hay familiares registrados</Text>
            </View>)
        }
      />
    </View>
  );
}