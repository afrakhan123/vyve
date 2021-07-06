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

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { EVENT_ONBOARDING_NEWCUSTOMERFLOW, EVENT_ONBOARDING_NEWCUSTOMEREMAIL, EVENT_ONBOARDING_ADDPASSWORD } from '../../../constants';


const SignUpView = () => {

  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const store = useStore()
  const api = useApi()
  const { navigate } = useNavigation()


  React.useEffect(() => {
    setButtonDisabled(email == '' || password.length < 8)
  }, [email, password])


  const onPressSignIn = () => {
    navigate('Sign')
  }

  const didPressSignUp = async () => {
    setIsLoading(true)
    const user = await api.createUser(email, password)
    const auth = await api.login(email, password)

    if (user) {
      store.createUser(user.data)
    }

    if (auth) {
      store.authenticate({
        ...auth.data,
        decoded: jwt_decode(auth.data.token)
      })
    }

    setIsLoading(store.state.auth.token == '')
  }

  const renderFooter = () => {
    return isLoading ? <LoadingFooter /> : <FooterButton disabled={buttonDisabled} onPress={didPressSignUp} title='Sign Up' />
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleContainer}>
          <Title title='Welcome to VYVE' />
        </Text>
        <View>
          <Text style={textStyles.body}>Sign up to track, reduce and offset your travel carbon footprint.</Text>
          {/* <Text style={[textStyles.h5, { marginTop: 20 }]}>Sign Up</Text> */}
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
          <View style={styles.inner}  >
            
            <View style={styles.inputContainer}>
              <TextInput
                value={email}
                autoFocus={true}
                autoCorrect={false}
                autoCapitalize='none'
                onChangeText={setEmail}
                keyboardType='email-address'
                placeholder="Email Address"
                placeholderTextColor='#c7c7c7'
                style={styles.input}
                inputAccessoryViewID='sign-up' />
              <TextInput
                value={password}
                autoCorrect={false}
                clearButtonMode='always'
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholderTextColor='#c7c7c7'
                placeholder="Create a password"
                style={[styles.input, { marginBottom: 8 }]}
                inputAccessoryViewID='sign-up' />
              {buttonDisabled && <Text style={[textStyles.h6, { marginLeft: 8 }]}>Min 8 characters</Text>}
            </View>

            {/* 
            * Needed to make keyboard behave properly. Fills space at the bottom of the screen when we use flex-end for the container 
           */}
            <View style={{ flex: 1, marginBottom: 20 }} />
          </View>

          <InputAccessoryView nativeID="sign-up">
            {renderFooter()}
          </InputAccessoryView>
        </KeyboardAvoidingView>
      </SafeAreaView >
      <View style={styles.signInContainer}>
        <TouchableOpacity onPress={onPressSignIn} style={styles.signInbutton} >
          <Text style={textStyles.headerButtonTitle}>Sign In</Text>
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
    width: 172,
    marginTop: 36,
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
    marginTop: 20,
  },
  signInContainer: {
    position: 'absolute',
    height: 55,
    width: 72,
    right: 0,
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

export default SignUpView
