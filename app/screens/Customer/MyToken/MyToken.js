import HeaderButton from '@app/app/components/HeaderButton';
import { colors } from '@app/app/styles';
import AppStyles from '@app/app/styles/AppStyles';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import NavigationOptions from '../../../components/NavigationOptions';
import screens from '@app/app/constants/screens';
import CompletedTokenListItem from '../CompletedToken/CompletedTokenListItem';

const MyToken = (props) => {
  const onPressMyTokenDetails = () => {
    props.navigation.navigate(screens.MyTokenDetails);
  };
  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CompletedTokenListItem onPress={onPressMyTokenDetails} />
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
MyToken.navigationOptions = ({ navigation }) => {
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
const s = StyleSheet.create({});
export default MyToken;
