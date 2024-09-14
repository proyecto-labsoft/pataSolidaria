import { View, Image,StyleSheet, Text as TextNative, ScrollView } from 'react-native'
import {useMemo,useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Divider, SegmentedButtons,ActivityIndicator,Text as TextPaper, TextInput, Checkbox, Surface, Avatar, Button, IconButton, Icon } from 'react-native-paper'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface Props {
    data: string | boolean,
    label: string,
    icono?: React.ReactNode
}
const ItemFamiliar = ({data,label,icono} : Props) => {
    
    return (
        <View style={{ alignItems: 'flex-start', marginVertical:8, flexDirection: typeof data === 'boolean' ? 'row': 'column'}}>
            <TextPaper variant='titleMedium' style={{color: '#efefef'}}>{label}</TextPaper>
            { typeof data === 'boolean' ? ( data ? (<FontAwesome6 style={{ paddingTop: 2, paddingLeft: 8, color: 'green'}} name='circle-check' size={24} />) : (<FontAwesome6 style={{ color: 'red', paddingTop: 2, paddingLeft: 8}} name='circle-xmark' size={24} />)) 
                : (
                <>
                    <Divider />
                    <View style={{flexDirection: 'row', alignItems:'center', paddingVertical: 8}}>
                        {!!icono && <FontAwesome6 name={icono} style={{ color: "#efefef"}} size={24} />}
                        <TextPaper variant='titleMedium' style={{paddingLeft:16,color: "#efefef"}}>{data}</TextPaper>
                    </View>
                </>
                )
                }
        </View>
    )
}

export default ItemFamiliar