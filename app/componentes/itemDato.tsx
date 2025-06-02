import { useWindowDimensions, View } from "react-native";
import { useTheme, Text as TextPaper, Divider } from "react-native-paper";
import React from "react";

interface Props {
    data: string | boolean,
    label: string,
    icono?: React.ReactNode,
    style?: object,
}

export default function ItemDato({label,data,icono,style}: Props) {
    const {width} = useWindowDimensions()
    
    const theme = useTheme()
    return (
        <View style={{alignItems: "flex-start",width: (width*85)/100,marginBottom: 10, ...style }}>  
            <TextPaper variant='labelLarge' style={{textAlign:"left",width:"100%", color: theme.colors.onSurface}}>{label}</TextPaper>
            <Divider style={{ width: '100%', height: 1, backgroundColor: theme.colors.outlineVariant, borderRadius: 20, marginBottom: 10 }} />
            <TextPaper variant='titleLarge' style={{width:"100%",textAlign:"left",color: theme.colors.onSurface }}>{typeof data === 'boolean' ? data ? 'Si' : 'No' : data ? data : 'Sin información' }</TextPaper>
        </View>
    )
}