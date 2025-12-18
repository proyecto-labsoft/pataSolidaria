import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { IconButton, Modal, Portal, Surface, Text, useTheme, List } from 'react-native-paper';
import ItemDato from './itemDato';
import { calcularTiempoTranscurrido } from '../utiles/calcularTiempoTranscurrido';

interface ModalPostulacionesProps {
    visible: boolean;
    onDismiss: () => void;
    postulaciones: any[];
}

export default function ModalPostulaciones({
    visible,
    onDismiss,
    postulaciones,
}: ModalPostulacionesProps) {
    const theme = useTheme();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleToggleExpanded = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={{
                    backgroundColor: theme.colors.surface,
                    margin: 20,
                    borderRadius: 8,
                    height: '80%',
                }}
            >
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <View style={styles.header}>
                            <Text variant="titleLarge">Postulaciones</Text>
                            <IconButton
                                icon="close"
                                onPress={onDismiss}
                            />
                        </View>

                        {postulaciones && postulaciones.length > 0 ? (
                            postulaciones.map((postulacion: any, index: number) => (
                                <PostulacionAccordion
                                    key={postulacion.id || index}
                                    postulacion={postulacion}
                                    index={index}
                                    totalPostulaciones={postulaciones.length}
                                    expanded={expandedId === postulacion.id}
                                    onToggle={() => handleToggleExpanded(postulacion.id)}
                                />
                            ))
                        ) : (
                            <Surface style={styles.emptyContainer}>
                                <Text variant="bodyLarge" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                                    Aún no hay postulaciones
                                </Text>
                            </Surface>
                        )}
                    </View>
                </ScrollView>
            </Modal>
        </Portal>
    );
}

// Componente separado para cada postulación (accordion)
function PostulacionAccordion({ 
    postulacion, 
    index, 
    totalPostulaciones, 
    expanded, 
    onToggle 
}: { 
    postulacion: any; 
    index: number; 
    totalPostulaciones: number; 
    expanded: boolean; 
    onToggle: () => void;
}) {
    const theme = useTheme();

    return (
        <Surface
            style={{
                ...styles.accordionSurface,
                backgroundColor: theme.colors.surfaceVariant,
            }}
        >
            <List.Accordion
                title={`Postulación ${totalPostulaciones - index}`}
                description={calcularTiempoTranscurrido(postulacion.fecha)}
                expanded={expanded}
                onPress={onToggle}
                style={{ backgroundColor: 'transparent' }}
                titleStyle={{ fontWeight: 'bold' }}
            >
                <View style={styles.accordionContent}>
                    {/* Información de la postulación */}
                    <ItemDato label='Fecha' data={postulacion.fecha} />
                    {postulacion.comentario && (
                        <ItemDato label='Comentario' data={postulacion.comentario} />
                    )}

                    {/* Datos de contacto del postulante */}
                    {postulacion?.usuarioPostulante && (
                        <>
                            <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8, fontWeight: 'bold' }}>
                                Datos de contacto
                            </Text>
                            {postulacion?.usuarioPostulante?.nombre && (
                                <ItemDato label='Nombre' data={postulacion?.usuarioPostulante?.nombre} />
                            )}
                            {postulacion?.usuarioPostulante?.email && (
                                <ItemDato label='Email' data={postulacion?.usuarioPostulante?.email} />
                            )}
                            {postulacion?.usuarioPostulante?.celular && (
                                <ItemDato label='Teléfono' data={postulacion?.usuarioPostulante?.celular.toString()} />
                            )}
                            {postulacion?.usuarioPostulante?.direccion && (
                                <ItemDato label='Dirección' data={postulacion?.usuarioPostulante?.direccion} />
                            )}
                        </>
                    )}
                </View>
            </List.Accordion>
        </Surface>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    accordionSurface: {
        marginBottom: 12,
        borderRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    accordionContent: {
        padding: 16,
        paddingTop: 8,
    },
    emptyContainer: {
        padding: 32,
        borderRadius: 8,
        elevation: 1,
    },
});
