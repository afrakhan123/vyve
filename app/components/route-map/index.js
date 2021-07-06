import React, { useState, } from 'react'
import _ from 'lodash'
import { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_API_KEY } from 'app/constants'

import {
  View,
  StyleSheet,
} from 'react-native'


const RouteMap = ({
  origin,
  destination,
  transportMode,
  onReady,
}) => {

  const [originMarker, setOriginMarker] = useState(null)
  const [destinationMarker, setDestinationMarker] = useState(null)

  const onMapReady = ({ distance, duration, coordinates }) => {
    setOriginMarker(coordinates[0])
    setDestinationMarker(coordinates[coordinates.length - 1])
    onReady(distance, duration, coordinates)
  }

  return (
    <>
      <MapViewDirections
        origin={origin.coordinates}
        destination={destination.coordinates}
        apikey={GOOGLE_API_KEY}
        mode={transportMode.mapsMode}
        onReady={onMapReady}
        lineJoin='round'
        strokeWidth={4} />
      {originMarker && destinationMarker &&
        <>
          <Marker
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={originMarker}>
            <View style={styles.markerView} />
          </Marker>
          <Marker
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={originMarker}>
            <View style={styles.markerOuterView} />
          </Marker>
          <Marker
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={destinationMarker}>
            <View style={styles.markerView} />
          </Marker>
          <Marker
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={destinationMarker}>
            <View style={styles.markerOuterView} />
          </Marker>
        </>}
    </>
  )
}

const styles = StyleSheet.create({
  markerView: {
    height: 8,
    width: 8,
    borderRadius: 100,
    backgroundColor: 'black',
  },
  markerOuterView: {
    height: 22,
    width: 22,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
})

export default RouteMap