
import { tripToJSON, jsonTrip } from "app/utils/formatters"

export const createTripSuccess = async (
  origin,
  destination,
  transportMode,
  distance,
  duration,

  emissions,
  setError,
  setResponse,
  setLoading,
) => {
  setLoading(true)
  setError(null)


  console.log('distance :>>', distance)
  console.log('duration :>> ', duration)
  console.log('origin :>> ', origin)
  console.log('destination :>> ', destination)


  const body = jsonTrip(origin, destination, transportMode, distance, duration, emissions)



  setTimeout(() => {
    setLoading(false)
    setResponse(body)
    console.log('RESPONSE :>>', body)
  }, 1500)
}

export const createTripError = async (
  origin,
  destination,
  transportMode,
  distance,
  duration,
  emissions,
  setError,
  setResponse,
  setLoading,
) => {
  setLoading(true)
  setError(null)

  setTimeout(() => {
    setLoading(false)
    setError(new Error('<TEST> :>> Error creating Trip'))
    console.log('ERROR RESPONSE :>>')
  }, 1500)
}