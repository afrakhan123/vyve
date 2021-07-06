import _ from 'lodash'
import { useState, useEffect } from 'react'
import { useLiveLocation } from 'app/hooks/useLiveLocation'
import { haversineDistance, useEmissionsCalculator } from 'app/utils/emissions'

export const useLiveEmissions = (transportMode) => {
  const calculate = useEmissionsCalculator(transportMode)
  const [lastKnown, liveCoords, start, stop] = useLiveLocation()
  const [distance, setDistance] = useState(0)
  const [emissions, setEmissions] = useState(0)
  const [cost, setCost] = useState(0.00)

  useEffect(() => {
    const [emissions, cost] = calculate(distance)
    setEmissions(emissions)
    setCost(cost)
  }, [distance])

  useEffect(() => {
    if (liveCoords.length > 1) {
      const coords = _.takeRight(liveCoords, 2)
      setDistance(prev => prev + haversineDistance(_.head(coords), _.last(coords)))
    }
  }, [liveCoords])

  return [
    lastKnown,
    liveCoords,
    start,
    stop,
    distance,
    emissions,
    cost]

}