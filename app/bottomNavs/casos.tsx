import { FlatList, View, RefreshControl, useWindowDimensions, StyleSheet } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal"; 
import { useApiGetExtravios, useApiGetFavoritos } from "../api/hooks";
import { Button, Text, useTheme, Portal, Modal, Surface, IconButton, Chip, ActivityIndicator } from "react-native-paper";
import VisitVetIcon from "../componentes/iconos/VisitVetIcon"; 
import { useState, useMemo } from "react";
import { useUsuario } from "../hooks/useUsuario";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import BotonAlerta from "../componentes/botones/botonAlerta"; 
type TipoCaso = 'todos' | 'buscados' | 'extraviados' | 'favoritos' | 'misCasos';
type OrdenCaso = 'recientes' | 'antiguos';

export default function VistaCasos() {

  const { usuarioId } = useUsuario();
  const {data: extravios, isFetching, refetch: refetchExtravios } = useApiGetExtravios({params: { queryParams: {resueltos: false}}, enabled: true }) 
  const {data: favoritos, isFetching: isFetchingFavoritos, refetch: refetchFavoritos } = useApiGetFavoritos({
    params: { id: usuarioId },
    enabled: !!usuarioId
  }); 
  const navigation = useNavigation();
  
  function refetchQueries() {
    refetchExtravios();
    refetchFavoritos();
  }

  const theme = useTheme();
  const { height } = useWindowDimensions(); 
  const [filtroVisible, setFiltroVisible] = useState(false);
  const [tipoCaso, setTipoCaso] = useState<TipoCaso>('todos');
  const [ordenCaso, setOrdenCaso] = useState<OrdenCaso>('recientes');

  const cargandoVista = isFetching 

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
  }, [extravios, tipoCaso, usuarioId, favoritosIds]); 

  // Agrupa los datos de a dos por fila
  const extraviosPorFila = Array.isArray(extraviosFiltrados)
    ? Array.from({ length: Math.ceil(extraviosFiltrados.length / 2) }, (_, idx) =>
        extraviosFiltrados.slice(idx * 2, idx * 2 + 2)
      )
    : [];

  return ( 
    <View style={{height: '100%', marginVertical: 10}}> 
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
 
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              mode="outlined" 
              onPress={() => { 
                setTipoCaso('todos');
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
        data={extraviosPorFila}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={{ justifyContent: 'center', alignItems: "center", paddingVertical: 10, gap: 5 }}
        refreshing={cargandoVista}
        onRefresh={refetchQueries}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <CardAnimal navigateTo="VistaExtravio" data={item[0]} />
            {item[1] ? (
              <CardAnimal navigateTo="VistaExtravio" data={item[1]} />
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
        )}
        ListEmptyComponent={
          <>
          {!cargandoVista && (
            <View style={{alignItems: 'center', marginVertical: 50}}>
                <VisitVetIcon width={250} height={250} color={theme.colors.primary} />
                <Text variant="headlineMedium" style={{textAlign: 'center', color: theme.colors.primary}}>No hay casos de extravío</Text>
            </View>
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
});
