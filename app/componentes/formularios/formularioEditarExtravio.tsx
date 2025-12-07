import { View } from 'react-native'
import { Text, Button, useTheme, Divider } from 'react-native-paper'
import CampoTexto from './campos/campoTexto'
import CampoTextoArea from './campos/campoTextoArea' 
import { useForm } from 'react-hook-form'
import CampoFecha from './campos/campoFecha'
import CampoHora from './campos/campoHora'
import CampoSelectorModal from './campos/campoSelectorModal'
import { useMemo } from 'react'

interface Props {
    onSubmit: (data: any) => void,
    onCancel: () => void,
    data?: {
        zona?: string,
        direccion?: string,
        observacion?: string,
        hora?: string,
        latitud?: number,
        longitud?: number,
        mascotaDetalle?: {
            especie?: string,
            raza?: string,
            tamanio?: string,
            colores?: string,
            sexo?: string,
            descripcion?: string,
        }
    }
}

export default function FormularioEditarExtravio({data, onCancel, onSubmit} : Props) {
    const theme = useTheme()
    
    // Separar fecha y hora del campo 'hora' (formato: "dd-MM-yyyy HH:mm:ss")
    const defaultValues = useMemo(() => {
        if (!data) return {};
        
        let fecha = '';
        let hora = '';
        
        if (data.hora) {
            // Formato esperado: "27-11-2025 14:30:00"
            const partes = data.hora.split(' ');
            if (partes.length >= 2) {
                fecha = partes[0]; // "27-11-2025"
                hora = partes[1].substring(0, 5); // "14:30" (sin segundos)
            }
        }
        
        return {
            ...data,
            fecha: fecha || '',
            hora: hora || '',
            especie: data.mascotaDetalle?.especie || '',
            raza: data.mascotaDetalle?.raza || '',
            tamanio: data.mascotaDetalle?.tamanio || '',
            color: data.mascotaDetalle?.colores || '',
            sexo: data.mascotaDetalle?.sexo || '',
            descripcion: data.mascotaDetalle?.descripcion || '',
        };
    }, [data]);
    
    const { control, handleSubmit } = useForm({
        defaultValues
    });
    
    return(
        <View style={{width:'100%',gap:20,justifyContent: 'center'}}> 
            <Text style={{textAlign:'center',width:'100%'}} variant="headlineSmall">Datos del extravío</Text>
            <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center'}} />
            
            <CampoFecha
                label="Fecha del extravío"
                nombre="fecha"
                control={control}
            />
            
            <CampoHora
                label="Hora del extravío"
                nombre="hora"
                control={control}
            />
            
            <CampoTexto
                control={control}
                label="Zona"
                nombre="zona"
            />
            
            <CampoTexto
                control={control}
                label="Dirección"
                nombre="direccion"
            />
            
            <Divider style={{marginVertical: 20 , width: "90%", alignSelf: 'center'}} />
            <Text style={{textAlign:'center',width:'100%'}} variant="headlineSmall">Aspecto del animal</Text>
            <Divider style={{marginBottom: 20 , width: "90%", alignSelf: 'center'}} />
            
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
                label="Tamaño"
                nombre="tamanio"
                opciones={['Muy grande','Grande','Mediano','Pequeño']}
            />
            
            <CampoTexto
                control={control}
                label="Colores"
                nombre="color"
            />
            
            <CampoSelectorModal
                control={control} 
                label="Sexo"
                nombre="sexo"
                opciones={['No lo sé','Macho','Hembra']}
            />
            
            <CampoTextoArea
                control={control}
                label="Observaciones"
                nombre="observacion"
            />
            
            <CampoTextoArea
                control={control}
                label="Descripción adicional del animal"
                nombre="descripcion"
            />
            
            <View style={{ flexDirection:'row', justifyContent:'space-evenly', width: '100%'}}>
                
                <Button  buttonColor={theme.colors.error} style={{  marginVertical: 8 ,borderRadius:10}} uppercase mode="contained" onPress={onCancel}>
                    <Text variant='labelLarge' style={{color: theme.colors.onError, marginLeft: "5%"}}>Cancelar</Text>
                </Button>
                <Button buttonColor={theme.colors.primary} style={{  marginVertical: 8,borderRadius:10}} uppercase mode="contained" onPress={handleSubmit(onSubmit)}>
                    <Text variant='labelLarge' style={{color: theme.colors.onPrimary, marginLeft: "5%"}}>Guardar</Text>
                </Button>
            </View>
            
        </View>
    )
}
