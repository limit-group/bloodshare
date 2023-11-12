import React, { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Image, Text, View } from "react-native";
import styles from "../utils/styles";
import { Button, HelperText, Snackbar } from "react-native-paper";
import { url } from "../utils/api";
import { getError } from "../utils/error";
import axios from "axios";
import getValue from "../utils/auth";

export default function ConfirmScreen({ route, navigation }) {
  const [visibo, setVisibo] = React.useState(false);
  const [error, setError] = React.useState("");
  const onDismissSnackBar = () => setVisibo(false);
  const onGo = async () => {
    const token = await getValue("token");
    const { id } = route.params;
    if (id) {
      axios
        .get(`${url}/api/requests/accept/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 201) {
            navigation.navigate("Thank You");
          }
        })
        .catch((err) => {
          setError(getError("failed to confirm donation"));
          setVisibo(true);
        });
    } else {
      setError("failed to confirm donation");
      setVisibo(true);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={{ height: 270, marginTop: 40, width: "100%", borderRadius: 50 }}
        source={require("../../assets/confirm.png")}
      />
      <View style={[styles.footerView, { margin: 30 }]}>
        <Text style={styles.footerText}>
          You are accepting to donate blood and save lives.
        </Text>
        <HelperText>
          when you click confirm, google maps directions will be shared to your
          mobile through sms to help you locate the health facility where blood
          is required.
        </HelperText>
        <Button
          mode="contained"
          onPress={() => onGo()}
          style={{ marginTop: 20 }}
        >
          <Text style={styles.buttonTitle}>
            Confirm
            <MaterialCommunityIcons name="check" />
          </Text>
        </Button>
      </View>
      <Snackbar
        visible={visibo}
        duration={1000}
        style={{ backgroundColor: "#fc7d7b" }}
        onDismiss={onDismissSnackBar}
        action={{
          label: "OK",
          color: "white",
          onPress: () => {
            onDismissSnackBar;
          },
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}
