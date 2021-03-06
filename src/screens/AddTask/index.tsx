import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Fab} from '../../components/Fab';
import {Icon} from '../../components/Icon';
import {NavigationProps} from '../../components/Router';
import {getFontWeight, Typography} from '../../components/Typography';
import {useIoCContext} from '../../contexts/IoCContext';
import {useSnack} from '../../contexts/Snack';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';
import {Types} from '../../ioc/types';
import {Category} from '../../modules/categories/models/ICategoryService';
import {ITaskService} from '../../modules/tasks/models/ITaskService';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.palette.background.default.computed,
      justifyContent: 'space-evenly',
      paddingHorizontal: widthPercentageToDP(6),
    },
    textInput: {
      fontSize: widthPercentageToDP(14),
      color:
        theme.palette.type === 'light'
          ? theme.palette.darken(theme.palette.primary.computed, 0.6)
          : theme.palette.primary.computed,
    },
    icon: {
      fontSize: widthPercentageToDP(5),
      color: theme.palette.primary.computed,
    },
    selectDate: {
      width: widthPercentageToDP(30),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      padding: widthPercentageToDP(2),
      marginRight: widthPercentageToDP(4),
    },
    iconColor: {width: '100%', height: '100%'},
    iconBorder: {
      borderColor: 'red',
      borderWidth: 1,
      width: widthPercentageToDP(6),
      height: widthPercentageToDP(6),
      borderRadius: widthPercentageToDP(6) / 2,
      padding: widthPercentageToDP(1),
    },
    submitButton: {
      width: widthPercentageToDP(45),

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      alignSelf: 'flex-end',

      padding: widthPercentageToDP(4),

      backgroundColor: theme.palette.secondary.computed,
      borderWidth: 0,

      ...Platform.select({
        android: {
          elevation: 4,
          shadowColor: theme.palette.secondary.computed,
        },
      }),
    },
  });

const AddTaskScreen: React.FC = () => {
  const router = useNavigation<NavigationProps>();
  const theme = useTheme();
  const styles = useStyles(theme);
  const iocContext = useIoCContext();
  const snack = useSnack();

  const taskService = iocContext.serviceContainer.get<ITaskService>(
    Types.Task.ITaskService,
  );

  const [sizeIconColor, setSizeIconColor] = useState(0);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);

  const saveNewTask = useCallback(async () => {
    if (!category) return;
    try {
      setLoading(true);
      await taskService.save({categoryID: category.id, title});
      router.goBack();
    } catch (error) {
      snack.addNotification({
        title: 'Ocorreu um erro ao adicionar nova tarefa',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [title, category]);

  return (
    <SafeAreaView style={styles.container}>
      <Fab
        variant="outlined"
        onPress={() => router.goBack()}
        style={{alignSelf: 'flex-end'}}>
        <Icon
          type="feather"
          name="x"
          style={[
            styles.icon,
            {
              color:
                theme.palette.type === 'light'
                  ? theme.palette.darken(theme.palette.primary.computed, 0.8)
                  : theme.palette.primary.computed,
            },
          ]}
        />
      </Fab>
      <View>
        <TextInput
          placeholder="Digite a tarefa"
          style={[getFontWeight('regular'), styles.textInput]}
          placeholderTextColor={theme.palette.primary.computed}
          onChangeText={text => setTitle(text)}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Fab variant="outlined" style={styles.selectDate}>
          <Icon type="feather" name="calendar" style={styles.icon} />
          <Typography
            style={{
              fontSize: widthPercentageToDP(6),
              color: theme.palette.primary.computed,
            }}>
            Hoje
          </Typography>
        </Fab>

        <Fab
          variant="outlined"
          onPress={() =>
            router.navigate('SelectCategory', {
              onGoBack: category => setCategory(category),
            })
          }>
          <View
            style={[styles.iconBorder, {borderColor: category?.colorCategory}]}>
            <View
              style={[
                styles.iconColor,
                {borderRadius: sizeIconColor / 2},
                {backgroundColor: category?.colorCategory},
              ]}
              onLayout={({nativeEvent}) =>
                setSizeIconColor(nativeEvent.layout.height)
              }>
              {category ? (
                <></>
              ) : (
                <Icon
                  type="material-community"
                  name="shape"
                  style={{color: theme.palette.primary.computed}}
                />
              )}
            </View>
          </View>
        </Fab>
      </View>
      <View>
        <Fab
          variant="outlined"
          style={styles.submitButton}
          size={Platform.select({
            android: widthPercentageToDP(13),
            ios: widthPercentageToDP(17),
          })}
          onPress={saveNewTask}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Typography
                style={{fontSize: widthPercentageToDP(7), color: '#fff'}}>
                Nova tarefa
              </Typography>
              <Icon
                style={[styles.icon, {color: '#fff'}]}
                type="feather"
                name="chevron-up"
              />
            </>
          )}
        </Fab>
      </View>
    </SafeAreaView>
  );
};

export {AddTaskScreen};
