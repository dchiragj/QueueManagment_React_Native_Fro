import Profile from '../../screens/Settings/Profile/Profile';
import SettingsScreen from '../../screens/Settings/Settings';
import { createStackNavigator } from 'react-navigation-stack';
import screens from '../../constants/screens';
import OnboardingScreen from '@app/app/screens/Membership/Onboarding/Onboarding';

const SettingsNavigator = createStackNavigator(
  {
    [screens.Settings]: {
      screen: SettingsScreen,
      navigationOptions: () => ({
        headerTitle: 'Settings'
      })
    },
    [screens.Profile]: {
      screen: Profile,
      navigationOptions: () => ({
        headerTitle: 'Profile'
      })
    },
    [screens.Onboarding]: {
      screen: OnboardingScreen,
      navigationOptions: () => ({
        headerTitle: 'Edit Profile'
      })
    }
  },
  {
    initialRouteName: screens.Settings,
    headerMode: 'screen',
    headerLayoutPreset: 'center'
  }
);

export default SettingsNavigator;
