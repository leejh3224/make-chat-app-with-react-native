import * as React from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";

import { Chat, Home } from "screens";
import { ChatsProvider } from "state/chats";
import { MembersProvider } from "state/members";
import { MessagesProvider } from "state/messages";

const App = createAppContainer(
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

export default () => (
  <MessagesProvider>
    <MembersProvider>
      <ChatsProvider>
        <App />
      </ChatsProvider>
    </MembersProvider>
  </MessagesProvider>
);
