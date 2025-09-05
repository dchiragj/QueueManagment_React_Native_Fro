import { Button, Touchable } from '@app/app/components/Button';
import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import TextView from '@app/app/components/TextView/TextView';
import { colors } from '@app/app/styles';
import AppStyles from '@app/app/styles/AppStyles';
import React, { useEffect } from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { View, SafeAreaView, StyleSheet, Image } from 'react-native';
import { borderRadius } from '@app/app/styles/dimensions';
import screens from '../../constants/screens';
import NavigationOptions from '../../components/NavigationOptions';
import HeaderButton from '../../components/HeaderButton';
import Icon from '@app/app/components/Icon';
import { connect } from 'react-redux';
import { logout } from '@app/app/services/authService';

const Settings = (props) => {
  const { user } = props.auth;
  useEffect(() => {
    console.log('settings');
    props.navigation.setParams({ openDrawer: _openDrawer });
  }, []);

  const onPressSignOut = async () => {
    await props.logout();
    props.navigation.navigate(screens.Login);
  };

  const onPressProfile = async () => {
    props.navigation.navigate(screens.Profile);
  };

  const _openDrawer = () => {
    props.navigation.openDrawer();
  };

  return (
    <SafeAreaView style={[AppStyles.root, AppStyles.rootWithoutPadding]} forceInset={{ top: 'never', bottom: 'never' }}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <Touchable onPress={onPressProfile} style={[s.profileMain, s.same]}>
          <View>
            <Image source={require('../../assets/images/sProfile.png')}></Image>
          </View>
          <View style={s.profileTextMain}>
            <TextView color={colors.white} text={user.name} type={'body'} style={s.profileText} />
            <TextView color={colors.lightWhite} text={user.email} type={'body-one'} style={s.profileText} />
          </View>
        </Touchable>
        <Touchable style={[s.scanMain, s.same]}>
          <Icon name='scan-circle' color={colors.lightWhite} isFeather={false} />
          <TextView color={colors.lightWhite} text={'Scan QR For Generate Token'} type={'body'} />
          <Icon name='chevron-forward' color={colors.lightWhite} isFeather={false} />
        </Touchable>
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
        <Button onPress={onPressSignOut} ButtonText='Sign Out' style={s.btn} animationStyle={s.btn} />
      </ScrollableAvoidKeyboard>
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
    headerStyle: { elevation: 0 }
  });
};

const s = StyleSheet.create({
  same: {
    backgroundColor: colors.inputBackgroundColor,
    marginHorizontal: scale(15),
    marginTop: verticalScale(30),
    paddingVertical: verticalScale(20),
    borderRadius: borderRadius
  },
  profileMain: {
    flexDirection: 'row',
    paddingLeft: scale(15),
    alignItems: 'center'
  },
  profileTextMain: {
    marginLeft: scale(15)
  },
  profileText: {
    marginTop: verticalScale(5)
  },
  scanMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  rateMain: {
    paddingLeft: verticalScale(15)
  },
  rate: {
    flexDirection: 'row'
  },
  rateLogo: {
    marginRight: scale(15)
  },
  help: {
    marginTop: verticalScale(15)
  },
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(170),
    borderRadius: borderRadius
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { logout })(Settings);
