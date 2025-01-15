import { View, Image,StyleSheet, Text as TextNative, ScrollView } from 'react-native'
import {useMemo,useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Divider, SegmentedButtons,ActivityIndicator,Text as TextPaper, TextInput, Checkbox, Surface, Avatar, Button, IconButton, Icon, useTheme } from 'react-native-paper'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface Props {
    data: string | boolean,
    label: string,
    icono?: React.ReactNode
}
const ItemFamiliar = ({data,label,icono} : Props) => {
    const theme = useTheme()
    return (
        <View style={{alignItems:'start',marginVertical:8,flexDirection: 'column'}}>
            <View style={{flexDirection: 'row',backgroundColor:theme.colors.background,borderWidth:1,borderColor: theme.colors.tertiary, alignItems:'center',padding: 20 , borderTopEndRadius: 20,borderTopStartRadius: 20, paddingVertical: 8}}>
                {!!icono && <FontAwesome6 name={icono} style={{color: theme.colors.tertiary, paddingRight: 15}} size={24} />}
                <TextPaper variant='titleMedium' style={{width: '100%',color: theme.colors.tertiary}}>{label}</TextPaper>
            </View>
            {/* <Divider style={{ width: '50%', height: 1, backgroundColor: theme.colors.tertiary, borderRadius: 20 }} /> */}
            <View style={{flexDirection: 'row',overflow:'hidden', alignItems:'center',borderBottomEndRadius: 20,borderBottomStartRadius: 20}}>
                <TextPaper variant='titleMedium' style={{width: '100%', paddingLeft: 16,paddingVertical: 8,backgroundColor: theme.colors.tertiary,color: "white"}}>{typeof data === 'boolean' ? data ? "Sí" : "No" : data}</TextPaper>
            </View>
            
        </View>
        // <View style={{justifyContent:'space-between',alignItems: "center",marginVertical:8,paddingHorizontal: 25,flexDirection: 'row'}}>    
        //     <View style={{flexDirection: 'row', alignItems:'center',padding: 20 ,backgroundColor: theme.colors.tertiary, borderRadius: 20, paddingVertical: 8}}>
        //         {!!icono && <FontAwesome6 name={icono} style={{color: "#efefef", paddingRight: 15}} size={24} />}
        //         <TextPaper variant='titleMedium' style={{color: '#efefef'}}>{label}</TextPaper>
        //     </View>
        //     <TextPaper variant='titleMedium' style={{paddingLeft:25,color: theme.colors.primary }}>{typeof data === 'boolean' ? data ? "Sí" : "No" : data}</TextPaper>
        // </View>
    )
}

export default ItemFamiliar