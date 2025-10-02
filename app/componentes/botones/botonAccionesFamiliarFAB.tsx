import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';

interface Props {
    onEditarDatos: () => void;
    onEliminarFamiliar: () => void;
    onDeclaraPerdido: () => void;
    showButton?: boolean;
}

export default function BotonAccionesFamiliarFAB({ 
    onEditarDatos, 
    onEliminarFamiliar, 
    onDeclaraPerdido,
    showButton = true 
}: Props) {
    const theme = useTheme();
    const [state, setState] = useState({ open: false });

    const handleChange = ({ open }: any) => setState({ open });

    const { open } = state;

    return (
        <Portal>
            <FAB.Group
                open={open}
                visible={showButton}
                icon={open ? 'close' : 'menu'}
                color="white"
                actions={[
                    {
                        icon: 'alert-octagon',
                        style: { ...styles.fabItem, backgroundColor: theme.colors.secondaryContainer },
                        label: 'Declarar perdido',
                        labelStyle: { ...styles.labelFab },
                        color: theme.colors.onSecondaryContainer,
                        onPress: onDeclaraPerdido,
                    },
                    {
                        icon: 'delete',
                        style: { ...styles.fabItem, backgroundColor: theme.colors.errorContainer },
                        label: 'Eliminar familiar',
                        labelStyle: { ...styles.labelFab },
                        color: theme.colors.onErrorContainer,
                        onPress: onEliminarFamiliar,
                    },
                    {
                        icon: 'pencil',
                        style: { ...styles.fabItem, backgroundColor: theme.colors.primaryContainer },
                        label: 'Editar datos',
                        labelStyle: { ...styles.labelFab },
                        color: theme.colors.onPrimaryContainer,
                        onPress: onEditarDatos,
                    },
                ]}
                onStateChange={handleChange}
                fabStyle={{ ...styles.fab, backgroundColor: open ? theme.colors.inversePrimary : theme.colors.primary }}
                style={{ ...styles.fabGroup }}
            />
        </Portal>
    );
}

const styles = StyleSheet.create({
    fab: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelFab: {
        marginRight: 8,
    },
    fabItem: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    fabGroup: {
        paddingBottom: 16,
    }
});
