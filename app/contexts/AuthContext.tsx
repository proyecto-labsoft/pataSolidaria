import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword,
  getCurrentUserToken 
} from '../services/authService';
import {
  registerForPushNotificationsAsync,
  sendPushTokenToBackend,
  removePushTokenFromBackend
} from '../services/notificationService';

interface UserProfile {
  nombre: string;
  email: string;
  celular: string;
  direccion: string;
  firebaseUid: string;
  notificacionesHabilitadas: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  pushToken: string | null;
  userProfile: UserProfile | null;
  register: (email: string, password: string, displayName: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  sendPasswordReset: (email: string) => Promise<any>;
  getToken: () => Promise<string | null>;
  refreshPushToken: () => Promise<void>;
  loadUserProfile: () => Promise<UserProfile | null>;
  updateUserProfile: (nombre: string, celular: string, direccion: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  pushToken: null,
  userProfile: null,
  register: async () => ({ success: false }),
  login: async () => ({ success: false }),
  logout: async () => ({ success: false }),
  sendPasswordReset: async () => ({ success: false }),
  getToken: async () => null,
  refreshPushToken: async () => {},
  loadUserProfile: async () => null,
  updateUserProfile: async () => false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Configuración del backend - TODO: Mover a archivo de configuración
  const API_URL = 'http://192.168.49.54:8083'; // Cambia esto a tu URL de backend

  /**
   * Registra el dispositivo para notificaciones y envía el token al backend
   */
  const registerAndSendPushToken = async (currentUser: User) => {
    try {
      console.log('📱 Registrando dispositivo para notificaciones push...');
      
      // Obtener el push token del dispositivo
      const token = await registerForPushNotificationsAsync();
      
      if (token) {
        console.log('✅ Push token obtenido:', token.substring(0, 50) + '...');
        setPushToken(token);
        
        // Obtener el JWT token del usuario
        const userToken = await getCurrentUserToken();
        
        if (userToken) {
          console.log('📤 Enviando push token al backend...');
          const success = await sendPushTokenToBackend(token, userToken, API_URL);
          
          if (success) {
            console.log('✅ Push token guardado en el backend para:', currentUser.email);
          } else {
            console.error('❌ Error al guardar push token en el backend');
          }
        } else {
          console.error('❌ No se pudo obtener el JWT token del usuario');
        }
      } else {
        console.log('⚠️ No se pudo obtener el push token del dispositivo');
      }
    } catch (error) {
      console.error('❌ Error al registrar push token:', error);
    }
  };

  useEffect(() => {
    // Suscribirse a cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('👤 Estado de autenticación cambió:', currentUser ? currentUser.email : 'No autenticado');
      setUser(currentUser);
      
      // Si el usuario inició sesión, registrar para notificaciones push y cargar perfil
      if (currentUser) {
        await registerAndSendPushToken(currentUser);
        // Pequeño delay para asegurar que el token se haya guardado
        setTimeout(() => {
          loadUserProfile();
        }, 500);
      } else {
        // Si el usuario cerró sesión, limpiar el push token y perfil
        console.log('🔓 Usuario cerró sesión, limpiando datos');
        setPushToken(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, displayName: string) => {
    return await registerUser(email, password, displayName);
  };

  const login = async (email: string, password: string) => {
    return await loginUser(email, password);
  };

  const logout = async () => {
    // Eliminar el push token del backend antes de cerrar sesión
    if (user && pushToken) {
      try {
        const userToken = await getCurrentUserToken();
        if (userToken) {
          console.log('🔔 Eliminando push token del backend...');
          await removePushTokenFromBackend(userToken, API_URL);
        }
      } catch (error) {
        console.error('❌ Error al eliminar push token:', error);
      }
    }
    
    return await logoutUser();
  };

  const sendPasswordReset = async (email: string) => {
    return await resetPassword(email);
  };

  const getToken = async () => {
    return await getCurrentUserToken();
  };

  /**
   * Refresca el push token y lo envía al backend
   * Útil si necesitas actualizar el token manualmente
   */
  const refreshPushToken = async () => {
    if (user) {
      await registerAndSendPushToken(user);
    }
  };

  /**
   * Carga el perfil del usuario desde el backend
   */
  const loadUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const userToken = await getCurrentUserToken();
      
      if (!userToken) {
        console.error('❌ No se pudo obtener el token del usuario');
        return null;
      }

      console.log('📖 Cargando perfil del usuario...');
      
      const response = await fetch(`${API_URL}/usuarios/perfil`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const profile = await response.json();
        console.log('✅ Perfil cargado exitosamente');
        setUserProfile(profile);
        return profile;
      } else {
        console.error('❌ Error al cargar perfil:', response.status);
        return null;
      }
    } catch (error) {
      console.error('❌ Error al cargar perfil:', error);
      return null;
    }
  };

  /**
   * Actualiza el perfil del usuario en el backend
   */
  const updateUserProfile = async (nombre: string, celular: string, direccion: string): Promise<boolean> => {
    try {
      const userToken = await getCurrentUserToken();
      
      if (!userToken) {
        console.error('❌ No se pudo obtener el token del usuario');
        return false;
      }

      console.log('📝 Actualizando perfil del usuario...');
      
      const response = await fetch(`${API_URL}/usuarios/perfil`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, celular, direccion }),
      });

      if (response.ok) {
        console.log('✅ Perfil actualizado exitosamente');
        // Recargar el perfil para obtener los datos actualizados
        await loadUserProfile();
        return true;
      } else {
        console.error('❌ Error al actualizar perfil:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    pushToken,
    userProfile,
    register,
    login,
    logout,
    sendPasswordReset,
    getToken,
    refreshPushToken,
    loadUserProfile,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
