import { Foundation, Ionicons } from "@expo/vector-icons";
import { Camera, Permissions } from "expo";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

interface State {
  hasCameraPermission: boolean;
  type: any;
  isRecording: boolean;
  duration: number;
}

class RecordVideo extends React.Component<NavigationScreenProps, State> {
  static navigationOptions = {
    header: null
  };

  state = {
    hasCameraPermission: false,
    type: Camera.Constants.Type.back,
    isRecording: false,
    duration: 0
  };

  camera!: Camera | null;
  timerId!: any;

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  tick = () => {
    this.setState(prev => ({
      ...prev,
      duration: prev.duration + 1
    }));
  };

  componentWillUnmount = () => {
    clearInterval(this.timerId);
  };

  askRecordPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    return status === "granted";
  };

  stop = () => {
    if (this.camera) {
      const { navigation } = this.props;
      this.camera.stopRecording();
      navigation.goBack();
    }
  };

  start = async () => {
    try {
      const permission = await this.askRecordPermission();

      if (this.camera && permission) {
        this.setState(
          prev => ({
            ...prev,
            isRecording: true
          }),
          () => {
            this.timerId = setInterval(() => this.tick(), 1000);
          }
        );

        const video = await this.camera.recordAsync();

        console.log(video);
      }
    } catch (error) {
      console.log(error);
    }
  };

  toHHMMSS = (duration: number) => {
    let seconds = Math.floor(duration);
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    let hoursString: string | number = hours;
    let minutesString: string | number = minutes;
    let secondsString: string | number = seconds;

    if (hours < 10) {
      hoursString = "0" + hours;
    }
    if (minutes < 10) {
      minutesString = "0" + minutes;
    }
    if (seconds < 10) {
      secondsString = "0" + seconds;
    }

    return `${hoursString}:${minutesString}:${secondsString}`;
  };

  render() {
    const { hasCameraPermission, isRecording, duration } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      const { navigation } = this.props;

      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={ref => (this.camera = ref)}
            style={{ flex: 1 }}
            type={this.state.type}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                padding: 24,
                justifyContent: "space-between"
              }}
            >
              <Text
                style={{
                  color: "white",
                  alignSelf: "flex-end"
                }}
              >
                {this.toHHMMSS(duration)}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <TouchableOpacity
                  style={{
                    padding: 16,
                    backgroundColor: "gray",
                    borderRadius: 8
                  }}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="md-arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 16,
                    backgroundColor: "gray",
                    borderRadius: 8
                  }}
                  onPress={isRecording ? this.stop : this.start}
                >
                  <Foundation
                    name={isRecording ? "stop" : "play"}
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 16,
                    backgroundColor: "gray",
                    borderRadius: 8
                  }}
                  onPress={() => {
                    this.setState({
                      type:
                        this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                    });
                  }}
                >
                  <Ionicons name="ios-reverse-camera" size={28} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

export default RecordVideo;
