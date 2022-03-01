import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { CardMinimalCategory } from '../../components/CardMinimalCategory';
import { Layout } from '../../components/Layout';
import { Typography } from '../../components/Typography';
import { useIoCContext } from '../../contexts/IoCContext';
import { makeStyles } from '../../contexts/ThemeProvider/Theme';
import { Types } from '../../ioc/types';
import {
  Category,
  ICategoryService,
} from '../../modules/categories/models/ICategoryService';

const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.primary.computed,
    fontSize: widthPercentageToDP(8),
  },
  gridView: { flexDirection: 'row', flexWrap: 'wrap' },
}));

const CategoriesScreen: React.FC = () => {
  const styles = useStyles();
  const iocContext = useIoCContext();

  const categoryService = iocContext.serviceContainer.get<ICategoryService>(
    Types.Category.ICategoryService,
  );
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => categoryService.observerList({ save: setCategories }), []);

  return (
    <Layout enableMargins>
      <Typography style={styles.title}>Categorias</Typography>
      <View style={[{ flex: 1 }, styles.gridView]}>
        {categories.map((category, idx) => {
          return (
            <CardMinimalCategory
              category={category}
              index={idx}
              displayList="grid"
              textSearch=""
              key={category.id}
            />
          );
        })}
      </View>
    </Layout>
  );
};

export { CategoriesScreen };
