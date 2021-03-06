import {
  DrawerContentComponentProps,
  useDrawerStatus,
} from '@react-navigation/drawer';
import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {appRoutes} from '../../config/routes';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';
import {Avatar} from '../Avatar';
import {Fab} from '../Fab';
import {Icon} from '../Icon';
import {Typography} from '../Typography';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    username: {
      fontSize: widthPercentageToDP(15),
      color: theme.palette.primary.dark,
    },
    spacingSecondName: {
      marginTop: Platform.select({
        ios: -widthPercentageToDP(10),
        android: -widthPercentageToDP(5),
      }),
    },
    activeDrawerItem: {
      backgroundColor: theme.palette.lighten(
        theme.palette.background.drawer.computed,
        0.4,
      ),
      borderRadius: widthPercentageToDP(3),
      paddingHorizontal: widthPercentageToDP(2),
      paddingVertical: widthPercentageToDP(1),
    },
    drawerItem: {flexDirection: 'row', alignItems: 'center'},
    drawerItemIcon: {
      flex: 1,
      fontSize: widthPercentageToDP(6),
      color: theme.palette.primary.light,
    },
    drawerItemName: {
      flex: 4,
      fontSize: widthPercentageToDP(7),
      color: '#ADBAEB',
    },
    drawerContainer: {
      backgroundColor: theme.palette.background.drawer.computed,
      paddingHorizontal: widthPercentageToDP(10),
      paddingTop: heightPercentageToDP(6),
      flex: 1,
    },
    icon: {
      color: theme.palette.primary.dark,
      fontSize: widthPercentageToDP(6),
    },
  });

const DrawerLeft: React.FC<DrawerContentComponentProps> = props => {
  const username = 'Victor Augusto Andrade Silva'.split(' ').slice(0, 2);
  const drawerStatus = useDrawerStatus();
  const translateXInitial = -widthPercentageToDP(10);
  const theme = useTheme();
  const styles = useStyles(theme);

  const animation = useDerivedValue(() => {
    if (drawerStatus === 'open') {
      return withTiming(1);
    } else {
      return withTiming(0);
    }
  });

  const showDrawer = useAnimatedStyle(
    () => ({
      opacity: withTiming(animation.value),
      transform: [
        {
          translateX: interpolate(
            animation.value,
            [0, 1],
            [translateXInitial, 0],
          ),
        },
      ],
    }),
    [drawerStatus],
  );

  return (
    <View style={styles.drawerContainer}>
      <Animated.ScrollView style={[showDrawer]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Avatar
            borderCompletion
            size={widthPercentageToDP(25)}
            source={{
              uri: 'https://avatars.githubusercontent.com/u/38368198?v=4',
            }}
          />

          <Fab variant="outlined" onPress={() => props.navigation.goBack()}>
            <Icon name="chevron-left" type="feather" style={styles.icon} />
          </Fab>
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
              key={routeConfig.link}
              onPress={() => props.navigation.navigate(routeConfig.link)}
              style={[
                styles.drawerItem,
                route.navigation.isFocused() && styles.activeDrawerItem,
              ]}>
              <Icon
                style={styles.drawerItemIcon}
                name={routeConfig.icon}
                type="feather"
              />

              <Typography style={styles.drawerItemName}>
                {routeConfig.displayName}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export {DrawerLeft};
