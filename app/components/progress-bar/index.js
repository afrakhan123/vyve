import {
  StyleSheet,
  View,
  Text
} from 'react-native'

import React from 'react'
import { textStyles } from '../../styles/text';
import colours from 'app/styles/colours'

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const ProgressBar = ({ total, target }) => {

  const progress = (total, target) => {
    const width = Math.min(total / target * 164, 164)
    return {
      ...styles.progress,
      width: width, 
      backgroundColor: (width == 164 ? colours.positive : styles.progress.backgroundColor)
    }
  }

  return (
    <>
      <View style={styles.bar}>
        <View style={progress(total, target)} />
      </View>
      <Text style={styles.description}>{numberWithCommas(total) + ' of ' + numberWithCommas(target) + ' met'}</Text>
    </>
  )
}

const styles = StyleSheet.create({
  bar: {
    height: 4,
    borderRadius: 100,
    backgroundColor: '#E0E0E0'
  },
  progress: {
    position: 'absolute',
    backgroundColor: '#4a4b4a',
    borderRadius: 100,
    height: 4,
  },
  description: {
    ...textStyles.caption, 
    marginTop: 8, 
  }
})

export default ProgressBar 