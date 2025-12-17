
import { View,StyleSheet, Animated } from 'react-native'
import {useState, useEffect, useRef} from 'react'
import { Button, useTheme, Text, Portal, Modal } from 'react-native-paper'
import { Mapa } from '../../mapa'
import CampoTexto from '../campos/campoTexto' 
import DescripcionVista from '../../descripcionVista' 
import CampoSelectorModal from '../campos/campoSelectorModal'
import CampoTextoArea from '../campos/campoTextoArea'


import PropTypes from 'prop-types'

export default function AspectoStep({control}) {
    return (
        <View style={{gap:20}}>
            <View style={{width:'100%',justifyContent:'center',alignContent:'center',gap:10,marginTop: 20}}>
                <DescripcionVista style={{textAlign:'center'}} tamanioTexto="titleLarge" texto="Aspecto del familiar"/>
                <CampoTexto
                    control={control}
                    label="Colores"
                    nombre="color"
                />
                
                <CampoSelectorModal
                    control={control}
                    label="Tamaño"
                    nombre="tamanio"
                    opciones={['Muy grande','Grande','Mediano','Pequeño']}
                />

                <CampoSelectorModal
                    control={control}
                    label="Especie de animal"
                    nombre="especie"
                    opciones={['Perro','Gato','Caballo','Otros']}
                />
                <CampoTexto
                    control={control}
                    label="Raza"
                    nombre="raza"
                />
                <CampoSelectorModal
                    control={control} 
                    label="Sexo"
                    nombre="sexo"
                    opciones={['No lo sé','Macho','Hembra']}
                />
                <CampoTextoArea
                    control={control}
                    label="Descripción adicional"
                    nombre="descripcion"
                />

            </View>
            
        </View>
    )
}

AspectoStep.propTypes = {
    control: PropTypes.object.isRequired,
}