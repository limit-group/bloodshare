import React from "react";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, View, Text } from "react-native";
import { getValue } from "../utils/auth";
import {
  Button,
  Card,
  Dialog,
  Paragraph,
  Portal,
  Switch,
  Title,
} from "react-native-paper";
import {getError} from "../utils/error";

export default function SettingsScreen({ navigation }) {
  const [value, setValue] = React.useState("");
  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const [changed, setChanged] = React.useState("yes");

  const showDialog = () => setVisible(true);

  const hideDialog = async () => {
    setVisible(false);
    await logout();
  };

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const logout = async () => {
    await SecureStore.deleteItemAsync("onboarded");
    // await SecureStore.deleteItemAsync("profile");
    await SecureStore.deleteItemAsync("token")
      .then(navigation.navigate("Login"))
      .catch((err) => {
        setError(getError(err));
      });
    return;
  };
  const checkLoggedIn = async () => {
    const token = await getValue("token");
    if (token == null || undefined) {
      navigation.navigate("Login");
    }
  };
  React.useEffect(() => {
    checkLoggedIn().catch((err) => {
      setError(getError(err));
    });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={{ padding: 30, paddingTop: 40, paddingBottom: 10 }}>
          <Card style={styles.card}>
            <Card.Content
              style={{
                flexDirection: "row",
                // padding: 10,
                paddingBottom: 10,
                justifyContent: "space-evenly",
              }}
            >
              <Paragraph>Interested in donating. </Paragraph>
              <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
            </Card.Content>
          </Card>
        </View>
        <View style={{ padding: 30, paddingTop: 0 }}>
          <Card style={styles.card}>
            <Card.Content>
              <Title
                style={[
                  styles.rounded,
                  { color: "#fc7d7b", textAlign: "center" },
                ]}
              >
                Legal Information
              </Title>
              <Paragraph style={styles.rounded}>Licenses </Paragraph>
              <Paragraph style={styles.rounded}>Privacy Policy </Paragraph>
              <Paragraph style={styles.rounded}>Terms of Service </Paragraph>
            </Card.Content>
          </Card>
          <Button
            onPress={showDialog}
            mode="contained"
            icon="logout"
            style={{
              borderRadius: 50,
              marginTop: 13,
              marginBottom: 10,
              fontSize: "40px",
            }}
          >
            Logout
          </Button>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Confirm</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  Are you sure you want to log out?
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>No</Button>
                <Button onPress={hideDialog}>Yes</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
  },
  profile: {
    marginTop: 30,
  },
  card: {
    backgroundColor: "#ffffff",
  },
  rounded: {
    marginTop: 20,
    marginBottom: 10,
  },
});