import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Touchable } from '@app/app/components/Button';
import { connect } from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';
import TextView from '../../components/TextView/TextView';
import AppStyles from '../../styles/AppStyles';
import NavigationOptions from '../../components/NavigationOptions';
import HeaderButton from '../../components/HeaderButton';
import { colors } from '../../styles';
import screens from '../../constants/screens';
import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import Input from '@app/app/components/Input';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import { borderRadius } from '@app/app/styles/dimensions';

function Home(props) {
  useEffect(() => {
    console.log('Home');
    props.navigation.setParams({ openDrawer: _openDrawer });
  }, []);

  const _openDrawer = () => {
    props.navigation.openDrawer();
  };

  const onPressHome = () => {
    props.navigation.navigate(screens.Categories);
  };

  return (
    <>
      <SafeAreaView style={[AppStyles.root]}>
        <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
          <Input placeholder='Search Shop Here' isIconLeft={true} leftIconName={'search'} color={colors.white} />
          <Image style={s.mainImg} source={require('../../assets/images/home.png')} />
          <TextView text={'Categories'} type={'button-text'} color={colors.lightWhite} style={s.Text} />
          <View style={s.Categories}>
            <Touchable style={s.CategoriesOption}>
              <TextView text={'Hospitals'} type={'body-one'} color={colors.lightWhite} />
            </Touchable>
            <Touchable style={s.CategoriesOption}>
              <TextView text={'Beverages'} type={'body-one'} color={colors.lightWhite} />
            </Touchable>
            <Touchable style={s.CategoriesOption}>
              <TextView text={'Banquets'} type={'body-one'} color={colors.lightWhite} />
            </Touchable>
            <Touchable style={s.CategoriesOption} onPress={onPressHome}>
              <TextView text={'View More'} type={'body-one'} color={colors.lightWhite} />
            </Touchable>
          </View>
        </ScrollableAvoidKeyboard>
      </SafeAreaView>
    </>
  );
}
const s = StyleSheet.create({
  mainImg: {
    marginTop: verticalScale(15),
    alignSelf: 'center'
  },
  Text: {
    marginTop: verticalScale(20),
    marginLeft: 12
  },
  Categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  CategoriesOption: {
    width: '45%',
    padding: moderateScale(20),
    marginTop: verticalScale(10),
    marginHorizontal: scale(5),
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius
  }
});
Home.navigationOptions = ({ navigation }) => {
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
    headerRight: (
      <HeaderButton
        type={1}
        iconName={'ios-scan-circle-sharp'}
        iconType={'ionic'}
        color={colors.primary}
        isFeather={false}
        onPress={() => {}}
      />
    ),
    headerStyle: { elevation: 0 }
  });
};
const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, {})(Home);
