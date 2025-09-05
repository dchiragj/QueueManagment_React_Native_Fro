import { createDrawerNavigator } from 'react-navigation-drawer';
import DrawerDesignComponent from '../components/DrawerDesign';
import Routes from './routes/RootRoutes';
import screens from '../constants/screens';
import { colors } from '../styles';

const config = {
  contentOptions: {
    activeTintColor: colors.primary,
    inactiveTintColor: colors.lightWhite
  },
  initialRouteName: screens.HomeRoot,
  drawerPosition: 'left',
  drawerType: 'front',
  drawerWidth: '80%',
  contentComponent: DrawerDesignComponent,
  initialRouteName: screens.SettingsRoot,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle'
};
const DrawerNavigator = createDrawerNavigator(Routes, config);

export default DrawerNavigator;
