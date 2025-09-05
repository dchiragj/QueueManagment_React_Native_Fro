import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import NavigationOptions from '@app/app/components/NavigationOptions';
import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import AppStyles from '@app/app/styles/AppStyles';
import TextView from '@app/app/components/TextView/TextView';
import Input from '@app/app/components/Input';
import { colors } from '@app/app/styles';
import Icon from '@app/app/components/Icon';
import { borderRadius } from '@app/app/styles/dimensions';
import { verticalScale, scale } from 'react-native-size-matters';
import { Button, Touchable } from '@app/app/components/Button';
import screens from '../../../constants/screens';

const Step3 = (props) => {
  const onPressStep4 = () => {
    props.navigation.navigate(screens.Step4);
  };
  return (
    <SafeAreaView style={AppStyles.root}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <TextView
          text={'Make a problem list'}
          type={'body-one'}
          isTextColorWhite={true}
          style={[AppStyles.titleStyle]}
        />
        <View style={s.inputWrapper}>
          <Input
            wrapperStyle={s.inputWrapperStyle}
            style={s.inputText}
            returnKeyType={'next'}
            placeholder='Write Problems'
            isIconLeft={true}
            leftIconName={'create'}
          />
          <Touchable style={s.iconTouchable}>
            <Icon name='add' color={colors.primary} isFeather={false} style={s.inputIcon} />
          </Touchable>
        </View>
        <View style={s.topBorder} />
        <View style={s.inputBtnWrapper}>
          <View>
            <Input
              style={s.inputText}
              returnKeyType={'next'}
              placeholder='Problem 1'
              isIconLeft={true}
              leftIconName={'create'}
            />
          </View>
          <Button
            onPress={onPressStep4}
            ButtonText='Next'
            style={[s.btn, AppStyles.btnStyle]}
            animationStyle={[s.btn, AppStyles.btnStyle]}
            isIconRight={true}
            rightIconName={'arrow-forward'}
          />
        </View>
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};
Step3.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,
    headerStyle: { elevation: 0 }
  });
};
const s = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row'
  },
  inputWrapperStyle: {
    flex: 0.9
  },
  inputText: {
    color: colors.white
  },
  iconTouchable: {
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius,
    flex: 0.1,
    marginLeft: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(18),
    marginVertical: verticalScale(8)
  },
  inputIcon: {
    alignItems: 'center',
    alignSelf: 'center'
  },
  topBorder: {
    borderWidth: 0.5,
    borderColor: colors.lightWhite,
    marginVertical: scale(30),
    marginHorizontal: scale(15)
  },
  inputBtnWrapper: {
    flex: 1,
    justifyContent: 'space-between'
  },
  btn: {
    marginTop: verticalScale(50),
    marginBottom: verticalScale(40)
  }
});
export default Step3;
