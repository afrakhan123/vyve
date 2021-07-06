import React from 'react'
import rocket from 'app/styles/rocket'

import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native'

const OnboardingCard = ({ item }) => {
  return (
    <>
      <View style={[styles.container]}>
        <View style={styles.card}>
          <Image source={item.image} style={{ flexShrink: 1, resizeMode: 'contain' }} />
          <Text style={[rocket.text.body, { marginHorizontal: '20%', marginTop: 20, fontWeight: rocket.weights.medium, textAlign: 'center' }]}>{item.description}</Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  card: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '20%',
    resizeMode: 'contain',
    backgroundColor: 'red',
  },
})

export default OnboardingCard