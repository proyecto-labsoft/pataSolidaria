import { StyleSheet, Pressable, View } from "react-native";
import { Card, useTheme,Text, Icon, IconButton } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { ImageSlider } from '../../testData/sliderData';
import { calcularTiempoTranscurrido } from "@/app/utiles/calcularTiempoTranscurrido";
import { obtenerValorSexo } from "@/app/utiles/obtenerValorEnum";
import BannerCoverOverlay from './bannerCoverOverlay';
import { useUsuario } from "@/app/hooks/useUsuario";
import { useApiDeleteFavorito, useApiGetEsFavorito, useApiPostFavorito } from "@/app/api/hooks";
import { useObtenerImagenes } from "@/app/api/imagenes.hooks";

interface Props {
    data: {
        nombreMascota: string,
        especie: string,
        tipo: boolean,
        ultimoAvistamiento: Date // Fecha del último avistamiento
        estado?: string // Estado opcional, solo para avistados
    },
    navigateTo: any
}

// TODO:
// (1*) Tener todo los avistamientos de este animal y mostrar el más reciente
export default function CardAnimal({ data, navigateTo }: Props) {
    
    const { usuarioId } = useUsuario()
    const theme = useTheme(); 
    const esBuscado = data?.creadoByFamiliar;
    const creadorPorMi = data?.creadorId === usuarioId;
    const navigation = useNavigation();
    const randomImage = ImageSlider[0].imagenes[Math.floor(Math.random() * ImageSlider[0].imagenes.length)];

    // Obtener imágenes del extravío
    const { data: imagenesExtravio } = useObtenerImagenes(
        'extravios',
        data?.extravioId
    );

    // Usar la primera imagen del extravío o una imagen random como fallback
    const imagenMostrar = imagenesExtravio && imagenesExtravio.length > 0
        ? { uri: imagenesExtravio[0].url || imagenesExtravio[0].urlPublica }
        : randomImage;

    const { data: esFavorito } = useApiGetEsFavorito({
        params: {
            queryParams: {
                usuarioId: usuarioId,
                extravioId: data?.extravioId
            }
        },
        enabled: !!usuarioId && !!data?.extravioId
    })
    const { mutateAsync: guardarCaso } = useApiPostFavorito({})
    const { mutateAsync: borrarFavorito } = useApiDeleteFavorito({
            params: { 
                id: data?.extravioId, 
                queryParams: {
                    usuarioId: usuarioId
                } 
            },
        })
    const handleGuardarCaso = () => { 
        // Aquí podrías implementar la lógica para guardar el caso, como agregarlo a una lista de favoritos
        if (esFavorito) {
            borrarFavorito()
        } else {
            guardarCaso({data: {
                usuarioId: usuarioId,
                extravioId: data?.extravioId
            }})
        }
    }

    return (

        <Card style={{ margin: 12, flex: 1, backgroundColor: theme.colors.primary, position: 'relative' }}>
            {/* Badge absoluto centrado arriba */}
            <View style={[styles.badge, {
                backgroundColor: esBuscado ? theme.colors.tertiary : theme.colors.secondary
            }]}
            >
                <Text style={{ color: esBuscado ? theme.colors.onTertiary : theme.colors.onSecondary, fontWeight: 'bold', fontSize: 12}}>
                    {esBuscado ? 'BUSCADO' : 'AVISTADO'}
                </Text>
            </View>
            
            <View style={{ position: 'absolute' , top: 150, right: -5, zIndex: 10 }}>
                <IconButton icon={esFavorito ? "heart" : "heart-outline"} iconColor={theme.colors.secondary} style={{ width: 32, height: 32 }} onPress={handleGuardarCaso} />
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
                <View style={{ position: 'relative' }}>
                    <Card.Cover style={styles.fotoAnimal} source={imagenMostrar} />
                    {((esBuscado && creadorPorMi) || creadorPorMi) && (
                    <BannerCoverOverlay texto="Creado por ti" />
                    )}
                </View>
                {(() => {
                    return (
                        <Card.Title
                            title={calcularTiempoTranscurrido(data?.hora)}
                            subtitle={esBuscado ? `${data.mascotaDetalle?.nombre} - ${data.mascotaDetalle?.especie}` : `${data.especie || 'Sin info'} - ${obtenerValorSexo(data.mascotaDetalle?.sexo) || 'Sin info'} `}
                            titleVariant="labelMedium"
                            subtitleVariant="titleMedium"
                            titleStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}
                            subtitleStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold'  }}
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