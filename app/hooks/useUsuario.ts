import { auth } from '@/config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

interface UserData {
  usuarioId: string | null;
  email: string | null;
  displayName: string | null;
  nombre: string | null;
  celular: string | null;
  direccion: string | null;
  token: string | null;
  notificacionesHabilitadas: boolean;
  isAuthenticated: boolean;
}

/**
 * Hook personalizado para obtener datos del usuario autenticado
 * @returns Objeto con datos del usuario y estado de autenticación
 */
export const useUsuario = (): UserData => {
    const { user, userProfile } = useAuth();
    const [usuarioId, setUsuarioId] =  useState<string | null>(null);
    const getUsuarioId = async (): Promise<string | null> => {

        // console.log("Auth firebase", user, auth)
        
        if (user) {
          const tokenResult = await user.getIdTokenResult(true);
          // console.log("Token result",tokenResult)
          const rol = tokenResult.claims.rol;  // "admin" o "user"
          const usuarioId = tokenResult.claims.usuarioId;
          setUsuarioId(usuarioId as string);
          // console.log('Rol:', rol);
          // console.log('usuarioId:',usuarioId);
        }
    }
    // const user = auth.currentUser;
    
    getUsuarioId()

    return {
        // Datos de Firebase Auth
        
        token: user?.accessToken || null,
        usuarioId: usuarioId || null,
        email: user?.email || null,
        displayName: user?.displayName || null,
        
        // Datos del perfil desde el backend
        nombre: userProfile?.nombre || null,
        celular: userProfile?.celular || null,
        direccion: userProfile?.direccion || null,
        notificacionesHabilitadas: userProfile?.notificacionesHabilitadas || false,
        
        // // Estado de autenticación
        // isAuthenticated: !!user,
    };
};