import { View } from 'react-native'
import { Text, Button, useTheme, Divider, Switch } from 'react-native-paper'
import CampoTexto from './campos/campoTexto'
import CampoTextoArea from './campos/campoTextoArea'
import CampoSelector from './campos/campoSelector'
import { useForm } from 'react-hook-form'
import CampoFecha from './campos/campoFecha'
import CampoSelectorModal from './campos/campoSelectorModal'
interface Props {
    onSubmit: (data: any) => void,
    data?: {
        nombre?: string,
        especie?: string,
        raza?: string,
        tamanio?: string,
        colores?: string,
        fechaNacimiento?: string,
        observaciones?: string,
        sexo?: string,
        esterilizado?: boolean,
        identificado?: boolean,
        domicilio?: string
    }
}
export default function FormularioEditarFamiliar({data, onCancel, onSubmit} : Props) {
    const theme = useTheme()
    
    const { control, setValue, watch, handleSubmit } = useForm({
        defaultValues: data || {}
    });
    const esterilizado = watch('esterilizado');
    const identificado = watch('identificado');
    
    return(
        <View style={{width:'100%',gap:20,justifyContent: 'center'}}>
            <CampoTexto
                control={control}
                label="Nombre"
                nombre="nombreCompaniero"
            />
            <CampoFecha
                label="Fecha de nacimiento"
                nombre="fechaNacimiento"
                control={control}
            />
            <CampoSelectorModal
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
            <CampoSelectorModal
                control={control} 
                label="Sexo"
                nombre="sexo"
                opciones={['No lo sé','Macho','Hembra']}
            />
            
            <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center'}} />
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                <Text style={{textAlign:'center'}} variant="headlineSmall">Aspecto del familiar</Text>
                <CampoTexto
                    control={control}
                    label="Colores"
                    nombre="colores"
                />
                
                <CampoSelectorModal
                    control={control}
                    label="Tamaño"
                    nombre="tamanio"
                    opciones={['Gigante','Grande','Mediano','Pequeño']}
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
                
                    <View style={{flexDirection:'row', marginHorizontal: 30,marginVertical: 8, alignItems:'center', justifyContent: 'space-between'}}>
                        <Text variant="titleLarge" onPress={() => {
                            setValue('esterilizado', !esterilizado);
                        }}>Esterilizado</Text>
                        <Switch
                            value={esterilizado}
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                            onValueChange={() => {
                                setValue('esterilizado', !esterilizado);
                            }}
                        />
                        
                    </View>
                    <View style={{flexDirection:'row', marginHorizontal: 30, marginVertical: 8, alignItems:'center', justifyContent: 'space-between'}}>
                        <Text variant="titleLarge" onPress={() => {
                            setValue('identificado', !identificado);
                        }}>Chipeado</Text>
                        <Switch
                            value={identificado}
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                            onValueChange={() => {
                                setValue('identificado', !identificado);
                            }}
                        />
                    </View>
                
            </View>
        
                
            <View style={{ flexDirection:'row', justifyContent:'space-evenly', width: '100%'}}>
                
                <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={onCancel}>
                    <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</Text>
                </Button>
                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSubmit)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Guardar</Text>
                </Button>
            </View>
            
        </View>
    )
}