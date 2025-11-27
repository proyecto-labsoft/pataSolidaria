import { FontAwesome6, Foundation, MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { openSettings } from "expo-linking";
import { FC, useRef, useState } from "react";
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { CustomButton } from "./CustomButton";
import { useTheme, Button } from "react-native-paper";

type CameraModalProps = {
  visible: boolean;
  onClose: () => void;
  onTakePicture: (photoBase64: string) => void;
  showPreview?: boolean;
};

export const CameraModal: FC<CameraModalProps> = ({ 
  visible, 
  onClose, 
  onTakePicture,
  showPreview = false
}) => {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const handlePermissions = async () => {
    if (!permission?.granted) {
      if (permission?.canAskAgain) {
        requestPermission();
      } else {
        openSettings();
      }
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await (cameraRef.current as any).takePictureAsync({ base64: true });
      if (photo?.base64) {
        const photoBase64 = `data:image/jpeg;base64,${photo.base64}`;
        
        if (showPreview) {
          // Mostrar preview antes de confirmar
          setPreviewPhoto(photoBase64);
        } else {
          // Confirmar directamente sin preview
          onTakePicture(photoBase64);
          onClose();
        }
      }
    }
  };

  const handleAcceptPhoto = () => {
    if (previewPhoto) {
      onTakePicture(previewPhoto);
      setPreviewPhoto(null);
      // NO llamar a onClose() aquí - el padre manejará el cierre después de onTakePicture
    }
  };

  const handleRejectPhoto = () => {
    setPreviewPhoto(null);
  };

  const handleClose = () => {
    setPreviewPhoto(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.cameraCloseContainer}>
        <Foundation
          name="x-circle"
          size={50}
          color="white"
          onPress={handleClose}
          style={styles.cameraCloseBtn}
        />
        
        {previewPhoto ? (
          // Vista de preview de la foto
          <Pressable 
            style={styles.previewContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <Image 
              source={{ uri: previewPhoto }} 
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.previewButtonsContainer}>
              <Button
                mode="contained"
                onPress={handleRejectPhoto}
                buttonColor={theme.colors.error}
                icon="close"
                style={styles.previewButton}
              >
                Repetir
              </Button>
              <Button
                mode="contained"
                onPress={handleAcceptPhoto}
                buttonColor={theme.colors.primary}
                icon="check"
                style={styles.previewButton}
              >
                Aceptar
              </Button>
            </View>
          </Pressable>
        ) : (
          // Vista de cámara
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              animateShutter={false}
              facing="back"
            />
            {permission?.granted ? (
              <FontAwesome6
                style={styles.captureButton}
                name="circle"
                size={80}
                color="white"
                onPress={handleTakePicture}
              />
            ) : (
              <Pressable onPress={handlePermissions} style={styles.permissionButton}>
                <CustomButton label="Permitir acceso a la camara" />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cameraCloseContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
  cameraCloseBtn: {
    alignSelf: "flex-end",
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    zIndex: 10,
  },
  permissionButton: {
    position: 'absolute',
    bottom: 40,
    zIndex: 10,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  previewButton: {
    flex: 1,
  },
});
