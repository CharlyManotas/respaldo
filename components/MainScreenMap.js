import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import moment from 'moment';

import styles from './styles';

import AnimationTop from './AnimationTop';
import InfoLinkAnimation from './infoLinkAnimation';
import MyLocationMapMarker from './markerLocation';

import flagGreen from '../assets/marker-green.png';
import flagBlack from '../assets/marker-black.png';
import Active from '../assets/icon-filtro-active.png';
import NoActive from '../assets/2.png';

class Mapa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markerImage: flagGreen
    };
    this.marketShowInfo = this.marketShowInfo.bind(this);
  }
  static navigationOptions = {
    header: null
  };
  componentDidMount() {
    const { database, region } = this.props;
    navigator.geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        const initialPosition = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta
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
      dataNeighborhoods.unshift({
        name: 'TODOS LOS BARRIOS',
        id: 99,
        completed: false
      });
      this.props.dataNeighborhoodsRq(dataNeighborhoods);
    });
  }
  changeMarkerImg() {
    this.setState({
      markerImage: this.state.markerImage == flagGreen ? flagBlack : flagGreen
    });
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

  daySet(day) {
    let otherName = day.split(',').map(x => Number(x));
    let semana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    let final = otherName.map(dia => (
      <View key={dia} style={styles.dayOpen}>
        <Text style={{ color: 'white' }}>{semana[dia]}</Text>
      </View>
    ));
    return final;
  }
  isOpenOrClose(selectedId) {
    let today = moment().days();
    let hora = moment().hours();
    let { days, hours } = selectedId;
    let newDays = days.split(',').map(x => Number(x));
    let horarioMaxAndMin = hours.split('-').map(x => Number(x.split(':')[0]));
    let trueOrFalse =
      hora >= horarioMaxAndMin[0] && hora <= horarioMaxAndMin[1];
    if (newDays.indexOf(today) === -1)
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

  marketShowInfo(e) {
    let { region, dataMarkets, selectedFeria, dataNeighborhoods } = this.props;
    var result = [...dataMarkets]
      .filter(x => x.id === Number(e.nativeEvent.id))
      .map(r => r)[0];
    var polygons = [...dataNeighborhoods]
      .filter(x => x.id === result.neighborhood)
      .map(x => x);
    if (polygons[0].points[0][0].lat) {
      polygons[0].points[0].map(obj => {
        obj['latitude'] = obj['lat'];
        obj['longitude'] = obj['lng'];
        delete obj['lat'];
        delete obj['lng'];
        return obj;
      });
    }
    selectedFeria(result, region, Number(e.nativeEvent.id), polygons);
  }
  render() {
    const {
      region,
      dataMarkets,
      imageId,
      selectedId,
      polygons,
      filterActive,
      markerPosition,
      onlyPolygonsActivity,
      showPolygonosActivity
    } = this.props;
    return (
      <View style={styles.container}>
        <MapView
          ref={ref => (this.map = ref)}
          style={styles.map}
          region={region}
          onPress={e => this.props.unKwon()}
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
                key={`${marker.id}`}
                identifier={`${marker.id}`}
                onPress={e => this.marketShowInfo(e)}
                image={imageId !== marker.id ? flagGreen : flagBlack}
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
          {onlyPolygonsActivity &&
            !selectedId &&
            showPolygonosActivity &&
            [...onlyPolygonsActivity].map(polygon => (
              <MapView.Polygon
                key={polygon.id}
                coordinates={polygon.points}
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
            <Image
              style={styles.iconBar}
              source={filterActive ? Active : NoActive}
            />
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
              {this.daySet(selectedId.days)}
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

const visibilityFilter = (
  filterActive, // si es true se activan los filtros correspondientes
  markets, // todas las ferias
  neighborhoods, // todos los barrios
  daysSelected, // dias de la semana si se eligieron
  diaFiltroBoolean, // booleano si activaron el filtro con los dias
  barrioFiltradoBoolean, // booleano si activaron el filtro con los barrios
  switchFiltradoBoolean // booleano si activaron abiertas ahora
) => {
  let newNeighborhoods = [...neighborhoods]; // copia de todos los barrios
  let newMarket = [...markets]; // copia de todas las ferias
  let newDays = [...daysSelected]; // copia de todos los dias de la semana
  if (!filterActive) return newMarket; // sino hay ningun filtro activo devuelvo todas las ferias
  let miData = newNeighborhoods.filter(x => x.completed).map(r => r.id); // guardo en un array los ids de los barrios marcados como completed
  let miDays = daysSelected.filter(x => x.completed).map(r => r.id); // guardo en un array los ids de los dias marcados como completed

  let horarioGorra = ({ hours }) => {
    // funcion que tedermina la hora actual y filtra las ferias que aun esten abiertas segun horario
    let hora = moment().hours();
    let horarioMaxAndMin = hours.split('-').map(x => Number(x.split(':')[0]));
    return hora >= horarioMaxAndMin[0] && hora <= horarioMaxAndMin[1];
  };

  let ultraFinal = [...newMarket]; // si hay filtro este sera el array que devolvere
  /*
    ////////////////////////////////////////////////////////////////////////
    ESTOS SON LOS 3 POSIBLES FILTROS ACTIVOS:
      1.- se activo con dias de la dias de la se mana `{diaFiltroBoolean}`
      2.- se activo con barrios `{barrioFiltradoBoolean}`
      3.- se activo abiertas ahora `{switchFiltradoBoolean}`
    ////////////////////////////////////////////////////////////////////////
  */
  if (diaFiltroBoolean) {
    ultraFinal = [...ultraFinal]
      .filter(x => miDays.indexOf(x.days) > -1)
      .map(s => s);
  }
  if (barrioFiltradoBoolean) {
    ultraFinal = [...ultraFinal]
      .filter(x => miData.indexOf(x.neighborhood) > -1)
      .map(s => s);
  }
  if (switchFiltradoBoolean) {
    ultraFinal = [...ultraFinal].filter(horarioGorra).map(s => s);
  }

  return ultraFinal;
};

const mapDispatchToProps = dispatch => ({
  unKwon: () => dispatch({ type: 'UN_KWON' }),
  markerPositionUpdate: markerPosition =>
    dispatch({ type: 'MARKER_POSITION', markerPosition }),
  onRegionChange: region => dispatch({ type: 'MOVE_TO_LOCATION', region }),
  dataMarketsRq: markets => dispatch({ type: 'MARKETS_ALL', markets }),
  dataNeighborhoodsRq: neighborhoods => {
    neighborhoods = neighborhoods.map(x => ({ ...x, completed: false }));
    return dispatch({ type: 'NEIGHBORHOODS_ALL', neighborhoods });
  },
  selectedFeria: (result, region, id, polygons) =>
    dispatch({ type: 'SELECTED_ID', result, region, id, polygons }),
  searchScreen: () => dispatch({ type: 'Search' }),
  filterScreen: () => dispatch({ type: 'Filter' }),
  infoScreen: () => dispatch({ type: 'Info' })
});
const visibilityFilterPoly = (
  filterActive,
  filterNeighborhood,
  neighborhoods
) => {
  if (filterActive && filterNeighborhood) {
    let polygons = [...neighborhoods].filter(x => x.completed).map(r => r);
    let arregloPolygonos = [...polygons].map(x => ({
      id: x.id,
      points: x.points[0].map(r => ({ latitude: r.lat, longitude: r.lng }))
    }));
    return arregloPolygonos;
  }
  return false;
};
const mapStateToProps = ({ maps, daysSelected, activitiFilter }) => ({
  region: maps.region,
  selectedId: maps.selectedId,
  markerPosition: maps.markerPosition,
  dataMarkets: visibilityFilter(
    activitiFilter.filterActive,
    maps.dataMarkets,
    maps.dataNeighborhoods,
    daysSelected.diadelasemana,
    activitiFilter.dayActivityFilter,
    activitiFilter.neighborhoodsActivityFilter,
    daysSelected.switchActive
  ),
  onlyPolygonsActivity: visibilityFilterPoly(
    activitiFilter.filterActive,
    activitiFilter.neighborhoodsActivityFilter,
    maps.dataNeighborhoods
  ),
  showPolygonosActivity: activitiFilter.showPolygonosActivity,
  dataNeighborhoods: maps.dataNeighborhoods,
  imageId: maps.imageId,
  polygons: maps.polygons,
  text: maps.text,
  show: maps.show,
  today: daysSelected.today,
  filterActive: activitiFilter.filterActive,
  database: maps.database
});
export default connect(mapStateToProps, mapDispatchToProps)(Mapa);
