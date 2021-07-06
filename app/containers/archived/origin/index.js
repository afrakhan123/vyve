import React from 'react'
import AddLocationScreen from '../add-location'

import { useNavigation } from 'react-navigation-hooks'
import { SafeAreaView } from 'react-navigation';

import { EVENT_TRIP_START, EVENT_TRIP_STARTNEXT } from '../../../constants';


const OriginScreen = () => {

  const { navigate } = useNavigation()


  const onNext = async (location, coordinates) => {
    const params = {
      trip: {
        origin: {
          location,
          coordinates: {
            longitude: coordinates[0],
            latitude: coordinates[1]
          }
        }
      }
    }
    navigate('Destination', params)
  }

  return (
    <AddLocationScreen title='Where did you travel from?' placeholder='From' onNext={onNext} />
  )
}

export default OriginScreen 