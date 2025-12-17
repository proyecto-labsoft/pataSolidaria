import { View, Image } from 'react-native'
import { useState } from 'react'
import { Button, useTheme, Text, Portal, Divider, Switch, Card } from 'react-native-paper'
import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import BackdropSuccess from '../../backdropSuccess'
import { useApiPostCrearAdopcion } from '@/app/api/hooks'
import { useUsuario } from '@/app/hooks/useUsuario'
import CampoTexto from '../campos/campoTexto'
import CampoTextoArea from '../campos/campoTextoArea'
import DescripcionVista from '../../descripcionVista'
import CampoSelectorModal from '../campos/campoSelectorModal'

interface Props {
    data: {
        id: number,
        nombre: string,
        especie: string,
        raza: string,
        tamanio: string,
        color: string,
        fechaNacimiento: string,
        descripcion: string,
        sexo: string,
        esterilizado: boolean,
        chipeado: boolean,
        domicilio?: string,
        fotoPerfil?: string,
        esTransito?: boolean
    }
}

export default function FormularioConfirmarAdopcion({ data }: Props) {
    const theme = useTheme()
    const navigation = useNavigation()
    const { usuarioId } = useUsuario()
    const esTransito = data?.esTransito || false;

    const [successMensaje, setSuccessMensaje] = useState(false)

    const { control, setValue, watch, handleSubmit } = useForm({
        defaultValues: {
            descripcion: data.descripcion || '',
            requisitos: '',
        }
    })

    const { mutateAsync: crearAdopcion, isPending } = useApiPostCrearAdopcion({
        onSuccess: () => { setSuccessMensaje(true) }
    })

    const onSubmit = (formData: any) => {
        crearAdopcion({
            data: {
                publicadorID: usuarioId,
                mascotaID: data?.id,
                requisitos: formData.requisitos || '',
                transito: esTransito
            }
        })
    }

    return (
        <View style={{ gap: 20, paddingHorizontal: 10 }}>
            <Portal>
                {successMensaje && (
                    <BackdropSuccess
                        texto={esTransito ? "Familiar publicado en tránsito exitosamente" : "Familiar publicado en adopción exitosamente"}
                        onTap={() => {
                            navigation.navigate('Home' as never)
                        }}
                    />
                )}
            </Portal>

            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                {data.fotoPerfil ? (
                    <Image
                        source={{ uri: data.fotoPerfil }}
                        style={{ width: 200, height: 200, borderRadius: 100 }}
                    />
                ) : (
                    <View style={{
                        width: 200,
                        height: 200,
                        borderRadius: 100,
                        backgroundColor: theme.colors.primaryContainer,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text variant="displayMedium" style={{ color: theme.colors.primary }}>
                            {data.nombre.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
                <Text variant="headlineMedium" style={{ marginTop: 10, color: theme.colors.primary }}>
                    {data.nombre}
                </Text>
            </View>

            <Divider style={{ height: 2, marginVertical: 10 }} />

            <DescripcionVista texto="Información del familiar" tamanioTexto="titleLarge" />

            <Card style={{ gap: 10, backgroundColor: theme.colors.surfaceVariant, padding: 15, marginHorizontal: 10,borderRadius: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Especie:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{data.especie}</Text>
                </View>
                
                {data.raza && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Raza:</Text>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{data.raza}</Text>
                    </View>
                )}

                {data.sexo && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Sexo:</Text>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                            {data.sexo === 'M' ? 'Macho' : data.sexo === 'H' ? 'Hembra' : 'No especificado'}
                        </Text>
                    </View>
                )}

                {data.tamanio && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Tamaño:</Text>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{data.tamanio}</Text>
                    </View>
                )}

                {data.color && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Color:</Text>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{data.color}</Text>
                    </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Esterilizado:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                        {data.esterilizado ? 'Sí' : 'No'}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Chipeado:</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                        {data.chipeado ? 'Sí' : 'No'}
                    </Text>
                </View>
            </Card>


            <Card style={{ gap: 10, backgroundColor: theme.colors.surfaceVariant, padding: 15, borderRadius: 10, marginHorizontal: 10 }}>
                <DescripcionVista 
                    texto="Descripción adicional (opcional)" 
                    tamanioTexto="titleMedium" 
                />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 10 }}>
                Agrega información adicional que pueda ayudar a los adoptantes a conocer mejor a tu familiar.
            </Text>

            <CampoTextoArea
                control={control}
                label="Descripción"
                nombre="descripcion"
                style={{ backgroundColor: theme?.colors.surface, marginHorizontal: 4 }}
            />
            </Card>
            <Divider style={{ height: 2, marginVertical: 10 }} />
            <Card style={{ gap: 10, backgroundColor: theme.colors.surfaceVariant, padding: 15, borderRadius: 10, marginHorizontal: 10 }}>
            <DescripcionVista 
                texto="Requisitos para adopción" 
                tamanioTexto="titleMedium" 
            />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 10 }}>
                {esTransito 
                    ? 'Indica qué requisitos debe cumplir quien reciba a tu familiar en tránsito temporal.'
                    : 'Indica qué requisitos debe cumplir el adoptante de tu familiar.'
                }
            </Text>

            <CampoTextoArea
                control={control}
                label="Requisitos"
                style={{ backgroundColor: theme?.colors.surface, marginHorizontal: 4 }}
                nombre="requisitos"
            />
            </Card>

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginTop: 20 }}>
                <Button
                    buttonColor={theme.colors.error}
                    style={{ marginHorizontal: '5%', marginVertical: 8, borderRadius: 10 }}
                    uppercase
                    mode="contained"
                    onPress={() => navigation.goBack()}
                    disabled={isPending}
                >
                    <Text variant='labelLarge' style={{ color: theme.colors.onError }}>
                        Cancelar
                    </Text>
                </Button>
                <Button
                    buttonColor={theme.colors.primary}
                    style={{ marginHorizontal: '5%', marginVertical: 8, borderRadius: 10 }}
                    uppercase
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    loading={isPending}
                    disabled={isPending}
                >
                    <Text variant='labelLarge' style={{ color: theme.colors.onPrimary }}>
                        Publicar
                    </Text>
                </Button>
            </View>
        </View>
    )
}
