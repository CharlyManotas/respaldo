import React from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Easing,
  TouchableWithoutFeedback,
  Image
} from 'react-native';

export default class AnimationTop extends React.Component {
  state = {
    fadeAnim: new Animated.Value(-100)
  };

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: 600
    }).start();
  }
  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View style={[styles.barraTop, { top: fadeAnim }]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  barraTop: {
    justifyContent: 'flex-end',
    left: 0,
    height: 100,
    right: 0,
    position: 'absolute',
    flexDirection: 'column',
    backgroundColor: 'rgba(118, 181, 63,.8)',
    overflow: 'visible'
  }
});
