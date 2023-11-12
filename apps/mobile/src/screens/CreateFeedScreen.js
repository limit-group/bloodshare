import React, { useState } from "react";
import { Image,View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../utils/styles";
import {
  ActivityIndicator,
  Button,
  Chip,
  HelperText,
  Snackbar,
  TextInput,
  Title,
} from "react-native-paper";
import axios from "axios";
import { url } from "../utils/api";
import { getError } from "../utils/error";
import { getValue, save } from "../utils/auth";

export default function CreateFeedScreen({ navigation }) {
  const [description, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const onDismissSnackBar = () => setVisible(false);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const onFeedPress = async () => {
    if (!description) {
      setError("Please give information about the event!");
      setVisible(true);
      return;
    }
    const token = await getValue("token");
    let localUri = image;
    const formData = new FormData();
    if(localUri) {
       let filename = localUri.split("/").pop();
       let match = /\.(\w+)$/.exec(filename);
       let type = match ? `image/${match[1]}` : `image`;
      formData.append("media", { uri: localUri, name: filename, type });
    }
    formData.append("description", description);
    setLoading(true);
    axios
      .post(`${url}/api/feeds`, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201) {
          setLoading(false);
          navigation.navigate("Feed");
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(getError(err));
        setVisible(true);
      });
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 50,
          }}
        >
          <Title>Start post....</Title>
          <Chip icon="camera" onPress={pickImage} mode="outlined">
            media
          </Chip>
        </View>
        {image && (
          <View
            style={[
              { width: "100%", height: 200, paddingLeft: 30, paddingRight: 30 },
            ]}
          >
            <Image
              source={{ uri: image }}
              style={[{ width: "100%", height: 200, paddingLeft: 30 }]}
            />
          </View>
        )}
        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={4}
          mode="outlined"
          outlineColor="#fc7d7b"
          placeholder="about the donation drive..."
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setDesc(text)}
          value={description}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <View style={{ padding: 30, paddingTop: 0 }}>
          <HelperText>
            Use the media button to add a custom poster graphic about the
            donation drive.
          </HelperText>
          {loading ? (
            <ActivityIndicator animating={true} size={50} />
          ) : (
            <Button
              mode="contained"
              onPress={onFeedPress}
              style={styles.rounded}
            >
              Annonce Drive <MaterialCommunityIcons name="share" size={16} />
            </Button>
          )}
        </View>
      </KeyboardAwareScrollView>
      <Snackbar
        visible={visible}
        duration={1000}
        style={{ backgroundColor: "#fc7d7b" }}
        onDismiss={onDismissSnackBar}
        action={{
          label: "ok",
          onPress: () => {},
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}
