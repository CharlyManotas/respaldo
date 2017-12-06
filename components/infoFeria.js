import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Linking
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 25
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  image: {
    width: 100,
    height: 100
  },
  icons: {
    width: 30,
    height: 30
  },
  version: {
    fontWeight: '600',
    fontSize: 18,
    marginTop: 8
  },
  info: {
    width: '80%',
    textAlign: 'center',
    color: 'rgba(118, 181, 63,1)',
    marginTop: 12
  },
  links: {
    marginTop: 'auto',
    width: '80%',
    marginBottom: 15
  },
  linkeables: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(118, 181, 63,1)',
    paddingVertical: 8,
    paddingLeft: 6
  },
  textLink: {
    color: 'rgba(118, 181, 63,1)',
    fontSize: 16,
    marginLeft: 10
  }
});

const urlFacebook = 'https://www.facebook.com/feriasmdeo/';
const url =
  'https://play.google.com/store/apps/details?id=com.montevideoferias';
const urlEmail = 'mailto:ferias.mdeo@gmail.com?subject=Contacto';

const InfoFeria = ({ navigation }) => (
  <View style={styles.container}>
    <Image style={styles.image} source={require('../assets/icon-app.png')} />
    <Text style={styles.version}>Versión 1.0.1</Text>
    <Text style={styles.info}>
      Ferias MDEO es una aplicación que te ayudará a ubicar con exactitud cada
      una de las ferias en la ciudad de Montevideo.
    </Text>
    <View style={styles.links}>
      <TouchableWithoutFeedback
        onPress={e =>
          Linking.openURL(urlFacebook).catch(err =>
            console.error('An error occurred', err)
          )
        }
      >
        <View style={styles.linkeables}>
          <Image
            style={styles.icons}
            source={require('../assets/icon-facebook.png')}
          />
          <Text style={styles.textLink}>Danos Me Gusta en Facebook</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={e =>
          Linking.openURL(urlEmail).catch(err =>
            console.error('An error occurred', err)
          )
        }
      >
        <View style={styles.linkeables}>
          <Image
            style={styles.icons}
            source={require('../assets/icon-help.png')}
          />
          <Text style={styles.textLink}>Contáctonos</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={e =>
          Linking.openURL(url).catch(err =>
            console.error('An error occurred', err)
          )
        }
      >
        <View
          style={[
            styles.linkeables,
            {
              borderBottomColor: 'rgba(118, 181, 63,1)',
              borderBottomWidth: 1
            }
          ]}
        >
          <Image
            style={styles.icons}
            source={require('../assets/icon-star.png')}
          />
          <Text style={styles.textLink}>Avalía la app</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </View>
);

InfoFeria.propTypes = {
  navigation: PropTypes.object.isRequired
};

InfoFeria.navigationOptions = {
  title: 'Acerca',
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: 'rgba(118, 181, 63,1)'
  }
};

export default InfoFeria;
