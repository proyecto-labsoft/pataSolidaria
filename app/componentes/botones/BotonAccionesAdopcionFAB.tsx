import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';

interface Props {
    esCreadorDeLaAdopcion: boolean;
    onPostularse: () => void; 
    onCerrarAdopcion: () => void; 
    showButton?: boolean;
}

export default function BotonAccionesAdopcionFAB({ 
    esCreadorDeLaAdopcion,
    onPostularse,  
    onCerrarAdopcion, 
    showButton = true 
}: Props) {

    const theme = useTheme();
    const [state, setState] = useState({ open: false });

    const handleChange = ({ open }: any) => setState({ open });

    const { open } = state; 

    const botonCerrarAdopcion = {
        icon: 'close-circle',
        style: { ...styles.fabItem, backgroundColor: theme.colors.error },
        label: 'Cerrar adopción',
        labelStyle: { ...styles.labelFab },
        color: theme.colors.onError,
        onPress: onCerrarAdopcion,
    }; 

    const botonPostularse = {
        icon: 'hand-heart',
        style: { ...styles.fabItem, backgroundColor: theme.colors.primary },
        label: 'Postularse',
        labelStyle: { ...styles.labelFab },
        color: theme.colors.onPrimary,
        onPress: onPostularse,
    };

    // Determinar acciones según si es creador o no
    const acciones = esCreadorDeLaAdopcion 
        ? [botonCerrarAdopcion]
        : [botonPostularse];

    return (
        <Portal>
            <FAB.Group
                open={open}
                visible={showButton}
                icon={open ? 'close' : 'dots-vertical'}
                color="white"
                actions={acciones}
                onStateChange={handleChange}
                fabStyle={{ ...styles.fab, backgroundColor: open ? theme.colors.inverseSurface : theme.colors.tertiary }}
                style={{ ...styles.fabGroup }}
            />
        </Portal>
    );
}

const styles = StyleSheet.create({
    fab: {
        borderRadius: 50,
        justifyContent: 'center',
        width: 85,
        height: 85,
        right: 0,
        bottom: 0,
        alignItems: 'center',
    },
    labelFab: {
        marginRight: 8,
    },
    fabItem: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 65,
        height: 65,
        borderRadius: 28,
    },
    fabGroup: {
        padding: 0,
        bottom: 20,
        margin: 0,
        right: 0,
    },
});