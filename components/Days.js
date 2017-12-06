import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
  CheckBox,
  FlatList
} from 'react-native';
import { NavigationActions } from 'react-navigation';

const Days = ({ dispatch, diasDeLaSemana, Toggle }) => {
  return (
    <FlatList
      style={{ backgroundColor: '#fff' }}
      data={diasDeLaSemana}
      renderItem={({ item }) => (
        <TouchableWithoutFeedback
          onPress={() => Toggle(item.id, diasDeLaSemana)}
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
              onValueChange={e => Toggle(item.id, diasDeLaSemana)}
              value={item.completed}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
      keyExtractor={(item, index) => index}
    />
  );
};

const styles = StyleSheet.create({
  itemList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginLeft: 10,
    borderBottomColor: 'rgba(118, 181, 63,1)',
    borderBottomWidth: 1,
    backgroundColor: '#fff'
  },
  textItem: {
    color: 'rgba(118, 181, 63,1)'
  }
});
Days.navigationOptions = {
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: 'rgba(118, 181, 63,1)'
  }
};
const mapStateToProps = ({ daysSelected }) => ({
  diasDeLaSemana: daysSelected.diadelasemana
});
const mapDispatchToProps = dispatch => ({
  Toggle: (id, diadelasemana) =>
    dispatch({ type: 'TOGGLE_DAY', id, diadelasemana })
});
export default connect(mapStateToProps, mapDispatchToProps)(Days);
