import React, {useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {ActivityIndicator, Button, HelperText, Snackbar, TextInput, Title,} from "react-native-paper";
import styles from "../utils/styles";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import axios from "axios";
import {url} from "../utils/api";
import {getValue} from "../utils/auth";
import {getError} from "../utils/error";

export default function CreateDonationScreen({ navigation }) {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState("");
  const onDismissSnackBar = () => setVisible(false);
  const [show, setShow] = useState(false);
  const [facility, setFacility] = useState("");
  const [loading, setLoading] = useState(false);
  const [donor_number, setDonation] = useState("");
  const [date, setDate] = useState(new Date());
  const det = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
  const onChange = (event, selectedDate) => {
    setDate(selectedDate);
    setShow(true);
  };
  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };
  const showDatepicker = () => {
    showMode("date");
  };
  const onFooterLinkPress = () => {
    navigation.navigate("Login");
  };
  const onCompletePress = async () => {
    if (!facility) {
      setError("Facility name is required!");
      setVisible(true);
      return;
    }
    if (!donor_number) {
      setError("Donor ID is required!");
      setVisible(true);
      return;
    }
    if (!date) {
      setError("Donor date is required!");
      setVisible(true);
      return;
    }
    setLoading(true);
    const token = await getValue("token");
    axios
      .post(
        `${url}/api/donations`,
        { donor_number, facility, date },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          setLoading(false);
          navigation.navigate("Thank You");
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
        <View style={styles.input}>
          <Title>
            Record a donation made to save lives and earn life points.
          </Title>
        </View>
        <TextInput
          style={styles.input}
          label="Facility Name"
          mode="outlined"
          outlineColor="#fc7d7b"
          left={<TextInput.Icon icon={"hospital-building"} />}
          placeholder="e.g RedCross"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFacility(text)}
          value={facility}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          outlineColor="#fc7d7b"
          label="Donation ID"
          left={<TextInput.Icon icon={"identifier"} />}
          mode="outlined"
          placeholder="e.g RC0001"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setDonation(text)}
          value={donor_number}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <HelperText style={styles.input}>
          * Number issued to your to recognize you as a donor.
        </HelperText>
        <View style={{ paddingLeft: 30, paddingRight: 30, paddingTop: 5 }}>
          <Button mode="contained" onPress={showDatepicker}>
            <MaterialCommunityIcons name="calendar" size={16} />{" "}
            {show ? det : "Date of Donation"}
          </Button>
        </View>
        {loading ? (
          <ActivityIndicator animating={true} size={50} />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => onCompletePress()}
          >
            <Text style={styles.buttonTitle}>Record donation</Text>
          </TouchableOpacity>
        )}
        <View style={styles.input}>
          <Text style={styles.footerText}>
            Your data will be processed according to our{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Privacy Policy.
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
      <Snackbar
        visible={visible}
        duration={1000}
        style={{ backgroundColor: "#fc7d7b" }}
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