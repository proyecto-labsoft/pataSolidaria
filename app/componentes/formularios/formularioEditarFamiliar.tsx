import { View } from 'react-native'
import { SegmentedButtons,Text, TextInput, Checkbox, Button, useTheme } from 'react-native-paper'
import CampoTexto from './campos/campoTexto'
import CampoTextoArea from './campos/campoTextoArea'
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

    const { control, handleSubmit, formState: {errors} } = useForm({defaultValues: data});
    
    return(
        <View style={{width:'100%',gap:20,justifyContent: 'center'}}>
            <CampoTexto
                control={control}
                label="Nombre"
                nombre="nombre"
            />
            <CampoTexto
                control={control}
                label="Especie"
                nombre="especie"
            />
            <CampoTexto
                control={control}
                label="Raza"
                nombre="raza"
            />
            <CampoTexto
                control={control}
                label="Tamaño"
                nombre="tamanio"
            />
            <CampoTexto
                control={control}
                label="Colores"
                nombre="colores"
            />
            <CampoTexto
                control={control}
                label="Domicilio"
                nombre="domicilio"
            />
            <Button icon="map-marker" buttonColor={theme.colors.primary} style={{width: '100%', marginBottom: 24,borderRadius:10}} uppercase mode="contained" onPress={() => console.log('Pressed')}>
                Cargar otra ubicación
            </Button>
            <CampoTexto
                control={control}
                label="Fecha de nacimiento"
                // autoComplete='birthdate-day'
                nombre="fechanac"
            />
            <CampoTextoArea
                control={control}
                label="Descripción adicional"
                nombre="observaciones"
            />
            <Text variant="titleLarge" style={{width: '100%', textAlign:'center'}}>Sexo</Text>
            <SegmentedButtons
                value={data?.sexo}
                buttons={[{value:'hembra',label:'Hembra',icon:'gender-female'},{value:'macho',label:'Macho',icon:'gender-male'}]}
                onValueChange={() => console.log('')}
            />
            <View style={{ justifyContent: 'flex-start' , width: '80%' }}>
                <View style={{flexDirection:'row', marginVertical: 8, alignItems:'center'}}>
                    <Text variant="titleLarge">Esterilizado</Text>
                    <Checkbox
                        status={data?.esterilizado ? 'checked' : 'unchecked'}
                    />
                </View>
                <View style={{flexDirection:'row', marginVertical: 8, alignItems:'center'}}>
                    <Text variant="titleLarge">Identificación</Text>
                    <Checkbox
                        status={data?.identificado ? 'checked' : 'unchecked'}
                    />
                </View>
            </View>
                
            <View style={{ flexDirection:'column', justifyContent:'space-evenly', width: '100%'}}>
                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e: any)=>!e)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Guardar</Text>
                </Button>
                <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e: any)=>!e)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</Text>
                </Button>
            </View>
            
        </View>
    )
}