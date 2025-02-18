import { View, Image,StyleSheet, Text as TextNative, ScrollView } from 'react-native'
import {useEffect, useMemo,useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SegmentedButtons,Text as TextPaper, TextInput, Checkbox, Button, useTheme, Text } from 'react-native-paper'
import { Mapa } from '../mapa'
import CampoTexto from './campos/campoTexto'
import { useForm } from 'react-hook-form'
import CampoTextoArea from './campos/campoTextoArea'
import { useNavigation } from '@react-navigation/native'
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
        ubicacion?: string
    }
}
export default function FormularioConfirmarBuscado({data,onSumbit} : Props) {
    const theme = useTheme()
    const [ubic, setUbic] = useState("");
    const navigation = useNavigation()
    
    useEffect(() => {
        if (ubic) { 
            console.log(ubic)
        }
    },[ubic])

    const { control, handleSubmit, formState: {errors} } = useForm({defaultValues: data});
    const onSubmit = (data: any) => {
        data.ubicacion = ubic
        console.log("data: ",data)
        
    }
    return(
        <View>
            <Mapa localizar latitude={null} longitude={null} modificarDomicilio={setUbic} />
            <CampoTexto
                valor={ubic}
                label='Ubicación'
                nombre='ubicacion'
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                label="Nombre"
                nombre="nombre"
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                label="Especie"
                nombre="especie"
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                label="Raza"
                nombre="raza"
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                label="Tamaño"
                nombre="tamanio"
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                label="Colores"
                nombre="colores"
                control={control}
            />
            <CampoTexto
                style={ styles.input }
                label="Domicilio"
                nombre="domicilio"
                control={control}
            />
            {/* <Button icon="map-marker" buttonColor={theme.colors.tertiary} style={{width: '100%', marginBottom: 24,borderRadius:10}} uppercase mode="contained" onPress={() => console.log('Pressed')}>
                Cargar otra ubicación
            </Button> */}
            <Button icon="map-marker" buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSubmit)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Cargar otra ubicación</Text>
                </Button>
            <CampoTexto
                style={ styles.input }
                control={control}
                nombre="fechanac"
                label="Fecha de nacimiento"
            />
            <CampoTextoArea
                style={ styles.input }
                label="Descripción adicional"
                nombre="observaciones"
                control={control}
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
                
            <View style={{ flexDirection:'column', justifyContent:'space-evenly', width: '100%'}}>
                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSubmit)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Guardar</Text>
                </Button>
                <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => navigation.goBack()}>
                    <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</Text>
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
