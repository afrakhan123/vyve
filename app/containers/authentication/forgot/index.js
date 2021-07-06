import React, { useState, useEffect, useContext } from 'react'
import _ from 'lodash'
import Mixpanel from 'react-native-mixpanel'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import { textStyles, } from 'app/styles/text'
import FooterButton from 'app/components/buttons/footer'
import EmailInput from 'app/components/input/email'
import { forgotPassword } from 'app/utils/context/auth'
import rocket from 'app/styles/rocket'
import EmailValidator from 'email-validator'


import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  InputAccessoryView,
} from 'react-native'
import { AuthContext } from 'app/utils/context/auth'
import { AuthActions } from 'app/hooks/useAuth'



const ForgotScreen = () => {
  const { navigate } = useNavigation()
  const [user, setUser] = useState(useNavigationParam('username') || '')
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [requestError, setRequestError] = useState(null)
  const [emailValid, setEmailValid] = useState(false)
  const { auth, dispatch } = useContext(AuthContext)


  useEffect(() => {
    Mixpanel.track('Open Forgot Password Screen')
  }, [])

  useEffect(() => {
    setButtonDisabled(!emailValid)
  }, [emailValid])

  useEffect(() => {
    setEmailValid(EmailValidator.validate(user))
  }, [user])

  const onPressSubmit = async () => {
    dispatch({
      type: AuthActions.Forgot,
      email: user,
    })
    navigate('Reset', { username: user })
    await forgotPassword(user, setRequestError)
  }


  const renderFooterContent = () => {
    return <FooterButton
      bright={true}
      disabled={buttonDisabled}
      onPress={onPressSubmit}
      title='Submit' />

  }

  const renderFooter = () => {
    return (Platform.OS === 'ios' ? (
      <InputAccessoryView nativeID="submit">
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
        <Text style={styles.title}>{'Forgot Password'}</Text>
        <Text style={[rocket.text.body, { textAlign: 'center', marginBottom: 30, }]}>{'Enter your registered email address below to receive your password reset code'}</Text>
        <EmailInput val={user} setEmail={setUser} autoFocus={!auth.requiresReset} inputAccessoryViewID='submit' />
      </SafeAreaView>

      {renderFooter()}
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
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
  },
})

export default ForgotScreen