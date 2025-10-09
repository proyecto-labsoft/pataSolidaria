import { useState} from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal ,useTheme} from 'react-native-paper';
interface Props {
    onPress: any
    showButton: boolean
}
export default function BotonCrearFamiliar({onPress,showButton} : Props) {
    const [state, setState] = useState({ open: false });
    
    const theme = useTheme()

    const handleChange = ({ open }:any ) => setState({ open });

    const { open } = state;

    return (
    
        <Portal>
            <FAB.Group
                open={open}
                visible={showButton}
                icon={open ? 'arrow-up-bold-outline' : 'plus'}
                color="white"
                actions={[
                    {
                        icon: 'eye-outline',
                        style: { ...styles.fabItem, backgroundColor: theme?.colors.secondaryContainer},
                        label: 'Encontré un animal perdido',
                        labelStyle: { ...styles.labelFab },
                        onPress: () => onPress("NuevoExtraviado"),
                    },
                    {
                        style: { ...styles.fabItem, backgroundColor: theme?.colors.secondaryContainer},
                        icon: 'alert-box',
                        label: 'Mi familiar se perdió',
                        labelStyle: { ...styles.labelFab },
                        onPress: () => onPress("NuevoBuscado"),
                    }
                    ]}
                onStateChange={handleChange}
                fabStyle={{...styles.fab, backgroundColor: open ? theme?.colors.inversePrimary : theme?.colors.primary}}
                style={{...styles.fabGroup}}
                // label='ALERTAR UN CASO'
            />
        </Portal>
    );
}


const styles = StyleSheet.create({
    fab: {
        borderRadius:50,
        justifyContent:'center',
        width: 65,
        height: 65,
        alignItems:'center',
        right: 20,
        bottom: 85,
    },
    labelFab:{
        bottom: 80,
        right: 20,
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

