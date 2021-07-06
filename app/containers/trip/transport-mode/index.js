import React from 'react'

import { useNavigation, useNavigationParam } from 'react-navigation-hooks'

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Platform,
} from 'react-native'

import { flightMode, FlightClassEnum, airportDistance } from '../../../utils/emissions';
import Style from 'app/styles/rocket'
import Title from '../../../components/text/screen-title'
import { TransportModeEnum } from '../../../utils/emissions'
import { textStyles } from '../../../styles/text'
import { EVENT_TRIP_METHOD, EVENT_TRIP_SELECT_METHOD } from '../../../constants';
import { useStore } from '../../../store';
import { sortByTitle } from '../../../utils/formatters'
import {
  ICON_CAR,
  ICON_TRAIN,
  ICON_METRO,
  ICON_TRAM,
  ICON_BUS,
  ICON_PLANE,
  ICON_FERRY,
  ICON_CYCLE,
  ICON_MOTORCYCLE,
  ICON_WALKING
} from '../../../images/icons'

import FavouritesScreen from '../favourites'
import Mixpanel from 'react-native-mixpanel'


const TransportModeScreen = () => {
  const store = useStore()
  const { navigate } = useNavigation()


  const [viewFaves, setViewFaves] = React.useState(false)


  React.useEffect(() => {
    Mixpanel.track('Open Transport Mode Screen')
  }, [])



  const didSelectTravelMode = (mode) => {

    store.clearTrip() // If you go back and select a different transport mode, you're starting over


    switch (mode) {
      case TransportModeEnum.Flight:
        Mixpanel.trackWithProperties('Selected Transport Mode', { mode: 'Flight' })
        return navigate('Flight')
      case TransportModeEnum.Car:
        Mixpanel.trackWithProperties('Selected Transport Mode', { mode: 'Car' })
        return navigate('Car')
      default:
        Mixpanel.trackWithProperties('Selected Transport Mode', { mode: mode.name })
        store.setMode(mode)
        // return navigate(Platform.OS === 'ios' ? 'AddTrip' : 'Locations', { mode: mode })
      return navigate('AddTrip', { mode: mode })
    }
  }

  const available_modes = [
    { icon: ICON_CAR, title: 'Car', mode: TransportModeEnum.Car },
    { icon: ICON_PLANE, title: 'Flight', mode: TransportModeEnum.Flight },
    { icon: ICON_BUS, title: TransportModeEnum.Bus.name, mode: TransportModeEnum.Bus },
    { icon: ICON_TRAIN, title: 'Train', mode: TransportModeEnum.Train.NationalRail },
    { icon: ICON_METRO, title: 'Underground', mode: TransportModeEnum.Train.Underground },
    { icon: ICON_TRAM, title: TransportModeEnum.Train.Tram.name, mode: TransportModeEnum.Train.Tram },
    { icon: ICON_MOTORCYCLE, title: TransportModeEnum.Motorcycle.name, mode: TransportModeEnum.Motorcycle },
    { icon: ICON_WALKING, title: 'Walking', mode: TransportModeEnum.Walking },
    { icon: ICON_CYCLE, title: 'Cycling', mode: TransportModeEnum.Cycle },
    { icon: ICON_FERRY, title: TransportModeEnum.Ferry.name, mode: TransportModeEnum.Ferry },]

  const renderButtons = () => {
    return available_modes.map((mode, index) => {
      return (
        <TouchableOpacity key={index} style={styles.button} onPress={() => didSelectTravelMode(mode.mode)}>
          <Image resizeMode='contain'
            style={styles.icon} source={mode.icon} />
          <Text style={textStyles.h5}>{mode.title}</Text>
        </TouchableOpacity>
      )
    })
  }




  return (
    <>
      <Title title='Choose your transport type' />

      <View style={styles.tabNavigation}>
        <TouchableOpacity style={[styles.navButton, !viewFaves && { borderBottomColor: Style.colours.light }]}
          onPress={() => setViewFaves(false)}>
          <Text style={[Style.text.title3, !viewFaves ? Style.text.light : Style.text.grey]}>New Trip</Text>
        </TouchableOpacity>
        <View style={{ width: 1, backgroundColor: "white" }} />
        <TouchableOpacity style={[styles.navButton]}
          onPress={() => setViewFaves(true)}>
          <Text style={[Style.text.title3, viewFaves ? Style.text.light : Style.text.grey]}>Favourites</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {viewFaves ? <FavouritesScreen /> : renderButtons()}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  tabNavigation: {
    backgroundColor: Style.colours.dark,
    flexDirection: 'row',
  },
  navButton: {
    flex: 1, alignItems: "center", padding: 10
  },
  container: {
    flex: 1,
    marginHorizontal: 22,
  },
  inner: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  titleContainer: {
    width: '80%',
  },
  button: {
    borderBottomColor: "grey",
    borderBottomWidth: 0.3,
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 72,
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  buttonFave: {
    borderBottomColor: "grey",
    borderBottomWidth: 0.3,
    alignItems: 'center',
    padding: 15,
    height: 92,
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  icon: {
    height: 35,
    width: 35,
    marginRight: 15,
  },
})

export default TransportModeScreen 