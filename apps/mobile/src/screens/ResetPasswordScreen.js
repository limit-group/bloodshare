import axios from "axios";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ActivityIndicator,
  HelperText,
  Snackbar,
  TextInput,
} from "react-native-paper";
import { url } from "../utils/api";
import styles from "../utils/styles";

export default function ResetPasswordScreen({ navigation, route }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const onDismissSnackBar = () => setVisible(false);
  const [error, setError] = React.useState("");
  let { phone } = route.params.phone;
  const onResetPress = () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      setVisible(true);
      return;
    }
    setLoading(true);
    axios
      .post(`${url}/api/auth/password`, { phone, password })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          navigation.navigate("Settings");
        }
      })
      .catch((err) => {
        setLoading(false);
        setError("Password Reset Request failed.");
        setVisible(true);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image style={styles.logo} source={require("../../assets/reset.png")} />
        <View style={{ flex: 1, marginLeft: 30 }}>
          <Text style={[{ fontWeight: "bold", fontSize: 28 }]}>
            Reset Password.
          </Text>
          <HelperText>
            Make it memorable but not obvious! If you forget it we will help
            your recover it.
          </HelperText>
        </View>
        <TextInput
          style={styles.input}
          secureTextEntry
          label="New Password"
          mode="outlined"
          left={<TextInput.Icon icon={"shield-lock-outline"} />}
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          mode="outlined"
          left={<TextInput.Icon icon={"shield-lock-outline"} />}
          label="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        {loading ? (
          <View style={{ margin: 10 }}>
            <ActivityIndicator animating={true} size={50} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => onResetPress()}
          >
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