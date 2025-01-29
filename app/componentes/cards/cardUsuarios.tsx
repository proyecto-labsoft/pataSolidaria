import { Pressable } from "react-native";
import { useTheme,ActivityIndicator, Avatar, Card } from 'react-native-paper'
import { useNavigation } from "@react-navigation/native";

export default function CardUsuario() {
    const theme = useTheme();  
    const navigation = useNavigation();


    return (
        <Card style={{width: '90%',backgroundColor: theme.colors.primary}} >
            <Pressable
                onPress={() => navigation.navigate("Perfil")}
                unstable_pressDelay={200}
                style={({pressed}) => [
                    {
                        borderRadius: 10,
                        backgroundColor: pressed ? theme.colors.onPrimary : theme.colors.primary,
                        opacity: pressed ? 0.8 : 1,
                    },
                    { padding: 0} 
            ]}
            >
                <Card.Title 
                    title="Mis datos"
                    style={{aspectRatio: 5}}
                    titleVariant="titleLarge" 
                    titleStyle={{ marginLeft: "20%", color: theme.colors.onPrimary}} 
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
            </Pressable>
        </Card>
    )
}