import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {  Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import styles from "../utils/styles";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Chip,
  Snackbar,
  TextInput,
} from "react-native-paper";
import axios from "axios";
import { url } from "../utils/api";
import { getValue } from "../utils/auth";
import { getError } from "../utils/error";

export default function EditProfile({ navigation }) {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState("");
  const onDismissSnackBar = () => setVisible(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const [profile, setProfile] = React.useState("");
  const [new_profile, setNewProfile] = useState({
    gender: profile.gender,
    email: profile.email,
    fullName: profile.fullName,
    dob: profile.dateOfBirth,
    bodyWeight: profile.bodyWeight,
    bloodType: profile.bloodType,
  });
  if (new_profile.dob) {
    const date =
      new_profile.dob.getFullYear() +
      "-" +
      new_profile.dob.getMonth() +
      "-" +
      new_profile.dob.getDate();
  }
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDob(currentDate);
    setShow(true);
  };
  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };
  const handleChange = (e) => {
    setNewProfile({
      ...new_profile,
      [e.target.name]: e.target.value,
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
  const onCompletePress = async () => {
    React.useEffect(() => {
      const findUser = async () => {
        const token = await getValue("token");
        axios
          .get(`${url}/api/auth/profiles`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => {
            setError(getError(err));
            setVisible(true);
          });
      };
      findUser().catch((err) => setError(getError(err)));
    }, []);
    const token = await getValue("token");
    const formData = new FormData();
    if (image) {
      let localUri = image;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      formData.append("image", { uri: localUri, name: filename, type });
    }
    formData.append("fullName", new_profile.fullName);
    formData.append("email", new_profile.email);
    formData.append("dob", new_profile.dob);
    formData.append("gender", new_profile.gender);
    formData.append("bodyWeight", new_profile.bodyWeight);
    formData.append("bloodType", new_profile.bloodType);
    if (formData) {
      setLoading(true);
      axios
        .post(`${url}/api/auth/profiles/update`, formData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then(async (res) => {
          if (res.status == 200) {
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
    } else {
      setLoading(false);
      setError("Complete all fields");
      setVisible(true);
    }
  };
  return (
    <View style={[styles.container]}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ flex: 1, marginLeft: 30 }}>
        </View>
        <View
          style={{
            marginLeft: 30,
            marginRight: 30,
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          {profile.avatar ? (
            <Avatar.Image
              size={104}
              source={{ uri: `${url}/avatars/${profile.avatar}` }}
            />
          ) : (
            <Avatar.Image
              size={104}
              source={require("../../assets/avatar.png")}
            />
          )}
          <Chip
            icon="camera"
            onPress={pickImage}
            mode="outlined"
            style={{ height: 50, top: 50 }}
          >
            edit
          </Chip>
        </View>

        <TextInput
          style={styles.input}
          label="Full Name"
          placeholder="john doe"
          name="fullName"
          left={<TextInput.Icon icon={"square-edit-outline"} />}
          onChangeText={handleChange}
          value={new_profile.name}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          label="Email"
          placeholder="johndoe@gmail.com"
          keyboardType="email-address"
          left={<TextInput.Icon icon={"email-outline"} />}
          onChangeText={handleChange}
          value={new_profile.email}
          outlineColor="#fc7d7b"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          outlineColor="#fc7d7b"
          placeholder="e.g 50"
          label="Body Weight(in Kgs)"
          keyboardType="numeric"
          left={<TextInput.Icon icon={"weight-lifter"} />}
          onChangeText={handleChange}
          value={profile.bodyWeight}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Button
          onPress={showDatepicker}
          mode="outlined"
          outlineColor="#fc7d7b"
          style={styles.pickButton}
        >
          <MaterialCommunityIcons name="calendar" />
          {show ? date : "Date of Birth"}
        </Button>
        <Picker
          selectedValue={new_profile.bloodType}
          mode="dropdown"
          style={[
            styles.input,
            { borderColor: "#000", borderWidth: 3, backgroundColor: "#fc7d7b" },
          ]}
          name="bloodType"
          onValueChange={(itemValue, itemIndex) => handleChange(itemValue)}
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
            label="Group B -"
            value="B_NEGATIVE"
            style={{ fontWeight: "bold" }}
          />
          <Picker.Item
            label={new_profile.bloodType}
            value={new_profile.bloodType}
          />
        </Picker>
        {loading ? (
          <ActivityIndicator animating={true} size={50} />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => onCompletePress()}
          >
            <Text style={styles.buttonTitle}>Save</Text>
          </TouchableOpacity>
        )}
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
