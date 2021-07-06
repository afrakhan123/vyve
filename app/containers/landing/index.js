const queryString = require('query-string')
import React, { useEffect, useState, useContext } from 'react'
import { useNavigation } from 'react-navigation-hooks'
import { textStyles, } from 'app/styles/text'
import Mixpanel from 'react-native-mixpanel'
import { Auth, Hub } from 'aws-amplify'
import { AuthContext } from 'app/utils/context/auth/'
import { AuthActions } from 'app/hooks/useAuth'
import LandingBackground from 'app/components/landing-background'
import SocialSignIn from 'app/components/social-sign-in'
import Terms from 'app/components/terms'
import * as Keychain from 'react-native-keychain'
import { signInCognito } from 'app/utils/context/auth'
import { HUB_PAYLOAD_EVENT } from 'app/constants'

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'


const LandingScreen = () => {

  const { navigate } = useNavigation()
  const { dispatch } = useContext(AuthContext)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (error) { console.warn('ERROR :>>', error) }
  }, [error])


  useEffect(() => {
    Mixpanel.track("Open Landing Screen")
  }, [])

  useEffect(() => {
    Hub.listen('auth', handleAuth)
    return () => Hub.remove('auth', handleAuth)
  }, [])

  const onPressSignIn = () => {
    Mixpanel.track('Pressed Sign In')
    navigate('Authenticate')
  }

  const onPressFederatedSignIn = async (provider) => {
    Mixpanel.track('Pressed Sign In with' + provider)
    Auth.federatedSignIn({ provider })
  }

  const onAuthenticated = (auth) => {
    if (auth.userId && auth.idToken) {
      dispatch({
        type: AuthActions.Authenticate,
        auth,
      })
      Mixpanel.identify(auth.userId)
      Mixpanel.set({ "$email": auth.email })
      Mixpanel.track('Signed In')
      navigate('App')
    }
  }

  const onSocialSignIn = () => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        const auth = {
          userId: user.attributes.sub,
          email: user.attributes.email,
          idToken: user.signInUserSession.idToken.jwtToken,
          verified: true,
        }
        onAuthenticated(auth)
      }).catch(error => {
        console.log('ERROR CURRENT ::>>', error)
      })
  }

  const onOAuthCallback = async (payload) => {
    const qs = queryString.parse(queryString.extract(payload.data.url))
    if (qs.error) {
      setError('Error signing in')
      //Attempt to sign in with keychain credentials 
      const credentials = await Keychain.getGenericPassword()
      if (credentials) {
        await signInCognito(
          credentials.username,
          credentials.password,
          setError,
          onAuthenticated,
        )
      } else {
        //Fallback to Cognito UI 
        Auth.federatedSignIn()
      }
    }
  }

  const handleAuth = async ({ payload }) => {
    switch (payload.event) {
      case HUB_PAYLOAD_EVENT.PARSING:
        return await onOAuthCallback(payload)
      case HUB_PAYLOAD_EVENT.FAILED:
      case HUB_PAYLOAD_EVENT.SIGNIN:
        return onSocialSignIn()
      default:
    }
  }

  return (
    <>
      <View style={styles.container}>
        <LandingBackground onPress={() => navigate('Onboarding')} />
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={onPressSignIn}>
            <View style={styles.button}>
              <Text style={textStyles.headerButtonTitle}>Continue with email</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ alignSelf: 'center', fontSize: 16, color: "grey", marginVertical: 20, }} >Or</Text>
          <SocialSignIn
            facebook={true}
            google={true}
            apple={Platform.OS === 'ios'}
            onPressProvider={onPressFederatedSignIn} />
          {error && <Text>{error}</Text>}
        </View>
        <Terms />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    flexShrink: 1,
    width: '100%',
    paddingHorizontal: 32,
    marginVertical: 40,
  },
  buttonContainer: {
    marginBottom: 18,
    marginHorizontal: 20,
  },
  button: {
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 40,
    height: 54,
    backgroundColor: '#e9ff5f',
  },
})

export default LandingScreen

