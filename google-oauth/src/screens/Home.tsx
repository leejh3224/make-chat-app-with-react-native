import * as firebase from "firebase";
import * as React from "react";
import { Button, Text, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { UserConsumer } from "state/user";

class Home extends React.Component<NavigationScreenProps> {
  static navigationOptions = {
    title: "Home"
  };

  signOut = async () => {
    try {
      const { navigation } = this.props;

      await firebase.auth().signOut();

      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <UserConsumer>
          {({ user }) => {
            return (
              user && (
                <>
                  <Text style={{ fontSize: 20, lineHeight: 40 }}>
                    {user.displayName} logged in successfully!
                  </Text>
                  <Button title="Logout" onPress={this.signOut} color="red" />
                </>
              )
            );
          }}
        </UserConsumer>
      </View>
    );
  }
}

export default Home;
