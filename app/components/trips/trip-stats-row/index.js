import React from 'react'
import colours from 'app/styles/colours'
import { metresToMiles } from 'app/utils/conversions'
import TripStatistic from './trip-stat'

import {
  StyleSheet,
  View,
} from 'react-native'


const TripStatisticsRow = ({ distance = 0, emissions = 0, cost = 0.00 }) => {
  return (
    <View style={styles.container}>
      <TripStatistic title='Miles' value={metresToMiles(distance).toFixed(1)} />
      <View style={styles.split} />
      <TripStatistic title='Emissions' value={emissions.toFixed(1) + 'kg'} />
      <View style={styles.split} />
      <TripStatistic title='Cost' value={'£' + cost} />
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 12,
  },
  split: {
    width: 0.5,
    height: 24,
    backgroundColor: colours.border,
  },
})

export default TripStatisticsRow