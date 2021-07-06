import React from 'react'
import { LANDING_TERMS } from 'app/constants/landing'
import { textStyles, fontWeights } from 'app/styles/text'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Mixpanel from 'react-native-mixpanel'
import rocket from 'app/styles/rocket'
import InAppBrowser from 'react-native-inappbrowser-reborn'

import {
  Text,
  StyleSheet,
  Linking,
} from 'react-native'


const Terms = () => {

  const openURL = async (url) => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url)
    } else {
      Linking.openURL(url)
        .catch((err) => console.error('An error occurred', err))
    }
  }

  const onPressTerms = () => {
    Mixpanel.track("Opened Terms")
    openURL('https://vyvenow.com/terms')
  }

  const onPressPrivacy = () => {
    Mixpanel.track("Opened Privacy Policy")
    openURL('https://vyvenow.com/privacy-statement')
  }

  return (
    <Text style={styles.termsContainer}>
      <Text style={styles.termsText} >{LANDING_TERMS}</Text>
      <Text style={styles.termsLink} onPress={onPressTerms} >Terms</Text>
      <Text style={styles.termsText} > and </Text>
      <Text style={styles.termsLink} onPress={onPressPrivacy} >Privacy Policy</Text>
    </Text>
  )
}

const styles = StyleSheet.create({
  termsContainer: {
    position: 'absolute',
    textAlign: 'center',
    ...ifIphoneX({
      bottom: 42,
    }, {
      bottom: 20,
    })
  },
  termsText: {
    ...textStyles.caption,
    fontSize: 13,
    fontWeight: fontWeights.regular,
    color: '#A7B4BC',
    textAlign: 'center',
    letterSpacing: 0,
  },
  termsLink: {
    ...textStyles.caption,
    fontWeight: fontWeights.medium,
    fontSize: 13,
    color: rocket.colours.link,
    textAlign: 'center',
    letterSpacing: 0,
  },
})

export default Terms 