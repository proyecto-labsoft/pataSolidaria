import { View, StyleSheet, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import {useState, useEffect, useRef, useCallback} from 'react'
import { Button, useTheme, Text, Portal, Modal } from 'react-native-paper'
import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import BackdropSuccess from '../backdropSuccess'
import { useApiPostExtravioFamiliar } from '@/app/api/hooks'
import { useUsuario } from '@/app/hooks/useUsuario'
import { formatearFechaHoraCompletaBuenosAires } from '@/app/utiles/fechaHoraBuenosAires'
import UbicacionStep from './confirmarBuscado/ubicacionStep'
import DatosAnimalStep from './confirmarBuscado/datosAnimalStep'
import ConfirmacionStep from './confirmarBuscado/confirmacionStep'
import FechaStep from './confirmarBuscado/fechaStep'
interface Props {
    data: {
        nombre: string,
        especie: string,
        raza: string,
        tamanio: string,
        color: string,
        fechaNacimiento: string,
        descripcion: string,
        sexo: string,
        esterilizado: boolean,
        chipeado: boolean,
        domicilio: string
        ubicacion?: string
    },
}
export default function FormularioConfirmarBuscado({ data } : Props) {
    const theme = useTheme()
    const navigation = useNavigation()
    const {usuarioId} = useUsuario()
    
    const [visible, setVisible] = useState(false)
    const [successMensaje, setSuccessMensaje] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)

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

    const { control, setValue, watch, handleSubmit, formState: {errors} } = useForm({
        defaultValues: {...data, sexo: data?.sexo === "M" ? "Macho" : data?.sexo === "H" ? "Hembra" : "No lo sé"} || {}
    });
    
    const watchedValues = watch(); // Para mostrar valores en confirmación
     
    const { mutateAsync: declararExtraviado, isPending: isPendingDeclararExtraviado } = useApiPostExtravioFamiliar({
        params: {id: data?.id},
        queriesToInvalidate: ['useApiGetExtraviosPorUsuario','useApiGetExtravios'],
        onSuccess: () => {setSuccessMensaje(true);setVisible(false)},
    });

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
        setVisible(false)
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

        declararExtraviado({
            data: {
                creador: usuarioId,
                mascotaId: data?.id,
                resuelto: false, 
                latitud: formData?.latitud || null,
                longitud: formData?.longitud || null,
                direccion: formData?.ubicacion || null,
                zona: "",
                hora: formatearFechaHoraCompletaBuenosAires(),
                observacion: formData?.observacionExtravio || null,
            }
        })
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

    const renderStep = useCallback(() => {
        switch (currentStep) {
            case 1: 
                return <UbicacionStep control={control} />
            case 2:
                return <DatosAnimalStep control={control} setValue={setValue} watch={watch} />
            case 3:
                return <FechaStep control={control} />
            case 4:
                return <ConfirmacionStep valores={watchedValues} />
            default:
                return <UbicacionStep control={control} />
        }
    }, [currentStep, control, setValue , watch, watchedValues])

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

    return( 
        <View style={{flex: 1, gap:20}}>
            <Portal>
                {successMensaje && (
                    <BackdropSuccess
                        texto="Nuevo extravío reportado con éxito"
                        onTap={() => {
                            navigation.navigate("Home")
                        }}
                    />
                )}
            </Portal>
            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                    <Text variant="titleMedium" style={{textAlign: 'center'}}>Al reportar la nueva búsqueda compartirá sus datos de contacto con los demás usuarios.</Text>
                    <View style={{ flexDirection: 'column', display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" loading={isPendingDeclararExtraviado} disabled={isPendingDeclararExtraviado} onPress={handleSubmit(onSubmit)}>
                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar</Text>
                        </Button>
                        <Button buttonColor={theme.colors.error} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => setVisible(false)}>
                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Cancelar</Text>
                        </Button>
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
