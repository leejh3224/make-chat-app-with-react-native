import { createAppContainer, createStackNavigator } from "react-navigation";

import { Chat, Home } from "screens";

export default createAppContainer(
  createStackNavigator(
    {
      Home,
      Chat
    },
    {
      initialRouteName: "Home"
    }
  )
);
