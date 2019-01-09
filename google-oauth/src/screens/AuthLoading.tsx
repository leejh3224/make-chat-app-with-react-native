import * as firebase from "firebase";
import * as React from "react";
import { Text, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

class AuthLoading extends React.Component<NavigationScreenProps> {
  constructor(props: NavigationScreenProps) {
    super(props);
    this.redirectUser();
  }

  redirectUser = () => {
    const { navigation } = this.props;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        navigation.navigate("Home");
      } else {
        // No user is signed in.
        navigation.navigate("Login");
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20 }}>Loading...</Text>
      </View>
    );
  }
}

export default AuthLoading;
