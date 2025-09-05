import React from 'react';
import ReactCheckbox from 'react-native-check-box';
import { ViewPropTypes } from 'react-native';
import T from 'prop-types';
import { colors } from '../styles';
import Icon from './Icon';

const CheckBox = ({ onClick, isChecked, leftView, leftText, style, rightText, ...props }) => (
  <ReactCheckbox
    onClick={onClick}
    isChecked={isChecked}
    leftTextView={leftView ? leftView : undefined}
    leftText={leftText}
    rightText={rightText}
    style={style}
    checkedImage={<Icon name='checkbox-outline' color={colors.primary} isFeather={false} />}
    unCheckedImage={<Icon name='square-outline' color={colors.primary} isFeather={false} />}
    {...props}
  />
);

CheckBox.propTypes = {
  onClick: T.func.isRequired,
  isChecked: T.bool.isRequired,
  leftView: T.element,
  leftText: T.string,
  style: ViewPropTypes.style,
  rightText: T.string
};
export default CheckBox;
