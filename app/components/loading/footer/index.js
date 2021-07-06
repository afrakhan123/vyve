import React from 'react'

import {
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native'


import Style from 'app/styles/rocket'

const LoadingFooter = ({ full = true, bright = false }) => {
  return (
    <View style={[styles.container, !full ? styles.unfull : null, bright ? styles.bright : null]}>
      <ActivityIndicator size='small' color={bright ? Style.colours.dark : Style.colours.light} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Style.colours.dark
  },
  bright: {
    backgroundColor: Style.colours.yellow,
  },
  unfull: {
    marginHorizontal: 30,
    borderRadius: 100
  }
})

export default LoadingFooter 