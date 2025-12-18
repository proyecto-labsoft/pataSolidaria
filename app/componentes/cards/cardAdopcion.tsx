import { StyleSheet, Pressable, View } from "react-native";
import { Card, useTheme, Text } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { ImageSlider } from '../../testData/sliderData';
import { useObtenerImagenes } from '../../api/imagenes.hooks';

interface Props {
    data: {
        id?: number,
        adopcionId?: number,
        publicador: {
            id: number | null,
            nombre: string,
            celular: string | null,
            email: string,
            direccion: string | null,
            administrador: boolean | null
        },
        requisitos: string,
        transito: boolean,
        mascotaDetalle: {
            id: number,
            nombre: string,
            especie: string,
            raza: string,
            color: string,
            descripcion: string | null,
            esterilizado: boolean,
            chipeado: boolean | null,
            sexo: string,
            tamanio: string,
            fechaNacimiento: string
        }
    },
    navigateTo: any
}

export default function CardAdopcion({ data, navigateTo }: Props) {
    const theme = useTheme();
    const navigation = useNavigation();
    
    // Usar el ID de la adopción para obtener las imágenes
    const adopcionId = data?.id || data?.adopcionId;
    
    console.log('🔍 CardAdopcion - Datos recibidos:', {
        adopcionId: adopcionId,
        mascotaId: data?.mascotaDetalle?.id,
        mascotaNombre: data?.mascotaDetalle?.nombre,
        adopcionCompleta: !!data
    });
    
    const { data: imagenes, isLoading: imagenesLoading } = useObtenerImagenes('adopciones', adopcionId);
    
    console.log('📸 CardAdopcion - Imágenes:', {
        adopcionId: adopcionId,
        imagenesCount: imagenes?.length || 0,
        primeraImagen: imagenes?.[0]?.urlPublica,
        isLoading: imagenesLoading
    });
    
    const randomImage = ImageSlider[0].imagenes[Math.floor(Math.random() * ImageSlider[0].imagenes.length)];
    const imageSource = imagenes && imagenes.length > 0 
        ? { uri: imagenes[0].urlPublica } 
        : randomImage;
    
    const esTransito = data.transito;

    return (
        <Card style={{ margin: 12, flex: 1, backgroundColor: theme.colors.primary, position: 'relative' }}>
            {/* Badge absoluto centrado arriba */}
            <View style={[styles.badge, {
                backgroundColor: esTransito ? theme.colors.tertiary : theme.colors.secondary
            }]}>
                <Text style={{ 
                    color: esTransito ? theme.colors.onTertiary : theme.colors.onSecondary, 
                    fontWeight: 'bold', 
                    fontSize: 12
                }}>
                    {esTransito ? 'TRÁNSITO' : 'ADOPCIÓN'}
                </Text>
            </View>

            <Pressable
                onPress={() => {
                    navigation.navigate(navigateTo, { data: data })
                }}
                unstable_pressDelay={100}
                style={({ pressed }) => [
                    {
                        borderRadius: 10,
                        backgroundColor: pressed ? theme.colors.onPrimary : theme.colors.primary,
                        opacity: pressed ? 0.8 : 1,
                    },
                ]}
            >
                <Card.Cover style={styles.fotoAnimal} source={imageSource} />
                
                <Card.Title
                    title={`${data.mascotaDetalle.nombre} - ${data.mascotaDetalle.especie}`}
                    subtitle={data.mascotaDetalle.raza || 'Sin raza especificada'}
                    titleVariant="titleMedium"
                    subtitleVariant="labelLarge"
                    titleStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}
                    subtitleStyle={{ color: theme.colors.onPrimary }}
                />
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
    badge: {
        position: 'absolute',
        top: -12,
        minWidth: 80,
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 16, 
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
});