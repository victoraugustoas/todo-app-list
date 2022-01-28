import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {appRoutes} from '../../config/routes';
import {HomeScreen} from '../../screens/Home';
import {DrawerLeft} from '../DrawerLeft';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const Router: React.FC = () => {
  return (
    <NavigationContainer>
      <View style={{backgroundColor: '#0F1F55', flex: 1}}>
        <Drawer.Navigator
          initialRouteName={appRoutes.HOME.link}
          screenOptions={{
            headerShown: false,
            drawerType: 'slide',
            sceneContainerStyle: {backgroundColor: 'transparent'},
            overlayColor: 'transparent',
          }}
          drawerContent={props => <DrawerLeft {...props} />}>
          <Drawer.Screen name={appRoutes.HOME.link} component={HomeScreen} />
        </Drawer.Navigator>
      </View>
    </NavigationContainer>
  );
};
