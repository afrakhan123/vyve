import React from 'react'

import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'

import colours from 'app/styles/colours'
import { textStyles } from 'app/styles/text'
import Style from 'app/styles/rocket'

const FooterButton = ({ disabled = false, onPress, title, full = true, bright = false, activeOpacity = 0.2 }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[disabled ? [styles.buttonDisabled, styles.button] : [styles.buttonEnabled, styles.button, bright ? styles.buttonBright : null], !full ? styles.unfull : null]}>
      <Text style={[{ textAlign: 'center' }, textStyles.buttonTitle, bright ? Style.text.dark : null]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonEnabled: {
    backgroundColor: Style.colours.dark,
  },
  buttonDisabled: {
    backgroundColor: Style.colours.inactive,
  },
  unfull: {
    marginHorizontal: 30,
    borderRadius: 100
  },
  buttonBright: {
    backgroundColor: Style.colours.yellow,
  }
})

export default FooterButton 