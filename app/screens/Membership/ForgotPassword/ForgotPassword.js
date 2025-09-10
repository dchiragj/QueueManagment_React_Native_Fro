import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { colors } from '@app/app/styles';
import { borderRadius, indent, halfindent } from '@app/app/styles/dimensions';
import TextView from '@app/app/components/TextView/TextView';
import Input from '@app/app/components/Input';
import Button from '@app/app/components/Button/Button';
import Validation from '@app/app/components/Validation/Validation';
import ScrollableAvoidKeyboard from '@app/app/components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { forgotPassword, verifyOtp, resetPassword } from '@app/app/services/apiService';

const ForgotPassword = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (step === 1) {
      setEmail('');
      setOtp('');
      setPassword('');
      setConfirmPassword('');
      setUserId('');
    }
  }, [step]);

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(email);
      if (data?.status === 'ok') {
        Alert.alert('Success', 'OTP sent to your email');
        setStep(2);
      } else {
        Alert.alert('Error', data?.message || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp(email, otp);
      if (data?.status === 'ok') {
        Alert.alert('Success', 'OTP verified successfully');
        setUserId(data.userId);
        setStep(3);
      } else {
        Alert.alert('Error', data?.message || 'Invalid OTP');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter both password fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(email, password, otp);
      if (data?.status === 'ok') {
        Alert.alert('Success', 'Password updated successfully');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data?.message || 'Failed to reset password');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollableAvoidKeyboard style={styles.container}>
      <TextView text="Forgot Password" type="title" style={styles.title} color={colors.white} />
      <ScrollView>
        {step === 1 && (
          <Validation>
            <Input
              style={styles.input}
              keyboardType="email-address"
              placeholder="Enter your email"
              leftIconName="mail"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <Button
              onPress={handleSendOtp}
              ButtonText={loading ? 'Please wait...' : 'Send OTP'}
              style={styles.btn}
              isLoading={loading}
            />
          </Validation>
        )}
        {step === 2 && (
          <Validation>
            <Input
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              editable={!loading}
            />
            <Button
              onPress={handleVerifyOtp}
              ButtonText={loading ? 'Please wait...' : 'Verify OTP'}
              style={styles.btn}
              isLoading={loading}
            />
            <Button
              onPress={() => setStep(1)}
              ButtonText="Back"
              style={[styles.btn, { backgroundColor: colors.gray }]}
              disabled={loading}
            />
          </Validation>
        )}
        {step === 3 && (
          <Validation>
            <Input
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <Input
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
            <Button
              onPress={handleResetPassword}
              ButtonText={loading ? 'Please wait...' : 'Reset Password'}
              style={styles.btn}
              isLoading={loading}
            />
            <Button
              onPress={() => setStep(2)}
              ButtonText="Back"
              style={[styles.btn, { backgroundColor: colors.gray }]}
              disabled={loading}
            />
          </Validation>
        )}
      </ScrollView>
    </ScrollableAvoidKeyboard>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: scale(20), backgroundColor: colors.backgroundColor },
  title: { textAlign: 'center', paddingTop: 20, marginBottom: verticalScale(20) },
  input: { marginLeft: scale(halfindent), color: colors.white, marginBottom: verticalScale(10) },
  btn: { backgroundColor: colors.primary, marginHorizontal: scale(30), marginTop: verticalScale(indent), borderRadius: borderRadius },
});

export default ForgotPassword;