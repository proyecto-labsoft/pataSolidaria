import { View, StyleSheet, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import {useState, useEffect, useRef, useCallback} from 'react'
import { Button, useTheme, Text, Portal, Modal } from 'react-native-paper' 
import { useForm } from 'react-hook-form' 
import { useNavigation } from '@react-navigation/native' 
import BackdropSuccess from '../../backdropSuccess' 
import UbicacionStep from './ubicacionStep'
import FechaStep from './fechaStep'
import ConfirmacionStep from './confirmacionStep'
import AspectoStep from './aspectoStep'
import { useApiPostEmergencia, useApiPostExtravioSinFamiliar } from '@/app/api/hooks' 
import { obtenerValorSexo, obtenerValorTamanio } from '@/app/utiles/obtenerValorEnum'
import { useUsuario } from '@/app/hooks/useUsuario'
import { CameraModal } from '../../CameraModal'
import { formatearFechaBuenosAires, formatearHoraBuenosAires } from '@/app/utiles/fechaHoraBuenosAires'
import { useSubirImagen } from '@/app/api/imagenes.hooks'
import { api } from '@/app/api/api'
import { API_URL } from '@/app/api/api.rutas'

export default function FormularioNuevaEmergencia() {
    const theme = useTheme() 
    const [visible,setVisible] = useState(false)
    const [successMensaje,setSuccessMensaje] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [showCamera, setShowCamera] = useState(true)
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
    const navigation = useNavigation()

    // Valores animados para cada paso y línea
    const stepAnimations = useRef([
        new Animated.Value(0), // Paso 1
        new Animated.Value(0), // Paso 2
        new Animated.Value(0), // Paso 3
        new Animated.Value(0), // Paso 4
    ]).current

    const lineAnimations = useRef([
        new Animated.Value(0), // Línea 1-2
        new Animated.Value(0), // Línea 2-3
        new Animated.Value(0), // Línea 3-4
    ]).current

    const subirImagenMutation = useSubirImagen('emergencias');

    const { mutateAsync: declararEmergencia, isPending: isPendingDeclararEmergencia } = useApiPostEmergencia({ 
        onSuccess: async (response) => {
            console.log('✅ Emergencia creada, respuesta completa:', JSON.stringify(response, null, 2));
            
            let emergenciaId = response?.id || response?.emergenciaId || response?.data?.id;
            console.log('🔍 Response del POST:', response);
            
            // Si no tenemos el ID en la respuesta, obtener la emergencia más reciente del usuario
            if (!emergenciaId) {
                console.log('⏳ ID no encontrado en respuesta, consultando emergencias del usuario...');
                try {
                    const emergenciasResponse = await api.get(`${API_URL}/emergencias/user/${usuarioId}`);
                    const emergencias = emergenciasResponse?.data;
                    console.log('📋 Todas las emergencias del usuario:', emergencias);
                    
                    if (emergencias && emergencias.length > 0) {
                        const emergenciasOrdenadas = [...emergencias].sort((a, b) => {
                            const idA = a.emergenciaId || a.id;
                            const idB = b.emergenciaId || b.id;
                            return idB - idA;
                        });
                        
                        emergenciaId = emergenciasOrdenadas[0]?.emergenciaId || emergenciasOrdenadas[0]?.id;
                        console.log('🎯 ID obtenido de la emergencia más reciente:', emergenciaId);
                    }
                } catch (error) {
                    console.error('❌ Error obteniendo emergencias del usuario:', error);
                }
            }
            
            console.log('🎯 ID final a usar:', emergenciaId);
            
            // Si hay foto capturada, subirla automáticamente
            if (capturedPhoto && emergenciaId) {
                try {
                    console.log('📤 Subiendo foto capturada a la emergencia:', emergenciaId);
                    await subirImagenMutation.mutateAsync({
                        entityId: emergenciaId,
                        file: {
                            uri: capturedPhoto,
                            type: 'image/jpeg',
                            name: `emergencia-captured-${Date.now()}.jpg`
                        },
                        orden: 0
                    });
                    console.log('✅ Foto capturada subida exitosamente');
                } catch (error) {
                    console.error('❌ Error subiendo foto capturada:', error);
                }
            }
            
            setSuccessMensaje(true);
            setVisible(false);
        },
    });
    
    // Obtener fecha y hora actual de Buenos Aires para valores por defecto
    const defaultFecha = formatearFechaBuenosAires();
    const defaultHora = formatearHoraBuenosAires();
    
    const { control, handleSubmit, formState: {errors}, watch } = useForm({
        defaultValues: {
            fecha: defaultFecha,
            hora: defaultHora
        }
    });

    const watchedValues = watch(); // Para mostrar valores en confirmación

    const { usuarioId } = useUsuario()
    
    // Efecto para animar los cambios de paso
    useEffect(() => {
        // Animar círculos de pasos
        stepAnimations.forEach((animation, index) => {
            const targetValue = (index + 1) <= currentStep ? 1 : 0
            Animated.timing(animation, {
                toValue: targetValue,
                duration: 250,
                useNativeDriver: false,
            }).start()
        })

        // Animar líneas conectoras
        lineAnimations.forEach((animation, index) => {
            const targetValue = (index + 1) < currentStep ? 1 : 0
            Animated.timing(animation, {
                toValue: targetValue,
                duration: 250, 
                useNativeDriver: false,
            }).start()
        })
    }, [currentStep, stepAnimations, lineAnimations])
    
    const onSubmit = (formData: any) => { 
        const fechaHora = `${formData?.fecha} ${formData?.hora}:00`;  

        if (formData?.sexo === 'Macho') {
            formData.sexo = 'M';
        } else if (formData?.sexo === 'Hembra') {
            formData.sexo = 'H';
        } else if (formData?.sexo === 'No lo sé') {
            formData.sexo = null;
        }
        if (formData?.tamanio === 'Pequeño') {
            formData.tamanio = 'PEQUENIO';
        } else if (formData?.tamanio === 'Mediano') {
            formData.tamanio = 'MEDIANO';
        } else if (formData?.tamanio === 'Grande') {
            formData.tamanio = 'GRANDE';
        } else if (formData?.tamanio === 'Muy grande') {
            formData.tamanio = 'GIGANTE';
        }
        
        declararEmergencia({ data: {
            datosEmergencia: { 
                atendido: false, 
                usuarioId: usuarioId,
                zona: 'Zona',
                mascotaId: null,
                observacion: 'sin observacion',
                hora: fechaHora,
                latitud: formData?.latitud,
                longitud: formData?.longitud,
                direccion: formData?.ubicacion
            },
            datosMascota: {
                familiar: null,
                nombre: null,
                esterilizado: null,
                chipeado: null,
                fechaNacimiento: null,
                descripcion: formData?.descripcion || null,
                especie: formData?.especie || null,
                raza: formData?.raza || null,
                color: formData?.color || null,
                sexo: formData?.sexo || null,
                tamanio: formData?.tamanio || null,
            } 
        }});
    }

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }
    
    const handleTakePicture = (photoBase64: string) => {
        setCapturedPhoto(photoBase64);
        // Cerrar la cámara para mostrar los pasos del formulario
        setShowCamera(false);
    }

    const handleCloseCamera = useCallback(() => {
        setShowCamera(false);
        if (!capturedPhoto) {
            navigation.goBack();
        }
    }, [capturedPhoto])

    const renderStep = useCallback(() => {
        switch (currentStep) {
            case 1: 
                return <UbicacionStep control={control} />
            case 2:
                return <FechaStep control={control} />
            case 3:
                return <AspectoStep control={control} />
            case 4:
                return <ConfirmacionStep valores={watchedValues} />
            default:
                return <UbicacionStep control={control} />
        }
    }, [currentStep, control, watchedValues])

    const renderNavigationButtons = () => (
        <View style={{ 
            flexDirection:'row', 
            justifyContent:'space-between', 
            width: '100%', 
            paddingHorizontal: 16
        }}>
            {currentStep > 1 ? (
                <Button 
                    icon="arrow-left"
                    buttonColor={theme.colors.surfaceVariant} 
                    textColor={theme.colors.onSurfaceVariant}
                    style={{
                        borderRadius: 28,
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    }} 
                    contentStyle={{ height: 56, paddingHorizontal: 16 }}
                    mode="contained" 
                    onPress={prevStep}
                >
                    Anterior
                </Button>
            ) : (
                <Button  
                    icon="close"
                    buttonColor={theme.colors.error} 
                    style={{
                        borderRadius: 28,
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    }} 
                    contentStyle={{  paddingHorizontal: 16 }}
                    mode="contained" 
                    onPress={() => navigation.goBack()}
                >
                    Cancelar
                </Button>
            )}
            
            {currentStep < 4 ? (
                <Button 
                    icon="arrow-right"
                    buttonColor={theme.colors.primary} 
                    style={{
                        borderRadius: 28,
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    }} 
                    contentStyle={{ paddingHorizontal: 16, flexDirection: 'row-reverse' }}
                    mode="contained" 
                    onPress={nextStep}
                >
                    Siguiente
                </Button>
            ) : (
                <Button 
                    icon="check"
                    buttonColor={theme.colors.primary} 
                    style={{
                        borderRadius: 28,
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    }} 
                    contentStyle={{ height: 56, paddingHorizontal: 16 }}
                    mode="contained" 
                    onPress={() => setVisible(true)}
                >
                    Publicar
                </Button>
            )}
        </View>
    )

    // Indicador de progreso
    const renderProgressIndicator = () => (
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
            {[1, 2, 3, 4].map((step, index) => (
                <View key={step} style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* Círculo del paso animado */}
                    <Animated.View 
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: stepAnimations[index].interpolate({
                                inputRange: [0,1],
                                outputRange: [theme.colors.surfaceVariant, theme.colors.primary]
                            }),
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Animated.Text 
                            style={{
                                color: stepAnimations[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [theme.colors.onSurfaceVariant, theme.colors.onPrimary]
                                }),
                                fontWeight: 'bold'
                            }}
                        >
                            {step}
                        </Animated.Text>
                    </Animated.View>
                    
                    {/* Línea conectora animada (no mostrar después del último paso) */}
                    {index < 3 && (
                        <Animated.View 
                            style={{
                                width: 40,
                                height: 3,
                                backgroundColor: lineAnimations[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [theme.colors.surfaceVariant, theme.colors.primary]
                                }),
                                marginHorizontal: 4
                            }}
                        />
                    )}
                </View>
            ))}
        </View>
    ) 

    // TODO: Post del nuevo caso de busqueda
    return(
        <>
            {/* Modal de cámara - Se muestra antes del formulario */}
            <CameraModal
                visible={showCamera}
                onClose={() => handleCloseCamera()}
                onTakePicture={handleTakePicture}
                showPreview={true}
            />
            
            {/* Formulario de pasos - Solo se muestra después de tomar la foto */}
            {!showCamera && (
                <KeyboardAvoidingView 
                    style={{flex: 1}} 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={100}
                >
                    <ScrollView 
                        style={{flex: 1}} 
                        contentContainerStyle={{flexGrow: 1}}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={{flex: 1, gap:20}}>
                            <Portal>
                                {successMensaje && (<BackdropSuccess texto="Nueva emergencia publicada" onTap={() => navigation.navigate('Home')}/>)}
                                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                                    <Text variant="titleMedium" style={{textAlign: 'center'}}>Al reportar la emergencia compartirá sus datos de contacto con la asociación para que se comuniquen con usted.</Text>
                                    <View style={{ flexDirection: 'row', display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                
                                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10, marginTop: 20 }}>

                                            <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSubmit)} loading={isPendingDeclararEmergencia} disabled={isPendingDeclararEmergencia}>
                                                <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar</Text>
                                            </Button>
                                            <Button buttonColor={theme.colors.error} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => setVisible(false)}>
                                                <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Cancelar</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </Modal>
                            </Portal>
                            
                            <View style={{flex: 1}}>
                                {renderProgressIndicator()}
                                {renderStep()}
                            </View>
                            
                            <View style={styles.fixedButtonContainer}>
                                {renderNavigationButtons()}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: "space-around",
        alignItems: "center",
        width: '80%',
        height: '30%',
        alignSelf:"center",
        padding: 30,
        borderRadius: 20,
    },
    fixedButtonContainer: {
        paddingBottom: 20,
        paddingTop: 10,
        backgroundColor: 'transparent', 
        paddingHorizontal: 10,
    },
});
