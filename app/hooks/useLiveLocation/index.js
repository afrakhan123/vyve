import _ from 'lodash'
import { useState, useEffect } from 'react'
import BackgroundGeolocation from "react-native-background-geolocation"
import { mapboxReverseGeocode } from 'app/utils/geocoding'

export const useLiveLocation = () => {
  const [coordinates, setCoordinates] = useState([])
  const [lastKnown, setLastKnown] = useState(null)

  const getLastKnown = async () => {
    BackgroundGeolocation.getCurrentPosition(
      {
        timeout: 30,          // 30 second timeout to fetch location
        maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
        desiredAccuracy: 1,  // Try to fetch a location with an accuracy of `10` meters.
        samples: 3,
      },
      onNewPosition,
      (error) => {
        console.log('Error getting current position :>>', error)
      }
    )
  }

  useEffect(() => {
    BackgroundGeolocation.onLocation(
      onNewPosition,
      () => { console.log('BG ERR :>>', location) })

    BackgroundGeolocation.ready({
      disableLocationAuthorizationAlert: true,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 1,
      stopTimeout: 20,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      showsBackgroundLocationIndicator: true,
    }, (state) => {
      getLastKnown()
    })

    return () => {
      stopLiveLocation()
    }
  }, [])


  const onNewPosition = async (info) => {
    const { latitude, longitude } = info.coords
    const coord = {
      latitude,
      longitude
    }
    setCoordinates(current => current.concat([coord]))


    if (!lastKnown) {
      await mapboxReverseGeocode(coord, setLastKnown)
    }
  }

  const startLiveLocation = () => {
    BackgroundGeolocation.start()
  }

  const stopLiveLocation = () => {
    BackgroundGeolocation.stop()
  }

  return [
    lastKnown,
    coordinates,
    startLiveLocation,
    stopLiveLocation]
}