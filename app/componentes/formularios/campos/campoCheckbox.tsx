import React from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { Checkbox, Text, useTheme } from 'react-native-paper';

type Props = {
    label: string,
    nombre: string,
    control?: any,
    style?: object,
    disabled?: boolean,
    description?: string,
}

export default function CampoCheckbox({
    label,
    nombre,
    control,
    style,
    disabled = false,
    description
}: Props) {
    const theme = useTheme();

    return (
        <Controller 
            name={nombre}
            defaultValue={false}
            control={control}
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                <View style={{ 
                    width: '100%', 
                    alignItems: 'center',
                    marginVertical: 8,
                    ...style 
                }}>
                    <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center',
                        width: '90%',
                        paddingVertical: 8
                    }}>
                        <Checkbox
                            status={value ? 'checked' : 'unchecked'}
                            onPress={() => onChange(!value)}
                            disabled={disabled}
                            uncheckedColor={theme.colors.outline}
                            color={theme.colors.primary}
                        />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text 
                                variant="bodyLarge"
                                style={{ 
                                    color: disabled ? 
                                        theme.colors.onSurfaceDisabled : 
                                        theme.colors.onSurface,
                                    flexWrap: 'wrap'
                                }}
                                onPress={() => !disabled && onChange(!value)}
                            >
                                {label}
                            </Text>
                            {description && (
                                <Text 
                                    variant="bodySmall"
                                    style={{ 
                                        color: theme.colors.onSurfaceVariant,
                                        marginTop: 2,
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    {description}
                                </Text>
                            )}
                        </View>
                    </View>
                    {error && (
                        <Text style={{ 
                            color: theme.colors.error, 
                            fontSize: 12, 
                            alignSelf: 'flex-start', 
                            marginLeft: '10%',
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