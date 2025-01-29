import { View, Image,StyleSheet, Text as TextNative, ScrollView } from 'react-native'
import {useMemo,useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SegmentedButtons,Text as TextPaper, TextInput, Checkbox, Button, useTheme } from 'react-native-paper'
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
export default function FormularioConfirmarExtravio({data,onSumbit} : Props) {
    const theme = useTheme()
    return(
        <View>
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
            <Button icon="map-marker" buttonColor={theme.colors.tertiary} style={{width: '100%', marginBottom: 24,borderRadius:10}} uppercase mode="contained" onPress={() => console.log('Pressed')}>
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
                
            <View style={{ flexDirection:'row', justifyContent:'space-evenly', width: '100%'}}>
                <Button  buttonColor={theme.colors.error} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e: any)=>!e)}>
                    Cancelar
                </Button>
                <Button buttonColor={theme.colors.tertiary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e: any)=>!e)}>
                    Confirmar
                </Button>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    input:{
        marginBottom: 16,
    },
});
