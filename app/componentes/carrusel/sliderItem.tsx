import { View, Image, Dimensions } from 'react-native'
import {ActivityIndicator} from 'react-native-paper'

type Props = {
    item: string,
    key: number,
}
const {width} = Dimensions.get('screen')

export default function SliderItem({item,key}: Props) {

    return(
        <View key={key} style={{justifyContent:'center'}}>
            <Image
                source={item}
                onProgress={() => (<ActivityIndicator animating/>)}
                style={{resizeMode:'contain',width: width}}
            />
            {/* <TakePictureBtn setImagen={setFoto} /> */}
        </View>
    )
}