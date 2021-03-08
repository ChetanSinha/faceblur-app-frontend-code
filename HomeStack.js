import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import UploadImage from "./components/uploadImage";
import renderImage from "./components/renderImage";

const screens = {
  Home: {
    screen: UploadImage,
  },
  Image: {
    screen: renderImage,
  },
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
