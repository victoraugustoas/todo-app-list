import {MotiView} from 'moti';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
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
    borderWidth: 2,
    borderColor: 'rgb(221, 12, 241)',
    backgroundColor: 'rgb(221, 12, 241)',

    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  animatedBubble: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    borderRadius: widthPercentageToDP(6.8) / 2,
  },
  title: {fontSize: widthPercentageToDP(7.6), color: 'rgb(157, 154, 180)'},
  container: {flexDirection: 'row'},
  titleContainer: {flex: 6, flexDirection: 'row'},
  markCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  riskCompletedText: {
    height: 2,
    backgroundColor: 'rgb(157, 154, 180)',
    position: 'absolute',
    borderRadius: 1,
  },
  icon: {
    fontSize: widthPercentageToDP(4.6),
    color: '#fff',
  },
});

export interface CardTaskProps {
  title: string;
  selected?: boolean;
}

const CardTask: React.FC<CardTaskProps> = ({title, selected}) => {
  const [totalTextWidth, setTotalTextWidth] = useState(0);

  const animateColor = useDerivedValue(() => {
    if (selected) {
      return withTiming(1, {duration: 450});
    } else {
      return withTiming(0, {duration: 450});
    }
  });

  const selectedBubble = useAnimatedStyle(() => {
    const color = interpolateColor(
      animateColor.value,
      [0, 1],
      ['rgba(221, 12, 241,1)', '#ccc'],
    );

    return {
      backgroundColor: color,
      borderColor: color,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        <Animated.View style={[styles.bubble, selectedBubble]}>
          <MotiView
            style={styles.animatedBubble}
            animate={{scale: selected ? 0 : 1}}
            transition={{type: 'timing'}}
          />
          <MotiView
            style={{position: 'absolute'}}
            animate={{translateX: selected ? 0 : -20}}
            transition={{type: 'timing', duration: 225}}>
            <Icon name="check" style={styles.icon} />
          </MotiView>
        </Animated.View>
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
