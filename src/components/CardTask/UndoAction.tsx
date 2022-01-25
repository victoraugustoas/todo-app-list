import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Typography} from '../Typography';
import Icon from 'react-native-vector-icons/Feather';
import {widthPercentageToDP} from 'react-native-responsive-screen';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {fontSize: widthPercentageToDP(5.5), flex: 1, color: '#9D9AB4'},
  textButton: {
    fontSize: widthPercentageToDP(5),
    textTransform: 'uppercase',
    color: '#373B5E',
  },
  textView: {
    flex: 6,
    borderWidth: 1,
    justifyContent: 'center',
  },
  text: {
    textAlignVertical: 'bottom',
    fontSize: widthPercentageToDP(7),
    color: '#9D9AB4',
  },
  button: {
    borderWidth: 1,
    borderColor: '#9D9AB4',
    borderRadius: widthPercentageToDP(4),
    paddingVertical: widthPercentageToDP(0.5),
    paddingHorizontal: widthPercentageToDP(2),
  },
});

const UndoAction: React.FC = () => {
  return (
    <View style={styles.container}>
      <Icon name="trash-2" style={styles.icon} />

      <View style={styles.textView}>
        <Typography style={styles.text}>A tarefa foi removida</Typography>
      </View>
      <TouchableOpacity style={styles.button}>
        <Typography style={styles.textButton} fontWeight="bold">
          Desfazer
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

export {UndoAction};
