import { useState} from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Icon, Portal ,useTheme} from 'react-native-paper'; 
interface Props {
    onPress: any
    showButton: boolean
}
export default function BotonAdopciones({onPress,showButton} : Props) {
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
                        label: 'Agregar nueva adopción',
                        labelStyle: { ...styles.labelFab },
                        onPress: () => onPress("NuevaAdopcion", { esTransito: false }),
                    },
                    {
                        icon: () => <Icon source='plus' size={26} color={theme.colors.onTertiaryContainer} />,
                        style: { ...styles.fabItem, backgroundColor: theme?.colors.tertiary},
                        label: 'Agregar nuevo tránsito',
                        labelStyle: { ...styles.labelFab },
                        onPress: () => onPress("NuevaAdopcion", { esTransito: true }),
                    },
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

