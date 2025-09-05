/* Redux */
import { connect } from 'react-redux';

/* Routes */
import RootNavigator from './Navigator';
import { createAppContainer } from 'react-navigation';

const AppWithNavigationState = createAppContainer(RootNavigator, 'root');

const mapStateToProps = (state) => ({});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export { RootNavigator, AppNavigator };
