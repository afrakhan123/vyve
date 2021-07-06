import React, { useState, useEffect, useContext } from 'react'
import _ from 'lodash'
import Mixpanel from 'react-native-mixpanel'
import { useNavigation } from 'react-navigation-hooks'
import { textStyles, fontWeights } from 'app/styles/text'
import { AuthContext } from 'app/utils/context/auth/'
import LoadingFooter from 'app/components/loading/footer'
import FooterButton from 'app/components/buttons/footer'
import { signInCognito, createAccountCognito } from 'app/utils/context/auth'
import EmailInput from 'app/components/input/email'
import PasswordInput from 'app/components/input/password'
import rocket from 'app/styles/rocket'

import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  InputAccessoryView,
  Dimensions,
  TouchableOpacity,
  Platform,
  Keyboard
} from 'react-native'


import { AuthActions } from 'app/hooks/useAuth'
import * as Keychain from 'react-native-keychain'

const AuthenticationScreen = () => {
  const { navigate } = useNavigation()
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const { auth, dispatch } = useContext(AuthContext)
  const [forgotPassword, setForgotPassword] = useState(false)

  useEffect(() => {
    Mixpanel.track('Open Sign In Screen')
  }, [])

  useEffect(() => {
    setErrorMessage(forgotPassword ? 'Check your details and try again' : '')
  }, [forgotPassword])

  useEffect(() => {
    console.log(authError)
    const handleError = async () => {
      switch (authError.code) {
        case 'UserNotConfirmedException':
          return navigate('VerifySignIn')
        case 'NotAuthorizedException':
          return await createAccount()
        case 'UsernameExistsException':
          return setForgotPassword(true)
        default:
          setErrorMessage(authError.message)
      }
    }

    if (authError) {
      handleError()
    }
  }, [authError])

  useEffect(() => {
    setButtonDisabled(userEmail == '' || password.length < 8)
  }, [userEmail, password])


  const createAccount = async () => {
    dispatch({
      type: AuthActions.Clear,
    })

    await createAccountCognito(
      userEmail,
      password,
      setAuthError,
      setIsLoading,
      onCreate)
  }

  useEffect(() => {
    if (auth.userId && !auth.verified) {
      Keyboard.dismiss()
      navigate('Verify')
    }
  }, [auth])

  const onCreate = async ({ userId, email, password }) => {
    await Keychain.setGenericPassword(email, password)
    Mixpanel.createAlias(userId)
    Mixpanel.track('Created Account')

    dispatch({
      type: AuthActions.Create,
      userId,
      email,
    })
  }

  const onAuthenticated = async (auth) => {
    dispatch({
      type: AuthActions.Authenticate,
      auth,
    })
    await Keychain.setGenericPassword(auth.email, password)
    Mixpanel.identify(auth.userId)
    Mixpanel.set({ "$email": auth.email })
    Mixpanel.track('Signed In')
    navigate('App')
  }

  const onPressAuthenticate = async () => {
    await signInCognito(
      userEmail,
      password,
      setAuthError,
      setIsLoading,
      onAuthenticated,
    )
  }

  const renderFooter = () => {
    return isLoading ?
      <LoadingFooter /> :
      <>
        {authError &&
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
            <Text style={styles.error}>{errorMessage}</Text>
          </View>}
        <FooterButton
          bright={true}
          disabled={buttonDisabled}
          onPress={onPressAuthenticate}
          title='Sign in' />
      </>
  }


  const onPressForgot = () => {
    navigate('Forgot', { username: userEmail })
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{'Continue with email'}</Text>
        <EmailInput setEmail={setUserEmail} autoFocus={!auth.requiresReset} inputAccessoryViewID='sign-up' />
        <PasswordInput setPassword={setPassword} showRequirements={true} inputAccessoryViewID='sign-up' />

        {forgotPassword && <TouchableOpacity
          onPress={onPressForgot}
          style={styles.forgotContainer}>
          <Text style={[rocket.text.dark, { lineHeight: 23 }]}>Forgot Password?</Text>
        </TouchableOpacity>}



      </SafeAreaView>
      {Platform.OS === 'ios' ? (
        <InputAccessoryView nativeID="sign-up">
          {renderFooter()}
        </InputAccessoryView>
      ) : (
          <View>{renderFooter()}</View>
        )}


    </>
  )
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginHorizontal: 22,
    alignItems: 'center'
  },
  title: {
    ...textStyles.h2,
    marginBottom: 20,
    marginTop: 10,
  },
  minChars: {
    ...textStyles.h6,
    marginHorizontal: 8 + width / 24,
    fontSize: 12,
    alignSelf: 'flex-start'
  },
  forgotContainer: {
    marginTop: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: rocket.colours.dark
  },
  error: {
    ...textStyles.h6,
    marginHorizontal: 8 + width / 24,
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  }
})

export default AuthenticationScreen

