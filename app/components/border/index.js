import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

import colours from 'app/styles/colours'

const Border = () => {
  return <View style={styles.border} />
}

const styles = StyleSheet.create({
  border: {
    height: 0.5,
    backgroundColor: colours.border,
    width: '100%'
  },
})

export default Border 