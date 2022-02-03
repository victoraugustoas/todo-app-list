import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import {
  CompositeNavigationProp,
  NavigationContainer,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import {AddTaskScreen} from '../../screens/AddTask';
import {HomeScreen} from '../../screens/Home';
import {DrawerLeft} from '../DrawerLeft';

export type AppRoutes = {
  Initial: undefined;
  AddTask: undefined;
};
export type HomeRoutes = {
  Home: undefined;
};

export type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<AppRoutes, 'Initial'>,
  DrawerNavigationProp<HomeRoutes, 'Home'>
>;

const AppStack = createNativeStackNavigator<AppRoutes>();
const Drawer = createDrawerNavigator<HomeRoutes>();

const HomeNavigation: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        sceneContainerStyle: {backgroundColor: 'transparent'},
        overlayColor: 'transparent',
      }}
      drawerContent={props => <DrawerLeft {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen
        name="Initial"
        component={HomeNavigation}
        options={{
          contentStyle: {backgroundColor: 'transparent'},
        }}
      />
      <AppStack.Screen
        component={AddTaskScreen}
        name="AddTask"
        options={{presentation: 'modal', animation: 'fade_from_bottom'}}
      />
    </AppStack.Navigator>
  );
};

export const Router: React.FC = () => {
  return (
    <NavigationContainer>
      <View style={{backgroundColor: '#0F1F55', flex: 1}}>
        <AppNavigator />
      </View>
    </NavigationContainer>
  );
};
