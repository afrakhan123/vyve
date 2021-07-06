import React from 'react'

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { textStyles } from 'app/styles/text';

import { useNavigation } from 'react-navigation-hooks'
import Style from 'app/styles/rocket'

const CloseButton = ({ title = 'Close', onPress = (() => { }), lightBackground=false }) => {

  const { dismiss } = useNavigation()

  const onP = () => {
    dismiss()
    onPress()
  }

  return (
    <TouchableOpacity style={styles.button} onPress={onP}>
      <Text style={[Style.text.headerButton, { textAlign: 'center', color: lightBackground ? 'black' : Style.colours.light }]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 60,
    width: 80,
    justifyContent: 'center',
    top: 0,
    right: 0,
  }
})

export default CloseButton 