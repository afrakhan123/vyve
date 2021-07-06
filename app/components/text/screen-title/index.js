import React from 'react'

import {
  Text,
  StyleSheet,
  Dimensions,
  View
} from 'react-native'

import Style from 'app/styles/rocket'

let height = Dimensions.get('window').height

const Title = ({ title, numberOfLines = 2 }) => {

  return (
    <Text
      adjustsFontSizeToFit={true}
      numberOfLines={numberOfLines}
      style={styles.title}>
      {title}
    </Text>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: Style.text.title1.fontSize,
    fontWeight: Style.text.title1.fontWeight,
    lineHeight: height < 667 ? undefined : Style.text.title1.lineHeight,
    backgroundColor: Style.colours.dark,
    color: Style.colours.light, 
    paddingLeft: 22,
    paddingRight: 56,
    paddingBottom: 32,
    paddingTop: 16, 
    maxHeight: '40%',
  }
})

export default Title 