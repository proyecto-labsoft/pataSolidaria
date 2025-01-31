import { Banner, Text, useTheme } from "react-native-paper";

type Props = {
    texto: string
}

export default function BannerInfo({texto}: Props) {

    const theme = useTheme()

    return (
        <Banner icon="information"  visible style={{width:'100%',margin: 10, borderRadius: 20,backgroundColor: theme.colors.tertiaryContainer}}>
            <Text style={{textAlign: 'center',color:theme.colors.onTertiaryContainer}}>{texto}</Text>
        </Banner>
    )
}