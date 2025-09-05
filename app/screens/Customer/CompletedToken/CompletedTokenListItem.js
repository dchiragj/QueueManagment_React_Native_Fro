import Card from '@app/app/components/Card';
import TextView from '@app/app/components/TextView/TextView';
import { colors } from '@app/app/styles';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';

const CompletedTokenListItem = (props) => {
  return (
    <Card style={s.wrapper} onPress={props.onPress}>
      <View style={s.mainWrapper}>
        <View style={s.numberTextWrapper}>
          <TextView color={colors.primary} text={'11'} type={'sub-title'} style={s.numberText} />
        </View>
        <View style={s.textWrapper}>
          <TextView color={colors.white} text={'Kiran Hospital'} type={'body-one '} />
          <TextView color={colors.lightWhite} text={'Dr. Chintan B. Patel'} type={'body-one '} />
          <TextView color={colors.lightWhite} text={'02 oct - 12:30 PM '} type={'body-one '} />
        </View>
        <View style={s.tokenStatusWrapper}>
          <View style={s.tokenStatusTriangle}></View>
          <View style={s.tokenStatusRectangle}></View>
          <TextView color={colors.white} text={'Completed'} type={'body-One'} style={s.tokenStatusText} />
        </View>
      </View>
    </Card>
  );
};
const s = StyleSheet.create({
  wrapper: {
    paddingVertical: verticalScale(20),
    marginBottom: verticalScale(10)
  },
  mainWrapper: {
    flexDirection: 'row'
  },
  numberTextWrapper: {
    flex: 0.3
  },
  numberText: {
    borderWidth: 1,
    borderColor: colors.primary,
    marginLeft: scale(20),
    borderRadius: 5,
    padding: moderateScale(10),
    textAlign: 'center'
  },
  textWrapper: {
    marginLeft: scale(15),
    flex: 0.4
  },
  tokenStatusWrapper: {
    flex: 0.4,
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  tokenStatusTriangle: {
    borderLeftWidth: 15.5,
    borderRightWidth: 15.5,
    borderBottomWidth: 18,
    marginTop: verticalScale(6),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primary,
    transform: [{ rotate: '270deg' }]
  },
  tokenStatusRectangle: {
    width: scale(60),
    backgroundColor: colors.primary,
    marginLeft: -7,
    height: verticalScale(30)
  },
  tokenStatusText: {
    position: 'absolute',
    marginTop: verticalScale(5)
  }
});
export default CompletedTokenListItem;
