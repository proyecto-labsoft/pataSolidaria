import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper'; 

interface Props {
  tipo: boolean;
  titulo: string;
}

export default function BannerEstadoExtravio({ tipo, titulo }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.solapa, 
          { 
            backgroundColor: theme.colors.errorContainer 
          }
        ]}
      >
        {/* <Icon 
          source={tipo ? "magnify" : "check-circle"} 
          size={24} 
          color={tipo ?  theme.colors.onErrorContainer : '#0C5460'} 
        /> */}
        <Text 
          variant="titleMedium" 
          style={[
            
            { 
              fontWeight: 'bold',
              color: theme.colors.onErrorContainer
            }
          ]}
        >
          {titulo ? titulo : tipo ? 'BUSCADO' : 'EXTRAVIADO'}
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