import { View, Image,StyleSheet, Text as TextNative, ScrollView } from 'react-native'
import {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Divider, SegmentedButtons,ActivityIndicator,Text as TextPaper, TextInput, Checkbox, Surface, Avatar, Button, IconButton } from 'react-native-paper'

const VistaFamiliar = () => {
  const [value, setValue] = useState('');
  const [text, setText] = useState("");

  return (
    
      <SafeAreaView style={ styles.container }>          
            <Avatar.Image
              source={{ uri: "https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg" }}
              style={ styles.fotoFamiliar }
              onProgress={() => (<ActivityIndicator animating/>)}
              size={150}
            />          
            <View style={{ flexDirection: 'row'}}>
              <TextPaper variant="headlineMedium" style={ styles.nombreFamiliar }>Chili</TextPaper>
              <IconButton icon='pencil' size={30} mode="contained" onPress={() => console.log('Pressed')}/>
            </View>
            <Divider style={{ width: '40%', height: 3, backgroundColor: 'black', borderRadius: 20 }} bold/>
            <ScrollView style={{ width:'100%' }}>        
              <View style={{ width:'100%' , marginVertical: 16, alignItems: 'center'}}>
                <TextInput
                  style={ styles.input }
                  label="Nombre"
                  value={text}
                  onChangeText={text => setText(text)}
                />
                <TextInput
                  style={ styles.input }
                  label="Especie"
                  value={text}
                  onChangeText={text => setText(text)}
                />
                <TextInput
                  style={ styles.input }
                  label="Raza"
                  value={text}
                  onChangeText={text => setText(text)}
                />
                <TextInput
                  style={ styles.input }
                  label="Sexo"
                  value={text}
                  onChangeText={text => setText(text)}
                />
                <TextInput
                  style={ styles.input }
                  label="Tamaño"
                  value={text}
                  onChangeText={text => setText(text)}
                />
                <TextInput
                  style={ styles.input }
                  label="Colores"
                  value={text}
                  onChangeText={text => setText(text)}
                />
                <TextInput
                  style={ styles.input }
                  label="Domicilio"
                  value={text}
                  onChangeText={text => setText(text)}
                />
                <TextInput
                  style={ styles.input }
                  label="Fecha de nacimiento"
                  value={text}
                  onChangeText={text => setText(text)}
                />
                <TextInput
                  style={ styles.input }
                  label="Descripción adicional"
                  value={text}
                  multiline
                  numberOfLines={5}
                  onChangeText={text => setText(text)}
                />
                <TextPaper variant="titleLarge">Sexo</TextPaper>
                <SegmentedButtons
                  style={ styles.input }
                  value={value}
                  onValueChange={setValue}
                  buttons={[{value:'hembra',label:'Hembra'},{value:'macho',label:'Macho'}]}
                  // {value:'hembra',label:'Hembra',icon: {icono}}
                />
                
                <View style={{ justifyContent: 'flex-start' , width: '80%' }}>
                  <View style={{flexDirection:'row', marginVertical: 8, alignItems:'center'}}>
                    <TextPaper variant="titleLarge">Esterilizado</TextPaper>
                    <Checkbox
                      status={'checked'}
                      // onPress={() => {
                      //   setChecked(!checked);
                      // }}
                    />
                  </View>
                  <View style={{flexDirection:'row', marginVertical: 8, alignItems:'center'}}>
                    <TextPaper variant="titleLarge">Identificación</TextPaper>
                    <Checkbox
                      status={'checked'}
                      // onPress={() => {
                      //   setChecked(!checked);
                      // }}
                    />
                  </View>
                </View>        
                <TextPaper variant="titleLarge">Domicilio del familiar</TextPaper>
                <Image style={{  marginVertical: 8, width: '80%',borderColor:'black',borderRadius:20,borderWidth:1, height: 100 }} source={{uri: "https://i.pinimg.com/736x/8b/a8/81/8ba8814f2ffdbd3178ccd69e26989653.jpg"}} />
                <Button icon="map-marker" style={{width: '80%',borderRadius:10}} uppercase mode="contained" onPress={() => console.log('Pressed')}>
                  Cargar otra ubicación
                </Button>      

                <Button style={{  marginVertical: 8, width: '80%',borderRadius:10}} uppercase mode="contained" onPress={() => console.log('Pressed')}>
                  Guardar cambios
                </Button>

              </View>
            </ScrollView>
            
        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 'auto',
        alignItems: "center",
    },
    input:{
      marginBottom: 16,
      width: '80%'
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