import { View, ScrollView, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, IconButton, Modal, Portal, Surface, Text, useTheme, List, TextInput, Card, Icon } from 'react-native-paper'
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Mapa } from '../componentes/mapa';
import BannerEstadoExtravio from '../componentes/bannerEstadoExtravio';
import { calcularTiempoTranscurrido } from '../utiles/calcularTiempoTranscurrido';
import { useUsuario } from '../hooks/useUsuario';
import BackdropSuccess from '../componentes/backdropSuccess';
import { useAuth } from '../contexts/AuthContext';
import BotonAccionesEmergenciaFAB from '../componentes/botones/BotonAccionesEmergenciaFAB';
import { useApiPutEmergencia } from '../api/hooks';

const imagenes = ImageSlider[0].imagenes

export default function VistaEmergencia({ route }: any) {

    const theme = useTheme();
    const { usuarioId } = useUsuario();
    const { isAdmin } = useAuth();
    const navigation = useNavigation()
    const isFocused = useIsFocused();
    const { width, height } = useWindowDimensions()

    const [visible, setVisible] = useState(false)
    const [expandedInfo, setExpandedInfo] = useState(false);
    const [datosEmergencia, setDatosEmergencia] = useState<any>(null);
    const [resolverEmergencia, setResolverEmergencia] = useState(false);
    const [observacionResolver, setObservacionResolver] = useState('');
    const [successResolver, setSuccessResolver] = useState(false);

    const esCreadorDeLaEmergencia = datosEmergencia?.usuarioCreador?.id === usuarioId;
    const tiempoTranscurrido = calcularTiempoTranscurrido(datosEmergencia?.hora)

    const { mutateAsync: atenderEmergencia } = useApiPutEmergencia({
        params: {id: datosEmergencia?.id},
        onSuccess: () => {
            setSuccessResolver(true); 
            setResolverEmergencia(false);
        }
    }) 

    useEffect(() => {
        if (route.params?.data) {
            setDatosEmergencia(route.params?.data)
        }
    }, [route.params?.data])
 
    const handleResolverEmergencia = () => {
        
        atenderEmergencia({data: {
            atendido: true,
            observacion: observacionResolver
        }})
        
    };

    const handleCloseResolver = () => {
        setResolverEmergencia(false);
        setObservacionResolver('');
    }

    return (
        <View style={{ height: height, width: width, backgroundColor: theme.colors.background, alignItems: 'center' }}>
            <Portal>
                <Modal
                    visible={resolverEmergencia}
                    onDismiss={handleCloseResolver}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.surface,
                        margin: 20,
                        borderRadius: 8,
                        padding: 20,
                        maxHeight: '70%',
                    }}
                >
                    <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 16 }}>
                        Marcar emergencia como atendida
                    </Text>
                    <TextInput
                        mode='outlined'
                        label="Observaciones (Opcional)"
                        multiline
                        numberOfLines={4}
                        style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                        }}
                        value={observacionResolver}
                        onChangeText={setObservacionResolver}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                        <Button
                            mode="outlined"
                            onPress={handleCloseResolver}
                            style={{ marginTop: 16 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={handleResolverEmergencia}
                            style={{ marginTop: 16 }}
                        >
                            Confirmar
                        </Button>
                    </View>
                </Modal>
            </Portal>

            <Portal>
                {successResolver && (
                    <BackdropSuccess
                        backgroundColor="#1db100ff"
                        color={theme.colors.surface}
                        texto="Emergencia atendida"
                        onTap={() => {
                            setSuccessResolver(false);
                            navigation.goBack();
                        }}
                    />
                )}
            </Portal>

            <AppbarNav titulo='EMERGENCIA' />

            <ScrollView style={{ width: '100%', height: '100%' }}>
                <Portal>
                    <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{ ...styles.containerStyle, backgroundColor: theme.colors.surface }}>
                        <Mapa puntoModificable={false} style={{ width: width, height: height }} latitude={datosEmergencia?.latitud} longitude={datosEmergencia?.longitud} />
                        <Button buttonColor={theme.colors.primary} style={{ marginVertical: 8, borderRadius: 10 }} uppercase mode="contained" onPress={() => setVisible(false)}>
                            <Text variant='labelLarge' style={{ color: theme.colors.onPrimary, marginLeft: "5%" }}>Volver atrás</Text>
                        </Button>
                    </Modal>
                </Portal>

                {/* Banner con posición absoluta */}
                <View style={styles.bannerContainer}>
                    <BannerEstadoExtravio titulo={tiempoTranscurrido} tipo={!datosEmergencia?.atendido} />
                </View>

                {/* Carrusel de imágenes */}
                <View style={{ position: 'relative', margin: 0, marginBottom: 24, padding: 0, backgroundColor: theme.colors.background }} >
                    <CarruselImagenes data={imagenes} />
                </View>

                {/* Mensaje indicador de estado y creador */}
                <Surface style={{ 
                    padding: 12, 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexDirection: 'row', 
                    backgroundColor: datosEmergencia?.atendido ? theme.colors.tertiary : theme.colors.error, 
                    marginBottom: 8 
                }}>
                    <Icon size={24} source="information-outline" color={datosEmergencia?.atendido ? theme.colors.onTertiary : theme.colors.onError} />
                    <Text variant="bodyMedium" style={{ 
                        color: datosEmergencia?.atendido ? theme.colors.onTertiary : theme.colors.onError, 
                        fontWeight: 'bold', 
                        textAlign: 'center' 
                    }}>
                        {datosEmergencia?.atendido ? 'Emergencia atendida' : 'Emergencia activa'}
                        {esCreadorDeLaEmergencia && ' (creada por tí)'}
                    </Text>
                </Surface>

                {/* Información del usuario creador */}
                <Card style={{ margin: 16, backgroundColor: theme.colors.surfaceVariant }}>
                    <View style={{ padding: 16, gap: 12, flexDirection:'column', alignItems:'flex-start'  }}>
                        <Text variant='titleLarge' style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
                            Información del reporte
                        </Text>
                        <Text variant='titleMedium' style={{ color: theme.colors.onBackground }}>
                            {datosEmergencia?.observacion || 'Sin observaciones adicionales'}
                        </Text>
                        
                    </View>
                
                </Card>

                {/* Información adicional del animal (si existe) */}
                {datosEmergencia?.mascotaDetalle && (
                    <Card style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: theme.colors.surface }}>
                        <List.Accordion
                            title={<Text variant='titleMedium' style={{ color: theme.colors.onPrimaryContainer }}>Descripción del animal</Text>}
                            titleStyle={{ fontWeight: 'bold' }}
                            expanded={expandedInfo}
                            onPress={() => setExpandedInfo(!expandedInfo)}
                            style={{ backgroundColor: theme.colors.surfaceVariant, marginHorizontal: 0 }}
                        >
                            <View style={{ padding: 16, paddingTop: 32, position: 'relative', gap: 12, borderTopColor: theme.colors.outline, borderTopWidth: 0.5 }}>
                                {datosEmergencia?.mascotaDetalle?.nombre && <ItemDato label='Nombre' data={datosEmergencia.mascotaDetalle.nombre} />}
                                {datosEmergencia?.mascotaDetalle?.especie && <ItemDato label='Especie' data={datosEmergencia.mascotaDetalle.especie} />}
                                {datosEmergencia?.mascotaDetalle?.raza && <ItemDato label='Raza' data={datosEmergencia.mascotaDetalle.raza} />}
                                {datosEmergencia?.mascotaDetalle?.tamanio && <ItemDato label='Tamaño' data={datosEmergencia.mascotaDetalle.tamanio} />}
                                {datosEmergencia?.mascotaDetalle?.color && <ItemDato label='Color' data={datosEmergencia.mascotaDetalle.color} />}
                                {datosEmergencia?.mascotaDetalle?.sexo && <ItemDato label='Sexo' data={datosEmergencia.mascotaDetalle.sexo} />}
                                {datosEmergencia?.mascotaDetalle?.descripcion && <ItemDato label='Descripción' data={datosEmergencia.mascotaDetalle.descripcion} />}
                            </View>
                        </List.Accordion>
                    </Card>
                )}

                {/* Ubicación de la emergencia */}
                <Card style={{ ...styles.ultimoAvistamientoContainer, margin: 16, backgroundColor: theme.colors.surfaceVariant }}>
                    <View style={{ ...styles.headerAvistamiento, flexDirection: 'column' }}>
                        <Text variant='titleLarge' style={{ color: theme.colors.onBackground }}>
                            Ubicación de la emergencia
                        </Text>
                    </View>
                    <View style={styles.mapContainer}>
                        <Mapa
                            puntoModificable={false}
                            latitude={datosEmergencia?.latitud}
                            longitude={datosEmergencia?.longitud}
                            style={styles.map}
                        />
                    </View>
                    <View style={{ padding: 16 }}>
                        <Button
                            mode="outlined"
                            icon="map-marker"
                            onPress={() => setVisible(true)}
                            style={{ marginTop: 8 }}
                        >
                            Ver en mapa completo
                        </Button>
                    </View>
                </Card>
            </ScrollView>

            {/* FAB de acciones */}
            <BotonAccionesEmergenciaFAB
                isAdmin={isAdmin}
                emergenciaAtendida={datosEmergencia?.atendido || false}
                onMarcarAtendida={() => setResolverEmergencia(true)}
                showButton={isFocused && !visible}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        alignItems: "center",
        width: '100%',
        height: '100%',
    },
    bannerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        alignItems: 'center',
    },
    mapContainer: {
        width: '100%',
        elevation: 2,
        height: 250,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    }, 
    ultimoAvistamientoContainer: {
        overflow: 'hidden',
    },
    headerAvistamiento: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
});
