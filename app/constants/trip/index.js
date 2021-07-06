export const TripState = Object.freeze({
  Initital: 'TripState.Initial',
  OnLive: 'TripState.OnLiveTrip',
  Logging: 'TripState.LoggingPreviousTrip',
  Routing: 'TripState.RoutingGoogleDirections',
  Calculating: 'TripState.CalculatingEmissions',
  Saving: 'TripState.Saving',
  Saved: 'TripState.Saved',
  LiveError: 'TripState.LiveError',
  LogError: 'TripState.LoggingError',
})

export const initialUIState = {
  showSegmentControl: true,
  showSearch: false,
  showLiveRoute: false,
  showRoute: false,
  saveTrip: false,
  showFooterButton: true,
}

export const uiReducer = (state, action) => {

  console.log('DISPATCHED:>>', action)

  switch (action.type) {
    case TripState.Initital:
      return initialUIState
    case TripState.OnLive:
      return {
        ...state,
        showSegmentControl: false,
        showRoute: false,
        showLiveRoute: true,
        saveTrip: false,
        showFooterButton: false,
      }
    case TripState.Logging:
      return {
        ...state,
        showSearch: true,
      }
    case TripState.Routing:
    case TripState.Calculating:
      return {
        ...state,
        showRoute: true,
      }
    case TripState.Saving:
    case TripState.Saved:
      return {
        showSegmentControl: false,
        showSearch: false,
        showRoute: true,
        showFooterButton: false,
        saveTrip: true,
      }
    default:
      throw new Error('Unrecognised case', action.type)
  }
}


export const TripEnum = Object.freeze({
  Live: {
    title: 'Start a trip',
    buttonTitle: 'Start',
    state: TripState.Initital,
  },
  Log: {
    title: 'Log a trip',
    buttonTitle: 'Calculate',
    state: TripState.Logging,
  },
})