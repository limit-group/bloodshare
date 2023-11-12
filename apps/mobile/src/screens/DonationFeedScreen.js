import axios from "axios";
import React, {  useState } from "react";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {
  StyleSheet,
  Platform,
  ScrollView,
  SafeAreaView,
  View,
  Image,
  RefreshControl,
} from "react-native";
import {
  AnimatedFAB,
  Avatar,
  Button,
  Card,
  Paragraph,
  Snackbar,
  Title,
} from "react-native-paper";
import { url } from "../utils/api";
import { getValue } from "../utils/auth";
import { getError } from "../utils/error";
import moment from "moment";
const LeftContent = (props) => <Avatar.Icon {...props} icon="account" />;

export default function DonationFeedScreen({
  navigation,
  visible,
  animateFrom,
  style,
}) {
  const toCreateFeed = () => {
    navigation.navigate("announce donation drive");
  };
  const [loading, setLoading] = useState(false);
  const [isExtended, setIsExtended] = React.useState(true);
  const [visibo, setVisibo] = React.useState(false);
  const onDismissSnackBar = () => setVisibo(false);
  const [error, setError] = React.useState("");
  const [feeds, setFeeds] = React.useState([]);
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };
  const fabStyle = { [animateFrom]: 16 };
  const [refreshing, setRefreshing] = useState(true);
  const getFeeds = async () => {
    const token = await getValue("token");
    axios
      .get(`${url}/api/feeds`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRefreshing(false);
        setFeeds(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch feed. Retry");
        setVisibo(true);
      });
  };
  React.useEffect(() => {
    getFeeds().catch((err) => {
       setError(getError(err));
    });
  }, [error]);
  const going = async (id) => {
    const token = await getValue("token");
    axios
      .get(`${url}/api/feeds/going/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setError(res.data.message);
          setVisibo(true);
        }
      })
      .catch((err) => {
        setError(getError(err));
        setVisibo(true);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        onScroll={onScroll}
        style={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getFeeds} />
        }
      >
        {feeds.length > 0 ? (
          <>
            {feeds.map((feed) => (
              <View key={feed.id}>
                <Card style={{ backgroundColor: "#feefef" }} mode="contained">
                  <Card.Title
                    title={"Edwin"}
                    titleVariant="bodySmall"
                    subtitleVariant="bodySmall"
                    subtitle={moment(feed.createdAt).fromNow()}
                    left={LeftContent}
                  />
                  <Card.Content>
                    <Paragraph>{feed.information}</Paragraph>
                  </Card.Content>
                  {feed.media ? (
                    <>
                      <Card.Cover
                        source={{ uri: `${url}/images/${feed.media}` }}
                        style={{
                          padding: 5,
                          backgroundColor: "#feefef",
                          height: 150,
                        }}
                      />
                    </>
                  ) : (
                    ""
                  )}
                  <Card.Actions>
                    <Button mode="text" onPress={going}>
                      <SimpleLineIcons name="people" /> {feed.going}
                    </Button>
                    <Button mode="contained" onPress={() => going(feed.id)}>
                      Going <SimpleLineIcons name="like" />
                    </Button>
                  </Card.Actions>
                </Card>
                <View
                  style={{
                    padding: 5,
                  }}
                />
              </View>
            ))}
          </>
        ) : (
          <View style={{ margin: 30 }}>
            <Image
              style={{
                height: 270,
                width: "100%",
                borderRadius: 50,
              }}
              source={require("../../assets/no_data.png")}
            />
            <Title style={{ textAlign: "center" }}>
              Start by announcing blood donation drives.
            </Title>
          </View>
        )}
        <Button style={{ margin: 20 }} mode="contained">
          Load More..
        </Button>
      </ScrollView>
      <AnimatedFAB
        icon={"plus"}
        color="#000"
        label={"announce drive"}
        extended={isExtended}
        onPress={toCreateFeed}
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
    bottom: 16,
    right: 16,
    position: "absolute",
    backgroundColor: "#ffffff",
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
  card: {
    backgroundColor: "#ffffff",
  },
});
