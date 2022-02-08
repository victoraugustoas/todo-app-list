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
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useAuth} from '../../contexts/Auth';
import {Category} from '../../modules/categories/models/ICategoryService';
import {AddTaskScreen} from '../../screens/AddTask';
import {SelectCategoryModal} from '../../screens/AddTask/SelectCategory';
import {HomeScreen} from '../../screens/Home';
import {LoginScreen} from '../../screens/Login';
import {DrawerLeft} from '../DrawerLeft';

export type AppRoutes = {
  Initial: undefined;
  AddTask?: {categoryID?: string; colorCategory?: string};
  SelectCategory: {onGoBack: (category: Category) => void};
};
export type AuthRoutes = {
  Login: undefined;
};
export type HomeRoutes = {
  Home: undefined;
};

export type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<AppRoutes, 'Initial'>,
  DrawerNavigationProp<HomeRoutes, 'Home'>
>;

const AppStack = createNativeStackNavigator<AppRoutes>();
const AuthStack = createNativeStackNavigator<AuthRoutes>();
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
  const auth = useAuth();

  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      {auth.user ? (
        <AppStack.Group>
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
          <AppStack.Screen
            component={SelectCategoryModal}
            name="SelectCategory"
            options={{presentation: 'modal', animation: 'fade_from_bottom'}}
          />
        </AppStack.Group>
      ) : (
        <AuthStack.Group>
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Group>
      )}
    </AuthStack.Navigator>
  );
};

export const Router: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View style={{backgroundColor: '#0F1F55', flex: 1}}>
          <AppNavigator />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
