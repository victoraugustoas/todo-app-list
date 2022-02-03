import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Fab} from '../../components/Fab';
import {Icon} from '../../components/Icon';
import {NavigationProps} from '../../components/Router';
import {getFontWeight} from '../../components/Typography';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.palette.background.default.computed,
    },
    textInput: {
      fontSize: widthPercentageToDP(14),
      color: theme.palette.primary.computed,
    },
  });

const AddTaskScreen: React.FC = () => {
  const router = useNavigation<NavigationProps>();
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <Fab variant="outlined" onPress={() => router.goBack()}>
        <Icon
          type="feather"
          name="x"
          style={{fontSize: widthPercentageToDP(5)}}
        />
      </Fab>

      <View>
        <TextInput
          placeholder="Digite a tarefa"
          style={[getFontWeight('regular'), styles.textInput]}
          placeholderTextColor={theme.palette.primary.computed}
        />
      </View>
    </SafeAreaView>
  );
};

export {AddTaskScreen};
