import { StyleSheet, Pressable, View, Text } from "react-native";
import { Card, useTheme } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { ImageSlider } from '../../testData/sliderData';

interface Props {
    data: {
        nombre: string,
        especie: string,
        tipo: 'perdido' | 'avistado' // Tipo de collar, perdido o avistado
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
                    <Text style={styles.collarText} numberOfLines={1}>{tipo === 'perdido' ? nombre : nombre}</Text>
                </View>
            </View>
        </View>
    );
}

export default function CardAnimal({ data, navigateTo }: Props) {

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
                <Collar nombre={data.nombre} tipo={data?.tipo} />
                {/* <Card.Title title={data.nombre} titleVariant="titleLarge" titleStyle={{ textAlign: 'center', color: theme.colors.primary }} /> */}
                <Card.Cover style={styles.fotoAnimal} source={randomImage} />
                {/* Collar entre la imagen y el subtítulo */}
                <Card.Title title={data.especie} titleVariant="titleMedium" titleStyle={{ color: theme.colors.primary }} subtitleStyle={{ color: theme.colors.primary }} />
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
        backgroundColor: '#FFD700',
        borderColor: '#B8860B',
        marginTop: -5, // Simula el "top: -1theme si prefieres
    },
    collarText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        minWidth: 40,
        maxWidth: 100, // Limita el ancho máximo del texto
        paddingHorizontal: 8,
    },
});