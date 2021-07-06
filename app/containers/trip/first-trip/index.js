import React from 'react'
import { Text, View } from 'react-native'
import Title from '../../../components/text/screen-title'
import FooterButton from 'app/components/buttons/footer'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { SafeAreaView } from 'react-navigation'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import TransportModeScreen from '../transport-mode'



const FirstTripScreen = () => {

  const { navigate } = useNavigation()
  const isFirst = useNavigationParam('first')

  const onPressStart = () => {
    navigate('Mode')
  }

  return (isFirst ?
    <>
      <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Title title='Welcome to VYVE.' />
          <Title numberOfLines={0} title='To understand and help reduce your carbon footprint, let’s start by adding a trip.' />
        </View>
        <FooterButton onPress={onPressStart} title='Add a trip' full={!isIphoneX()} />
      </SafeAreaView>
    </>
    : <TransportModeScreen />
  )
}

export default FirstTripScreen