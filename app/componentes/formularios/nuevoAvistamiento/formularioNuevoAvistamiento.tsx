import { View, Animated, StyleSheet } from 'react-native'
import { Button, useTheme, Portal, Modal, Text } from 'react-native-paper' 
import { useNavigation } from '@react-navigation/native'
import { useEffect, useCallback, useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import BackdropSuccess from '../../backdropSuccess' 
import { useApiPostAvistamiento } from '@/app/api/hooks'
import { useUsuario } from '@/app/hooks/useUsuario'
import { formatearFechaBuenosAires, formatearHoraBuenosAires } from '@/app/utiles/fechaHoraBuenosAires'
import UbicacionStep from './ubicacionStep'
import ConfirmacionStep from './confirmacionStep'
import FechaStep from './fechaStep'
import { CameraModal } from '../../CameraModal'
import { useSubirImagen } from '@/app/api/imagenes.hooks'
import { api } from '@/app/api/api'
import { API_URL } from '@/app/api/api.rutas'

// TODO: Falta parte del back
export default function FormularioNuevoAvistamiento({extravioId}: {extravioId: number}) {
    const theme = useTheme()
    const navigation = useNavigation()
    const [visible,setVisible] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [success,setSuccess] = useState(false)
    const [showCamera, setShowCamera] = useState(true)
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
    const { usuarioId,email,displayName,nombre,celular,direccion } = useUsuario()

    // Valores animados para cada paso y línea
    const stepAnimations = useRef([
        new Animated.Value(0), // Paso 1
        new Animated.Value(0), // Paso 2
        new Animated.Value(0), // Paso 3 
    ]).current

    const lineAnimations = useRef([
        new Animated.Value(0), // Línea 1-2
        new Animated.Value(0), // Línea 2-3 
    ]).current
    // Obtener fecha y hora actual de Buenos Aires para valores por defecto
    const defaultFecha = formatearFechaBuenosAires();
    const defaultHora = formatearHoraBuenosAires();
    
    const { control, handleSubmit, formState: {errors}, watch } = useForm({ defaultValues: { 
        fecha: defaultFecha, 
        hora: defaultHora,
        email: email || '', 
        celular: celular || ''
    }});

    const subirImagen = useSubirImagen('avistamientos');

    const { mutateAsync: crearAvistamiento, isPending: isPendingCrearAvistamiento } = useApiPostAvistamiento({
        onSuccess: async (response) => {
            console.log('✅ Avistamiento creado, respuesta completa:', JSON.stringify(response, null, 2));
            
            // Obtener el ID del avistamiento de la respuesta
            let avistamientoId = response?.id || response?.data?.id;
            console.log('🔍 Response del POST:', response);
            
            // Si no tenemos el ID en la respuesta, obtener el avistamiento más reciente del usuario
            if (!avistamientoId) {
                console.log('⏳ ID no encontrado en respuesta, consultando avistamientos del usuario...');
                try {
                    const avistamientosResponse = await api.get(`${API_URL}/avistamientos/usuario/${usuarioId}`);
                    const avistamientos = avistamientosResponse?.data;
                    console.log('📋 Todos los avistamientos del usuario:', avistamientos);
                    
                    if (avistamientos && avistamientos.length > 0) {
                        // Ordenar por ID descendente (el más reciente tendrá el ID más alto)
                        const avistamientosOrdenados = [...avistamientos].sort((a, b) => {
                            const idA = a.id;
                            const idB = b.id;
                            return idB - idA;
                        });
                        
                        avistamientoId = avistamientosOrdenados[0]?.id;
                        console.log('🎯 ID obtenido del avistamiento más reciente (ID más alto):', avistamientoId);
                        console.log('📊 Avistamiento seleccionado:', avistamientosOrdenados[0]);
                    }
                } catch (error) {
                    console.error('❌ Error obteniendo avistamientos del usuario:', error);
                }
            }
            
            console.log('🎯 ID final a usar:', avistamientoId);
            
            // Si hay foto capturada, subirla automáticamente
            if (capturedPhoto && avistamientoId) {
                try {
                    console.log('📤 Subiendo foto capturada al avistamiento:', avistamientoId);
                    await subirImagen.mutateAsync({
                        entityId: avistamientoId,
                        file: {
                            uri: capturedPhoto,
                            type: 'image/jpeg',
                            name: `captured-${Date.now()}.jpg`
                        },
                        orden: 0
                    });
                    console.log('✅ Foto capturada subida exitosamente');
                } catch (error) {
                    console.error('❌ Error subiendo foto capturada:', error);
                }
            }
            
            setSuccess(true);
        }
    })
    const onSumbit = (formData: any) => {
        setVisible(false)
        const fechaStr = formData?.fecha || formatearFechaBuenosAires()
        const horaStr = formData?.hora || '00:00'
        const fechaHora = `${fechaStr} ${horaStr}:00`
        
        console.log('📋 Datos del formulario:', formData);
        console.log('👤 Usuario ID:', usuarioId);
        console.log('🔍 Extravío ID:', extravioId);
        
        crearAvistamiento({data: {
            usuarioId: usuarioId,
            extravioId: extravioId,
            zona: formData?.ubicacion || 'Sin zona',
            comentario: formData?.comentario || 'Avistamiento reportado',
            hora: fechaHora,
            latitud: formData?.latitud || null,
            longitud: formData?.longitud || null,
        }})
    }
    const [ubicacion,setUbicacion] = useState("")

       
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
    const nextStep = () => {
        if (currentStep < 3) {
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
        // Cerrar la cámara y mostrar el formulario
        // La foto se subirá después de crear el avistamiento con todos los datos
        setShowCamera(false);
    }

    const handleCloseCamera = useCallback(() => {
        setShowCamera(false);
        if (!capturedPhoto) {
            navigation.goBack();
        }
    }, [capturedPhoto, navigation])

    const watchedValues = watch(); // Para mostrar valores en confirmación

     const renderStep = useCallback(() => {
            switch (currentStep) {
                case 1: 
                    return <UbicacionStep control={control} />
                case 2:
                    return <FechaStep control={control} />
                case 3:
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
                
                {currentStep < 3 ? (
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
                        Confirmar
                    </Button>
                )}
            </View>
        )
    
        // Indicador de progreso
        const renderProgressIndicator = () => (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                {[1, 2, 3 ].map((step, index) => (
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
                        {index < 2 && (
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
                <View style={{gap:20}}>
                    <Portal>
                        {success && (<BackdropSuccess texto="Nuevo avistamiento confirmado" onTap={() => navigation.goBack()}/>)}
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                    <Text style={{textAlign: 'center'}}>Al reportar el nuevo avistamiento compartirá sus datos de contacto con los familiares del animal.</Text>
                    <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSumbit)} loading={isPendingCrearAvistamiento} disabled={isPendingCrearAvistamiento}>
                        <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar avistamiento</Text>
                    </Button>
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
        paddingHorizontal: 10
    }, 
    container: {
        height: 'auto',
        alignItems: "center",
    },
    fotoFamiliar: {
        marginTop: 35,
    },
    nombreFamiliar: {
        textAlign: 'center',
        width: 150,
        padding: 15,
    }
});
