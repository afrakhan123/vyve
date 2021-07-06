import React from 'react'
import { useStore } from '../../../store';
import CloseButton from '../close';


const CloseTripButton = () => {
  const store = useStore()

  const onPress = () => {
    // store.clearTrip() 
  }

  return <CloseButton onPress={onPress} />
}

export default CloseTripButton