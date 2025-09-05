import MyQueueScreen from '../../screens/Merchant/My Queue/MyQueue';
import Step1Screen from '../../screens/Merchant/CreateQueue/Step1';
import Step2Screen from '../../screens/Merchant/CreateQueue/Step2';
import step3Screen from '../../screens/Merchant/CreateQueue/Step3';
import Step4Screen from '../../screens/Merchant/CreateQueue/Step4';
import { createStackNavigator } from 'react-navigation-stack';
import screens from '../../constants/screens';

const MyQueueNavigator = createStackNavigator(
  {
    [screens.MyQueue]: {
      screen: MyQueueScreen,
      navigationOptions: () => ({
        headerTitle: 'My Queue'
      })
    },
    [screens.Step1]: {
      screen: Step1Screen,
      navigationOptions: () => ({
        headerTitle: 'Create Queue'
      })
    },
    [screens.Step2]: {
      screen: Step2Screen,
      navigationOptions: () => ({
        headerTitle: 'Create Queue'
      })
    },
    [screens.Step3]: {
      screen: step3Screen,
      navigationOptions: () => ({
        headerTitle: 'Create Queue'
      })
    },
    [screens.Step4]: {
      screen: Step4Screen,
      navigationOptions: () => ({
        headerTitle: 'Create Queue'
      })
    }
  },
  {
    initialRouteName: screens.MyQueue,
    headerMode: 'screen',
    headerLayoutPreset: 'center'
  }
);
export default MyQueueNavigator;
