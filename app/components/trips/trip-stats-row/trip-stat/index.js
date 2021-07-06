import React from 'react'
import rocket from 'app/styles/rocket'

import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

const TripStatistic = ({ title, value }) => {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    ...rocket.text.body,
    ...rocket.text.grey
  },
  value: {
    ...rocket.text.title2,
    ...rocket.text.dark,
    fontSize: 18,
    lineHeight: 20,
  },
})

export default TripStatistic
