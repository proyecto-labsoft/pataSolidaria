import { StyleSheet, ScrollView, Image,Text, View, Pressable } from "react-native";
import { FlatList } from "react-native-reanimated/lib/typescript/Animated";
import { SafeAreaView } from "react-native-safe-area-context";


import { Avatar, Button, Card, Text as PaperText, useTheme } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

interface Props {
    data: {
        nombre: string,
        especie: string,
    },
    style: object
    
}
export default function CardFamiliar({data,style} : Props) {

    const theme = useTheme();  
    const navigation = useNavigation();

    return(
        <Pressable
            onPress={() => navigation.navigate('Familiar')}
            style={({pressed}) => [
            {
                ...styles.cardAnimal,
                ...style,
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : theme.colors.primary,
            },
        ]}
        >
            <Card style={{backgroundColor: theme.colors.tertiary}}>
                <Card.Cover  style={ styles.fotoAnimal } source={{ uri: 'https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg' }} />
                <Card.Title title={data.nombre} subtitle={data.especie} titleVariant="titleLarge" titleStyle={{ color: theme.colors.onSecondary}} subtitleStyle={{ color: theme.colors.onSecondary}}/>
            </Card>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cardAnimal: {
        flexDirection: 'column',
        flex: 1,
        alignSelf: "center",
        alignItems: "center",
        width: '100%',
        height: 'auto',
        borderRadius: 20,
    },
    fotoAnimal: {
        width: '100%',
        height: 'auto',
        resizeMode: 'cover',
        aspectRatio: 3,
        borderColor: "black",
        borderWidth: 0,
    },
});