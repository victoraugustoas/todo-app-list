import {MotiView} from 'moti';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Typography} from '../Typography';

const styles = StyleSheet.create({
  bubbleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    height: widthPercentageToDP(6.8),
    width: widthPercentageToDP(6.8),
    borderRadius: widthPercentageToDP(6.8) / 2,
    borderWidth: 3,
    borderColor: 'red',
  },
  title: {fontSize: widthPercentageToDP(7.6)},
  container: {flexDirection: 'row'},
  titleContainer: {flex: 6, flexDirection: 'row'},
  markCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  riskCompletedText: {
    height: 3,
    backgroundColor: 'green',
    position: 'absolute',
    borderRadius: 1,
  },
});

export interface CardTaskProps {
  title: string;
  selected?: boolean;
}

const CardTask: React.FC<CardTaskProps> = ({title, selected}) => {
  const [totalTextWidth, setTotalTextWidth] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        <TouchableOpacity style={styles.bubble} />
      </View>
      <View style={styles.titleContainer}>
        <View
          style={styles.markCompleted}
          onLayout={({nativeEvent}) =>
            setTotalTextWidth(nativeEvent.layout.width)
          }>
          <MotiView
            style={styles.riskCompletedText}
            animate={{
              width: selected ? totalTextWidth + widthPercentageToDP(4) : 0,
            }}
            transition={{type: 'timing'}}
          />
          <Typography style={styles.title}>{title}</Typography>
        </View>
      </View>
    </View>
  );
};

export {CardTask};
