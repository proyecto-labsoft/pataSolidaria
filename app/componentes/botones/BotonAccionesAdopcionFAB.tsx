import { useState} from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Icon, Portal ,useTheme} from 'react-native-paper';
import PawPrintIcon from '../iconos/PawPrintIcon';
import { useIsFocused } from '@react-navigation/native';
interface Props {
    onPress: any
    showButton: boolean
}
export default function BotonAccionesAdopcionFAB({onPress,showButton} : Props) {
    const [state, setState] = useState({ open: false });

    
    const theme = useTheme()

    const handleChange = ({ open }:any ) => setState({ open });

    const { open } = state;

    return (
    
        <Portal>
            <FAB.Group
                open={open}
                visible={showButton}
                icon={open ? 'close' : 'plus'}
                color={theme.colors.onSecondary} 
                actions={[
                    {
                        icon: () => <Icon source='plus' size={26} color={theme.colors.onSecondaryContainer} />,
                        style: { ...styles.fabItem, backgroundColor: theme?.colors.secondary},
                        label: 'Agregar nuevo familiar',
                        labelStyle: { ...styles.labelFab },
                        onPress: () => onPress("NuevoFamiliar"),
                    },
                    {
                        style: { ...styles.fabItem, backgroundColor: theme?.colors.tertiary},
                        icon: () => <PawPrintIcon width={28} height={28} color={theme?.colors.onSecondaryContainer} />,
                        label: 'Mi familiar se perdió',
                        labelStyle: { ...styles.labelFab },
                        onPress: () => onPress("NuevoBuscado"),
                    }
                    ]}
                onStateChange={handleChange}
                fabStyle={{...styles.fab, backgroundColor: open ? theme?.colors.inverseSurface : theme?.colors.tertiary}}
                style={{...styles.fabGroup}} 
            />
        </Portal>
    );
}


const styles = StyleSheet.create({
    fab: {
        borderRadius:50,
        justifyContent:'center',
        width: 85,
        height: 85,
        right: 10,
        bottom: 60,
        alignItems:'center', 
    },
    labelFab:{
        bottom: 80,
        fontSize: 20,
        fontWeight: 'bold',
    },
    fabItem:{
        justifyContent:'center',
        alignItems:'center',
        bottom: 80,
        width: 60,
        height: 60,
        borderRadius:50,
        right: 15,
    },
    fabGroup:{
        right: 0,
        bottom: 0,
    }
})

