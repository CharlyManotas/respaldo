import SpotSearch from './spotSearch';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
  StyleSheet,
  ListView,
  View,
  Text,
  TouchableWithoutFeedback,
  Icon
} from 'react-native';
const propTypes = {
  dataMarkets: PropTypes.array.isRequired,
  dataNeighborhoods: PropTypes.array.isRequired,
  feriaSelected: PropTypes.func.isRequired,
  text: PropTypes.string
};
class BuscadorDeFerias extends React.Component {
  static navigationOptions = {
    header: <SpotSearch placeholder="Busca la feria acá..." />
  };
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      barrios: this.props.dataNeighborhoods
    };
    this.daySet = this.daySet.bind(this);
    this.setBarrios = this.setBarrios.bind(this);
  }
  daySet(day) {
    var dia = day;
    if (typeof day !== 'Number') {
      dia = Number(day);
    }
    const semana = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miercoles',
      'Jueves',
      'Viernes',
      'Sábado'
    ];
    return semana[day];
  }
  capitalize(string) {
    return `${string[0].toUpperCase()}${string.slice(1, string.length)}`;
  }
  setBarrios(barrio) {
    let { barrios } = this.state;
    var final = this.capitalize(
      barrios
        .filter(x => barrio === x.id)
        .map(r => r.name)[0]
        .toLowerCase()
    );
    return final;
  }
  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.ds.cloneWithRows(this.props.dataMarkets)}
        renderRow={rowData => (
          <TouchableWithoutFeedback
            onPress={e => this.props.feriaSelected(rowData)}
          >
            <View style={styles.lista}>
              <View style={styles.dataOne}>
                <Text style={styles.textStyle}>{rowData.streets}</Text>
                <Text style={{ marginTop: 15, marginBottom: 2, color: '#000' }}>
                  {this.setBarrios(rowData.neighborhood)}
                </Text>
              </View>
              <View style={styles.dataTwo}>
                <Text style={styles.textBlack}>{rowData.hours}</Text>
                <Text style={styles.textBlack}>
                  {this.daySet(rowData.days)}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    );
  }
}

BuscadorDeFerias.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%'
  },
  lista: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: 'transparent',
    borderBottomColor: '#eee',
    flexDirection: 'row'
  },
  textBlack: {
    color: '#000'
  },
  textStyle: {
    fontSize: 16,
    color: '#000'
  },
  dataOne: {
    width: '55.5%'
  },
  dataTwo: {
    width: '44.5%',
    alignItems: 'flex-end'
  }
});

const visibilityFilter = (allDataMarkets, text) => {
  let ExpReg = new RegExp(text, 'gi');
  let miData = allDataMarkets.filter(x => ExpReg.test(x.streets)).map(r => r);
  return miData;
};

const mapStateToProps = state => ({
  dataMarkets: visibilityFilter(state.maps.dataMarkets, state.maps.text),
  dataNeighborhoods: state.maps.dataNeighborhoods,
  text: state.maps.text
});

const mapDispatchToProps = dispatch => ({
  feriaSelected: rowData => {
    let region = {
      latitude: Number(rowData['location'][0]),
      longitude: Number(rowData['location'][1]),
      latitudeDelta: 0.009,
      longitudeDelta: 0.009
    };
    dispatch(NavigationActions.back());
    dispatch({ type: 'SELECTED_LOCATION', region });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BuscadorDeFerias);
