import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, Platform, TouchableOpacity } from 'react-native';
import { 
    TextInput, 
    Modal, 
    Portal, 
    Button, 
    useTheme, 
    Text 
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
    label: string,
    nombre: string,
    style?: object,
    control?: any,
    placeholder?: string,
    maximumDate?: Date,
    minimumDate?: Date,
}

export default function CampoFechaHora({
    label, 
    nombre, 
    control, 
    style,
    placeholder = 'Seleccione fecha y hora',
    maximumDate,
    minimumDate
}: Props) {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const [cancelled, setCancelled] = useState(false);

    const showPicker = () => {
        setMode('date');
        setVisible(true);
        setCancelled(false);
    };

    const hideModal = () => {
        setCancelled(true);
        setVisible(false);
    };

    // Función para formatear fecha y hora a dd-MM-yyyy hh:mm
    const formatDateTime = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    // Función para parsear fecha desde dd-MM-yyyy hh:mm
    const parseDateTime = (dateTimeString: string): Date | null => {
        if (!dateTimeString) return null;
        
        const parts = dateTimeString.split(' ');
        if (parts.length !== 2) return null;
        
        const [datePart, timePart] = parts;
        const dateParts = datePart.split('-');
        const timeParts = timePart.split(':');
        
        if (dateParts.length !== 3 || timeParts.length !== 2) return null;
        
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Los meses en JS son 0-indexados
        const year = parseInt(dateParts[2], 10);
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        
        const date = new Date(year, month, day, hours, minutes);
        return isNaN(date.getTime()) ? null : date;
    };

    const onDateTimeChange = (event: any, selectedDate?: Date, onChange?: (value: string) => void) => {
        const eventType = event?.type;
        
        if (Platform.OS === 'android') {
            setVisible(false);
            
            // Si el usuario canceló (dismissed o set sin fecha), no hacer nada
            if (eventType === 'dismissed' || !selectedDate) {
                setCancelled(true);
                return;
            }
        }
        
        if (selectedDate) {
            setTempDate(selectedDate);
            
            if (Platform.OS === 'android') {
                // En Android, después de seleccionar fecha, mostrar selector de hora
                if (mode === 'date' && eventType === 'set') {
                    setTimeout(() => {
                        setMode('time');
                        setVisible(true);
                        setCancelled(false);
                    }, 100);
                } else if (mode === 'time' && eventType === 'set' && onChange) {
                    // Después de seleccionar hora, confirmar
                    onChange(formatDateTime(selectedDate));
                    setCancelled(false);
                }
            }
        }
    };

    const confirmDateTime = (onChange: (value: string) => void) => {
        if (!cancelled) {
            onChange(formatDateTime(tempDate));
        }
        setVisible(false);
        setCancelled(false);
    };

    return (
        <Controller 
            name={nombre}
            control={control}
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => {
                const currentDateTime = value ? parseDateTime(value) || new Date() : new Date();
                
                return (
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity 
                            onPress={showPicker}
                            activeOpacity={0.7}
                            style={{ width: '100%', alignItems: 'center' }}
                        >
                            <TextInput
                                mode='outlined'
                                label={label}
                                editable={false}
                                placeholder={placeholder}
                                value={value || ''}
                                style={{ 
                                    width: '90%', 
                                    backgroundColor: 'transparent',
                                    ...style 
                                }}
                                onBlur={onBlur}
                                error={!!error}
                                pointerEvents="none"
                                right={
                                    <TextInput.Icon 
                                        icon="calendar-clock" 
                                        size={20} 
                                    />
                                }
                            />
                        </TouchableOpacity>
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

                        {Platform.OS === 'ios' ? (
                            <Portal>
                                <Modal 
                                    visible={visible} 
                                    onDismiss={hideModal}
                                    contentContainerStyle={{
                                        backgroundColor: theme.colors.surface,
                                        margin: 20,
                                        borderRadius: 8,
                                        padding: 20,
                                    }}
                                >
                                    <Text variant="titleLarge" style={{ marginBottom: 16, textAlign: 'center' }}>
                                        {mode === 'date' ? 'Seleccionar fecha' : 'Seleccionar hora'}
                                    </Text>
                                    
                                    <DateTimePicker
                                        value={tempDate}
                                        mode={mode}
                                        display="spinner"
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) {
                                                setTempDate(selectedDate);
                                            }
                                        }}
                                        maximumDate={mode === 'date' ? maximumDate : undefined}
                                        minimumDate={mode === 'date' ? minimumDate : undefined}
                                        style={{
                                            backgroundColor: 'transparent',
                                        }}
                                    />

                                    <View style={{ 
                                        flexDirection: 'row', 
                                        justifyContent: 'space-around',
                                        marginTop: 20 
                                    }}>
                                        <Button 
                                            mode="outlined" 
                                            onPress={hideModal}
                                            style={{ flex: 1, marginRight: 8 }}
                                        >
                                            Cancelar
                                        </Button>
                                        {mode === 'date' ? (
                                            <Button 
                                                mode="contained" 
                                                onPress={() => {
                                                    setCancelled(false);
                                                    setMode('time');
                                                }}
                                                style={{ flex: 1, marginLeft: 8 }}
                                            >
                                                Siguiente
                                            </Button>
                                        ) : (
                                            <Button 
                                                mode="contained" 
                                                onPress={() => confirmDateTime(onChange)}
                                                style={{ flex: 1, marginLeft: 8 }}
                                            >
                                                Confirmar
                                            </Button>
                                        )}
                                    </View>
                                </Modal>
                            </Portal>
                        ) : (
                            visible && (
                                <DateTimePicker
                                    value={currentDateTime}
                                    mode={mode}
                                    display="default"
                                    onChange={(event, selectedDate) => onDateTimeChange(event, selectedDate, onChange)}
                                    maximumDate={mode === 'date' ? maximumDate : undefined}
                                    minimumDate={mode === 'date' ? minimumDate : undefined}
                                />
                            )
                        )}
                    </View>
                );
            }}
        />
    );
}