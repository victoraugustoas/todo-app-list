import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  FadeOut,
  interpolate,
  Layout,
  runOnJS,
  SlideInLeft,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {snapPoint} from 'react-native-redash';
import {widthPercentageToDP} from 'react-native-responsive-screen';
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
  undoAction: {
    position: 'absolute',
    width: '100%',
    zIndex: -1,
  },
});

export interface CardTaskProps extends ViewProps {
  title: string;
  selected?: boolean;
  onDimiss?: () => void;
  onPress?: () => void;
  timeoutToClose?: number;
  colorTask: string;
}

const CardTask: React.FC<CardTaskProps> = memo(
  ({
    title,
    selected,
    onDimiss,
    onPress,
    timeoutToClose = 3000,
    colorTask,
    ...props
  }) => {
    const offsetX = useSharedValue(0);
    const totalOffsetX = -widthPercentageToDP(100);
    const SNAP_POINTS = [totalOffsetX, 0];
    const [wantToclose, setWantToClose] = useState(false);

    function onClose() {
      setWantToClose(true);
    }

    const dragGesture = Gesture.Pan()
      .onUpdate(e => {
        offsetX.value = e.translationX;
      })
      .onEnd(e => {
        const dest = snapPoint(offsetX.value, e.velocityX, SNAP_POINTS);
        offsetX.value = withSpring(dest, {velocity: e.velocityX});
      });
    const tap = Gesture.Tap().onStart(() => {
      onPress && runOnJS(onPress)();
    });
    const gesture = Gesture.Race(dragGesture, tap);

    const swipeToDimiss = useAnimatedStyle(() => ({
      transform: [{translateX: offsetX.value}],
      opacity: interpolate(offsetX.value, [0, totalOffsetX], [1, 0]),
    }));
    const undoActionAnim = useAnimatedStyle(() => ({
      opacity: interpolate(offsetX.value, [0, totalOffsetX], [0, 1]),
    }));

    // call close function
    useAnimatedReaction(
      () => offsetX.value,
      value => {
        if (value === totalOffsetX) {
          runOnJS(onClose)();
        }
      },
    );
    useEffect(() => {
      let timeoutToDimiss: NodeJS.Timeout | null = null;
      if (wantToclose) {
        timeoutToDimiss = setTimeout(() => {
          onDimiss && onDimiss();
        }, timeoutToClose);
      }
      return () => {
        if (timeoutToDimiss) clearTimeout(timeoutToDimiss);
      };
    }, [wantToclose]);

    return (
      <View {...props} style={[props.style, {position: 'relative'}]}>
        <GestureDetector gesture={gesture}>
          <Animated.View
            entering={SlideInLeft}
            layout={Layout}
            style={swipeToDimiss}>
            <Task selected={selected} title={title} colorTask={colorTask} />
          </Animated.View>
        </GestureDetector>
        <Animated.View
          layout={Layout}
          exiting={FadeOut}
          style={[undoActionAnim, styles.undoAction]}>
          <UndoAction
            onUndo={() => {
              offsetX.value = 0;
              setWantToClose(false);
            }}
          />
        </Animated.View>
      </View>
    );
  },
  (prev, next) => {
    return prev.selected === next.selected;
  },
);

export {CardTask};
