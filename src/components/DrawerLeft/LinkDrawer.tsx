import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../../contexts/ThemeProvider';
import { Theme } from '../../contexts/ThemeProvider/Theme';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    drawerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: widthPercentageToDP(2),
      paddingVertical: widthPercentageToDP(1),
    },
    activeDrawerItem: {
      backgroundColor: theme.palette.lighten(
        theme.palette.background.drawer.computed,
        0.4,
      ),
      borderRadius: widthPercentageToDP(3),
    },
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
  });

export interface LinkDrawerProps extends TouchableOpacityProps {
  iconName: string;
  title: string;
  focused?: boolean;
  loading?: boolean;
}

const LinkDrawer: React.FC<LinkDrawerProps> = ({
  focused,
  iconName,
  title,
  loading,
  ...props
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.drawerItem,
        focused && styles.activeDrawerItem,
        props.style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={theme.palette.primary.computed}
          size="small"
          style={{ flex: 1 }}
        />
      ) : (
        <Icon style={styles.drawerItemIcon} name={iconName} type="feather" />
      )}
      <Typography style={styles.drawerItemName}>{title}</Typography>
    </TouchableOpacity>
  );
};

export { LinkDrawer };
