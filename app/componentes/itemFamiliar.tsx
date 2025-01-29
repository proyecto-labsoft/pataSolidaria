import { View, Image,StyleSheet, Text as TextNative, ScrollView } from 'react-native'
import {useMemo,useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Divider, SegmentedButtons,ActivityIndicator,Text as TextPaper, TextInput, Checkbox, Surface, Avatar, Button, IconButton, Icon, useTheme } from 'react-native-paper'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ItemDato from './itemDato';

interface Props {
    data: string | boolean,
    label: string,
    icono?: React.ReactNode
}
const ItemFamiliar = ({data,label,icono} : Props) => {
    return (

        <ItemDato label={label} data={data} icono={icono} />
        
    )
}

export default ItemFamiliar