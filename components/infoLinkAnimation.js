import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Linking
} from 'react-native';

class InfoLinkAnimation extends React.Component {
  render() {
    const { selectedId, markerPosition, region } = this.props;

    return (
      <View style={styles.iconViewLink}>
        <TouchableWithoutFeedback onPress={e => this.props.detalleScreen()}>
          <Image
            style={styles.iconBarTop}
            source={require('../assets/icon-info.png')}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={e =>
            Linking.openURL(
              `https://maps.google.com/maps?saddr=${markerPosition.latitude ||
                region.latitude},${markerPosition.longitude ||
                region.longitude}&daddr=${selectedId.location[0]},${
                selectedId.location[1]
              }`
            )
          }
        >
          <Image
            style={styles.iconBarTop}
            source={require('../assets/icon-maps.png')}
          />
        </TouchableWithoutFeedback>
      </View>
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
    top: 80,
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end'
  }
});

const mapStateToProps = ({ maps }) => ({
  selectedId: maps.selectedId,
  markerPosition: maps.markerPosition,
  region: maps.region
});

const mapDispatchToProps = dispatch => ({
  detalleScreen: () => dispatch({ type: 'Detalle' })
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoLinkAnimation);
