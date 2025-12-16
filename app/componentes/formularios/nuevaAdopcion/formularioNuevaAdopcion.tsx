import { View } from 'react-native'
import {useEffect, useState} from 'react'
import { Button, useTheme, Text, Portal, Divider, Switch } from 'react-native-paper' 
import { useForm } from 'react-hook-form' 
import { useNavigation } from '@react-navigation/native'  
import { useApiPostCrearAdopcion, useApiPostRegistrarMascota } from '@/app/api/hooks'
import { useUsuario } from '@/app/hooks/useUsuario'
import CampoSelectorModal from '../campos/campoSelectorModal'
import CampoTexto from '../campos/campoTexto'
import CampoTextoArea from '../campos/campoTextoArea'
import DescripcionVista from '../../descripcionVista'
import CampoFecha from '../campos/campoFecha'
import BackdropSuccess from '../../backdropSuccess'

export default function FormularioNuevaAdopcion() {
    
    const theme = useTheme()
    const [ubic, setUbic] = useState("");
    const [successMensaje, setSuccessMensaje] = useState(false);
    const navigation = useNavigation()

    const { usuarioId } = useUsuario()

    
    const { control, setValue, watch, handleSubmit } = useForm({});
    const esterilizado = watch('esterilizado');
    const chipeado = watch('chipeado');
    const {mutateAsync: crearAdopcion } = useApiPostCrearAdopcion({
        onSuccess: () => {setSuccessMensaje(true)}
    })

    const onSubmit = (data: any) => { 

        if (data?.sexo === 'Macho') {
            data.sexo = 'M';
        } else if (data?.sexo === 'Hembra') {
            data.sexo = 'H';
        } else if (data?.sexo === 'No lo sé') {
            data.sexo = null;
        }
        if (data?.tamanio === 'Pequeño') {
            data.tamanio = 'PEQUENIO';
        } else if (data?.tamanio === 'Mediano') {
            data.tamanio = 'MEDIANO';
        } else if (data?.tamanio === 'Grande') {
            data.tamanio = 'GRANDE';
        } else if (data?.tamanio === 'Muy grande') {
            data.tamanio = 'GIGANTE';
        }
        // data.ubicacion = ubic

        crearAdopcion({ 
            data: {
                ...{ 
                    familiarId: usuarioId,
                    nombre: null,
                    especie: null,
                    raza: null,
                    color: null,
                    descripcion: null,
                    esterilizado: null,
                    chipeado: null,
                    sexo: null,
                    tamanio: null,
                    fechaNacimiento: null
                }, 
                ...data
            }
        })
    }
    
    return(
        <View style={{gap:20}}>
            <Portal>
                {successMensaje && (
                <BackdropSuccess
                    texto="Nuevo integrante agregado a la familia"
                    onTap={() => {
                        navigation.goBack()
                    }}
                />
                )}
            </Portal>
            <DescripcionVista texto="Información del nuevo integrante" tamanioTexto="titleLarge"/>
        
            <CampoTexto
                control={control}
                label="Nombre"
                nombre="nombre"
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
            <Divider style={{height: 2, marginVertical: 10}}/>
            
            <View style={{justifyContent:'center',alignContent:'center',gap:10}}>
                {/* <Text style={{textAlign:'center', width:'100%', color: theme.colors.primary }} variant="headlineSmall">Identificación y esterilización</Text>
                <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center', height: 2 }}/>     */}
                
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
                            setValue('chipeado', !chipeado);
                        }}>Chipeado</Text>
                        <Switch
                            value={chipeado}
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                            onValueChange={() => {
                                setValue('chipeado', !chipeado);
                            }}
                        />
                    </View>
                
            </View>
            <Divider style={{height: 2, marginVertical: 10}}/>
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10}}>
                <Text style={{textAlign:'center'}} variant="headlineSmall">Aspecto del familiar</Text>
                <CampoTexto
                    control={control}
                    label="Colores"
                    nombre="color"
                />
            </View>
            <CampoSelectorModal
                control={control}
                label="Tamaño"
                nombre="tamanio"
                opciones={['Pequeño','Mediano','Grande','Muy grande']}
            />
        
            <CampoTextoArea
                control={control}
                label="ObservacionesAdicionales"
                nombre="descripcion"
            />
            <View style={{ flexDirection:'row', justifyContent:'space-evenly', width: '100%'}}>
                <Button  buttonColor={theme.colors.error} style={{  marginHorizontal:'5%',marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => navigation.goBack()}>
                    <Text variant='labelLarge' style={{color: theme.colors.onError, marginLeft: "5%"}}>Cancelar</Text>
                </Button>
                <Button buttonColor={theme.colors.primary} style={{  marginHorizontal:'5%',marginVertical: 8,borderRadius:10}} uppercase mode="contained"  onPress={handleSubmit(onSubmit)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Guardar</Text>
                </Button>
            </View>
            
        </View>
    )
}
