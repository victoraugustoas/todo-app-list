import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';
import {Typography} from '../Typography';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: widthPercentageToDP(4.6),
    },
    icon: {
      fontSize: widthPercentageToDP(5.5),
      flex: 1,
      color: theme.palette.type === 'light' ? '#9D9AB4' : '#fff',
    },
    textButton: {
      fontSize: widthPercentageToDP(5.6),
      textTransform: 'uppercase',
      color: theme.palette.type === 'light' ? '#373B5E' : '#fff',
    },
    textView: {
      flex: 6,
      justifyContent: 'center',
    },
    text: {
      textAlignVertical: 'bottom',
      fontSize: widthPercentageToDP(7),
      color: theme.palette.type === 'light' ? '#9D9AB4' : '#fff',
    },
    button: {
      borderWidth: 1,
      borderColor: theme.palette.type === 'light' ? '#9D9AB4' : '#fff',
      borderRadius: widthPercentageToDP(4),
      paddingVertical: widthPercentageToDP(0.5),
      paddingHorizontal: widthPercentageToDP(2),
    },
  });

export interface UndoActionProps {
  onUndo: () => void;
}

const UndoAction: React.FC<UndoActionProps> = ({onUndo}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <Icon name="trash-2" style={styles.icon} />

      <View style={styles.textView}>
        <Typography style={styles.text}>A tarefa foi removida</Typography>
      </View>
      <TouchableOpacity style={styles.button} onPress={onUndo}>
        <Typography style={styles.textButton} fontWeight="bold">
          Desfazer
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

export {UndoAction};
