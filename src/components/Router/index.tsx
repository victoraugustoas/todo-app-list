import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import {appRoutes} from '../../config/routes';
import {HomeScreen} from '../../screens/Home';
import {DrawerLeft} from '../DrawerLeft';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const Router: React.FC = () => {
  return (
    <NavigationContainer>
      <View style={{backgroundColor: '#2643C4', flex: 1}}>
        <Drawer.Navigator
          initialRouteName={appRoutes.HOME}
          screenOptions={{
            headerShown: false,
            drawerType: 'slide',
            sceneContainerStyle: {backgroundColor: 'transparent'},
            overlayColor: 'transparent',
          }}
          drawerContent={props => <DrawerLeft {...props} />}>
          <Drawer.Screen name={appRoutes.HOME} component={HomeScreen} />
        </Drawer.Navigator>
      </View>
    </NavigationContainer>
  );
};
