import React from 'react'
import _ from 'lodash'
import LocationSearchResult from 'app/components/trips/location-search-result';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import { useApi } from 'app/api'
import { useGeocoding } from 'app/utils/geocoding'
import Geolocation from 'react-native-geolocation-service'
import Style from 'app/styles/rocket'
import Mixpanel from 'react-native-mixpanel'
import colours from 'app/styles/colours'
import { useStore } from 'app/store'
import { ICON_MARKER } from 'app/images/icons'


import {
  PermissionsAndroid,
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'

const SearchLocationScreen = () => {

  const [location, setLocation] = React.useState('')
  const [coords, setCoords] = React.useState({})
  const [results, setResults] = React.useState([])
  const [currentLocationInfo, setCurrentLocationInfo] = React.useState(null)
  const [nearbyAirports, setNearbyAirports] = React.useState([])
  const [hasLocationPermission, setHasLocationPermission] = React.useState(false)

  const api = useApi()
  const store = useStore()
  const { goBack } = useNavigation()

  const service = useGeocoding()
  const isOrigin = useNavigationParam('isOrigin')
  const isFlight = useNavigationParam('isFlight')

  React.useEffect(() => {
    Mixpanel.track('Open Location Search Screen')
  }, [])

  React.useEffect(() => {

    if (Platform.OS === 'ios' || hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          setCoords(position.coords)
        }
      );
    }
    else {
      requestLocationPermission()
    }
  }, [hasLocationPermission])

  React.useEffect(() => {
    const getNearbyAirports = async () => {
      const response = await api.nearbyAirports(coords.latitude, coords.longitude)
      const slice = response.data.slice(0, 3)
      if (slice) {
        setNearbyAirports(slice)
      }
    }

    if (isFlight) {
      getNearbyAirports()
    }
  }, [coords])


  React.useEffect(() => {
    const getCurrent = async () => {
      if (!_.isEmpty(coords)) {
        const res = await service.reverseGeocode({
          query: [coords.longitude, coords.latitude]
        }).send()
        const info = {
          title: 'Current',
          subtitle: res.body.features[0].place_name,
          coordinates: {
            longitude: coords.longitude,
            latitude: coords.latitude
          }
        }
        setCurrentLocationInfo(info)
      }
    }

    getCurrent()
  }, [coords])

  React.useEffect(() => {
    if (location == '') {
      setResults([])
    }
  }, [location])

  const searchMapBox = async (query) => {
    const params = {
      query: query
    }

    if (!_.isEmpty(coords)) {
      params.proximity = [coords.longitude, coords.latitude]
    }

    const response = await service.forwardGeocode(params).send()
    setResults(response.body.features.filter(r => r.relevance > 0.5))
  }

  const searchFlights = async (query) => {
    const response = await api.searchAirports(query)
    setResults(response.data)
  }

  //below might not be necessary on all devices but putting it in as a catch all
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "VYVE",
          message:
            "VYVE needs access to your location to determine your starting point",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      setHasLocationPermission(granted === PermissionsAndroid.RESULTS.GRANTED)
    } catch (err) {
      console.warn(err);
    }
  };

  /**
   * Get results when user types location into the input 
   */
  React.useEffect(() => {
    let debounced = _.debounce(() => {
      getResults(location)
    }, 250, {
      leading: false,
      trailing: true
    })

    async function getResults(location) {
      isFlight ? searchFlights(location) : searchMapBox(location)
    }

    if (location.length > 2) { debounced() }

    return () => {
      debounced.cancel()
    }
  }, [location])

  const onSelectCurrent = () => {
    const { subtitle, coordinates } = currentLocationInfo
    Mixpanel.trackWithProperties(isOrigin ? 'Selected Origin' : 'Selected Destination', { location: subtitle })
    isOrigin ? store.setOrigin(subtitle, coordinates) : store.setDestination(subtitle, coordinates)
    goBack()
  }

  const onSelectNearby = (airport) => {
    const name = airport.name
    const coordinates = {
      longitude: airport.geometry.coordinates[0],
      latitude: airport.geometry.coordinates[1]
    }
    Mixpanel.trackWithProperties(isOrigin ? 'Selected Origin' : 'Selected Destination', { name })
    isOrigin ? store.setOrigin(name, coordinates) : store.setDestination(name, coordinates)
    goBack()
  }

  const renderAirports = () => {
    return nearbyAirports.map((airport, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={[styles.rowContainer, { backgroundColor: 'white' }]}
          onPress={() => onSelectNearby(airport)}>
          <View style={{ flexDirection: 'row', paddingRight: 15, alignItems: 'center' }}>
            <Image
              resizeMode='contain'
              tintColor='red'
              source={ICON_MARKER}
              style={styles.icon} />
            <Text style={Style.text.caption}>{airport.name}</Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.inner} >
          <View style={styles.inputContainer}>
            <TextInput
              value={location}
              autoCorrect={false}
              autoCapitalize='words'
              autoFocus={true}
              clearButtonMode='while-editing'
              onChangeText={setLocation}
              placeholder={isFlight ? 'Search by place, airport or airport code' : 'Search for a place or address'}
              placeholderTextColor={Style.colours.titleGrey}
              style={styles.input} />
          </View>

          {/*TODO: Move this into its own component*/}
          {currentLocationInfo && !isFlight &&
            <TouchableOpacity
              style={[styles.rowContainer, { backgroundColor: 'white' }]}
              onPress={onSelectCurrent}>
              <View style={{ flexDirection: 'row', paddingRight: 15, alignItems: 'center' }}>
                <Image
                  resizeMode='contain'
                  tintColor='red'
                  source={ICON_MARKER}
                  style={styles.icon} />
                <Text style={Style.text.caption}>{currentLocationInfo.subtitle}</Text>
              </View>
            </TouchableOpacity>}

          {nearbyAirports && renderAirports()}

          <KeyboardAwareFlatList
            data={results}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            style={styles.results}
            renderItem={({ item }) => {
              const info = {
                title: isFlight ? item.name : item.text,
                subtitle: isFlight ? item.city + ', ' + item.country + ' (' + item.code + ')' : item.place_name,
                coordinates: {
                  longitude: item.geometry.coordinates[0],
                  latitude: item.geometry.coordinates[1]
                }
              }
              return <LocationSearchResult info={info} isOrigin={isOrigin} />
            }} />
        </View>
      </SafeAreaView >
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  input: {
    backgroundColor: Style.colours.lightSlate,
    paddingHorizontal: 15,
    height: 46,
    borderRadius: 8,
    fontSize: 17,
    marginBottom: 12,
    alignSelf: 'stretch',
    color: 'white',
  },
  inputContainer: {
    paddingTop: 16,
    paddingBottom: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    backgroundColor: Style.colours.navigationBar,
  },
  results: {
    flexGrow: 1,
  },
  nearby: {
    flex: 1,
    borderBottomWidth: 5,
  },
  rowContainer: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: colours.border,
  },
  icon: {
    height: 20,
    width: 20,
    marginRight: 12,
    tintColor: Style.colours.caption,
  },
})

export default SearchLocationScreen