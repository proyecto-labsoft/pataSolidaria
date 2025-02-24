import React, { useState, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Divider, TextInput, useTheme } from 'react-native-paper';
type Props = {
    label: string,
    nombre: string,
    style?: object,
    opciones: string[],
    control?: any,
}
export default function CampoSelector({opciones,label,nombre,control,style} : Props) {
    const theme = useTheme()
    const [userinput, setUserinput] = useState("");
    const [show, setShow] = useState(false);
    
    const openPicker = useCallback(
        () => {
            // Keyboard.dismiss()
            setShow(!show)
        },
    [show]
    );

    const hidePicker = useCallback(
    (item) => {
        setShow(false)
        setUserinput(item)
    },
    []
    );

    return(
        <Controller 
            name={nombre}
            control={control}
            render={({field: {onChange,value, onBlur}} ) => (
                <View
                    style={{
                    flexDirection: 'row',
                    }}>
                    <View style={{width:'100%',alignItems:'center'}}>
                    <TextInput
                        mode='outlined'
                        label={label}
                        editable={false}
                        placeholder={show ?'' :'No hay una opción seleccionada'}
                        value={userinput}
                        style={{ width:'90%',backgroundColor:'transparent',...style}}
                        onChangeText={(text) => onChange(text)}
                        onChange={(text) => onChange(text)}
                        right={<TextInput.Icon onPress={openPicker} icon="chevron-down" size={20} />}
                    />
                    {show ?
                        <FlatList
                        style={{ backgroundColor: theme.colors.surface,elevation:1, zIndex: 22, width: '90%', marginTop:56, position: 'absolute' }}
                        data={opciones}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                            onPress={() => hidePicker(item)}>
                                <Divider />
                                <Text style={{padding:8,color:theme.colors.onSurface}}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item}
                        />
                        : null}
                    </View>
                </View>
            )}
        />
    )
}