import React, { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { SafeAreaView, StackActions } from 'react-navigation'
import ConfettiCannon from 'react-native-confetti-cannon';
import { GOOGLE_API_KEY } from 'app/constants';
import LoadingFooter from 'app/components/loading/footer'
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper'
import { TEST_REGION } from 'app/utils/test-data'
import { useEmissionsCalculator } from 'app/utils/emissions'
import { useStore } from 'app/store'
import TripDetailsAdded from 'app/components/trips/trip-details-added'
import { tripToJSON } from 'app/utils/formatters'
import { airportDistance } from 'app/utils/emissions'
import FooterButton from 'app/components/buttons/footer'
import Style from 'app/styles/rocket'
import { fontWeights } from 'app/styles/text'
import Mixpanel from 'react-native-mixpanel'
import { saveTrip } from 'app/api'
import { useApi } from '../../../api'
import {
  ICON_HEART_EMPTY, ICON_HEART_FILLED
} from '../../../images/icons'

import {
  View,
  Text,
  StyleSheet, TouchableOpacity, Image, Modal
} from 'react-native'


const TripConfirmationScreen = () => {
  const store = useStore()
  const { navigate, goBack, dispatch } = useNavigation()
  const mapRef = useRef()
  const api = useApi()

  //TODO: Too much state here, break this all up
  const trip = store.state.newTrip
  const transportMode = trip.mode
  const calculate = !_.isEmpty(trip) ? useEmissionsCalculator(trip.mode ? trip.mode : trip.transport_mode) : null
  const region = TEST_REGION
  const isFlight = useNavigationParam('isFlight')

  const [duration, setDuration] = useState(0)
  const [distance, setDistance] = useState(0)
  const [CO2e, setCO2e] = useState(null)
  const [cost, setCost] = useState(0.00)

  const [response, setResponse] = useState(null)
  const [tripJson, setTripJson] = useState(tripToJSON(trip))
  const [status, setStatus] = useState('Saving your trip...')
  const [saveError, setSaveError] = useState(null)
  const [loading, setLoading] = useState(true)

  const [originMarker, setOriginMarker] = useState(trip.origin.coordinates)
  const [destinationMarker, setDestinationMarker] = useState(trip.destination.coordinates)
  const [fave, setFave] = useState(false)
  const [congratsModalVisible, setCongratsModalVisible] = useState(false);

  useEffect(() => { Mixpanel.trackWithProperties('Open Trip Added Screen', { ...trip.destination, ...trip.mode, ...trip.origin }) }, [])

  useEffect(() => {
    if (loading) { setStatus('Saving your trip...') }
  }, [loading])

  useEffect(() => {
    if (saveError) { setStatus('Unable to save trip') }
  }, [saveError])

  useEffect(() => {
    if (response) {
      setStatus('Added to your trips')
      setTimeout(() => { setCongratsModalVisible(true) }, 3000)
    }
  }, [response])

  useEffect(() => {
    if (isFlight) { setDistance(airportDistance(trip.origin.coordinates, trip.destination.coordinates)) }
  }, [isFlight])

  useEffect(() => {
    if (calculate && (distance > 0)) {
      const [CO2, cost] = calculate(distance)
      setCO2e(CO2)
      setCost(cost)
      const emissions = CO2 * 1000
      setTripJson(tripToJSON(trip, distance, duration, emissions))
    }
  }, [distance])

  useEffect(() => {
    const emissions = CO2e * 1000

    const save = async () => {
      await saveTrip(
        trip,
        distance,
        duration,
        emissions,
        setSaveError,
        setResponse,
        setLoading)
    }
    if (CO2e !== null && distance > 0) {
      save()
    }
  }, [CO2e])


  const onMapReady = ({ distance, duration, coordinates }) => {
    setDistance(distance * 1000)
    setDuration(duration)
    setOriginMarker(coordinates[0])
    setDestinationMarker(coordinates[coordinates.length - 1])
    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: {
        right: 64, bottom: 164, left: 64, top: 124,
      }, animated: true
    })
  }

  const onPressOffsetNow = () => {
    if (response) {
      store.checkout(response)
      navigate('Projects', { next: 'Checkout' })
    }
    Mixpanel.trackWithProperties('Pressed Offset', { ...response.data, cost: cost })
  }


  const mapViewReady = () => {
    if (isFlight) {
      mapRef.current.fitToCoordinates([trip.origin.coordinates, trip.destination.coordinates], {
        edgePadding: {
          right: 64, bottom: 164, left: 64, top: 124,
        }, animated: true
      })
    }
  }

  const renderFooter = () => {
    const isBright = response != null
    const onPress = saveError ? () => goBack() : onPressOffsetNow
    const title = saveError ? 'Try Again' : '£' + cost.toFixed(2) + ' to VYVE your trip'
    return (response || saveError) ?
      <FooterButton
        bright={isBright}
        icon={true}
        onPress={onPress}
        title={title}
        full={!isIphoneX()} /> :
      <LoadingFooter full={!isIphoneX()} />
  }

  const onAddFave = async () => {
    const response = await api.createFave(trip)
    if (response) {
      setFave(true)
    }
  }

  return (
    <SafeAreaView forceInset={{ top: 'never', bottom: 'never' }} style={styles.container}>
      <View style={styles.mapContainer}>
        {!_.isEmpty(trip) &&
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={styles.mapContainer}
            tracksViewChanges={false}
            onMapReady={mapViewReady}
            initialRegion={region}>
            {!isFlight &&
              <MapViewDirections
                origin={trip.origin.coordinates}
                destination={trip.destination.coordinates}
                apikey={GOOGLE_API_KEY}
                mode={transportMode.mapsMode}
                onReady={onMapReady}
                lineJoin='round'
                strokeWidth={4} />}
            {isFlight && <>
              <Polyline
                coordinates={[trip.origin.coordinates, trip.destination.coordinates]}
                strokeColor='#000'
                strokeWidth={4}
                lineCap='round'
                geodesic={true} />
            </>}
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
          </MapView>}
      </View>

      <View style={styles.content}>
        <View style={styles.inner}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[Style.text.title1, { fontWeight: fontWeights.semibold, marginBottom: 12 }]}>{status}</Text>
            <TouchableOpacity
              disabled={fave}
              onPress={onAddFave}>
              <Image resizeMode='contain'
                style={styles.icon} source={fave ? ICON_HEART_FILLED : ICON_HEART_EMPTY} />
            </TouchableOpacity>
          </View>
          <TripDetailsAdded trip={JSON.parse(tripJson)} cost={cost} />
        </View>
        <View style={styles.footer}>
          {cost ? renderFooter() : null}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={congratsModalVisible}
        onRequestClose={() => {
          setCongratsModalVisible(false)
        }}
      >
        <View style={styles.modalContainer}>
          <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
          <View style={{ alignItems: 'center', borderRadius: 10, backgroundColor: Style.colours.dark, height: 275 }} >
            <Text style={{ color: Style.colours.yellow, padding: 15, fontSize: 24, textAlign: 'center' }}>CONGRATULATIONS</Text>
            <Text style={{ paddingHorizontal: 15, padding: 5, color: 'white', fontSize: 18, textAlign: 'center' }}>You just took another step to understanding your impact. Add another trip to keep tracking.</Text>
            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Style.colours.yellow, width: 280, height: 50, borderRadius: 25, margin: 20 }}
              onPress={() => {
                setCongratsModalVisible(false)
                dispatch(StackActions.popToTop())
              }}
            >
              <Text style={{ color: 'black' }}>Add another trip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Style.colours.dark, height: 35, width: 100 }}
              onPress={() => {
                setCongratsModalVisible(false)
              }}
            >
              <Text style={{ color: 'white' }}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 30
  },
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
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  content: {
    flex: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    left: 0,
    right: 0,
    bottom: 0,
    marginTop: -40,
  },
  footer: {
    ...ifIphoneX({
      marginBottom: 30,
    }, {
      marginBottom: 0,
    })
  },
  inner: {
    marginTop: 24,
    marginBottom: 24,
    marginHorizontal: 22,
  },
  places: {
    marginTop: 25,
  },
  info: {
    marginTop: 15,
  },
  calculation: {
    marginTop: 5,
  },
  cost: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  icon: {
    height: 28,
    width: 28,
    marginTop: -5
  }
})

export default TripConfirmationScreen 
