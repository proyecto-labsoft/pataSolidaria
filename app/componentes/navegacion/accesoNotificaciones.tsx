import {useTheme,   Appbar} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';

export default function AccesoNotificaciones() {
    const theme = useTheme();
    const navigation = useNavigation();
    return <Appbar.Action icon="bell-outline" iconColor={theme.colors.onPrimary} onPress={() => navigation.navigate("Notificaciones")} />
}