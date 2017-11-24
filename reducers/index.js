import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators';

const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const initialNavState = AppNavigator.router.getStateForAction(firstAction);

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
  filterActive: false
};
const diadelasemana = [
  { name: 'Todos los días', completed: false, id: 0 },
  { name: 'Domingo', completed: false, id: 1 },
  { name: 'Lunes', completed: false, id: 2 },
  { name: 'Martes', completed: false, id: 3 },
  { name: 'Miercoles', completed: false, id: 4 },
  { name: 'Jueves', completed: false, id: 5 },
  { name: 'Viernes', completed: false, id: 6 },
  { name: 'Sábado', completed: false, id: 7 }
];
function daysSelected(state = diadelasemana, action) {
  switch (action.type) {
    case 'TOGGLE_DAY':
      if (action.id === 0) {
        let trueOrFalse = state[0].completed;
        return state.map(x => ({ ...x, completed: !trueOrFalse }));
      }
      return state.map(x => {
        if (x.id !== action.id) {
          return x;
        }
        return {
          ...x,
          completed: !x.completed
        };
      });
    case 'ALL_DAYS_FALSE':
      return state.map(x => ({ ...x, completed: false }));
    default:
      return state;
  }
}

function maps(state = initialState, action) {
  let newState = { ...state };
  switch (action.type) {
    case 'SELECTED_LOCATION':
    case 'MOVE_TO_LOCATION':
      const { region } = action;
      newState['text'] = '';
      newState['region'] = region;
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
    case 'FILTER_ACTIVE_OR_NOT':
      newState['filterActive'] = action.filterActive;
      break;
    case 'TOGGLE_ALL_NEIGHBORHOODS':
      newState['dataNeighborhoods'] = action.neighborhoods.map(x => ({
        ...x,
        completed: action.trueOrFalse
      }));
      break;
    case 'TOGGLE_NEIGHBORHOODS':
      newState['dataNeighborhoods'] = action.neighborhoods.map(x => {
        if (x.id !== action.id) {
          return x;
        }
        return {
          ...x,
          completed: !x.completed
        };
      });
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
  daysSelected
});

export default AppReducer;
