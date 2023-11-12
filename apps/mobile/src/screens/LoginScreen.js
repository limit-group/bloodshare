import React, { useEffect, useState } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator, Snackbar, TextInput } from "react-native-paper";
import styles from "../utils/styles";
import axios from "axios";
import { url } from "../utils/api";
import { getError } from "../utils/error";
import { getValue } from "../utils/auth";
import * as SecureStore from "expo-secure-store";
import Onboarding from "react-native-onboarding-swiper";

export default function LoginScreen({ navigation }) {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState("");
  const onDismissSnackBar = () => setVisible(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("+2547");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const handleOnboarding = async () => {
    await SecureStore.setItemAsync("onboarded", "done");
    setOnboarded(false);
  };
  const onFooterLinkPress = () => {
    navigation.navigate("Registration");
  };
  const toForgot = () => {
    navigation.navigate("Forgot Password");
  };
  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  const onLoginPress = async () => {
    const re =
      /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
    if (phone.length < 10 || !re.test(phone)) {
      setError("Enter valid phone number.");
      setVisible(true);
      return;
    }
    setLoading(true);
    const prof = await getValue("profile");
    axios
      .post(`${url}/api/auth/login`, { phone, password })
      .then((res) => {
        if (res.status === 200) {
          save("token", res.data.token);
          setLoading(false);
          if (prof == null) {
            navigation.navigate("Complete Profile");
          } else {
            navigation.navigate("BloodShare");
          }
        } else {
          setError("Wrong login credentials!");
          setVisible(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(getError(err));
        setVisible(true);
      });
  };
  const isAuth = async () => {
    const token = await getValue("onboarded");
    const log = await getValue("token");

    if (token !== "done" || token == null) {
      setOnboarded(true);
    } else {
      setOnboarded(false);
    }
    if (log == null) {
      navigation.navigate("Login");
    }
  };
  useEffect(() => {
    isAuth().catch((err) => {
      setError(getError(err));
    });
  }, [onboarded]);
  return (
    <>
      <StatusBar
        barStyle="light-content"
        animated={true}
        backgroundColor="#fc7d7b"
      />
      {onboarded ? (
        <Onboarding
          bottomBarColor="#fc7d7b"
          onDone={handleOnboarding}
          pages={[
            {
              backgroundColor: "#fff",
              image: (
                <Image
                  source={require("../../assets/nothing.png")}
                  style={{
                    height: 270,
                    margin: 30,
                    padding: 10,
                    width: "100%",
                    borderRadius: 50,
                  }}
                />
              ),
              title: "Welcome to BloodShare",
              subtitle:
                "A blood donation request app making blood donations easy",
            },
            {
              backgroundColor: "#fff",
              image: (
                <Image
                  source={require("../../assets/accept.png")}
                  style={{
                    height: 270,
                    margin: 30,
                    padding: 10,
                    width: "100%",
                    borderRadius: 50,
                  }}
                />
              ),
              title: "Request for blood donations",
              subtitle:
                "ask people to donate for you, your family or even friends when in need.",
            },
            {
              backgroundColor: "#fff",
              image: (
                <Image
                  source={require("../../assets/signup.png")}
                  style={{
                    height: 270,
                    margin: 30,
                    padding: 10,
                    width: "100%",
                    borderRadius: 50,
                  }}
                />
              ),
              title: "Find blood donation drives",
              subtitle:
                "Announce blood drives and find scheduled donations around you",
            },
            {
              backgroundColor: "#fff",
              image: (
                <Image
                  source={require("../../assets/map.png")}
                  style={{
                    height: 200,
                    margin: 30,
                    width: "100%",
                    borderRadius: 50,
                  }}
                />
              ),
              title: "Monitor places you have donated to.",
              subtitle:
                "Record everytime you donate and earn life saving points as a donor, boosting your blood profile.",
            },
          ]}
        />
      ) : (
        <View style={styles.container}>
          <KeyboardAwareScrollView
            style={{ flex: 1, width: "100%" }}
            keyboardShouldPersistTaps="always"
          >
            <Image
              style={styles.logo}
              source={require("../../assets/login.png")}
            />
            <View style={{ flex: 1, marginLeft: 30 }}>
              <Text style={[{ fontWeight: "bold", fontSize: 28 }]}>Login.</Text>
            </View>
            <TextInput
              style={styles.input}
              label="Mobile Number"
              mode="outlined"
              outlineColor="#fc7d7b"
              keyboardType="phone-pad"
              placeholder="+2547.."
              left={<TextInput.Icon icon={"cellphone"} />}
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setPhone(text)}
              value={phone}
            />
            <TextInput
              style={styles.input}
              outlineColor="#fc7d7b"
              label="Password"
              placeholderTextColor="#aaaaaa"
              secureTextEntry={show}
              mode="outlined"
              left={<TextInput.Icon icon={"shield-lock-outline"} />}
              right={
                <TextInput.Icon icon={"eye"} onPress={() => setShow(!show)} />
              }
              onChangeText={(text) => setPassword(text)}
              value={password}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />

            <Text style={styles.left} onPress={toForgot}>
              Forgot password?
            </Text>

            {loading ? (
              <View style={{ margin: 10 }}>
                <ActivityIndicator animating={true} size={50} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => onLoginPress()}
              >
                <Text style={styles.buttonTitle}>Login</Text>
              </TouchableOpacity>
            )}

            <View style={styles.footerView}>
              <Text style={styles.footerText}>
                Don't have an account?{" "}
                <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                  Sign up
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
      )}
    </>
  );
}
