import * as React from "react";

import data from "mock/data.json";

const { Provider, Consumer } = React.createContext({ chats: data.chats });

export class ChatsProvider extends React.Component {
  state = {
    chats: data.chats
  };

  render() {
    return (
      <Provider value={{ chats: this.state.chats }}>
        {this.props.children}
      </Provider>
    );
  }
}

export const ChatsConsumer = Consumer;
