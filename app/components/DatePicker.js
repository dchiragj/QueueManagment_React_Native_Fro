import React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import ReactNativeDatePicker from 'react-native-datepicker';
import { borderWidth, lessIndent, halfindent, borderRadius } from '../styles/dimensions';
import { colors } from '../styles';
import Typography from '../styles/Typography';
import T from 'prop-types';
import Icon from './Icon';
import TextView from './TextView/TextView';
import { verticalScale, scale } from 'react-native-size-matters';

const DatePicker = ({
  containerStyle,
  style,
  selectedDate,
  placeholder,
  onDateChange,
  isBorderBottom = false,
  icon,
  customStyles,
  isLabel = true,
  format = 'DD MMM YYYY',
  label,
  ...props
}) => (
  <View style={[s.datePickerWrap, containerStyle]}>
    {isLabel ? <TextView text={label} type={'body-one'} /> : null}

    <ReactNativeDatePicker
      style={[s.datePicker, style]}
      date={selectedDate}
      mode='date'
      androidMode='spinner'
      placeholder={placeholder}
      format={format}
      confirmBtnText='Confirm'
      cancelBtnText='Cancel'
      iconComponent={
        icon ? (
          icon
        ) : (
          <Icon style={s.datePickerIcon} name='calendar' size={24} color={colors.primary} isFeather={true} />
        )
      }
      customStyles={
        customStyles
          ? customStyles
          : {
              dateInput: {
                borderWidth: 0,
                flexGrow: 1,
                flexShrink: 0,
                flexBasis: 0,
                height: scale(48),
                alignItems: 'center',
                // marginLeft: scale(10),
                paddingTop: halfindent,
                paddingBottom: lessIndent
              },
              dateText: {
                ...Typography.bodyOne,
                color: colors.white
              },
              placeholderText: {
                ...Typography.body,
                color: colors.lightWhite
              }
            }
      }
      onDateChange={onDateChange}
      {...props}
    />
  </View>
);

const s = StyleSheet.create({
  datePickerWrap: {
    marginVertical: verticalScale(10)
  },
  datePicker: {
    justifyContent: 'center',
    height: scale(50),
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius,
    width: '100%'
    // borderBottomWidth: borderWidth,
    // borderColor: colors.borderColor
  },
  datePickerIcon: {
    opacity: 0.5,
    height: scale(48),
    paddingTop: halfindent + 5,
    paddingBottom: lessIndent,
    marginRight: scale(10)
  }
});

DatePicker.propTypes = {
  style: ViewPropTypes.style,
  selectedDate: T.any,
  placeholder: T.string,
  onDateChange: T.func.isRequired,
  isBorderBottom: T.bool
};

export default DatePicker;
