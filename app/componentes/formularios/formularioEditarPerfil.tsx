import { View } from 'react-native'
import { Text as TextPaper, Button, useTheme } from 'react-native-paper'
import CampoTexto from './campos/campoTexto'
interface Props {
    onSumbit: Function,
    onCancel: Function,
    data: {
        nombre: string,
        celular: string,
        domicilio: string,
    }
    control: any,
}
export default function FormularioEditarPerfil({onSumbit, onCancel, control} : Props) {
    const theme = useTheme()
    
    return(
        
        <View style={{gap:20,marginVertical: 16,justifyContent: 'center',paddingHorizontal: '5%'}}>
            <CampoTexto
                nombre="nombre"
                label="Nombre"
                control={control}
            />
            <CampoTexto
                nombre="celular"
                label="Celular"
                control={control}
            />
            <CampoTexto
                nombre="domicilio"
                label="Domicilio"
                control={control}
            />
            
            <View style={{ flexDirection:'row', display: 'flex', justifyContent:'space-evenly', width: '100%'}}>
                <Button  buttonColor={theme.colors.error} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => onCancel()}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onError, marginLeft: "5%"}}>Cancelar</TextPaper>
                </Button>
                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit()}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Guardar</TextPaper>
                </Button>
            </View>
            
        </View>
    )
}
