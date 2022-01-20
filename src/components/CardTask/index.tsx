import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  bubble: {
    height: widthPercentageToDP(6.8),
    width: widthPercentageToDP(6.8),
    borderRadius: widthPercentageToDP(6.8) / 2,
    borderWidth: 3,
    borderColor: 'red',
  },
});

const CardTask: React.FC = () => {
  return (
    <View>
      <TouchableOpacity style={styles.bubble} />
      <View>
        <Text>Tarefa 01 do dia D</Text>
      </View>
    </View>
  );
};

export {CardTask};
