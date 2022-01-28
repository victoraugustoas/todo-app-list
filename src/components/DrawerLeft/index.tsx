import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
import {appRoutes} from '../../config/routes';
import {Avatar} from '../Avatar';
import {Typography} from '../Typography';

const styles = StyleSheet.create({
  username: {
    fontSize: widthPercentageToDP(15),
    color: '#fff',
  },
  spacingSecondName: {
    marginTop: Platform.select({
      ios: -widthPercentageToDP(10),
      android: -widthPercentageToDP(5),
    }),
  },
  drawerItem: {flexDirection: 'row', alignItems: 'center'},
  drawerItemIcon: {
    flex: 2,
    fontSize: widthPercentageToDP(6),
    color: '#9D9AB4',
    textAlign: 'center',
  },
  drawerItemName: {flex: 6, fontSize: widthPercentageToDP(6), color: '#ADBAEB'},
});

const DrawerLeft: React.FC<DrawerContentComponentProps> = props => {
  const username = 'Victor Augusto Andrade Silva'.split(' ').slice(0, 2);

  return (
    <DrawerContentScrollView
      style={{
        backgroundColor: '#0F1F55',
        paddingHorizontal: widthPercentageToDP(10),
        paddingTop: heightPercentageToDP(6),
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Avatar
          borderCompletion
          size={widthPercentageToDP(25)}
          source={{uri: 'https://avatars.githubusercontent.com/u/38368198?v=4'}}
        />

        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={{
            height: widthPercentageToDP(12),
            width: widthPercentageToDP(12),
            borderRadius: widthPercentageToDP(12) / 2,
            borderColor: '#9D9AB4',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            name="chevron-left"
            style={{fontSize: widthPercentageToDP(6), color: '#ADBAEB'}}
          />
        </TouchableOpacity>
      </View>

      <View>
        <Typography style={styles.username}>{username[0]}</Typography>
        <Typography style={[styles.username, styles.spacingSecondName]}>
          {username[1]}
        </Typography>
      </View>

      {Object.values(props.descriptors).map(route => {
        const routeConfig = Object.values(appRoutes).find(
          routeConfig => routeConfig.link === route.route.name,
        )!;
        return (
          <TouchableOpacity
            onPress={() => props.navigation.navigate(routeConfig.link)}
            style={styles.drawerItem}>
            <Icon style={styles.drawerItemIcon} name={routeConfig.icon} />

            <Typography style={styles.drawerItemName}>
              {routeConfig.displayName}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </DrawerContentScrollView>
  );
};

export {DrawerLeft};
