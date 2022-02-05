import {Formik} from 'formik';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Typography} from '../../components/Typography';
import {useAuth} from '../../contexts/Auth';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: widthPercentageToDP(5),
    },
    inputsContainer: {
      width: '100%',
      height: heightPercentageToDP(10),
      justifyContent: 'space-around',
    },
    textInput: {fontSize: widthPercentageToDP(5)},
    buttonLogin: {
      fontSize: widthPercentageToDP(6),
    },
  });

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const auth = useAuth();

  const initialValues = {email: '', password: ''};

  return (
    <Formik initialValues={initialValues} onSubmit={values => {}}>
      {props => (
        <SafeAreaView style={styles.container}>
          <View />
          <View style={styles.inputsContainer}>
            <TextInput
              placeholder="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              onChangeText={text => props.setFieldValue('email', text)}
              value={props.values.email}
              style={styles.textInput}
            />
            <TextInput
              placeholder="senha"
              secureTextEntry
              textContentType="password"
              onChangeText={text => props.setFieldValue('password', text)}
              value={props.values.password}
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: widthPercentageToDP(20),
            }}
            onPress={() => auth.signInState.signIn(props.values)}>
            <Typography style={styles.buttonLogin}>Entrar</Typography>
            {auth.signInState.loadingSignIn ? (
              <ActivityIndicator color={theme.palette.primary.computed} />
            ) : (
              <></>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </Formik>
  );
};

export {LoginScreen};
