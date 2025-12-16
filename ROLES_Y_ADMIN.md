# Configuración de Roles y Administradores

## Arquitectura del Sistema de Roles

### Backend

El sistema de roles está implementado en el backend con las siguientes características:

- **Campo en BD**: `usuario.administrador` (Boolean)
- **Custom Claims de Firebase**: Cada usuario tiene un claim `rol` con valor `"admin"` o `"user"`
- **Sincronización automática**: Los custom claims se actualizan automáticamente cuando se modifica el rol

### Frontend

El frontend puede verificar el rol del usuario de dos formas:

1. **Usando el hook `useUsuario`**:
```typescript
import { useUsuario } from '@/app/hooks/useUsuario';

const MiComponente = () => {
  const { isAdmin } = useUsuario();
  
  return isAdmin ? <BotonAdmin /> : null;
};
```

2. **Usando el contexto `AuthContext`**:
```typescript
import { useAuth } from '@/app/contexts/AuthContext';

const MiComponente = () => {
  const { isAdmin } = useAuth();
  
  return isAdmin ? <PanelAdmin /> : null;
};
```

## Asignar el Primer Administrador

### Opción 1: Usando SQL (Recomendado para el primer admin)

1. Registra un usuario normalmente en la aplicación
2. Conecta a la base de datos PostgreSQL:
   ```bash
   docker exec -it postgres-mascotas psql -U josegaray -d db_araf_v2
   ```

3. Actualiza el usuario para hacerlo administrador:
   ```sql
   UPDATE usuario SET administrador = true WHERE email = 'tu_email@example.com';
   ```

4. Verifica que se haya actualizado:
   ```sql
   SELECT id, nombre, email, administrador FROM usuario WHERE administrador = true;
   ```

5. **IMPORTANTE**: El usuario debe cerrar sesión y volver a iniciar para que se actualicen los custom claims

### Opción 2: Usando el endpoint de la API (Solo para admins existentes)

Solo un usuario con rol `admin` puede asignar el rol a otros usuarios:

```bash
POST /usuarios/set-admin
Authorization: Bearer <token_del_admin>
Content-Type: application/json

{
  "firebaseUid": "uid_del_usuario_a_modificar",
  "isAdmin": true
}
```

Ejemplo con curl:
```bash
curl -X POST http://localhost:8080/usuarios/set-admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid": "abc123...", "isAdmin": true}'
```

### Opción 3: Configurar en el script de inicialización

Puedes modificar el archivo `api/init-scripts/03-data.sql` para crear usuarios administradores de prueba:

```sql
-- Descomentar y modificar:
INSERT INTO usuario (nombre, celular, email, direccion, administrador, firebase_uid) 
VALUES ('Admin', 1234567890, 'admin@test.com', 'Dirección Admin', true, null);
```

**NOTA**: Luego necesitarás vincular el `firebase_uid` cuando ese usuario se registre.

## Seguridad

### Endpoints Protegidos

El archivo `SecurityConfig.java` define la seguridad:

- **Públicos**: `/api/public/**`, `/swagger-ui/**`, `/usuarios/sync`
- **Solo Admin**: `/usuarios/set-admin`
- **Autenticados**: Todos los demás endpoints

### Verificación en el Frontend

Ejemplo de uso en componentes que solo deben ver administradores:

```typescript
// En notificaciones.tsx
const { isAdmin } = useAuth();

return (
  <View>
    {/* ... contenido normal ... */}
    
    {/* FAB solo visible para administradores */}
    {isAdmin && (
      <FAB
        icon="send"
        onPress={() => navigation.navigate('AdminNotificaciones')}
      />
    )}
  </View>
);
```

## Flujo de Autenticación y Roles

1. Usuario se registra/inicia sesión en Firebase
2. Frontend llama a `/usuarios/sync` con datos de Firebase
3. Backend crea/actualiza el usuario en PostgreSQL
4. Backend establece custom claims en Firebase con el rol (`admin`/`user`)
5. Frontend obtiene el token actualizado y lee los custom claims
6. `AuthContext` y `useUsuario` exponen `isAdmin` basado en los claims

## Casos de Uso Futuros

### Ver Postulantes de una Adopción

Opción 1: Usando el componente `ListaPostulantes` (Recomendado):

```typescript
import ListaPostulantes from '@/app/componentes/ListaPostulantes';

const VistaAdopcion = ({ adopcionId }) => {
  const [postulantes, setPostulantes] = useState([]);
  
  useEffect(() => {
    // Cargar postulantes desde la API
    fetch(`/adopciones/${adopcionId}/postulantes`)
      .then(res => res.json())
      .then(data => setPostulantes(data));
  }, [adopcionId]);
  
  const handleAceptarPostulante = async (postulanteId) => {
    // Lógica para aceptar postulante
    await fetch(`/postulaciones/${postulanteId}/aceptar`, { method: 'POST' });
    // Recargar lista
  };
  
  return (
    <View>
      {/* ... detalles de adopción ... */}
      
      {/* Este componente solo se mostrará si eres admin o creador */}
      <ListaPostulantes
        adopcionId={adopcion.id}
        creadorId={adopcion.publicador.id}
        postulantes={postulantes}
        onAceptarPostulante={handleAceptarPostulante}
      />
    </View>
  );
};
```

Opción 2: Usando el componente `AdminOrOwner` directamente:

```typescript
import { AdminOrOwner } from '@/app/componentes/AdminOnly';

const VistaAdopcion = ({ adopcionId }) => {
  const [postulantes, setPostulantes] = useState([]);
  
  return (
    <View>
      {/* ... detalles de adopción ... */}
      
      <AdminOrOwner 
        ownerId={adopcion.publicador.id}
        fallback={<Text>No tienes permisos para ver postulantes</Text>}
      >
        <View>
          <Text variant="titleLarge">Postulantes</Text>
          {postulantes.map(p => (
            <PostulanteCard key={p.id} postulante={p} />
          ))}
        </View>
      </AdminOrOwner>
    </View>
  );
};
```

### Usar el componente `AdminOnly`

Para elementos que solo deben ver los administradores:

```typescript
import { AdminOnly } from '@/app/componentes/AdminOnly';

const MiPantalla = () => {
  return (
    <View>
      {/* Contenido normal visible para todos */}
      <Text>Información pública</Text>
      
      {/* Solo visible para administradores */}
      <AdminOnly>
        <Button onPress={handleEliminarUsuario}>
          Eliminar Usuario
        </Button>
      </AdminOnly>
      
      {/* Con un fallback personalizado */}
      <AdminOnly fallback={<Text>Contenido solo para admins</Text>}>
        <PanelDeEstadisticas />
      </AdminOnly>
    </View>
  );
};
```

### Panel de Administración

Puedes crear rutas protegidas en la navegación:

```typescript
// En tu navegador principal
import { useAuth } from '@/app/contexts/AuthContext';

const Navigation = () => {
  const { isAdmin } = useAuth();
  
  return (
    <Stack.Navigator>
      {/* Rutas normales */}
      <Stack.Screen name="Home" component={Home} />
      
      {/* Rutas solo para admin */}
      {isAdmin && (
        <>
          <Stack.Screen name="AdminPanel" component={AdminPanel} />
          <Stack.Screen name="AdminNotificaciones" component={AdminNotificaciones} />
          <Stack.Screen name="ModeracionAdopciones" component={ModeracionAdopciones} />
        </>
      )}
    </Stack.Navigator>
  );
};
```

## Troubleshooting

### El rol no se actualiza en el frontend

1. Verifica que el usuario tenga el campo `administrador = true` en la BD:
   ```sql
   SELECT * FROM usuario WHERE email = 'tu_email@example.com';
   ```

2. Verifica los custom claims en Firebase:
   - Ve a Firebase Console > Authentication
   - Busca el usuario
   - Los custom claims deberían incluir `rol: "admin"`

3. Fuerza la recarga del token:
   ```typescript
   const { user } = useAuth();
   const tokenResult = await user?.getIdTokenResult(true); // true = force refresh
   console.log('Claims:', tokenResult.claims);
   ```

4. El usuario debe **cerrar sesión y volver a iniciar** después de cambiar el rol

### Error 403 al llamar a `/usuarios/set-admin`

- Verifica que el token incluya `ROLE_ADMIN`
- Solo usuarios con `administrador = true` pueden llamar a este endpoint
- Verifica los headers de la petición

### El FAB de notificaciones no aparece

- Verifica que `isAdmin` sea `true` en el contexto
- Revisa los logs del navegador: debería aparecer "🔱 Rol del usuario: admin | isAdmin: true"
- Asegúrate de que el componente esté usando `useAuth()` correctamente
