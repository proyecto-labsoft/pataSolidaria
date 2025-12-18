import React, { useMemo } from "react"
import { StyleSheet, FlatList, View } from "react-native";
import CardFamiliar from "../componentes/cards/cardFamiliar";
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
import DescripcionVista from "../componentes/descripcionVista";
import { useApiGetExtraviosPorUsuario, useApiGetMascotasPorUsuario, useApiGetImagenesMascota } from "../api/hooks"; 
import { Text } from "react-native-paper";
import { useUsuario } from "../hooks/useUsuario";
import { theme } from "../_layout";
import VisitVetIcon from "../componentes/iconos/VisitVetIcon";

// Componente wrapper para cargar imágenes de cada mascota
const CardFamiliarWithImages = ({ item, navigateTo }: { item: any, navigateTo: string }) => {
    const { data: imagenes } = useApiGetImagenesMascota({ 
        parametros: { mascotaId: item.id },
        enabled: !!item.id 
    });

    return (
        <CardFamiliar 
            navigateTo={navigateTo}
            data={{ ...item, imagenes }}
            estaExtraviado={false}
        />
    );
};

export default function NuevoBuscado() {

    const { usuarioId } = useUsuario()
    const {data:familiares, isFetching, refetch } = useApiGetMascotasPorUsuario({ parametros: {idUsuario: usuarioId}, enabled: !!usuarioId }) 
    const {data:extravios, isFetching: isFetchingExtravios, refetch: refetchExtravios } = useApiGetExtraviosPorUsuario({ params: { queryParams: {resueltos: false},id: usuarioId}}) 

    const familiaresNoExtraviados = useMemo(() => {
        if (!familiares || !Array.isArray(familiares)) return [];
        
        // Crear set de mascotas extraviadas (no resueltas)
        const extraviadosSet = new Set(
            (Array.isArray(extravios) ? extravios : [])
                .map((e: any) => e.mascotaDetalle?.id || e.mascotaId)
                .filter(Boolean) // Filtrar valores nulos o undefined
        );
        
        console.log('🔍 Mascotas extraviadas (no resueltas):', Array.from(extraviadosSet));
        console.log('📋 Total de familiares:', familiares.length);
        
        const disponibles = familiares.filter((familiar: any) => !extraviadosSet.has(familiar.id));
        console.log('✅ Familiares disponibles para declarar:', disponibles.length);
        
        return disponibles;
    },[familiares, extravios])
    
    return (
        <>
            <AppbarNav tamanioTitulo="headlineSmall"/>     
            
            <SafeAreaView style={{ alignItems: "center",flex:1}}>   
                <View style={{marginVertical:10,alignItems:'center' }}>
                    <VisitVetIcon width={150} height={150} color={theme.colors.primary} />
                    <Text variant="titleLarge" style={{ textAlign: 'center',color: theme.colors.primary }}>¿Qué familiar esta buscando?</Text>
                </View>
                <View style={{marginHorizontal:10}}>
                    <FlatList
                        data={Array.isArray(familiaresNoExtraviados) ? familiaresNoExtraviados : []}
                        keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
                        contentContainerStyle={{ alignItems: "center", gap: 40, padding: 20, width: '100%' }}
                        renderItem={({ item }) => (
                            <CardFamiliarWithImages 
                                item={item}
                                navigateTo="ConfirmarBuscado" 
                            />
                        )}
                        ListEmptyComponent={
                            isFetching ? (
                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    <VisitVetIcon width={150} height={150} color={theme.colors.primary} />
                                    <Text style={{ textAlign: 'center', color: theme.colors.primary, marginTop: 10 }}>
                                        Cargando familiares...
                                    </Text>
                                </View>
                            ) : (
                                <Text style={{ alignSelf: 'center', marginTop: 20, color: theme.colors.primary }}>
                                    No hay familiares disponibles para declarar como extraviados
                                </Text>
                            )
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