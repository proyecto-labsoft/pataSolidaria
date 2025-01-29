import { ImageSourcePropType } from "react-native";

export type ImageSliderType = {
    nombre: string;
    imagenes: ImageSourcePropType;
}

export const ImageSlider = [
    {
        nombre: 'Chili',
        imagenes:  [
            require('@/assets/images/testImages/chili-2.jpg'),
            require('@/assets/images/testImages/chili-1.jpg'),
            require('@/assets/images/testImages/chili-3.jpg'),
            require('@/assets/images/testImages/chili-4.jpg'),
        ]
    }
]