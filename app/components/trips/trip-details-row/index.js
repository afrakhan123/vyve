import React from 'react'
import rocket from 'app/styles/rocket'
import { iconForTransportMode } from 'app/utils/formatters'

import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native'

const TripDetailsRow = ({ transport, from, to, }) => {
  return (
    < View style={styles.row}>
      <View style={{ flex: 2, marginRight: 64, }}>
        <Text style={[rocket.text.title3]} numberOfLines={2}>To {to ? to.title : 'No to'}</Text>
        <Text style={[rocket.text.body]} numberOfLines={2}>From {from ? from.title : 'No From'}</Text>
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={iconForTransportMode(transport)} />
        </View>
        <Text style={[rocket.text.captionSmall, { fontSize: 12, }]}>{transport.name}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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

export default TripDetailsRow