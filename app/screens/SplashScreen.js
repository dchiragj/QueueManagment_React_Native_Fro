import React, { useEffect } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import screens from '../constants/screens';
import { colors } from '../styles';
import AppStyles from '../styles/AppStyles';
import { setupToken } from '../utils/authTokenHelpers';
import SafeAreaView from 'react-native-safe-area-view';
import SvgIcon from 'react-native-svg-icon/lib/components/SvgIcon';
import svgs from '../assets/svg';
import { getAuthUser } from '../utils/localStorageHelpers';
import { setCurrentUser } from './../actions/authActions';
import { getDisplayName } from '../global/Helpers';


function SplashScreen(props) {
  useEffect(() => {
    console.log('Splashscreen');
    init();
  }, []);

  const init = async () => {
    try {
      if (__DEV__) {
        console.log('Development');
      }
      const token = await setupToken();
      let screen = screens.Login;
      if (token) {
        screen = screens.HomeRoot;
        const userDetails = await getAuthUser();
        const fullname = getDisplayName(userDetails.firstName, userDetails.lastName);
        const user = {
          id: userDetails.id,
          name: fullname,
          email: userDetails.email,
          role: userDetails.role
        };
        props.setCurrentUser(user);
        if (userDetails.verificationRequired) {
          screen = screens.VerifyEmail;
        } else if (userDetails.onboardingRequired) {
          screen = screens.Onboarding;
        } else {
          screen = screens.HomeRoot;
        }
      }

      setTimeout(async () => {
        if (__DEV__) props.navigation.navigate(screen);
        props.navigation.navigate(screen);
      }, 1000);
    } catch (e) {
      props.navigation.navigate(screens.Welcome);
    }
  };

  return (
    <>
      <SafeAreaView
        style={[AppStyles.root, AppStyles.rootWithoutPadding, s.logo]}
        forceInset={{ top: 'never', bottom: 'never' }}>
        <StatusBar translucent backgroundColor={colors.transparent} barStyle='light-content' />
        <SvgIcon svgs={svgs} name={'splash-logo'} fill={colors.primary} width={250} height={72} />
      </SafeAreaView>
    </>
  );
}

const s = StyleSheet.create({
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { setCurrentUser })(SplashScreen);
