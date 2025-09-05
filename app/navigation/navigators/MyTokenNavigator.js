import MyTokenScreen from '../../screens/Customer/MyToken/MyToken';
import MyTokenDetailsScreen from '../../screens/Customer/MyToken/MyTokenDetails';
import { createStackNavigator } from 'react-navigation-stack';
import screens from '../../constants/screens';

const MyTokenNavigator = createStackNavigator(
  {
    [screens.MyToken]: {
      screen: MyTokenScreen,
      navigationOptions: () => ({
        headerTitle: 'My Tokens'
      })
    },
    [screens.MyTokenDetails]: {
      screen: MyTokenDetailsScreen,
      navigationOptions: () => ({
        headerTitle: 'My Token Details'
      })
    }
  },
  {
    initialRouteName: screens.MyToken,
    headerMode: 'screen',
    headerLayoutPreset: 'center'
  }
);
export default MyTokenNavigator;
