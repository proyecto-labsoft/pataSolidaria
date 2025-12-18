import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';

interface Props {
    esCreadorDelExtravio: boolean;
    onResolverCaso: () => void; 
    onViEsteAnimal: () => void;
    onPostularseComoTutor?: () => void;
    showButton?: boolean;
    esFamiliar?: boolean; 
}

export default function BotonAccionesExtravioFAB({ 
    esCreadorDelExtravio,
    esFamiliar, 
    onResolverCaso,  
    onViEsteAnimal,
    onPostularseComoTutor,
    showButton = true 
}: Props) {

    const theme = useTheme();
    const [state, setState] = useState({ open: false });

    const handleChange = ({ open }: any) => setState({ open });

    const { open } = state; 

    const botonResolverCaso = {
        icon: 'check-circle',
        style: { ...styles.fabItem, backgroundColor: theme.colors.primary },
        label: 'Resolver caso',
        labelStyle: { ...styles.labelFab },
        color: theme.colors.onPrimary,
        onPress: onResolverCaso,
    }; 

    const botonViEsteAnimal = {
        icon: 'eye-plus-outline',
        style: { ...styles.fabItem, backgroundColor: theme.colors.primary },
        label: '¡Ví este animal!',
        labelStyle: { ...styles.labelFab },
        color: theme.colors.onPrimary,
        onPress: onViEsteAnimal,
    };

    const botonPostularseComoTutor = {
        icon: 'hand-heart',
        style: { ...styles.fabItem, backgroundColor: theme.colors.secondary },
        label: 'Postularme como tutor',
        labelStyle: { ...styles.labelFab },
        color: theme.colors.onSecondary,
        onPress: onPostularseComoTutor,
    };

    // Determinar acciones según las condiciones
    let acciones = [];

    if (esFamiliar && esCreadorDelExtravio) {
        // Si es familiar Y creador del extravío
        acciones = [botonResolverCaso ];
    } else if (!esFamiliar && esCreadorDelExtravio) {
        // Si NO es familiar Y es creador del caso
        acciones = [botonResolverCaso, botonViEsteAnimal];
    } else if (!esFamiliar && !esCreadorDelExtravio) {
        // Si NO es familiar Y NO es creador del caso
        acciones = onPostularseComoTutor 
            ? [botonViEsteAnimal, botonPostularseComoTutor]
            : [botonViEsteAnimal];
    } else {
        // Caso por defecto
        acciones = [botonViEsteAnimal];
    }

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
    }
});
