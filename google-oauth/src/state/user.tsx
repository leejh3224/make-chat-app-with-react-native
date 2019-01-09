import * as firebase from "firebase";
import * as React from "react";

export interface State {
  user: firebase.User | null;
}

const { Provider, Consumer } = React.createContext<State>({ user: null });

class UserContextProvider extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      user: null
    };
    this.loadUser();
  }

  loadUser = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
  };

  render() {
    return (
      <Provider value={{ user: this.state.user }}>
        {this.props.children}
      </Provider>
    );
  }
}

export const UserConsumer = Consumer;
export const UserProvider = UserContextProvider;
