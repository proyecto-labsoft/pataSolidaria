import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, Platform, Pressable } from 'react-native';
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

export default function CampoFecha({
    label, 
    nombre, 
    control, 
    style,
    placeholder = 'Seleccione una fecha',
    maximumDate,
    minimumDate
}: Props) {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date());

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    // Función para formatear fecha a dd/MM/yyyy
    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Función para parsear fecha desde dd/MM/yyyy
    const parseDate = (dateString: string): Date | null => {
        if (!dateString) return null;
        const parts = dateString.split('-');
        if (parts.length !== 3) return null;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Los meses en JS son 0-indexados
        const year = parseInt(parts[2], 10);
        
        const date = new Date(year, month, day);
        return isNaN(date.getTime()) ? null : date;
    };

    const onDateChange = (event: any, selectedDate?: Date, onChange?: (value: string) => void) => {
        if (Platform.OS === 'android') {
            setVisible(false);
        }
        
        if (selectedDate && onChange) {
            setTempDate(selectedDate);
            if (Platform.OS === 'android') {
                onChange(formatDate(selectedDate));
            }
        }
    };

    const confirmDate = (onChange: (value: string) => void) => {
        onChange(formatDate(tempDate));
        hideModal();
    };

    return (
        <Controller 
            name={nombre}
            control={control}
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => {
                const currentDate = value ? parseDate(value) || new Date() : new Date();
                
                return (
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Pressable onPress={showModal} style={{ alignItems: 'center', width: '100%' }}>
                            <TextInput
                                mode='outlined'
                                label={label}
                                showSoftInputOnFocus={false} // evita que se abra el teclado
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
                                onPressIn={() => showModal()}
                                right={
                                    <TextInput.Icon 
                                        onPress={showModal} 
                                        icon="calendar" 
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
                                        {label}
                                    </Text>
                                    
                                    <DateTimePicker
                                        value={tempDate}
                                        mode="date"
                                        display="spinner"
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) {
                                                setTempDate(selectedDate);
                                            }
                                        }}
                                        maximumDate={maximumDate}
                                        minimumDate={minimumDate}
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
                                        <Button 
                                            mode="contained" 
                                            onPress={() => confirmDate(onChange)}
                                            style={{ flex: 1, marginLeft: 8 }}
                                        >
                                            Confirmar
                                        </Button>
                                    </View>
                                </Modal>
                            </Portal>
                        ) : (
                            visible && (
                                <DateTimePicker
                                    value={currentDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => onDateChange(event, selectedDate, onChange)}
                                    maximumDate={maximumDate}
                                    minimumDate={minimumDate}
                                />
                            )
                        )}
                    </View>
                );
            }}
        />
    );
}