import { useState, useEffect, useReducer } from 'react'
import { AUTH_STORAGE_KEY, INITIAL_AUTH } from 'app/constants'
import AsyncStorage from '@react-native-community/async-storage'
import Mixpanel from 'react-native-mixpanel'

const reducerWithEfects = (reducer, preEffects, postEffects) => (state, action) => {
  preEffects.forEach(pre => { pre(state, action) })
  const next = reducer(state, action)
  postEffects.forEach(post => { post(next, action) })
  return next
}



export const AuthActions = Object.freeze({
  Create: 'Auth.Create',
  Verify: 'Auth.Verify',
  Authenticate: 'Auth.Authenticate',
  Clear: 'Auth.Clear',
  Load: 'Auth.Load',
  Refresh: 'Auth.Refresh',
  Forgot: 'Auth.Forgot',
})

const authReducer = (state, action) => {
  console.log('REDUCER :>>', action)
  switch (action.type) {
    case AuthActions.Load:
      return action.auth
    case AuthActions.Create:
      return { ...state, userId: action.userId, email: action.email }
    case AuthActions.Verify:
      return { ...state, verified: true }
    case AuthActions.Authenticate: // (temp fix) Mark verified: true - to get around AsyncStorage race condition
      return { ...state, ...action.auth, requiresReset: false, authenticated: true, verified: true }
    case AuthActions.Clear:
      return INITIAL_AUTH
    case AuthActions.Refresh:
      return { ...state, idToken: action.idToken }
    case AuthActions.Forgot:
      return { ...INITIAL_AUTH, email: action.email, requiresReset: true }
    default:
      throw new Error('Unrecognised action type >>', action.type)
  }
}

const persistAuthState = (state, action) => {
  if (action.type !== AuthActions.Load) {
    AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
      .then(() => {
        /**
         * Calling getItem *seems* to be a workaround for
         * and issue where the key isn't showing in asyncstorage after
         * calling setItem
         * */
        AsyncStorage.getItem(AUTH_STORAGE_KEY).then(item => {
          console.log('STORED AND LOADED:>>', item)
        })
      })
      .catch(e => { console.warn(e) })
  }
}

const setMixpanelCreateTime = (state, action) => {
  if (action.type === AuthActions.Authenticate) {
    Mixpanel.setOnce({ 'Created': new Date().toISOString() })
  }
}

export const useAuth = () => {
  const [auth, dispatch] = useReducer(reducerWithEfects(authReducer, [setMixpanelCreateTime], [persistAuthState]), INITIAL_AUTH)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const getStoredAuth = async () => {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
      const load = stored ? await JSON.parse(stored) : INITIAL_AUTH
      console.log('LOADED :>>', load)
      dispatch({ type: AuthActions.Load, auth: load })
      setLoaded(true)
    }
    getStoredAuth()
  }, [])

  return {
    auth,
    loaded,
    dispatch
  }
}