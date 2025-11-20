import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import { View, Platform, Pressable } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
type Props = {
    label: string,
    nombre: string,
    style?: object,
    control?: any,
    valorInicial?: any,
}

export default function CampoHora({label,valorInicial,nombre,control,style}: Props) {
    const [hora, setHora] = useState<Date>(valorInicial || new Date());

    const mostrarPicker = (onChange: (value: string) => void) => {
        DateTimePickerAndroid.open({
            value: hora,
            mode: 'time',
            is24Hour: true,
            onChange: (event, selectedDate) => {
            if (selectedDate) {
                setHora(selectedDate);
                onChange(format(selectedDate, 'HH:mm'));
            }
            },
        });
    };

    return (
            <Controller
            control={control}
            name={nombre}
            defaultValue={format(hora, 'HH:mm')}
            render={({ field: { onChange, value } }) => (
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <Pressable onPress={() => mostrarPicker(onChange)} style={{ alignItems: 'center', width: '100%' }}>
                        <TextInput
                            style={{ 
                                width: '90%', 
                                backgroundColor: 'transparent',
                                ...style 
                            }}
                            mode='outlined'
                            label={label}
                            value={value}
                            onPressIn={() => mostrarPicker(onChange)}
                            showSoftInputOnFocus={false} // evita que se abra el teclado
                            editable={false}
                            right={
                                <TextInput.Icon 
                                    onPress={() => mostrarPicker(onChange)} 
                                    icon="clock-outline" 
                                    size={20} 
                                />
                            }
                        />
                    </Pressable>
                </View>
            )}
            />
    );
}