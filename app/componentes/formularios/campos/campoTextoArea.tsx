import { TextInput } from "react-native-paper";

type Props = {
    label: string,
    style?: object,
    value?: any,
    cantLineas?: number
}
export default function CampoTextoArea({label,value,style,cantLineas}: Props) {
    return (
        <TextInput
            mode='outlined'
            style={{ width:'100%',backgroundColor:'transparent',...style}}
            label={label}
            value={value}
            multiline
            numberOfLines={cantLineas || 5}
        />
    )
}