import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView, Text } from 'react-native';
import { connect } from 'react-redux';
import { DrawerItems } from 'react-navigation-drawer';
import screens from '../constants/screens';
import { logout } from '../services/authService';
import { colors } from '../styles';
import { indent } from '../styles/dimensions';
import { Touchable } from './Button';
import TextView from './TextView/TextView';
import SvgIcon from 'react-native-svg-icon/lib/components/SvgIcon';
import svgs from '../assets/svg';
import AppStyles from '../styles/AppStyles';
import Icon from './Icon';
import { verticalScale, scale } from 'react-native-size-matters';

function DrawerDesignComponent(props) {
  useEffect(() => {
    console.log('drawer menu');
  }, []);
  const onClose = () => {
    props.navigation.closeDrawer();
  };

  const Logout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure want to logout?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            console.log('logout');
            await props.logout();
            props.navigation.navigate(screens.Login);
          },
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <SafeAreaView style={[AppStyles.root]}>
        <SvgIcon style={s.logo} svgs={svgs} name={'splash-logo'} fill={colors.primary} width={230} height={70} />
        <View style={s.bordertop} />
        <ScrollView contentContainerStyle={s.container}>
          <View>
            <DrawerItems
              itemStyle={{ borderRadius: 15 }}
              activeBackgroundColor={colors.inputBackgroundColor}
              {...props}
            />
          </View>
          <View style={s.borderBottom} />
          <Touchable style={s.signOutMain}>
            <Icon name='log-out' color={colors.lightWhite} />
            <TextView style={s.logoutLink} text={'Sign Out'} type={'body'} color={colors.lightWhite} onPress={Logout} />
          </Touchable>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const s = StyleSheet.create({
  closeModal: {
    flex: 1,
    backgroundColor: 'red'
  },
  logo: {
    marginVertical: 50,
    alignSelf: 'center'
  },
  bordertop: {
    borderColor: colors.primary,
    borderWidth: 0.5,
    width: '100%'
  },
  borderBottom: {
    borderColor: colors.primary,
    borderWidth: 0.5,
    marginVertical: verticalScale(50),
    width: '100%'
  },
  container: {
    marginTop: verticalScale(50)
  },
  signOutMain: {
    flexDirection: 'row',
    paddingHorizontal: scale(indent),
    paddingVertical: verticalScale(indent)
  },
  logoutLink: {
    paddingLeft: scale(indent + 8)
  }
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  logout
})(DrawerDesignComponent);
