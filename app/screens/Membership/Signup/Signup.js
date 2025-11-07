import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';
import AppStyles from '../../../styles/AppStyles';
import TextView from '../../../components/TextView/TextView';
import { Touchable } from '@app/app/components/Button';
import Button from '../../../components/Button/Button';
import screens from '../../../constants/screens';
import { colors } from '../../../styles';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { clearAuthResponseMsg } from '../../../actions/authActions';
import { scale, verticalScale } from 'react-native-size-matters';
import { signup } from '../../../services/authService';
import FormGroup from '../../../components/FormGroup';
import Validation from '../../../components/Validation/Validation';
import Input from '../../../components/Input';
import { halfindent } from '@app/app/styles/dimensions';
import { borderRadius } from '@app/app/styles/dimensions';

// Import Toast
import Toast from 'react-native-toast-message';

function Signup(props) {
  const [selectRole, setSelectedRole] = useState({
    customer: false,
    merchant: false
  });
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const { loading, resError = {} } = props.auth;

  useEffect(() => {
    console.log('Signup');
    return () => {
      props.clearAuthResponseMsg();
    };
  }, []);

  // Show toast whenever resError changes
  useEffect(() => {
    if (resError && Object.keys(resError).length > 0) {
      const errorMsg =
        resError.role ||
        resError.firstname ||
        resError.lastname ||
        resError.email ||
        resError.mobileNumber ||
        resError.password ||
        resError.confirmPassword ||
        resError.error ||
        'Please check the form';

      Toast.show({
        type: 'error',
        text1: 'Signup Error',
        text2: errorMsg,
        position: 'top',
        visibilityTime: 4000,
      });
    }
  }, [resError]);

  const onPressSignup = async () => {
    props.clearAuthResponseMsg(); // Clear previous errors

    const role =
      selectRole.customer && selectRole.merchant
        ? 'both'
        : selectRole.customer
        ? 'customer'
        : selectRole.merchant
        ? 'merchant'
        : '';

    if (!role) {
      Toast.show({
        type: 'error',
        text1: 'Role Required',
        text2: 'Please select Customer or Merchant',
      });
      return;
    }

    const signupObj = {
      firstName: fname.trim(),
      lastName: lname.trim(),
      email: email.trim(),
      mobileNumber: phone.trim(),
      password: password,
      confirmPassword: confirmPassword,
      role,
    };

    const result = await props.signup(signupObj);

    if (result) {
      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: 'Please verify your email',
        position: 'top',
      });
      props.navigation.navigate(screens.VerifyEmail);
    }
  };

  const onPressLogin = () => {
    props.navigation.navigate(screens.Login);
  };

  const setUserRole = (name) => {
    setSelectedRole((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const onTogglePassword = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  return (
    <>
      <SafeAreaView style={[AppStyles.root]}>
        <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
          <TextView
            text={'Create new account'}
            type={'title'}
            isTextColorWhite={true}
            style={[AppStyles.titleStyle, AppStyles.title]}
          />
          <TextView
            color={colors.lightWhite}
            text={'Please fill in the form to continue'}
            type={'body-head'}
            style={[AppStyles.titleStyle, AppStyles.subtitle]}
          />

          {/* Role Selection */}
          <Validation error={resError.role}>
            <View style={s.customerMain}>
              <Touchable
                style={[
                  s.customermarbtn,
                  selectRole.customer && s.selectedBtn,
                ]}
                onPress={() => setUserRole('customer')}
              >
                <TextView color={colors.white} text={'Customer'} type={'body-one'} style={s.customermarText} />
                <Image source={require('../../../assets/images/customer.png')} />
              </Touchable>

              <Touchable
                style={[
                  s.customermarbtn,
                  selectRole.merchant && s.selectedBtn,
                ]}
                onPress={() => setUserRole('merchant')}
              >
                <TextView color={colors.white} text={'Merchant'} type={'body-one'} style={s.customermarText} />
                <Image source={require('../../../assets/images/merchant.png')} />
              </Touchable>
            </View>
          </Validation>

          {/* Form Fields */}
          <FormGroup style={s.fromGroup}>
            <Validation error={resError.firstname}>
              <Input
                onChangeText={setFname}
                style={s.inputText}
                returnKeyType={'next'}
                placeholder='First Name'
                isIconLeft={true}
                leftIconName={'create'}
                editable={!loading}
                value={fname}
              />
            </Validation>

            <Validation error={resError.lastname}>
              <Input
                onChangeText={setLname}
                style={s.inputText}
                returnKeyType={'next'}
                placeholder='Last Name'
                isIconLeft={true}
                leftIconName={'create'}
                editable={!loading}
                value={lname}
              />
            </Validation>

            <Validation error={resError.email}>
              <Input
                onChangeText={setEmail}
                style={s.inputText}
                returnKeyType={'next'}
                placeholder='Email Address'
                keyboardType="email-address"
                isIconLeft={true}
                leftIconName={'mail'}
                editable={!loading}
                value={email}
              />
            </Validation>

            <Validation error={resError.mobileNumber}>
              <Input
                onChangeText={setPhone}
                style={s.inputText}
                returnKeyType={'next'}
                keyboardType={'numeric'}
                placeholder='Phone Number'
                isIconLeft={true}
                leftIconName={'call'}
                editable={!loading}
                value={phone}
              />
            </Validation>

            <Validation error={resError.password}>
              <Input
                onPressIcon={onTogglePassword}
                style={s.inputText}
                returnKeyType={'next'}
                autoCapitalize='none'
                placeholder='Password'
                secureTextEntry={!isPasswordVisible}
                isIconLeft={true}
                isIconRight={true}
                leftIconName={'lock-closed'}
                rightIconName={!isPasswordVisible ? 'eye' : 'eye-off'}
                iconColor={colors.dustRodeo}
                onChangeText={setPassword}
                editable={!loading}
                value={password}
              />
            </Validation>

            <Validation error={resError.confirmPassword || resError.error}>
              <Input
                onPressIcon={onTogglePassword}
                style={s.inputText}
                returnKeyType={'done'}
                onSubmitEditing={onPressSignup}
                autoCapitalize='none'
                placeholder='Confirm Password'
                secureTextEntry={!isPasswordVisible}
                isIconLeft={true}
                isIconRight={true}
                leftIconName={'lock-closed'}
                rightIconName={!isPasswordVisible ? 'eye' : 'eye-off'}
                iconColor={colors.dustRodeo}
                onChangeText={setConfirmPassword}
                editable={!loading}
                value={confirmPassword}
              />
            </Validation>
          </FormGroup>

          {/* Sign Up Button */}
          <Button
            onPress={onPressSignup}
            isLoading={loading}
            ButtonText='Sign Up'
            style={[s.signBtn, AppStyles.btnStyle]}
            animationStyle={s.signBtn}
          />

          {/* Footer */}
          <View style={s.footerMain}>
            <TextView color={colors.white} text={'Already have an account? '} type={'body-one'} />
            <TextView
              color={colors.primary}
              isClickableLink={true}
              text={'Sign In'}
              type={'body-one'}
              onPress={onPressLogin}
              disabled={loading}
            />
          </View>
        </ScrollableAvoidKeyboard>
      </SafeAreaView>
    </>
  );
}

const s = StyleSheet.create({
  customerMain: {
    marginTop: verticalScale(30),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: verticalScale(13),
  },
  customermarbtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: scale(borderRadius),
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(10),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    position: 'relative',
  },
  selectedBtn: {
    borderColor: colors.white,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  customermarText: {
    letterSpacing: 0.5,
    marginBottom: scale(8),
  },
  fromGroup: {
    flex: 1,
  },
  inputText: {
    marginLeft: scale(halfindent),
    color: 'white',
  },
  signBtn: {
    marginTop: verticalScale(8),
  },
  footerMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(50),
    marginBottom: verticalScale(8),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  clearAuthResponseMsg,
  signup,
})(Signup);