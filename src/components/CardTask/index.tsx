import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  Layout,
  runOnJS,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {Task} from './Task';
import {UndoAction} from './UndoAction';

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
  container: {
    flexDirection: 'row',
    borderRadius: widthPercentageToDP(5),
    backgroundColor: '#fff',
    paddingHorizontal: widthPercentageToDP(3),
    paddingVertical: widthPercentageToDP(4.6),
  },
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
  onDimiss?: () => void;
  onPress?: () => void;
}

const CardTask: React.FC<CardTaskProps> = ({
  title,
  selected,
  onDimiss,
  onPress,
}) => {
  const offsetX = useSharedValue(0);
  const heightCard = useSharedValue(100);
  const margin = useSharedValue(heightPercentageToDP(1));
  const totalOffsetX = -widthPercentageToDP(100);

  function onClose() {
    const exitTime = 225;
    const heightTime = 350;

    offsetX.value = withTiming(totalOffsetX, {duration: exitTime}, () => {
      heightCard.value = withTiming(0, {duration: heightTime});
      margin.value = withTiming(0);
    });

    // setTimeout(() => {
    //   onDimiss && onDimiss();
    // }, exitTime + heightTime);
  }

  const dragGesture = Gesture.Pan()
    .onUpdate(e => {
      offsetX.value = e.translationX;
    })
    .onEnd(e => {
      if (Math.abs(e.velocityX) > 1500 && e.velocityX < 0 && onDimiss) {
        runOnJS(onClose)();
      } else {
        offsetX.value = 0;
      }
    });
  const tap = Gesture.Tap().onStart(() => {
    onPress && onPress();
  });
  const gesture = Gesture.Race(dragGesture, tap);

  const swipeToDimiss = useAnimatedStyle(() => ({
    transform: [{translateX: withSpring(offsetX.value)}],
    opacity: interpolate(offsetX.value, [0, totalOffsetX], [1, 0]),
    height: heightCard.value,
    marginVertical: margin.value,
  }));
  const undoAction = useAnimatedStyle(() => ({
    opacity: interpolate(offsetX.value, [0, totalOffsetX], [0, 1]),
    display: offsetX.value === totalOffsetX ? 'flex' : 'none',
  }));

  return (
    <View>
      <GestureDetector gesture={gesture}>
        <Animated.View
          entering={SlideInLeft}
          layout={Layout.springify()}
          style={swipeToDimiss}>
          <Task
            selected={selected}
            title={title}
            onLayout={({nativeEvent}) => {
              if (heightCard.value === 100) {
                heightCard.value = nativeEvent.layout.height;
              }
            }}
          />
        </Animated.View>
      </GestureDetector>
      <Animated.View style={undoAction}>
        <UndoAction />
      </Animated.View>
    </View>
  );
};

export {CardTask};
