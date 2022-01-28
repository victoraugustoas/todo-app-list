import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthPercentageToDP(4),
    marginVertical: widthPercentageToDP(6),
  },
  icon: {fontSize: widthPercentageToDP(6)},
  rightIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: widthPercentageToDP(15),
  },
});

const Header: React.FC = () => {
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
