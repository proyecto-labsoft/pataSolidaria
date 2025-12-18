import { FlatList, View, useWindowDimensions, StyleSheet } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal";
import CardEmergencia from "../componentes/cards/cardEmergencia"; 
import { useApiGetEmergencias, useApiGetExtravios, useApiGetFavoritos } from "../api/hooks";
import { Button, Text, useTheme, Portal, Modal, Surface, IconButton, Chip } from "react-native-paper";
import VisitVetIcon from "../componentes/iconos/VisitVetIcon"; 
import { useState, useMemo } from "react";
import { useUsuario } from "../hooks/useUsuario"; 
import { useAuth } from "../contexts/AuthContext";
import LogoPataIcon from "../componentes/iconos/LogoPataIcon";

type TipoCaso = 'todos' | 'buscados' | 'extraviados' | 'favoritos' | 'misCasos' | 'emergencias';
type EstadoCaso = 'noResueltos' | 'resueltos' | 'todos';
type OrdenCaso = 'recientes' | 'antiguos';

export default function VistaCasos() {

  const { usuarioId } = useUsuario();
  const { isAdmin } = useAuth();

  const [tipoCaso, setTipoCaso] = useState<TipoCaso>('todos');
  const [estadoCaso, setEstadoCaso] = useState<EstadoCaso>('noResueltos');
  const [ordenCaso, setOrdenCaso] = useState<OrdenCaso>('recientes');
  const [filtroVisible, setFiltroVisible] = useState(false);

  // Determinar parámetros de query según el estado seleccionado
  const resueltoParam = estadoCaso === 'noResueltos' ? false : estadoCaso === 'resueltos' ? true : null;
  const atendidoParam = estadoCaso === 'noResueltos' ? false : estadoCaso === 'resueltos' ? true : null;

  const {data: extravios, isFetching, refetch: refetchExtravios } = useApiGetExtravios({
    params: { queryParams: {resueltos: resueltoParam}}, 
    enabled: true 
  });
  
  const {data: favoritos, isFetching: isFetchingFavoritos, refetch: refetchFavoritos } = useApiGetFavoritos({
    params: { id: usuarioId },
    enabled: !!usuarioId
  }); 
  
  const {data: emergencias, isFetching: isFetchingEmergencias, refetch: refetchEmergencias } = useApiGetEmergencias({
    params: { queryParams: {atendidos: atendidoParam} },
    enabled: !!usuarioId
  }); 
  
  function refetchQueries() {
    refetchExtravios();
    refetchFavoritos(); 
    refetchEmergencias()  
  }

  const theme = useTheme(); 
  const { height } = useWindowDimensions();

  const cargandoVista = isFetching || isFetchingEmergencias

  // Obtener IDs de favoritos
  const favoritosIds = useMemo(() => {
    if (!Array.isArray(favoritos)) return new Set();
    return new Set(favoritos.map(fav => fav.extravioId));
  }, [favoritos]);
 
  // const favoritosMap = useMemo(() => {
  //   if (!Array.isArray(favoritos)) return new Map();
  //   return new Map(favoritos.map(fav => [fav.extravioId, fav]));
  // }, [favoritos]);

  // Filtrar y ordenar extravíos
  const extraviosFiltrados = useMemo(() => {
    if (!Array.isArray(extravios)) return [];
    
    return extravios.filter(extravio => {
      // Restricción: usuarios no admin no pueden ver casos resueltos que no crearon
      if (!isAdmin && extravio.resuelto && extravio.creadorId !== usuarioId) {
        return false;
      }

      // Filtro de tipo: Emergencias - no mostrar extravíos
      if (tipoCaso === 'emergencias') {
        return false;
      }
      
      // Filtro: Favoritos
      if (tipoCaso === 'favoritos') {
        return favoritosIds.has(extravio.extravioId);
      }
      
      // Filtro: Solo mis casos creados
      if (tipoCaso === 'misCasos') {
        return extravio.creadorId === usuarioId;
      }
      
      // Filtro: Buscados (creados por familiar)
      if (tipoCaso === 'buscados') {
        return extravio.creadoByFamiliar === true;
      }
      
      // Filtro: Extraviados (NO creados por familiar)
      if (tipoCaso === 'extraviados') {
        return extravio.creadoByFamiliar === false;
      }
      
      // Todos
      return true;
    });
  }, [extravios, tipoCaso, usuarioId, favoritosIds, isAdmin]); 

  // Filtrar emergencias según tipo y rol
  const emergenciasFiltradas = useMemo(() => {
    if (!Array.isArray(emergencias)) return [];

    // Si el filtro de tipo NO es 'emergencias' y NO es 'todos' y NO es 'misCasos', no mostrar emergencias
    if (tipoCaso !== 'emergencias' && tipoCaso !== 'todos' && tipoCaso !== 'misCasos') {
      return [];
    }

    return emergencias.filter(emergencia => {
      // Restricción: usuarios no admin solo ven sus propias emergencias
      if (!isAdmin && emergencia.usuarioCreador?.id !== usuarioId) {
        return false;
      }

      // Filtro: Solo mis casos creados
      if (tipoCaso === 'misCasos') {
        return emergencia.usuarioCreador?.id === usuarioId;
      }

      return true;
    });
  }, [emergencias, tipoCaso, isAdmin, usuarioId]);

  // Agrupa emergencias de a dos por fila
  const emergenciasPorFila = useMemo(() => {
    return Array.from({ length: Math.ceil(emergenciasFiltradas.length / 2) }, (_, idx) =>
      emergenciasFiltradas.slice(idx * 2, idx * 2 + 2)
    );
  }, [emergenciasFiltradas]);

  // Agrupa los datos de a dos por fila
  const extraviosPorFila = Array.isArray(extraviosFiltrados)
    ? Array.from({ length: Math.ceil(extraviosFiltrados.length / 2) }, (_, idx) =>
        extraviosFiltrados.slice(idx * 2, idx * 2 + 2)
      )
    : [];

  return ( 
    <View style={{height: '100%', marginVertical: 10, position: 'relative'}}>
      {/* Logo de fondo */}
      <View style={styles.logoBackground}>
        <LogoPataIcon width={400} height={520} />
      </View>
      
      <Button 
        mode="outlined" 
        icon="filter" 
        onPress={() => setFiltroVisible(true)}
        style={{ marginVertical: 10, marginHorizontal: 10, borderRadius: 10, borderWidth: 2, borderColor: theme.colors.primary }}
      >
        Filtro de casos
      </Button>

      <Portal>
        <Modal
          visible={filtroVisible}
          onDismiss={() => setFiltroVisible(false)}
          contentContainerStyle={{
            ...styles.modalContainer,
            height: height * 0.5,
            backgroundColor: theme.colors.surface,
          }}
          >
            <Surface style={styles.handleBar}>
              <View style={[styles.handle, { backgroundColor: theme.colors.outline }]} />
            </Surface>

          <View style={styles.header}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
              Filtros de búsqueda
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setFiltroVisible(false)}
            />
          </View>

          <View style={styles.filterContent}>
            <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>Tipo de caso</Text>
            <View style={styles.chipContainer}>
              <Chip 
                selected={tipoCaso === 'favoritos'} 
                mode="outlined" 
                style={styles.chip}
                onPress={() => setTipoCaso('favoritos')}
              >
                Mis favoritos
              </Chip>
              <Chip 
                selected={tipoCaso === 'misCasos'} 
                mode="outlined" 
                style={styles.chip}
                onPress={() => setTipoCaso('misCasos')}
              >
                Creados por mí
              </Chip>
              <Chip 
                selected={tipoCaso === 'emergencias'} 
                mode="outlined" 
                style={styles.chip}
                onPress={() => setTipoCaso('emergencias')}
              >
                Emergencias
              </Chip>
              <Chip 
                selected={tipoCaso === 'buscados'} 
                mode="outlined" 
                style={styles.chip}
                onPress={() => setTipoCaso('buscados')}
              >
                Buscados
              </Chip>
              <Chip 
                selected={tipoCaso === 'extraviados'} 
                mode="outlined" 
                style={styles.chip}
                onPress={() => setTipoCaso('extraviados')}
              >
                Extraviados
              </Chip>
              <Chip 
                selected={tipoCaso === 'todos'} 
                mode="outlined" 
                style={styles.chip}
                onPress={() => setTipoCaso('todos')}
              >
                Todos
              </Chip>
            </View>

            <Text variant="titleMedium" style={{ marginTop: 24, marginBottom: 8 }}>Estado</Text>
            <View style={styles.chipContainer}>
              <Chip 
                selected={estadoCaso === 'noResueltos'} 
                mode="outlined" 
                style={styles.chip}
                onPress={() => setEstadoCaso('noResueltos')}
              >
                No resueltos
              </Chip>
              <Chip 
                selected={estadoCaso === 'resueltos'} 
                mode="outlined" 
                style={styles.chip}
                onPress={() => setEstadoCaso('resueltos')}
              >
                Resueltos
              </Chip>
              <Chip 
                selected={estadoCaso === 'todos'} 
                mode="outlined" 
                style={styles.chip}
                onPress={() => setEstadoCaso('todos')}
              >
                Todos
              </Chip>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              mode="outlined" 
              onPress={() => { 
                setTipoCaso('todos');
                setEstadoCaso('noResueltos');
                setOrdenCaso('recientes');
              }}
              style={{ flex: 1 }}
            >
              Limpiar filtros
            </Button>
            <Button 
              mode="contained" 
              onPress={() => setFiltroVisible(false)}
              style={{ flex: 1 }}
            >
              Aplicar
            </Button>
          </View>
        </Modal>
      </Portal>

      <FlatList
        data={[{ type: 'emergencias' }, { type: 'extravios' }]}
        keyExtractor={(item) => item.type}
        contentContainerStyle={{ justifyContent: 'center', alignItems: "center", paddingVertical: 10 }}
        refreshing={cargandoVista}
        onRefresh={refetchQueries}
        renderItem={({ item }) => {
          if (item.type === 'emergencias' && emergenciasPorFila.length > 0) {
            return (
              <View style={{ width: '100%', position: 'relative', marginBottom: 20 }}>
                
                {emergenciasPorFila.map((fila, idx) => (
                  <View key={`emergencia-row-${idx}`} style={{ flexDirection: 'row', width: '100%' }}>
                    <CardEmergencia navigateTo="VistaEmergencia" data={fila[0]} />
                    {fila[1] ? (
                      <CardEmergencia navigateTo="VistaEmergencia" data={fila[1]} />
                    ) : (
                      <View style={{ flex: 1 }} />
                    )}
                  </View>
                ))}
              </View>
            );
          }
          
          if (item.type === 'extravios') {
            return (
              <View style={{ width: '100%' }}>
                {extraviosPorFila.map((fila, idx) => (
                    <View key={`extravio-row-${idx}`} style={{ flexDirection: 'row', width: '100%' }}>
                      <CardAnimal navigateTo="VistaExtravio" data={fila[0]} />
                      {fila[1] ? (
                        <CardAnimal navigateTo="VistaExtravio" data={fila[1]} />
                      ) : (
                        <View style={{ flex: 1 }} />
                      )}
                    </View>
                ))}
              </View>
            );
          }
          
          return null;
        }}
        ListEmptyComponent={
          <>
          {(!cargandoVista && emergenciasPorFila?.length === 0 && extraviosPorFila?.length === 0 && (
              <View style={{alignItems: 'center', marginVertical: 50}}>
                <VisitVetIcon width={250} height={250} color={theme.colors.primary} />
                <Text variant="headlineMedium" style={{textAlign: 'center', color: theme.colors.primary}}>No hay casos de extravío</Text>
              </View>
            )
          )}
          </>
        }
      />
      {/* Overlay de carga */}
      {cargandoVista && (
        <View style={styles.loadingOverlay}>
          <Surface style={styles.loadingCard} elevation={4}>
            <VisitVetIcon width={250} height={250} color={theme.colors.primary} />
                  <Text variant="headlineMedium" style={{textAlign: 'center', color: theme.colors.primary}}>Obteniendo casos...</Text>
          </Surface>
        </View>
      )} 
    </View> 
  );
}

const styles = StyleSheet.create({
  logoBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -200 }, { translateY: -260 }],
    opacity: 0.05,
    zIndex: -1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    elevation: 10, 
    zIndex: 100,  
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 0, 
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    paddingTop: 12,
  },
  emergenciaTag: {
    position: 'absolute',
    top: -12,
    left: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 16,
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});
