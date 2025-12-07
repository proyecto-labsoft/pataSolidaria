import { View, StyleSheet } from 'react-native'
import { Text as TextPaper, Button, useTheme, Portal, Modal, Text } from 'react-native-paper'
import CampoTexto from './campos/campoTexto'
import CampoTextoArea from './campos/campoTextoArea'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { useForm } from "react-hook-form";
import BackdropSuccess from '../backdropSuccess'
import { Mapa } from '../mapa'
import CampoHora from './campos/campoHora'
import { useApiPostAvistamiento } from '@/app/api/hooks'
import { useUsuario } from '@/app/hooks/useUsuario'
import { formatearFechaBuenosAires } from '@/app/utiles/fechaHoraBuenosAires'

// TODO: Falta parte del back
export default function FormularioNuevoAvistamiento({extravioId}: {extravioId: number}) {
    const theme = useTheme()
    const navigation = useNavigation()
    const [visible,setVisible] = useState(false)
    const [success,setSuccess] = useState(false)
    const { usuarioId } = useUsuario()
    const { control, handleSubmit, formState: {errors} } = useForm();

    const { mutateAsync: crearAvistamiento, isPending: isPendingCrearAvistamiento } = useApiPostAvistamiento({
        onSuccess: () => {
            setSuccess(true)
        }
    })
    const onSumbit = (formData: any) => {
        setVisible(false)
        const fechaStr = formData?.fecha || formatearFechaBuenosAires()
        const horaStr = formData?.hora || '00:00'
        const fechaHora = `${fechaStr} ${horaStr}:00`
        
        crearAvistamiento({data: {
            usuarioId: usuarioId,
            extravioId: extravioId,
            zona: "",
            comentario: formData?.descripcion,
            hora: fechaHora,
            latitud: formData?.latitud,
            longitud: formData?.longitud,
        }})
    }
    const [ubicacion,setUbicacion] = useState("")
    return(
        <View style={{gap:20}}>
            <Portal>
                {success && (<BackdropSuccess texto="Nuevo avistamiento confirmado" onTap={() => navigation.goBack()}/>)}
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{...styles.containerStyle,backgroundColor:theme.colors.surface}}>
                    <Text style={{textAlign: 'center'}}>Al reportar el nuevo avistamiento compartirá sus datos de contacto con los familiares del animal.</Text>
                    <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSumbit)} disabled={isPendingCrearAvistamiento}>
                        <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar avistamiento</Text>
                    </Button>
                </Modal>
            </Portal>

            
            <Mapa localizar latitude={null} longitude={null} modificarDomicilio={setUbicacion} />
            <CampoTexto
                valor={ubicacion}
                label="Ubicación del avistamiento"
                nombre="ubicacion"
                control={control}
            />
            <CampoHora 
                control={control}
                label="Hora (HH:mm)"
                nombre="hora"
            />
            {/* <CampoTexto
                control={control}
                label="Hora"
                nombre="hora"
            /> */}
            <CampoTexto
                control={control}
                label="Celular"
                nombre="celular"
            />
            <CampoTexto
                control={control}
                label="Correo electronico"
                nombre="correo"
            />
            <CampoTextoArea
                control={control}
                label="Descripción adicional"
                nombre="descripcion"
            />  

            
            <View style={{ flexDirection:'row', justifyContent:'space-evenly', width: '100%'}}>
                <Button  buttonColor={theme.colors.secondary} style={{  marginHorizontal:'5%',marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => navigation.goBack()}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onSecondary, marginLeft: "5%"}}>Cancelar</TextPaper>
                </Button>
                <Button buttonColor={theme.colors.primary} style={{  marginHorizontal:'5%',marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => setVisible(true)}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar avistamiento</TextPaper>
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: "space-around",
        alignItems: "center",
        width: '80%',
        height: '30%',
        alignSelf:"center",
        padding: 30,
        borderRadius: 20,
    },
    container: {
        height: 'auto',
        alignItems: "center",
    },
    fotoFamiliar: {
        marginTop: 35,
    },
    nombreFamiliar: {
        textAlign: 'center',
        width: 150,
        padding: 15,
    }
});
