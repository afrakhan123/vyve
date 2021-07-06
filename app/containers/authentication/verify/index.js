import React, { useState, useEffect, useContext } from 'react'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import Mixpanel from 'react-native-mixpanel'
import _ from 'lodash'
import { useNavigation } from 'react-navigation-hooks'
import { textStyles } from 'app/styles/text'
import { AuthContext } from 'app/utils/context/auth/'
import rocket from 'app/styles/rocket'
import { verifyAccount, signInCognito, resendVerification } from 'app/utils/context/auth'
import appsFlyer from 'react-native-appsflyer'
import { AuthActions } from 'app/hooks/useAuth'
import * as Keychain from 'react-native-keychain'

import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard
} from 'react-native'


const VerifyScreen = () => {
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(false)

  const [verifyError, setVerifyError] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [showJunkReminder, setShowJunkReminder] = useState(false)

  const { auth, dispatch, } = useContext(AuthContext)

  const onAuthenticated = (auth) => {
    dispatch({
      type: AuthActions.Authenticate,
      auth,
    })
    Mixpanel.identify(auth.userId)
    Mixpanel.set({ "$email": auth.email })
    Mixpanel.track('Signed In')
    navigate('App')
  }

  useEffect(() => {
    Mixpanel.track('Open Verify Email Screen')
  }, [])

  useEffect(() => {
    if (authError) {
      console.warn(authError)
    }
  }, [authError])




  useEffect(() => {
    const signIn = async () => {
      const credentials = await Keychain.getGenericPassword()
      if (credentials) {
        await signInCognito(
          auth.email,
          credentials.password,
          setAuthError,
          setLoading,
          onAuthenticated,
        )
      }
    }

    if (auth.verified) {
      signIn()
    }
  }, [auth.verified])

  const onVerified = () => {
    Mixpanel.track('Verified Account')
    Mixpanel.set({ "$email": auth.email })

    appsFlyer.trackEvent('Created Account', { email: auth.email },
      (result) => {
        console.log('verify result', result);
      },
      (error) => {
        console.error(error);
      })


    dispatch({ type: AuthActions.Verify })
  }

  const onCodeComplete = async (code) => {
    Mixpanel.track('Completed Verification Code')
    await verifyAccount(
      auth.email,
      code,
      setVerifyError,
      onVerified)
  }

  const resendCode = async () => {
    setShowJunkReminder(true)
    await resendVerification(auth.email, setVerifyError, setLoading)
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{'Verification Code'}</Text>
        <Text style={[rocket.text.body, { textAlign: 'center' }]}>{'Please enter the verification code sent to '}</Text>
        <Text style={[rocket.text.body, { textAlign: 'center', fontWeight: 'bold' }]}>{auth.email}</Text>
        <OTPInputView
          pinCount={6}
          autoFocusOnLoad
          onCodeFilled={onCodeComplete}
          style={styles.codeInput}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted} />
        {loading && <ActivityIndicator size='small' color={rocket.colours.dark} />}
        {!(auth.verified || loading) &&
          <TouchableOpacity
            onPress={resendCode}
            style={styles.resendContainer}>
            <Text style={[rocket.text.dark, { lineHeight: 23 }]}>{'Resend Code'}</Text>
          </TouchableOpacity>
        }
        {!loading && showJunkReminder && <Text style={[rocket.text.captionSmall, { marginTop: 12, color: rocket.colours.placeholder, fontSize: 11, }]}>Remember to check your junk folder</Text>}
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginHorizontal: 22,
    alignItems: 'center'
  },
  title: {
    ...textStyles.h2,
    marginBottom: 40,
    marginTop: 10,
    textAlign: 'center',
  },
  codeInput: {
    width: '70%',
    height: 250
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1.5,
    color: 'black',
    fontSize: 22,
  },
  underlineStyleHighLighted: {
    borderColor: rocket.colours.link,
    borderBottomWidth: 1.5,
    color: 'black',
  },
  resendContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: rocket.colours.dark
  }
})

export default VerifyScreen