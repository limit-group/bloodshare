import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DonationScreen } from "../screens";
const TopTab = createMaterialTopTabNavigator();

export default function TopTabNavigator() {
  return (
    <TopTab.Navigator tabBarPosition="top" initialRouteName="Chats">
      <TopTab.Screen
        name="Chats"
        component={DonationScreen}
        options={({ navigation }) => ({
          title: "Received Requests",
        })}
      />
      <TopTab.Screen
        name="Calls"
        component={DonationScreen}
        options={{
          title: "My Requests",
        }}
      />
    </TopTab.Navigator>
  );
}
