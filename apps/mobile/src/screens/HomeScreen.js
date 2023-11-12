import React, { useEffect, useState } from "react";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Paragraph,
  Snackbar,
} from "react-native-paper";
import axios from "axios";
import { url } from "../utils/api";
import { getValue } from "../utils/auth";
import Navbar from "../components/Navbar";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import * as NavigationBar from "expo-navigation-bar";
import { getError } from "../utils/error";

export default function HomeScreen({ navigation }) {
  NavigationBar.setBackgroundColorAsync("#fc7d7b");
  const [visible, setVisible] = React.useState(false);
  const onDismissSnackBar = () => setVisible(false);
  const [error, setError] = React.useState("");
  const [free, setFree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [req_count, setReqCount] = useState(0);
  const [don_count, setDonCount] = useState(0);
  const [my_lat, setMyLat] = useState(null);
  const [my_long, setMyLong] = useState(null);
  const toConfirm = (id) => {
    navigation.navigate("Accept To Donate", { id: id });
  };
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access location was denied");
      setVisible(true);
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    location = JSON.parse(JSON.stringify(location));
    setMyLat(location.coords.latitude);
    setMyLong(location.coords.longitude);
  };
  const getLatest = async () => {
    const token = await getValue("token");
    if (token) {
      axios
        .get(`${url}/api/requests/latest`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRequests(res.data.requests);
          setReqCount(res.data.request_count);
          setDonCount(res.data.donations_count);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      setError("You are not logged In");
      setVisible(true);
    }
  };
  const isAuth = async () => {
    const token = await getValue("token");
    if (token == null) {
      navigation.navigate("Login");
    }
  };
  React.useEffect(() => {
    isAuth().catch((err) => {
      setError(getError(err));
    });
    getLatest().catch((err) => {
      setError(getError(err));
    });
    getLocation().catch((err) => {
      setError(getError(err));
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        animated={true}
        backgroundColor="#fc7d7b"
      />
      <Navbar props={{ name: "Welcome" }} />
      <ScrollView>
        <View style={styles.cards}>
          <Card style={styles.space}>
            <Card.Content>
              <IconButton
                icon="magnify"
                size={20}
                mode="outlined"
                onPress={() => navigation.navigate("Request for Blood")}
              />
              <Paragraph>find donor</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.space}>
            <Card.Content>
              <IconButton
                icon="hospital"
                size={20}
                mode="outlined"
                onPress={() => navigation.navigate("announce donation drive")}
              />
              <Paragraph>post drive.</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.space}>
            <Card.Content style={{ alignContent: "center" }}>
              <IconButton
                icon="car"
                mode="outlined"
                size={20}
                onPress={() => navigation.navigate("My Donations")}
              />
              <Paragraph>donations</Paragraph>
            </Card.Content>
          </Card>
        </View>
        <View
          style={{
            justifyContent: "space-evenly",
            flexDirection: "row",
            paddingTop: 20,
          }}
        >
          <Text variant="titleLarge">
            <Text style={{ fontSize: 26 }}>{req_count} </Text>
            <Fontisto name="blood-drop" size={28} color="#d0312d" /> requests.
          </Text>
          <View style={styles.verticleLine}></View>
          <Text variant="bodyMedium">
            <Text style={{ fontSize: 26 }}>{don_count} </Text>
            <Octicons name="people" size={28} /> donating.
          </Text>
        </View>
        <View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingTop: 20,
            }}
          >
            <Paragraph style={{ paddingLeft: 10, textAlign: "left" }}>
              Patient List
            </Paragraph>
            <MaterialCommunityIcons
              name={"filter-variant"}
              style={{ textAlign: "right", paddingRight: 10 }}
            />
          </View>
          {loading ? (
            <View style={{ paddingTop: 50 }}></View>
          ) : (
            <View style={{ paddingTop: 30 }}>
              {requests.length > 0 && (
                <>
                  {requests.map((req) => (
                    <View key={req.id}>
                      <Card
                        style={{ backgroundColor: "#fee8e8" }}
                        mode="contained"
                        onPress={() =>
                          navigation.navigate("Patient Info", { req: req })
                        }
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            marginTop: 10,
                          }}
                        >
                          <View>
                            <Avatar.Text size={34} label={req.accept} />
                            <Paragraph
                              style={{ fontWeight: "100", fontSize: 12 }}
                            >
                              <Octicons name="people" size={18} /> accepted
                            </Paragraph>
                          </View>
                          <Paragraph
                            style={{ textAlign: "center", fontWeight: "100" }}
                          >
                            Request for:{" "}
                            <Paragraph style={{ fontWeight: "bold" }}>
                              {req.patientName}
                            </Paragraph>
                          </Paragraph>
                        </View>
                        <Card.Content>
                          <View
                            style={{
                              justifyContent: "space-evenly",
                              flexDirection: "row",
                              paddingBottom: 10,
                              paddingTop: 20,
                            }}
                          >
                            <Paragraph>
                              <Fontisto
                                name="blood-drop"
                                size={18}
                                color="#d0312d"
                              />{" "}
                              {req.bloodGroup}
                            </Paragraph>
                            <Paragraph>
                              <Fontisto name="blood" size={18} />{" "}
                              {req.bloodUnits} blood units
                            </Paragraph>
                          </View>
                          <Card.Actions
                            style={{ justifyContent: "space-between" }}
                          >
                            <Button
                              icon={"google-maps"}
                              mode="text"
                              onPress={() =>
                                Linking.openURL(
                                  `https://www.google.com/maps/dir/?api=1&origin=${my_lat},${my_long}&destination=${req.latitude},${req.longitude}`
                                )
                              }
                            >
                              Directions{" "}
                            </Button>
                            <Button
                              mode="contained"
                              onPress={() => toConfirm(req.id)}
                            >
                              donate <FontAwesome name="smile-o" size={18} />{" "}
                            </Button>
                          </Card.Actions>
                        </Card.Content>
                      </Card>
                      <View
                        style={{
                          padding: 5,
                        }}
                      />
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
        </View>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  highlight: {
    color: "#d0312d",
    // backgroundColor: "#ffffff",
    // backgroundColor: "#d0312d",
    bottom: 5,
  },
  verticleLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#909090",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  search: {
    padding: 5,
  },
  cards: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
  },
  space: {
    backgroundColor: "#ffffff",
    alignContent: "center",
  },
  text: {
    paddingBottom: 50,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "#d0312d",
  },
  logo: {
    flex: 1,
    height: 150,
    width: "100%",
    alignSelf: "center",
    objectFit: "cover",
    margin: 33,
  },
});
