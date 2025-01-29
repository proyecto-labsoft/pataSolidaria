import { View, Image,StyleSheet, Text as TextNative, ScrollView } from 'react-native'
import {useMemo,useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Divider, SegmentedButtons,ActivityIndicator,Text as TextPaper, TextInput, Checkbox, Surface, Avatar, Button, IconButton, Icon, useTheme } from 'react-native-paper'
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
    const theme = useTheme()
    return(
        <View style={{width:'100%',gap:20,justifyContent: 'center'}}>
            <TextInput
                label="Nombre"
                value={data?.nombre}
            />
            <TextInput
                label="Especie"
                value={data?.especie}
            />
            <TextInput
                label="Raza"
                value={data?.raza}
            />
            <TextInput
                label="Tamaño"
                value={data?.tamanio}
            />
            <TextInput
                label="Colores"
                value={data?.colores}
            />
            <TextInput
                label="Domicilio"
                value={data?.domicilio}
            />
            <Button icon="map-marker" buttonColor={theme.colors.primary} style={{width: '100%', marginBottom: 24,borderRadius:10}} uppercase mode="contained" onPress={() => console.log('Pressed')}>
                Cargar otra ubicación
            </Button>
            <TextInput
                label="Fecha de nacimiento"
                autoComplete='birthdate-day'
                value={data?.fechanac}
            />
            <TextInput
                label="Descripción adicional"
                value={data?.observaciones}
                multiline
                numberOfLines={5}
            />
            <TextPaper variant="titleLarge" style={{width: '100%', textAlign:'center'}}>Sexo</TextPaper>
            <SegmentedButtons
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
                
            <View style={{ flexDirection:'column', justifyContent:'space-evenly', width: '100%'}}>
                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e)=>!e)}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Guardar</TextPaper>
                </Button>
                <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e)=>!e)}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</TextPaper>
                </Button>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        alignItems: "center",
    },
    fotoFamiliar: {
        marginTop: 35,
    },
});
