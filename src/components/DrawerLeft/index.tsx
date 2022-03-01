import {
  DrawerContentComponentProps,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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
import { drawerRoutes } from '../../config/routes';
import { useAuth } from '../../contexts/Auth';
import { useTheme } from '../../contexts/ThemeProvider';
import { Theme } from '../../contexts/ThemeProvider/Theme';
import { Avatar } from '../Avatar';
import { Fab } from '../Fab';
import { Icon } from '../Icon';
import { NavigationProps } from '../Router';
import { Typography } from '../Typography';
import { LinkDrawer } from './LinkDrawer';

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
  const navigation = useNavigation<NavigationProps>();
  const theme = useTheme();
  const styles = useStyles(theme);
  const auth = useAuth();

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
          }}
        >
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
          const routeConfig = Object.values(drawerRoutes).find(
            routeConfig => routeConfig.link === route.route.name,
          )!;

          return (
            <LinkDrawer
              key={routeConfig.link}
              focused={route.navigation.isFocused()}
              iconName={routeConfig.icon}
              title={routeConfig.displayName}
              onPress={() => props.navigation.navigate(routeConfig.link)}
            />
          );
        })}

        <LinkDrawer
          iconName="log-out"
          title="Sair"
          loading={auth.signOutState.errorLoadingSignOut}
          style={{ marginTop: widthPercentageToDP(2) }}
          onPress={() => auth.signOutState.signInOut()}
        />
      </Animated.ScrollView>
    </View>
  );
};

export { DrawerLeft };
