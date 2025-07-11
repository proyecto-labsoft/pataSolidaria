import { Image, View, Dimensions } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('screen');

type Props = {
  item: {
    uri: string;
    // otros props como key, etc.
  };
  index: number;
};

export default function SliderItem({ item }: Props) {
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
        source={item }
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
