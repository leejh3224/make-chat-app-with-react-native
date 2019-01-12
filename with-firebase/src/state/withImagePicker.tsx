import { ImagePicker, Permissions } from "expo";
import * as React from "react";
import { Platform } from "react-native";

interface State {
  image: any;
  pickImage: () => void;
  openCamera: () => void;
}

const { Provider, Consumer } = React.createContext<State>({
  image: {},
  pickImage: () => {},
  openCamera: () => {}
});

export class ImagePickerProvider extends React.Component<{}, State> {
  checkPermissions = async (type: "gallery" | "camera") => {
    try {
      if (type === "gallery") {
        // Requires CAMERA_ROLL on iOS only.
        if (Platform.OS === "ios") {
          const { status } = await Permissions.getAsync(
            Permissions.CAMERA_ROLL
          );
          return status === "granted";
        }

        return true;
      } else {
        const { status } = await Permissions.getAsync(
          Permissions.CAMERA,
          Permissions.CAMERA_ROLL
        );

        return status === "granted";
      }
    } catch (error) {
      console.log(error);
    }
  };

  askPermissionFor = async (type: "gallery" | "camera") => {
    try {
      if (type === "gallery") {
        const alreadyAllowed = await this.checkPermissions("gallery");

        if (!alreadyAllowed) {
          // Requires CAMERA_ROLL on iOS only.
          if (Platform.OS === "ios") {
            const { status } = await Permissions.askAsync(
              Permissions.CAMERA_ROLL
            );
            return status === "granted";
          }
          return true;
        }

        return true;
      } else {
        const alreadyAllowed = await this.checkPermissions("camera");

        if (!alreadyAllowed) {
          // both platform requires CAMERA/CAMERA_ROLE
          const [CAMERA, CAMERA_ROLE] = await Permissions.askAsync([
            Permissions.CAMERA,
            Permissions.CAMERA_ROLL
          ]);

          return (
            CAMERA.status === "granted" && CAMERA_ROLE.status === "granted"
          );
        }

        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  runImagePicker = async (type: "gallery" | "camera") => {
    try {
      const permission = await this.askPermissionFor(type);

      const ImagePickerMethod =
        type === "gallery"
          ? ImagePicker.launchImageLibraryAsync
          : ImagePicker.launchCameraAsync;

      const result = await ImagePickerMethod({
        allowsEditing: true,
        mediaTypes: "All"
      });

      if (permission && !result.cancelled) {
        delete result.cancelled;

        this.setState(prev => ({
          ...prev,
          image: result
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  pickImage = () => {
    return this.runImagePicker("gallery");
  };

  openCamera = () => {
    return this.runImagePicker("camera");
  };

  state = {
    image: null,
    pickImage: this.pickImage,
    openCamera: this.openCamera
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export const ImagePickerConsumer = Consumer;
