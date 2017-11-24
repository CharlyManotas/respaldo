import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions, HeaderBackButton } from 'react-navigation';
import {
  StyleSheet,
  ListView,
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

const propTypes = {
  text: PropTypes.string,
  updateText: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
};

class SpotSearch extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <HeaderBackButton tintColor="#fff" onPress={e => this.props.goBack()} />
        <TextInput
          placeholder={this.props.placeholder}
          placeholderTextColor="#000"
          underlineColorAndroid="transparent"
          style={styles.inputStyle}
          onChangeText={text => this.props.updateText(text)}
          value={this.props.text}
        />
        <Image
          style={styles.lupa}
          source={require('../assets/icon-lupa.png')}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 60,
    backgroundColor: 'rgba(118, 181, 63,1)',
    width: '100%'
  },
  lupa: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: 18,
    bottom: 0,
    margin: 'auto',
    right: 50,
    zIndex: 9999
  },
  inputStyle: {
    height: 40,
    borderColor: 'transparent',
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 20
  },
  image: {
    width: 25,
    height: 25,
    marginRight: 15
  }
});

SpotSearch.propTypes = propTypes;

const mapStateToProps = state => ({
  text: state.maps.text
});

const mapDispatchToProps = dispatch => ({
  updateText: text => dispatch({ type: 'TEXT_UPDATE', text }),
  goBack: () => dispatch(NavigationActions.back())
});

export default connect(mapStateToProps, mapDispatchToProps)(SpotSearch);
