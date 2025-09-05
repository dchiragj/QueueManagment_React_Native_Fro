import React from 'react';
import {
  HomeNavigator,
  MyTokenNavigator,
  CompletedTokenNavigator,
  SettingsNavigator,
  MyQueueNavigator
} from '../navigators';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import screens from '@app/app/constants/screens';

const RootRoutes = {
  [screens.HomeRoot]: {
    screen: HomeNavigator,
    navigationOptions: () => ({
      drawerLabel: 'Home',
      drawerIcon: ({ tintColor }) => <MaterialIcons name='home' size={24} color={tintColor} />
    })
  },
  [screens.MyTokenRoot]: {
    screen: MyTokenNavigator,
    navigationOptions: () => ({
      drawerLabel: 'My Tokens',
      drawerIcon: ({ tintColor }) => <MaterialIcons name='shopping-bag' size={24} color={tintColor} />
    })
  },
  [screens.CompletedTokenRoot]: {
    screen: CompletedTokenNavigator,
    navigationOptions: () => ({
      drawerLabel: 'Completed Tokens',
      drawerIcon: ({ tintColor }) => <MaterialIcons name='shopping-bag' size={24} color={tintColor} />
    })
  },
  [screens.SettingsRoot]: {
    screen: SettingsNavigator,
    navigationOptions: () => ({
      drawerLabel: 'Settings',
      drawerIcon: ({ tintColor }) => <MaterialIcons name='settings' size={24} color={tintColor} />
    })
  },
  [screens.MyQueueRoot]: {
    screen: MyQueueNavigator,
    navigationOptions: () => ({
      drawerLabel: 'My Queue',
      drawerIcon: ({ tintColor }) => <MaterialIcons name='shopping-bag' size={24} color={tintColor} />
    })
  }
};

export default RootRoutes;
