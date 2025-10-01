import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { 
    TextInput, 
    Modal, 
    Portal, 
    Button, 
    useTheme, 
    Text, 
    Divider,
    Searchbar 
} from 'react-native-paper';

type Props = {
    label: string,
    nombre: string,
    style?: object,
    opciones: string[],
    control?: any,
    placeholder?: string,
    searchable?: boolean,
}

export default function CampoSelectorModal({
    opciones, 
    label, 
    nombre, 
    control, 
    style,
    placeholder = 'Seleccione una opción',
    searchable = false
}: Props) {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const showModal = () => setVisible(true);
    const hideModal = () => {
        setVisible(false);
        setSearchQuery('');
    };

    const filteredOptions = searchable 
        ? opciones.filter(option => 
            option.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : opciones;

    return (
        <Controller 
            name={nombre}
            control={control}
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                <View style={{ width: '100%', alignItems: 'center' }}>
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
                        right={
                            <TextInput.Icon 
                                onPress={showModal} 
                                icon="chevron-down" 
                                size={20} 
                            />
                        }
                    />
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

                    <Portal>
                        <Modal 
                            visible={visible} 
                            onDismiss={hideModal}
                            contentContainerStyle={{
                                backgroundColor: theme.colors.surface,
                                margin: 20,
                                borderRadius: 8,
                                padding: 20,
                                maxHeight: '70%',
                            }}
                        >
                            <Text variant="titleLarge" style={{ marginBottom: 16 }}>
                                {label}
                            </Text>
                            
                            {searchable && (
                                <Searchbar
                                    placeholder="Buscar..."
                                    onChangeText={setSearchQuery}
                                    value={searchQuery}
                                    style={{ marginBottom: 16 }}
                                />
                            )}

                            <FlatList
                                data={filteredOptions}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            onChange(item);
                                            hideModal();
                                        }}
                                        style={{
                                            backgroundColor: value === item ? 
                                                theme.colors.primaryContainer : 
                                                'transparent',
                                            borderRadius: 4,
                                        }}
                                    >
                                        <Text style={{
                                            padding: 16,
                                            color: value === item ? 
                                                theme.colors.onPrimaryContainer : 
                                                theme.colors.onSurface
                                        }}>
                                            {item}
                                        </Text>
                                        {index < filteredOptions.length - 1 && <Divider />}
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => `${item}-${index}`}
                                showsVerticalScrollIndicator={false}
                            />

                            <Button 
                                mode="outlined" 
                                onPress={hideModal}
                                style={{ marginTop: 16 }}
                            >
                                Cancelar
                            </Button>
                        </Modal>
                    </Portal>
                </View>
            )}
        />
    );
}