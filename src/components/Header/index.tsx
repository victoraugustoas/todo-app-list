import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: widthPercentageToDP(4),
      marginVertical: widthPercentageToDP(6),
    },
    icon: {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.background.default.light
          : '#000',
      fontSize: widthPercentageToDP(6),
    },
    rightIcons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: widthPercentageToDP(15),
    },
  });

const Header: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Icon name="menu" style={styles.icon} />
      </TouchableOpacity>

      <View style={styles.rightIcons}>
        <TouchableOpacity>
          <Icon name="search" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="bell" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export {Header};
