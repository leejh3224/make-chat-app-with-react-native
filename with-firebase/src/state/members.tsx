import * as React from "react";

import data from "mock/data.json";

const { Provider, Consumer } = React.createContext({
  members: data.members
});

export class MembersProvider extends React.Component {
  state = {
    members: data.members
  };

  render() {
    return (
      <Provider value={{ members: this.state.members }}>
        {this.props.children}
      </Provider>
    );
  }
}

export const MembersConsumer = Consumer;
