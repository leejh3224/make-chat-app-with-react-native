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

import data from "mock/data.json";

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

  handleRenderListHeader = () => {
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
  };

  handleRenderItem = ({ item }) => {
    const { navigation } = this.props;

    const chatId = navigation.getParam("chatId");

    const chatMembers = (data.members as any)[chatId];

    return (
      <View style={{ alignSelf: "flex-start" }}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: chatMembers[item.sender].profileImage }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginHorizontal: 16
            }}
          />
          <View
            style={{
              backgroundColor: "#8480ff",
              borderRadius: 10,
              justifyContent: "center",
              paddingVertical: 8,
              paddingHorizontal: 16,
              maxWidth: 200
            }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>{item.message}</Text>
          </View>
        </View>
        <Text
          style={{
            color: "gray",
            fontSize: 14,
            marginVertical: 8,
            alignSelf: "flex-end"
          }}
        >
          {this.getTimeAndHours(item.timestamp)}
        </Text>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const chatId = navigation.getParam("chatId");
    const messages = Object.values(data.messages[chatId]).map(m => ({
      ...m,
      day: this.getYearMonthDay(m.timestamp)
    }));

    const sectionedMessages = Object.entries(groupBy(messages, "day")).map(
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
          renderSectionFooter={({ section: { title } }) => {
            return (
              <View style={{ alignItems: "center", marginVertical: 16 }}>
                <Text style={{ color: "gray", fontSize: 14 }}>{title}</Text>
              </View>
            );
          }}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={this.handleRenderListHeader}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    );
  }
}

export default Chat;
