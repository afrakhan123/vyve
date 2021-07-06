import React from 'react'


import { useNavigation } from 'react-navigation-hooks'
import { SafeAreaView } from 'react-navigation';
import { EVENT_TRIP_START, EVENT_TRIP_STARTNEXT } from '../../../constants';
import { textStyles } from 'app/styles/text'

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Switch
} from 'react-native'

import _ from 'lodash'

import Title from 'app/components/text/screen-title'
import { useStore } from '../../../store';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import FooterButton from 'app/components/buttons/footer'
import { flightMode, FlightClassEnum, airportDistance } from '../../../utils/emissions';
const width = Dimensions.get('window').width

import Mixpanel from 'react-native-mixpanel'

const FlightDetailsScreen = () => {

  const store = useStore()
  const { navigate } = useNavigation()

  const [businessClass, setBusinessClass] = React.useState(false)

  const onPressNext = () => {
    Mixpanel.trackWithProperties('Calculated Flight', { origin: store.state.newTrip.origin.location, destination: store.state.newTrip.destination.location, mode: store.state.newTrip.mode.api_name })
    navigate('Confirm', { isFlight: true })
  }

  React.useEffect(() => {
    Mixpanel.track('Open Flight Details Screen')
  }, [])


  React.useEffect(() => {
    if (!_.isEmpty(store.state.newTrip.origin) && !_.isEmpty(store.state.newTrip.destination)) {
      const trip = store.state.newTrip
      const dist = airportDistance(trip.origin.coordinates, trip.destination.coordinates)
      const mode = flightMode(dist, businessClass ? FlightClassEnum.Business : FlightClassEnum.Economy)
      store.setMode(mode)
    }

  }, [store.state.newTrip.origin, store.state.newTrip.destination, businessClass])

  /**
   * Origin is boolean flag that tells the search
   * screen whether the user is entering a value for the origin field 
   */
  const onPressButton = (origin) => {
    navigate('Search', { isOrigin: origin, isFlight: true })
  }

  return (
    <>

      <Title title={'Add your flight details'} />
      <View style={styles.inputContainer}>

        {/* TODO: Extract into component */}
        <TouchableOpacity onPress={() => onPressButton(true)}>
          <View style={styles.input}>
            <Text style={[textStyles.h6, { marginRight: 8 }]}>From</Text>
            <Text
              numberOfLines={1}
              style={[textStyles.h4, { paddingRight: 36 }]}>
              {store.state.newTrip.origin ? store.state.newTrip.origin.location : ''}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressButton(false)}>
          <View style={styles.input}>
            <Text style={[textStyles.h6, { marginRight: 8 }]}>To</Text>
            <Text
              numberOfLines={1}
              style={[textStyles.h4, { paddingRight: 20 }]}>
              {store.state.newTrip.destination ? store.state.newTrip.destination.location : ''}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <Text adjustsFontSizeToFit={true} style={[textStyles.headerButtonTitle, { maxWidth: width * 0.75 }]}>Business Class</Text>
          <Switch style={{ marginLeft: 5 }} value={businessClass} onValueChange={setBusinessClass} />
        </View>
      </View>


      <View style={styles.buttonContainer}>
        <FooterButton
          bright={true}
          disabled={!(store.state.newTrip.origin && store.state.newTrip.destination)}
          onPress={onPressNext}
          title='Calculate'
          full={!isIphoneX()} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginHorizontal: 22,
    marginTop: 16,
  },
  input: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 46,
    borderRadius: 8,
    fontSize: 17,
    marginBottom: 16,
    alignSelf: 'stretch',
    color: 'black'
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'flex-end',
    left: 0,
    right: 0,
    ...ifIphoneX({
      bottom: 30,
    }, {
      bottom: 0,
    })
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginHorizontal: 4,
  }
})

export default FlightDetailsScreen