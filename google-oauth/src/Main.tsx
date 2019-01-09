import * as firebase from "firebase";
import * as React from "react";
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from "react-navigation";
import { UserProvider } from "state/user";

import { AuthLoading, Home, Login } from "screens";

firebase.initializeApp({
  apiKey: "AIzaSyBjrCDYoOstdjCWaopbKpwiSDBgboUg5BI",
  authDomain: "macro-entity-228112.firebaseapp.com",
  databaseURL: "https://macro-entity-228112.firebaseio.com",
  projectId: "macro-entity-228112",
  storageBucket: "",
  messagingSenderId: "561822363730"
});

const App = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      App: createStackNavigator(
        {
          Home
        },
        {
          initialRouteName: "Home"
        }
      ),
      Login
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default () => (
  <UserProvider>
    <App />
  </UserProvider>
);
