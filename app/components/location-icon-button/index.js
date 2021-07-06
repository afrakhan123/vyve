import React from 'react'
import { ICON_MARKER } from 'app/images/icons'
import rocket from 'app/styles/rocket'

import {
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native'

//TODO: Take onPress as argument
const LocationIconButton = ({ onPressIcon }) => {



  return (
    <TouchableOpacity
      onPress={onPressIcon}
      style={styles.button}>
      <Image
        resizeMode='contain'
        source={ICON_MARKER}
        style={styles.icon} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: '100%',
    justifyContent: 'center'
  },
  icon: {
    height: 16,
    width: 16,
    marginRight: 12,
    marginLeft: 5,
    tintColor: rocket.colours.link,
  }
})

export default LocationIconButton