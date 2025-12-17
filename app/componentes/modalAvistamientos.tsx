import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, IconButton, Modal, Portal, Surface, Text, useTheme } from 'react-native-paper';
import { Mapa } from './mapa';
import CarruselImagenes from './carrusel/carruselImagenes';
import ItemDato from './itemDato';
import { calcularTiempoTranscurrido } from '../utiles/calcularTiempoTranscurrido';
import { ImageSlider } from '../testData/sliderData';

const imagenes = ImageSlider[0].imagenes;

interface ModalAvistamientosProps {
    visible: boolean;
    onDismiss: () => void;
    avistamientos: any[];
    datosExtravio: any;
    avistamientoSeleccionado: any;
    setAvistamientoSeleccionado: (avistamiento: any) => void;
}

export default function ModalAvistamientos({
    visible,
    onDismiss,
    avistamientos,
    datosExtravio,
    avistamientoSeleccionado,
    setAvistamientoSeleccionado,
}: ModalAvistamientosProps) {
    const theme = useTheme();

    const handleClose = () => {
        setAvistamientoSeleccionado(null);
        onDismiss();
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={handleClose}
                contentContainerStyle={{
                    backgroundColor: theme.colors.surface,
                    margin: 20,
                    borderRadius: 8,
                    height: '80%',
                }}
            >
                {!avistamientoSeleccionado ? (
                    // Vista de lista de avistamientos
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            <View style={styles.header}>
                                <Text variant="titleLarge">Avistamientos</Text>
                                <IconButton
                                    icon="close"
                                    onPress={onDismiss}
                                />
                            </View>

                            {/* Lista de avistamientos */}
                            {avistamientos?.length > 0 && avistamientos?.map((avistamiento: any, index: number) => (
                                <Surface
                                    key={avistamiento.id || index}
                                    style={styles.itemSurface}
                                >
                                    <View style={styles.itemContent}>
                                        <View style={{ flex: 1 }}>
                                            <Text variant='titleSmall' style={{ fontWeight: 'bold' }}>
                                                Avistamiento {avistamientos.length - index}
                                            </Text>
                                            <Text variant='bodyMedium' style={{ marginTop: 4 }}>
                                                {calcularTiempoTranscurrido(avistamiento.hora)}
                                            </Text>
                                            <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                                                {avistamiento.hora}
                                            </Text>
                                        </View>
                                        <Button
                                            mode="outlined"
                                            onPress={() => setAvistamientoSeleccionado(avistamiento)}
                                            compact
                                        >
                                            Ver más
                                        </Button>
                                    </View>
                                </Surface>
                            ))}

                            {/* Datos del extravío al final */}
                            <Surface
                                style={{
                                    ...styles.itemSurface,
                                    backgroundColor: theme.colors.secondaryContainer,
                                }}
                            >
                                <View style={styles.itemContent}>
                                    <View style={{ flex: 1 }}>
                                        <Text variant='titleSmall' style={{ fontWeight: 'bold' }}>
                                            Extravío reportado
                                        </Text>
                                        <Text variant='bodyMedium' style={{ marginTop: 4 }}>
                                            {calcularTiempoTranscurrido(datosExtravio?.hora)}
                                        </Text>
                                        <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant }}>
                                            {datosExtravio?.hora}
                                        </Text>
                                    </View>
                                    <Button
                                        mode="outlined"
                                        onPress={() => setAvistamientoSeleccionado(datosExtravio)}
                                        compact
                                    >
                                        Ver más
                                    </Button>
                                </View>
                            </Surface>
                        </View>
                    </ScrollView>
                ) : (
                    // Vista de detalle del avistamiento seleccionado
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            <View style={styles.header}>
                                <IconButton
                                    icon="arrow-left"
                                    onPress={() => setAvistamientoSeleccionado(null)}
                                />
                                <Text variant="titleLarge">
                                    {avistamientoSeleccionado === datosExtravio ? 'Extravío reportado' : 'Detalle del avistamiento'}
                                </Text>
                                <IconButton
                                    icon="close"
                                    onPress={handleClose}
                                />
                            </View>

                            {/* Mapa */}
                            <View style={styles.mapContainer}>
                                <Mapa
                                    puntoModificable={false}
                                    latitude={avistamientoSeleccionado?.latitud}
                                    longitude={avistamientoSeleccionado?.longitud}
                                    style={styles.map}
                                />
                            </View>

                            {/* Imágenes (si existen) */}
                            {/* {imagenes && imagenes.length > 0 && (
                                <View style={{ marginBottom: 16 }}>
                                    <CarruselImagenes data={imagenes} />
                                </View>
                            )} */}

                            {/* Información */}
                            <Surface style={styles.infoSurface}>
                                <ItemDato label='Fecha y hora' data={avistamientoSeleccionado?.hora} /> 
                                {avistamientoSeleccionado?.comentario && (
                                    <ItemDato label='Observaciones' data={avistamientoSeleccionado.comentario} />
                                )}
                                {avistamientoSeleccionado?.observacion && (
                                    <ItemDato label='Observaciones' data={avistamientoSeleccionado.observacion} />
                                )}
                            </Surface>
                        </View>
                    </ScrollView>
                )}
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    itemSurface: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        elevation: 2,
    },
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mapContainer: {
        width: '100%',
        elevation: 2,
        height: 250,
        overflow: 'hidden',
        marginBottom: 16,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    infoSurface: {
        padding: 16,
        borderRadius: 8,
        elevation: 1,
    },
});
