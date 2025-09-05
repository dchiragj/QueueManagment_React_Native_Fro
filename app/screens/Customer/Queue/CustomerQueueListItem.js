import Card from '@app/app/components/Card';
import TextView from '@app/app/components/TextView/TextView';
import { colors } from '@app/app/styles';
import SvgIcon from 'react-native-svg-icon/lib/components/SvgIcon';
import svgs from '../../../assets/svg';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '@app/app/components/Icon';
import screens from '@app/app/constants/screens';
import { scale, verticalScale } from 'react-native-size-matters';

const CustomerQueueListItem = (props) => {
  return (
    <Card style={s.wrapper} onPress={props.onPress}>
      <View style={s.mainWrapper}>
        <View>
          <SvgIcon svgs={svgs} name={'card-logo'} fill={colors.primary} width={50} height={50} />
        </View>
        <View>
          <TextView color={colors.white} text={'Kiran Hospital'} type={'body-one '} />
          <TextView color={colors.lightWhite} text={'Dr. Chintan B. Patel'} type={'body-one '} />
          <TextView color={colors.lightWhite} text={'General Surgery'} type={'body-one '} />
        </View>
        <View>
          <SvgIcon svgs={svgs} name={'bag-qeuelist'} fill={colors.primary} width={24} height={26} />
          <TextView color={colors.white} text={'Join'} type={'body-one'} />
        </View>
      </View>
      <View style={[s.mainWrapper, s.second]}>
        <View style={s.secondWrapper}>
          <Icon name='location' color={colors.primary} isFeather={false} />
          <TextView style={s.text} color={colors.white} text={'Surat'} type={'body-one'} />
        </View>
        <View style={s.secondWrapper}>
          <Icon name='calendar' color={colors.primary} isFeather={false} />
          <TextView style={s.text} color={colors.white} text={'02 oct - 05 oct '} type={'body-one'} />
        </View>
        <View style={s.secondWrapper}>
          <Icon name='people-circle' color={colors.primary} isFeather={false} />
          <TextView style={s.text} color={colors.white} text={'51/150'} type={'body-one '} />
        </View>
      </View>
    </Card>
  );
};
const s = StyleSheet.create({
  wrapper: {
    paddingVertical: verticalScale(13),
    marginBottom: verticalScale(10)
  },
  mainWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  secondWrapper: {
    flexDirection: 'row'
  },
  text: {
    marginLeft: scale(5),
    textAlignVertical: 'center'
  },
  second: {
    marginTop: verticalScale(15)
  }
});

export default CustomerQueueListItem;
