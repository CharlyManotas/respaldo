import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  addNavigationHelpers,
  StackNavigator,
  NavigationActions
} from 'react-navigation';
import { BackHandler } from 'react-native';
import MainScreen from '../components/MainScreen';
import BuscadorDeFerias from '../components/BuscadorDeFerias';
import FilterMarker from '../components/FilterMarker';
import InfoFeria from '../components/infoFeria';
import Detalle from '../components/Detalle';
import Barrios from '../components/Barrios';
import Days from '../components/Days';

export const AppNavigator = StackNavigator({
  Main: { screen: MainScreen },
  Buscador: { screen: BuscadorDeFerias },
  Filtro: { screen: FilterMarker },
  Info: { screen: InfoFeria },
  Detalle: { screen: Detalle },
  Barrios: { screen: Barrios },
  Days: { screen: Days }
});
class AppWithNavigationState extends React.Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) return false;

    dispatch(NavigationActions.back());
    return true;
  };
  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator
        navigation={addNavigationHelpers({ dispatch, state: nav })}
      />
    );
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  nav: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
