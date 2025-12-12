import { View, Animated, StyleSheet } from 'react-native'
import { Text as TextPaper, Button, useTheme, Portal, Modal, Text } from 'react-native-paper'
import CampoTexto from '../campos/campoTexto'
import CampoTextoArea from '../campos/campoTextoArea'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useCallback, useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import BackdropSuccess from '../../backdropSuccess'
import { Mapa } from '../../mapa'
import CampoHora from '../campos/campoHora'
import { useApiPostAvistamiento } from '@/app/api/hooks'
import { useUsuario } from '@/app/hooks/useUsuario'
import { formatearFechaBuenosAires, formatearHoraBuenosAires } from '@/app/utiles/fechaHoraBuenosAires'
import UbicacionStep from './ubicacionStep'
import ConfirmacionStep from './confirmacionStep'
import FechaStep from './fechaStep'

// TODO: Falta parte del back
export default function FormularioNuevoAvistamiento({extravioId}: {extravioId: number}) {
    const theme = useTheme()
    const navigation = useNavigation()
    const [visible,setVisible] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [success,setSuccess] = useState(false)
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

    const { mutateAsync: crearAvistamiento, isPending: isPendingCrearAvistamiento } = useApiPostAvistamiento({
        onSuccess: () => {
            setSuccess(true)
        }
    })
    const onSumbit = (formData: any) => {
        setVisible(false)
        const fechaStr = formData?.fecha || formatearFechaBuenosAires()
        const horaStr = formData?.hora || '00:00'
        const fechaHora = `${fechaStr} ${horaStr}:00`
        
        crearAvistamiento({data: {
            usuarioId: usuarioId,
            extravioId: extravioId,
            zona: "",
            comentario: formData?.descripcion,
            hora: fechaHora,
            latitud: formData?.latitud,
            longitud: formData?.longitud,
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
        <View style={{gap:20}}>
            <Portal>
                {success && (<BackdropSuccess texto="Nuevo avistamiento confirmado" onTap={() => navigation.goBack()}/>)}
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                    <Text style={{textAlign: 'center'}}>Al reportar el nuevo avistamiento compartirá sus datos de contacto con los familiares del animal.</Text>
                    <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSumbit)} disabled={isPendingCrearAvistamiento}>
                        <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar avistamiento</Text>
                    </Button>
                </Modal>
            </Portal>

            
            {/* <Mapa localizar latitude={null} longitude={null} modificarDomicilio={setUbicacion} />
            <CampoTexto
                valor={ubicacion}
                label="Ubicación del avistamiento"
                nombre="ubicacion"
                control={control}
            />
            <CampoHora 
                control={control}
                label="Hora (HH:mm)"
                nombre="hora"
            />
            <CampoTexto
                control={control}
                label="Hora"
                nombre="hora"
            />
            <CampoTexto
                control={control}
                label="Celular"
                nombre="celular"
            />
            <CampoTexto
                control={control}
                label="Correo electronico"
                nombre="email"
            />
            <CampoTextoArea
                control={control}
                label="Descripción adicional"
                nombre="descripcion"
            />   */}
            <View style={{flex: 1}}>
                {renderProgressIndicator()}
                {renderStep()}
            </View>
            
            <View style={styles.fixedButtonContainer}>
                {renderNavigationButtons()}
            </View>
            
            {/* <View style={{ flexDirection:'row', justifyContent:'space-evenly', width: '100%'}}>
                <Button  buttonColor={theme.colors.secondary} style={{  marginHorizontal:'5%',marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => navigation.goBack()}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</TextPaper>
                </Button>
                <Button buttonColor={theme.colors.primary} style={{  marginHorizontal:'5%',marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => setVisible(true)}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar avistamiento</TextPaper>
                </Button>
            </View> */}
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
