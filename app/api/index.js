import { tripToJSON, jsonTrip } from "../utils/formatters"
import { Auth } from 'aws-amplify'
import config from "../constants/config"


const BASE_URL = config.base_url

const getToken = async () => {
  const cognitoSession = await Auth.currentSession()
    .catch(err => {
      console.warn(err)
    })

  if (cognitoSession) {
    const header = {
      'Authorization': "Bearer " + cognitoSession.idToken.jwtToken,
    }
    return header
  }
}

export const createTrip = async (
  origin,
  destination,
  transportMode,
  distance,
  duration,
  emissions,
  returnTrip,
  setError,
  setResponse,
  setLoading,
) => {

  setLoading(true)
  setError(null)
  const body = jsonTrip(origin, destination, transportMode, distance, duration, emissions, returnTrip)
  const auth = await getToken()
  const response = await fetch(BASE_URL + '/trips', {
    method: 'POST',
    headers: {
      ...auth,
      'Content-Type': 'application/json',
    },
    body: body,
  }).catch((e) => {
    setLoading(false)
    setError(e)
  })

  setLoading(false)
  if (response && response.ok) {
    const json = await response.json().catch(e => { setError(e) })
    setResponse(json.data)
  } else {
    const error = await response.text().catch(e => { setError(e) })
    setError(error)
  }
}

export const saveTrip = async (
  trip,
  distance,
  duration,
  emissions,
  setError,
  setResponse,
  setLoading,
) => {
  setLoading(true)
  setError(null)
  const body = tripToJSON(trip, distance, duration, emissions)
  const auth = await getToken()
  const response = await fetch(BASE_URL + '/trips', {
    method: 'POST',
    headers: {
      ...auth,
      'Content-Type': 'application/json',
    },
    body: body,
  }).catch((e) => {
    setLoading(false)
    setError(e)
  })

  setLoading(false)
  if (response && response.ok) {
    const json = await response.json().catch(e => { setError(e) })
    setResponse(json.data)
  } else {
    const error = await response.text().catch(e => { setError(e) })
    setError(error)
  }
}

export const api = () => {
  const authHeader = async () => {
    const cognitoSession = await Auth.currentSession()
      .catch(err => {
        console.log('NO SESSION', err)
        console.warn(err)
      })

    if (cognitoSession) {
      const header = {
        'Authorization': "Bearer " + cognitoSession.idToken.jwtToken,
      }
      return header
    }
  }

  const processResponse = async (response, error) => {
    if (response && response.ok) {
      return await response.json()
    } else {
      console.warn('Response', await response.text())
      throw '⛔️⛔️⛔️ ' + error
    }
  }

  const stats = async (id) => {
    return await get('/users/' + id + '/stats')
  }

  const get = async (url, header = null) => {
    const response = await fetch(BASE_URL + url, {
      method: 'GET',
      headers: header || await authHeader(),
    }).catch((e) => {
      console.log('GET Request Error', e)
    })

    return response
  }

  /* -------------------------------------------------------------------------------- */
  /* ---- AIRPORTS ---------------------------------------------------------------------- */

  /**
   * Search Airports 
   */
  const searchAirports = async (query) => {
    const results = await get('/airports/search?query=' + query)
    return await processResponse(results, 'Error searching airports')
  }

  /**
 * Nearby Airports
 */
  const nearbyAirports = async (latitude, longitide) => {
    const results = await get("/airports/search?proximity=" + latitude + "," + longitide)
    return await processResponse(results, 'Error getting nearby airports')
  }



  const me = async (header = null) => {
    const user = await get('/auth/me', header)
    return await processResponse(user, 'Unable to get user')
  }


  /* -------------------------------------------------------------------------------- */
  /* ---- PAYMENTS ----------------------------------------------------------- */

  /**
   * Create Payment
   */
  const createPayment = async (data) => {
    const auth = await authHeader()
    const response = await fetch(BASE_URL + '/payments', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...auth,
      },
      body: JSON.stringify(data),
    }).catch((e) => {
      console.log('Error creating payment', e)
    })

    return await processResponse(response, 'Unable to add payment method')
  }


  /* -------------------------------------------------------------------------------- */
  /* ---- PAYMENT METHODS ----------------------------------------------------------- */

  /**
    * Get payment methods for current user 
    */
  const getPaymentMethods = async () => {
    const response = await get('/payment_methods')
    return await processResponse(response, 'Unable to get payment methods')
  }


  /**
   * Add new payment method (card) 
   */
  const addPaymentMethod = async (token) => {
    const auth = await authHeader()
    const response = await fetch(BASE_URL + '/payment_methods', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...auth,
      },
      body: JSON.stringify({
        stripe_token_id: token,
      }),
    }).catch((e) => {
      console.log('Error adding payment method', e)
    })

    return await processResponse(response, 'Unable to add payment method')
  }

  /* -------------------------------------------------------------------------------- */
  /* ---- PROJECTS ----------------------------------------------------------- */

  /**
    * Get projects
    */
  const getProjects = async () => {
    const response = await get('/projects')
    return await processResponse(response, 'Unable to get projects')
  }

  /* -------------------------------------------------------------------------------- */
  /* ---- TRIPS --------------------------------------------------------------------- */


  /**
   * Delete trip 
   */
  const deleteTrip = async (id) => {
    const auth = await authHeader()
    const response = await fetch(BASE_URL + '/trips/' + id, {
      method: 'DELETE',
      headers: {
        ...auth,
        'Content-Type': 'application/json',
      },
    }).catch(e => {
      console.warn('Error deleting trip')
    })

    return await processResponse(response, 'unable to delete trip').catch(e => {
      console.warn(e)
    })
  }


  /**
    * Get trips for current user 
    */
  const getTrips = async (header = null) => {
    const response = await get('/trips', header)
    return await processResponse(response, 'Unable to get trips')
  }

  /**
  * Get favourites
  */
  const getRecurring = async () => {
    const response = await get('/trips/recurring')
    return await processResponse(response, 'Unable to get faves')
  }

  const getFaves = async () => {
    const response = await get('/favourite_trips')
    return await processResponse(response, 'Unable to get faves')
  }

  /**
  * Create fave
  */

  const createFave = async (trip) => {
    const body = tripToJSON(trip)
    const auth = await authHeader()
    const response = await fetch(BASE_URL + '/favourite_trips', {
      method: 'POST',
      headers: {
        ...auth,
        'Content-Type': 'application/json',
      },
      body: body,
    }).catch((e) => {
      console.log('Error creating fave', e)
    })
    return await processResponse(response, 'Unable to create fave')
      .catch(e => { console.warn(e) })
  }
  /**
  * delete fave
  */
  const deleteFave = async (id) => {
    const auth = await authHeader()
    const response = await fetch(BASE_URL + '/favourite_trips/' + id, {
      method: 'DELETE',
      headers: {
        ...auth,
        'Content-Type': 'application/json',
      },
    }).catch(e => {
      console.warn('Error deleting trip')
    })

    return await processResponse(response, 'unable to delete fave').catch(e => {
      console.warn(e)
    })
  }

  /**
   * Create a new trip on the server 
   */
  const createTrip = async ({ trip, distance, duration, emissions }) => {
    const body = tripToJSON(trip, distance, duration, emissions)
    const auth = await authHeader()
    const response = await fetch(BASE_URL + '/trips', {
      method: 'POST',
      headers: {
        ...auth,
        'Content-Type': 'application/json',
      },
      body: body,
    }).catch((e) => {
      console.log('Error creating trip', e)
    })

    return await processResponse(response, 'Unable to create trip')
      .catch(e => { console.warn(e) })
  }


  return {
    addPaymentMethod,
    createTrip,
    createPayment,
    getTrips,
    getRecurring,
    getFaves,
    createFave,
    deleteFave,
    getPaymentMethods,
    getProjects,
    me,
    searchAirports,
    nearbyAirports,
    deleteTrip,
    stats,
  }
}

export const useApi = () => {
  return api()
}