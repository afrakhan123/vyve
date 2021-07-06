import React from 'react'
import { FB, GOOGLE, APPLE } from 'app/images/landing'
import { COGNITO_SOCIAL_PROVIDER } from 'app/constants'

import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'


export const SocialProvider = ({ icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image resizeMode='contain' source={icon} style={styles.socialIcon} />
    </TouchableOpacity>
  )
}

const SocialSignIn = ({ facebook, google, apple, onPressProvider }) => {
  return (
    <View style={styles.socialContainer}>
      {facebook && <SocialProvider icon={FB} onPress={() => onPressProvider(COGNITO_SOCIAL_PROVIDER.FACEBOOK)} />}
      {google && <SocialProvider icon={GOOGLE} onPress={() => onPressProvider(COGNITO_SOCIAL_PROVIDER.GOOGLE)} />}
      {apple && <SocialProvider icon={APPLE} onPress={() => onPressProvider(COGNITO_SOCIAL_PROVIDER.APPLE)} />}
    </View>
  )
}

const styles = StyleSheet.create({
  socialContainer: {
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialIcon: {
    width: 48,
    height: 48
  },
})

export default SocialSignIn