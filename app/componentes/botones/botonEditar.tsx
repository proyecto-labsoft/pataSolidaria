import { useNavigation } from "@react-navigation/native";
import { useState} from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
interface Props {
    onPress: any
    showButton: boolean
}
export default function BotonEditar({onPress,showButton} : Props) {
    const [state, setState] = useState({ open: false });
    
    const navigation = useNavigation(); 

    const handleChange = ({ open } ) => setState({ open });

    const { open } = state;

    return (
    
        <FAB
            icon="pencil"
            label="Editar datos"
            style={styles.fab}
            visible={showButton}
            size="large"
            onPress={() => onPress(state)}
        />
    );
}


const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        
        margin: "5%",
        right: 0,
        bottom: 0,
    },
    fabItem:{
        bottom: 75,
    },
    fabGroup:{
        right: 0,
        
        bottom: 0,
    }
})
