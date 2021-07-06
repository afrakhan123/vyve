import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { USER_STORAGE_KEY, AUTH_STORAGE_KEY } from 'app/constants';
import { PAYMENTS_STORAGE_KEY, TRIPS_STORAGE_KEY } from '../../constants';


export const useInitialStore = () => {
  const [user, setUser] = React.useState({})
  const [trips, setTrips] = React.useState({})
  const [payment_methods, setPaymentMethods] = React.useState({})
  const [currentProject, setCurrentProject] = React.useState({})
  const [newTrip, setNewTrip] = React.useState({})

  const [loadedUser, setLoadedUser] = React.useState(false)
  const [loadedTrips, setLoadedTrips] = React.useState(false)
  const [loadedPayments, setLoadedPayment] = React.useState(false)

  /**
   * Load persisted user into initial state 
   */
  React.useEffect(() => {
    const user = async () => {
      const persisted = await AsyncStorage.getItem(USER_STORAGE_KEY)
        .catch(e => console.log('Error getting persisted user', e))
      setUser(persisted ? await JSON.parse(persisted) : {})
      setLoadedUser(true)
    }
    user()
  }, [])

  // /**
  //  * Load persisted auth into initial state
  //  */
  // React.useEffect(() => {
  //   const auth = async () => {
  //     const persisted = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
  //       .catch(e => console.log('Error getting persisted authentication', e))
  //     setAuth(persisted ? await JSON.parse(persisted) : {})
  //     setLoadedAuth(true)
  //   }
  //   auth()
  // }, [])

  /**
   * Load persisted payment methods into initial state 
   */
  React.useEffect(() => {
    const payments = async () => {
      const persisted = await AsyncStorage.getItem(PAYMENTS_STORAGE_KEY)
        .catch(e => console.log('Error getting persisted payment methods', e))
      setPaymentMethods(persisted ? await JSON.parse(persisted) : {})
      setLoadedPayment(true)
    }
    payments()
  }, [])

  /**
   * Load persisted trips into initial state 
   */
  React.useEffect(() => {
    const trips = async () => {
      const persisted = await AsyncStorage.getItem(TRIPS_STORAGE_KEY)
        .catch(e => console.log('Error getting persisted trips', e))
      setTrips(persisted ? await JSON.parse(persisted) : {})
      setLoadedTrips(true)
    }
    trips()
  }, [])

  return {
    loadedUser,
    loadedPayments,
    loadedTrips,
    user,
    payment_methods,
    trips,
    currentProject,
    newTrip
  }
}
