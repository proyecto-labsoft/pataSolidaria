import { View,StyleSheet, ScrollView } from 'react-native'
import { useState} from 'react'
import { Divider,useTheme,ActivityIndicator,Text as TextPaper,   Appbar, Avatar, IconButton } from 'react-native-paper'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ItemFamiliar from './componentes/itemFamiliar';
import FormularioEditarFamiliar from './componentes/formularios/formularioEditarFamiliar ';
import { useNavigation } from '@react-navigation/native';
import { TakePictureBtn } from '@/src/components/TakePictureBtn';
import BotonEditar from './componentes/botones/botonEditar';

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
  const [foto, setFoto] = useState<string | null>('https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg');

  const navigation = useNavigation();
  
  return (
    
      < >          
        <Appbar.Header style={{ backgroundColor: theme.colors.surface, width: '100%', justifyContent:'space-between'}} >
          <Appbar.Action icon="arrow-left-bold" iconColor={theme.colors.primary} onPress={() => navigation.goBack()} />
          <Appbar.Content title="Familiares" titleStyle={{ color: theme.colors.primary }} />
          <Appbar.Action icon="account" iconColor={theme.colors.primary} onPress={() => navigation.navigate("Perfil")} />
        </Appbar.Header>

            {/* <View style={{ flexDirection: 'row',borderRadius:20, width:'100%', alignItems: 'center'}} >
              
                <View style={{  width:'100%',alignItems:'center'}}>
                  <Avatar.Image
                    source={{ uri: foto }}
                    style={ styles.fotoFamiliar }
                    onProgress={() => (<ActivityIndicator animating/>)}
                    size={150}
                  />
                  <IconButton icon='pencil' size={32} mode={edicion ? "contained" : "contained-tonal"} onPress={() => setEdicion(!edicion)}/>
                  <TakePictureBtn setImagen={setFoto} />
                  <TextPaper variant="headlineMedium" style={ {...styles.nombreFamiliar, color:theme.colors.primary} }>Chili</TextPaper>
                  <Divider style={{ width: '50%', height: 3, backgroundColor: theme.colors.primary, borderRadius: 20 }} bold/>
                </View>
              
              {<View style={{ flex: 1 , justifyContent: 'center',alignItems:'flex-start' }}>
                <IconButton icon='pencil' size={32} mode={edicion ? "contained" : "contained-tonal"} onPress={() => setEdicion(!edicion)}/>
              </View>
            </View>  */}
            <View style={{flex:1,backgroundColor: theme.colors.surface}}>
              <ScrollView style={styles.scrollView} contentContainerStyle={ {...styles.containerScroll}}>        
              <View style={{  width:'100%',alignItems:'center'}}>
                    <Avatar.Image
                      source={{ uri: foto }}
                      style={ {...styles.fotoFamiliar, overflow:'hidden',borderColor: theme.colors.secondary,borderWidth:2} }
                      onProgress={() => (<ActivityIndicator animating/>)}
                      size={150}
                    />
                    {/* <IconButton icon='pencil' size={32} mode={edicion ? "contained" : "contained-tonal"} onPress={() => setEdicion(!edicion)}/> */}
                    <TakePictureBtn setImagen={setFoto} />
                    <TextPaper variant="headlineMedium" style={ {...styles.nombreFamiliar, color:theme.colors.primary} }>Chili</TextPaper>
                  </View>
                  {!edicion ? 
                  (  
                    <View>
                        <ItemFamiliar label='Nombre' data={datosFamiliar?.nombre} icono='pen-clip' />
                        <ItemFamiliar label='Especie' data={datosFamiliar?.especie} icono='hippo' />
                        <ItemFamiliar label='Raza' data={datosFamiliar?.raza} icono='hippo' />
                        <ItemFamiliar label='Tamaño' data={datosFamiliar?.tamanio} icono='weight-hanging' />
                        <ItemFamiliar label='Colores' data={datosFamiliar?.colores} icono='palette' />
                        <ItemFamiliar label='Fecha de nacimiento' data={datosFamiliar?.fechanac} icono='cake-candles' />
                        <ItemFamiliar label='Genero' data={datosFamiliar?.sexo} icono='venus-mars' />
                        <ItemFamiliar label='¿Está esterilizado?' data={datosFamiliar?.esterilizado}  />
                        <ItemFamiliar label='¿Está chipeado?' data={datosFamiliar?.identificado} />
                        <ItemFamiliar label='Domicilio' data={datosFamiliar?.domicilio} icono='house' />
                        <ItemFamiliar label='Observaciones' data={datosFamiliar?.observaciones} icono='circle-info' />
                    </View>
                  ) :(
                    <FormularioEditarFamiliar data={datosFamiliar} onSumbit={setEdicion} />
                  )}     
                  {/* <Image style={{  marginVertical: 8, width: '100%',borderColor:'black',borderRadius:20,borderWidth:1, height: 100 }} source={{uri: "https://i.pinimg.com/736x/8b/a8/81/8ba8814f2ffdbd3178ccd69e26989653.jpg"}} /> } */}
                
              </ScrollView>
              <BotonEditar showButton={!edicion} onPress={(e: boolean) => setEdicion(e)} />
            </View>
            
        </>
  )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex:1
    },
    scrollView: {
      marginTop: 5,
    },
    containerScroll: {
      paddingHorizontal: "5%",
      paddingBottom: 20,
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
