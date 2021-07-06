import { CREATE_USER_SUCCESS, LOG_IN_SUCCESS, LOAD_INITIAL } from "app/store/actions";
import { ADD_CARD_SUCCESS, RECIEVE_UPDATED_USER, ADD_TRIP_SUCCESS, RECEIVE_TRIPS, CHOSE_PROJECT, CHECKOUT, COMPLETE_CHECKOUT, CANCEL_CHECKOUT, RECEIVE_PAYMENT_METHODS, RECEIVE_PROJECTS, LOG_OUT, ATTEMPTED_WALKTHROUGH, NEW_TRIP_ORIGIN, NEW_TRIP_DESTINATION, NEW_TRIP_MODE, NEW_TRIP_CLOSE, DELETE_TRIP } from "../actions";

const StoreReducer = (state, action) => {

  switch (action.type) {
    case DELETE_TRIP:
      const { [action.id.toString()]: value, ...newTrips } = state.trips
      return {
        ...state,
        trips: newTrips
      }
    case NEW_TRIP_CLOSE:
      return {
        ...state,
        newTrip: {}
      }
    case NEW_TRIP_MODE:
      return {
        ...state,
        newTrip: {
          ...state.newTrip,
          mode: action.mode
        }
      }
    case NEW_TRIP_DESTINATION:
      return {
        ...state,
        newTrip: {
          ...state.newTrip,
          destination: {
            location: action.location,
            coordinates: action.coordinates
          }
        }
      }
    case NEW_TRIP_ORIGIN:
      return {
        ...state,
        newTrip: {
          ...state.newTrip,
          origin: {
            location: action.location,
            coordinates: action.coordinates
          }
        }
      }
    case ATTEMPTED_WALKTHROUGH:
      return {
        ...state,
        attemptedWalkthrough: true
      }
    case LOG_OUT:
      return {
        ...state,
        user: {},
        auth: {},
        trips: {},
        payment_methods: {},
        currentProject: {},
        newTrip: {},
      }
    case RECEIVE_PAYMENT_METHODS:
      return {
        ...state,
        payment_methods: action.payment_methods
      }
    case CHECKOUT:
      return {
        ...state,
        displayCheckout: true,
        checkoutTrip: action.trip
      }
    case CHOSE_PROJECT:
      return {
        ...state,
        currentProject: {
          project: action.project,
          default: action.default
        }
      }
    case RECEIVE_TRIPS:
      return {
        ...state,
        trips: action.trips
      }
    case ADD_TRIP_SUCCESS:
      return {
        ...state,
        trips: {
          ...state.trips,
          [action.id]: action.trip,
        }
      }
    case RECIEVE_UPDATED_USER:
      return {
        ...state,
        user: action.user
      }
    case ADD_CARD_SUCCESS:
      return {
        ...state,
        payment_methods: {
          ...state.payment_methods,
          [action.id]: action.payment_method
        }
      }
    case LOAD_INITIAL:
      return action.state
    case LOG_IN_SUCCESS:
      return {
        ...state,
        auth: action.auth
      }
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}

export default StoreReducer