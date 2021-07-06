import React from 'react'

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  InputAccessoryView,
  TouchableOpacity
} from 'react-native'

import Title from 'app/components/text/screen-title'
import { textStyles } from 'app/styles/text'
import FooterButton from 'app/components/buttons/footer'
import LoadingFooter from 'app/components/loading/footer'
import { useStore } from 'app/store'
import { useApi } from 'app/api'
import jwt_decode from 'jwt-decode'
import { useNavigation } from 'react-navigation-hooks';
import { EVENT_RETURNINGUSER } from '../../constants';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const SignInView = () => {

  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [loginError, setLoginError] = React.useState(false)
  const store = useStore()
  const api = useApi()
  const { dismiss, goBack } = useNavigation()


  React.useEffect(() => {
    setButtonDisabled(email == '' || password.length < 8)
  }, [email, password])

  const onPressSignUp = () => {
    goBack()
  }

  const didPressSignIn = async () => {
    setIsLoading(true)
    setLoginError(false)
    const auth = await api.login(email, password).catch(error => {
      console.log('Error signing in ', error)
      setIsLoading(false)
      setLoginError(true)
    })
    if (auth) {
      store.authenticate({
        ...auth.data,
        decoded: jwt_decode(auth.data.token)
      })
      setIsLoading(store.state.auth.token == '')
      goBack()

    }
  }

  const renderFooter = () => {
    return isLoading ? <LoadingFooter /> : <FooterButton disabled={buttonDisabled} onPress={didPressSignIn} title='Sign In' />
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleContainer}>
          <Title title='Sign In' />
        </Text>
        <View>
          <Text style={[textStyles.body, { marginBottom: 4 }]}>Already created an account?</Text>
          <Text style={textStyles.body}>Use your email address and password to sign in</Text>
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
          <View style={styles.inner}  >

            <View style={styles.inputContainer}>
              <TextInput
                value={email}
                autoFocus={false}
                autoCorrect={false}
                autoCapitalize='none'
                onChangeText={setEmail}
                keyboardType='email-address'
                placeholder="Email Address"
                placeholderTextColor='#c7c7c7'
                style={styles.input}
                inputAccessoryViewID='sign-in' />
              <TextInput
                value={password}
                autoCorrect={false}
                clearButtonMode='always'
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholderTextColor='#c7c7c7'
                placeholder="Password"
                style={[styles.input, { marginBottom: 8 }]}
                inputAccessoryViewID='sign-in' />
              {loginError && <Text style={[textStyles.h6, { marginLeft: 8, color: 'red' }]}>Please check your details and try again</Text>}
            </View>

            {/* 
            * Needed to make keyboard behave properly. Fills space at the bottom of the screen when we use flex-end for the container 
           */}
            <View style={{ flex: 1, marginBottom: 20 }} />
          </View>

          <InputAccessoryView nativeID="sign-in">
            {renderFooter()}
          </InputAccessoryView>
        </KeyboardAvoidingView>
      </SafeAreaView >
      <View style={styles.signInContainer}>
        <TouchableOpacity onPress={onPressSignUp} style={styles.signInbutton} >
          <Text style={textStyles.headerButtonTitle}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
  },
  inner: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  titleContainer: {
    marginTop: 36,
    width: 172,
    marginBottom: 12, 
  },
  input: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    height: 44,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    alignSelf: 'stretch',
    color: 'black'
  },
  inputContainer: {
    marginVertical: 24,
  },
  signInContainer: {
    position: 'absolute',
    height: 55,
    width: 72,
    right: 10,
    ...ifIphoneX({
      top: 40,
    }, {
        top: 20,
      })
  },
  signInbutton: {
    flex: 1,
    justifyContent: 'center',
  }
})

export default SignInView