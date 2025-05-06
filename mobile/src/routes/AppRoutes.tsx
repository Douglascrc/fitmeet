import {createStackNavigator} from "@react-navigation/stack";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import {NavigationContainer} from "@react-navigation/native";
import {Register} from "../pages/Register/Register";
import ActivityCategory from "../pages/ActivityCategory/ActivityCategory";
import Profile from "../pages/Profile/Profile";
import ActivityForm from "../pages/ActivityForm/ActivityForm";
import ActivityDetails from "../components/ActivityDetails";
import {Activity} from "../types/Activity";

export type MainStackParamList = {
  Login: {name: string; isError: boolean};
  Register: {name: string; isError: boolean};
  Home: {name: string; isError: boolean};
  Activities: {categoryId: string; categoryName: string};
  Profile: {name: string; isError: boolean};
  ActivityForm: {activityId?: string; isEditMode?: boolean};
  ActivityDescription: {activity: Activity};
};

const MainStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator initialRouteName="Login">
      <MainStack.Group screenOptions={{headerShown: false}}>
        <MainStack.Screen name="Home" component={Home} />
        <MainStack.Screen name="Login" component={Login} />
        <MainStack.Screen name="Register" component={Register} />
        <MainStack.Screen name="Activities" component={ActivityCategory} />
        <MainStack.Screen name="Profile" component={Profile} />
        <MainStack.Screen
          name="ActivityForm"
          component={ActivityForm}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="ActivityDescription"
          component={ActivityDetails}
          options={{headerShown: false}}
        />
      </MainStack.Group>
    </MainStack.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <MainStackScreen />
    </NavigationContainer>
  );
}
