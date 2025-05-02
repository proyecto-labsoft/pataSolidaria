import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Controller } from 'react-hook-form';
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

    const mostrarPicker = (onChange) => {
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
                <TextInput
                    style={style}
                    label={label}
                    value={value}
                    onPressIn={() => mostrarPicker(onChange)}
                    showSoftInputOnFocus={false} // evita que se abra el teclado
                    right={<TextInput.Icon icon="clock-outline" />}
                />
            )}
            />
    );
}