import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AppReducer from './reducers';
import AppWithNavigationState from './navigators';

export default class App extends Component<{}> {
  store = createStore(AppReducer);
  render() {
    console.disableYellowBox = true;
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
