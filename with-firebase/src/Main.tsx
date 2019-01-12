import "intl";
import "intl/locale-data/jsonp/ko";
import { createAppContainer, createStackNavigator } from "react-navigation";

import { Chat, Home, RecordVideo } from "screens";

const App = createAppContainer(
  createStackNavigator(
    {
      Home,
      Chat,
      RecordVideo
    },
    {
      initialRouteName: "Home",
      mode: "modal"
    }
  )
);

export default App;
