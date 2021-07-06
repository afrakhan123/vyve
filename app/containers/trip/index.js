import React, { useRef, useState, useEffect, useReducer } from 'react'
import _ from 'lodash'
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps'
import { TEST_REGION } from 'app/utils/test-data'
import SegmentedControl from '@react-native-community/segmented-control'
import rocket from 'app/styles/rocket'
import FooterButton from 'app/components/buttons/footer'
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import Mixpanel from 'react-native-mixpanel'
import LocationSearch from 'app/components/location-search'
import { TripState, initialUIState, uiReducer, TripEnum } from 'app/constants/trip'
import RouteMap from 'app/components/route-map'
import PostTrip from 'app/containers/trip/post-trip'
import { useEmissionsCalculator } from 'app/utils/emissions'
import { useLiveEmissions } from 'app/hooks/useLiveEmissions'
import moment from 'moment'
import { mapboxReverseGeocode } from 'app/utils/geocoding'
import BackgroundGeolocation from "react-native-background-geolocation"
import LiveTripDetails from '../../components/trips/live-trip-details'
import { useNavigationParam } from 'react-navigation-hooks'

import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation,
  Alert,
  Linking,
} from 'react-native'

const TripScreen = () => {

  const mapRef = useRef()
  const [index, setIndex] = useState(0)
  const [tripType, setTripType] = useState(TripEnum.Live)
  const [tripState, dispatch] = useReducer(uiReducer, initialUIState)
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
  const [emissions, setEmissions] = useState(0)
  const [cost, setCost] = useState(0.00)
  const [fromLocation, setFromLocation] = useState(null)
  const [toLocation, setToLocation] = useState(null)
  const [distanceMultiple, setDistanceMultiple] = useState(1)
  const transportMode = useNavigationParam('mode')
  const [lastKnown, liveRouteCoords, start, stop, liveDistance, liveEmissions, liveCost] = useLiveEmissions(transportMode)
  const [liveStart, setLiveStart] = useState(null)
  const [liveDuration, setLiveDuration] = useState(0)
  const calculate = useEmissionsCalculator(transportMode)
  const [region, setRegion] = useState(TEST_REGION)
  const [isMapReady, setIsMapReady] = useState(false)

  LayoutAnimation.configureNext({
    duration: 200,
    create: {
      type: LayoutAnimation.Types.easeOut,
      property: LayoutAnimation.Properties.opacity,
    },
  })


  useEffect(() => {
    const [emissions, cost] = calculate(distance)

    setEmissions(emissions)
    setCost(cost)
  }, [distance])

  useEffect(() => {
    if (fromLocation && toLocation) { Keyboard.dismiss() }
  }, [fromLocation, toLocation])

  useEffect(() => {
    if (fromLocation) { Mixpanel.trackWithProperties('Selected Origin', { location: fromLocation.title }) }
  }, [fromLocation])

  useEffect(() => {
    if (toLocation) { Mixpanel.trackWithProperties('Selected Destination', { location: toLocation.title }) }
  }, [toLocation])


  useEffect(() => {
    if (isMapReady && region) {
      mapRef.current.animateToRegion(region, 250)
    }
  }, [region, isMapReady])


  useEffect(() => {


    console.log(' :>> Last Known', lastKnown)

    if (lastKnown) {
      const region = {
        latitude: lastKnown.coordinates.latitude,
        longitude: lastKnown.coordinates.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }

      setRegion(region)
    }
  }, [lastKnown])


  useEffect(() => {
    dispatch({ type: tripType.state })
  }, [tripType])

  useEffect(() => {
    setTripType(Object.values(TripEnum)[index])
  }, [index])

  useEffect(() => {
  }, [tripState])

  const startLiveTrip = () => {
    dispatch({ type: TripState.OnLive })
    start()
    setLiveStart(moment())
  }

  const showLocationAlert = () => {
    const settings = { text: "Settings", onPress: () => Linking.openSettings(), style: "cancel" }
    const cancel = { text: "Cancel", onPress: () => console.log("Cancel Pressed"), }
    return Alert.alert(
      "Enable Location Services",
      "You'll need to enable location services to start a live trip",
      [settings, cancel],
    )
  }

  const onPressStart = async () => {
    const locationAuthStatus = await BackgroundGeolocation.getProviderState()
    switch (locationAuthStatus.status) {
      case BackgroundGeolocation.AUTHORIZATION_STATUS_WHEN_IN_USE:
      case BackgroundGeolocation.AUTHORIZATION_STATUS_ALWAYS:
        return startLiveTrip()
      case BackgroundGeolocation.AUTHORIZATION_STATUS_NOT_DETERMINED:
        console.log('START :>> requesting permission')
        BackgroundGeolocation.requestPermission().then(() => {
          console.log('START :>> GOT PERMISSION')
          startLiveTrip()
        })
        break
      case BackgroundGeolocation.AUTHORIZATION_STATUS_DENIED:
      case BackgroundGeolocation.AUTHORIZATION_STATUS_RESTRICTED:
        console.log('START :>> Showing location alert')
        return showLocationAlert()
    }
  }

  const onPressCalculate = () => {
    dispatch({ type: TripState.Routing })
  }

  const onRouteReady = (distance, duration, coordinates) => {
    setDistance(distance * 1000 * distanceMultiple)
    setDuration(duration)
    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: {
        right: 64, left: 64, top: 64, bottom: 64,
      }, animated: true
    })
    dispatch({ type: TripState.Saving })
  }


  const onFinishLiveTrip = async () => {
    stop()
    setLiveDuration(moment().diff(liveStart, 'minutes'))
    mapRef.current.fitToCoordinates(liveRouteCoords, {
      edgePadding: {
        right: 64, left: 64, top: 124, bottom: 124,
      }, animated: true
    })

    const first = _.head(liveRouteCoords)
    const last = _.last(liveRouteCoords)

    await mapboxReverseGeocode(first, setFromLocation)
    await mapboxReverseGeocode(last, setToLocation)
    dispatch({ type: TripState.Saving })
  }

  const onMapReady = () => {
    setIsMapReady(true)
  }

  useEffect(() => {
  }, [liveRouteCoords])

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss()
    }}>
      <>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={styles.mapContainer}
          tracksViewChanges={false}
          onMapReady={onMapReady}
          initialRegion={region}>

          {tripState.showLiveRoute && !_.isEmpty(liveRouteCoords) &&
            <>
              <Marker
                anchor={{ x: 0.5, y: 0.5 }}
                coordinate={_.head(liveRouteCoords)}>
                <View style={styles.markerView} />
              </Marker>
              <Marker
                anchor={{ x: 0.5, y: 0.5 }}
                coordinate={_.head(liveRouteCoords)}>
                <View style={styles.markerOuterView} />
              </Marker>
              <Marker.Animated
                anchor={{ x: 0.5, y: 0.5 }}
                coordinate={_.last(liveRouteCoords)}>
                <View style={styles.markerView} />
              </Marker.Animated>
              <Marker.Animated
                anchor={{ x: 0.5, y: 0.5 }}
                coordinate={_.last(liveRouteCoords)}>
                <View style={styles.markerOuterView} />
              </Marker.Animated>
            </>
          }

          {tripState.showLiveRoute && !_.isEmpty(liveRouteCoords) &&
            <Polyline
              coordinates={liveRouteCoords}
              strokeColor='#000'
              strokeWidth={4}
              lineCap='round'
              geodesic={true}>
            </Polyline>
          }
          {tripState.showRoute &&
            <RouteMap
              origin={fromLocation}
              destination={toLocation}
              transportMode={transportMode}
              onReady={onRouteReady} />}
        </MapView>


        {tripState.showSegmentControl &&
          <SegmentedControl
            backgroundColor={rocket.colours.dark}
            tintColor={rocket.colours.light}
            activeTextColor={rocket.colours.dark}
            style={styles.segmentControl}
            values={Object.values(TripEnum).map(t => t.title)}
            selectedIndex={index}
            onChange={(event) => setIndex(event.nativeEvent.selectedSegmentIndex)} />}

        {tripState.showSearch &&

          <LocationSearch
            fromTitle={fromLocation ? fromLocation.title : ''}
            toTitle={toLocation ? toLocation.title : ''}
            setFrom={setFromLocation}
            setTo={setToLocation}
            current={lastKnown}
            setDistanceMultiple={setDistanceMultiple} />}

        {tripState.showFooterButton &&
          <View style={styles.buttonContainer}>
            <FooterButton
              bright={true}
              disabled={!(fromLocation && toLocation) && tripType === TripEnum.Log}
              activeOpacity={0.5}
              onPress={tripType === TripEnum.Live ? onPressStart : onPressCalculate}
              title={tripType.buttonTitle}
              full={!isIphoneX()} />
          </View>}


        {tripState.showLiveRoute && !tripState.saveTrip &&
          <LiveTripDetails
            distance={liveDistance}
            emissions={liveEmissions}
            cost={liveCost}
            onFinish={onFinishLiveTrip} />
        }


        {tripState.saveTrip &&
          <PostTrip
            transport={transportMode}
            from={fromLocation}
            to={toLocation}
            distance={index === 0 ? liveDistance : distance}
            duration={index === 0 ? liveDuration : duration}
            emissions={index === 0 ? liveEmissions : emissions}
            cost={index === 0 ? liveCost : cost}
            returnTrip={distanceMultiple === 2 ? 1 : 0} />}
      </>
    </TouchableWithoutFeedback >
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
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

  segmentControl: {
    position: 'absolute',
    ...ifIphoneX({
      top: 100,
    }, {
      top: 80,
    }),
    left: 42,
    right: 42,
    height: 37,
    fontWeight: rocket.weights.medium
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10.65,
    elevation: 7,
    ...ifIphoneX({
      bottom: 30,
    }, {
      bottom: 0,
    })
  },
})

export default TripScreen