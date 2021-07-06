import React from 'react'
import AddLocationScreen from '../add-location'

import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import { SafeAreaView } from 'react-navigation';
import { EVENT_TRIP_END, EVENT_TRIP_ENDNEXT } from '../../../constants';


const DestinationScreen = () => {

  const trip = useNavigationParam('trip')
  const { navigate } = useNavigation()


  const onNext = async (location, coordinates) => {
    const params = {
      ...trip,
      destination: {
        location,
        coordinates: {
          longitude: coordinates[0],
          latitude: coordinates[1]
        }
      }
    }
    navigate('Mode', { trip: params })

  }

  return (
    <AddLocationScreen title='Where did you travel to?' placeholder='To' onNext={onNext} />
  )
}

export default DestinationScreen 