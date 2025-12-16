import { Foundation } from "@expo/vector-icons";
import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useState,
} from "react";
import { useTheme } from "react-native-paper";
import { CameraModal } from "./CameraModal";

type TakePictureBtnProps = {
  setImagen: Dispatch<SetStateAction<string | null>>;
};

export const TakePictureBtn: FC<TakePictureBtnProps> = ({ setImagen }) => {
  const theme = useTheme();
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handleTakePicture = (photoBase64: string) => {
    setImagen(photoBase64);
  };

  return (
    <Fragment>
      <Foundation
        name="camera"
        size={30}
        color={theme.colors.onPrimary}
        backgroundColor={theme.colors.primary}
        style={{ position: 'absolute', borderRadius: 50, top: 190, right: 15, padding: 10 }}
        onPress={handleOpenCamera}
      />
      <CameraModal
        visible={showCamera}
        onClose={handleCloseCamera}
        onTakePicture={handleTakePicture}
      />
    </Fragment>
  );
};
