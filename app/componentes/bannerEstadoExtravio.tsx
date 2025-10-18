import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  esBuscado: boolean;
}

export default function BannerEstadoExtravio({ esBuscado }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.solapa, 
          { 
            backgroundColor: esBuscado ? theme.colors.errorContainer : '#D1ECF1', 
          }
        ]}
      >
        {/* <Icon 
          source={esBuscado ? "magnify" : "check-circle"} 
          size={24} 
          color={esBuscado ?  theme.colors.onErrorContainer : '#0C5460'} 
        /> */}
        <Text 
          variant="titleMedium" 
          style={[
            
            { 
              fontWeight: 'bold',
              color: esBuscado ? theme.colors.onErrorContainer : '#0C5460' // Texto más oscuro para contraste
            }
          ]}
        >
          {esBuscado ? 'BUSCADO' : 'EXTRAVIADO'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  solapa: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 0,
    minWidth: 220,
    // Sombra para efecto de profundidad
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, 
  }
});