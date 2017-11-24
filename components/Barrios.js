import SpotSearch from './spotSearch';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  CheckBox,
  TouchableWithoutFeedback
} from 'react-native';
import { NavigationActions } from 'react-navigation';

const styles = StyleSheet.create({
  itemList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: 'rgba(118, 181, 63,1)',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    marginLeft: 10
  },
  textItem: {
    color: 'rgba(118, 181, 63,1)'
  }
});
class Barrios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: false
    };
  }
  static navigationOptions = {
    header: <SpotSearch placeholder="Busca el barrio acá..." />
  };
  updateTodosBarrios(id) {
    const { Toggle, forSendsCopy, ToggleAll } = this.props;
    let { completed } = this.state;
    if (id === 99) {
      this.setState({ completed: !completed });
      return ToggleAll(!completed, forSendsCopy);
    }
    return Toggle(id, forSendsCopy);
  }
  render() {
    const { dataNeighborhoods } = this.props;
    const { completed } = this.state;
    return (
      <FlatList
        style={{ backgroundColor: '#fff' }}
        data={[
          { name: 'TODOS LOS BARRIOS', id: 99, completed: completed },
          ...dataNeighborhoods
        ]}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={event => this.updateTodosBarrios(item.id)}
          >
            <View style={styles.itemList}>
              <Text style={styles.textItem}>{item.name}</Text>
              <CheckBox
                onValueChange={value => this.updateTodosBarrios(item.id)}
                value={item.completed}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    );
  }
}

const visibilityFilter = (dataNeighborhoods, text) => {
  let ExpReg = new RegExp(text, 'gi');
  let miData = dataNeighborhoods
    .filter(x => ExpReg.test(x.name.toLowerCase()))
    .map(r => r);
  return miData;
};

const mapStateToProps = ({ maps }) => ({
  dataNeighborhoods: visibilityFilter(maps.dataNeighborhoods, maps.text),
  forSendsCopy: maps.dataNeighborhoods
});
const mapDispatchToProps = dispatch => ({
  Toggle: (id, neighborhoods) =>
    dispatch({ type: 'TOGGLE_NEIGHBORHOODS', id, neighborhoods }),
  ToggleAll: (trueOrFalse, neighborhoods) =>
    dispatch({ type: 'TOGGLE_ALL_NEIGHBORHOODS', trueOrFalse, neighborhoods })
});
export default connect(mapStateToProps, mapDispatchToProps)(Barrios);
