import { Ionicons } from "@expo/vector-icons";
import groupBy from "lodash.groupby";
import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  SectionList,
  Text,
  TextInput,
  View
} from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { MembersConsumer } from "state/members";
import { MessagesConsumer } from "state/messages";

class Chat extends React.Component<NavigationScreenProps> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => ({
    title: navigation.getParam("title").slice(0, 20),
    headerLeft: () => {
      return (
        <Ionicons
          onPress={() => navigation.goBack()}
          name="ios-arrow-round-back"
          size={28}
          style={{ marginLeft: 16 }}
        />
      );
    },
    headerStyle: {
      // no-bottom-shadow
      shadowColor: "transparent",
      elevation: 0,
      borderBottomWidth: 0
    },
    headerTitleStyle: {
      fontSize: 24,
      fontWeight: "bold"
    }
  });

  state = {
    text: ""
  };

  handleChangeText = (text: string) => {
    this.setState(prev => ({
      ...prev,
      text
    }));
  };

  getTimeAndHours = (timestamp: number) => {
    return new Intl.DateTimeFormat("ko-kr", {
      hour: "numeric",
      minute: "numeric"
    }).format(timestamp);
  };

  getYearMonthDay = (timestamp: number) => {
    return new Intl.DateTimeFormat("ko-kr", {
      year: "numeric",
      month: "numeric",
      weekday: "short",
      day: "numeric"
    }).format(timestamp);
  };

  sendMessage = update => {
    const { navigation } = this.props;
    const chatId = navigation.getParam("chatId");

    update({
      chatId,
      message: this.state.text,
      sender: "u-f125e60d0d081203",
      timestamp: Date.now()
    });

    this.setState(prev => ({
      ...prev,
      text: ""
    }));
  };

  handleRenderListFooter = ({ section: { title } }) => {
    return (
      <View style={{ alignItems: "center", marginVertical: 16 }}>
        <Text style={{ color: "gray", fontSize: 14 }}>{title}</Text>
      </View>
    );
  };

  handleRenderListHeader = () => {
    const { text } = this.state;

    return (
      <MessagesConsumer>
        {({ pushMessage }) => {
          return (
            <SafeAreaView>
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingTop: 8,
                  paddingBottom: 30,
                  backgroundColor: "#f2f2f2",
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <TextInput
                  placeholder="Type a word"
                  value={text}
                  onChangeText={this.handleChangeText}
                  onSubmitEditing={() => this.sendMessage(pushMessage)}
                  style={{ padding: 8, flex: 1, fontSize: 20 }}
                />
                <Ionicons
                  name="ios-image"
                  size={28}
                  color="#b3b3b3"
                  onPress={() => {}}
                  style={{ paddingHorizontal: 8 }}
                />
                <Ionicons
                  name="ios-camera"
                  size={32}
                  color="#b3b3b3"
                  onPress={() => {}}
                  style={{ paddingHorizontal: 8 }}
                />
              </View>
            </SafeAreaView>
          );
        }}
      </MessagesConsumer>
    );
  };

  handleRenderItem = ({ item, index, section: { data } }) => {
    return (
      <MembersConsumer>
        {({ members }) => {
          const { navigation } = this.props;
          const chatId = navigation.getParam("chatId");
          const chatMembers = members[chatId];
          const isMyMessage = item.sender === "u-8c23c5308b0c7570";

          /**
           * messages are displayed in reverse order
           */
          const prevMessage = data[index + 1];
          const nextMessage = data[index - 1];

          // show profile image when sender changes
          const showProfileImage = prevMessage
            ? prevMessage.sender !== item.sender
            : true;

          // show timestamp when timestamp changes
          // i.e. PM 01:08 -> PM 01:09
          const showTimestamp = nextMessage
            ? this.getTimeAndHours(item.timestamp) !==
              this.getTimeAndHours(nextMessage.timestamp)
            : true;

          return (
            <View
              style={[
                {
                  alignSelf: isMyMessage ? "flex-end" : "flex-start",
                  marginHorizontal: showProfileImage ? 8 : 64
                },
                // add margin bottom when there is no timestamp
                !showTimestamp && { marginBottom: 8 }
              ]}
            >
              <View
                style={{ flexDirection: isMyMessage ? "row-reverse" : "row" }}
              >
                {!isMyMessage && showProfileImage && (
                  <Image
                    source={{ uri: chatMembers[item.sender].profileImage }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginHorizontal: 8
                    }}
                  />
                )}
                <View
                  style={{
                    backgroundColor: isMyMessage ? "#f2f2f2" : "#8480ff",
                    borderRadius: 10,
                    justifyContent: "center",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginHorizontal: 8,
                    maxWidth: 200
                  }}
                >
                  <Text
                    style={{
                      color: isMyMessage ? "gray" : "white",
                      fontSize: 18
                    }}
                  >
                    {item.message}
                  </Text>
                </View>
              </View>
              {showTimestamp && (
                <Text
                  style={{
                    color: "gray",
                    fontSize: 14,
                    marginTop: 8,
                    marginBottom: 16,
                    marginHorizontal: 8,
                    alignSelf: isMyMessage ? "flex-start" : "flex-end"
                  }}
                >
                  {this.getTimeAndHours(item.timestamp)}
                </Text>
              )}
            </View>
          );
        }}
      </MembersConsumer>
    );
  };

  render() {
    return (
      <MessagesConsumer>
        {({ messages }) => {
          const { navigation } = this.props;
          const chatId = navigation.getParam("chatId");

          const withDay = Object.values(messages[chatId]).map(m => ({
            ...m,
            day: this.getYearMonthDay(m.timestamp)
          }));
          const sectionedMessages = Object.entries(groupBy(withDay, "day")).map(
            ([key, value]) => ({
              title: key,
              data: value
            })
          );

          return (
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === "android" ? 96 : 70}
            >
              <SectionList
                inverted
                sections={sectionedMessages}
                renderItem={this.handleRenderItem}
                renderSectionFooter={this.handleRenderListFooter}
                keyExtractor={(_, index) => index.toString()}
                ListHeaderComponent={this.handleRenderListHeader}
                keyboardShouldPersistTaps="handled"
              />
            </KeyboardAvoidingView>
          );
        }}
      </MessagesConsumer>
    );
  }
}

export default Chat;
