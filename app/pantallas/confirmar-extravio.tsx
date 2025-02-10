import React, { useState, useEffect } from "react"
import { StyleSheet, ScrollView, View, PermissionsAndroid, Platform } from "react-native";
import { useTheme } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import FormularioConfirmarExtravio from "../componentes/formularios/formularioConfirmarExtravio";
import AppbarNav from "../componentes/navegacion/appbarNav";
import MapView, { UrlTile, Marker } from 'react-native-maps';

// TODO: Request POST para la creación de un anuncio de animal extraviado
export default function ConfirmarExtravio() {
    const theme = useTheme();
    const [edicion, setEdicion] = useState(false);
    const [location, setLocation] = useState({
        latitude: -54.8019,
        longitude: -68.3029,
    });
    const [datosFamiliar, setDatosFamiliar] = useState({
      nombre: 'Chili',
      especie: 'Perro',
      raza: 'callejero',
      tamanio: 'grande',
      colores: 'tricolor',
      fechanac: '14/04/2021',
      observaciones: 'compañero y sociable',
      sexo: 'macho',
      esterilizado: true,
      identificado: false,
      domicilio: 'Puerto español 844',
      ubicacion: location,
    });
    const navigation = useNavigation();
    
    useEffect(() => {
        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permiso de ubicación denegado');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setLocation({ latitude, longitude });
            setDatosFamiliar((prevState) => ({
                ...prevState,
                ubicacion: { latitude, longitude },
            }));
        };

        requestLocationPermission();
    }, []);

    const handleMarkerDragEnd = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({ latitude, longitude });
        setDatosFamiliar((prevState) => ({
            ...prevState,
            ubicacion: { latitude, longitude },
        }));
    };

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({ latitude, longitude });
        setDatosFamiliar((prevState) => ({
            ...prevState,
            ubicacion: { latitude, longitude },
        }));
    };

    return (
        <>
            <AppbarNav titulo="Confirmar datos" />
            <SafeAreaView style={{ alignItems: "center",flex:1}}>
            <View style={{marginHorizontal:10,width: "100%"}}>
                <ScrollView contentContainerStyle={ {...styles.containerScroll}}>
                    <FormularioConfirmarExtravio data={datosFamiliar} onSumbit={setEdicion}  />
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        provider={undefined}
                        onPress={handleMapPress}
                    >
                        <UrlTile
                            urlTemplate="https://a.tile.openstreetmap.de/{z}/{x}/{y}.png"
                            maximumZ={19}
                        />
                        <Marker
                            coordinate={location}
                            title={datosFamiliar.nombre}
                            description={datosFamiliar.domicilio}
                            draggable
                            onDragEnd={handleMarkerDragEnd}
                        />
                    </MapView>
                </ScrollView>
            </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex:1
    },
    containerScroll: {
        paddingBottom: 20,
        paddingHorizontal: '5%'
    },
    input:{
    marginBottom: 16,
    },
    fotoFamiliar: {
        marginTop: 35,
    },
    nombreFamiliar: {
        // borderBottomWidth: 1,
        // borderEndColor: 'black',
        textAlign: 'center',
        width: 150,
        padding: 15,
    },
    cardFamiliar: {
    marginVertical: 5,
    },
    map: {
        width: '100%',
        height: 300,
        marginVertical: 20,
    },
});