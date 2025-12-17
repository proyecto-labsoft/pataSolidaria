import { View, ScrollView, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useState} from 'react'
import {Button, IconButton, Modal, Portal, Surface, Text, useTheme, List, TextInput, Card, Icon } from 'react-native-paper'
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Mapa } from '../componentes/mapa';
import BannerEstadoExtravio from '../componentes/bannerEstadoExtravio';
import { calcularTiempoTranscurrido } from '../utiles/calcularTiempoTranscurrido';
import { useUsuario } from '../hooks/useUsuario';
import FormularioEditarExtravio from '../componentes/formularios/formularioEditarExtravio';
import BackdropSuccess from '../componentes/backdropSuccess';
import { useApiDeleteFavorito, useApiGetAvistamientosPorExtravio, useApiGetEsFavorito, useApiPostFavorito, useApiPutActualizarExtravio, useApiPutActualizarMascota } from '../api/hooks';
import { obtenerValorSexo } from '../utiles/obtenerValorEnum';
import ModalAvistamientos from '../componentes/modalAvistamientos';
import BotonAccionesExtravioFAB from '../componentes/botones/BotonAccionesExtravioFAB';
import { useObtenerImagenes } from '../api/imagenes.hooks';
import { ImageGallery } from '../componentes/imagenes';

// Basandose en colores de la pagina de ARAF
// primario: 0f7599 
// secundario: e28325
// terciario: efefef
const imagenes = ImageSlider[0].imagenes

export default function VistaExtravio({route}: any) {    
    
    const theme = useTheme();
    const { usuarioId } = useUsuario();
    const navigation = useNavigation()
    const isFocused = useIsFocused();
    const {width,height} = useWindowDimensions()

    const [visible,setVisible] = useState(false)
    const [modoEdicion, setModoEdicion] = useState(false);
    const [successMensaje, setSuccessMensaje] = useState(false);
    const [expandedInfo, setExpandedInfo] = useState(false);
    const [observacionResolver, setObservacionResolver] = useState(''); 
    const [datosAnimal, setDatosAnimal] = useState<any>(null);
    const [datosExtravio, setDatosExtravio] = useState<any>(null);
    const [successResolver, setSuccessResolver] = useState(false);
    const [modalAvistamientos, setModalAvistamientos] = useState(false);
    const [avistamientoSeleccionado, setAvistamientoSeleccionado] = useState<any>(null);
    
    const esBuscado = datosExtravio?.creadoByFamiliar;
    const esCreadorDelExtravio = datosExtravio?.creadorId === usuarioId;
    const ultimaModificacion = calcularTiempoTranscurrido(datosExtravio?.hora)

    useEffect(() => { 
        if ( route.params?.data?.mascotaDetalle) {
            setDatosAnimal(route.params.data.mascotaDetalle);
        } 
        if (route.params?.data) {
            setDatosExtravio(route.params?.data)
        }
    },[route.params?.data])

    const { mutateAsync: actualizarDatoMascota, isPending: isPendingActualizarDatoMascota } = useApiPutActualizarMascota({
        params: { id: datosExtravio?.mascotaId  },
        onSuccess: () => {
            setSuccessMensaje(true);
        }
    });

    const { data: avistamientos, isFetching: isLoadingAvistamientos } = useApiGetAvistamientosPorExtravio({
        params: { id: datosExtravio?.extravioId },
        enabled: !!datosExtravio?.extravioId
    }) 

    // Obtener imágenes del extravío
    const { data: imagenesExtravio, isLoading: isLoadingImagenes } = useObtenerImagenes(
        'extravios',
        datosExtravio?.extravioId
    );

    const ultimoAvistamiento = useMemo(() => {
        if (avistamientos && avistamientos?.length > 0) {
            // Ordenar avistamientos por fecha (más reciente primero)
            return avistamientos[0]
        }
        return datosExtravio;
    }, [avistamientos]);

    const onSubmitEdicion = (data: any) => { 
        if (data?.sexo === 'Macho') {
            data.sexo = 'M';
        } else if (data?.sexo === 'Hembra') {
            data.sexo = 'H';
        } else if (data?.sexo === 'No lo sé') {
            data.sexo = null;
        }
        if (data?.tamanio === 'Pequeño') {
            data.tamanio = 'PEQUENIO';
        } else if (data?.tamanio === 'Mediano') {
            data.tamanio = 'MEDIANO';
        } else if (data?.tamanio === 'Grande') {
            data.tamanio = 'GRANDE';
        } else if (data?.tamanio === 'Muy grande') {
            data.tamanio = 'GIGANTE';
        }
        actualizarDatoMascota({
            data: {
                familiarId: null,
                nombre: null,
                esterilizado: null,
                chipeado: null,
                especie: data?.especie || null,
                raza: data?.raza || null,
                tamanio: data?.tamanio || null,
                color: data?.color || null,
                sexo: data?.sexo || null,
                descripcion: data?.descripcion || null,
            }
        });
    };


    const { mutateAsync: resolverExtravio, isPending: isPendingResolver } = useApiPutActualizarExtravio({
        params: { id: datosExtravio?.extravioId },
        onSuccess: () => {
            setSuccessResolver(true);
        }
    });

    const handleResolverCaso = () => {
        const {extravioId, mascotaDetalle, creadoByFamiliar, creadorId, ...restoDAta} = datosExtravio;
        
        // Si hay observación nueva, la agrega a la existente
        const observacionFinal = observacionResolver.trim() 
            ? `${restoDAta.observacion || ''}. Resolución: ${observacionResolver}`.trim()
            : restoDAta.observacion;
        
        resolverExtravio({data: {
            ...restoDAta,
            creador: creadorId,
            resuelto: true,
            observacion: observacionFinal
        }});
        
        // Limpiar y cerrar modal
        setObservacionResolver('');
        setResolverCaso(false);
    };

    const [resolverCaso, setResolverCaso] = useState(false);
    const habdleCloseResolver = () => {
        setResolverCaso(false);
        setObservacionResolver('');
    }
    

    const { data: esFavorito } = useApiGetEsFavorito({
        params: {
            queryParams: {
                usuarioId: usuarioId,
                extravioId: datosExtravio?.extravioId
            }
        },
        enabled: !!usuarioId && !!datosExtravio?.extravioId
    })
    const { mutateAsync: guardarCaso } = useApiPostFavorito({})
    const { mutateAsync: borrarFavorito } = useApiDeleteFavorito({
        params: { 
            id: datosExtravio?.extravioId, 
            queryParams: {
                usuarioId: usuarioId
            } 
        },
    })

    const handleGuardarCaso = () => { 
        // Aquí podrías implementar la lógica para guardar el caso, como agregarlo a una lista de favoritos
        if (esFavorito) {
            borrarFavorito()
        } else {
            guardarCaso({data: {
                usuarioId: usuarioId,
                extravioId: datosExtravio?.extravioId
            }})
        }
        
    } 

    console.log("Vista extravio",datosExtravio)
    return (
        <View style={{ height: height, width: width, backgroundColor: theme.colors.background, alignItems:'center'}}>      
            <Portal>
                <Modal
                    visible={resolverCaso} 
                    onDismiss={habdleCloseResolver}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.surface,
                        margin: 20,
                        borderRadius: 8,
                        padding: 20,
                        maxHeight: '70%',
                    }}
                >
                    <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 16 }}>
                        {`Resolver caso de ${datosAnimal?.nombre || 'extraviado'}`}
                    </Text> 
                    <TextInput
                        mode='outlined'
                        label="¿Cómo se resolvió el caso? (Opcional)"
                        multiline
                        numberOfLines={4}
                        style={{ 
                            width: '100%',
                            backgroundColor: 'transparent',
                        }}
                        value={observacionResolver}
                        onChangeText={setObservacionResolver}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
                    <Button 
                        mode="outlined"
                        onPress={habdleCloseResolver}
                        style={{ marginTop: 16 }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        mode="outlined"
                        onPress={handleResolverCaso}
                        style={{ marginTop: 16 }}
                        disabled={isPendingResolver}
                        loading={isPendingResolver}
                    >
                        Confirmar
                    </Button>
                    </View>
                </Modal>
            </Portal>
            <Portal>
                {successMensaje && (
                    <BackdropSuccess
                        texto="Se modificaron los datos del extravío"
                        onTap={() => {
                            setModoEdicion(false);
                            setSuccessMensaje(false);
                        }}
                    />
                )}
                {successResolver && (
                    <BackdropSuccess
                        backgroundColor="#1db100ff"
                        color={theme.colors.surface}
                        texto="Caso resuelto"
                        onTap={() => {
                            setSuccessResolver(false);
                            navigation.goBack();
                        }}
                    />
                )}
            </Portal>
            <AppbarNav titulo={esBuscado ? 'BUSCADO' : 'EXTRAVIADO'} />
            
            <ScrollView style={{ width: '100%', height: '100%'}} > 
                <Portal>
                    <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                        <Mapa puntoModificable={false} style={{width:width,height:height}} latitude={datosExtravio?.latitud} longitude={datosExtravio?.longitud}/>
                        <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained"  onPress={()=> setVisible(false)}>
                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Volver atrás</Text>
                        </Button>
                    </Modal>
                </Portal>

                {/* Banner con posición absoluta */}
                <View style={styles.bannerContainer}>
                    <BannerEstadoExtravio titulo={ultimaModificacion} tipo={esBuscado} />
                </View>

                {/* Galería de imágenes - Segunda posición */}
                {esCreadorDelExtravio ? (
                    // Si es el creador, mostrar galería editable
                    <View style={{ marginBottom: 24 }}>
                        <ImageGallery
                            entityType="extravios"
                            entityId={datosExtravio?.extravioId}
                            editable={true}
                            maxImages={5}
                        />
                    </View>
                ) : (
                    // Si no es el creador, mostrar carrusel solo lectura
                    <View style={{ position: 'relative', margin: 0, marginBottom: 24, padding: 0, backgroundColor: theme.colors.background }} >
                        <CarruselImagenes 
                            data={imagenes} 
                            imagenesReales={imagenesExtravio}
                            isLoading={isLoadingImagenes}
                        />
                        <View style={{ position: 'absolute' , top: 200, right: 10 }}>
                            <IconButton icon={esFavorito ? "heart" : "heart-outline"} iconColor={theme.colors.secondary} size={48} onPress={handleGuardarCaso} />
                        </View>
                    </View>
                )}

                    
                {/* Mensaje indicador de creador */}
                {esCreadorDelExtravio && (
                    <Surface style={{ padding: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: theme.colors.secondary, marginBottom: 8 }}>
                        <Icon size={24} source="information-outline" />
                        <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold', textAlign: 'center' }}>
                            Este extravío fue creado por tí
                        </Text>
                    </Surface>
                )} 
                
                {/* Información adicional - Dropdown - Tercera posición */}  
                
                {datosExtravio?.observacion && (
                    <Card style={{...styles.ultimoAvistamientoContainer, margin: 16, backgroundColor: theme.colors.surfaceVariant }}>
                        <View style={{...styles.headerAvistamiento, flexDirection:'column', alignItems:'flex-start' }}>
                            <Text variant='titleLarge' style={{ color: theme.colors.onBackground }}>
                                Información adicional
                            </Text>
                            <Text variant='titleMedium' style={{ color: theme.colors.onBackground }}>
                                {datosExtravio?.observacion || 'Sin observaciones adicionales'}
                            </Text>
                        </View> 
                    </Card>
                )}
                <Card style={{...styles.ultimoAvistamientoContainer,  marginHorizontal: 16,  backgroundColor: theme.colors.surface }}>
                
                    
                    <List.Accordion
                        title={<Text variant='titleLarge' style={{ color: theme.colors.onPrimaryContainer }}>Descripción del animal</Text>} 
                        titleStyle={{fontWeight: 'bold'}}
                        expanded={expandedInfo}
                        onPress={() => {
                            if (expandedInfo) {
                                setModoEdicion(false);
                            }
                            setExpandedInfo(!expandedInfo)}}
                        style={{backgroundColor: theme.colors.surfaceVariant, marginHorizontal: 0}}
                    >
                        <View style={{padding: 16, paddingTop: 32, position: 'relative', gap: 12, borderTopColor: theme.colors.outline, borderTopWidth: 0.5 }}>
                            {!modoEdicion ? (
                                <>
                                    <IconButton icon="pencil" size={18} containerColor={theme.colors.primary} style={{ position: 'absolute', top: 5, right: 10, zIndex: 10 }} iconColor={theme.colors.onPrimary} onPress={() => setModoEdicion(true)}/>
                                    {datosAnimal?.nombre && <ItemDato label='Nombre' data={datosAnimal.nombre} />}
                                    {datosAnimal?.especie && <ItemDato label='Especie' data={datosAnimal.especie} />}
                                    {datosAnimal?.raza && <ItemDato label='Raza' data={datosAnimal.raza} />}
                                    {datosAnimal?.tamanio && <ItemDato label='Tamaño' data={(datosAnimal.tamanio)} />}
                                    {datosAnimal?.colores && <ItemDato label='Colores' data={datosAnimal.colores} />}
                                    {datosAnimal?.fechaNacimiento && <ItemDato label='Fecha de nacimiento' data={datosAnimal.fechaNacimiento} />}
                                    {datosAnimal?.sexo && <ItemDato label='Sexo' data={obtenerValorSexo(datosAnimal.sexo)} />}
                                    {datosAnimal?.esterilizado !== undefined && esBuscado && <ItemDato label='¿Está esterilizado?' data={datosAnimal.esterilizado} />}
                                    {datosAnimal?.chipeado !== undefined && esBuscado && <ItemDato label='¿Está chipeado?' data={datosAnimal.chipeado} />}
                                    {datosAnimal?.domicilio && <ItemDato label='Domicilio' data={datosAnimal.domicilio} />}
                                    {datosAnimal?.descripcion && <ItemDato label='Observaciones' data={datosAnimal.descripcion} />}
                                </>
                            )
                            : ( 
                                <FormularioEditarExtravio 
                                    data={datosExtravio} 
                                    submitting={isPendingActualizarDatoMascota}
                                    onCancel={() => setModoEdicion(false)} 
                                    onSubmit={onSubmitEdicion} 
                                /> 
                            )}
                        </View>
                    </List.Accordion> 
                </Card> 

                {/* Bloque fijo de último avistamiento */}
                <Card style={{...styles.ultimoAvistamientoContainer, margin: 16, backgroundColor: theme.colors.surfaceVariant }}>
                    <View style={{...styles.headerAvistamiento, flexDirection:'column' }}>
                        <Text variant='titleLarge' style={{ color: theme.colors.onBackground }}>
                            Último avistamiento
                        </Text>
                        <Text variant='titleMedium' style={{ color: theme.colors.onBackground }}>
                            {calcularTiempoTranscurrido(ultimoAvistamiento?.hora)}
                        </Text>
                    </View>
                    <View style={styles.mapContainer}>
                        <Mapa 
                            puntoModificable={false} 
                            latitude={ultimoAvistamiento?.latitud} 
                            longitude={ultimoAvistamiento?.longitud}
                            style={styles.map}
                        />
                    </View>
                    <View style={{padding: 16}}>
                        {ultimoAvistamiento && (
                            <>
                                {/* <ItemDato label='Fecha y hora' data={ultimoAvistamiento?.hora} /> */}
                                {ultimoAvistamiento?.comentario && (
                                    <ItemDato label='Observaciones' data={ultimoAvistamiento?.comentario} />
                                )}
                            </>
                        )}
                        <Button onPress={() => setModalAvistamientos(true)} mode='contained' >Ver avistamientos</Button>
                    </View>
                </Card>

                {/* Modal de lista de avistamientos */}
                <ModalAvistamientos
                    visible={modalAvistamientos}
                    onDismiss={() => {
                        setModalAvistamientos(false);
                        setAvistamientoSeleccionado(null);
                    }}
                    avistamientos={avistamientos || []}
                    datosExtravio={datosExtravio}
                    avistamientoSeleccionado={avistamientoSeleccionado}
                    setAvistamientoSeleccionado={setAvistamientoSeleccionado}
                /> 
            </ScrollView>

            {/* FAB de acciones */}
            <BotonAccionesExtravioFAB
                esCreadorDelExtravio={esCreadorDelExtravio}
                esFamiliar={esBuscado} 
                onResolverCaso={() => setResolverCaso(true)} 
                onViEsteAnimal={() => navigation.navigate('NuevoAvistamiento', {data: {extravioId: datosExtravio?.extravioId}})} 
                showButton={!modoEdicion && isFocused}
            />
        </View>
)}

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
    infoContainer: {  
        elevation: 2, 
        borderTopWidth: 1,
        overflow: 'hidden',
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
