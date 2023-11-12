import axios from "axios";
import React from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { AnimatedFAB, Button, List, Snackbar, Title } from "react-native-paper";
import { url } from "../utils/api";
import { getValue } from "../utils/auth";
import { getError } from "../utils/error";
import moment from "moment";
export default function DonationScreen({
  navigation,
  visible,
  animateFrom,
  style,
}) {
  const [isExtended, setIsExtended] = React.useState(true);
  const [donations, setDonations] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [visibo, setVisibo] = React.useState(false);
  const onDismissSnackBar = () => setVisible(false);
  const [error, setError] = React.useState("");
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };
  const fabStyle = { [animateFrom]: 16 };
  const toDonor = () => {
    navigation.navigate("Record Donation");
  };
  const getDonations = async () => {
    const token = await getValue("token");
    if (token) {
      axios
        .get(`${url}/api/donations/me`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setDonations(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(getError(err));
        });
    } else {
      setError("You are not logged In");
      setVisibo(true);
    }
  };
  React.useEffect(() => {
    getDonations().catch((err) => {
      setError(getError(err));
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView onScroll={onScroll}>
        {donations.length > 0 ? (
          <>
            {donations.map((donation) => (
              <List.Section
                style={{ paddingLeft: 30, paddingRight: 30 }}
                key={donation.id}
              >
                <List.Subheader>
                  On {moment(donation.createdAt).format("dddd, MMMM Do YYYY")}
                </List.Subheader>
                <List.Item
                  title={donation.facility}
                  left={() => <List.Icon icon="hospital-marker" />}
                />
                <List.Item
                  title={donation.donorNumber}
                  left={() => <List.Icon icon="card-account-details-outline" />}
                />
              </List.Section>
            ))}
          </>
        ) : (
          <View style={{ paddingTop: 30 }}>
            <Image
              style={{
                height: 270,
                width: "100%",
                borderRadius: 50,
              }}
              source={require("../../assets/no_data.png")}
            />
            <Button
              style={{ margin: 20 }}
              mode="contained"
              onPress={() => navigation.navigate("Record Donation")}
            >
              Donate to earn more life points..
            </Button>
          </View>
        )}
        <Title style={{ textAlign: "center", color: "#fc7d7b" }}>
          Continue saving more lives. &#128079;
        </Title>
      </ScrollView>
      <AnimatedFAB
        icon={"arrow-right"}
        label={"donated now"}
        color="#000"
        extended={isExtended}
        onPress={toDonor}
        visible={visible}
        animateFrom={"right"}
        iconMode={"static"}
        style={[styles.fabStyle, style, fabStyle]}
      />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#ffffff",
  },
  fabStyle: {
    bottom: 36,
    right: 16,
    position: "absolute",
    backgroundColor: "#ffffff",
  },
});
