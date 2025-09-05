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

  useEffect(() => {
    console.log('Signup');
    return () => {
      props.clearAuthResponseMsg();
    };
  }, []);

  const onPressSignup = async () => {
    const role =
      selectRole.customer && selectRole.merchant
        ? 'both'
        : selectRole.customer
        ? 'customer'
        : selectRole.merchant
        ? 'merchant'
        : '';

    const signupObj = {
      firstName: String(fname),
      lastName: String(lname),
      email: String(email),
      mobileNumber: phone,
      password: String(password),
      confirmPassword: String(confirmPassword),
      role
    };
    const result = await props.signup(signupObj);
    if (result) {
      props.navigation.navigate(screens.VerifyEmail);
    }
  };
  const onPressLogin = () => {
    props.navigation.navigate(screens.Login);
  };

  const setUserRole = (name) => {
    setSelectedRole((prev) => {
      return {
        ...prev,
        [name]: !selectRole[name]
      };
    });
  };

  const onTogglePassword = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const { loading, resError = {} } = props.auth;
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
          <Validation error={resError.role}>
            <View style={s.customerMain}>
              <Touchable
                style={selectRole.customer ? [s.customermarbtn, s.selectedBtn] : s.customermarbtn}
                onPress={() => {
                  setUserRole('customer');
                }}>
                <TextView color={colors.white} text={'Customer'} type={'body-one'} style={[s.customermarText]} />
                <Image source={require('../../../assets/images/customer.png')}></Image>
              </Touchable>
              <Touchable
                style={selectRole.merchant ? [s.customermarbtn, s.selectedBtn] : s.customermarbtn}
                onPress={() => {
                  setUserRole('merchant');
                }}>
                <TextView color={colors.white} text={'Merchant'} type={'body-one'} style={[s.customermarText]} />
                <Image source={require('../../../assets/images/merchant.png')}></Image>
              </Touchable>
            </View>
          </Validation>
          <FormGroup style={[s.fromGroup]}>
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
          <Button
            onPress={onPressSignup}
            isLoading={loading}
            ButtonText='Sign Up'
            style={[s.signBtn, AppStyles.btnStyle]}
            animationStyle={s.signBtn}
          />
          <View style={s.footerMain}>
            <TextView color={colors.white} text={'Don’t have an Account?'} type={'body-one'} />
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
    paddingVertical: verticalScale(13)
  },
  radioBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: scale(borderRadius),
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(10),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    position: 'relative'
  },
  customerMerchantText: {
    letterSpacing: 0.5,
    marginBottom: scale(8)
  },
  fromGroup: {
    flex: 1
  },
  inputText: {
    marginLeft: scale(halfindent),
    color: 'white'
  },
  signBtn: {
    marginTop: verticalScale(8)
  },
  footerMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(50),
    marginBottom: verticalScale(8)
  },
  check: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  customermarText: {
    letterSpacing: 0.5,
    marginBottom: scale(8)
  },
  customermarbtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: scale(borderRadius),
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(10),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    position: 'relative'
  },
  selectedBtn: {
    borderColor: colors.white
  }
});
const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  clearAuthResponseMsg,
  signup
})(Signup);
