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
  }
  static navigationOptions = {
    header: <SpotSearch placeholder="Busca el barrio acá..." />
  };
  updateTodosBarrios(id) {
    const { Toggle, forSendsCopy } = this.props;
    return Toggle(id, forSendsCopy);
  }
  render() {
    const { dataNeighborhoods } = this.props;
    return (
      <FlatList
        style={{ backgroundColor: '#fff' }}
        data={dataNeighborhoods}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={event => this.updateTodosBarrios(item.id)}
          >
            <View style={styles.itemList}>
              <Text
                style={{
                  color: item.completed ? '#000' : 'rgba(118, 181, 63,1)'
                }}
              >
                {item.name}
              </Text>
              <CheckBox
                onValueChange={value => this.updateTodosBarrios(item.id)}
                value={item.completed}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item, index) => index}
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
  Toggle: (id, barrios) =>
    dispatch({ type: 'TOGGLE_NEIGHBORHOODS', id, barrios })
});
export default connect(mapStateToProps, mapDispatchToProps)(Barrios);
