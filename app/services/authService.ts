import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Registra un nuevo usuario con email y contraseña
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> => {
  try {
    console.log('📝 Intentando registrar usuario:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Usuario creado exitosamente:', userCredential.user.email);
    
    // Actualizar el perfil con el nombre
    await updateProfile(userCredential.user, { displayName });
    console.log('✅ Perfil actualizado con nombre:', displayName);
    
    // Guardar el token en AsyncStorage
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('userToken', token);
    
    // Sincronizar usuario con el backend
    await syncUserWithBackend(userCredential.user, token);
    
    // CRÍTICO: Forzar refresh del token para obtener los custom claims
    // que el backend acaba de establecer
    console.log('🔄 Refrescando token para obtener custom claims...');
    const newToken = await userCredential.user.getIdToken(true); // true = force refresh
    await AsyncStorage.setItem('userToken', newToken);
    console.log('✅ Token refrescado con custom claims');
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    const authError = error as AuthError;
    console.error('❌ Error de registro:', authError.code, authError.message);
    return {
      success: false,
      error: getAuthErrorMessage(authError.code)
    };
  }
};

/**
 * Inicia sesión con email y contraseña
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    console.log('🔐 Intentando login con:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login exitoso para:', userCredential.user.email);
    
    // Guardar el token en AsyncStorage
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('userToken', token);
    
    // NO es necesario sincronizar en login - los custom claims ya están establecidos desde el registro
    // Solo se sincroniza en el registro para crear el usuario en BD y establecer claims
    await syncUserWithBackend(userCredential.user, token);
    
    // Refrescar token para asegurar que tenemos los custom claims más recientes
    console.log('🔄 Refrescando token para obtener custom claims actualizados...');
    const newToken = await userCredential.user.getIdToken(true); // true = force refresh
    await AsyncStorage.setItem('userToken', newToken);
    console.log('✅ Token refrescado');
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    const authError = error as AuthError;
    console.error('❌ Error de login:', authError.code, authError.message);
    return {
      success: false,
      error: getAuthErrorMessage(authError.code)
    };
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logoutUser = async (): Promise<AuthResult> => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('userToken');
    
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return {
      success: false,
      error: getAuthErrorMessage(authError.code)
    };
  }
};

/**
 * Envía un correo para restablecer la contraseña
 */
export const resetPassword = async (email: string): Promise<AuthResult> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return {
      success: false,
      error: getAuthErrorMessage(authError.code)
    };
  }
};

/**
 * Obtiene el token actual del usuario
 */
export const getCurrentUserToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Sincroniza el usuario con el backend
 */
import { API_URL } from '../api/api.rutas';

const syncUserWithBackend = async (user: User, token: string): Promise<void> => {
  try {
    
    console.log('🔄 Sincronizando usuario con el backend:', user.email);
    
    const response = await fetch(`${API_URL}/usuarios/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: user.email,
        displayName: user.displayName || 'Usuario',
      }),
    });
    
    if (response.ok) {
      console.log('✅ Usuario sincronizado con el backend');
    } else {
      const errorText = await response.text();
      console.error('❌ Error al sincronizar usuario con backend:', response.status, errorText);
    }
  } catch (error) {
    console.error('❌ Error de conexión al sincronizar usuario:', error);
  }
};

/**
 * Convierte códigos de error de Firebase a mensajes legibles
 */
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'El correo electrónico ya está registrado',
    'auth/invalid-email': 'El correo electrónico no es válido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/user-disabled': 'El usuario ha sido deshabilitado',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
  };

  return errorMessages[errorCode] || 'Error desconocido. Intenta nuevamente';
};
