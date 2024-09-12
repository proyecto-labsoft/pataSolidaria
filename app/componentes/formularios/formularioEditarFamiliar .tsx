import { View, Image,StyleSheet, Text as TextNative, ScrollView } from 'react-native'
import {useMemo,useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Divider, SegmentedButtons,ActivityIndicator,Text as TextPaper, TextInput, Checkbox, Surface, Avatar, Button, IconButton, Icon } from 'react-native-paper'
interface Props {
    onSumbit: Function,
    data: {
        nombre: string,
        especie: string,
        raza: string,
        tamanio: string,
        colores: string,
        fechanac: string,
        observaciones: string,
        sexo: string,
        esterilizado: boolean,
        identificado: boolean,
        domicilio: string
    }
}
export default function FormularioEditarFamiliar({data,onSumbit} : Props) {
    return(
        <View style={{marginVertical: 16,justifyContent: 'center',flexDirection:'column'}}>
            <TextInput
                style={ styles.input }
                label="Nombre"
                value={data?.nombre}
            />
            <TextInput
                style={ styles.input }
                label="Especie"
                value={data?.especie}
            />
            <TextInput
                style={ styles.input }
                label="Raza"
                value={data?.raza}
            />
            <TextInput
                style={ styles.input }
                label="Tamaño"
                value={data?.tamanio}
            />
            <TextInput
                style={ styles.input }
                label="Colores"
                value={data?.colores}
            />
            <TextInput
                style={ styles.input }
                label="Domicilio"
                value={data?.domicilio}
            />
            <Button icon="map-marker" style={{width: '100%', marginBottom: 24,borderRadius:10}} uppercase mode="contained" onPress={() => console.log('Pressed')}>
                Cargar otra ubicación
            </Button>
            <TextInput
                style={ styles.input }
                label="Fecha de nacimiento"
                autoComplete='birthdate-day'
                value={data?.fechanac}
            />
            <TextInput
                style={ styles.input }
                label="Descripción adicional"
                value={data?.observaciones}
                multiline
                numberOfLines={5}
            />
            <TextPaper variant="titleLarge" style={{width: '100%', textAlign:'center'}}>Sexo</TextPaper>
            <SegmentedButtons
                style={ styles.input }
                value={data?.sexo}
                buttons={[{value:'hembra',label:'Hembra',icon:'gender-female'},{value:'macho',label:'Macho',icon:'gender-male'}]}
                onValueChange={() => console.log('')}
            />
            <View style={{ justifyContent: 'flex-start' , width: '80%' }}>
                <View style={{flexDirection:'row', marginVertical: 8, alignItems:'center'}}>
                    <TextPaper variant="titleLarge">Esterilizado</TextPaper>
                    <Checkbox
                        status={data?.esterilizado ? 'checked' : 'unchecked'}
                    // onPress={() => {
                    //   setChecked(!checked);
                    // }}
                    />
                </View>
                <View style={{flexDirection:'row', marginVertical: 8, alignItems:'center'}}>
                    <TextPaper variant="titleLarge">Identificación</TextPaper>
                    <Checkbox
                        status={data?.identificado ? 'checked' : 'unchecked'}
                    // onPress={() => {
                    //   setChecked(!checked);
                    // }}
                    />
                </View>
            </View>
                

            <Button style={{  marginVertical: 8, width: '100%',borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e)=>!e)}>
                Guardar cambios
            </Button>
            <Button  buttonColor='red' style={{ marginVertical: 8, width: '100%',borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e)=>!e)}>
                Descartar cambios
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        alignItems: "center",
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
    }
  });
