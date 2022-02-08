import {diff} from 'deep-diff';
import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  Layout,
  runOnJS,
  SlideInLeft,
  SlideOutRight,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  ZoomOut,
} from 'react-native-reanimated';
import {snapPoint} from 'react-native-redash';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {LoadingDimiss} from './LoadingDimiss';
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
    zIndex: 1,
  },
  loadingDimiss: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export interface CardTaskProps extends ViewProps {
  title: string;
  selected?: boolean;
  onDimiss?: () => Promise<void>;
  onPress?: () => void;
  timeoutToClose?: number;
  colorTask: string;
  index: number;
}

const CardTask: React.FC<CardTaskProps> = memo(
  ({
    title,
    selected,
    onDimiss,
    onPress,
    timeoutToClose = 3000,
    colorTask,
    index,
    ...props
  }) => {
    const offsetX = useSharedValue(0);
    const totalOffsetX = -widthPercentageToDP(100);
    const SNAP_POINTS = [totalOffsetX, 0];
    const waitingOnDimiss = useSharedValue(0);
    const progressToUndo = useSharedValue(0);
    const [wantToclose, setWantToClose] = useState(false);

    const dragGesture = Gesture.Pan()
      .minDistance(widthPercentageToDP(8))
      .onUpdate(e => {
        offsetX.value = e.translationX;
      })
      .onEnd(e => {
        const dest = snapPoint(offsetX.value, e.velocityX, SNAP_POINTS);
        offsetX.value = withTiming(dest);
        if (!onDimiss) {
          offsetX.value = withSpring(0, {velocity: e.velocityX});
        }
      });
    const tap = Gesture.Tap().onStart(() => {
      onPress && runOnJS(onPress)();
    });
    const gesture = Gesture.Race(dragGesture, tap);

    const swipeToDimiss = useAnimatedStyle(() => ({
      zIndex: 2,
      transform: [{translateX: offsetX.value}],
      opacity: interpolate(offsetX.value, [0, totalOffsetX], [1, 0]),
    }));
    const undoActionAnim = useAnimatedStyle(() => ({
      opacity:
        waitingOnDimiss.value === 0
          ? interpolate(offsetX.value, [0, totalOffsetX], [0, 1])
          : interpolate(offsetX.value, [0, totalOffsetX], [1, 0]),
    }));
    const loadingAnim = useAnimatedStyle(() => ({
      opacity: withTiming(waitingOnDimiss.value),
    }));

    // call close function
    useAnimatedReaction(
      () => offsetX.value,
      value => {
        if (value === totalOffsetX) {
          runOnJS(setWantToClose)(true);
        }
      },
    );
    useEffect(() => {
      let timeoutToDimiss: NodeJS.Timeout | null = null;
      if (wantToclose) {
        timeoutToDimiss = setTimeout(async () => {
          if (!onDimiss) return;
          try {
            waitingOnDimiss.value = 1;
            await onDimiss();
          } catch (error) {
            waitingOnDimiss.value = 0;
          }
        }, timeoutToClose);
        progressToUndo.value = withTiming(1, {duration: timeoutToClose});
      }
      return () => {
        if (timeoutToDimiss) clearTimeout(timeoutToDimiss);
      };
    }, [wantToclose]);

    return (
      <Animated.View
        entering={SlideInLeft}
        exiting={ZoomOut}
        layout={Layout.delay(350 * index).springify()}>
        <View {...props} style={[props.style, {position: 'relative'}]}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={swipeToDimiss}>
              <Task selected={selected} title={title} colorTask={colorTask} />
            </Animated.View>
          </GestureDetector>
          <Animated.View style={[undoActionAnim, styles.undoAction]}>
            <UndoAction
              onUndo={() => {
                offsetX.value = withSpring(0);
                setWantToClose(false);
                progressToUndo.value = withTiming(0);
              }}
              progress={progressToUndo}
            />
          </Animated.View>
          <Animated.View style={[styles.loadingDimiss, loadingAnim]}>
            <LoadingDimiss />
          </Animated.View>
        </View>
      </Animated.View>
    );
  },
  (prevState, nextState) => {
    const diffState = diff(prevState, nextState);
    const filtered = diffState?.filter(diff => {
      const diffPath = diff.path?.filter(
        path => !['onPress', 'onDimiss'].some(value => value === path),
      );
      return diffPath ? diffPath.length > 0 : false;
    });
    return filtered?.length === 0;
  },
);

export {CardTask};
