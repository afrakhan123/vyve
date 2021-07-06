import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native'

import React from 'react'
import { textStyles } from 'app/styles/text'
import colours from 'app/styles/colours'
import moment from 'moment'
import { metresToMiles } from 'app/utils/conversions'
import { humanizeMinutes } from 'app/utils/formatters'
import { gramsToKg } from 'app/utils/conversions'
import { transportModeTypeFromName } from '../../../utils/emissions';
import {
  ICON_ONEWAY_GRAY, ICON_RETURN_GRAY
} from '../../../images/icons'

import Style from 'app/styles/rocket'

const TripDetails = ({ trip, showEmissions = true, showDuration = true }) => {
  return (
    <>
      <View style={styles.row}>
        <View style={styles.inner1}>
          <Text style={styles.summary}>
            <Text numberOfLines={1}>{trip.from_name} to </Text>
          </Text>

          <Text style={[styles.summary, { marginBottom: 8 }]}>
            <Text numberOfLines={1}>{trip.to_name}</Text>
          </Text>

          {/* <View style={[styles.row, { marginBottom: 4 }]}>
            <Text style={textStyles.h6}>{transportModeTypeFromName(trip.mode ? trip.mode.name : trip.transport_mode).name}</Text>
          </View> */}
          <View style={[styles.row, { marginBottom: 4 }]}>
            <Text style={textStyles.h6}>{moment(trip.created_at).format('ddd D MMM')}</Text>
            {trip.return_trip === 1 && <Image style={styles.icon} source={ICON_RETURN_GRAY} />}
          </View>
          <View style={[styles.row, { marginBottom: 8 }]}>
            <Text style={textStyles.h6}>{metresToMiles(trip.distance).toFixed(1) + 'mi'}</Text>
            {showDuration && <Text style={textStyles.h6}> ({humanizeMinutes(trip.duration)})</Text>}
          </View>
        </View>

        <View style={styles.inner2}>
          {showEmissions && <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[textStyles.h5, { marginBottom: 3 }]}>{gramsToKg(trip.emissions) + 'kg'}</Text>}
          {showEmissions && <Text style={textStyles.h6}>{'CO2e'}</Text>}
        </View>
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 232,
    borderBottomWidth: 0.5,
    borderColor: colours.border,
    paddingVertical: 24,

  },
  inner1: {
    flex: 2,
  },
  inner2: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 15,
  },
  row: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 56,
  },
  icon: {
    margin: 5,
    height: 10,
    width: 10,
  },
  contentContainer: {
    flex: 1,

  },
  summary: {
    ...Style.text.title3,
  },

  buttonIcon: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  }
})

export default TripDetails