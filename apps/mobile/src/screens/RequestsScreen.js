import axios from "axios";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";
import React, {  useState } from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Image,
  RefreshControl,
} from "react-native";
import {
  AnimatedFAB,
  Paragraph,
  Avatar,
  Button,
  Card,
  Snackbar,
  Title,
} from "react-native-paper";
import Octicons from "react-native-vector-icons/Octicons";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { url } from "../utils/api";
import { getValue } from "../utils/auth";
import { getError } from "../utils/error";
export default function RequestsScreen({
  visible,
  animateFrom,
  style,
  navigation,
}) {
  const toRequest = () => {
    navigation.navigate("Request for Blood");
  };
  const [efeeds, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [my_lat, setMyLat] = useState(null);
  const [my_long, setMyLong] = useState(null);
  const [visibo, setVisibo] = React.useState(false);
  const onDismissSnackBar = () => setVisibo(false);
  const [error, setError] = React.useState("");
  const [isExtended, setIsExtended] = React.useState(true);
  const [, setChange] = useState(false);
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };
  const toConfirm = (id) => {
    navigation.navigate("Accept To Donate", { id: id });
  };
  const fabStyle = { [animateFrom]: 26 };
  const [refreshing, setRefreshing] = useState(true);
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access location was denied");
      setVisibo(true);
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    location = JSON.parse(JSON.stringify(location));
    setMyLat(location.coords.latitude);
    setMyLong(location.coords.longitude);
  };
  const getRequests = async (req, res) => {
    const token = await getValue("token");
    axios
      .get(`${url}/api/requests`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRefreshing(false);
        setFeed(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError("failed to get blood requests.");
        setVisibo(true);
      });
  };
  const change = () => {
    setChange(true);
  };

  React.useEffect(() => {
    getRequests().catch((err) => {
      setError(getError(err));
    });
    getLocation().catch((err) => {
      setError(getError(err));
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        onScroll={onScroll}
        style={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getRequests} />
        }
      >
        {efeeds.length > 0 ? (
          <View>
            {efeeds.map((feed) => (
              <View key={feed.id}>
                <Card
                  style={{ backgroundColor: "#feefef" }}
                  mode="contained"
                  onPress={() =>
                    navigation.navigate("Patient Info", { req: feed })
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
                      <Avatar.Text size={34} label={feed.accept} />
                      <Paragraph style={{ fontWeight: "100", fontSize: 12 }}>
                        <Octicons name="people" size={18} /> accepted
                      </Paragraph>
                    </View>
                    <Paragraph
                      style={{ textAlign: "center", fontWeight: "100" }}
                    >
                      Request for:{" "}
                      <Paragraph style={{ fontWeight: "bold" }}>
                        {feed.patientName}
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
                        <Fontisto name="blood-drop" size={18} color="#d0312d" />{" "}
                        {feed.bloodGroup}
                      </Paragraph>
                      <Paragraph>
                        <Fontisto name="blood" size={18} /> {feed.bloodUnits}{" "}
                        blood units
                      </Paragraph>
                    </View>
                    <Card.Actions style={{ justifyContent: "space-between" }}>
                      <Button
                        icon={"google-maps"}
                        mode="text"
                        onPress={() =>
                          Linking.openURL(
                            `https://www.google.com/maps/dir/?api=1&origin=${my_lat},${my_long}&destination=${feed.latitude},${feed.longitude}`
                          )
                        }
                      >
                        Directions
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => toConfirm(feed.id)}
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
          </View>
        ) : (
          <>
            <View style={{ margin: 30 }}>
              <Image
                style={{
                  height: 270,
                  // margin: 50,
                  width: "100%",
                  borderRadius: 50,
                }}
                source={require("../../assets/no_data.png")}
              />
              <Title>Request people to donate and save lives</Title>
            </View>
          </>
        )}
        <Button
          style={{ margin: 20 }}
          mode="contained"
          onPress={change}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getRequests} />
          }
        >
          Load More..
        </Button>
      </ScrollView>
      <AnimatedFAB
        icon={"arrow-right"}
        label={"request donor"}
        color="#000"
        extended={isExtended}
        onPress={toRequest}
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
    padding: 10,
    backgroundColor: "#ffffff",
  },
  fabStyle: {
    bottom: 26,
    right: 16,
    backgroundColor: "#ffffff",
    position: "absolute",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});