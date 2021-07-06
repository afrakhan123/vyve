import React from 'react'

import {
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'

import rocket from 'app/styles/rocket'

const SecondaryButton = ({ title, onPress = () => { }, }) => {
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
    backgroundColor: '#f4f5f7',
    borderRadius: 12,
    margin: 5,
    paddingHorizontal: 8,

  },
  title: {
    color: rocket.colours.lightSlate,
    fontWeight: rocket.weights.medium,
    textAlign: 'center',
  }
})

export default SecondaryButton