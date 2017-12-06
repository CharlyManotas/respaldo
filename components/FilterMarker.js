import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions, HeaderBackButton } from 'react-navigation';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableWithoutFeedback,
  Switch
} from 'react-native';
import moment from 'moment';

class FilterMarker extends React.Component {
  constructor(props) {
    super(props);
    this.filtroActive = this.filtroActive.bind(this);
  }
  static navigationOptions = ({
    navigation,
    screenProps,
    navigationOptions
  }) => {
    let { state } = navigation;
    return {
      title: 'Filtrar',
      headerTintColor: '#fff',
      headerLeft: (
        <HeaderBackButton
          tintColor="#fff"
          onPress={e => {
            state.params.filtroActive();
            navigation.goBack();
          }}
        />
      ),
      headerStyle: {
        backgroundColor: 'rgba(118, 181, 63,1)'
      }
    };
  };
  filtroActive() {
    let {
      dataNeighborhoods,
      diasDeLaSemana,
      ToogleFilter,
      neighborhoods,
      days
    } = this.props;

    let daysCount = days.length; // total de dias
    let neighborhoodsCount = neighborhoods.length; // total de barrios
    let colorBarriosActive =
      dataNeighborhoods.length > 0 &&
      dataNeighborhoods.length < neighborhoodsCount;
    let colorDiasActive =
      diasDeLaSemana.length > 0 && diasDeLaSemana.length < daysCount;
    let completedNeighborhoods = neighborhoods
      .filter(x => x.completed)
      .map(r => r).length;
    let completedDays = days.filter(x => x.completed).map(r => r).length;
    let definitivoPorLasDudas =
      neighborhoods.filter(x => x.completed).map(r => r).length > 0;
    let definitivoPorLasDudasDays =
      days.filter(x => x.completed).map(r => r).length > 0;
    let result = {
      daysCount,
      neighborhoodsCount,
      definitivoPorLasDudas,
      definitivoPorLasDudasDays,
      completedNeighborhoods,
      completedDays
    };
    return ToogleFilter(colorBarriosActive, colorDiasActive, result);
  }
  componentDidMount() {
    this.props.navigation.setParams({
      filtroActive: this.filtroActive
    });
  }
  render() {
    const {
      barriosScreen,
      daysScreen,
      dataNeighborhoods,
      diasDeLaSemana,
      ToggleAll,
      neighborhoods,
      DaysCompletedFalse,
      days,
      switchActive,
      ToggleSwicth,
      ToogleFilter,
      today
    } = this.props;
    let yesOrnot =
      neighborhoods.filter(x => !x.completed).map(r => r).length > 0;
    let notOrYes = days.filter(x => !x.completed).map(r => r).length > 0;
    let colorBarriosActive = dataNeighborhoods.length > 0;
    let colorDiasActive = diasDeLaSemana.length > 0;
    return (
      <View style={styles.container}>
        <View style={styles.caja}>
          <View
            style={[
              styles.itemCaja,
              {
                backgroundColor:
                  colorBarriosActive && yesOrnot
                    ? '#000'
                    : 'rgba(118, 181, 63,1)'
              }
            ]}
          >
            <Text style={styles.itemText}>Barrios</Text>
            <TouchableWithoutFeedback onPress={e => ToggleAll(neighborhoods)}>
              <Image
                style={styles.iconBar}
                source={require('../assets/icon-trash.png')}
              />
            </TouchableWithoutFeedback>
          </View>
          <View
            style={[
              styles.infoAll,
              {
                borderColor:
                  colorBarriosActive && yesOrnot
                    ? '#000'
                    : 'rgba(118, 181, 63,1)'
              }
            ]}
          >
            <TouchableWithoutFeedback onPress={e => barriosScreen()}>
              <View style={styles.lupita}>
                {colorBarriosActive &&
                  yesOrnot && (
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={6}
                      style={{ width: '100%', textAlign: 'left' }}
                    >
                      {dataNeighborhoods
                        .reduce((acc, arre) => `${acc} ${arre.name},`, '')
                        .slice(0, -1)}
                    </Text>
                  )}
                {(!colorBarriosActive || !yesOrnot) && [
                  <Text key="1" style={styles.textTitle}>
                    Todos los barrios
                  </Text>,
                  <Image
                    style={styles.iconLupa}
                    source={require('../assets/icon-lupa.png')}
                    key="2"
                  />
                ]}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.caja}>
          <View
            style={[
              styles.itemCaja,
              {
                backgroundColor:
                  colorDiasActive && notOrYes ? '#000' : 'rgba(118, 181, 63,1)'
              }
            ]}
          >
            <Text style={styles.itemText}>Días</Text>
            <TouchableWithoutFeedback onPress={e => DaysCompletedFalse(days)}>
              <Image
                style={styles.iconBar}
                source={require('../assets/icon-trash.png')}
              />
            </TouchableWithoutFeedback>
          </View>
          <View
            style={[
              styles.infoAll,
              {
                minHeight: 95,
                borderColor:
                  colorDiasActive && notOrYes ? '#000' : 'rgba(118, 181, 63,1)'
              }
            ]}
          >
            <TouchableWithoutFeedback onPress={e => daysScreen()}>
              <View style={styles.lupita}>
                {(!colorDiasActive || !notOrYes) && [
                  <Text key="1" style={styles.textTitle}>
                    Todos los días
                  </Text>,
                  <Image
                    style={[styles.iconLupa, { marginBottom: 10 }]}
                    source={require('../assets/icon-lupa.png')}
                    key="2"
                  />
                ]}
                {colorDiasActive &&
                  notOrYes && (
                    <Text style={{ width: '100%', textAlign: 'left' }}>
                      {diasDeLaSemana
                        .filter(x => x.id !== '00')
                        .reduce((acc, arre) => `${acc} ${arre.name},`, '')
                        .slice(0, -1)}
                    </Text>
                  )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.switchText}>
          <Text style={styles.textTitle}>Mostrar abiertas ahora</Text>
          <Switch
            value={switchActive}
            onValueChange={value => ToggleSwicth(value, days, today)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center'
  },
  switchText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    width: '85%'
  },
  caja: {
    width: '85%',
    marginTop: 35
  },
  lupita: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  iconLupa: {
    width: 45,
    height: 45,
    marginTop: 'auto',
    marginBottom: 20
  },
  textTitle: {
    alignSelf: 'flex-start',
    color: 'rgba(118, 181, 63,1)',
    fontSize: 16
  },
  infoAll: {
    borderColor: 'rgba(118, 181, 63,1)',
    borderWidth: 1,
    minHeight: 130,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 10
  },
  itemCaja: {
    backgroundColor: 'rgba(118, 181, 63,1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  itemText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500'
  },
  iconBar: {
    width: 30,
    height: 30
  }
});

const visibilityFilter = dataNeighborhoods => {
  let miData = dataNeighborhoods.filter(x => x.completed).map(r => r);
  return miData;
};

const mapStateToProps = ({ maps, daysSelected }) => ({
  dataNeighborhoods: visibilityFilter(maps.dataNeighborhoods),
  diasDeLaSemana: visibilityFilter(daysSelected.diadelasemana),
  days: daysSelected.diadelasemana,
  neighborhoods: maps.dataNeighborhoods,
  switchActive: daysSelected.switchActive,
  today: daysSelected.today
});

const mapDispatchToProps = dispatch => ({
  barriosScreen: () => dispatch({ type: 'Barrios' }),
  daysScreen: () => dispatch({ type: 'Days' }),
  ToggleAll: neighborhoods =>
    dispatch({
      type: 'TOGGLE_ALL_NEIGHBORHOODS',
      trueOrFalse: false,
      neighborhoods
    }),
  DaysCompletedFalse: diadelasemana =>
    dispatch({ type: 'ALL_DAYS_FALSE', diadelasemana }),
  ToggleSwicth: (switchActive, diadelasemana, today) =>
    dispatch({ type: 'SWITCH_ACTIVE', switchActive, diadelasemana, today }),
  ToogleFilter: (barrios, dias, result) =>
    dispatch({ type: 'TOGGLE_FILTER', barrios, dias, result })
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterMarker);
