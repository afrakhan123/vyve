import {
  StyleSheet,
  Text,
  View, Image
} from 'react-native'

import React from 'react'

import colours from 'app/styles/colours'
import { metresToMiles } from 'app/utils/conversions'
import { transportModeTypeFromName } from '../../../utils/emissions';
import { iconForTransportMode } from '../../../utils/formatters';
import Style from 'app/styles/rocket'
import Border from 'app/components/border'

const TripDetailsAdded = ({ trip, cost }) => {
  return (
    <>
      <View style={styles.row}>
        <View style={{ flex: 2, marginRight: 64, }}>
          <Text style={[Style.text.title3]} numberOfLines={2}>To {trip.to_name}</Text>
          <Text style={[Style.text.body]} numberOfLines={2}>From {trip.from_name}</Text>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.iconContainer}>
            <Image style={styles.icon} source={iconForTransportMode(trip.transport_mode)} />
          </View>
          <Text style={[Style.text.captionSmall, { fontSize: 12, }]}>{transportModeTypeFromName(trip.mode ? trip.mode.name : trip.transport_mode).name}</Text>
        </View>
      </View>

      <Border />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginHorizontal: 12, }}>
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={[Style.text.title2, Style.text.dark, { fontSize: 18, lineHeight: 20, }]}>{metresToMiles(trip.distance).toFixed(1)}</Text>
          <Text style={[Style.text.body, Style.text.grey]}>Miles</Text>
        </View>
        <View style={styles.split} />
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={[Style.text.title2, Style.text.dark, { fontSize: 18, lineHeight: 20, }]}>{(trip.emissions / 1000).toFixed(1) + 'kg'}</Text>
          <Text style={[Style.text.body, Style.text.grey]}>Emissions</Text>
        </View>
        <View style={styles.split} />
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={[Style.text.title2, Style.text.dark, { fontSize: 18, lineHeight: 20, }]}>{'£' + cost}</Text>
          <Text style={[Style.text.body, Style.text.grey]}>Cost</Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  split: {
    width: 0.5,
    height: 24,
    backgroundColor: colours.border,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 36,
    width: 36,
    resizeMode: 'contain',
  },
})

export default TripDetailsAdded