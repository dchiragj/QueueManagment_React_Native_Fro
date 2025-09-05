/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect } from 'react';
import { StatusBar, View, Platform, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { AppNavigator } from './app/navigation';
// import OfflineNotice from './app/components/OfflineNotice';
import { colors } from './app/styles';
import store from './app/store/store';
import AppStyles from './app/styles/AppStyles';

function App() {
  useEffect(() => {
    console.log('Platform :', Platform.OS);
    LogBox.ignoreAllLogs(); // Ignore warnings in application but showing in metro
  }, []);

  return (
    <View style={AppStyles.rootStyle}>
      <StatusBar translucent backgroundColor={colors.transparent} barStyle='light-content' />
      <Provider store={store}>
        <AppNavigator />
      </Provider>
      {/* <OfflineNotice /> */}
    </View>
  );
}
export default App;
