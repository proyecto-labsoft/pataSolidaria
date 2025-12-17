import { Image, View, Dimensions } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('screen');

type Props = {
  item: any;
  index: number;
};

export default function SliderItem({ item }: Props) {
  // Determinar la fuente de la imagen
  const imageSource = typeof item === 'number' 
    ? item // Es un require()
    : item.imagen 
      ? { uri: item.imagen } // Es una URL de imagen real
      : item.require 
        ? item.require // Es un require() envuelto
        : item; // Fallback

  return (
    <View
      style={{
        width,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={imageSource}
        resizeMode="contain" 
        style={{
          width: '90%',     
          height: '90%',    
          borderRadius: 12, 
        }}
      />
    </View>
  );
}
