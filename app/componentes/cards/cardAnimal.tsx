import { StyleSheet, Pressable } from "react-native";
import {  Card,  useTheme } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

interface Props {
    data: {
        nombre: string,
        especie: string,
    },
    navigateTo: string
    
}
export default function CardAnimal({data,navigateTo} : Props) {

    const theme = useTheme();  
    const navigation = useNavigation();
    
    return(
        
            <Card style={{margin: 8,flex: 1,backgroundColor: theme.colors.primary}}>
                <Pressable
                    onPress={() => {
                        navigation.navigate(navigateTo,{data:data})
                    }}
                    unstable_pressDelay={100}
                    style={({pressed}) => [
                    {
                        borderRadius: 10,
                        backgroundColor: pressed ? theme.colors.onPrimary : theme.colors.primary,
                        opacity: pressed ? 0.8 : 1,
                    },
                    { padding: 5} 
                ]}
                >
                    <Card.Cover  style={ styles.fotoAnimal } source={{ uri: 'https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg' }} />
                    <Card.Title title={data.nombre} subtitle={data.especie} titleVariant="titleLarge" titleStyle={{ color: theme.colors.onPrimary}} subtitleStyle={{ color: theme.colors.onSecondary}}/>
                </Pressable>
                
            </Card>
    )
}

const styles = StyleSheet.create({
    fotoAnimal: {
        width: '100%',
        height: 'auto',
        resizeMode: 'cover',
        aspectRatio: 1.5,
    },
});