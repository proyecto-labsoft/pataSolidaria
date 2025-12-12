import { View, ScrollView, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useState} from 'react'
import {Button, IconButton, Modal, Portal, Surface, Text, useTheme, List, TextInput} from 'react-native-paper'
import ItemDato from '../componentes/itemDato';
import { ImageSlider } from '../testData/sliderData';
import CarruselImagenes from '../componentes/carrusel/carruselImagenes';
import AppbarNav from '../componentes/navegacion/appbarNav';
import { useNavigation } from "@react-navigation/native";
import { Mapa } from '../componentes/mapa';
import BannerEstadoExtravio from '../componentes/bannerEstadoExtravio';
import { calcularTiempoTranscurrido } from '../utiles/calcularTiempoTranscurrido';
import { useUsuario } from '../hooks/useUsuario';
import FormularioEditarExtravio from '../componentes/formularios/formularioEditarExtravio';
import BackdropSuccess from '../componentes/backdropSuccess';
import { useApiGetAvistamientosPorExtravio, useApiPutActualizarExtravio } from '../api/hooks';
import { obtenerValorSexo, obtenerValorTamanio } from '../utiles/obtenerValorEnum';
import ModalAvistamientos from '../componentes/modalAvistamientos';

// Basandose en colores de la pagina de ARAF
// primario: 0f7599 
// secundario: e28325
// terciario: efefef
const imagenes = ImageSlider[0].imagenes

export default function VistaExtravio({route}: any) {    
    
    const theme = useTheme();
    const { usuarioId } = useUsuario();
    const navigation = useNavigation()
    const {width,height} = useWindowDimensions()

    const [visible,setVisible] = useState(false)
    const [modoEdicion, setModoEdicion] = useState(false);
    const [successMensaje, setSuccessMensaje] = useState(false);
    const [expandedInfo, setExpandedInfo] = useState(false);
    const [observacionResolver, setObservacionResolver] = useState('');
    const [verUltimoAvistamiento, setVerUltimoAvistamiento] = useState(true);
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

    const { mutateAsync: actualizarExtravio } = useApiPutActualizarExtravio({
        params: { id: datosExtravio?.extravioId },
        onSuccess: () => {
            setSuccessMensaje(true);
        }
    });

    const { data: avistamientos, isFetching: isLoadingAvistamientos } = useApiGetAvistamientosPorExtravio({
        params: { id: datosExtravio?.extravioId },
        enabled: !!datosExtravio?.extravioId
    })

    // Calcular la hora a mostrar: último avistamiento o hora del extravío
    // const obtenerUltimaHora = () => {
    //     if (avistamientos && avistamientos.length > 0) {
    //         // Ordenar avistamientos por fecha (más reciente primero)
    //         const avistamientosOrdenados = [...avistamientos].sort((a, b) => {
    //             // Parsear fecha en formato dd-MM-yyyy HH:mm:ss
    //             const parseFecha = (fechaStr: string) => {
    //                 const partes = fechaStr.split(' ');
    //                 const [dia, mes, anio] = partes[0].split('-').map(Number);
    //                 const [hora, minuto] = partes[1].split(':').map(Number);
    //                 return new Date(anio, mes - 1, dia, hora, minuto).getTime();
    //             };
    //             return parseFecha(b.hora) - parseFecha(a.hora);
    //         });
    //         return avistamientosOrdenados[0].hora;
    //     }
    //     return datosExtravio?.hora;
    // }; 

    const ultimoAvistamiento = useMemo(() => {
        console.log("avistamientos",avistamientos)
        if (avistamientos && avistamientos?.length > 0) {
            // Ordenar avistamientos por fecha (más reciente primero)
            return avistamientos[0]
        }
        return datosExtravio;
    }, [avistamientos]);

    const onSubmitEdicion = (data: any) => {
        // Combinar fecha y hora en un solo campo
        const fechaHora = `${data?.fecha} ${data?.hora}:00`;
        
        actualizarExtravio({
            data: {
                datosExtravio: {
                    creador: usuarioId,
                    mascotaId: datosExtravio?.mascotaId,
                    resuelto: datosExtravio?.resuelto || false,
                    zona: data?.zona || '',
                    direccion: data?.direccion || '',
                    observacion: data?.observacion || '',
                    hora: fechaHora,
                    latitud: datosExtravio?.latitud,
                    longitud: datosExtravio?.longitud,
                },
                datosMascota: {
                    especie: data?.especie || null,
                    raza: data?.raza || null,
                    tamanio: obtenerValorTamanio(data?.tamanio) || null,
                    color: data?.color || null,
                    sexo: obtenerValorSexo(data?.sexo) || null,
                    descripcion: data?.descripcion || null,
                }
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
    

    // TOD
    // const { data: casoFavorito } = useApiGetCasoFavorito({})
    // const { mutateAsync: guardarCaso } = useApiPostFavorito({})

    const handleGuardarCaso = (extravioId: number) => {
        // Aquí podrías implementar la lógica para guardar el caso, como agregarlo a una lista de favoritos
        // guardarCaso({data: {extravioId}})
    }

    return (
        <View style={{height: height,width:width,alignItems:'center'}}>      
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
            
            <ScrollView> 
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

                {/* Carrusel de imágenes - Segunda posición */}
                <View style={{ marginHorizontal: 18 }} >
                    <CarruselImagenes data={imagenes} />
                </View>
                
                {/* Botones de acción */}
                <View style={{ flexDirection:'row', justifyContent:'space-around', marginTop: 24, width: '100%'}}> 
                    {esCreadorDelExtravio ? (
                        <>
                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Button
                                    icon="check-circle"
                                    // containerColor={theme.colors.primary} 
                                    // iconColor={theme.colors.onPrimary}
                                    mode="contained" 
                                    onPress={() => setResolverCaso(true)}
                                >
                                    Resolver caso
                                </Button>
                            </View>  
                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Button
                                    icon="pencil"
                                    // containerColor={theme.colors.primary} 
                                    // iconColor={theme.colors.onPrimary}
                                    mode="contained" 
                                    onPress={() => setModoEdicion(true)}
                                >
                                    Editar información
                                </Button>
                            </View>  
                        </>
                    ) : (
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton
                                mode='contained'
                                containerColor={theme.colors.primary}
                                iconColor={theme.colors.onPrimary}
                                icon="eye-plus-outline"
                                style={{ marginBottom: 2 }}
                                onPress={() => navigation.navigate('NuevoAvistamiento', {data: {extravioId: datosExtravio?.extravioId}})}
                            />
                            <Text variant='bodyLarge' style={{ fontWeight: 'bold', color: theme.colors.primary, padding: 4, borderRadius: 10}}>¡Ví este animal!</Text>
                        </View>
                    )}  
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                            mode='contained'
                            iconColor={theme.colors.error}
                            containerColor={theme.colors.background}
                            icon="heart-outline"
                            style={{ marginBottom: 2 }}
                            onPress={() => handleGuardarCaso(datosExtravio?.extravioId)} 
                        />
                        <Text variant='bodyLarge' style={{ fontWeight: 'bold', color: theme.colors.error, padding: 4, borderRadius: 10}}>Guardar caso</Text>
                    </View>
                </View>

                {/* Bloque fijo de último avistamiento */}
                <Surface style={{...styles.ultimoAvistamientoContainer, backgroundColor: theme.colors.surfaceVariant}}>
                    <View style={styles.headerAvistamiento}>
                        <Text variant='titleMedium' style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>
                            {avistamientos && avistamientos?.length > 0 
                                ? `Último avistamiento: ${calcularTiempoTranscurrido(ultimoAvistamiento?.hora)}`
                                : 'Ubicación del extravío'
                            }
                        </Text>
                        {avistamientos && avistamientos?.length > 0 && (
                            <Button 
                                mode="outlined" 
                                onPress={() => setModalAvistamientos(true)}
                                compact
                            >
                                Ver todos
                            </Button>
                        )}
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
                                <ItemDato label='Fecha y hora' data={ultimoAvistamiento?.hora} />
                                {ultimoAvistamiento?.comentario && (
                                    <ItemDato label='Observaciones' data={ultimoAvistamiento?.comentario} />
                                )}
                            </>
                        )}
                    </View>
                </Surface>

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
                
                {/* Información adicional - Dropdown - Tercera posición */}  
                {!modoEdicion ? (
                    <Surface style={{...styles.infoContainer, backgroundColor: theme.colors.surface, borderColor: theme.colors.outline}}>
                        <List.Accordion
                            title={<Text variant='titleMedium' style={{ color: theme.colors.onPrimaryContainer }}>Información adicional</Text>} 
                            titleStyle={{fontWeight: 'bold'}}
                            expanded={expandedInfo}
                            onPress={() => setExpandedInfo(!expandedInfo)}
                            style={{backgroundColor: theme.colors.surfaceVariant, marginHorizontal: 0}}
                        >
                            <View style={{padding: 16, gap: 12}}>
                                {datosAnimal?.nombre && <ItemDato label='Nombre' data={datosAnimal.nombre} />}
                                {datosAnimal?.especie && <ItemDato label='Especie' data={datosAnimal.especie} />}
                                {datosAnimal?.raza && <ItemDato label='Raza' data={datosAnimal.raza} />}
                                {datosAnimal?.tamanio && <ItemDato label='Tamaño' data={datosAnimal.tamanio} />}
                                {datosAnimal?.colores && <ItemDato label='Colores' data={datosAnimal.colores} />}
                                {datosAnimal?.fechaNacimiento && <ItemDato label='Fecha de nacimiento' data={datosAnimal.fechaNacimiento} />}
                                {datosAnimal?.genero && <ItemDato label='Género' data={datosAnimal.genero} />}
                                {datosAnimal?.esterilizado !== undefined && <ItemDato label='¿Está esterilizado?' data={datosAnimal.esterilizado} />}
                                {datosAnimal?.chipeado !== undefined && <ItemDato label='¿Está chipeado?' data={datosAnimal.chipeado} />}
                                {datosAnimal?.domicilio && <ItemDato label='Domicilio' data={datosAnimal.domicilio} />}
                                {datosAnimal?.descripcion && <ItemDato label='Observaciones' data={datosAnimal.descripcion} />}
                            </View>
                        </List.Accordion>
                    </Surface>
                ) : (
                    <Surface style={{...styles.infoContainer, backgroundColor: theme.colors.surface, borderColor: theme.colors.outline}}>
                        <FormularioEditarExtravio 
                            data={datosExtravio} 
                            onCancel={() => setModoEdicion(false)} 
                            onSubmit={onSubmitEdicion} 
                        />
                    </Surface>
                )} 
            
            
            </ScrollView> 
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
        elevation: 2, 
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
