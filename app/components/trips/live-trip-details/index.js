import React from 'react'
import TripStatisticsRow from 'app/components/trips/trip-stats-row'
import _ from 'lodash'
import FooterButton from 'app/components/buttons/footer'
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'

import {
  View,
  StyleSheet,
} from 'react-native'

const LiveTripDetails = ({ distance, emissions, cost, onFinish }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <TripStatisticsRow distance={distance} emissions={emissions} cost={cost} />
      </View>
      <FooterButton onPress={onFinish} title='Finish' full={!isIphoneX()} bright={true} />
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    left: 0,
    right: 0,
    bottom: 0,
    marginTop: -40,
    ...ifIphoneX({
      marginBottom: 30,
    }),
  },
  inner: {
    marginTop: 24,
    marginBottom: 24,
    marginHorizontal: 22,
  },
})

export default LiveTripDetails