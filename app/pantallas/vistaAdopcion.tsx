import { View, ScrollView, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, IconButton, Modal, Portal, Text, useTheme, List, TextInput, Card } from 'react-native-paper'
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useUsuario } from '../hooks/useUsuario';
import BackdropSuccess from '../componentes/backdropSuccess';
import { obtenerValorSexo } from '../utiles/obtenerValorEnum';
import BotonAccionesAdopcionFAB from '../componentes/botones/BotonAccionesAdopcionFAB';
import { useObtenerImagenes } from '../api/imagenes.hooks';
import { ImageGallery } from '../componentes/imagenes';
import { useAuth } from '../contexts/AuthContext';

const imagenes = ImageSlider[0].imagenes

export default function VistaAdopcion({ route }: any) {
    const theme = useTheme();
    const { usuarioId } = useUsuario();
    const navigation = useNavigation()
    const isFocused = useIsFocused();
    const { width, height } = useWindowDimensions()
    const { isAdmin } = useAuth()

    const [modoEdicion, setModoEdicion] = useState(false);
    const [successMensaje, setSuccessMensaje] = useState(false);
    const [expandedInfo, setExpandedInfo] = useState(false);
    const [datosAdopcion, setDatosAdopcion] = useState<any>(null);
    const [modalPostularse, setModalPostularse] = useState(false);
    const [modalCerrarAdopcion, setModalCerrarAdopcion] = useState(false);
    const [motivoPostulacion, setMotivoPostulacion] = useState('');
    const [motivoCierre, setMotivoCierre] = useState('');

    const esCreadorDeLaAdopcion = datosAdopcion?.publicador?.id === usuarioId;
    const esTransito = datosAdopcion?.transito;

    // Obtener imágenes de la adopción
    const { data: imagenesAdopcion, isLoading: isLoadingImagenes } = useObtenerImagenes(
        'adopciones',
        datosAdopcion?.id
    );

    useEffect(() => {
        if (route.params?.data) {
            setDatosAdopcion(route.params?.data)
        }
    }, [route.params?.data])

    const handlePostularse = () => {
        // TODO: Implementar lógica de postulación
        console.log("Postulándose con motivo:", motivoPostulacion);
        setMotivoPostulacion('');
        setModalPostularse(false);
        // Aquí iría la llamada a la API
    };

    const handleCerrarAdopcion = () => {
        // TODO: Implementar lógica de cierre de adopción
        console.log("Cerrando adopción con motivo:", motivoCierre);
        setMotivoCierre('');
        setModalCerrarAdopcion(false);
        // Aquí iría la llamada a la API
    };

    const [state, setState] = useState({ open: false });
    const onStateChange = ({ open }: any) => setState({ open });
    const { open } = state;

    return (
        <View style={{ height: height, width: width, backgroundColor: theme.colors.background, alignItems: 'center' }}>
            {/* Modal de Postularse */}
            <Portal>
                <Modal
                    visible={modalPostularse}
                    onDismiss={() => {
                        setModalPostularse(false);
                        setMotivoPostulacion('');
                    }}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.surface,
                        margin: 20,
                        borderRadius: 8,
                        padding: 20,
                        maxHeight: '70%',
                    }}
                >
                    <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 16 }}>
                        {`Postularse para adoptar a ${datosAdopcion?.mascotaDetalle?.nombre || 'este compañero'}`}
                    </Text>
                    <TextInput
                        mode='outlined'
                        label="Cuéntanos por qué quieres adoptar (Opcional)"
                        multiline
                        numberOfLines={4}
                        style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                        }}
                        value={motivoPostulacion}
                        onChangeText={setMotivoPostulacion}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                        <Button
                            mode="outlined"
                            onPress={() => {
                                setModalPostularse(false);
                                setMotivoPostulacion('');
                            }}
                            style={{ marginTop: 16 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={handlePostularse}
                            style={{ marginTop: 16 }}
                        >
                            Confirmar
                        </Button>
                    </View>
                </Modal>
            </Portal>

            {/* Modal de Cerrar Adopción */}
            <Portal>
                <Modal
                    visible={modalCerrarAdopcion}
                    onDismiss={() => {
                        setModalCerrarAdopcion(false);
                        setMotivoCierre('');
                    }}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.surface,
                        margin: 20,
                        borderRadius: 8,
                        padding: 20,
                        maxHeight: '70%',
                    }}
                >
                    <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 16 }}>
                        {`Cerrar adopción de ${datosAdopcion?.mascotaDetalle?.nombre || 'este compañero'}`}
                    </Text>
                    <TextInput
                        mode='outlined'
                        label="¿Cómo se resolvió? (Opcional)"
                        multiline
                        numberOfLines={4}
                        style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                        }}
                        value={motivoCierre}
                        onChangeText={setMotivoCierre}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                        <Button
                            mode="outlined"
                            onPress={() => {
                                setModalCerrarAdopcion(false);
                                setMotivoCierre('');
                            }}
                            style={{ marginTop: 16 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={handleCerrarAdopcion}
                            style={{ marginTop: 16 }}
                        >
                            Confirmar
                        </Button>
                    </View>
                </Modal>
            </Portal>

            <Portal>
                {successMensaje && (
                    <BackdropSuccess
                        texto="Operación exitosa"
                        onTap={() => {
                            setModoEdicion(false);
                            setSuccessMensaje(false);
                        }}
                    />
                )}
            </Portal>

            <AppbarNav titulo={esTransito ? 'TRÁNSITO' : 'ADOPCIÓN'} />

            <ScrollView style={{ width: '100%', height: '100%' }}>
                {/* Galería de imágenes */}
                {(esCreadorDeLaAdopcion || isAdmin) ? (
                    // Si es el creador o administrador, mostrar galería editable
                    <View style={{ marginBottom: 24 }}>
                        <ImageGallery
                            entityType="adopciones"
                            entityId={datosAdopcion?.id}
                            editable={true}
                            maxImages={5}
                        />
                    </View>
                ) : (
                    // Si no es el creador ni administrador, mostrar carrusel solo lectura
                    <View style={{ position: 'relative', margin: 0, marginBottom: 24, padding: 0, backgroundColor: theme.colors.background }} >
                        <CarruselImagenes 
                            data={imagenes}
                            imagenesReales={imagenesAdopcion}
                            isLoading={isLoadingImagenes}
                        />
                    </View>
                )}

                {/* Información adicional - Dropdown */}
                <Card style={{ ...styles.ultimoAvistamientoContainer, marginHorizontal: 16, backgroundColor: theme.colors.surface }}>
                    <List.Accordion
                        title={<Text variant='titleMedium' style={{ color: theme.colors.onPrimaryContainer }}>Información del compañero</Text>}
                        titleStyle={{ fontWeight: 'bold' }}
                        expanded={expandedInfo}
                        onPress={() => {
                            if (expandedInfo) {
                                setModoEdicion(false);
                            }
                            setExpandedInfo(!expandedInfo)
                        }}
                        style={{ backgroundColor: theme.colors.surfaceVariant, marginHorizontal: 0 }}
                    >
                        <View style={{ padding: 16, paddingTop: 32, position: 'relative', gap: 12, borderTopColor: theme.colors.outline, borderTopWidth: 0.5 }}>
                            {!modoEdicion ? (
                                <>
                                    {esCreadorDeLaAdopcion && (
                                        <IconButton
                                            icon="pencil"
                                            size={18}
                                            containerColor={theme.colors.primary}
                                            style={{ position: 'absolute', top: 5, right: 10, zIndex: 10 }}
                                            iconColor={theme.colors.onPrimary}
                                            onPress={() => setModoEdicion(true)}
                                        />
                                    )}
                                    {datosAdopcion?.mascotaDetalle?.nombre && <ItemDato label='Nombre' data={datosAdopcion.mascotaDetalle.nombre} />}
                                    {datosAdopcion?.mascotaDetalle?.especie && <ItemDato label='Especie' data={datosAdopcion.mascotaDetalle.especie} />}
                                    {datosAdopcion?.mascotaDetalle?.raza && <ItemDato label='Raza' data={datosAdopcion.mascotaDetalle.raza} />}
                                    {datosAdopcion?.mascotaDetalle?.tamanio && <ItemDato label='Tamaño' data={datosAdopcion.mascotaDetalle.tamanio} />}
                                    {datosAdopcion?.mascotaDetalle?.color && <ItemDato label='Colores' data={datosAdopcion.mascotaDetalle.color} />}
                                    {datosAdopcion?.mascotaDetalle?.fechaNacimiento && <ItemDato label='Fecha de nacimiento' data={datosAdopcion.mascotaDetalle.fechaNacimiento} />}
                                    {datosAdopcion?.mascotaDetalle?.sexo && <ItemDato label='Sexo' data={obtenerValorSexo(datosAdopcion.mascotaDetalle.sexo)} />}
                                    {datosAdopcion?.mascotaDetalle?.esterilizado !== undefined && <ItemDato label='¿Está esterilizado?' data={datosAdopcion.mascotaDetalle.esterilizado ? 'Sí' : 'No'} />}
                                    {datosAdopcion?.mascotaDetalle?.chipeado !== undefined && datosAdopcion?.mascotaDetalle?.chipeado !== null && <ItemDato label='¿Está chipeado?' data={datosAdopcion.mascotaDetalle.chipeado ? 'Sí' : 'No'} />}
                                    {datosAdopcion?.mascotaDetalle?.descripcion && <ItemDato label='Descripción' data={datosAdopcion.mascotaDetalle.descripcion} />}
                                </>
                            ) : (
                                <View style={{ gap: 10 }}>
                                    <Text>Modo edición (Por implementar)</Text>
                                    <Button onPress={() => setModoEdicion(false)}>Cancelar</Button>
                                </View>
                            )}
                        </View>
                    </List.Accordion>
                </Card>

                {/* Información de adopción */}
                <Card style={{ ...styles.ultimoAvistamientoContainer, margin: 16, backgroundColor: theme.colors.surfaceVariant }}>
                    <View style={{ ...styles.headerAvistamiento }}>
                        <Text variant='titleLarge' style={{ color: theme.colors.onBackground }}>
                            Información de {esTransito ? 'tránsito' : 'adopción'}
                        </Text>
                    </View>
                    <View style={{ padding: 16, gap: 12 }}>
                        {datosAdopcion?.requisitos && (
                            <ItemDato label='Requisitos' data={datosAdopcion.requisitos} />
                        )}
                        <ItemDato
                            label='Tipo'
                            data={esTransito ? 'Tránsito temporal' : 'Adopción permanente'}
                        />
                    </View>
                </Card>
            </ScrollView>

            {/* FAB de acciones */}
            <BotonAccionesAdopcionFAB
                esCreadorDeLaAdopcion={esCreadorDeLaAdopcion}
                onPostularse={() => setModalPostularse(true)}
                onCerrarAdopcion={() => setModalCerrarAdopcion(true)}
                showButton={!modoEdicion && isFocused}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    ultimoAvistamientoContainer: {
        overflow: 'hidden',
    },
    headerAvistamiento: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});
