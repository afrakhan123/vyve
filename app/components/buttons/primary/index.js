import React from 'react'

import {
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'

import rocket from 'app/styles/rocket'

const PrimaryButton = ({ title, onPress = () => { }, }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}>
      <Text adjustsFontSizeToFit={true} style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: rocket.colours.yellow,
    borderRadius: 12,
    margin: 5,
  },
  title: {
    color: rocket.colours.dark,
    fontWeight: rocket.weights.semibold,
    textAlign: 'center',
  }
})

export default PrimaryButton