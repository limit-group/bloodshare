import "react-native-gesture-handler";
import React, { useCallback, useEffect, useState } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  useTheme,
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";

import * as SecureStore from "expo-secure-store";
import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  DonationScreen,
  DonationFeedScreen,
  VerifyScreen,
  ThankYouScreen,
  BloodCardScreen,
  CreateFeedScreen,
  CreateDonationScreen,
  CompleteProfileScreen,
  ForgotPasswordScreen,
  ConfirmScreen,
  SettingsScreen,
  RequestsScreen,
  ResetPasswordScreen,
  CreateRequestScreen,
  EditProfile,
  MyRequestsScreen,
  AcceptDonationScreen,
  SingleRequestScreen,
} from "./src/screens";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

export default function App({ route }) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const theme = useTheme({
    ...DefaultTheme,
    colors: {
      primary: "#fc7d7b",
    },
  });

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setLoggedIn(true);
      return;
    } else {
      setLoggedIn(false);
    }
    return;
  }
  React.useEffect(() => {
    getValueFor("onboarded").catch((err) => {
      setError(getError(err));
    });

    getValueFor("token").catch((err) => {
      setError(getError(err));
    });
    setLoading(false);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="BloodShare"
            component={Home}
            // onLayout={onLayoutRootView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="announce donation drive"
            component={CreateFeedScreen}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Request for Blood"
            component={CreateRequestScreen}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="My Donations"
            component={DonationScreen}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="My Blood Requests"
            component={MyRequestsScreen}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Accept To Donate"
            component={AcceptDonationScreen}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Reset Password"
            component={ResetPasswordScreen}
            // options={{ headerShown: false }}
          />
          <Stack.Screen name="Edit Profile" component={EditProfile} />
          <Stack.Screen
            name="Record Donation"
            component={CreateDonationScreen}
          />
          <Stack.Screen name="Thank You" component={ThankYouScreen} />
          <Stack.Screen name="Confirm" component={ConfirmScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Patient Info" component={SingleRequestScreen} />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Verify"
            component={VerifyScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Complete Profile"
            component={CompleteProfileScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Forgot Password"
            component={ForgotPasswordScreen}
            // options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="Reset Password"
            component={ResetPasswordScreen}
            // options={{ headerShown: false }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

function Home() {
  return (
    <Tab.Navigator
      // initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#fc7d7b",
      }}
      barStyle={{ backgroundColor: "white" }}
      // activeColor="white"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen} //Home Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={DonationFeedScreen} // Search Screen
        options={{
          title: "feed",
          tabBarIcon: ({ color, size }) => (
            <Octicons name="feed-discussion" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Request"
        component={RequestsScreen} // Search Screen
        options={{
          title: "requests",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="hand-heart-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Card"
        component={BloodCardScreen}
        options={{
          title: "Me",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="card-account-details-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
