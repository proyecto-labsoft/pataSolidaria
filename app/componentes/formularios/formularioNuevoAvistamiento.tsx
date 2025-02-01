import { View, StyleSheet, Dimensions } from 'react-native'
import { Text as TextPaper, Button, useTheme } from 'react-native-paper'
import BannerInfo from '../bannerInfo'
import CampoTexto from './campos/campoTexto'
import CampoTextoArea from './campos/campoTextoArea'
import { useNavigation } from '@react-navigation/native'

interface Props {
    onSumbit: Function,
    data?: {
    }
}

export default function FormularioNuevoAvistamiento({onSumbit,data}: Props) {
    const theme = useTheme()
    const {width} = Dimensions.get('screen')
    const navigation = useNavigation()
    return(
        <View style={{gap:20,marginVertical: 16,paddingHorizontal: '5%',height: '100%',width:width,alignItems:'center'}}>
            <TextPaper variant='titleMedium' style={{color:theme.colors.secondary,textAlign:'center',width:'auto'}}>Indique la ubicación del avistamiento</TextPaper>
            <CampoTexto
                label="Ubicación"
            />
            <BannerInfo texto='Si quiere indicar otra ubicación modifique el campo ó marque otra ubicación en el mapa.' />
            <Button buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary} style={{ marginVertical: 8,borderRadius:50}} uppercase mode="contained" onPress={() => console.log("ir a mapa")}>
                Modificar ubicación
            </Button>
            <CampoTexto
                label="Hora"
            />
            <CampoTexto
                label="Celular"
            />
            <CampoTexto
                label="Correo electronico"
            />
            <CampoTextoArea
                label="Descripción adicional"
            />  
            <View style={{ flexDirection:'column', justifyContent:'space-evenly', width: '100%'}}>
                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={() => onSumbit((e:any)=>!e)}>
                    <TextPaper variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Confirmar avistamiento</TextPaper>
                </Button>
                <Button  buttonColor={theme.colors.secondary} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={() => navigation.goBack()}>
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
    nombreFamiliar: {
        textAlign: 'center',
        width: 150,
        padding: 15,
    }
});
