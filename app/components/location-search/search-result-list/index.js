import React from 'react'
import _ from 'lodash'
import TripSearchResult from 'app/components/trips/trip-search-result'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

import {
  StyleSheet,
} from 'react-native'

const LocationResultList = ({ results, onSelect }) => {
  return (
    <KeyboardAwareFlatList
      data={results}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.id.toString()}
      style={styles.results}
      renderItem={({ item }) => {
        const info = {
          title: item.text,
          subtitle: item.place_name,
          coordinates: {
            longitude: item.geometry.coordinates[0],
            latitude: item.geometry.coordinates[1]
          }
        }
        return <TripSearchResult info={info} setLocation={onSelect} />
      }} />
  )
}

const styles = StyleSheet.create({
  results: {
    flexGrow: 1,
  },
})

export default LocationResultList