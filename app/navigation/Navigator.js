import screens from '../constants/screens';
import { AuthenticationNavigator, HowItWorksNavigator } from './navigators';
import { urlPrefix } from '../constants/constant';
import SplashScreen from '../screens/SplashScreen';
import { createSwitchNavigator } from 'react-navigation';
import DrawerNavigator from './NavigatorDrawer';

const routes = {
  [screens.Splash]: {
    screen: SplashScreen
  },
  auth: AuthenticationNavigator,
  [screens.DrawerRoot]: {
    screen: DrawerNavigator,
    headerMode: 'screen',
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }
};

const config = {
  initialRouteParams: screens.Splash,
  headerMode: 'none'
};

const Navigator = createSwitchNavigator(routes, config);
Navigator.urlPrefix = urlPrefix;
export default Navigator;
