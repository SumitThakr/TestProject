/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Color } from './source/constant';
import {store} from './source/redux/store';
import {Provider } from 'react-redux';
import 'react-native-gesture-handler';
import AppIndex from './source/AppIndex';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  } 
  render() {
    return (
      <Provider store={store}>
        <StatusBar barStyle="dark-content" backgroundColor={Color.white} />
        <SafeAreaView style={{ flex: 1 }}>
          <AppIndex/>
        </SafeAreaView>
      </Provider>
    );
  }
}
export default App;
