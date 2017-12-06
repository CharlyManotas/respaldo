import React from 'react';
import {
  View,
  StyleSheet,
  Easing,
  TouchableWithoutFeedback,
  Image
} from 'react-native';

export default class AnimationTop extends React.Component {
  render() {
    return (
      <View style={[styles.barraTop, { top: 0 }]}>{this.props.children}</View>
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
