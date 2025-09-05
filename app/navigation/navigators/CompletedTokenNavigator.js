import CompletedTokenScreen from '../../screens/Customer/CompletedToken/CompletedToken';
import { createStackNavigator } from 'react-navigation-stack';
import screens from '../../constants/screens';

const CompletedTokenNavigator = createStackNavigator(
  {
    [screens.CompletedToken]: {
      screen: CompletedTokenScreen,
      navigationOptions: () => ({
        headerTitle: 'Completed Tokens'
      })
    }
  },
  {
    initialRouteName: screens.CompletedToken,
    headerMode: 'screen',
    headerLayoutPreset: 'center'
  }
);
export default CompletedTokenNavigator;
