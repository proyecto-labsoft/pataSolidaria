import { TextInput } from "react-native-paper";

type Props = {
    label: string,
    value?: any,
    style?: object,
}
export default function CampoTexto({label,value,style}: Props) {
    return (
        <TextInput
            mode='outlined'
            style={{ width:'100%',...style}}
            label={ label }
            value={value}
        />
    )
}