import React from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  View,
  StyleSheet,
  Easing,
  TouchableWithoutFeedback,
  Image
} from 'react-native';

class InfoLinkAnimation extends React.Component {
  state = {
    topAnimated: new Animated.Value(-100)
  };

  componentDidMount() {
    Animated.timing(
      // Animate over time
      this.state.topAnimated, // The animated value to drive
      {
        toValue: 80,
        duration: 600
      }
    ).start(); // Starts the animation
  }
  render() {
    let { topAnimated } = this.state;

    return (
      <Animated.View style={[styles.iconViewLink, { top: topAnimated }]}>
        <TouchableWithoutFeedback onPress={e => this.props.detalleScreen()}>
          <Image
            style={styles.iconBarTop}
            source={require('../assets/icon-info.png')}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={e => this.props.filterScreen()}>
          <Image
            style={styles.iconBarTop}
            source={require('../assets/icon-maps.png')}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  iconBarTop: {
    width: 55,
    height: 55
  },
  iconViewLink: {
    zIndex: 99999999,
    right: 5,
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end'
  }
});

const mapStateToProps = ({ maps }) => ({
  selectedId: maps.selectedId
});

const mapDispatchToProps = dispatch => ({
  detalleScreen: () => dispatch({ type: 'Detalle' }),
  infoScreen: () => dispatch({ type: 'Info' })
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoLinkAnimation);
