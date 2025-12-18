import { StyleSheet, Pressable, View } from "react-native";
import { Card, useTheme, Text, Icon, IconButton, Badge } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { ImageSlider } from '../../testData/sliderData';
import { calcularTiempoTranscurrido } from "@/app/utiles/calcularTiempoTranscurrido";
import BannerCoverOverlay from './bannerCoverOverlay';
import { useUsuario } from "@/app/hooks/useUsuario";
import { useObtenerImagenes } from '@/app/api/imagenes.hooks';

interface Props {
    data: {
        id: number,
        usuarioCreador: {
            id: number | null,
            nombre: string,
            celular: string | null,
            email: string,
            direccion: string | null,
            administrador: boolean | null
        },
        hora: string,
        zona: string,
        observacion: string,
        latitud: number | null,
        longitud: number | null,
        atendido: boolean,
        mascotaDetalle: {
            id: number,
            nombre: string | null,
            especie: string | null,
            raza: string | null,
            color: string | null,
            descripcion: string | null,
            esterilizado: boolean | null,
            chipeado: boolean | null,
            sexo: string | null,
            tamanio: string | null,
            fechaNacimiento: string | null
        }
    },
    navigateTo: string
}

export default function CardEmergencia({ data, navigateTo }: Props) {
    
    const { usuarioId } = useUsuario();
    const theme = useTheme(); 
    const creadorPorMi = data?.usuarioCreador?.id === usuarioId;
    const navigation = useNavigation();
    const { data: imagenes, isLoading: imagenesLoading } = useObtenerImagenes('emergencias', data.id);
    
    const randomImage = ImageSlider[0].imagenes[Math.floor(Math.random() * ImageSlider[0].imagenes.length)];
    const imageSource = imagenes && imagenes.length > 0 
        ? { uri: imagenes[0].urlPublica } 
        : randomImage;

    return (
        <Card style={{ margin: 12, flex: 1, backgroundColor: theme.colors.primary, borderColor: theme.colors.error, borderWidth: 2, borderRadius: 10, position: 'relative' }}>
            {/* Badge EMERGENCIA */}
            <View style={[styles.badge, {
                backgroundColor: theme.colors.error
            }]}>
                <Text style={{ color: theme.colors.onError, fontWeight: 'bold', fontSize: 12}}>
                    EMERGENCIA
                </Text>
            </View>
            
            {/* Indicador de estado atendido */}
            {data?.atendido && (
                <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                    <Badge 
                        size={24}
                        style={{ backgroundColor: theme.colors.tertiary }}
                    >
                        <Icon source="check" size={16} color={theme.colors.onTertiary} />
                    </Badge>
                </View>
            )}

            <Pressable
                onPress={() => {
                    navigation.navigate(navigateTo, { data: data })
                }}
                unstable_pressDelay={100}
                style={({ pressed }) => [
                    {
                        overflow: 'hidden',
                        borderRadius: 10,
                        backgroundColor: pressed ? theme.colors.onPrimary : theme.colors.primary,
                        opacity: pressed ? 0.8 : 1,
                    },
                ]}
            >
                <View style={{ position: 'relative'}}>
                    <Card.Cover style={styles.fotoAnimal} source={imageSource} />
                    {creadorPorMi && (
                        <BannerCoverOverlay texto="Creado por ti" />
                    )}
                </View>
                
                {(() => {
                    return (
                <Card.Title
                    title={calcularTiempoTranscurrido(data?.hora)}
                    subtitle={`${data.zona} - ${data.usuarioCreador?.nombre || 'Usuario'}`}
                    titleVariant="labelMedium"
                    subtitleVariant="titleMedium"
                    titleStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}
                    subtitleStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}
                />
                );
                })()}
                {/* {data.observacion && data.observacion !== 'sin observacion' && (
                    <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
                        <Text 
                            variant="bodySmall" 
                            style={{ color: theme.colors.onPrimary, fontStyle: 'italic' }}
                            numberOfLines={2}
                        >
                            {data.observacion}
                        </Text>
                    </View>
                )} */}
                
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
