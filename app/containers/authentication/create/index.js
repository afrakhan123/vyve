import React, { useState, useEffect, useContext } from 'react'
import Mixpanel from 'react-native-mixpanel'
import _ from 'lodash'
import { createAccountCognito } from 'app/utils/context/auth'
import { useNavigation } from 'react-navigation-hooks'
import { textStyles, fontWeights } from 'app/styles/text'
import { AuthContext } from 'app/utils/context/auth/'
import LoadingFooter from 'app/components/loading/footer'
import FooterButton from 'app/components/buttons/footer'
import EmailInput from 'app/components/input/email'
import PasswordInput from 'app/components/input/password'
import EmailValidator from 'email-validator'
import appsFlyer from 'react-native-appsflyer'
import * as Keychain from 'react-native-keychain'

import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  InputAccessoryView,
  Dimensions,
  Keyboard
} from 'react-native'

import { AuthActions } from 'app/hooks/useAuth'

const CreateAccountScreen = () => {

  // TODO: Tidy this up
  const { navigate } = useNavigation()
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  // const { auth, setAuthStatus, userId, setEmail, setPassword, setUserId } = useContext(AuthContext)
  const { auth, dispatch } = useContext(AuthContext)

  useEffect(() => {
    Mixpanel.track('Open Create Account Screen')
  }, [])

  useEffect(() => {
    if (createError) {
      setErrorMessage(createError.message)
      console.log(createError)

      // TODO: sign in instead
      // if (createError.code == 'UsernameExistsException') {
      // } else {
      //   setErrorMessage(createError.message)
      //   console.log(createError)
      // }
    }
  }, [createError])

  useEffect(() => {
    setButtonDisabled(!(emailValid && passwordValid))
  }, [inputEmail, inputPassword])

  useEffect(() => {
    setEmailValid(EmailValidator.validate(inputEmail))
  }, [inputEmail])

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

  const didPressNext = async () => {
    dispatch({
      type: AuthActions.Clear,
    })
    const username = inputEmail
    const password = inputPassword
    await createAccountCognito(
      username,
      password,
      setCreateError,
      setIsLoading,
      onCreate)
  }


  const renderFooterContent = () => {
    return (isLoading ?
      <LoadingFooter /> :
      <>
        {createError &&
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
            <Text style={styles.error}>{errorMessage}</Text>
          </View>}
        <FooterButton bright={true} disabled={buttonDisabled} onPress={didPressNext} title='Next' />
      </>
    )
  }

  const renderFooter = () => {
    return (Platform.OS === 'ios' ? (
      <InputAccessoryView nativeID="sign-up">
        {renderFooterContent()}
      </InputAccessoryView>
    ) : (
        <View>
          {renderFooterContent()}
        </View>)
    )
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{'Create Account'}</Text>
        <EmailInput
          setEmail={setInputEmail}
          autoFocus={!auth.userId}
          inputAccessoryViewID='sign-up' />
        <PasswordInput
          setPassword={setInputPassword}
          setPasswordValid={setPasswordValid}
          setIsFocused={setIsPasswordFocused}
          placeholder='Create Password'
          inputAccessoryViewID='sign-up' />
      </SafeAreaView>
      {renderFooter()}

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
    textAlign: 'center',
  },
  forgot: {
    ...textStyles.caption,
    fontSize: 13,
    fontWeight: fontWeights.regular,
    textAlign: 'center',
    letterSpacing: 0,
    marginHorizontal: 8 + width / 24,
    alignSelf: 'flex-start'
  },
  error: {
    ...textStyles.h6,
    marginHorizontal: 8 + width / 24,
    fontSize: 14,
    textAlign: 'center',
    color: 'red'
  },
})

export default CreateAccountScreen
