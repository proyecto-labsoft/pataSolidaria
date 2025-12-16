import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, HelperText, useTheme } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext'; 
import LogoPataIcon from '../componentes/iconos/LogoPataIcon';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const { login, sendPasswordReset } = useAuth();

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // La navegación se maneja automáticamente por el AuthNavigator
        // cuando cambia el estado de autenticación
      } else {
        Alert.alert('Error de inicio de sesión', result.error || 'No se pudo iniciar sesión');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    Alert.alert(
      'Recuperar contraseña',
      `¿Enviar correo de recuperación a ${email}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async () => {
            setLoading(true);
            const result = await sendPasswordReset(email);
            setLoading(false);

            if (result.success) {
              Alert.alert(
                'Correo enviado',
                'Revisa tu correo electrónico para restablecer tu contraseña'
              );
            } else {
              Alert.alert('Error', result.error || 'No se pudo enviar el correo');
            }
          },
        },
      ]
    );
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const theme = useTheme()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={{ alignItems: 'center', marginBottom: 16 }}> 
              <LogoPataIcon height={200} width={200} />
            </View> 
            
            <Text variant="headlineMedium" style={styles.title}>
              ¡Bienvenido!
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Inicia sesión para continuar
            </Text>

            <TextInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              style={styles.input}
              disabled={loading}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              error={!!errors.password}
              style={styles.input}
              disabled={loading}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Iniciar Sesión
            </Button>

            <Button
              mode="text"
              onPress={handleForgotPassword}
              disabled={loading}
              style={styles.forgotButton}
              compact
            >
              ¿Olvidaste tu contraseña?
            </Button>

            <View style={styles.registerContainer}>
              <Text>¿No tienes cuenta? </Text>
              <Button
                mode="text"
                onPress={handleRegister}
                disabled={loading}
                compact
              >
                Regístrate
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  forgotButton: {
    marginTop: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});
