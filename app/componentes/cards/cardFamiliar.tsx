import {Pressable, View } from "react-native";
import { ActivityIndicator, Avatar, Card, useTheme, Chip } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

interface Props {
    data: {
        id?: number,
        nombre: string,
        especie: string,
    },
    navigateTo: any,
    estaExtraviado?: boolean
}
export default function CardFamiliar({data, navigateTo, estaExtraviado = false} : Props) { 
    
    const theme = useTheme();  
    const navigation = useNavigation();
    
    return(
        <Card 
            style={{
                width: '90%',
                marginHorizontal:5, 
                backgroundColor: estaExtraviado ? theme.colors.errorContainer : theme.colors.primary,
                borderWidth: estaExtraviado ? 2 : 0,
                borderColor: estaExtraviado ? theme.colors.error : 'transparent'
            }} 
        >
            <Pressable
                onPress={() => navigation.navigate(navigateTo,data)}
                unstable_pressDelay={200}
                style={({pressed}) => [
                    {
                        borderRadius: 10,
                        backgroundColor: pressed 
                            ? theme.colors.onPrimary 
                            : estaExtraviado 
                                ? theme.colors.errorContainer 
                                : theme.colors.primary,
                        opacity: pressed ? 0.8 : 1,
                    },
                    { padding: 0} 
            ]}
            >
                <Card.Title 
                    title={data.nombre} 
                    subtitle={data.especie} 
                    style={{aspectRatio: 5}}
                    titleVariant="titleLarge" 
                    titleStyle={{ 
                        marginLeft: "20%", 
                        color: estaExtraviado ? theme.colors.onErrorContainer : theme.colors.onPrimary
                    }} 
                    subtitleStyle={{ 
                        marginLeft: "20%",
                        color: estaExtraviado ? theme.colors.onErrorContainer : theme.colors.onSecondary
                    }}
                    right={() => estaExtraviado && (
                        <Chip
                            mode="flat"
                            style={{
                                position: 'absolute',
                                right: -20,
                                bottom: -15,
                                alignSelf: 'center',
                                backgroundColor: theme.colors.error, 
                            }}
                            textStyle={{
                                textAlign: 'center',
                                color: theme.colors.onError,  
                                fontWeight: 'bold'
                            }}
                        >
                            EXTRAVIADO
                        </Chip>
                    
                    )}
                    leftStyle={{alignItems: 'center'}}
                    left={() => (
                        <View style={{ position: 'relative' }}>
                            <Avatar.Image
                                source={{ uri: 'https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg' }}
                                style={{ 
                                    overflow:'hidden',
                                    borderColor: estaExtraviado ? theme.colors.error : theme.colors.primary,
                                    borderWidth: 2
                                }}
                                size={100}
                                onProgress={() => (<ActivityIndicator animating/>)}
                            />
                        </View>
                    )}
                />
            </Pressable>
        </Card>
    )
}