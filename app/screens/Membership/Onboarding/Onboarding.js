import React, { useEffect, useState } from 'react';
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
import { View, SafeAreaView, Image, StyleSheet, Alert, PermissionsAndroid, Platform, ActionSheetIOS } from 'react-native';
import AppStyles from '@app/app/styles/AppStyles';
import { getAuthUser } from '@app/app/utils/localStorageHelpers';
import { getUserProfile, updateUserProfile } from '@app/app/services/profileService';
import { setCurrentUser } from '@app/app/actions/authActions';
import { clearProfileResponseMsg, setProfile } from './../../../actions/profileActions';
import { getDisplayName } from '@app/app/global/Helpers';
import { logout } from '@app/app/services/authService';
import { stackReset } from './../../../global/Helpers';
import { genderArray } from './../../../data/raw';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Onboarding = (props) => {
  let { profileInfo, resError = {}, loading } = props.profile;
  let { user } = props.auth;
  const [selectedImage, setSelectedImage] = useState(null);
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
    if (selectedImage) {
      profileInfo.ProfileUrl = selectedImage.uri;
    }
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
      name,
      ProfileUrl: selectedImage ? selectedImage.uri : userDetails.ProfileUrl,
    };
    await props.setCurrentUser(userInfo);
    await saveAuthUser(localUser);
  };

  const onSignOut = async () => {
    await props.logout();
    props.navigation.navigate(screens.Login);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      return true; // iOS handles via Info.plist
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs camera access to take a profile picture.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'ios') {
      return true; // iOS handles via Info.plist
    }
    try {
      const permission = Platform.Version >= 29 ? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      const granted = await PermissionsAndroid.request(permission, {
        title: 'Gallery Permission',
        message: 'This app needs access to your gallery to select a profile picture.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Gallery permission error:', err);
      return false;
    }
  };

  const handleImagePick = async () => {
    console.log('ImagePicker functions:', { launchCamera, launchImageLibrary }); // Debug
    if (!launchCamera || !launchImageLibrary) {
      console.error('ImagePicker functions are undefined. Verify library installation.');
      Alert.alert('Error', 'Image picker module not found. Please restart the app or contact support.');
      return;
    }

    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      includeBase64: false,
    };

    const pickImage = async (source) => {
      try {
        let response;
        if (source === 'camera') {
          const hasPermission = await requestCameraPermission();
          if (!hasPermission) {
            Alert.alert('Permission Denied', 'Camera access is required to take a photo.');
            return;
          }
          response = await launchCamera(options);
        } else {
          const hasPermission = await requestGalleryPermission();
          if (!hasPermission) {
            Alert.alert('Permission Denied', 'Gallery access is required to select a photo.');
            return;
          }
          response = await launchImageLibrary(options);
        }

        console.log('Image picker response:', response); // Debug

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode || response.errorMessage) {
          console.error('ImagePicker Error:', response.errorCode, response.errorMessage);
          Alert.alert('Error', `Failed to ${source === 'camera' ? 'capture' : 'select'} photo: ${response.errorMessage || 'Unknown error'}`);
        } else {
          const imageAsset = response.assets ? response.assets[0] : response; // Handle v4/v5
          console.log(imageAsset,"img");
          
          setSelectedImage(imageAsset );
          handleFormChange('ProfileUrl', imageAsset.uri);
        }
      } catch (error) {
        console.error(`Image ${source} error:`, error);
        Alert.alert('Error', `Failed to open ${source === 'camera' ? 'camera' : 'gallery'}. Please try again.`);
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImage('camera');
          } else if (buttonIndex === 2) {
            pickImage('gallery');
          }
        }
      );
    } else {
      Alert.alert(
        'Select Image Source',
        'Choose an option to set your profile picture:',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: () => pickImage('camera') },
          { text: 'Choose from Gallery', onPress: () => pickImage('gallery') },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={AppStyles.root} forceInset={{ top: 'never', bottom: 'never' }}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <Touchable onPress={handleImagePick}>
          <View style={s.profileImgMain}>
            <Image source={ selectedImage ? { uri: selectedImage.uri } : profileInfo?.ProfileUrl ? { uri: profileInfo.ProfileUrl } : require('../../../assets/images/profile.png') } style={s.ProfileUrl} />
            <TextView color={colors.primary} text={'Upload Photo'} type={'body-head'} style={[s.uploadPhotoText]} />
          </View>
        </Touchable>
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
                    key={gender.value}
                    style={[s.genderbtn, profileInfo.gender === gender.value && s.genderbtnActive]}
                    onPress={() => handleFormChange('gender', gender.value)}
                  >
                    <Icon name={gender.iconName} color={colors.lightWhite} isFeather={false} />
                    <TextView
                      color={colors.lightWhite}
                      text={gender.text}
                      type={'body-one'}
                      style={[s.genderText]}
                    />
                  </Touchable>
                );
              })}
            </View>
          </Validation>
        </View>
        <Button
          ButtonText='Submit'
          style={s.btn}
          animationStyle={s.btn}
          onPress={onSubmit}
          isLoading={loading}
        />
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
    headerStyle: { elevation: 0 },
  });
};

const s = StyleSheet.create({
  title: {
    marginTop: verticalScale(60),
  },
  profileImgMain: {
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
  ProfileUrl: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
  },
  uploadPhotoText: {
    marginTop: verticalScale(15),
  },
  fromGroup: {
    marginTop: verticalScale(25),
  },
  genderWrapper: {
    marginTop: verticalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: verticalScale(13),
  },
  genderActive: {
    borderWidth: 1,
    borderRadius: scale(borderRadius),
    paddingVertical: verticalScale(13),
    paddingLeft: scale(7),
    paddingRight: scale(20),
    flexDirection: 'row',
    position: 'relative',
    borderColor: colors.primary,
  },
  genderbtnActive: {
    borderColor: colors.primary,
  },
  genderbtn: {
    borderWidth: 1,
    borderRadius: scale(borderRadius),
    paddingVertical: verticalScale(13),
    paddingLeft: scale(7),
    paddingRight: scale(20),
    flexDirection: 'row',
    position: 'relative',
    borderColor: colors.lightWhite,
  },
  genderInActive: {
    borderWidth: 1,
    borderRadius: scale(borderRadius),
    paddingVertical: verticalScale(13),
    paddingLeft: scale(7),
    paddingRight: scale(20),
    flexDirection: 'row',
    position: 'relative',
    borderColor: colors.lightWhite,
  },
  genderText: {
    letterSpacing: 0.5,
    marginLeft: scale(5),
  },
  genderMain: {},
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(80),
    marginBottom: verticalScale(15),
    borderRadius: borderRadius,
  },
  signOut: {
    textAlign: 'center',
    marginVertical: verticalScale(10),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  updateUserProfile,
  clearProfileResponseMsg,
  setCurrentUser,
  getUserProfile,
  setProfile,
  logout,
})(Onboarding);