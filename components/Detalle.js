import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableWithoutFeedback,
  Button,
  Linking
} from 'react-native';

const propTypes = {
  selectedId: PropTypes.object.isRequired,
  dataNeighborhoods: PropTypes.array.isRequired
};
const urlEmail = 'mailto:ferias.mdeo@gmail.com?subject=';
class Detalle extends React.Component {
  static navigationOptions = {
    title: 'Detalles',
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: 'rgba(118, 181, 63,1)'
    }
  };
  daySet(day) {
    let otherName = day.split(',').map(x => Number(x));
    const semana = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miercoles',
      'Jueves',
      'Viernes',
      'Sábado'
    ];
    let final = otherName.reduce((acc, day) => `${acc} ${semana[day]}/`, '');
    return final.slice(0, -1);
  }
  capitalize(string) {
    return `${string[0].toUpperCase()}${string.slice(1, string.length)}`;
  }
  barrio() {
    let { dataNeighborhoods, selectedId } = this.props;
    let result = dataNeighborhoods
      .filter(x => x.id === selectedId.neighborhood)
      .map(s => s.name)[0];
    return result;
  }
  isOpenOrClose(selectedId) {
    let today = moment().days();
    let hora = moment().hours();
    let { days, hours } = selectedId;
    let horarioMaxAndMin = hours.split('-').map(x => Number(x.split(':')[0]));
    let trueOrFalse =
      hora >= horarioMaxAndMin[0] && hora <= horarioMaxAndMin[1];
    if (Number(days) !== today)
      return (
        <Text
          style={{
            marginTop: 20,
            fontSize: 18,
            color: 'red',
            paddingHorizontal: 0
          }}
        >
          Cerrada Ahora
        </Text>
      );
    if (!trueOrFalse)
      return (
        <Text
          style={{
            marginTop: 20,
            fontSize: 18,
            color: 'red',
            paddingHorizontal: 0
          }}
        >
          Cerrada Ahora
        </Text>
      );
    return (
      <Text
        style={{
          marginTop: 20,
          fontSize: 18,
          color: 'black',
          paddingHorizontal: 0
        }}
      >
        Abierto Ahora
      </Text>
    );
  }
  render() {
    const { selectedId } = this.props;
    return (
      <View style={styles.container}>
        <Text style={[styles.textColor, styles.textTitle]}>Barrio:</Text>
        <Text style={[styles.textColor]}>
          {this.capitalize(this.barrio().toLowerCase())}
        </Text>
        <Text style={[styles.textColor, styles.textTitle]}>Calles</Text>
        <Text style={[styles.textColor]}>{selectedId.streets}</Text>
        <Text style={[styles.textColor, styles.textTitle]}>Días:</Text>
        <Text style={[styles.textColor]}>{this.daySet(selectedId.days)}</Text>
        <View style={styles.viewStyle}>
          <Text style={[styles.textColor, styles.textTitle]}>Horário:</Text>
          {this.isOpenOrClose(selectedId)}
        </View>
        <Text style={[styles.textColor]}>
          Armado {selectedId.setup_hours.split('-')[0]}
        </Text>
        <Text style={[styles.textColor]}>Actividad {selectedId.hours}</Text>
        <Text style={[styles.textColor]}>
          Cierre {selectedId.setup_hours.split('-')[1]}
        </Text>
        <View style={{ marginTop: 'auto', marginBottom: 25 }}>
          <Button
            onPress={e =>
              Linking.openURL(
                `${urlEmail}Nueva información: ${selectedId.streets}`
              ).catch(err => console.error('An error occurred', err))
            }
            title="Actualiza esta información"
            color="rgba(118, 181, 63,1)"
          />
        </View>
      </View>
    );
  }
}
Detalle.propTypes = propTypes;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50
  },
  textColor: {
    color: 'rgba(118, 181, 63,1)',
    paddingLeft: 15
  },
  textTitle: {
    marginTop: 20,
    fontWeight: '600',
    fontSize: 18,
    paddingLeft: 0
  },
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

const mapStateToProps = ({ maps }) => ({
  dataNeighborhoods: maps.dataNeighborhoods,
  selectedId: maps.selectedId
});

export default connect(mapStateToProps)(Detalle);
