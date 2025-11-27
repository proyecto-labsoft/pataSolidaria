import { View, ScrollView, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState} from 'react'
import {Button, Modal, Portal, Surface, Text, useTheme} from 'react-native-paper'
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
import { useApiPutActualizarExtravio } from '../api/hooks';
import { obtenerValorSexo, obtenerValorTamanio } from '../utiles/obtenerValorEnum';

// Basandose en colores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef
const imagenes = ImageSlider[0].imagenes

export default function VistaExtravio({route}: any) {    
    const theme = useTheme();

    const navigation = useNavigation()
    const {width,height} = useWindowDimensions()
    const [visible,setVisible] = useState(false)
    const [modoEdicion, setModoEdicion] = useState(false);
    const [successMensaje, setSuccessMensaje] = useState(false);

    const { usuarioId } = useUsuario();

    const [datosAnimal, setDatosAnimal] = useState<any>(null);
    const [datosExtravio, setDatosExtravio] = useState<any>(null);
    const esBuscado = datosExtravio?.creadoByFamiliar;
    useEffect(() => { 
        if ( route.params?.data?.mascotaDetalle) {
            setDatosAnimal(route.params.data.mascotaDetalle);
        } 
        if (route.params?.data) {
            setDatosExtravio(route.params?.data)
        }
    },[route.params?.data])

    const ultimaModificacion = calcularTiempoTranscurrido(datosExtravio?.hora)
    const esCreadorDelExtravio = datosExtravio?.creadorId === usuarioId;

    const { mutateAsync: actualizarExtravio } = useApiPutActualizarExtravio({
        params: { id: datosExtravio?.extravioId },
        onSuccess: () => {
            setSuccessMensaje(true);
        }
    });

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

    const [successResolver, setSuccessResolver] = useState(false);

    const { mutateAsync: resolverExtravio } = useApiPutActualizarExtravio({
        params: { id: datosExtravio?.extravioId },
        onSuccess: () => {
            setSuccessResolver(true);
        }
    });

    const resolverCaso = () => {
        console.log("datosExtravio",datosExtravio)
        const {extravioId, mascotaDetalle, creadoByFamiliar, creadorId, ...restoDAta} = datosExtravio;
        console.log("payload de resuelto",{
            ...restoDAta,
            creador: creadorId,
            resuelto: true
        })
        resolverExtravio({data: {
            ...restoDAta,
            creador: creadorId,
            resuelto: true
        }});
    }   

    return (
        <View style={{height: height,width:width,alignItems:'center'}}>      

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
            <BannerEstadoExtravio titulo={ultimaModificacion} tipo={esBuscado} />
            <ScrollView contentContainerStyle={{margin:12}} > 
                <Portal>
                    <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                        <Mapa puntoModificable={false} style={{width:width,height:height}} latitude={datosExtravio?.latitud} longitude={datosExtravio?.longitud}/>
                        <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained"  onPress={()=> setVisible(false)}>
                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Volver atrás</Text>
                        </Button>
                    </Modal>
                </Portal>
                <CarruselImagenes data={imagenes} />        
                <Surface style={{gap: 20, borderRadius: 20, elevation: 2, backgroundColor: theme?.colors.surfaceVariant, paddingVertical: 20,marginVertical: 20, paddingHorizontal:20,alignItems: "center"}} >
                    {!modoEdicion ? (
                        <>
                            <View style={{ flexDirection:'column', justifyContent:'space-evenly', width: '100%'}}>
                                {esCreadorDelExtravio ? (
                                    <>
                                        <Button 
                                            buttonColor={theme.colors.primary} 
                                            style={{ marginVertical: 8, borderRadius: 20 }} 
                                            uppercase 
                                            mode="contained" 
                                            onPress={() => resolverCaso()}
                                        >
                                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>
                                                Resolver caso
                                            </Text>
                                        </Button>
                                    
                                        <Button 
                                            buttonColor={theme.colors.primary} 
                                            style={{ marginVertical: 8, borderRadius: 20 }} 
                                            uppercase 
                                            mode="contained" 
                                            onPress={() => setModoEdicion(true)}
                                        >
                                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>
                                                Modificar datos del extravío
                                            </Text>
                                        </Button>
                                    </>
                                ) : (
                                    <Button 
                                        buttonColor={theme.colors.primary} 
                                        style={{ marginVertical: 8, borderRadius: 20 }} 
                                        uppercase 
                                        mode="contained" 
                                        onPress={() => navigation.navigate('NuevoAvistamiento')}
                                    >
                                        <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>
                                            Ví este animal
                                        </Text>
                                    </Button>
                                )}
                                <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:20}} uppercase mode="contained" onPress={()=> setVisible(true)} >
                                    <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Ver ubicación</Text>
                                </Button>
                            </View>
                            <ItemDato label='Nombre' data={datosAnimal?.nombre}  />
                            <ItemDato label='Especie' data={datosAnimal?.especie}  />
                            <ItemDato label='Raza' data={datosAnimal?.raza}  />
                            <ItemDato label='Tamaño' data={datosAnimal?.tamanio}  />
                            <ItemDato label='Colores' data={datosAnimal?.colores}  />
                            <ItemDato label='Fecha de nacimiento' data={datosAnimal?.fechaNacimiento}  />
                            <ItemDato label='Genero' data={datosAnimal?.genero}  />
                            <ItemDato label='¿Está esterilizado?' data={datosAnimal?.esterilizado}  />
                            <ItemDato label='¿Está chipeado?' data={datosAnimal?.chipeado} />
                            <ItemDato label='Domicilio' data={datosAnimal?.domicilio}  />
                            <ItemDato label='Observaciones' data={datosAnimal?.descripcion}  />  
                        </>
                    ) : (
                        <FormularioEditarExtravio 
                            data={datosExtravio} 
                            onCancel={() => setModoEdicion(false)} 
                            onSubmit={onSubmitEdicion} 
                        />
                    )}
                </Surface>
            
            </ScrollView>
        </View>
)}

const styles = StyleSheet.create({
    containerStyle: {
        alignItems: "center",
        width: '100%',
        height: '100%',
    },
});
