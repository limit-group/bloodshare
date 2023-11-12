import axios from "axios";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ActivityIndicator,
  Button,
  HelperText,
  Snackbar,
  TextInput,
} from "react-native-paper";
import { url } from "../utils/api";
import { getError } from "../utils/error";
import styles from "../utils/styles";

export default function VerifyScreen({ navigation, route }) {
  const { phone } = route.params;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibo, setVisibo] = React.useState(false);
  const onDismissSnackBar = () => setVisibo(false);
  const [error, setError] = React.useState("");
  const onVerifyPress = () => {
    setLoading(true);
    axios
      .post(`${url}/api/auth/verify`, { code, phone })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setError(res.data.message);
          setVisibo(true);
          navigation.navigate("Login");
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(getError(err));
        setVisibo(true);
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
          source={require("../../assets/verify.png")}
        />
        <View style={{ flex: 1, marginLeft: 30, marginRight: 30 }}>
          <Text style={[{ fontWeight: "bold", fontSize: 28 }]}>Enter OTP</Text>
          <Text>
            Check your inbox for a 4 digit code has been sent to you phone
          </Text>
        </View>
        <TextInput
          style={styles.input}
          label="4-digit-code"
          mode="outlined"
          keyboardType="numeric"
          placeholder="e.g 1234"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setCode(text)}
          value={code}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        {loading ? (
          <ActivityIndicator animating={true} size={50} />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => onVerifyPress()}
          >
            <Text style={styles.buttonTitle}>Verify</Text>
          </TouchableOpacity>
        )}

        <View style={styles.input}>
          <HelperText style={{ textAlign: "center" }}>
            Not received the code?
          </HelperText>
          <Button>Resend</Button>
        </View>
      </KeyboardAwareScrollView>
      <Snackbar
        visible={visibo}
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