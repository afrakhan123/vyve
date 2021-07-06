import React from 'react'

import { useNavigation, useNavigationParam } from 'react-navigation-hooks'

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity, Image,
  Platform
} from 'react-native'
import Title from '../../../components/text/screen-title';
import { TransportModeEnum } from '../../../utils/emissions';
import { textStyles } from '../../../styles/text';
import { EVENT_TRIP_CARFUELTYPE, EVENT_TRIP_SELECT_CARTYPE } from '../../../constants';
import { useStore } from '../../../store';
import {
  ICON_ELECTRIC,
  ICON_DIESEL,
  ICON_PETROL,
  ICON_HYBRID
} from '../../../images/icons'

import Mixpanel from 'react-native-mixpanel'

const CarTypeScreen = () => {
  const store = useStore()
  const { navigate } = useNavigation()


  React.useEffect(() => {
    Mixpanel.track('Open Car Type Screen')
  }, [])



  const didSelectCarType = (type) => {
    store.setMode(type)
    Mixpanel.trackWithProperties('Selected Car Type', { type: type.name })
    // return navigate(Platform.OS === 'ios' ? 'AddTrip' : 'Locations', { mode: mode })
    // return navigate(Platform.OS === 'ios' ? 'AddTrip' : 'Locations', { mode: type })
    navigate('AddTrip', { mode: type })
  }

  const car_types = [
    { icon: ICON_PETROL, title: 'Petrol', type: TransportModeEnum.Car.Petrol },
    { icon: ICON_DIESEL, title: 'Diesel', type: TransportModeEnum.Car.Diesel },
    { icon: ICON_HYBRID, title: 'Hybrid', type: TransportModeEnum.Car.Hybrid },
    { icon: ICON_ELECTRIC, title: 'Electric', type: TransportModeEnum.Car.Electric },
  ]

  const renderButtons = () => {
    return car_types.map((type, index) => {
      return (
        <TouchableOpacity key={index} style={styles.button} onPress={() => didSelectCarType(type.type)}>

          <Image style={styles.icon} source={type.icon} />
          <Text style={textStyles.h5}>{type.title}</Text>
        </TouchableOpacity>
      )
    })
  }

  return (
    <>
      <View style={styles.container}>
        <Title title='What fuel does your vehicle use?' />
        {renderButtons()}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    borderBottomColor: "grey",
    borderBottomWidth: 0.3,
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 72,
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  icon: {
    height: 35,
    width: 35,
    marginRight: 15
  },
})

export default CarTypeScreen 