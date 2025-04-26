import {createStackNavigator} from '@react-navigation/stack';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import {NavigationContainer} from '@react-navigation/native';

const MainStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator initialRouteName="Login">
      <MainStack.Group screenOptions={{headerShown: false}}>
        <MainStack.Screen name="Home" component={Home} />
        <MainStack.Screen name="Login" component={Login} />
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
