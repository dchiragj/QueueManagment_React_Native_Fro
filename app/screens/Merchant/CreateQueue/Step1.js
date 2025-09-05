import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import NavigationOptions from '@app/app/components/NavigationOptions';
import { colors } from '@app/app/styles';
import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import AppStyles from '@app/app/styles/AppStyles';
import TextView from '@app/app/components/TextView/TextView';
import FormGroup from '@app/app/components/FormGroup';
import Input from '@app/app/components/Input';
import { verticalScale, scale } from 'react-native-size-matters';
import Picker from '@app/app/components/Picker';
import { QueueCategory, Desks } from '@app/app/data/raw';
import DatePicker from '../../../components/DatePicker';
import { borderRadius } from '@app/app/styles/dimensions';
import { Button } from '@app/app/components/Button';
import screens from '../../../constants/screens';
const Step1 = (props) => {
  const onPressStep2 = () => {
    props.navigation.navigate(screens.Step2);
  };
  return (
    <SafeAreaView style={AppStyles.root}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <TextView text={'Queue Details'} type={'body-one'} isTextColorWhite={true} style={[AppStyles.titleStyle]} />
        <FormGroup style={[AppStyles.formContainer, s.firstFormWrapper]}>
          <Input returnKeyType={'next'} placeholder='Enter Queue Name' isIconLeft={true} leftIconName={'create'} />
        </FormGroup>
        <FormGroup>
          <Picker
            label={null}
            isPlaceholderItem={true}
            containerStyle={s.fullborderBox}
            data={QueueCategory}
            itemKeyField={'value'}
            itemValueField={'text'}
            isLeftIcon={true}
            leftIconName={'search'}
          />
        </FormGroup>
        <View style={s.topBorder} />
        <View style={s.dateWrapper}>
          <TextView
            style={s.dateTextHeader}
            text={'Queue Time Period Start To End'}
            type={'body-one'}
            isTextColorWhite={true}
          />
          <View style={s.DatePickerWrapper}>
            <DatePicker style={s.DatePicker} containerStyle={s.containerStyle} />
            <DatePicker style={s.DatePicker} containerStyle={s.containerStyle} />
          </View>
        </View>
        <View style={s.topBorder} />
        <View style={s.tokenWrapper}>
          <View style={s.tokenOption}>
            <TextView
              style={s.tokenNumberText}
              text={'Token starts with 01 to'}
              type={'body-one'}
              color={colors.white}
            />
            <Input returnKeyType={'next'} placeholder='50' wrapperStyle={s.wrapperStyle} style={s.inputPlaceholder} />
          </View>
          <View style={s.tokenOption}>
            <TextView style={s.tokenNumberText} text={'Choose No Of Desks'} type={'body-one'} color={colors.white} />
            <Picker
              label={null}
              isPlaceholderItem={true}
              containerStyle={s.secondPickerContainerStyle}
              data={Desks}
              itemKeyField={'value'}
              itemValueField={'text'}
            />
          </View>
        </View>
        <View style={s.topBorder} />
        <TextView style={s.locationHeader} text={'Add Queue Location'} type={'body-one'} isTextColorWhite={true} />
        <Input
          returnKeyType={'next'}
          placeholder='Enter Address'
          isIconLeft={true}
          leftIconName={'location'}
          isIconRight={true}
          rightIconName={'locate'}
          style={s.addressInput}
          wrapperStyle={s.addressInputWrapperStyle}
        />
        <View style={s.topBorder} />
        <Input
          returnKeyType={'done'}
          placeholder='Queue Description'
          isIconLeft={true}
          leftIconName={'create'}
          multiline={true}
          numberOfLines={5}
          style={s.queueInput}
          iconStyle={s.iconInput}
          wrapperStyle={[s.addressInputWrapperStyle]}
        />
        <Button
          ButtonText='Next'
          style={[s.btn, AppStyles.btnStyle]}
          animationStyle={[s.btn, AppStyles.btnStyle]}
          isIconRight={true}
          rightIconName={'arrow-forward'}
          onPress={onPressStep2}
        />
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};
Step1.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,
    headerStyle: { elevation: 0 }
  });
};
const s = StyleSheet.create({
  firstFormWrapper: {
    marginTop: verticalScale(30)
  },
  topBorder: {
    borderWidth: 0.5,
    borderColor: colors.lightWhite,
    marginTop: scale(30),
    marginHorizontal: scale(15)
  },
  dateWrapper: {
    marginTop: verticalScale(30)
  },
  dateTextHeader: {
    textAlign: 'center'
  },
  DatePickerWrapper: {
    flexDirection: 'row',
    marginTop: verticalScale(15),
    justifyContent: 'space-around'
  },
  DatePicker: {
    marginRight: scale(120)
  },
  containerStyle: {
    marginLeft: scale(5)
  },
  tokenWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(20),
    justifyContent: 'center',
    borderRadius: borderRadius
  },
  tokenOption: {
    width: '45%',
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
    marginHorizontal: scale(5),
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: borderRadius
  },
  tokenNumberText: {
    marginTop: verticalScale(7),
    textAlign: 'center'
  },
  wrapperStyle: {
    marginTop: verticalScale(10),
    marginHorizontal: scale(25)
  },
  inputPlaceholder: {
    textAlign: 'center',
    color: colors.white
  },
  secondPickerContainerStyle: {
    marginTop: verticalScale(10),
    marginLeft: scale(-7)
  },
  locationHeader: {
    textAlign: 'center',
    marginTop: verticalScale(30)
  },
  addressInput: {
    color: colors.white
  },
  addressInputWrapperStyle: {
    marginVertical: verticalScale(30)
  },
  queueInput: {
    color: colors.white,
    textAlignVertical: 'top'
  },
  iconInput: {
    alignSelf: 'flex-start',
    paddingTop: 10
  },
  btn: {
    marginTop: verticalScale(50),
    marginBottom: verticalScale(40)
  }
});
export default Step1;
