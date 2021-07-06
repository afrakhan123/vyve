import React, { useEffect } from 'react'

import { Image, Dimensions } from 'react-native'

const AspectImage = ({
  requiredWidthPercent = null,
  widthResolution = null,
  heightResolution = null,
  source,
}) => {

  const width = Dimensions.get('window').width
  const ratio = width / widthResolution
  const imageHeight = ratio * heightResolution / 1.8 // Fix this hack 

  useEffect(() => {
    if (!(requiredWidthPercent && widthResolution && heightResolution)) {
      throw 'Missing Arguments to AspectImage'
    }
  }, [])

  return (
    <Image
      source={source}
      style={{
        width: requiredWidthPercent,
        height: imageHeight,
        resizeMode: 'contain',
      }} />
  )
}

export default AspectImage