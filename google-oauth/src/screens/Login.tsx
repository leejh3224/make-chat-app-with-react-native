import { Asset, Google, LinearGradient } from "expo";
import * as firebase from "firebase";
import * as React from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-easy-toast";

import backgroundOne from "@images/Login/background-one.jpg";
import backgroundThree from "@images/Login/background-three.jpg";
import backgroundTwo from "@images/Login/background-two.jpg";
import googleLogo from "@images/Login/google-logo.png";

const { Value } = Animated;

const backgrounds = [
  {
    image: backgroundOne,
    gradientColors: ["#4c669f", "#3b5998", "#192f6a"],
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus varius, leo ullamcorper commodo semper, nisl dolor pretium ex, blandit mollis ligula dolor quis eros"
  },
  {
    image: backgroundTwo,
    gradientColors: ["#ffbfa3", "#ff9f75", "#ff773d"],
    text:
      "Integer fringilla justo sit amet nunc aliquet ultricies. Nam venenatis lectus ut diam posuere lacinia. Integer elementum porta neque, ut dictum neque placerat at."
  },
  {
    image: backgroundThree,
    gradientColors: ["#943dff", "#b980ff", "#d5b3ff"],
    text:
      "Ut nec diam ac turpis malesuada feugiat. Nunc vitae vehicula orci. Proin suscipit mauris vitae dui aliquet rhoncus. Integer venenatis neque quis felis malesuada"
  }
];

interface State {
  backgroundIndex: number;
}

class Login extends React.Component<{}, State> {
  state = {
    backgroundIndex: 0,
    loginInProgress: false
  };

  // Animation configs
  animations = {
    translationX: 100,
    slideLeftDuration: 4000
  };

  // prevent setState on unmounted component warning
  // https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component/
  mounted = false;

  translationX = new Value(0);

  animationTimer!: any;

  signIn = async () => {
    try {
      if (this.mounted) {
        this.setState(prev => ({
          ...prev,
          loginInProgress: true
        }));
      }

      const { idToken, accessToken }: any = await Google.logInAsync({
        iosClientId:
          "561822363730-3jmlro6g5ntrc68rue0v9fbpt31vfd9s.apps.googleusercontent.com",
        scopes: ["profile", "email"],
        behavior: "web"
      });

      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken
      );

      return firebase.auth().signInAndRetrieveDataWithCredential(credential);
    } catch (error) {
      console.log(error);
      if (this.mounted) {
        this.setState(prev => ({
          ...prev,
          loginInProgress: false
        }));

        (this.refs.toast as any).show("login failed");
      }
    }
  };

  slideLeft = () => {
    Animated.timing(this.translationX, {
      toValue: -1 * this.animations.translationX,
      duration: this.animations.slideLeftDuration,

      // for performance
      useNativeDriver: true
    }).start(() => {
      if (this.mounted) {
        // This callback invokes right after the animation
        this.setState(prev => ({
          ...prev,

          // Will make our background image changes infinitely
          backgroundIndex: (prev.backgroundIndex + 1) % backgrounds.length
        }));
      }

      // restore the translationX value
      this.translationX.setValue(0);
    });
  };

  /**
   * It is required to preload Image Assets.
   * If you don't, you will face slow re rendering of background images
   */
  preload = () => {
    return Promise.all(
      backgrounds
        .map(background => background.image)
        .map(img => {
          return Asset.fromModule(img).downloadAsync();
        })
    );
  };

  componentDidMount = async () => {
    this.mounted = true;

    await this.preload();

    this.slideLeft();
    this.animationTimer = setInterval(() => {
      this.slideLeft();
    }, this.animations.slideLeftDuration);
  };

  componentWillUnmount = () => {
    this.mounted = false;
    clearInterval(this.animationTimer);
  };

  render() {
    const translateX = { translateX: this.translationX };
    const { width } = Dimensions.get("window");
    const styles = StyleSheet.create({
      imageBackground: {
        // width of our imageBackground should be window size + animated X value
        width: width + this.animations.translationX,
        height: "100%"
      },
      linearGradient: { flex: 1, opacity: 0.5 },
      introductionView: {
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        paddingTop: 96,
        paddingHorizontal: 32
      },
      title: {
        fontSize: 40,
        color: "white",
        fontWeight: "bold",

        // you can use lineHeight for margin bottom
        lineHeight: 80
      },
      description: {
        fontSize: 20,
        color: "white",
        lineHeight: 24
      },
      googleLoginButton: {
        backgroundColor: "white",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 3,
        alignSelf: "center",
        position: "absolute",
        bottom: 32,

        // code from https://ethercreative.github.io/react-native-shadow-generator/
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6
      },
      toast: {
        backgroundColor: "red",
        paddingVertical: 8,
        paddingHorizontal: 32
      }
    });
    const { backgroundIndex, loginInProgress } = this.state;

    if (loginInProgress) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <SafeAreaView>
        <Animated.View style={[{ transform: [translateX] }]}>
          <ImageBackground
            source={backgrounds[backgroundIndex].image}
            style={styles.imageBackground}
          >
            <LinearGradient
              colors={backgrounds[backgroundIndex].gradientColors}
              style={styles.linearGradient}
            />
          </ImageBackground>
        </Animated.View>

        <View style={styles.introductionView}>
          <Text style={styles.title}>HelloTalk</Text>
          <Text style={styles.description}>
            {backgrounds[backgroundIndex].text}
          </Text>
          <TouchableOpacity
            onPress={this.signIn}
            disabled={loginInProgress}
            style={styles.googleLoginButton}
          >
            <Image
              source={googleLogo}
              style={{ width: 24, height: 24, marginRight: 24 }}
            />
            <Text style={{ fontSize: 24, color: "gray" }}>
              Sign in with Google
            </Text>
          </TouchableOpacity>

          <Toast
            ref="toast"
            style={styles.toast}
            textStyle={{ fontSize: 20, color: "white" }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default Login;
