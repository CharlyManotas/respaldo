import moment from 'moment';
import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';
import { AppNavigator } from '../navigators';

const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const initialNavState = AppNavigator.router.getStateForAction(firstAction);

const config = {
  apiKey: 'AIzaSyCypnqUSXhYWIsdru5yZSKQQzOBxOLskAE',
  authDomain: 'feriasmdeo-169822.firebaseapp.com',
  databaseURL: 'https://feriasmdeo-169822.firebaseio.com',
  projectId: 'feriasmdeo-169822',
  storageBucket: 'feriasmdeo-169822.appspot.com',
  messagingSenderId: '727727023663'
};
firebase.initializeApp(config);

const initialState = {
  region: {
    latitude: -34.906545561248116,
    longitude: -56.16232395172119,
    latitudeDelta: 0.09203994981586305,
    longitudeDelta: 0.07002342492341285
  },
  selectedId: false,
  markerPosition: {},
  dataMarkets: [],
  dataNeighborhoods: [],
  imageId: -1,
  polygons: [],
  text: '',
  filterActive: false,
  database: firebase.database()
};
const initialStateWeeks = {
  diadelasemana: [
    { name: 'Todos los días', completed: false, id: '00' },
    { name: 'Domingo', completed: false, id: '0' },
    { name: 'Lunes', completed: false, id: '1' },
    { name: 'Martes', completed: false, id: '2' },
    { name: 'Miercoles', completed: false, id: '3' },
    { name: 'Jueves', completed: false, id: '4' },
    { name: 'Viernes', completed: false, id: '5' },
    { name: 'Sábado', completed: false, id: '6' }
  ],
  switchActive: false,
  today: moment().days()
};
function daysSelected(state = initialStateWeeks, action) {
  let newState = { ...state };
  switch (action.type) {
    case 'TOGGLE_DAY':
      if (action.id === '00') {
        let trueOrFalse = action.diadelasemana[0].completed;
        newState['diadelasemana'] = action.diadelasemana.map(x => ({
          ...x,
          completed: !trueOrFalse
        }));
      } else {
        newState['diadelasemana'] = action.diadelasemana.map(x => {
          if (x.id !== action.id) {
            return x;
          }
          return {
            ...x,
            completed: !x.completed
          };
        });
        let maybe =
          newState['diadelasemana'].filter(x => !x.completed).map(r => r)
            .length > 0;
        if (maybe) newState['diadelasemana'][0].completed = false;
      }
      break;
    case 'ALL_DAYS_FALSE':
      newState['switchActive'] = false;
      newState['diadelasemana'] = action.diadelasemana.map(x => ({
        ...x,
        completed: false
      }));
      break;
    case 'SWITCH_ACTIVE':
      newState['switchActive'] = action.switchActive;
      if (!action.switchActive) {
        newState['diadelasemana'] = action.diadelasemana.map(x => ({
          ...x,
          completed: false
        }));
      } else {
        newState['diadelasemana'] = action.diadelasemana.map(x => {
          if (x.id === `${action.today}`) return { ...x, completed: true };
          return { ...x, completed: false };
        });
      }
      break;
    default:
      break;
  }
  return newState || state;
}
function activitiFilter(
  state = {
    filterActive: false,
    dayActivityFilter: false,
    neighborhoodsActivityFilter: false,
    showPolygonosActivity: false
  },
  action
) {
  let newState = { ...state };
  switch (action.type) {
    case 'UN_KWON':
      newState['showPolygonosActivity'] = false;
      break;
    case 'TOGGLE_FILTER':
      let dayActivityFilterToggle =
        action.result['daysCount'] === action.result['completedDays'];
      let neighborhoodsActivityFilterToggle =
        action.result['neighborhoodsCount'] ===
        action.result['completedNeighborhoods'];
      let lagorra =
        dayActivityFilterToggle && neighborhoodsActivityFilterToggle;
      if (
        (action.barrios || action.dias) &&
        (!dayActivityFilterToggle || !neighborhoodsActivityFilterToggle)
      ) {
        newState['filterActive'] = true;
        newState['dayActivityFilter'] =
          action.result['definitivoPorLasDudasDays'];
        newState['neighborhoodsActivityFilter'] =
          action.result['definitivoPorLasDudas'];
        newState['showPolygonosActivity'] =
          action.result['definitivoPorLasDudas'];
      } else {
        newState['filterActive'] = false;
        newState['dayActivityFilter'] = false;
        newState['neighborhoodsActivityFilter'] = false;
        newState['showPolygonosActivity'] = false;
      }
      break;
    default:
      break;
  }
  return newState;
}
function maps(state = initialState, action) {
  let newState = { ...state };
  switch (action.type) {
    case 'SELECTED_LOCATION':
      newState['text'] = '';
      newState['region'] = action.region;
      newState['imageId'] = -1;
      newState['selectedId'] = false;
      break;
    case 'MOVE_TO_LOCATION':
      newState['text'] = '';
      newState['region'] = action.region;
      break;
    case 'TEXT_UPDATE':
      newState['text'] = action.text;
      break;
    case 'MARKER_POSITION':
      newState['markerPosition'] = action.markerPosition;
      break;
    case 'SELECTED_ID':
      newState['imageId'] = action.id;
      newState['selectedId'] = action.result;
      newState['region'] = action.region;
      newState['polygons'] = action.polygons;
      break;
    case 'TOGGLE_FILTER':
      newState['selectedId'] = false;
      newState['imageId'] = -1;
      break;
    case 'NEIGHBORHOODS_ALL':
      newState['dataNeighborhoods'] = action.neighborhoods;
      break;
    case 'MARKETS_ALL':
      newState['dataMarkets'] = action.markets;
      break;
    case 'SET_POLYGONS':
      newState['polygons'] = action.polygons;
      newState['region'] = action.region;
      break;
    case 'UN_KWON':
      newState['selectedId'] = false;
      newState['imageId'] = -1;
      break;
    case 'TOGGLE_ALL_NEIGHBORHOODS':
      newState['dataNeighborhoods'] = action.neighborhoods.map(x => ({
        ...x,
        completed: action.trueOrFalse
      }));
      break;
    case 'TOGGLE_NEIGHBORHOODS':
      if (action.id === 99) {
        let trueOrFalse = action.barrios[0].completed;
        newState['dataNeighborhoods'] = action.barrios.map(x => ({
          ...x,
          completed: !trueOrFalse
        }));
      } else {
        newState['dataNeighborhoods'] = action.barrios.map(x => {
          if (x.id !== action.id) {
            return x;
          }
          return {
            ...x,
            completed: !x.completed
          };
        });
        let maybe =
          newState['dataNeighborhoods'].filter(x => !x.completed).map(r => r)
            .length > 0;
        if (maybe) newState['dataNeighborhoods'][0].completed = false;
      }
      break;
    default:
      break;
  }
  return newState || state;
}
function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Filter':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Filtro' }),
        state
      );
      break;
    case 'Info':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Info' }),
        state
      );
      break;
    case 'Search':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Buscador' }),
        state
      );
      break;
    case 'Detalle':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Detalle' }),
        state
      );
      break;
    case 'Barrios':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Barrios' }),
        state
      );
      break;
    case 'Days':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Days' }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

const AppReducer = combineReducers({
  nav,
  maps,
  daysSelected,
  activitiFilter
});

export default AppReducer;
