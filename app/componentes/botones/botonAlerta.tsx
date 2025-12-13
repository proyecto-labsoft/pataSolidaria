import { useState} from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal ,useTheme} from 'react-native-paper';
import PawPrintIcon from '../iconos/PawPrintIcon';
import SearchMapIcon from '../iconos/SearchMapIcon';
import FluentMegaphoneIcon from '../iconos/FluentMegaphoneIcon';

interface Props {
    onPress: any
    showButton: boolean
}
export default function BotonAlerta ({onPress,showButton} : Props) {
    
    const [state, setState] = useState({ open: false });
    
    const theme = useTheme()

    const handleChange = ({ open }:any ) => setState({ open });

    const { open } = state;

    return (
    
        <Portal>
            <FAB.Group
                open={open}
                visible={showButton}
                icon={open ? 'close' : () => <FluentMegaphoneIcon styles={{ right: 5, bottom: 5 }} width={32} height={32} color={theme.colors.onTertiary} />}
                color="white"
                actions={[
                    {
                        icon: () => <SearchMapIcon width={32} height={32} color={theme?.colors.onSecondaryContainer} />,
                        style: { ...styles.fabItem, backgroundColor: theme?.colors.secondary},
                        label: 'Encontré un animal perdido',
                        labelStyle: { ...styles.labelFab },
                        onPress: () => onPress("NuevoExtraviado"),
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
                fabStyle={{...styles.fab, paddingRight:  0  ,paddingBottom:  0  , backgroundColor: open ? theme.colors.inverseSurface : theme.colors.error }}
                style={{...styles.fabGroup}}
            />
        </Portal>
    );
}


const styles = StyleSheet.create({
    fab: {
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        width: 85,
        height: 85,
        right: 10,
        bottom: 60,
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

