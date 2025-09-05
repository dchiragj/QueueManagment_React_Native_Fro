import HeaderButton from '@app/app/components/HeaderButton';
import { colors } from '@app/app/styles';
import AppStyles from '@app/app/styles/AppStyles';
import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import NavigationOptions from '../../../components/NavigationOptions';
import CompletedTokenListItem from './CompletedTokenListItem';
import screens from '@app/app/constants/screens';
const CompletedToken = (props) => {
  const onPressCompletedTokensList = () => {
    props.navigation.navigate(screens.MyTokenDetails);
  };
  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CompletedTokenListItem onPress={onPressCompletedTokensList} />
        <CompletedTokenListItem />
        <CompletedTokenListItem />
        <CompletedTokenListItem />
        <CompletedTokenListItem />
        <CompletedTokenListItem />
        <CompletedTokenListItem />
      </ScrollView>
    </SafeAreaView>
  );
};
CompletedToken.navigationOptions = ({ navigation }) => {
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
    headerStyle: { elevation: 0 }
  });
};
export default CompletedToken;
