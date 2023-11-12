import axios from "axios";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator, Snackbar, TextInput } from "react-native-paper";
import { url } from "../utils/api";
import styles from "../utils/styles";
import { getError } from "../utils/error";

export default function ForgotPasswordScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState("");
  const onDismissSnackBar = () => setVisible(false);
  const onForgotPress = () => {
    if (!phone) {
      setError("Mobile Number is required!");
      setVisible(true);
      return;
    }
    setLoading(true);
    axios
      .post(`${url}/api/auth/forgot`, { phone })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          navigation.navigate("Reset Password", { phone: phone });
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
        <Image
          style={styles.logo}
          source={require("../../assets/forgot.png")}
        />
        <View style={{ flex: 1, marginLeft: 30 }}>
          <Text style={[{ fontWeight: "bold", fontSize: 28 }]}>
            Forgot Password?
          </Text>
          <Text>
            Don't worry! It happens. Please enter the mobile number associated
            with your account.
          </Text>
        </View>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Mobile Number"
          placeholder="+2547.."
          keyboardType="phone-pad"
          left={<TextInput.Icon icon={"cellphone"} />}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setPhone(text)}
          value={phone}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        {loading ? (
          <View style={{ margin: 10 }}>
            <ActivityIndicator animating={true} size={50} />
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={onForgotPress}>
            <Text style={styles.buttonTitle}>Submit</Text>
          </TouchableOpacity>
        )}
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
