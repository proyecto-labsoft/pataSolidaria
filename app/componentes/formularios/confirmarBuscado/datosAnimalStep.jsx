import { View } from 'react-native'
import { useTheme, Text, Switch, Divider } from 'react-native-paper'
import CampoTexto from '../campos/campoTexto'
import CampoSelectorModal from '../campos/campoSelectorModal'
import CampoTextoArea from '../campos/campoTextoArea'
import CampoFecha from '../campos/campoFecha'
import PropTypes from 'prop-types'

export default function DatosAnimalStep({control, setValue, watch}) {
    const theme = useTheme()
    const esterilizado = watch('esterilizado');
    const chipeado = watch('chipeado');

    return (
        <View style={{gap:20}}>
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                <Text style={{textAlign:'center'}} variant="headlineSmall">Datos del animal</Text>
                
                <CampoTexto
                    label="Nombre"
                    nombre="nombre"
                    control={control}
                /> 
                
                <CampoSelectorModal
                    control={control} 
                    label="Sexo"
                    nombre="sexo"
                    opciones={['No lo sé','Macho','Hembra']}
                />
                
                <CampoTexto
                    label="Especie"
                    nombre="especie"
                    control={control}
                />
                
                <CampoTexto
                    label="Raza"
                    nombre="raza"
                    control={control}
                />
                
                <CampoTexto
                    label="Tamaño"
                    nombre="tamanio"
                    control={control}
                />
                
                <CampoTexto
                    label="Colores"
                    nombre="color"
                    control={control}
                />
                
                <CampoFecha
                    label="Fecha de nacimiento"
                    nombre="fechaNacimiento"
                    control={control}
                />
                
                <CampoTextoArea
                    label="Descripción adicional"
                    nombre="descripcion"
                    control={control}
                />
                
                <Divider style={{height: 2, marginVertical: 10, width: "90%", alignSelf: 'center'}}/> 
                
                <View style={{justifyContent:'center',alignContent:'center', gap:10 }}>
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
            </View>
        </View>
    )
}

DatosAnimalStep.propTypes = {
    control: PropTypes.object.isRequired,
    setValue: PropTypes.func.isRequired,
    watch: PropTypes.func.isRequired,
}
