import axios from "axios";
import React, { useState } from "react";
import { Image,View } from "react-native";
import { ActivityIndicator, Button, Snackbar, Title } from "react-native-paper";
import { url } from "../utils/api";
import { getValue } from "../utils/auth";
import { getError } from "../utils/error";
import styles from "../utils/styles";

export default function AcceptDonationScreen({ route, navigation }) {
  const [visibo, setVisibo] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = useState(false);
  const onDismissSnackBar = () => setVisibo(false);
  const onAccept = async () => {
    const token = await getValue("token");
    const { id } = route.params;
    if (id) {
      setLoading(true);
      axios
        .get(`${url}/api/requests/accept/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status === 201) {
            navigation.navigate("Thank You");
          } else if (res.status === 200) {
            setError(res.data.message);
            setVisibo(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(getError(err));
          setVisibo(true);
        });
    } else {
    }
  };
  const onDecline = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image
        style={{
          height: 270,
          width: "100%",
          borderRadius: 50,
        }}
        source={require("../../assets/map.png")}
      />
      <View style={{ margin: 30 }}>
        <Title style={{ textAlign: "center" }}>
          Accept to go and donate.{" \n"}You will recieve map directions in sms.
        </Title>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 50,
          }}
        >
          {loading ? (
            <View style={{ margin: 10 }}>
              <ActivityIndicator animating={true} size={50} />
            </View>
          ) : (
            <>
              <Button onPress={onDecline} mode="outlined" icon={"cancel"}>
                Decline
              </Button>
              <Button
                onPress={onAccept}
                mode="contained"
                icon={"check-circle-outline"}
              >
                Accept
              </Button>
            </>
          )}
        </View>
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
            onDismissSnackBar();
          },
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}