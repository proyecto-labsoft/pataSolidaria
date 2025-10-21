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

export default function FormularioNuevoExtravio() {
    const theme = useTheme()
    const [ubic, setUbic] = useState("");
    const [visible,setVisible] = useState(false)
    const [post,setPost] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
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

    const { control, handleSubmit, formState: {errors}, watch } = useForm();

    const watchedValues = watch(); // Para mostrar valores en confirmación

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
    
    const onSubmit = (data: any) => {
        data.ubicacion = ubic
        setVisible(false)
        setPost(true)
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
                return <UbicacionStep control={control} ubic={ubic} setUbic={setUbic} />
            case 2:
                return <FechaStep control={control} />
            case 3:
                return <AspectoStep control={control} />
            case 4:
                return <ConfirmacionStep ubic={ubic} valores={watchedValues} />
            default:
                return <UbicacionStep control={control} ubic={ubic} setUbic={setUbic} />
        }
    }, [currentStep, control, ubic, setUbic, watchedValues])

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
                    buttonColor={theme.colors.secondary} 
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
                    contentStyle={{ height: 56, paddingHorizontal: 16, flexDirection: 'row-reverse' }}
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

    //  private Long familiarId; -> null
    // private String nombre;
    // private String especie;
    // private String raza;
    // private String color;
    // private String descripcion;
    // private Boolean esterilizado;
    // private Boolean chipeado;
    // private SexoEnum sexo;
    // private TamanioEnum tamanio;
    // private LocalDate fechaNacimiento;

    // TODO: Post del nuevo caso de busqueda
    return(
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
                        {!visible && post && (<BackdropSuccess texto="Nueva extravío confirmado" onTap={() => navigation.navigate('Home')}/>)}
                        <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                            <Text style={{textAlign: 'center'}}>Al reportar el extravío compartirá sus datos de contacto con los demás usuarios para que se comuniquen con usted.</Text>
                            <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSubmit)}>
                                <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar extravío</Text>
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
            </ScrollView>
        </KeyboardAvoidingView>
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
