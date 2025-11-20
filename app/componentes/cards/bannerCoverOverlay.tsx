import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface Props {
  texto?: string;
}

export default function BannerCoverOverlay({ texto = "Creado por ti" }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.secondaryContainer }]}>
      <Text 
        variant="labelLarge" 
        style={[
          styles.texto, 
          { 
            color: theme.colors.onSecondaryContainer,
            fontWeight: 'bold'
          }
        ]}
      >
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, 
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.95,
  },
  texto: {
    textAlign: 'center', 
  },
});
