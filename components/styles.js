import { StyleSheet } from 'react-native';
//////////ESTILOS/////////////
export default StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  dayOpen: {
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 4,
    borderRadius: 50,
    width: 45,
    height: 21
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

////////////////////////////////////
