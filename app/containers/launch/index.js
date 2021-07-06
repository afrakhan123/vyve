import { useEffect, useContext, useState } from 'react'
import { useNavigation } from 'react-navigation-hooks'
import { Auth } from 'aws-amplify'
import { AuthActions } from 'app/hooks/useAuth'
import { AuthContext } from 'app/utils/context/auth'
import { signInCognito } from 'app/utils/context/auth'
import Mixpanel from 'react-native-mixpanel'
import { forgotPassword } from 'app/utils/context/auth'
import * as Keychain from 'react-native-keychain'
import AsyncStorage from '@react-native-community/async-storage'
import { ONBOARDING_STORAGE_KEY } from 'app/constants'

import config from "app/constants/config"

console.log('Env at launch :>>', config.base_url)

const Launch = () => {
  const { auth, loaded, dispatch } = useContext(AuthContext)
  const { navigate } = useNavigation()
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    if (authError) { navigate('Auth') }
  }, [authError])

  useEffect(() => {
    const onAuthenticated = (auth) => {
      dispatch({ type: AuthActions.Authenticate, auth, })
      Mixpanel.identify(auth.userId)
      Mixpanel.set({ "$email": auth.email })
      Mixpanel.track('Signed In')
      navigate('App')
    }

    const launch = async () => {

      const onboarded = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY)
      if (!onboarded) {
        return navigate('Onboarding')
      }


      if (auth.email && auth.requiresReset) {
        await forgotPassword(auth.email)
        return navigate('Reset', { username: auth.email })
      }
      if (auth.userId && auth.email && !auth.verified) { return navigate('Verify') }
      if (!auth.authenticated) { return navigate('Auth') }
      if (auth.authenticated && auth.verified) {
        const session = await Auth.currentSession()
          .catch(async (e) => {
            console.warn(e)
            const credentials = await Keychain.getGenericPassword()
            if (credentials) {
              await signInCognito(auth.email, credentials.password, setAuthError, onAuthenticated)
            }
          })
        if (session) {
          dispatch({ type: AuthActions.Refresh, idToken: session.idToken.jwtToken, })
          navigate('App')
        }
      }
    }

    if (loaded) {
      launch()
    }
  }, [loaded])

  return null

}

export default Launch 