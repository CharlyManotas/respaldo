import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native';

class FilterMarker extends React.Component {
  static navigationOptions = {
    title: 'Filtrar',
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: 'rgba(118, 181, 63,1)'
    }
  };
  render() {
    const {
      barriosScreen,
      daysScreen,
      filterActive,
      dataNeighborhoods,
      diasDeLaSemana,
      ToggleAll,
      neighborhoods,
      DaysCompletedFalse
    } = this.props;
    let colorBarriosActive = dataNeighborhoods.length > 0;
    let colorDiasActive = diasDeLaSemana.length > 0;
    return (
      <View style={styles.container}>
        <View style={styles.caja}>
          <View
            style={[
              styles.itemCaja,
              {
                backgroundColor: colorBarriosActive
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
                borderColor: colorBarriosActive
                  ? '#000'
                  : 'rgba(118, 181, 63,1)'
              }
            ]}
          >
            <TouchableWithoutFeedback onPress={e => barriosScreen()}>
              <View style={styles.lupita}>
                {colorBarriosActive && (
                  <Text style={{ width: '100%', textAlign: 'left' }}>
                    {dataNeighborhoods.reduce(
                      (acc, arre) => `${acc} ${arre.name},`,
                      ''
                    )}
                  </Text>
                )}
                {!colorBarriosActive && [
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
                backgroundColor: colorDiasActive
                  ? '#000'
                  : 'rgba(118, 181, 63,1)'
              }
            ]}
          >
            <Text style={styles.itemText}>Días</Text>
            <TouchableWithoutFeedback onPress={e => DaysCompletedFalse()}>
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
                borderColor: colorDiasActive ? '#000' : 'rgba(118, 181, 63,1)'
              }
            ]}
          >
            <TouchableWithoutFeedback onPress={e => daysScreen()}>
              <View style={styles.lupita}>
                {!colorDiasActive && [
                  <Text key="1" style={styles.textTitle}>
                    Todos los días
                  </Text>,
                  <Image
                    style={[styles.iconLupa, { marginBottom: 10 }]}
                    source={require('../assets/icon-lupa.png')}
                    key="2"
                  />
                ]}
                {colorDiasActive && (
                  <Text style={{ width: '100%', textAlign: 'left' }}>
                    {diasDeLaSemana.reduce(
                      (acc, arre) => `${acc} ${arre.name},`,
                      ''
                    )}
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
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
  caja: {
    width: '85%',
    marginTop: 50
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
  filterActive: maps.filterActive,
  diasDeLaSemana: visibilityFilter(daysSelected),
  days: daysSelected,
  neighborhoods: maps.dataNeighborhoods
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
  DaysCompletedFalse: () => dispatch({ type: 'ALL_DAYS_FALSE' })
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterMarker);
