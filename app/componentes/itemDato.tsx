import { View } from "react-native";
import { useTheme, Text as TextPaper, Divider } from "react-native-paper";
import React from "react";

interface Props {
    data: string | boolean,
    label: string,
    icono?: React.ReactNode
}

export default function ItemDato({label,data,icono}: Props) {
    
    const theme = useTheme()

    return (
        <View style={{alignItems: "flex-start",width:"100%"}}>  
            <TextPaper variant='titleSmall' style={{textAlign:"left",width:"100%", color: theme.colors.onSurface}}>{label}</TextPaper>
            <Divider style={{ width: '100%', height: 1, backgroundColor: theme.colors.outlineVariant, borderRadius: 20 }} />
            <TextPaper variant='titleMedium' style={{width:"100%",textAlign:"left",color: theme.colors.onSurface }}>{typeof data === 'boolean' ? data ? 'Si' : 'No' : data  }</TextPaper>
        </View>
    )
}