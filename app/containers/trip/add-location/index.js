import React from 'react'
import Title from 'app/components/text/screen-title'
import { useGeocoding } from 'app/utils/geocoding'
import FooterButton from 'app/components/buttons/footer'

import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  TextInput,
  InputAccessoryView
} from 'react-native'

import _ from 'lodash'

const AddLocationScreen = ({ title, placeholder, onNext }) => {
  const [location, setLocation] = React.useState('')
  const [results, setResults] = React.useState([])
  const [coordinates, setCoordinates] = React.useState(null)

  const service = useGeocoding()


  React.useEffect(()=>{
    if (location == '') {
      setCoordinates(null)
    }
  },[location])

  /**
   * Get coordinates from Mapbox when user types location into the input 
   */
  React.useEffect(() => {
    let debounced = _.debounce(() => { getResults(location) }, 500, {
      leading: false,
      trailing: true
    })

    async function getResults(location) {
      const response = await service.forwardGeocode({
        query: location,
      }).send()
      setResults(response.body.features)
    }

    if (location.length > 3) { debounced() }

    return () => {
      debounced.cancel()
    }
  }, [location])


  /**
   * Set Coordinates of the top results return by MapBox 
   */
  React.useEffect(() => {
    if (!_.isEmpty(results)) {
      console.log(results)
      const coordinates = _.merge([], results[0].geometry.coordinates)
      setCoordinates(coordinates)
    }
  }, [results])

  const onPressNext = () => {
    onNext(location, coordinates)
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
          <View style={styles.inner} >
            <View style={styles.titleContainer}>
              <Title title={title} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                value={location}
                autoCorrect={false}
                autoCapitalize='words'
                autoFocus={true}
                clearButtonMode='while-editing'
                onChangeText={setLocation}
                placeholder={placeholder}
                placeholderTextColor='#C7C7C7'
                style={styles.input}
                inputAccessoryViewID='add-location.location' />
            </View>

            {/* 
            * Needed to make keyboard behave properly. Fills space at the bottom of the screen when we use flex-end for the container 
           */}
            <View style={{ flex: 1, marginBottom: 20 }} />
          </View>
          <InputAccessoryView nativeID='add-location.location'>
            <FooterButton disabled={_.isEmpty(coordinates)} onPress={onPressNext} title='Next' />
          </InputAccessoryView>
        </KeyboardAvoidingView>
      </SafeAreaView >
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 22,
  },
  inner: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  titleContainer: {
    width: '70%',
  },
  input: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    height: 46,
    borderRadius: 8,
    fontSize: 17,
    marginBottom: 12,
    alignSelf: 'stretch',
    color: 'black'
  },
  inputContainer: {
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default AddLocationScreen