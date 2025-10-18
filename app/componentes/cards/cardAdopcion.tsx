import { StyleSheet, Pressable, View } from "react-native";
import { Card, useTheme,Text } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { ImageSlider } from '../../testData/sliderData';
import { differenceInMinutes, differenceInHours, differenceInDays, isToday } from "date-fns";
interface Props {
    data: {
        nombreCompaniero: string,
        especie: string,
        tipo: 'perdido' | 'avistado' // Tipo de collar, perdido o avistado
        ultimoAvistamiento: Date // Fecha del último avistamiento
        estado?: string // Estado opcional, solo para avistados
    },
    navigateTo: any
}

// Collar personalizado
function Collar({ nombre,tipo}: { nombre: string, tipo: 'perdido' | 'avistado' }) {
    const theme = useTheme();

    return (
        <View style={styles.collarContainer}>
            <View style={{...styles.collarBar,backgroundColor: theme.colors.primary}}>
                <View style={{...styles.collarBuckle, backgroundColor: theme.colors.onPrimary,borderColor: theme.colors.primary}}>
                    <Text style={{...styles.collarText, color: theme.colors.primary}} variant='labelLarge' numberOfLines={1}>
                        {tipo === 'perdido' ? "Perdido" : "Avistado"}
                    </Text>
                </View>
            </View>
        </View>
    );
}

// TODO:
// (1*) Tener todo los avistamientos de este animal y mostrar el más reciente
export default function CardAdopcion({ data, navigateTo }: Props) {

    // {
    //   "esterilizado": true, 
    //   "mascotaID": 1, 
    //   "nombreCompaniero": "Max", 
    //   "publicadorContacto": 987654321, 
    //   "publicadorID": 2, 
    //   "publicadorNombre": "María García", 
    //   "requisitos": "Patio grande, experiencia con perros", 
    //   "transito": true
    // }
    const theme = useTheme();
    const navigation = useNavigation();
    const randomImage = ImageSlider[0].imagenes[Math.floor(Math.random() * ImageSlider[0].imagenes.length)];
    return (

        <Card style={{ margin: 12, flex: 1, backgroundColor: theme.colors.primary }}>
            <Pressable
                onPress={() => {
                    navigation.navigate(navigateTo, { data: data })
                }}
                unstable_pressDelay={100}
                style={({ pressed }) => [
                    {
                        borderRadius: 10,
                        backgroundColor: pressed ? theme.colors.onPrimary : theme.colors.surface,
                        opacity: pressed ? 0.8 : 1,
                    },
                ]}
            >
                {/* <Collar nombre={data.nombreCompaniero} tipo={data?.tipo} /> */}
                <Card.Cover style={styles.fotoAnimal} source={randomImage} />
                {(() => {
                    const avistamientoDate = new Date(data.ultimoAvistamiento);// (1*)
                    const now = new Date();

                    let info = "";
                    if (isToday(avistamientoDate)) {
                        const diffMins = differenceInMinutes(now, avistamientoDate);
                        if (diffMins < 60) {
                            info = `Hoy, hace ${diffMins} min`;
                        } else {
                            const diffHours = differenceInHours(now, avistamientoDate);
                            info = `Hoy, hace ${diffHours} h`;
                        }
                    } else {
                        const diffDays = differenceInDays(now, avistamientoDate);
                        info = `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
                    }

                    return (
                        <Card.Title
                            title={info}
                            subtitle={`${data?.nombreCompaniero} - ${data.especie}`}
                            titleVariant="labelSmall"
                            titleStyle={{ color: theme.colors.primary }}
                            subtitleStyle={{ color: theme.colors.primary }}
                        />
                    );
                })()}
            </Pressable>
        </Card>
    )
}

const styles = StyleSheet.create({
    fotoAnimal: {
        width: '100%',
        height: 'auto',
        borderRadius: 0,
        resizeMode: 'cover',
        aspectRatio: 1.5,
        zIndex: -1
    },
    collarContainer: {
        width: '100%',
        alignItems: 'center',
        
    },
    collarBar: {
        width: '100%',
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        height: 24,
        justifyContent: 'center', // Asegura centrado vertical
        alignItems: 'center',     // Asegura centrado horizontal
        position: 'relative', 
    },
    collarBuckle: {
        alignSelf: 'center',
        borderRadius: 24,
        minWidth: 48,
        maxWidth: 120,
        height: 48,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        paddingHorizontal: 8,
        marginTop: -5, // Simula el "top: -1theme si prefieres
    },
    collarText: {
        textAlign: 'center',
        minWidth: 40,
        maxWidth: 100, // Limita el ancho máximo del texto
        paddingHorizontal: 8,
    },
});