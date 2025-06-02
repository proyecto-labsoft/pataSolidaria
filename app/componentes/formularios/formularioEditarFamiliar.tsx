import { View } from 'react-native'
import { SegmentedButtons,Text, TextInput, Checkbox, Button, useTheme, Divider } from 'react-native-paper'
import CampoTexto from './campos/campoTexto'
import CampoTextoArea from './campos/campoTextoArea'
import CampoSelector from './campos/campoSelector'
import { useForm } from 'react-hook-form'
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
    
    const { control,setValue, watch, handleSubmit, formState: {errors} } = useForm({defaultValues: data});
    const esterilizado = watch('esterilizado');
    const identificado = watch('identificado');
    
    return(
        <View style={{width:'100%',gap:20,justifyContent: 'center'}}>
            <CampoTexto
                control={control}
                label="Nombre"
                nombre="nombre"
            />
            <CampoTexto
                control={control}
                label="Fecha de nacimiento"
                // autoComplete='birthdate-day'
                nombre="fechanac"
            />
            <CampoSelector
                control={control}
                label="Especie de animal"
                nombre="especie"
                opciones={['Perro','Gato','Caballo','Otros']}
            />
            <CampoTexto
                control={control}
                label="Raza"
                nombre="raza"
            />
            <CampoSelector
                control={control} 
                label="Sexo"
                nombre="sexo"
                opciones={['No lo sé','Macho','Hembra']}
            />
            
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                <Text style={{textAlign:'center',width:'100%'}} variant="headlineSmall">Aspecto físico</Text>
                <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center'}}/>
                <CampoTexto
                    control={control}
                    label="Colores"
                    nombre="colores"
                />
                
                <CampoSelector
                    control={control}
                    label="Tamaño"
                    nombre="tamanio"
                    opciones={['Muy pequeño','Pequeño','Mediano','Grande','Muy grande']}
                />
                
                <CampoTextoArea
                    control={control}
                    label="Descripción adicional"
                    nombre="observaciones"
                />
            </View>

            <View style={{justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                <Text style={{textAlign:'center',width:'100%'}} variant="headlineSmall">Domicilio</Text>
                <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center'}}/>    

                <CampoTexto
                    control={control}
                    // label="Domicilio"
                    nombre="domicilio"
                />
                <Button icon="map-marker" buttonColor={theme.colors.primary} style={{width: '90%',alignSelf:'center',borderRadius:10}} uppercase mode="contained" onPress={() => console.log('Pressed')}>
                    Cambiar domicilio
                </Button> 
            </View>
            <View style={{justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                <Text style={{textAlign:'center',width:'100%'}} variant="headlineSmall">Identificadores y esterilización</Text>
                <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center'}}/>    
                
                    <View style={{flexDirection:'row', marginLeft:15,marginVertical: 8, alignItems:'center'}}>
                        <Checkbox
                            status={esterilizado ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setValue('esterilizado', !esterilizado);
                            }}
                        />
                        <Text variant="titleLarge" onPress={() => {
                            setValue('esterilizado', !esterilizado);
                        }}>Esterilizado</Text>
                    </View>
                    <View style={{flexDirection:'row', marginLeft:15, marginVertical: 8, alignItems:'center'}}>
                        <Checkbox
                            status={identificado ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setValue('identificado', !identificado);
                            }}
                        />
                        <Text variant="titleLarge" onPress={() => {
                            setValue('identificado', !identificado);
                        }}>Chipeado</Text>
                    </View>
                
            </View>
        
                
            <View style={{ flexDirection:'row', justifyContent:'space-evenly', width: '100%'}}>
                
                <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e: any)=>!e)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</Text>
                </Button>
                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e: any)=>!e)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Guardar</Text>
                </Button>
            </View>
            
        </View>
    )
}