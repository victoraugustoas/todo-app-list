import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import debounce from 'lodash.debounce';
import React, {useCallback, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {Layout, ZoomIn, ZoomOut} from 'react-native-reanimated';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from '../../components/Icon';
import {AppRoutes, NavigationProps} from '../../components/Router';
import {getFontWeight, Typography} from '../../components/Typography';
import {useIoCContext} from '../../contexts/IoCContext';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';
import {useFetchData} from '../../hooks/FetchData';
import {Types} from '../../ioc/types';
import {
  Category,
  ICategoryService,
} from '../../modules/categories/models/ICategoryService';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      backgroundColor: theme.palette.background.default.computed,
    },
    screenContainer: {
      paddingHorizontal: widthPercentageToDP(5),
      flex: 1,
      backgroundColor: theme.palette.background.default.computed,
    },
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
    gridView: {flexDirection: 'row', flexWrap: 'wrap'},
    categoryGridGap: {
      marginBottom: widthPercentageToDP(4),
      marginRight: widthPercentageToDP(4),
    },
    categoryListGap: {marginBottom: widthPercentageToDP(4)},
    iconColor: {width: '100%', height: '100%'},
    iconBorder: {
      borderWidth: 1,
      width: widthPercentageToDP(6),
      height: widthPercentageToDP(6),
      borderRadius: widthPercentageToDP(6) / 2,
      padding: widthPercentageToDP(1),
      marginRight: widthPercentageToDP(2),
    },
    textCategory: {
      fontSize: widthPercentageToDP(8),
      color: theme.palette.primary.computed,
    },
    titleScreen: {
      color: theme.palette.primary.computed,
      fontSize: widthPercentageToDP(10),
    },
    searchContainer: {
      backgroundColor:
        theme.palette.type === 'light'
          ? '#fff'
          : theme.palette.lighten(theme.palette.background.drawer.light, 0.6),
      borderRadius: theme.shape.borderRadius,
      padding: widthPercentageToDP(3),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: widthPercentageToDP(4),
    },
    inputSearch: {
      fontSize: widthPercentageToDP(8),
      flex: 1,
      color: theme.palette.primary.computed,
    },
    iconViewList: {
      fontSize: widthPercentageToDP(5),
      color: theme.palette.primary.computed,
    },
  });

interface CategoryItem {
  displayList: 'grid' | 'list';
  index: number;
  category: Category;
  textSearch: string;
  selectCategory: () => void;
}

const CategoryItem: React.FC<CategoryItem> = ({
  displayList,
  index: idx,
  category,
  selectCategory,
  textSearch,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const [sizeIconColor, setSizeIconColor] = useState(0);
  const matched = useMemo(
    () => match(category.title, textSearch),
    [textSearch],
  );
  const parsed = useMemo(() => parse(category.title, matched), [matched]);
  const firstMatch = useMemo(
    () =>
      parsed
        .filter(value => value.highlight)
        .map(value => value.text)
        .join(''),
    [parsed],
  );
  const lastMatch = useMemo(
    () =>
      parsed
        .filter(value => value.highlight === false)
        .map(value => value.text)
        .join(''),
    [parsed],
  );
  const render = useMemo(
    () => firstMatch.length > 0 || !textSearch,
    [firstMatch, textSearch],
  );

  return render ? (
    <Animated.View
      style={[
        displayList === 'grid'
          ? styles.categoryGridGap
          : styles.categoryListGap,
      ]}
      entering={ZoomIn}
      exiting={ZoomOut}
      layout={Layout.delay(225 * idx)}>
      <TouchableOpacity onPress={selectCategory}>
        <View style={styles.categoryContainer}>
          <View
            style={[styles.iconBorder, {borderColor: category.colorCategory}]}>
            <View
              style={[
                styles.iconColor,
                {
                  borderRadius: sizeIconColor / 2,
                  backgroundColor: category.colorCategory,
                },
              ]}
              onLayout={({nativeEvent}) =>
                setSizeIconColor(nativeEvent.layout.height)
              }
            />
          </View>
          <Typography
            style={[
              styles.textCategory,
              {
                color:
                  theme.palette.type === 'light'
                    ? theme.palette.secondary.computed
                    : theme.palette.success.computed,
              },
            ]}>
            {firstMatch}
          </Typography>
          <Typography style={styles.textCategory}>{lastMatch}</Typography>
        </View>
      </TouchableOpacity>
    </Animated.View>
  ) : (
    <></>
  );
};

const SelectCategoryModal: React.FC = () => {
  const iocContext = useIoCContext();
  const theme = useTheme();
  const styles = useStyles(theme);
  const router = useNavigation<NavigationProps>();
  const route =
    useRoute<NativeStackScreenProps<AppRoutes, 'SelectCategory'>['route']>();

  const categoryService = iocContext.serviceContainer.get<ICategoryService>(
    Types.Category.ICategoryService,
  );

  const [search, setSearch] = useState('');
  const [displayList, setDisplayList] = useState<'list' | 'grid'>('grid');

  const fetchCategories = useFetchData(() => categoryService.list());

  const selectCategory = useCallback((category: Category) => {
    return () => {
      route.params.onGoBack(category);
      router.goBack();
    };
  }, []);

  const searchCategory = useMemo(
    () => debounce((text: string) => setSearch(text), 500),
    [],
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView contentContainerStyle={[{flex: 1}, styles.screenContainer]}>
        <Typography style={styles.titleScreen}>
          Selecione uma categoria
        </Typography>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Procure uma categoria"
            style={[getFontWeight('regular'), styles.inputSearch]}
            onChangeText={text => searchCategory(text)}
          />
          <TouchableOpacity
            onPress={() =>
              setDisplayList(old => (old === 'grid' ? 'list' : 'grid'))
            }>
            {displayList === 'list' ? (
              <Icon
                type="material-community"
                name="view-grid-outline"
                style={styles.iconViewList}
              />
            ) : (
              <Icon
                type="material-community"
                name="view-agenda-outline"
                style={styles.iconViewList}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={[{flex: 1}, displayList === 'grid' && styles.gridView]}>
          {fetchCategories.value?.map((category, idx) => {
            return (
              <CategoryItem
                category={category}
                index={idx}
                displayList={displayList}
                textSearch={search}
                key={category.id}
                selectCategory={selectCategory(category)}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export {SelectCategoryModal};
