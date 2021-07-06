import React, { useRef, useState, useEffect, } from 'react'
import _ from 'lodash'
import { mapboxForwardGeocode } from 'app/utils/geocoding'
import LocationSearchBar from 'app/components/location-search/search-bar'
import LocationResultList from 'app/components/location-search/search-result-list'
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import Style from 'app/styles/rocket'
import {
  ICON_ONEWAY, ICON_RETURN
} from './../../images/icons'
import Mixpanel from 'react-native-mixpanel'
import {
  View, Text, Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

const LocationSearch = ({ setFrom, setTo, current, fromTitle, toTitle, setDistanceMultiple }) => {
  const Field = Object.freeze({
    From: 'From',
    To: 'To'
  })

  const search = _.debounce((query, setResult) => {
    mapboxForwardGeocode(query, setResult, current ? current.coordinates : [])
  }, 250, { leading: false, trailing: true })

  const fromSearchBarRef = useRef()
  const toSearchBarRef = useRef()
  const [field, setField] = useState(null)
  const [query, setQuery] = useState('')
  const [result, setResult] = useState([])
  const [view, setView] = React.useState('One Way')

  useEffect(() => {
    if (query.length > 2) {
      if ((field == Field.From && query != fromTitle) || (field == Field.To && query != toTitle)) {
        search(query, setResult)
      }
    }
    return () => { search.cancel() }
  }, [query])

  useEffect(() => {
    if (query.length <= 2) { setResult([]) }
    return () => { search.cancel() }
  }, [query])

  const onFocusFrom = () => {
    setField(Field.From)
    setQuery(fromTitle ? fromTitle : '')
    setResult([])
  }

  const onFocusTo = () => {
    setField(Field.To)
    setQuery(toTitle ? toTitle : '')
    setResult([])
  }

  const onSelectCurrentLocation = () => {
    onSelectLocation(current)
  }

  const onSelectLocation = (location) => {
    setResult([])
    if (field === Field.From) {
      setFrom(location)
      toSearchBarRef.current.focus()
    } else {
      setTo(location)
      if (fromTitle == '') {
        fromSearchBarRef.current.focus()
      }
    }
  }

  const onBlurSearchBar = () => { setField(null) }

  const ViewEnum = Object.freeze({
    oneWay: 'One Way',
    return: 'Return'
  })

  return (
    <View style={styles.searchContainer}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TouchableOpacity style={[styles.tripType, { borderBottomColor: view === ViewEnum.oneWay ? Style.colours.dark : 'white' }]}
          onPress={() => {
            setView(ViewEnum.oneWay)
            setDistanceMultiple(1)
          }}
        >
          <Image resizeMode='contain'
            style={styles.icon} source={ICON_ONEWAY} />

          <Text style={[{ textAlign: "center", fontSize: 14 }]}>{ViewEnum.oneWay}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tripType, { borderBottomColor: view === ViewEnum.return ? Style.colours.dark : 'white' }]}
          onPress={() => {
            setView(ViewEnum.return)
            setDistanceMultiple(2)
            Mixpanel.track('Pressed Return Trip')
          }}>
          <Image resizeMode='contain'
            style={styles.icon} source={ICON_RETURN} />
          <Text style={[{ textAlign: "center", fontSize: 14 }]}>{ViewEnum.return}</Text>
        </TouchableOpacity>
      </View>
      <LocationSearchBar
        ref={fromSearchBarRef}
        label='From'
        query={field == Field.From ? query : fromTitle}
        current={current}
        setQuery={setQuery}
        onIcon={onSelectCurrentLocation}
        onBlur={onBlurSearchBar}
        style={{ marginBottom: 10 }}
        onFocus={onFocusFrom} />

      <LocationSearchBar
        ref={toSearchBarRef}
        label='To'
        query={field === Field.To ? query : toTitle}
        current={current}
        setQuery={setQuery}
        onIcon={onSelectCurrentLocation}
        onBlur={onBlurSearchBar}
        onFocus={onFocusTo} />

      {field &&
        <LocationResultList
          results={result}
          onSelect={onSelectLocation} />}
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    height: 15,
    width: 15,
    marginRight: 15
  },
  tripType: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 2,
    padding: 10,
    paddingBottom: 15,
  },
  searchContainer: {
    position: 'absolute',
    ...ifIphoneX({
      top: 134,
    }, {
      top: 114,
    }),
    left: 0,
    right: 0,
    backgroundColor: 'white',
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10.65,
    elevation: 7,
  },
})

export default LocationSearch