import * as React from "react";
import uuid from "uuid/v4";

import data from "mock/data.json";

const { Provider, Consumer } = React.createContext({
  messages: null,
  pushMessage: () => {}
});

export class MessagesProvider extends React.Component {
  pushMessage = message => {
    const { chatId, ...rest } = message;

    this.setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [chatId]: {
          [uuid()]: rest,
          ...prev.messages[chatId]
        }
      }
    }));
  };

  state = {
    messages: data.messages,
    pushMessage: this.pushMessage
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export const MessagesConsumer = Consumer;
