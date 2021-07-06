import Geocoding from '@mapbox/mapbox-sdk/services/geocoding'
import { MAPBOX_TOKEN } from 'app/constants'

const mapboxService = Geocoding({ accessToken: MAPBOX_TOKEN })

export const mapboxForwardGeocode = async (
  query,
  setResult,
  proximity = null,
  relevance = 0.5,
) => {
  const params = { query: query }

  if (proximity) {
    params.proximity = [proximity.longitude, proximity.latitude]
  }

  const response = await mapboxService.forwardGeocode(params).send()
  setResult(response.body.features.filter(r => r.relevance > relevance))
}

export const mapboxReverseGeocode = async (
  coordinates,
  setResult,
) => {
  const params = { query: [coordinates.longitude, coordinates.latitude] }
  const res = await mapboxService.reverseGeocode(params).send()
  const info = {
    title: res.body.features[0].text,
    subtitle: res.body.features[0].place_name,
    coordinates: {
      longitude: coordinates.longitude,
      latitude: coordinates.latitude
    }
  }
  console.log('REVERSED :>>', info)
  setResult(info)
}


export const useGeocoding = () => {
  return Geocoding({ accessToken: MAPBOX_TOKEN })
}



