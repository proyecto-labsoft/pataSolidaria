import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUsuario } from '../hooks/useUsuario';

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente que solo renderiza su contenido si el usuario es administrador
 * 
 * @example
 * <AdminOnly>
 *   <BotonEnviarNotificacion />
 * </AdminOnly>
 * 
 * @example Con fallback
 * <AdminOnly fallback={<Text>No tienes permisos</Text>}>
 *   <PanelAdmin />
 * </AdminOnly>
 */
export const AdminOnly: React.FC<AdminOnlyProps> = ({ children, fallback = null }) => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface AdminOrOwnerProps {
  children: React.ReactNode;
  ownerId: string | number | null;
  fallback?: React.ReactNode;
}

/**
 * Componente que renderiza su contenido si el usuario es administrador O es el dueño del recurso
 * 
 * @example
 * <AdminOrOwner ownerId={adopcion.administrador.id}>
 *   <ListaPostulantes />
 * </AdminOrOwner>
 */
export const AdminOrOwner: React.FC<AdminOrOwnerProps> = ({ children, ownerId, fallback = null }) => {
  const { isAdmin } = useAuth();
  const { usuarioId } = useUsuario();
  
  const hasPermission = isAdmin || (usuarioId && ownerId && usuarioId.toString() === ownerId.toString());
  
  if (!hasPermission) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default AdminOnly;
