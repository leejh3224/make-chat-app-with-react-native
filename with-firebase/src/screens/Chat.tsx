import { Ionicons } from "@expo/vector-icons";
import groupBy from "lodash.groupby";
import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { MembersConsumer, MembersProvider } from "state/members";
import { MessagesConsumer, MessagesProvider } from "state/messages";
import {
  ImagePickerConsumer,
  ImagePickerProvider
} from "state/withImagePicker";

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

  sendMessage = (update: (param: any) => void) => {
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

  handleRenderListFooter = ({ section: { title } }: any) => {
    return (
      <View style={{ alignItems: "center", marginVertical: 16 }}>
        <Text style={{ color: "gray", fontSize: 14 }}>{title}</Text>
      </View>
    );
  };

  handleRenderItem = ({ item, index, section: { data } }: any) => {
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
              style={{
                alignSelf: isMyMessage ? "flex-end" : "flex-start",
                marginHorizontal: showProfileImage ? 8 : isMyMessage ? 8 : 64,
                marginBottom: 8
              }}
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
                      fontSize: 18,
                      lineHeight: 24
                    }}
                  >
                    {item.message}
                  </Text>
                </View>
                <View
                  style={{
                    alignSelf: "flex-end"
                  }}
                >
                  {showTimestamp && (
                    <Text
                      style={{
                        color: "gray",
                        fontSize: 14,
                        marginHorizontal: 8
                      }}
                    >
                      {this.getTimeAndHours(item.timestamp)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      </MembersConsumer>
    );
  };

  render() {
    return (
      <ImagePickerProvider>
        <MembersProvider>
          <MessagesProvider>
            <MessagesConsumer>
              {({ messages, pushMessage }) => {
                const { navigation } = this.props;
                const { text } = this.state;
                const chatId = navigation.getParam("chatId");

                const withDay = Object.values(messages![chatId]).map(
                  (m: any) => ({
                    ...m,
                    day: this.getYearMonthDay(m.timestamp)
                  })
                );
                const sectionedMessages = Object.entries(
                  groupBy(withDay, "day")
                ).map(([key, value]) => ({
                  title: key,
                  data: value
                }));

                const styles = StyleSheet.create({
                  textInput: {
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    flex: 1,
                    fontSize: 20
                  },
                  submitButton: {
                    backgroundColor: text ? "skyblue" : "gray",
                    padding: 16,
                    alignItems: "center"
                  },
                  uploadMenuBar: {
                    flexDirection: "row",
                    padding: 8,
                    justifyContent: "space-around"
                  }
                });

                return (
                  <View style={{ flex: 1 }}>
                    <SectionList
                      inverted
                      sections={sectionedMessages}
                      renderItem={this.handleRenderItem}
                      renderSectionFooter={this.handleRenderListFooter as any}
                      keyExtractor={(_, index) => index.toString()}
                    />
                    <KeyboardAvoidingView
                      behavior="padding"
                      keyboardVerticalOffset={86}
                    >
                      <View
                        style={{
                          marginTop: 16,
                          borderTopWidth: 0.5,
                          borderTopColor: "gray"
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center"
                          }}
                        >
                          <TextInput
                            placeholder="Type your messages here"
                            value={text}
                            onChangeText={this.handleChangeText}
                            style={styles.textInput}
                          />
                          <TouchableWithoutFeedback
                            disabled={text.length === 0}
                            onPress={() => this.sendMessage(pushMessage)}
                          >
                            <View style={styles.submitButton}>
                              <Ionicons
                                name="ios-send"
                                size={24}
                                color={text ? "blue" : "#b3b3b3"}
                              />
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                        <ImagePickerConsumer>
                          {({ pickImage, openCamera }) => {
                            return (
                              <View style={styles.uploadMenuBar}>
                                {["image", "camera", "videocam"].map(
                                  (name: string) => {
                                    const onPress = ({
                                      image: pickImage,
                                      camera: openCamera,
                                      videocam: () => {
                                        navigation.navigate("RecordVideo");
                                      }
                                    } as any)[name];

                                    return (
                                      <TouchableOpacity
                                        key={name}
                                        style={{ alignItems: "center" }}
                                        onPress={onPress}
                                      >
                                        <Ionicons
                                          name={`ios-${name}`}
                                          size={32}
                                          color="gray"
                                        />
                                        <Text style={{ color: "gray" }}>
                                          {name}
                                        </Text>
                                      </TouchableOpacity>
                                    );
                                  }
                                )}
                              </View>
                            );
                          }}
                        </ImagePickerConsumer>
                      </View>
                    </KeyboardAvoidingView>
                  </View>
                );
              }}
            </MessagesConsumer>
          </MessagesProvider>
        </MembersProvider>
      </ImagePickerProvider>
    );
  }
}

export default Chat;
