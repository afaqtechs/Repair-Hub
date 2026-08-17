import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      "Permission Required",
      "Please allow access to your photo library."
    );
    return false;
  }

  return true;
};