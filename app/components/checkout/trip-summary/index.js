import React from 'react'

import {
  View,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native'

let width = Dimensions.get('window').width

import TripDetails from 'app/components/trips/trip-details'
import { iconForTransportMode } from '../../../utils/formatters';
import { isFlight } from '../../../utils/emissions';

const TripSummary = ({ trip }) => {


  return (
    <View style={[styles.row, styles.tripSummary]}>
      <View style={styles.contentContainer}>
        <TripDetails trip={trip} showEmissions={false} showDuration={!isFlight(trip)} />
      </View>
      <View style={styles.summaryIcon}>
        {trip.transport_mode && <Image style={styles.icon} source={iconForTransportMode(trip.transport_mode, true)} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
    marginVertical: 20,
  },
  tripSummary: {
    marginRight: 28,
  },
  summaryIcon: {
    height: width / 4,
    width: width / 5,

    borderRadius: 12,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width / 18,
  },
  icon: {
    flex: 1,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
  }
})

export default TripSummary