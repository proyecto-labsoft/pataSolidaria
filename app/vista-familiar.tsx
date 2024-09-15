import { View, Image,StyleSheet, Text as TextNative, ScrollView } from 'react-native'
import {useMemo,useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Divider,useTheme,ActivityIndicator,Text as TextPaper, TextInput, Checkbox, Avatar, Button, IconButton, Icon } from 'react-native-paper'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ItemFamiliar from './componentes/itemFamiliar';
import FormularioEditarFamiliar from './componentes/formularios/formularioEditarFamiliar ';
import { useGlobalSearchParams } from 'expo-router';

// Basandose en colores de la pagina de ARAF
// primario: 0f7599
// secundario: e28325
// terciario: efefef

const VistaFamiliar = () => {
  const theme = useTheme();
  const [edicion, setEdicion] = useState(false);
  const [datosFamiliar, setDatosFamiliar] = useState({
    nombre: 'Chili',
    especie: 'Perro',
    raza: 'callejero',
    tamanio: 'grande',
    colores: 'tricolor',
    fechanac: '14/04/2021',
    observaciones: 'compañero y sociable',
    sexo: 'macho',
    esterilizado: true,
    identificado: false,
    domicilio: 'Puerto español 844'
  });

  // const datos = useMemo(() => {

  // },[])
  
  return (
    
      <SafeAreaView style={ styles.container }>          
            <View style={{ flexDirection: 'row',marginHorizontal: 30,borderRadius:20}} >
              <View style={{ width:'100%', alignItems: 'center'}}>
                <View style={{  width:'50%',alignItems:'center'}}>
                  <Avatar.Image
                    source={{ uri: "https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg" }}
                    style={ styles.fotoFamiliar }
                    onProgress={() => (<ActivityIndicator animating/>)}
                    size={150}
                  />
                  <TextPaper variant="headlineMedium" style={ {...styles.nombreFamiliar, color:theme.colors.tertiary} }>Chili</TextPaper>
                  <Divider style={{ width: '100%', height: 3, backgroundColor: theme.colors.tertiary, borderRadius: 20 }} bold/>
                </View>
              </View>
              {/* <View style={{ flex: 1 , justifyContent: 'center',alignItems:'flex-start' }}>
                <IconButton icon='pencil' size={32} mode={edicion ? "contained" : "contained-tonal"} onPress={() => setEdicion(!edicion)}/>
              </View> */}
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={ {...styles.containerScroll, backgroundColor: (edicion ? '#efefef' : theme.colors.tertiary)}}>        
              
                {!edicion ? 
                (  
                  <View style={{marginVertical: 16, marginHorizontal: 32,justifyContent: 'space-between',flexDirection:'row'}}>
                    <View>
                      <ItemFamiliar label='Nombre' data={datosFamiliar?.nombre} icono='pen-clip' />
                      <ItemFamiliar label='Especie' data={datosFamiliar?.especie} icono='hippo' />
                      <ItemFamiliar label='Raza' data={datosFamiliar?.raza} icono='hippo' />
                      <ItemFamiliar label='Tamaño' data={datosFamiliar?.tamanio} icono='weight-hanging' />
                      <ItemFamiliar label='Colores' data={datosFamiliar?.colores} icono='palette' />
                      <ItemFamiliar label='Fecha de nacimiento' data={datosFamiliar?.fechanac} icono='cake-candles' />
                      <ItemFamiliar label='Observaciones' data={datosFamiliar?.observaciones} icono='circle-info' />
                      <ItemFamiliar label='Genero' data={datosFamiliar?.sexo} icono='venus-mars' />
                      <ItemFamiliar label='Esterilizado' data={datosFamiliar?.esterilizado}  />
                      <ItemFamiliar label='Identificado' data={datosFamiliar?.identificado} />
                      <ItemFamiliar label='Domicilio' data={datosFamiliar?.domicilio} icono='house' />
                      
                    </View>
                    <IconButton icon='pencil' size={32} mode={edicion ? "contained" : "contained-tonal"} onPress={() => setEdicion(!edicion)}/>
                  </View>
                ) :(
                  <FormularioEditarFamiliar data={datosFamiliar} onSumbit={setEdicion} />
                )}     
                {/* <Image style={{  marginVertical: 8, width: '100%',borderColor:'black',borderRadius:20,borderWidth:1, height: 100 }} source={{uri: "https://i.pinimg.com/736x/8b/a8/81/8ba8814f2ffdbd3178ccd69e26989653.jpg"}} /> } */}
              
            </ScrollView>
            
        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex:1
    },
    scrollView: {
      width: '90%',
      marginTop: 5,
    },
    containerScroll: {
      paddingBottom: 20,
      borderRadius: 10,
      margin: 12,
    },
    input:{
      marginBottom: 16,
    },
    fotoFamiliar: {
        marginTop: 35,
    },
    nombreFamiliar: {
        // borderBottomWidth: 1,
        // borderEndColor: 'black',
        textAlign: 'center',
        width: 150,
        padding: 15,
    }
  });

export default VistaFamiliar
