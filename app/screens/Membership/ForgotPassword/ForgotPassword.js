import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { colors } from '@app/app/styles';
import { borderRadius, indent, halfindent } from '@app/app/styles/dimensions';
import TextView from '../../../components/TextView/TextView';
import Input from '../../../components/Input';
import Button from '../../../components/Button/Button';
import Validation from '../../../components/Validation/Validation';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import axios from 'axios';
import { forgotPassword } from '@app/app/services/apiService';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(email);  // ✅ call service function
      if (data?.status === 'ok') {
        Alert.alert('Success', 'Password reset link sent to your email');
        navigation.goBack();
      } else {
        Alert.alert('Error', data?.message || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollableAvoidKeyboard style={s.container}>
      <TextView
        text={'Forgot Password'}
        type={'title'}
        style={s.title}
        color={colors.white}
      />

      <Validation>
        <Input
          style={s.input}
          keyboardType="email-address"
          placeholder="Enter your email"
          leftIconName="mail"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
      </Validation>

      <Button
        onPress={handleForgotPassword}
        ButtonText={loading ? "Please wait..." : "Send Reset Link"}
        style={s.btn}
        isLoading={loading}
      />
    </ScrollableAvoidKeyboard>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    backgroundColor: colors.backgroundColor,
  },
  title: {
    textAlign: 'center',
    paddingTop:20,
    marginBottom: verticalScale(20)
  },
  input: {
    marginLeft: scale(halfindent),
    color: colors.white
  },
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(indent),
    borderRadius: borderRadius
  }
});

export default ForgotPassword;
