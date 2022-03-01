import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardMinimalCategory } from '../../components/CardMinimalCategory';
import { Icon } from '../../components/Icon';
import { AppRoutes, NavigationProps } from '../../components/Router';
import { getFontWeight, Typography } from '../../components/Typography';
import { useIoCContext } from '../../contexts/IoCContext';
import { useTheme } from '../../contexts/ThemeProvider';
import { Theme } from '../../contexts/ThemeProvider/Theme';
import { useFetchData } from '../../hooks/FetchData';
import { Types } from '../../ioc/types';
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
    gridView: { flexDirection: 'row', flexWrap: 'wrap' },
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
    () => debounce((text: string) => setSearch(text), 350),
    [],
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView contentContainerStyle={[{ flex: 1 }, styles.screenContainer]}>
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
            }
          >
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
        <View style={[{ flex: 1 }, displayList === 'grid' && styles.gridView]}>
          {fetchCategories.value?.map((category, idx) => {
            return (
              <CardMinimalCategory
                category={category}
                index={idx}
                displayList={displayList}
                textSearch={search}
                key={category.id}
                onPress={selectCategory(category)}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export { SelectCategoryModal };
