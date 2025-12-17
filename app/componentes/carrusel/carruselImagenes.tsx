import { Animated, Dimensions, View } from 'react-native'
import React,{ useRef, useMemo} from 'react'
import {useTheme, ActivityIndicator, Text} from 'react-native-paper'
import SliderItem from './sliderItem';
import Indicator from './imageIndicatorSlider';
import { ImageSlider } from '../../testData/sliderData';

type Props = {
    data: any
    imagenesReales?: any[]
    isLoading?: boolean
}
const imagenes = ImageSlider[0].imagenes

const {width,height} = Dimensions.get('screen')

export default function CarruselImagenes({data, imagenesReales, isLoading} : Props) {
    const scrollX = useRef(new Animated.Value(0)).current
    const theme = useTheme();

    // Transformar las imágenes reales al formato que espera SliderItem
    const imagenesParaMostrar = useMemo(() => {
        if (imagenesReales && imagenesReales.length > 0) {
            return imagenesReales.map((img, index) => ({
                key: `imagen-${img.id || index}`,
                imagen: img.url || img.urlPublica, // Soportar ambos formatos
                id: img.id
            }));
        }
        // Transformar imágenes de prueba (require) al formato con key
        return imagenes.map((img, index) => ({
            key: `placeholder-${index}`,
            imagen: null,
            require: img
        }));
    }, [imagenesReales]);

    if (isLoading) {
        return (
            <View style={{height: 250, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 20}}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return(
        <View style={{height: 250,width:width ,alignItems:'center',borderRadius:20}}>
            <Animated.FlatList
                data={imagenesParaMostrar} 
                keyExtractor={item => item.key}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {useNativeDriver: false}
                )}
                style={{width:width}}
                pagingEnabled
                renderItem={({item,index}) => <SliderItem item={item} index={index} />}
            />
            <Indicator data={imagenesParaMostrar} scrollX={scrollX}/>
        </View>
    )
}