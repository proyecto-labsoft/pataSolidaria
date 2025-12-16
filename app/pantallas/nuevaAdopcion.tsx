import React from "react"
import { FlatList, View } from "react-native";
import CardFamiliar from "../componentes/cards/cardFamiliar";
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarNav from "../componentes/navegacion/appbarNav";
import { useApiGetMascotasPorUsuario } from "../api/hooks"; 
import { Button, Text, useTheme } from "react-native-paper";
import { useUsuario } from "../hooks/useUsuario";
import PetFriendlyHotelIcon from "../componentes/iconos/PetFriendlyHotelIcon";
import { useNavigation } from "@react-navigation/native";

export default function NuevaAdopcion({ route }: any) {
    const { usuarioId } = useUsuario();
    const theme = useTheme();
    const navigation = useNavigation();
    const esTransito = route?.params?.esTransito || false;
    
    const {data: familiares, isFetching} = useApiGetMascotasPorUsuario({ 
        parametros: {idUsuario: usuarioId}
    });
    
    return (
        <>
            <AppbarNav titulo={esTransito ? "Nuevo tránsito" : "Nueva adopción"} tamanioTitulo="headlineSmall"/>     
            
            <SafeAreaView style={{ alignItems: "center", flex: 1}}>   
                <View style={{marginVertical: 10, alignItems: 'center'}}>  
                    <PetFriendlyHotelIcon width={150} height={150} color={theme.colors.primary} />
                    <Text variant="titleLarge" style={{ textAlign: 'center', color: theme.colors.primary }}>
                        {esTransito ? '¿Qué familiar quieres dar en tránsito?' : '¿Qué familiar quieres poner en adopción?'}
                    </Text>
                </View>
                
                <Button 
                    mode="contained" 
                    icon="plus"
                    onPress={() => navigation.navigate("NuevoFamiliar" as never)}
                    style={{ marginVertical: 10, width: '90%' }}
                    buttonColor={theme.colors.tertiary}
                >
                    Agregar nuevo familiar
                </Button>

                <View style={{marginHorizontal: 10, flex: 1, width: '100%'}}>
                    <FlatList
                        data={Array.isArray(familiares) ? familiares : []}
                        keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
                        contentContainerStyle={{ alignItems: "center", gap: 40, padding: 20, width: '100%' }}
                        renderItem={({ item }) => (
                            <CardFamiliar 
                                navigateTo="ConfirmarAdopcion" 
                                data={{ ...item, esTransito }} 
                            />
                        )}
                        ListEmptyComponent={
                            !isFetching && (
                                <Text style={{ alignSelf: 'center', marginTop: 20 }}>
                                    No hay familiares registrados
                                </Text>
                            )
                        }
                    /> 
                </View>
            </SafeAreaView>
        </>
    )
}