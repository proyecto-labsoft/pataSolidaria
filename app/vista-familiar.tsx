import { View, Image,StyleSheet, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const VistaFamiliar = () => {
  return (
    <SafeAreaView style={ styles.container }>
            <Image
                source={{ uri: "https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg" }}
                style={ styles.fotoFamiliar }
                />
            <Text style={ styles.nombreFamiliar }>Chili</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 'auto',
        alignItems: "center",
    },
    fotoFamiliar: {
        marginTop: 100,
        marginBottom: 10,
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 100,
    },
    nombreFamiliar: {
        borderBottomWidth: 1,
        borderEndColor: 'black',
        textAlign: 'center',
        width: 150,
        padding: 15,
    }
  });

export default VistaFamiliar