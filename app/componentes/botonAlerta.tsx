import { createNavigationContainerRef, useNavigation } from "@react-navigation/native";
import {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, PaperProvider } from 'react-native-paper';
interface Props {
    onPress: any
    showButton: boolean
}
export default function BotonAlerta ({onPress,showButton} : Props) {
    const [state, setState] = useState({ open: false });
    
    const navigation = useNavigation(); 

    const handleChange = ({ open } ) => setState({ open });

    const { open } = state;

    return (
    
        <Portal>
        <FAB.Group
            open={open}
            visible={showButton}
            icon={open ? 'arrow-up-bold-outline' : 'alert'}
            actions={[
                {
                    icon: 'eye-outline',
                    style: { ...styles.fabItem, backgroundColor: "green"},
                    label: 'Encontré un animal perdido',
                    labelStyle: { ...styles.fabItem },
                    onPress: () => onPress("Encontrado"),
                    // onPress: () => {if (navigationRef.isReady()) (navigationRef.navigate("Encontrado"))},
                },
                {
                    style: { ...styles.fabItem, backgroundColor: "red" },
                    icon: 'alert-box',
                    label: 'Mi animal se extravió',
                    labelStyle: { ...styles.fabItem },
                    onPress: () => onPress("Extravio"),
                    // onPress: () => navigation.navigate("Extravio"),
                }
                ]}
            onStateChange={handleChange}
            fabStyle={styles.fab}
            style={styles.fabGroup}
            variant='secondary'
            // onPress={() => {
            // if (open) {
            //     // do something if the speed dial is open
            // }
            // }}
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
