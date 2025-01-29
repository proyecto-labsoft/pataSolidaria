import { View, Image, Dimensions } from 'react-native'
import {ActivityIndicator} from 'react-native-paper'

type Props = {
    item: string,
    index: number,
}
const {width} = Dimensions.get('screen')

export default function SliderItem({item,index}: Props) {

    return(
        <View key={index} style={{justifyContent:'center'}}>
            <Image
                source={item}
                onProgress={() => (<ActivityIndicator animating/>)}
                style={{resizeMode:'contain',width: width}}
            />
            {/* <TakePictureBtn setImagen={setFoto} /> */}
        </View>
    )
}