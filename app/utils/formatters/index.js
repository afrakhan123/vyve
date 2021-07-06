import humanizeDuration from 'humanize-duration'
import { ICON_VISA, ICON_MASTERCARD } from 'app/images/icons'
import { transportModeTypeFromName, TransportModeEnum } from '../emissions';
import { ICON_CAR, ICON_BUS, ICON_TRAIN, ICON_PLANE, ICON_WALKING, ICON_MOTORCYCLE, ICON_FERRY, ICON_CYCLE } from '../../images/icons';

const humanize = humanizeDuration.humanizer({
  language: 'shortEn',
  delimiter: ' ',
  spacer: '',
  units: ['d', 'h', 'm'],
  languages: {
    shortEn: { d: 'd', h: 'h', m: 'mins', s: 's' }
  }
})

export const humanizeMinutes = (mins) => {
  return humanize(Math.round(mins) * 60 * 1000)
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const iconForCard = (brand) => {
  switch (brand) {
    case 'visa':
      return ICON_VISA
    case 'mastercard':
      return ICON_MASTERCARD
    default:
      throw 'unrecognised card brand'
  }
}

export const sortByDate = (first, second) => {
  if (first.created_at < second.created_at) return 1
  if (first.created_at > second.created_at) return -1
  return 0
}

export const sortByTitle = (first, second) => {
  if (first.title < second.title) return -1
  if (first.title > second.title) return 1
  return 0
}

export const iconForTransportMode = (mode, large = false) => {
  const type = (typeof mode === 'string' || mode instanceof String) ? transportModeTypeFromName(mode) : mode

  switch (type) {
    case TransportModeEnum.Flight:
    case TransportModeEnum.Flight.Domestic:
    case TransportModeEnum.Flight.Short.Economy:
    case TransportModeEnum.Flight.Short.Business:
    case TransportModeEnum.Flight.Long.Economy:
    case TransportModeEnum.Flight.Long.Business:
    case TransportModeEnum.Flight.Long.First:
      return ICON_PLANE
    case TransportModeEnum.Car.Petrol:
    case TransportModeEnum.Car.Diesel:
    case TransportModeEnum.Car.Electric:
    case TransportModeEnum.Car.Hybrid:
      return ICON_CAR
    case TransportModeEnum.Train.NationalRail:
    case TransportModeEnum.Train.Underground:
    case TransportModeEnum.Train.Tram:
      return ICON_TRAIN
    case TransportModeEnum.Bus:
      return ICON_BUS
    case TransportModeEnum.Walking:
      return ICON_WALKING
    case TransportModeEnum.Motorcycle:
      return ICON_MOTORCYCLE
    case TransportModeEnum.Ferry:
      return ICON_FERRY
    case TransportModeEnum.Cycle:
      return ICON_CYCLE
    default:
      throw 'Unrecognised transport mode: ' + t.name
  }
}

export const jsonTrip = (
  origin,
  destination,
  transportMode,
  distance = 0,
  duration = 0,
  emissions = 0,
  returnTrip = 0
) => {
  const from = JSON.stringify({
    "type": "Point",
    "coordinates": [origin.coordinates.longitude, origin.coordinates.latitude]
  })

  const to = JSON.stringify({
    "type": "Point",
    "coordinates": [destination.coordinates.longitude, destination.coordinates.latitude]
  })

  const emissionsInGrams = emissions * 1000

  const json = JSON.stringify({
    from_coords: from,
    from_name: origin.title,
    to_coords: to,
    to_name: destination.title,
    distance: distance,
    duration: Math.round(duration),
    emissions: emissionsInGrams,
    transport_mode: transportMode.api_name,
    return_trip: returnTrip
  })

  return json
}

export const tripToJSON = (trip, distance = 0, duration = 0, emissions = 0) => {
  const origin = trip.origin.coordinates
  const destination = trip.destination.coordinates

  // console.log('💀 CONVERTING TO JSON', trip)

  const from = JSON.stringify({
    "type": "Point",
    "coordinates": [origin.longitude, origin.latitude]
  })

  const to = JSON.stringify({
    "type": "Point",
    "coordinates": [destination.longitude, destination.latitude]
  })

  const json = JSON.stringify({
    from_coords: from,
    from_name: trip.origin.location,
    to_coords: to,
    to_name: trip.destination.location,
    distance: distance,
    duration: Math.round(duration),
    emissions: emissions,
    transport_mode: trip.mode.api_name,
  })

  // console.log('💀 RETURN JSON', json)

  return json
}
