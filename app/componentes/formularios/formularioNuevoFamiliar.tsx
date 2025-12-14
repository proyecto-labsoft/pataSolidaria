import { View } from 'react-native'
import {useState} from 'react'
import { Button, useTheme, Text, Portal, Divider, Card } from 'react-native-paper'
import CampoTexto from './campos/campoTexto'
import { useForm } from 'react-hook-form'
import CampoTextoArea from './campos/campoTextoArea'
import { useNavigation } from '@react-navigation/native'
import DescripcionVista from '../descripcionVista'
import BackdropSuccess from '../backdropSuccess'
import CampoSelectorModal from './campos/campoSelectorModal'
import CampoCheckbox from './campos/campoCheckbox'
import CampoFecha from './campos/campoFecha'
import { useApiPostRegistrarMascota } from '@/app/api/hooks'
import { ImageManager } from '../imagenes'

export default function FormularioNuevoFamiliar() {
    
    const theme = useTheme()
    const [ubic, setUbic] = useState("");
    const [successMensaje, setSuccessMensaje] = useState(false);
    const [familiarCreado, setFamiliarCreado] = useState<number | null>(null);
    const [mostrarImagenes, setMostrarImagenes] = useState(false);
    const navigation = useNavigation()

    const { control, handleSubmit } = useForm(); 

    const {mutateAsync: crearFamiliar } = useApiPostRegistrarMascota({
        params: {id: 2},
        onSuccess: (data) => {
            setFamiliarCreado(data?.id);
            setMostrarImagenes(true);
        }
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

        crearFamiliar({ 
            data: {
                ...{ 
                    familiarId: 2,
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
                    texto="Familiar guardado exitosamente"
                    onTap={() => {
                        navigation.goBack()
                    }}
                />
                )}
            </Portal>

            {/* Formulario inicial - mostrar solo si no se ha creado el familiar */}
            {!mostrarImagenes && (
                <>
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
            <Divider style={{marginVertical: 20}}/>
            <View style={{justifyContent:'center',alignContent:'center',gap:10}}>
                <Text style={{textAlign:'center'}} variant="headlineSmall">Identificadores y esterilización</Text>
                
                <View style={{ justifyContent: 'flex-start', width: '100%' }}>
                    <CampoCheckbox
                        control={control}
                        label="¿Está esterilizado?"
                        nombre="esterilizado"
                        description="Marque si el animal ha sido esterilizado"
                    /> 
                    <CampoCheckbox
                        control={control}
                        label="¿Está chipeado/identificado?"
                        nombre="chipeado"
                        disabled={false}
                        description="Indique si tiene chip, collar o identificación"
                    /> 
                </View>
            </View>
            <Divider style={{marginVertical: 20}}/>
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
                <Button  buttonColor={theme.colors.secondary} style={{  marginHorizontal:'5%',marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => navigation.goBack()}>
                    <Text variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</Text>
                </Button>
                <Button buttonColor={theme.colors.primary} style={{  marginHorizontal:'5%',marginVertical: 8,borderRadius:10}} uppercase mode="contained"  onPress={handleSubmit(onSubmit)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Guardar</Text>
                </Button>
            </View>
                </>
            )}

            {/* Sección de imágenes - mostrar después de crear el familiar */}
            {mostrarImagenes && familiarCreado && (
                <>
                    <Card style={{ marginVertical: 16 }}>
                        <Card.Content>
                            <Text variant="headlineSmall" style={{ marginBottom: 8, textAlign: 'center' }}>
                                ✅ Familiar creado
                            </Text>
                            <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 16 }}>
                                Ahora puedes agregar fotos (opcional)
                            </Text>
                        </Card.Content>
                    </Card>

                    {/* Gestor de imágenes */}
                    <ImageManager
                        entityType="mascotas"
                        entityId={familiarCreado}
                        maxImages={5}
                        editable={true}
                        showUploader={true}
                    />

                    {/* Botones finales */}
                    <View style={{ flexDirection:'row', justifyContent:'space-evenly', width: '100%', marginTop: 16}}>
                        <Button 
                            buttonColor={theme.colors.secondary} 
                            style={{ marginHorizontal:'5%', marginVertical: 8, borderRadius:10, flex: 1 }} 
                            mode="outlined" 
                            onPress={() => navigation.goBack()}
                        >
                            <Text variant='labelLarge'>Saltar</Text>
                        </Button>
                        <Button 
                            buttonColor={theme.colors.primary} 
                            style={{ marginHorizontal:'5%', marginVertical: 8, borderRadius:10, flex: 1 }} 
                            mode="contained"  
                            onPress={() => setSuccessMensaje(true)}
                        >
                            <Text variant='labelLarge' style={{color: theme.colors.onPrimary}}>Finalizar</Text>
                        </Button>
                    </View>
                </>
            )}
            
        </View>
    )
}
