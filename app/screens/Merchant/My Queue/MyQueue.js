import HeaderButton from '@app/app/components/HeaderButton';
import { colors } from '@app/app/styles';
import AppStyles from '@app/app/styles/AppStyles';
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import NavigationOptions from '../../../components/NavigationOptions';
import MyQueueListItem from './MyQueueListItem';
import screens from '../../../constants/screens';
const MyQueue = () => {
  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MyQueueListItem />
        <MyQueueListItem />
        <MyQueueListItem />
        <MyQueueListItem />
      </ScrollView>
    </SafeAreaView>
  );
};
MyQueue.navigationOptions = ({ navigation }) => {
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
        onPress={() => navigation.openDrawer()}
      />
    ),
    headerRight: (
      <HeaderButton
        type={1}
        iconName={'add-circle'}
        color={colors.primary}
        isFeather={false}
        iconType={'ionic'}
        onPress={() => navigation.navigate(screens.Step1)}
      />
    ),
    headerStyle: { elevation: 0 }
  });
};
export default MyQueue;
