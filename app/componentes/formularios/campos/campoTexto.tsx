import { TextInput } from "react-native-paper";
import { Controller } from "react-hook-form";
type Props = {
    label: string,
    nombre: string,
    style?: object,
    control?: any,
}
export default function CampoTexto({label,nombre,control,style}: Props) {
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
                    value={value}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                />
            )}}
        />
    )
}