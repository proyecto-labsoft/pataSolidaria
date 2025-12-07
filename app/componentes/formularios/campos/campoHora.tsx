import React, { useState } from 'react';
import { TextInput, useTheme, Text } from 'react-native-paper';
import { Controller, useWatch } from 'react-hook-form';
import { View, Platform, Pressable, Alert } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format, parse } from 'date-fns';
import { obtenerFechaHoraActualBuenosAires } from '@/app/utiles/fechaHoraBuenosAires';

type Props = {
    label: string,
    nombre: string,
    style?: object,
    control?: any,
    valorInicial?: any,
    disableFutureTimes?: boolean,
    dateFieldName?: string,
}

export default function CampoHora({
    label,
    valorInicial,
    nombre,
    control,
    style,
    disableFutureTimes = false,
    dateFieldName = 'fecha',
}: Props) {
    const [hora, setHora] = useState<Date>(valorInicial || obtenerFechaHoraActualBuenosAires());
    const theme = useTheme();

    // Observar el campo de fecha (siempre llamar al hook)
    const watchedDate = useWatch({ control, name: dateFieldName, defaultValue: '' });

    const mostrarPicker = (onChange: (value: string) => void) => {
        DateTimePickerAndroid.open({
            value: hora,
            mode: 'time',
            is24Hour: true,
            onChange: (event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                    // Validar si la hora es futura
                    if (disableFutureTimes && watchedDate) {
                        const selectedDateParsed = parse(watchedDate, 'dd-MM-yyyy', new Date());
                        const now = obtenerFechaHoraActualBuenosAires();
                        
                        // Si la fecha seleccionada es hoy
                        if (format(selectedDateParsed, 'dd-MM-yyyy') === format(now, 'dd-MM-yyyy')) {
                            const selectedDateTime = new Date(
                                selectedDateParsed.getFullYear(),
                                selectedDateParsed.getMonth(),
                                selectedDateParsed.getDate(),
                                selectedDate.getHours(),
                                selectedDate.getMinutes()
                            );
                            
                            // Si la hora seleccionada es mayor que la actual
                            if (selectedDateTime > now) {
                                Alert.alert(
                                    'Hora inválida',
                                    'No puede seleccionar una hora futura',
                                    [{ text: 'OK' }]
                                );
                                return;
                            }
                        }
                    }
                    
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
            rules={{
                validate: (value) => {
                    if (disableFutureTimes && value && watchedDate) {
                        const selectedDateParsed = parse(watchedDate, 'dd-MM-yyyy', new Date());
                        const now = obtenerFechaHoraActualBuenosAires();
                        
                        // Si la fecha seleccionada es hoy
                        if (format(selectedDateParsed, 'dd-MM-yyyy') === format(now, 'dd-MM-yyyy')) {
                            const timeParts = value.split(':');
                            const selectedDateTime = new Date(
                                selectedDateParsed.getFullYear(),
                                selectedDateParsed.getMonth(),
                                selectedDateParsed.getDate(),
                                parseInt(timeParts[0]),
                                parseInt(timeParts[1])
                            );
                            
                            if (selectedDateTime > now) {
                                return 'No puede seleccionar una hora futura';
                            }
                        }
                    }
                    return true;
                }
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                            error={!!error}
                            right={
                                <TextInput.Icon 
                                    onPress={() => mostrarPicker(onChange)} 
                                    icon="clock-outline" 
                                    size={20} 
                                />
                            }
                        />
                    </Pressable>
                    {error && (
                        <Text style={{ 
                            color: theme.colors.error, 
                            fontSize: 12, 
                            alignSelf: 'flex-start', 
                            marginLeft: '5%',
                            marginTop: 4
                        }}>
                            {error.message}
                        </Text>
                    )}
                </View>
            )}
            />
    );
}