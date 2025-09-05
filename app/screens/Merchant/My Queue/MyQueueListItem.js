import { Touchable } from '@app/app/components/Button';
import Card from '@app/app/components/Card';
import Icon from '@app/app/components/Icon';
import TextView from '@app/app/components/TextView/TextView';
import { colors } from '@app/app/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import SvgIcon from 'react-native-svg-icon/lib/components/SvgIcon';
import svgs from '../../../assets/svg';

const MyQueueListItem = () => {
  return (
    <Card style={s.wrapper}>
      <Touchable style={[s.mainWrapper, s.touchableWrapper]}>
        <View style={s.mainImg}>
          <SvgIcon svgs={svgs} name={'card-logo'} fill={colors.primary} width={50} height={50} />
        </View>
        <View style={s.textWrapper}>
          <TextView color={colors.white} text={'Kiran Hospital'} type={'body-one '} />
          <TextView color={colors.lightWhite} text={'Dr. Chintan B. Patel'} type={'body-one '} />
          <TextView color={colors.lightWhite} text={'02 oct - 12:30 PM '} type={'body-one '} />
        </View>
        <View style={s.lastWrapper}>
          <View style={s.mainWrapper}>
            <Icon name='desktop' color={colors.primary} isFeather={false} />
            <TextView style={s.LastText} color={colors.white} text={'03'} type={'body-one'} />
          </View>
          <View style={[s.mainWrapper, s.secondTextWrapper]}>
            <Icon name='people-circle' color={colors.primary} isFeather={false} />
            <TextView style={s.LastText} color={colors.white} text={'150'} type={'body-one'} />
          </View>
        </View>
      </Touchable>
      <View style={s.topBorder} />
      <View style={s.linkTextWrapper}>
        <TextView color={colors.primary} text={'Queue Detail'} type={'body-one'} style={s.TextLink} />
        <TextView color={colors.primary} text={'Sign In-Desk'} type={'body-one'} style={s.TextLink} />
      </View>
    </Card>
  );
};
const s = StyleSheet.create({
  wrapper: {
    marginBottom: verticalScale(10),
    flex: 1
  },
  mainWrapper: {
    flexDirection: 'row'
  },
  touchableWrapper: {
    paddingVertical: verticalScale(20)
  },
  mainImg: {
    marginLeft: scale(10),
    flex: 0.2
  },
  textWrapper: {
    flex: 0.6
  },
  lastWrapper: {
    flex: 0.2
  },
  LastText: {
    marginLeft: scale(5)
  },
  secondTextWrapper: {
    marginTop: verticalScale(10)
  },
  topBorder: {
    borderWidth: 0.5,
    borderColor: colors.lightWhite,
    marginHorizontal: scale(15)
  },
  linkTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  TextLink: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(5)
  }
});
export default MyQueueListItem;
