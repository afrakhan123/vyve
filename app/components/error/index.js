import React from 'react'

import {
  View,
  StyleSheet,
  Text,
} from 'react-native'


import { textStyles } from 'app/styles/text'
import rocket from 'app/styles/rocket'

const ErrorView = ({ title, full = true }) => {
  return (
    <View style={[styles.container, !full ? styles.unfull : null]}>
      <Text style={textStyles.buttonTitle}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: rocket.colours.dark,
  },
  unfull: {
    marginHorizontal: 30,
    borderRadius: 100
  }
})

export default ErrorView