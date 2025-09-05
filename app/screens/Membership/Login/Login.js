import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';
import AppStyles from '../../../styles/AppStyles';
import TextView from '../../../components/TextView/TextView';
import Button from '../../../components/Button/Button';
import screens from '../../../constants/screens';
import { colors } from '../../../styles';
import Validation from '../../../components/Validation/Validation';
import FormGroup from '../../../components/FormGroup';
import Input from '../../../components/Input';
import { scale, verticalScale } from 'react-native-size-matters';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { borderRadius, halfindent, indent } from '@app/app/styles/dimensions';
import { getAuthUser } from '@app/app/utils/localStorageHelpers';
import { clearAuthResponseMsg } from '../../../actions/authActions';
import { login } from '../../../services/authService';

function Login(props) {
  const [email, setEmail] = useState(__DEV__ ? 'kinjald+1@algoscript.in' : 'kinjald+1@algoscript.in');
  const [password, setPassword] = useState(__DEV__ ? '123456' : '123456');
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const { loading, resError = {} } = props.auth;

  useEffect(() => {
    console.log('Login');
    return () => {
      props.clearAuthResponseMsg();
    };
  }, []);

  const onLogin = async () => {
    const loginObj = {
      username: String(email),
      password: String(password),
      role: 'merchant'
    };
    console.log(loginObj);
    const result = await props.login(loginObj);
    let screen;
    if (result) {
        const userDetails = await getAuthUser();
        if (userDetails.verificationRequired) {
            screen = screens.VerifyEmail;
          } else if (userDetails.onboardingRequired) {
              screen = screens.Onboarding;
            } else {
                screen = screens.HomeRoot;
              }
            props.navigation.navigate(screens.HomeRoot);
    }
  };

  const onTogglePassword = () => {
    setPasswordVisibility(!isPasswordVisible);
  };
  const onPressSignup = () => {
    props.navigation.navigate(screens.Signup);
  };
  const onPressForgotPassword = () => {
    props.navigation.navigate(screens.ForgotPassword);
  };

  return (
    <>
      <SafeAreaView style={AppStyles.root}>
        <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
          <TextView
            text={'Welcome Back!'}
            type={'title'}
            isTextColorWhite={true}
            style={[AppStyles.titleStyle, AppStyles.title]}
          />
          <TextView
            color={colors.lightWhite}
            text={'Please sign in to your account'}
            type={'body-head'}
            style={[AppStyles.titleStyle, AppStyles.subtitle]}
          />
          <FormGroup style={[AppStyles.formContainer, s.fromGroup]}>
            <Validation error={resError.username}>
              <Input
                style={s.input}
                keyboardType={'email-address'}
                returnKeyType={'next'}
                placeholder='example@gmail.com'
                isIconLeft={true}
                leftIconName={'mail'}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </Validation>
            <Validation error={resError.password}>
              <Input
                onPressIcon={onTogglePassword}
                style={s.input}
                returnKeyType={'done'}
                onSubmitEditing={onLogin}
                autoCapitalize='none'
                placeholder='Password'
                secureTextEntry={!isPasswordVisible}
                isIconLeft={true}
                isIconRight={true}
                leftIconName={'lock-closed'}
                rightIconName={!isPasswordVisible ? 'eye' : 'eye-off'}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </Validation>
            <Validation error={resError.error}>
              <TextView
                color={colors.lightWhite}
                isClickableLink={true}
                text={'Forgot Password?'}
                onPress={onPressForgotPassword}
                type={'body-one'}
                style={[s.forgotPasswordLink]}
                disabled={loading}
              />
            </Validation>
          </FormGroup>
          <Button
            onPress={onLogin}
            ButtonText='Sign In'
            style={s.signBtn}
            animationStyle={s.signBtn}
            isLoading={loading}
          />
          <Button
            isIcon={true}
            iconName={'logo-google'}
            ButtonText='Sign In with Google'
            style={[s.secondaryBtn, s.googleBtn]}
            animationStyle={[s.secondaryBtn, s.googleBtn]}
            isLoading={loading}
          />
          <Button
            isIcon={true}
            iconName={'facebook'}
            iconType={'materialcommunity'}
            ButtonText='Sign In with Facebook'
            style={[s.secondaryBtn, s.fbBtn]}
            animationStyle={[s.secondaryBtn, s.fbBtn]}
            isLoading={loading}
          />
          <View style={s.footerMain}>
            <TextView color={colors.white} text={'Don’t have an Account? '} type={'body-one'} />
            <TextView
              color={colors.primary}
              isClickableLink={true}
              text={'Sign Up'}
              type={'body-one'}
              onPress={onPressSignup}
              disabled={loading}
            />
          </View>
        </ScrollableAvoidKeyboard>
      </SafeAreaView>
    </>
  );
}
const s = StyleSheet.create({
  fromGroup: {
    marginTop: verticalScale(45),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(40)
  },
  input: {
    marginLeft: scale(halfindent),
    color: 'white'
  },
  forgotPasswordLink: {
    marginTop: verticalScale(15),
    textAlign: 'right'
  },
  signBtn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(indent),
    borderRadius: borderRadius
  },
  secondaryBtn: {
    backgroundColor: colors.backgroundColor,
    marginHorizontal: scale(30),
    borderRadius: borderRadius,
    borderWidth: 1,
    borderColor: colors.primary
  },
  googleBtn: {
    marginTop: verticalScale(15)
  },
  fbBtn: {
    marginTop: verticalScale(10)
  },
  footerMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(indent + 50),
    marginBottom: verticalScale(8)
  }
});
const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  clearAuthResponseMsg,
  login
})(Login);
