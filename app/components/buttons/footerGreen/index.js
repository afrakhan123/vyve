import React from 'react'

import {
  TouchableOpacity,
  Text,
  StyleSheet, Image
} from 'react-native'

import colours from 'app/styles/colours'
import { textStyles } from 'app/styles/text'
import { ICON_OFFSET, ICON_CHECKMARK } from 'app/images/icons'

const FooterGreenButton = ({ icon , disabled=false, onPress, title, full=true }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[disabled ? [styles.buttonDisabled, styles.button] : [styles.buttonEnabled, styles.button, ], !full ? styles.unfull : null ]}>
      <Text style={textStyles.buttonTitleSmall}>{title}</Text>
      {icon && <Image style={styles.buttonIcon} source={ ICON_OFFSET } />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: "center",
    height: 60,
    width: 350,


    borderRadius: 40,
  },
  buttonEnabled: {
    backgroundColor: '#e9ff5f'
  },
  buttonDisabled: {
    backgroundColor: colours.inactive,
  },
  unfull: {
    marginHorizontal: 30, 
    borderRadius: 8 
  },
  buttonIcon: {
    marginLeft: 35,
    height: 15,
    width: 15,
    resizeMode: 'contain',
  }
})

export default FooterGreenButton 