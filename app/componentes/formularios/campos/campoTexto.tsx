import { TextInput } from "react-native-paper";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
type Props = {
    label: string,
    nombre: string,
    style?: object,
    control?: any,
    valor?: any,
}
export default function CampoTexto({label,valor,nombre,control,style}: Props) {

    useEffect(() =>{},[valor])
    return (
        <Controller 
            name={nombre}
            control={control}
            render={({field: {onChange,value, onBlur}} ) => {
                return (
                <TextInput 
                    mode='outlined'
                    style={{ width:'100%',backgroundColor:'transparent',...style}}
                    label={ label }
                    value={!!valor ? valor : value}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                />
            )}}
        />
    )
}