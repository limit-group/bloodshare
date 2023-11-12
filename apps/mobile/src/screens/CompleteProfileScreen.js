import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import styles from "../utils/styles";
import {
  ActivityIndicator,
  Avatar,
  Button,
  HelperText,
  RadioButton,
  Snackbar,
  TextInput,
} from "react-native-paper";

import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { url } from "../utils/api";
import { getValue } from "../utils/auth";
import { getError } from "../utils/error";

export default function CompleteProfileScreen({ navigation }) {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState("");
  const onDismissSnackBar = () => setVisible(false);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [bodyWeight, setBodyWeight] = useState("");
  const [dob, setDob] = useState(new Date());
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const date = dob.getFullYear() + "-" + dob.getMonth() + "-" + dob.getDate();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDob(currentDate);
    setShow(true);
  };
  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: dob,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };
  const showDatepicker = () => {
    showMode("date");
  };
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
  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
    return;
  }
  const onCompletePress = async () => {
    const token = await getValue("token");
    const formData = new FormData();
    if (image) {
      let localUri = image;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      formData.append("image", { uri: localUri, name: filename, type });
    }
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("bodyWeight", bodyWeight);
    formData.append("bloodType", bloodType);
    if (!formData) {
      setLoading(false);
      setError("Failed to complete profile");
      setVisible(true);
    }
    setLoading(true);
    axios
      .post(`${url}/api/auth/profiles`, formData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        if (res.status == 201) {
          await save("profile", "complete");
          setLoading(false);
          navigation.navigate("BloodShare");
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(getError(err));
        setVisible(true);
      });
  };
  React.useEffect(() => {
    async function getStatus() {
      const status = await getValue("token");
      if (status == null) {
        navigation.navigate("Login");
        return;
      }
      const prof = await getValue("profile");
      if (prof != "complete") {
        navigation.navigate("BloodShare");
      }
    }
    getStatus().catch((err) => {
      setError(getError(err));
    });
  }, []);
  return (
    <View style={[styles.container]}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%", paddingBottom: 20 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ flex: 1, marginLeft: 30, paddingTop: 20 }}>
          <Text
            style={[{ fontWeight: "bold", fontSize: 28, textAlign: "center" }]}
          >
            Complete Profile.
          </Text>
          <HelperText>You know about us, help us know you too.</HelperText>
        </View>
        <View style={{ marginLeft: 30, alignItems: "center" }}>
          {image ? <Avatar.Image size={104} source={{ uri: image }} /> : ""}
        </View>

        <TextInput
          style={styles.input}
          label="Full Name"
          placeholder="john doe"
          mode="outlined"
          left={<TextInput.Icon icon={"square-edit-outline"} />}
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          outlineColor="#fc7d7b"
        />
        <TextInput
          style={styles.input}
          label="Email"
          mode="outlined"
          // outlineColor="#fc7d7b"
          placeholder="johndoe@gmail.com"
          keyboardType="email-address"
          left={<TextInput.Icon icon={"email-outline"} />}
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Button
          onPress={showDatepicker}
          mode="outlined"
          // textColor="#000"
          style={styles.pickButton}
        >
          <MaterialCommunityIcons name="calendar" />
          {show ? date : "Date of Birth"}
        </Button>
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          mode="outlined"
          placeholder="e.g 50"
          label="Body Weight(in Kgs)"
          keyboardType="numeric"
          left={<TextInput.Icon icon={"weight-lifter"} />}
          onChangeText={(text) => setBodyWeight(text)}
          value={bodyWeight}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <RadioButton.Group
          onValueChange={(value) => setGender(value)}
          value={gender}
        >
          <View style={[styles.input, { flexDirection: "row" }]}>
            <Text>Male</Text>
            <RadioButton value="MALE" />

            <Text>Female</Text>
            <RadioButton value="FEMALE" />

            <Text>Non binary</Text>
            <RadioButton value="NON_BINARY" />
          </View>
        </RadioButton.Group>
        <Button onPress={pickImage} mode="outlined" style={styles.pickButton}>
          <MaterialCommunityIcons name="camera" size={16} /> profile picture
        </Button>
        <Picker
          selectedValue={bloodType}
          mode="dropdown"
          style={[
            styles.input,
            {
              borderColor: "#000",
              borderWidth: 3,
              backgroundColor: "#fc7d7b",
              color: "#ffffff",
            },
          ]}
          onValueChange={(itemValue, itemIndex) => setBloodType(itemValue)}
        >
          <Picker.Item
            label="Group O -"
            value="O_NEGATIVE"
            style={{ fontWeight: "bold" }}
          />
          <Picker.Item
            label="Group O +"
            value="O_POSITIVE"
            style={{ fontWeight: "bold" }}
          />
          <Picker.Item
            label="Group A +"
            value="A_POSITIVE"
            style={{ fontWeight: "bold" }}
          />
          <Picker.Item
            label="Group AB +"
            value="AB_POSITIVE"
            style={{ fontWeight: "bold" }}
          />
          <Picker.Item
            label="Group AB -"
            value="AB_NEGATIVE"
            style={{ fontWeight: "bold" }}
          />
          <Picker.Item
            label="Group B +"
            value="B_POSITIVE"
            style={{ fontWeight: "bold" }}
          />
          <Picker.Item
            label="Group B-"
            value="B_NEGATIVE"
            style={{ fontWeight: "bold" }}
          />
          <Picker.Item
            label="Blood Group"
            value=""
          />
        </Picker>
        <View style={{ paddingBottom: 10 }}>
          {loading ? (
            <ActivityIndicator animating={true} size={50} />
          ) : (
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => onCompletePress()}
            >
              <Text style={styles.buttonTitle}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
      <Snackbar
        visible={visible}
        style={{ backgroundColor: "#fc7d7b" }}
        duration={1000}
        onDismiss={onDismissSnackBar}
        action={{
          label: "ok",
          onPress: () => {
            // Do something
          },
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}
