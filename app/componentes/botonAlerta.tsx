import { useNavigation } from "@react-navigation/native";
import {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, PaperProvider } from 'react-native-paper';
interface Props {
    tipo: string
}
export default function BotonAlerta ({tipo} : Props) {
    const [state, setState] = useState({ open: false });
    // const [visible, setVisible] = useState(true);
    // const navigation = useNavigation();

    // useEffect(() => {
    //     console.log(navigation)
    //     if(navigation.getState()?.index === 0){
    //         setVisible(true)
    //     }else{
    //         setVisible(false)
    //     }
    // },[navigation])
    
    const handleChange = ({ open } ) => setState({ open });

    const { open } = state;

    return (
    
        <Portal>
        <FAB.Group
            open={open}
            visible={false}
            icon={open ? 'alert' : 'alert'}
            actions={[
                {
                    icon: 'star',
                    style: { ...styles.fabItem },
                    label: 'No familiar',
                    labelStyle: { ...styles.fabItem },
                    onPress: () => console.log('Pressed star'),
                },
                {
                    style: { ...styles.fabItem },
                    icon: 'email',
                    label: 'Familiar',
                    labelStyle: { ...styles.fabItem },
                    onPress: () => console.log('Pressed email'),
                }
                ]}
            onStateChange={handleChange}
            fabStyle={styles.fab}
            style={styles.fabGroup}
            variant='secondary'
            onPress={() => {
            if (open) {
                // do something if the speed dial is open
            }
            }}
        />
        </Portal>
    );
}


const styles = StyleSheet.create({
    fab: {
        // position: 'absolute',
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
