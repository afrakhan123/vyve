import React, { useState, useEffect, useContext } from 'react'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import Mixpanel from 'react-native-mixpanel'
import _ from 'lodash'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import { textStyles } from 'app/styles/text'
import { AuthContext } from 'app/utils/context/auth/'
import rocket from 'app/styles/rocket'
import { submitNewPassword, signInCognito } from 'app/utils/context/auth'
import PasswordInput from 'app/components/input/password'
import LoadingFooter from 'app/components/loading/footer'
import FooterButton from 'app/components/buttons/footer'

import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  InputAccessoryView,
  Dimensions,
  TouchableOpacity,
} from 'react-native'

import { AuthActions } from 'app/hooks/useAuth'
import * as Keychain from 'react-native-keychain'

const NewPasswordScreen = () => {
  const user = useNavigationParam('username')
  const code = useNavigationParam('code')
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)

  const { dispatch } = useContext(AuthContext)

  useEffect(() => {
    Mixpanel.track('Open Create New Password Screen')
  }, [])

  useEffect(() => {
    if (authError) {
      setLoading(false)
      console.warn(authError)
    }
  }, [authError])


  useEffect(() => {
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

    const signIn = async () => {
      await signInCognito(
        user,
        password,
        setAuthError,
        setLoading,
        onAuthenticated,
      )
    }

    if (success) { signIn() }
  }, [success])

  useEffect(() => {
    setButtonDisabled(!passwordValid)
  }, [password])

  const onPressFinish = async () => {
    setLoading(true)
    await submitNewPassword(
      user,
      code,
      password,
      setAuthError,
      setSuccess
    )
  }

  const renderFooterContent = () => {
    return loading ?
      <LoadingFooter /> :
      <FooterButton
        bright={true}
        disabled={buttonDisabled}
        onPress={onPressFinish}
        title='Finish' />
  }


  const renderFooter = () => {
    return (Platform.OS === 'ios' ? (
      <InputAccessoryView nativeID="finish">
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
        <Text style={styles.title}>{'New Password'}</Text>
        <Text style={[rocket.text.body, { textAlign: 'center', marginBottom: 30, }]}>{'Create your new password to sign in'}</Text>
        <PasswordInput
          autoFocus={true}
          setPassword={setPassword}
          setPasswordValid={setPasswordValid}
          inputAccessoryViewID='finish' />
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
    marginBottom: 40,
    marginTop: 10,
    textAlign: 'center',
  },
  error: {
    ...textStyles.h6,
    marginHorizontal: 8 + width / 24,
    fontSize: 14,
    color: 'red'
  }
})

export default NewPasswordScreen