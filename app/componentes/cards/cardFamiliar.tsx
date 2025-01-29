import {Pressable } from "react-native";
import { ActivityIndicator, Avatar, Card, useTheme } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

interface Props {
    data: {
        nombre: string,
        especie: string,
    },
    navigateTo: string
    
}
export default function CardFamiliar({data,navigateTo} : Props) {

    const theme = useTheme();  
    const navigation = useNavigation();
    
    return(
        <Pressable
            onPress={() => navigation.navigate(navigateTo)}
            style={({pressed}) => [
            {
                marginVertical: 15,
                width: '90%',
            },
        ]}
        >
            <Card contentStyle={{flexDirection: 'row'}} style={{backgroundColor: theme.colors.primary,shadowColor: 'black'}} >
                <Card.Title 
                    title={data.nombre} 
                    subtitle={data.especie} 
                    style={{aspectRatio: 5}}
                    titleVariant="titleLarge" 
                    titleStyle={{ marginLeft: "20%", color: theme.colors.onPrimary}} 
                    subtitleStyle={{ marginLeft: "20%",color: theme.colors.onSecondary}}
                    leftStyle={{alignItems: 'center'}}
                    left={() => (
                        <Avatar.Image
                            source={{ uri: 'https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg' }}
                            style={ { overflow:'hidden',borderColor: theme.colors.primary,borderWidth:2} }
                            size={100}
                            onProgress={() => (<ActivityIndicator animating/>)}
                        />
                    )}
                />
            </Card>
        </Pressable>
    )
}