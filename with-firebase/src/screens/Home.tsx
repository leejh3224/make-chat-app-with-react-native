import * as React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { ChatsConsumer, ChatsProvider } from "state/chats";
import { MembersConsumer, MembersProvider } from "state/members";

class Home extends React.Component<NavigationScreenProps> {
  static navigationOptions = {
    title: "CHAT"
  };

  getTimeAndHours = (timestamp: number) => {
    return new Intl.DateTimeFormat("ko-kr", {
      hour: "numeric",
      minute: "numeric"
    }).format(timestamp);
  };

  handleRenderItem = ({ item }: any) => {
    const IMAGE_MAX_SIZE = 80;
    const IMAGE_MAX_NUMBER = 3;

    const styles = StyleSheet.create({
      container: {
        flexDirection: "row",
        justifyContent: "space-between"
      },
      imageContainer: {
        width: IMAGE_MAX_SIZE,
        height: IMAGE_MAX_SIZE
      },
      contentContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        paddingLeft: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: "gray"
      },
      titleContainer: {
        flex: 1,
        paddingRight: 16,
        alignItems: "flex-start",

        // manually align title/message to left
        marginLeft: -16
      }
    });

    const { navigation } = this.props;

    return (
      <MembersConsumer>
        {({ members }) => {
          // mock value
          const myId = "u-8c23c5308b0c7570";

          // exclude myId
          const chatMembers = Object.values(members[item.id]).filter(
            (c: any) => c.uid != myId
          );

          const chatTitle = chatMembers.map((c: any) => c.name).join(", ");

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Chat", {
                  title: chatTitle,
                  chatId: item.id
                })
              }
              style={styles.container}
            >
              <View
                style={{
                  padding: 16
                }}
              >
                <View style={styles.imageContainer}>
                  {chatMembers
                    .slice(0, IMAGE_MAX_NUMBER)
                    .map((c: any) => c.profileImage)
                    .map((img, index) => {
                      const twoImagesLayout = {
                        top: 20 * index,
                        left: 20 * index
                      };
                      const threeImagesLayout = {
                        top: [5, 5, 35][index],
                        left: [0, 40, 20][index]
                      };

                      const imageSize =
                        IMAGE_MAX_SIZE - 20 * (chatMembers.length - 1);

                      return (
                        <Image
                          key={img}
                          source={{ uri: img }}
                          style={[
                            {
                              position: "absolute",
                              width: imageSize,
                              height: imageSize,
                              borderRadius: imageSize / 2
                            },
                            chatMembers.length === 2 && twoImagesLayout,
                            chatMembers.length === 3 && threeImagesLayout
                          ]}
                        />
                      );
                    })}
                </View>
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.titleContainer}>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 22, fontWeight: "bold" }}
                  >
                    {chatTitle}
                  </Text>
                  <Text style={{ fontSize: 18, lineHeight: 30, color: "gray" }}>
                    {item.lastMessage.message}
                  </Text>
                </View>
                <Text style={{ color: "gray", alignSelf: "center" }}>
                  {this.getTimeAndHours(item.lastMessage.timestamp)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      </MembersConsumer>
    );
  };

  render() {
    return (
      <ChatsProvider>
        <MembersProvider>
          <ChatsConsumer>
            {({ chats }) => (
              <View style={{ flex: 1 }}>
                <FlatList
                  data={Object.values(chats)}
                  renderItem={this.handleRenderItem}
                  keyExtractor={(item: any, index) =>
                    `${item.lastMessage}-${index}`
                  }
                />
              </View>
            )}
          </ChatsConsumer>
        </MembersProvider>
      </ChatsProvider>
    );
  }
}

export default Home;
