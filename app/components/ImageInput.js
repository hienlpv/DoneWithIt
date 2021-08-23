import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import colors from "../config/colors";

function ImageInput({ imageUri, onChangeImage }) {
  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library.");
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.cancelled) {
        let uri = `data:image/jpg;base64,${result.base64}`;
        onChangeImage(uri);
      }
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };

  const handlePress = () => {
    if (!imageUri) selectImage();
    else
      Alert.alert("Delete", "Are you sure to delete this image", [
        { text: "Yes", onPress: () => onChangeImage(imageUri) },
        { text: "No" },
      ]);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <MaterialCommunityIcons
            name="camera"
            color={colors.medium}
            size={40}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageInput;
