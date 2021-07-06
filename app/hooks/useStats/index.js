import { useState, useEffect } from 'react'

import { useApi, BASE_URL } from 'app/api'

export const useStats = (user) => {

  const s = {
    emissions: 0,
    offset: 0,
    distance: 0,
    change: 0,
  }

  const [stats, setStats] = useState(s)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [id, setId] = useState(user)
  const [success, setSuccess] = useState(false)

  const api = useApi()

  useEffect(() => {
    const getStats = async () => {
      setSuccess(false)
      setLoading(true)
      setError(null)

      const response = await api.stats(id)
        .catch(error => {
          setLoading(false)
          setError(error)
          return
        })

      if (!response.ok) {
        setLoading(false)
        setError(await response.text())
        return
      }

      const json = await response.json()
        .catch(error => {
          setLoading(false)
          setError(error)
          return
        })

      const s = {
        emissions: json.data.emissions_this_week,
        offset: json.data.emissions_offset_this_week,
        distance: json.data.distance_this_week,
        change: json.data.emissions_change_from_last_week,
        emissions_month: json.data.emissions_this_month,
        offset_month: json.data.emissions_offset_this_month,
        distance_month: json.data.distance_this_month,
        change_month: json.data.emissions_change_from_last_month,
        emissions_alltime: json.data.emissions_this_alltime,
        distance_alltime: json.data.distance_this_alltime,
        offset_alltime: json.data.emissions_offset_this_alltime
      }
      setLoading(false)
      setSuccess(true)
      setStats(s)
      setId(-1)
    }

    if (id) {
      getStats()
    }
  }, [id])

  return { stats, loading, success, error, setId }
}