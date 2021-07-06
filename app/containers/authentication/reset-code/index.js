import React, { useState, useEffect, useContext } from 'react'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import Mixpanel from 'react-native-mixpanel'
import _ from 'lodash'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import { textStyles } from 'app/styles/text'
import rocket from 'app/styles/rocket'
import { resendVerification } from 'app/utils/context/auth'

import { AuthContext } from 'app/utils/context/auth'
import { AuthActions } from 'app/hooks/useAuth'

import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'


const ResetCodeScreen = () => {
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(false)
  const [verifyError, setVerifyError] = useState(null)
  const [showJunkReminder, setShowJunkReminder] = useState(false)

  const { auth } = useContext(AuthContext)
  const user = useNavigationParam('username')

  useEffect(() => {
    Mixpanel.track('Open Password Reset Code Screen')
  }, [])

  const onCodeComplete = async (code) => {
    navigate('Password', { username: user, code: code })
  }

  const resendCode = async () => {
    setShowJunkReminder(true)
    await resendVerification(user, setVerifyError, setLoading)
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{'Password Reset Code'}</Text>
        <Text style={[rocket.text.body, { textAlign: 'center' }]}>{'Please enter the password reset code sent to '}</Text>
        <Text style={[rocket.text.body, { textAlign: 'center', fontWeight: 'bold' }]}>{user}</Text>

        <OTPInputView
          pinCount={6}
          onCodeFilled={onCodeComplete}
          style={styles.codeInput}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted} />

        {loading &&
          <ActivityIndicator size='small' color={rocket.colours.dark} />
        }
        {!loading &&
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

export default ResetCodeScreen