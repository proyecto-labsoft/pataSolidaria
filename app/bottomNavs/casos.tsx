import { ScrollView, View } from "react-native";
import CardAnimal from "../componentes/cards/cardAnimal";
import DescripcionVista from "../componentes/descripcionVista";
import { useApiGetExtravios } from "../api/hooks";

export default function VistaCasos() {

  const {data } = useApiGetExtravios({enabled: true, parametros: {id: 2}})
  
  // TODO get de todos los casos, con todos sus datos.
  const datos = [
    { nombre: 'Chili', especie: 'Canino', tipo: 'perdido', ultimoAvistamiento: new Date('2025-01-01T14:30:00') },
    { nombre: 'Duque', especie: 'Canino', tipo: 'avistado', estado: 'Herido', ultimoAvistamiento: new Date('2025-02-02T09:15:00') },
    { nombre: 'Draco', especie: 'Canino', tipo: 'perdido', ultimoAvistamiento: new Date('2025-03-03T18:45:00') },
    { nombre: 'Sur', especie: 'Felino', tipo: 'avistado', estado: 'bueno', ultimoAvistamiento: new Date('2025-04-04T21:00:00') },
    { nombre: 'Simba', especie: 'Canino', tipo: 'perdido', ultimoAvistamiento: new Date('2025-06-03T09:00:00') },
    { nombre: 'Luna', especie: 'Felino', tipo: 'perdido', ultimoAvistamiento: new Date('2025-05-10T16:20:00') },
    { nombre: 'Rocky', especie: 'Canino', tipo: 'avistado', estado: 'Asustado', ultimoAvistamiento: new Date('2025-05-12T11:00:00') },
    { nombre: 'Milo', especie: 'Felino', tipo: 'perdido', ultimoAvistamiento: new Date('2025-05-15T08:30:00') },
    { nombre: 'Toby', especie: 'Canino', tipo: 'avistado', estado: 'Hambriento', ultimoAvistamiento: new Date('2025-05-18T19:45:00') },
    { nombre: 'Nina', especie: 'Felino', tipo: 'perdido', ultimoAvistamiento: new Date('2025-05-20T13:10:00') },
  ];

  datos.sort((a, b) => b.ultimoAvistamiento.getTime() - a.ultimoAvistamiento.getTime());


  return ( 
    <View style={{flex:1}}>
      <DescripcionVista texto="Aquí podrás todos los casos de compañeros perdidos y avistados" />
      <ScrollView
        contentContainerStyle={{justifyContent:'center', alignItems: "flex-start",paddingVertical: 10,paddingBottom:80}}
      >
        
        {Array.from({ length: Math.ceil(datos.length / 2) }).map((_, rowIdx) => {
          const rowItems = datos.slice(rowIdx * 2, rowIdx * 2 + 2);
          return (
            <View key={rowIdx} style={{ flexDirection: 'row', width: '100%' }}>
              <CardAnimal
                key={0}
                navigateTo="VistaExtravio"
                data={rowItems[0]}
              />
              {rowItems[1] ? (
                <CardAnimal
                  key={1}
                  navigateTo="VistaExtravio"
                  data={rowItems[1]}
                />
              ) : (
                <View key={1} style={{ flex: 1 }} />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View> 
    
  );
}
