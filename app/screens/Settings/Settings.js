// import { Button, Touchable } from '@app/app/components/Button';
// import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
// import TextView from '@app/app/components/TextView/TextView';
// import { colors } from '@app/app/styles';
// import AppStyles from '@app/app/styles/AppStyles';
// import React, { useEffect } from 'react';
// import { scale, verticalScale } from 'react-native-size-matters';
// import { View, SafeAreaView, StyleSheet, Image } from 'react-native';
// import { borderRadius } from '@app/app/styles/dimensions';
// import screens from '../../constants/screens';
// import NavigationOptions from '../../components/NavigationOptions';
// import HeaderButton from '../../components/HeaderButton';
// import Icon from '@app/app/components/Icon';
// import { connect } from 'react-redux';
// import { logout } from '@app/app/services/authService';

// const Settings = (props) => {
//   const { user } = props.auth;
//   useEffect(() => {
//     console.log('settings');
//     props.navigation.setParams({ openDrawer: _openDrawer });
//   }, []);

//   const onPressSignOut = async () => {
//     await props.logout();
//     props.navigation.navigate(screens.Login);
//   };

//   const onPressProfile = async () => {
//     props.navigation.navigate(screens.Profile);
//   };

//   const _openDrawer = () => {
//     props.navigation.openDrawer();
//   };

//   return (
//     <SafeAreaView style={[AppStyles.root, AppStyles.rootWithoutPadding]} forceInset={{ top: 'never', bottom: 'never' }}>
//       <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
//         <Touchable onPress={onPressProfile} style={[s.profileMain, s.same]}>
//           <View>
//             <Image source={require('../../assets/images/sProfile.png')}></Image>
//           </View>
//           <View style={s.profileTextMain}>
//             <TextView color={colors.white} text={user.name} type={'body'} style={s.profileText} />
//             <TextView color={colors.lightWhite} text={user.email} type={'body-one'} style={s.profileText} />
//           </View>
//         </Touchable>
//      <Touchable style={[s.scanMain, s.same]} onPress={() => props.navigation.navigate('QRScanner')}>
//   <Icon name='scan-circle' color={colors.lightWhite} isFeather={false} />
//   <TextView color={colors.lightWhite} text={'Scan QR For Generate Token'} type={'body'} />
//   <Icon name='chevron-forward' color={colors.lightWhite} isFeather={false} />
// </Touchable>

//         <View style={[s.rateMain, s.same]}>
//           <Touchable style={s.rate}>
//             <Icon name='star-sharp' color={colors.lightWhite} isFeather={false} style={s.rateLogo} />
//             <TextView color={colors.lightWhite} text={'Rate This App'} type={'body'} style={s.profileText} />
//           </Touchable>
//           <Touchable style={[s.rate, s.help]}>
//             <Icon name='help-circle' color={colors.lightWhite} style={s.rateLogo} />
//             <TextView color={colors.lightWhite} text={'Help'} type={'body-one'} style={s.profileText} />
//           </Touchable>
//         </View>
//         <Button onPress={onPressSignOut} ButtonText='Sign Out' style={s.btn} animationStyle={s.btn} />
//       </ScrollableAvoidKeyboard>
//     </SafeAreaView>
//   );
// };

// Settings.navigationOptions = ({ navigation }) => {
//   return NavigationOptions({
//     title: '',
//     isBack: false,
//     navigation: navigation,
//     headerLeft: (
//       <HeaderButton
//         type={1}
//         iconName={'md-menu'}
//         color={colors.primary}
//         isFeather={false}
//         iconType={'ionic'}
//         onPress={navigation.getParam('openDrawer')}
//       />
//     ),
//     headerStyle: { elevation: 0 }
//   });
// };

// const s = StyleSheet.create({
//   same: {
//     backgroundColor: colors.inputBackgroundColor,
//     marginHorizontal: scale(15),
//     marginTop: verticalScale(30),
//     paddingVertical: verticalScale(20),
//     borderRadius: borderRadius
//   },
//   profileMain: {
//     flexDirection: 'row',
//     paddingLeft: scale(15),
//     alignItems: 'center'
//   },
//   profileTextMain: {
//     marginLeft: scale(15)
//   },
//   profileText: {
//     marginTop: verticalScale(5)
//   },
//   scanMain: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around'
//   },
//   rateMain: {
//     paddingLeft: verticalScale(15)
//   },
//   rate: {
//     flexDirection: 'row'
//   },
//   rateLogo: {
//     marginRight: scale(15)
//   },
//   help: {
//     marginTop: verticalScale(15)
//   },
//   btn: {
//     backgroundColor: colors.primary,
//     marginHorizontal: scale(30),
//     marginTop: verticalScale(170),
//     borderRadius: borderRadius
//   }
// });

// const mapStateToProps = (state) => ({
//   auth: state.auth,
//   profile: state.profile
// });

// export default connect(mapStateToProps, { logout })(Settings);


import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Modal, Alert, PermissionsAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import { colors } from '@app/app/styles';
import AppStyles from '@app/app/styles/AppStyles';
import { borderRadius } from '@app/app/styles/dimensions';
import screens from '../../constants/screens';
import { connect } from 'react-redux';
import { logout } from '@app/app/services/authService';
import { checkToken, generateToken } from '@app/app/services/apiService';
import { Button, Touchable } from '@app/app/components/Button';
import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import TextView from '@app/app/components/TextView/TextView';
import Icon from '@app/app/components/Icon';
import HeaderButton from '../../components/HeaderButton';
import NavigationOptions from '@app/app/components/NavigationOptions';
import QRCodeScanner from 'react-native-qrcode-scanner';

const Settings = (props) => {
  const { user } = props.auth;

  const [isScanning, setIsScanning] = useState(false);
  const [qrDetails, setQrDetails] = useState(null);
  const [tokenDetails, setTokenDetails] = useState(null);

  useEffect(() => {
    props.navigation.setParams({ openDrawer: _openDrawer });
  }, []);

  const onPressSignOut = async () => {
    try {
      await props.logout();
      props.navigation.navigate(screens.Login);
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const onPressProfile = async () => {
    props.navigation.navigate(screens.Profile);
  };

  const _openDrawer = () => {
    props.navigation.openDrawer();
  };

  const checkCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to scan QR codes',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const onPressScan = async () => {
    const hasPermission = await checkCameraPermission();
    if (hasPermission) {
      setIsScanning(true);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
    }
  };

  const onScanSuccess = async (e) => {

    console.log("e",);
    
    try {
      let qrData;
      try {
        qrData = JSON.parse(e.data);
      } catch {
        Alert.alert('Scanned', `Scanned value: ${e.data}`);
        setIsScanning(false);
        return;
      }

      setQrDetails(qrData);
      setIsScanning(false);

      const tokenCheckResponse = await checkToken({ queueId: qrData.queueId });
      if (tokenCheckResponse.status === 'ok' && tokenCheckResponse.data) {
        setTokenDetails(tokenCheckResponse.data);
        Alert.alert(
          'Token Already Generated',
          `You already have a token: ${tokenCheckResponse.data.tokenNumber}`
        );
      } else {
        const tokenResponse = await generateToken({ queueId: qrData.queueId });
        if (tokenResponse.status === 'ok' && tokenResponse.data) {
          setTokenDetails(tokenResponse.data);
          Alert.alert(
            'Token Generated',
            `Token generated successfully: ${tokenResponse.data.tokenNumber}`
          );
        } else {
          throw new Error('Failed to generate token');
        }
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert('Error', error.message || 'Failed to process QR code or generate token');
      setIsScanning(false);
    }
  };

  return (
    <SafeAreaView
      style={[AppStyles.root, AppStyles.rootWithoutPadding]}
      forceInset={{ top: 'never', bottom: 'never' }}
    >
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <Touchable onPress={onPressProfile} style={[s.profileMain, s.same]}>
          <View>
            <Image source={require('../../assets/images/sProfile.png')} />
          </View>
          <View style={s.profileTextMain}>
            <TextView color={colors.white} text={user.name} type={'body'} style={s.profileText} />
            <TextView color={colors.lightWhite} text={user.email} type={'body-one'} style={s.profileText} />
          </View>
        </Touchable>

        <Touchable onPress={onPressScan} style={[s.scanMain, s.same]}>
          <Icon name='scan-circle' color={colors.lightWhite} isFeather={false} />
          <TextView color={colors.lightWhite} text={'Scan QR For Generate Token'} type={'body'} />
          <Icon name='chevron-forward' color={colors.lightWhite} isFeather={false} />
        </Touchable>

 {qrDetails && (
  <View style={[s.qrDetails, s.same]}>
    <TextView
      color={colors.white}
      text={`Queue Name: ${qrDetails.queueName}`}
      type={'body'}
      style={s.profileText}
    />
      <TextView
      color={colors.white}
      text={`category: ${qrDetails.category}`}
      type={'body'}
      style={s.profileText}
    />
    <TextView
      color={colors.white}
      text={`Queue ID: ${qrDetails.queueId}`}
      type={'body'}
      style={s.profileText}
    />
    <TextView
      color={colors.white}
      text={`QR Code Name: ${qrDetails.uniqueQrCodeName}`}
      type={'body'}
      style={s.profileText}
    />
    <TextView
      color={colors.white}
      text={`Token Range: ${qrDetails.tokenNumber}`}
      type={'body'}
      style={s.profileText}
    />
    {tokenDetails && (
      <TextView
        color={colors.white}
        text={`Your Token: ${tokenDetails.tokenNumber}`}
        type={'body'}
        style={s.profileText}
      />
    )}
    <View style={s.buttonContainer}>
      <Button
        onPress={async () => {
          try {
            // Check if a token already exists
            const tokenCheckResponse = await checkToken({ queueId: qrDetails.queueId ,category:qrDetails.category});
            if (tokenCheckResponse.status === 'ok' && tokenCheckResponse.data) {
              setTokenDetails(tokenCheckResponse.data);
              Alert.alert(
                'Token Already Generated',
                `You already have a token: ${tokenCheckResponse.data.tokenNumber}`
              );
              return;
            }

            // Generate a new token if none exists
            const tokenResponse = await generateToken({ queueId: qrDetails.queueId });
            if (tokenResponse.status === 'ok' && tokenResponse.data) {
              setTokenDetails(tokenResponse.data);
              Alert.alert(
                'Token Generated',
                `Token generated successfully: ${tokenResponse.data.tokenNumber}`
              );
            } else {
              throw new Error(tokenResponse.message || 'Failed to generate token');
            }
          } catch (error) {
            console.error('Error generating token:', error);
            Alert.alert('Error', error.message || 'Failed to generate token');
          }
        }}
        ButtonText="Generate Token"
        style={[s.btn, s.generateBtn]}
      />
      <Button
        onPress={() => {
          setQrDetails(null);
          setTokenDetails(null);
        }}
        ButtonText="Cancel"
        style={[s.btn, s.cancelBtn]}
      />
    </View>
  </View>
)}
        <View style={[s.rateMain, s.same]}>
          <Touchable style={s.rate}>
            <Icon name='star-sharp' color={colors.lightWhite} isFeather={false} style={s.rateLogo} />
            <TextView color={colors.lightWhite} text={'Rate This App'} type={'body'} style={s.profileText} />
          </Touchable>
          <Touchable style={[s.rate, s.help]}>
            <Icon name='help-circle' color={colors.lightWhite} style={s.rateLogo} />
            <TextView color={colors.lightWhite} text={'Help'} type={'body-one'} style={s.profileText} />
          </Touchable>
        </View>

        <Button onPress={onPressSignOut} ButtonText="Sign Out" style={s.btn} />
      </ScrollableAvoidKeyboard>

      <Modal visible={isScanning} animationType="slide" onRequestClose={() => setIsScanning(false)}>
        <SafeAreaView style={AppStyles.root}>
          <QRCodeScanner
            onRead={onScanSuccess}
            reactivate={true}
            showMarker={true}
            // flashMode={RNCamera.Constants.FlashMode.off}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

Settings.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: false,
    navigation: navigation,
    headerLeft: (
      <HeaderButton
        type={1}
        iconName={'md-menu'}
        color={colors.primary}
        isFeather={false}
        iconType={'ionic'}
        onPress={navigation.getParam('openDrawer')}
      />
    ),
    headerStyle: { elevation: 0 },
  });
};

const s = StyleSheet.create({
  same: {
    backgroundColor: colors.inputBackgroundColor,
    marginHorizontal: scale(15),
    marginTop: verticalScale(30),
    paddingVertical: verticalScale(20),
    borderRadius: borderRadius,
  },
  profileMain: {
    flexDirection: 'row',
    paddingLeft: scale(15),
    alignItems: 'center',
  },
  profileTextMain: {
    marginLeft: scale(15),
  },
  profileText: {
    marginTop: verticalScale(5),
  },
  scanMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  qrDetails: {
    paddingHorizontal: scale(15),
  },
  rateMain: {
    paddingLeft: verticalScale(15),
  },
  rate: {
    flexDirection: 'row',
  },
  rateLogo: {
    marginRight: scale(15),
  },
  help: {
    marginTop: verticalScale(15),
  },
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(20),
    borderRadius: borderRadius,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { logout })(Settings);
