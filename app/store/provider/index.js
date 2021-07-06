import React from 'react'
import StoreReducer from 'app/store/reducers'

import _ from 'lodash'
import moment from 'moment'

import { CREATE_USER_SUCCESS, LOG_IN_SUCCESS, LOADED_PERSISTED_USER, LOAD_INITIAL } from 'app/store/actions'

import AsyncStorage from '@react-native-community/async-storage'
import { useInitialStore } from 'app/store/initial';
import { USER_STORAGE_KEY, AUTH_STORAGE_KEY } from 'app/constants';
import { ADD_CARD_SUCCESS, RECIEVE_UPDATED_USER, ADD_TRIP_SUCCESS, RECEIVE_TRIPS, CHOSE_PROJECT, CHECKOUT, CANCEL_CHECKOUT, COMPLETE_CHECKOUT, RECEIVE_PAYMENT_METHODS, LOG_OUT, ATTEMPTED_WALKTHROUGH, NEW_TRIP_ORIGIN, NEW_TRIP_DESTINATION, NEW_TRIP_MODE, NEW_TRIP_CLOSE, DELETE_TRIP } from '../actions';
import { PAYMENTS_STORAGE_KEY, TRIPS_STORAGE_KEY } from '../../constants';


export const StoreContext = React.createContext()

const StoreProvider = ({ initial, children }) => {
  const [state, dispatch] = React.useReducer(StoreReducer, initial)

  /**
   * Reset the initial state 
   */
  React.useEffect(() => {
    dispatch({
      type: LOAD_INITIAL,
      state: initial
    })
  }, [initial])

  // React.useEffect(() => {
  //   console.log('Current store.state', state)
  // }, [state])

  /**
   * Persist the user whenever the value changes 
   */
  React.useEffect(() => {
    const saveUser = async () => {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state.user))
    }

    if (state.loadedUser) {
      saveUser()
    }

  }, [state.user])


  /**
   * Persist authentication details when they change
   */
  React.useEffect(() => {
    const saveAuth = async () => {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.auth))
    }

    if (state.loadedAuth) {
      saveAuth()
    }

  }, [state.auth])


  /**
   * Persist payment methods whenever the value changes 
   */
  React.useEffect(() => {
    const savePaymentMethods = async () => {
      await AsyncStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(state.payment_methods))
    }

    if (state.loadedPayments) {
      // savePaymentMethods()
    }

  }, [state.payment_methods])


  /**
   * Persist trips whenever the value changes 
   */
  React.useEffect(() => {
    const saveTrips = async () => {
      throw 'Kam Popat 04-12-19: Only keep trips in memory for v0. Reload trips with GET /trips when needed'
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(state.trips))
    }

    if (state.loadedTrips) {
      // saveTrips()
    }

  }, [state.trips])


  const tokenTTL = () => {
    return moment(state.auth.expires_at).diff(moment(), 'seconds')
  }

  /**
   * if Token time to live is < 0, 
   * the user is not considered authenticated. 
   * Current backend implementation requires a valid access token 
   * to refresh JWT. If it's expired, the user will need to sign in again 
   */
  const isAuthenticated = () => {
    const auth = state.auth
    return !_.isEmpty(auth)
  }

  const tokenShouldRefresh = () => {
    return tokenTTL() < 300
  }

  const receivePaymentMethods = (cards) => {
    dispatch({
      type: RECEIVE_PAYMENT_METHODS,
      payment_methods: _.keyBy(cards, 'id')
    })
  }

  const receiveTrips = (trips) => {
    dispatch({
      type: RECEIVE_TRIPS,
      trips: _.keyBy(trips, 'id')
    })
  }

  const choseProject = (project, isDefault = false) => {
    dispatch({
      type: CHOSE_PROJECT,
      project: project,
      default: isDefault
    })
  }

  const addTrip = (trip) => {
    dispatch({
      type: ADD_TRIP_SUCCESS,
      id: trip.id,
      trip: trip
    })
  }

  const logout = () => {
    dispatch({
      type: LOG_OUT
    })
  }

  const addPaymentMethod = (payment_method) => {
    dispatch({
      type: ADD_CARD_SUCCESS,
      id: payment_method.id,
      payment_method: payment_method,
    })
  }

  const createUser = (user) => {
    dispatch({
      type: CREATE_USER_SUCCESS,
      user: user
    })
  }

  const authenticate = (auth) => {
    dispatch({
      type: LOG_IN_SUCCESS,
      auth: auth
    })
  }

  const updateUser = (user) => {
    dispatch({
      type: RECIEVE_UPDATED_USER,
      user: user
    })
  }

  const checkout = (trip) => {
    dispatch({
      type: CHECKOUT,
      trip: trip
    })
  }

  const attemptedWalkthrough = () => {
    dispatch({
      type: ATTEMPTED_WALKTHROUGH,
    })
  }

  const setOrigin = (location, coordinates) => {
    dispatch({
      type: NEW_TRIP_ORIGIN,
      location,
      coordinates
    })
  }

  const setDestination = (location, coordinates) => {
    dispatch({
      type: NEW_TRIP_DESTINATION,
      location,
      coordinates
    })
  }

  const setMode = (mode) => {
    dispatch({
      type: NEW_TRIP_MODE,
      mode
    })
  }

  const clearTrip = () => {
    console.log('👋🏼 👋🏼 👋🏼 Clear Trip', state)
    dispatch({
      type: NEW_TRIP_CLOSE
    })
  }

  const deleteTrip = (id) => {
    dispatch({
      type: DELETE_TRIP,
      id
    })
  }

  const value = {
    state,
    createUser,
    authenticate,
    isAuthenticated,
    addPaymentMethod,
    updateUser,
    addTrip,
    receiveTrips,
    choseProject,
    checkout,
    receivePaymentMethods,
    logout,
    attemptedWalkthrough,
    setOrigin,
    setDestination,
    setMode,
    clearTrip,
    tokenShouldRefresh,
    tokenTTL,
    deleteTrip
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider 