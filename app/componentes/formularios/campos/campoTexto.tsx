import { TextInput } from "react-native-paper";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
type Props = {
    label?: string,
    nombre: string,
    style?: object,
    control?: any,
    valor?: any,
    disabled?: boolean,
    defaultValue?: any,
}
export default function CampoTexto({label,valor,nombre,defaultValue,disabled,control,style}: Props) {

    useEffect(() =>{},[valor])
    return (
        <Controller 
            defaultValue={defaultValue}
            name={nombre}
            control={control}
            render={({field: {onChange,value, onBlur}} ) => {
                return (
                <TextInput 
                    disabled={disabled}
                    mode='outlined'
                    style={{ marginHorizontal:'5%',backgroundColor:'transparent',...style}}
                    label={ label }
                    value={!!valor ? valor : value}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                />
            )}}
        />
    )
}