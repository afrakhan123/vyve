import React, { useEffect, useState } from 'react'
import { textStyles } from 'app/styles/text'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import { SLOGAN, LANDING_BACKGROUND, LOGO_LANDING } from 'app/images/landing'
import rocket from 'app/styles/rocket'

import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Easing,
  Dimensions
} from 'react-native'

const width = Dimensions.get('window').width
const ratio = width / 1242


const LandingBackground = ({ onPress }) => {
  const [opacityAnimated] = useState(new Animated.Value(1))

  useEffect(() => {
    Animated.timing(
      opacityAnimated,
      { toValue: 0, duration: 1500, delay: 200, easing: Easing.in(Easing.cubic) }
    ).start()
  }, [])

  return (
    <ImageBackground source={LANDING_BACKGROUND} style={styles.backgroundContainer}>
      <Animated.View style={[styles.animation, { opacity: opacityAnimated }]} />
      <Image source={SLOGAN} style={styles.slogan} />
      <Image source={LOGO_LANDING} style={[styles.logo]} />
      <TouchableOpacity style={styles.learnButton} onPress={onPress}>
        <Text style={styles.learnText}>About</Text>
      </TouchableOpacity>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flexGrow: 0.9,
    width: '101%',
    resizeMode: 'contain',
  },
  animation: {
    flex: 1,
    backgroundColor: rocket.colours.dark,
  },
  learnButton: {
    position: 'absolute',
    justifyContent: 'center',
    height: 60,
    ...ifIphoneX({
      top: 30,
    }, {
      top: 16,
    }),
    right: 0,
  },
  learnText: {
    ...textStyles.headerButtonTitle,
    color: rocket.colours.light,
    fontSize: 14,
    fontWeight: rocket.weights.semibold,
    lineHeight: 15,
    textAlign: 'center',
    paddingRight: 26,
  },
  slogan: {
    width: width + 2,
    height: ratio * 405,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
  },
  logo: {
    width: width,
    height: 25,
    tintColor: rocket.colours.light,
    resizeMode: 'contain',
    position: 'absolute',
    ...ifIphoneX({
      top: 76,
    }, {
      top: 36,
    })
  },
})

export default LandingBackground 