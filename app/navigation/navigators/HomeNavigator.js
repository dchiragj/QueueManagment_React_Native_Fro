import { createStackNavigator } from 'react-navigation-stack';
import screens from '../../constants/screens';
import HomeScreen from '../../screens/Home/Home';
import CategoriesScreen from '../../screens/Home/Categories';
import CustomerQueueListScreen from '../../screens/Customer/Queue/CustomerQueueList';
import GenerateTokenScreen from '../../screens/Customer/GenerateToken/GenerateToken';
import CustomerQueueDetailsScreen from '../../screens/Customer/Queue/CustomerQueueDetails';

const HomeNavigator = createStackNavigator(
  {
    [screens.Home]: {
      screen: HomeScreen,
      navigationOptions: () => ({
        headerTitle: 'Home'
      })
    },
    [screens.Categories]: {
      screen: CategoriesScreen,
      navigationOptions: () => ({
        headerTitle: 'Categories'
      })
    },
    [screens.CustomerQueueList]: {
      screen: CustomerQueueListScreen,
      navigationOptions: () => ({
        headerTitle: 'Queue List'
      })
    },
    [screens.CustomerQueueDetails]: {
      screen: CustomerQueueDetailsScreen,
      navigationOptions: () => ({
        headerTitle: 'Queue Details'
      })
    },
    [screens.GenerateToken]: {
      screen: GenerateTokenScreen,
      navigationOptions: () => ({
        headerTitle: 'Generate Token'
      })
    }
  },
  {
    initialRouteName: screens.Home,
    headerMode: 'screen',
    headerLayoutPreset: 'center'
  }
);

export default HomeNavigator;
