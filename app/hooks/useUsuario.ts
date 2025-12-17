import { auth } from '@/config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

interface UserData {
  usuarioId: string | null;
  email: string | null;
  displayName: string | null;
  nombre: string | null;
  celular: string | null;
  direccion: string | null;
  token: string | null;
  notificacionesHabilitadas: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

/**
 * Hook personalizado para obtener datos del usuario autenticado
 * @returns Objeto con datos del usuario y estado de autenticación
 */
export const useUsuario = (): UserData => {
    const { user, userProfile } = useAuth();
    const [usuarioId, setUsuarioId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    
    useEffect(() => {
        const getUserData = async () => {
            if (user) {
                try {
                    const tokenResult = await user.getIdTokenResult(true);
                    const rol = tokenResult.claims.rol;  // "admin" o "user"
                    const usuarioId = tokenResult.claims.usuarioId;
                    
                    setUsuarioId(usuarioId as string);
                    setIsAdmin(rol === 'admin');
                    
                    // console.log('Rol:', rol);
                    // console.log('usuarioId:', usuarioId);
                    // console.log('isAdmin:', rol === 'admin');
                } catch (error) {
                    console.error('Error obteniendo datos del usuario:', error);
                }
            } else {
                setUsuarioId(null);
                setIsAdmin(false);
            }
        };
        
        getUserData();
    }, [user]);

    return {
        // Datos de Firebase Auth
        token: user?.accessToken || null,
        usuarioId: usuarioId,
        email: user?.email || null,
        displayName: user?.displayName || null,
        
        // Datos del perfil desde el backend
        nombre: userProfile?.nombre || null,
        celular: userProfile?.celular || null,
        direccion: userProfile?.direccion || null,
        notificacionesHabilitadas: userProfile?.notificacionesHabilitadas || false,
        
        // Rol y autenticación
        isAdmin: isAdmin,
        isAuthenticated: !!user,
    };
};