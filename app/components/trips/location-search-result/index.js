import React from 'react'

import { useGeocoding } from 'app/utils/geocoding'
import { textStyles } from 'app/styles/text'

import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  TextInput,
  InputAccessoryView,
  TouchableHighlight
} from 'react-native'

import _ from 'lodash'
import { FlatList } from 'react-native-gesture-handler';
import colours from 'app/styles/colours'
import { useNavigation } from 'react-navigation-hooks'
import { useStore } from '../../../store'

import Mixpanel from 'react-native-mixpanel'

const LocationSearchResult = ({ info, isOrigin }) => {

  const store = useStore()
  const { goBack } = useNavigation()

  const selectLocation = () => {
    Mixpanel.trackWithProperties(isOrigin ? 'Selected Origin' : 'Selected Destination', { location: info.title })
    isOrigin ? store.setOrigin(info.title, info.coordinates) : store.setDestination(info.title, info.coordinates)
    goBack()
  }

  return (
    <TouchableHighlight
      underlayColor='#e0e0e0'
      onPress={selectLocation}>
      <View style={styles.rowContainer}>
        <Text style={[textStyles.h3, { marginBottom: 5, }]}>{info.title}</Text>
        <Text style={textStyles.h6}>{info.subtitle}</Text>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: colours.border,
  }
})

export default LocationSearchResult