import { View, Animated, Dimensions } from 'react-native'
import {useTheme } from 'react-native-paper'

type Props = {
    scrollX: any,
    data: any
}
const {width,height} = Dimensions.get('screen')

export default function Indicator({scrollX,data} : Props) {
    const theme = useTheme();

    return (
        <View style={{position:'absolute',flexDirection: 'row',top: 200}}>
            { data.map((_: any,i: number) =>  {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
                
                const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.8,1.4,0.8],
                extrapolate: 'clamp'
                })
                return <Animated.View 
                key={`indicator-${i}`} 
                style={
                    {
                    transform: [
                        {
                        scale,
                        },
                    ],
                    height: 10, 
                    margin: 10,
                    width: 10 ,
                    borderRadius:5,
                    backgroundColor: theme.colors.surface
                    }
                } />
            }) }
        </View>
    )
}