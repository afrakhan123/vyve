import React from 'react'
import _ from 'lodash'
import { textStyles } from 'app/styles/text'
import colours from 'app/styles/colours'

import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native'


const TripSearchResult = ({ info, setLocation }) => {

  const selectLocation = () => {
    setLocation(info)
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

export default TripSearchResult