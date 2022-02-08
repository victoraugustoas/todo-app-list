import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, {useCallback, useState} from 'react';
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

  const [sizeIconColor, setSizeIconColor] = useState(0);
  const [search, setSearch] = useState('');
  const [displayList, setDisplayList] = useState<'list' | 'grid'>('grid');

  const fetchCategories = useFetchData(() => categoryService.list());

  const selectCategory = useCallback((category: Category) => {
    return () => {
      route.params.onGoBack(category);
      router.goBack();
    };
  }, []);

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
            onChangeText={text => setSearch(text)}
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
            const matched = match(category.title, search);
            const parsed = parse(category.title, matched);
            const render = parsed.some(value => value.highlight) || !search;

            return render ? (
              <Animated.View
                key={category.id}
                style={[
                  displayList === 'grid'
                    ? styles.categoryGridGap
                    : styles.categoryListGap,
                ]}
                entering={ZoomIn.delay(225 * idx)}
                exiting={ZoomOut.delay(225 * idx)}
                layout={Layout.delay(225 * idx)}>
                <TouchableOpacity
                  style={styles.categoryContainer}
                  onPress={selectCategory(category)}>
                  <View
                    style={[
                      styles.iconBorder,
                      {borderColor: category.colorCategory},
                    ]}>
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
                  {parsed.map(value => {
                    return (
                      <Typography
                        key={value.text}
                        style={[
                          styles.textCategory,
                          value.highlight && {
                            color:
                              theme.palette.type === 'light'
                                ? theme.palette.secondary.computed
                                : theme.palette.success.computed,
                          },
                        ]}>
                        {value.text}
                      </Typography>
                    );
                  })}
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <></>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export {SelectCategoryModal};
