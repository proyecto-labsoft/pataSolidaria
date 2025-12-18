import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { IconButton, Modal, Portal, Surface, Text, useTheme, List } from 'react-native-paper';
import ItemDato from './itemDato';
import { calcularTiempoTranscurrido } from '../utiles/calcularTiempoTranscurrido';

interface ModalPosiblesTutoresProps {
    visible: boolean;
    onDismiss: () => void;
    posiblesTutores: any[];
}

export default function ModalPosiblesTutores({
    visible,
    onDismiss,
    posiblesTutores,
}: ModalPosiblesTutoresProps) {
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
                            <Text variant="titleLarge">Posibles Tutores</Text>
                            <IconButton
                                icon="close"
                                onPress={onDismiss}
                            />
                        </View>

                        {posiblesTutores && posiblesTutores.length > 0 ? (
                            posiblesTutores.map((tutor: any, index: number) => (
                                <TutorAccordion
                                    key={tutor.id || index}
                                    tutor={tutor}
                                    index={index}
                                    totalTutores={posiblesTutores.length}
                                    expanded={expandedId === tutor.id}
                                    onToggle={() => handleToggleExpanded(tutor.id)}
                                />
                            ))
                        ) : (
                            <Surface style={styles.emptyContainer}>
                                <Text variant="bodyLarge" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                                    Aún no hay posibles tutores
                                </Text>
                            </Surface>
                        )}
                    </View>
                </ScrollView>
            </Modal>
        </Portal>
    );
}

// Componente separado para cada tutor (accordion)
function TutorAccordion({ 
    tutor, 
    index, 
    totalTutores, 
    expanded, 
    onToggle 
}: { 
    tutor: any; 
    index: number; 
    totalTutores: number; 
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
                title={`Postulación ${totalTutores - index}`}
                description={calcularTiempoTranscurrido(tutor.hora)}
                expanded={expanded}
                onPress={onToggle}
                style={{ backgroundColor: 'transparent' }}
                titleStyle={{ fontWeight: 'bold' }}
            >
                <View style={styles.accordionContent}>
                    {/* Información de la postulación */}
                    <ItemDato label='Fecha y hora' data={tutor.hora} />
                    {tutor.observacion && (
                        <ItemDato label='Comentario' data={tutor.observacion} />
                    )}

                    {/* Datos de contacto del usuario */}
                    {tutor.posibleTutor && (
                        <>
                            <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8, fontWeight: 'bold' }}>
                                Datos de contacto
                            </Text>
                            {tutor.posibleTutor.nombre && (
                                <ItemDato label='Nombre' data={tutor.posibleTutor.nombre} />
                            )}
                            {tutor.posibleTutor.email && (
                                <ItemDato label='Email' data={tutor.posibleTutor.email} />
                            )}
                            {tutor.posibleTutor.celular && (
                                <ItemDato label='Teléfono' data={tutor.posibleTutor.celular.toString()} />
                            )}
                            {tutor.posibleTutor.direccion && (
                                <ItemDato label='Dirección' data={tutor.posibleTutor.direccion} />
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
