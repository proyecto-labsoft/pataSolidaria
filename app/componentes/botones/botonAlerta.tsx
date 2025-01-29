import { useNavigation } from "@react-navigation/native";
import {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal ,useTheme} from 'react-native-paper';
interface Props {
    onPress: any
    showButton: boolean
}
export default function BotonAlerta ({onPress,showButton} : Props) {
    const [state, setState] = useState({ open: false });
    
    const theme = useTheme()
    const navigation = useNavigation(); 

    const handleChange = ({ open } ) => setState({ open });

    const { open } = state;

    return (
    
        <Portal>
        <FAB.Group
            open={open}
            visible={showButton}
            icon={open ? 'arrow-up-bold-outline' : 'alert'}
            color={theme?.colors.onSecondaryContainer}
            actions={[
                {
                    icon: 'eye-outline',
                    style: { ...styles.fabItem, backgroundColor: theme?.colors.secondaryContainer},
                    label: 'Encontré un animal perdido',
                    labelStyle: { ...styles.fabItem },
                    onPress: () => onPress("Encontrado"),
                },
                {
                    style: { ...styles.fabItem, backgroundColor: theme?.colors.secondaryContainer},
                    icon: 'alert-box',
                    label: 'Mi animal se extravió',
                    labelStyle: { ...styles.fabItem },
                    onPress: () => onPress("Extravio"),
                }
                ]}
            onStateChange={handleChange}
            fabStyle={{...styles.fab, backgroundColor: open ? theme?.colors.inversePrimary : theme?.colors.primaryContainer}}
            style={styles.fabGroup}
            variant='secondary'
        />
        </Portal>
    );
}


const styles = StyleSheet.create({
    fab: {
        // sposition: 'absolute',
        right: 0,
        bottom: 85,
    },
    fabItem:{
        bottom: 75,
    },
    fabGroup:{
        right: 0,
        
        bottom: 0,
    }
})
