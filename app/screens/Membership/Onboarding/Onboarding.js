import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { saveAuthUser } from './../../../utils/localStorageHelpers';
import { borderRadius } from '@app/app/styles/dimensions';
import Input from '@app/app/components/Input';
import Validation from '@app/app/components/Validation/Validation';
import FormGroup from '@app/app/components/FormGroup';
import TextView from '@app/app/components/TextView/TextView';
import { colors } from '@app/app/styles';
import { verticalScale, scale } from 'react-native-size-matters';
import NavigationOptions from '../../../components/NavigationOptions';
import screens from '../../../constants/screens';
import { Button, Touchable } from '@app/app/components/Button';
import Icon from '@app/app/components/Icon';
import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { View, SafeAreaView, Image, StyleSheet } from 'react-native';
import AppStyles from '@app/app/styles/AppStyles';
import { getAuthUser } from '@app/app/utils/localStorageHelpers';
import { getUserProfile, updateUserProfile } from '@app/app/services/profileService';
import { setCurrentUser } from '@app/app/actions/authActions';
import { clearProfileResponseMsg, setProfile } from './../../../actions/profileActions';
import { getDisplayName } from '@app/app/global/Helpers';
import { logout } from '@app/app/services/authService';
import { stackReset } from './../../../global/Helpers';
import { genderArray } from './../../../data/raw';

const Onboarding = (props) => {
  let { profileInfo, resError = {}, loading } = props.profile;
  let { user } = props.auth;
  useEffect(() => {
    console.log('Onboarding');
    loadData();
    return () => {
      props.clearProfileResponseMsg();
    };
  }, []);

  const loadData = async () => {
    await props.getUserProfile();
  };
  const handleFormChange = (key, value) => {
    if (!key) return;
    profileInfo = props.profile.profileInfo;
    if (profileInfo) {
      profileInfo[key] = value;
      props.setProfile(profileInfo);
      console.log(profileInfo);
    }
  };

  const onSubmit = async () => {
    profileInfo = props.profile.profileInfo;
    const result = await props.updateUserProfile(profileInfo);
    if (result) {
      const userDetails = await getAuthUser();
      delete userDetails.onboardingRequired;
      await saveUserDetails(userDetails);
      if (props.navigation.state?.params?.source === screens.Profile) {
        stackReset(props.navigation, screens.Settings);
      }
      props.navigation.navigate(screens.HomeRoot);
    }
  };

  const saveUserDetails = async (userDetails) => {
    user = props.auth.user;
    const name = getDisplayName(profileInfo.firstName, profileInfo.lastName);
    const userInfo = { ...user, name };
    const localUser = {
      ...userDetails,
      firstName: profileInfo.firstName,
      lastName: profileInfo.lastName,
      name
    };
    await props.setCurrentUser(userInfo);
    await saveAuthUser(localUser);
  };

  const onSignOut = async () => {
    await props.logout();
    props.navigation.navigate(screens.Login);
  };

  return (
    <SafeAreaView style={AppStyles.root} forceInset={{ top: 'never', bottom: 'never' }}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <View style={s.profileImgMain}>
          <Image source={require('../../../assets/images/profile.png')} />
          <TextView color={colors.primary} text={'Upload Photo'} type={'body-head'} style={[s.uploadPhotoText]} />
        </View>
        <FormGroup style={[s.fromGroup]}>
          <Validation error={resError.firstname}>
            <Input
              returnKeyType={'next'}
              placeholder='First Name'
              isIconLeft={true}
              leftIconName={'create'}
              color={colors.white}
              value={profileInfo.firstName}
              editable={!loading}
              onChangeText={(text) => {
                handleFormChange('firstName', text);
              }}
            />
          </Validation>
          <Validation error={resError.lastname}>
            <Input
              style={s.inputText}
              returnKeyType={'next'}
              placeholder='Last Name'
              isIconLeft={true}
              leftIconName={'create'}
              color={colors.white}
              value={profileInfo.lastName}
              editable={!loading}
              onChangeText={(text) => {
                handleFormChange('lastName', text);
              }}
            />
          </Validation>
          <Validation error={resError.address}>
            <Input
              style={s.inputText}
              returnKeyType={'next'}
              placeholder='Enter Address'
              isIconLeft={true}
              isIconRight={true}
              leftIconName={'md-location'}
              rightIconName={'locate'}
              iconColor={colors.primary}
              color={colors.white}
              value={profileInfo.address}
              onChangeText={(text) => {
                handleFormChange('address', text);
              }}
              editable={!loading}
            />
          </Validation>
        </FormGroup>
        <View style={s.genderMain}>
          <TextView isTextColorWhite={true} text={'Gender'} type={'body-head'} style={[s.genderText]} />
          <Validation error={resError.gender}>
            <View style={s.genderWrapper}>
              {genderArray?.map((gender) => {
                return (
                  <Touchable
                    style={[s.genderbtn, profileInfo.gender === gender.value && s.genderbtnActive]}
                    onPress={() => handleFormChange('gender', gender.value)}>
                    <Icon name={gender.iconName} color={colors.lightWhite} isFeather={false} />
                    <TextView color={colors.lightWhite} text={gender.text} type={'body-one'} style={[s.genderText]} />
                  </Touchable>
                );
              })}
            </View>
          </Validation>
        </View>
        <Button ButtonText='Submit' style={s.btn} animationStyle={s.btn} onPress={onSubmit} isLoading={loading} />
        {(!props.navigation.state.hasOwnProperty('params') ||
          props.navigation.state?.params?.source === screens.VerifyEmail) && (
          <TextView
            isClickableLink={true}
            color={colors.primary}
            text={'Sign Out'}
            type={'body-one'}
            style={[s.signOut]}
            onPress={onSignOut}
          />
        )}
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};
Onboarding.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,
    headerStyle: { elevation: 0 }
  });
};
const s = StyleSheet.create({
  title: {
    marginTop: verticalScale(60)
  },
  profileImgMain: {
    marginTop: verticalScale(20),
    alignItems: 'center'
  },
  uploadPhotoText: {
    marginTop: verticalScale(15)
  },
  fromGroup: {
    marginTop: verticalScale(25)
  },
  genderWrapper: {
    marginTop: verticalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: verticalScale(13)
  },
  genderActive: {
    borderWidth: 1,
    borderRadius: scale(borderRadius),
    paddingVertical: verticalScale(13),
    paddingLeft: scale(7),
    paddingRight: scale(20),
    flexDirection: 'row',
    position: 'relative',
    borderColor: colors.primary
  },
  genderbtnActive: {
    borderColor: colors.primary
  },
  genderbtn: {
    borderWidth: 1,
    borderRadius: scale(borderRadius),
    paddingVertical: verticalScale(13),
    paddingLeft: scale(7),
    paddingRight: scale(20),
    flexDirection: 'row',
    position: 'relative',
    borderColor: colors.lightWhite
  },
  genderInActive: {
    borderWidth: 1,
    borderRadius: scale(borderRadius),
    paddingVertical: verticalScale(13),
    paddingLeft: scale(7),
    paddingRight: scale(20),
    flexDirection: 'row',
    position: 'relative',
    borderColor: colors.lightWhite
  },
  genderText: {
    letterSpacing: 0.5,
    marginLeft: scale(5)
  },
  genderMain: {},
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(80),
    marginBottom: verticalScale(15),
    borderRadius: borderRadius
  },
  signOut: {
    textAlign: 'center',
    marginVertical: verticalScale(10)
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, {
  updateUserProfile,
  clearProfileResponseMsg,
  setCurrentUser,
  getUserProfile,
  setProfile,
  logout
})(Onboarding);
