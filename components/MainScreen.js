import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import MapView from 'react-native-maps';
import moment from 'moment';
import MyLocationMapMarker from './markerLocation';
import AnimationTop from './AnimationTop';
import InfoLinkAnimation from './infoLinkAnimation';
import * as firebase from 'firebase';
import flagGreen from '../assets/marker-green.png';
import flagBlack from '../assets/marker-black.png';

const config = {
  apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  authDomain: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  databaseURL: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  projectId: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  storageBucket: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  messagingSenderId: 'XXXXXXXXXXXXXXXXXXXXXXXXX'
};
firebase.initializeApp(config);
const database = firebase.database();

const LATITUDE_DELTA = 0.09203994981586305;
const LONGITUDE_DELTA = 0.07002342492341285;

class MainScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.marketShowInfo = this.marketShowInfo.bind(this);
    this.daySet = this.daySet.bind(this);
    this.setBarrio = this.setBarrio.bind(this);
    this.neighborhoodsPolygons = this.neighborhoodsPolygons.bind(this);
  }
  marketShowInfo(marker) {
    let { region, dataMarkets, selectedFeria } = this.props;
    var result = dataMarkets
      .filter(x => x.id === Number(marker.nativeEvent.id))
      .map(r => r)[0];
    selectedFeria(result, region, Number(marker.nativeEvent.id));
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
        <Text style={[styles.infoText, { color: 'red', paddingHorizontal: 0 }]}>
          Cerrada Ahora
        </Text>
      );
    if (!trueOrFalse)
      return (
        <Text style={[styles.infoText, { color: 'red', paddingHorizontal: 0 }]}>
          Cerrada Ahora
        </Text>
      );
    return (
      <Text style={[styles.infoText, { color: 'black', paddingHorizontal: 0 }]}>
        Abierto Ahora
      </Text>
    );
  }
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
    }
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        const initialPosition = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        };
        this.props.onRegionChange(initialPosition);
        this.props.markerPositionUpdate(initialPosition);
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition(position => {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      const lastPosition = {
        latitude: lat,
        longitude: lng
      };
      this.props.markerPositionUpdate(lastPosition);
    });
    const Markets = database.ref('markets');
    const Barrios = database.ref('neighborhoods');
    let dataMarkets,
      dataNeighborhoods = [];
    Markets.on('value', snapshot => {
      dataMarkets = snapshot.val();
      this.props.dataMarketsRq(dataMarkets);
    });
    Barrios.on('value', snapshot => {
      dataNeighborhoods = snapshot.val();
      this.props.dataNeighborhoodsRq(dataNeighborhoods);
    });
  }
  daySet(day) {
    var dia = day;
    if (typeof day !== 'Number') {
      dia = Number(day);
    }
    const semana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    return semana[day];
  }
  neighborhoodsPolygons(e) {
    let { dataMarkets, dataNeighborhoods, region } = this.props;
    var Idmarker = Number(e.nativeEvent.id);
    var ready = dataMarkets.filter(x => x.id === Idmarker).map(r => r)[0]
      .neighborhood;
    var polygons = dataNeighborhoods.filter(x => x.id === ready).map(x => x);
    if (polygons[0].points[0][0].lat) {
      polygons[0].points[0].map(obj => {
        obj['latitude'] = obj['lat'];
        obj['longitude'] = obj['lng'];
        delete obj['lat'];
        delete obj['lng'];
        return obj;
      });
    }
    this.props.setPolygons(polygons, region);
  }
  setBarrio(idBarrio) {
    if (typeof idBarrio !== 'Number') {
      idBarrio = Number(idBarrio);
    }
    let { dataNeighborhoods } = this.props;
    var barrioSelected = dataNeighborhoods
      .filter(x => x.id === idBarrio)
      .map(x => x)[0];
    return barrioSelected;
  }

  render() {
    const {
      region,
      dataMarkets,
      markerPosition,
      selectedId,
      imageId,
      polygons,
      dataNeighborhoods
    } = this.props;
    return (
      <View style={styles.container}>
        <MapView
          ref={ref => (this.map = ref)}
          style={styles.map}
          region={region}
          onPress={e => this.props.unKwon()}
          onMarkerPress={this.marketShowInfo}
          onRegionChange={region => this.props.onRegionChange(region)}
          onRegionChangeComplete={region => this.props.onRegionChange(region)}
        >
          {markerPosition &&
            markerPosition.latitude && (
              <MyLocationMapMarker
                coordinate={markerPosition}
                enableHack={true}
                heading={6}
              />
            )}

          {dataMarkets.length > 0 &&
            dataMarkets.map(marker => (
              <MapView.Marker
                style={{ backgroundColor: '#eee' }}
                key={`${marker.id}`}
                identifier={`${marker.id}`}
                onPress={this.neighborhoodsPolygons}
                image={imageId === marker.id ? flagBlack : flagGreen}
                coordinate={{
                  latitude: Number(marker['location'][0]),
                  longitude: Number(marker['location'][1])
                }}
              />
            ))}
          {selectedId &&
            polygons.length > 0 &&
            polygons.map(polygon => (
              <MapView.Polygon
                key={polygon.id}
                coordinates={polygon.points[0]}
                strokeColor="rgba(118, 181, 63,1)"
                fillColor="rgba(118, 181, 63,.4)"
                strokeWidth={1}
              />
            ))}
        </MapView>
        <View style={styles.barra}>
          <TouchableOpacity onPress={e => this.props.infoScreen()}>
            <Image
              style={styles.iconBar}
              source={require('../assets/icon-pregunta.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={e => this.props.filterScreen()}>
            <Image style={styles.iconBar} source={require('../assets/2.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={e => this.props.searchScreen()}>
            <Image style={styles.iconBar} source={require('../assets/3.png')} />
          </TouchableOpacity>
        </View>
        {selectedId && (
          <AnimationTop>
            <Text style={styles.infoText}>{selectedId.streets}</Text>
            <Text style={[styles.infoText, { marginVertical: 3 }]}>
              {this.setBarrio(selectedId.neighborhood).name}
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <View
                style={{
                  marginLeft: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'black',
                  padding: 4,
                  borderRadius: 50,
                  width: 45,
                  height: 21
                }}
              >
                <Text style={{ color: 'white' }}>
                  {this.daySet(selectedId.days)}
                </Text>
              </View>
              <Text style={[styles.infoText, { paddingHorizontal: 13 }]}>
                {selectedId.hours}
              </Text>
              {this.isOpenOrClose(selectedId)}
            </View>
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: 'white',
                marginBottom: 5
              }}
            />
          </AnimationTop>
        )}
        {selectedId && <InfoLinkAnimation />}
        <TouchableOpacity
          onPress={() => {
            var UltraObj = {
              latitude: markerPosition.latitude || region.latitude,
              longitude: markerPosition.longitude || region.longitude,
              latitudeDelta: region.latitudeDelta || region.latitudeDelta,
              longitudeDelta: region.longitudeDelta || region.longitudeDelta
            };
            this.props.onRegionChange(UltraObj);
          }}
          style={{
            backgroundColor: 'rgba(255,255,255,.8)',
            width: 50,
            height: 50,
            position: 'absolute',
            left: 15,
            bottom: 70,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image style={styles.iconBar} source={require('../assets/16.png')} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  customView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'transparent'
  },
  infoText: {
    paddingHorizontal: 15,
    color: 'white'
  },
  iconBar: {
    width: 36,
    height: 36
  },
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
  },
  barra: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(118, 181, 63,.9)',
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 15,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

const mapStateToProps = ({ maps }) => ({
  region: maps.region,
  selectedId: maps.selectedId,
  markerPosition: maps.markerPosition,
  dataMarkets: maps.dataMarkets,
  dataNeighborhoods: maps.dataNeighborhoods,
  imageId: maps.imageId,
  polygons: maps.polygons,
  text: maps.text,
  show: maps.show
});

const mapDispatchToProps = dispatch => ({
  unKwon: () => dispatch({ type: 'UN_KWON' }),
  markerPositionUpdate: markerPosition =>
    dispatch({ type: 'MARKER_POSITION', markerPosition }),
  onRegionChange: region => dispatch({ type: 'MOVE_TO_LOCATION', region }),
  dataMarketsRq: markets => dispatch({ type: 'MARKETS_ALL', markets }),
  setPolygons: (polygons, region) =>
    dispatch({ type: 'SET_POLYGONS', polygons, region }),
  dataNeighborhoodsRq: neighborhoods => {
    neighborhoods = neighborhoods.map(x => ({ ...x, completed: false }));
    return dispatch({ type: 'NEIGHBORHOODS_ALL', neighborhoods });
  },
  selectedFeria: (result, region, id) =>
    dispatch({ type: 'SELECTED_ID', result, region, id }),
  searchScreen: () => dispatch({ type: 'Search' }),
  filterScreen: () => dispatch({ type: 'Filter' }),
  infoScreen: () => dispatch({ type: 'Info' })
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
