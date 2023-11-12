import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Paragraph, Title, Avatar, Button } from "react-native-paper";
import * as Linking from "expo-linking";

export default function SingleRequestScreen({ navigation, route }) {
  const { req } = route.params;
  return (
    <>
      <View style={styles.container}>
        <View
          style={{ alignContent: "center", alignItems: "center", margin: 30 }}
        >
          <Avatar.Text size={54} label={req.accept} />
          <Text>accepted.</Text>
          <Title>Request For - {req.patientName}</Title>
          <Paragraph>{req.biography}</Paragraph>
          <Card
            style={{ backgroundColor: "#feefef", marginTop: 10, width: "100%" }}
            mode="contained"
          >
            <Card.Content>
              <Paragraph style={{ fontWeight: "bold" }}>Diagnosis</Paragraph>
              <Paragraph>{req.diagnosis}</Paragraph>
              <Text></Text>
              <Paragraph style={{ fontWeight: "bold", padding: 10 }}>
                Location
              </Paragraph>
              <Button
                mode="outlined"
                icon={"google-maps"}
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${req.latitude}%C${req.longitude}`
                  )
                }
              >
                See in Google Maps
              </Button>
            </Card.Content>
          </Card>
        </View>
        <View style={{ margin: 30 }}>
          <Button
            style={{}}
            onPress={() =>
              navigation.navigate("Accept To Donate", { id: req.id })
            }
            mode="contained"
            icon={"check"}
          >
            <Text style={styles.buttonTitle}>Accept to Donate</Text>
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#fc7d7b",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});