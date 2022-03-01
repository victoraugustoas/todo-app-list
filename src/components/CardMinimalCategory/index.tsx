import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { Layout, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../../contexts/ThemeProvider';
import { makeStyles } from '../../contexts/ThemeProvider/Theme';
import { Category } from '../../modules/categories/models/ICategoryService';
import { Typography } from '../Typography';

const useStyles = makeStyles(theme => ({
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPercentageToDP(5),
    paddingVertical: widthPercentageToDP(2.6),
    backgroundColor:
      theme.palette.type === 'light'
        ? '#fff'
        : theme.palette.background.drawer.computed,
    borderRadius: theme.shape.borderRadius,
  },
  iconBorder: {
    borderWidth: 1,
    width: widthPercentageToDP(6),
    height: widthPercentageToDP(6),
    borderRadius: widthPercentageToDP(6) / 2,
    padding: widthPercentageToDP(1),
    marginRight: widthPercentageToDP(2),
  },
  categoryGridGap: {
    marginBottom: widthPercentageToDP(4),
    marginRight: widthPercentageToDP(4),
  },
  categoryListGap: { marginBottom: widthPercentageToDP(4) },
  iconColor: { width: '100%', height: '100%' },
  textCategory: {
    fontSize: widthPercentageToDP(8),
    color: theme.palette.primary.computed,
  },
}));

export interface CardMinimalCategoryProps {
  displayList: 'grid' | 'list';
  index: number;
  category: Category;
  textSearch: string;
  onPress?: () => void;
}

export const CardMinimalCategory: React.FC<CardMinimalCategoryProps> = ({
  displayList,
  index: idx,
  category,
  onPress,
  textSearch,
}) => {
  const styles = useStyles();
  const theme = useTheme();

  const [sizeIconColor, setSizeIconColor] = useState(0);
  const matched = useMemo(
    () => match(category.title, textSearch),
    [textSearch],
  );
  const parsed = useMemo(() => parse(category.title, matched), [matched]);
  const render = useMemo(
    () => parsed.length > 1 || !textSearch,
    [textSearch, parsed],
  );
  console.log(matched);

  return render ? (
    <Animated.View
      style={[
        displayList === 'grid'
          ? styles.categoryGridGap
          : styles.categoryListGap,
      ]}
      entering={ZoomIn.delay(225 * idx)}
      exiting={ZoomOut.delay(225 * idx)}
      layout={Layout.delay(225 * idx)}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={styles.categoryContainer}>
          <View
            style={[styles.iconBorder, { borderColor: category.colorCategory }]}
          >
            <View
              style={[
                styles.iconColor,
                {
                  borderRadius: sizeIconColor / 2,
                  backgroundColor: category.colorCategory,
                },
              ]}
              onLayout={({ nativeEvent }) =>
                setSizeIconColor(nativeEvent.layout.height)
              }
            />
          </View>
          {Array.from(category.title).map((value, idx) => {
            return (
              <Typography
                key={idx}
                style={[
                  styles.textCategory,
                  matched.find(arr => arr[0] <= idx && idx < arr[1])
                    ? {
                        color:
                          theme.palette.type === 'light'
                            ? theme.palette.secondary.computed
                            : theme.palette.success.computed,
                      }
                    : {},
                ]}
              >
                {value}
              </Typography>
            );
          })}
        </View>
      </TouchableOpacity>
    </Animated.View>
  ) : (
    <></>
  );
};
