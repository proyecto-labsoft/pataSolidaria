import { Animated, Dimensions, View } from 'react-native'
import React,{ useRef} from 'react'
import {useTheme} from 'react-native-paper'
import SliderItem from './sliderItem';
import Indicator from './imageIndicatorSlider';
import { ImageSlider } from '../../testData/sliderData';

type Props = {
    data: any
}
const imagenes = ImageSlider[0].imagenes

const {width,height} = Dimensions.get('screen')

export default function CarruselImagenes({data} : Props) {
    const scrollX = useRef(new Animated.Value(0)).current
    const theme = useTheme();

    return(
        <View style={{height: 250,width:width-20,alignItems:'center',overflow:'hidden',borderRadius:20,backgroundColor:'red'}}>
            <Animated.FlatList
                data={imagenes} 
                keyExtractor={item => item.key}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {useNativeDriver: false}
                )}
                style={{width:width,backgroundColor:theme.colors.surfaceVariant}}
                pagingEnabled 
                renderItem={({item,index}) => <SliderItem item={item} key={index} />}
            />
            <Indicator data={imagenes} scrollX={scrollX}/>
        </View>
    )
}